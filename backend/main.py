from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import os

from database import SessionLocal, Base, engine
from models import User, Expedition, Booking, Favorite, SupportMessage
from schemas import UserRegister, UserLogin, UserResponse, ExpeditionResponse, BookingCreate
from security import verify_password, get_password_hash, create_access_token, verify_token

# Создаём таблицы при старте
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vertex API")

# CORS
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DB Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Auth Dependency ---
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ==================== AUTH ====================

@app.post("/auth/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=data.email,
        name=data.name,
        password_hash=get_password_hash(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}

@app.post("/auth/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}

@app.get("/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "name": current_user.name,
            "phone": current_user.phone, "city": current_user.city, "experience": current_user.experience, "about": current_user.about}

@app.put("/auth/me")
def update_me(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for field in ["name", "phone", "city", "experience", "about"]:
        if field in data:
            setattr(current_user, field, data[field])
    db.commit()
    return {"ok": True}

# ==================== EXPEDITIONS ====================

@app.get("/expeditions")
def get_expeditions(db: Session = Depends(get_db)):
    return db.query(Expedition).all()

@app.get("/expeditions/{expedition_id}")
def get_expedition(expedition_id: str, db: Session = Depends(get_db)):
    exp = db.query(Expedition).filter(Expedition.id == expedition_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Not found")
    return exp

# ==================== BOOKINGS ====================

@app.post("/bookings")
def create_booking(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    booking = Booking(
        expedition_id=data.get("expedition_id"),
        user_id=current_user.id,
        name=data.get("name", current_user.name),
        email=data.get("email", current_user.email),
        phone=data.get("phone", ""),
        people=data.get("people", 1),
        message=data.get("message", ""),
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"ok": True, "id": booking.id}

@app.get("/bookings")
def get_my_bookings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Booking).filter(Booking.user_id == current_user.id).all()

# ==================== FAVORITES ====================

@app.get("/favorites")
def get_favorites(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    return [f.expedition_id for f in favs]

@app.post("/favorites/{expedition_id}")
def add_favorite(expedition_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.expedition_id == expedition_id).first()
    if existing:
        return {"ok": True}
    fav = Favorite(user_id=current_user.id, expedition_id=expedition_id)
    db.add(fav)
    db.commit()
    return {"ok": True}

@app.delete("/favorites/{expedition_id}")
def remove_favorite(expedition_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.expedition_id == expedition_id).delete()
    db.commit()
    return {"ok": True}

# ==================== SUPPORT ====================

@app.post("/support")
def send_support(data: dict, db: Session = Depends(get_db)):
    msg = SupportMessage(
        user_id=data.get("user_id"),
        name=data.get("name", ""),
        email=data.get("email", ""),
        subject=data.get("subject", ""),
        message=data.get("message", ""),
    )
    db.add(msg)
    db.commit()
    return {"ok": True}

# ==================== HEALTH ====================

@app.get("/")
def root():
    return {"status": "ok", "service": "Vertex API"}
