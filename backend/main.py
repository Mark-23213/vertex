from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from config import settings
from database import Base, engine, get_db
from models import Booking, Expedition, Favorite, SupportMessage, User
from schemas import (
    BookingCreate,
    BookingMy,
    BookingRead,
    ExpeditionCard,
    ExpeditionDetail,
    PasswordChange,
    SupportCreate,
    Token,
    UserCreate,
    UserLogin,
    UserPublic,
    UserUpdate,
)
from security import (
    RateLimiter,
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from seed import seed_expeditions

Base.metadata.create_all(bind=engine)
seed_expeditions()

app = FastAPI(title="Vertex Expeditions API", docs_url=None, redoc_url=None)

# CORS — только доверенный фронтенд-домен, без "*".
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


# Security-заголовки на каждом ответе.
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# В проде не отдаём детали внутренних ошибок.
@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    if settings.ENV == "dev":
        raise exc
    return JSONResponse(status_code=500, content={"detail": "Внутренняя ошибка сервера"})


auth_limiter = RateLimiter(max_requests=12, window_seconds=300)      # 12 / 5 мин
booking_limiter = RateLimiter(max_requests=20, window_seconds=3600)  # 20 / час


def _normalize_email(email: str) -> str:
    return email.strip().lower()


# ---------- Auth (публичные) ----------

@app.post("/api/auth/register", response_model=Token)
def register(
    body: UserCreate,
    db: Session = Depends(get_db),
    _: None = Depends(auth_limiter),
):
    email = _normalize_email(body.email)
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=422, detail="Некорректный email")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="Пользователь с таким email уже существует")

    user = User(email=email, name=body.name.strip(), password_hash=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserPublic.model_validate(user))


@app.post("/api/auth/login", response_model=Token)
def login(
    body: UserLogin,
    db: Session = Depends(get_db),
    _: None = Depends(auth_limiter),
):
    email = _normalize_email(body.email)
    user = db.query(User).filter(User.email == email).first()
    # Один и тот же ответ, чтобы не раскрывать, существует ли email.
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    token = create_access_token(str(user.id))
    return Token(access_token=token, user=UserPublic.model_validate(user))


@app.get("/api/auth/me", response_model=UserPublic)
def me(current: User = Depends(get_current_user)):
    return UserPublic.model_validate(current)


@app.patch("/api/auth/me", response_model=UserPublic)
def update_me(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    data = body.model_dump(exclude_unset=True)
    for field in ("name", "phone", "city", "experience", "about"):
        if field in data and data[field] is not None:
            setattr(current, field, data[field].strip())
    db.commit()
    db.refresh(current)
    return UserPublic.model_validate(current)


@app.post("/api/auth/change-password")
def change_password(
    body: PasswordChange,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    _: None = Depends(auth_limiter),
):
    if not verify_password(body.current_password, current.password_hash):
        raise HTTPException(status_code=400, detail="Текущий пароль неверен")
    current.password_hash = hash_password(body.new_password)
    db.commit()
    return {"ok": True}


# ---------- Избранное (только для авторизованных) ----------

@app.get("/api/favorites/ids", response_model=list[str])
def favorite_ids(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    rows = db.query(Favorite.expedition_id).filter(Favorite.user_id == current.id).all()
    return [r[0] for r in rows]


@app.get("/api/favorites", response_model=list[ExpeditionCard])
def list_favorites(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    return (
        db.query(Expedition)
        .join(Favorite, Favorite.expedition_id == Expedition.id)
        .filter(Favorite.user_id == current.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )


@app.post("/api/favorites/{exp_id}", status_code=201)
def add_favorite(
    exp_id: str,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    if not db.query(Expedition).filter(Expedition.id == exp_id).first():
        raise HTTPException(status_code=404, detail="Экспедиция не найдена")
    exists = (
        db.query(Favorite)
        .filter(Favorite.user_id == current.id, Favorite.expedition_id == exp_id)
        .first()
    )
    if not exists:
        db.add(Favorite(user_id=current.id, expedition_id=exp_id))
        db.commit()
    return {"ok": True}


@app.delete("/api/favorites/{exp_id}")
def remove_favorite(
    exp_id: str,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    db.query(Favorite).filter(
        Favorite.user_id == current.id, Favorite.expedition_id == exp_id
    ).delete()
    db.commit()
    return {"ok": True}


# ---------- Экспедиции (только для авторизованных) ----------

@app.get("/api/expeditions", response_model=list[ExpeditionCard])
def list_expeditions(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(Expedition).all()


@app.get("/api/expeditions/{exp_id}", response_model=ExpeditionDetail)
def get_expedition(
    exp_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    exp = db.query(Expedition).filter(Expedition.id == exp_id).first()
    if exp is None:
        raise HTTPException(status_code=404, detail="Экспедиция не найдена")
    return exp


# ---------- Заявки (только для авторизованных) ----------

@app.post("/api/bookings", response_model=BookingRead, status_code=201)
def create_booking(
    body: BookingCreate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    _: None = Depends(booking_limiter),
):
    exp = db.query(Expedition).filter(Expedition.id == body.expedition_id).first()
    if exp is None:
        raise HTTPException(status_code=404, detail="Экспедиция не найдена")

    booking = Booking(
        expedition_id=body.expedition_id,
        user_id=current.id,
        name=body.name.strip(),
        email=_normalize_email(body.email),
        phone=(body.phone or "").strip(),
        people=body.people,
        message=(body.message or "").strip(),
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@app.get("/api/bookings/my", response_model=list[BookingMy])
def my_bookings(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    rows = (
        db.query(Booking, Expedition.name)
        .outerjoin(Expedition, Expedition.id == Booking.expedition_id)
        .filter(Booking.user_id == current.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [
        BookingMy(
            id=b.id,
            expedition_id=b.expedition_id,
            expedition_name=name or b.expedition_id,
            people=b.people,
            created_at=b.created_at,
        )
        for b, name in rows
    ]


# ---------- Поддержка (только для авторизованных) ----------

@app.post("/api/support", status_code=201)
def create_support_message(
    body: SupportCreate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
    _: None = Depends(booking_limiter),
):
    msg = SupportMessage(
        user_id=current.id,
        name=body.name.strip(),
        email=_normalize_email(body.email),
        subject=(body.subject or "").strip(),
        message=body.message.strip(),
    )
    db.add(msg)
    db.commit()
    return {"ok": True}


@app.get("/api/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
