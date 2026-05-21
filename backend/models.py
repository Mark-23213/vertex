from datetime import datetime

from sqlalchemy import Column, String, Integer, Float, Text, JSON, DateTime, UniqueConstraint

from database import Base


class Expedition(Base):
    __tablename__ = "expeditions"

    id = Column(String(50), primary_key=True)
    name = Column(String(120), nullable=False)
    region = Column(String(120))
    country = Column(String(120))
    altitude = Column(Integer)            # метры
    duration_days = Column(Integer)
    difficulty = Column(String(40))       # Начальный / Средний / Высокий / Экстремальный
    price = Column(Integer)
    currency = Column(String(8), default="₸")
    season = Column(String(80))
    rating = Column(Float, default=5.0)
    success_rate = Column(Integer)        # процент успешных восхождений

    summary = Column(String(300))
    description = Column(JSON)             # список абзацев
    highlights = Column(JSON)             # список строк
    itinerary = Column(JSON)              # [{day, title, text}]
    included = Column(JSON)
    excluded = Column(JSON)

    image = Column(String(400), default="")
    gradient_from = Column(String(16), default="#0ea5e9")
    gradient_to = Column(String(16), default="#0b1220")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    expedition_id = Column(String(50))
    user_id = Column(Integer)
    name = Column(String(120), nullable=False)
    email = Column(String(160), nullable=False)
    phone = Column(String(40))
    people = Column(Integer, default=1)
    message = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(160), unique=True, nullable=False, index=True)
    name = Column(String(120), default="")
    phone = Column(String(40), default="")
    city = Column(String(120), default="")
    experience = Column(String(40), default="")   # Новичок / Любитель / Опытный / Профи
    about = Column(Text, default="")
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, index=True, nullable=False)
    expedition_id = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("user_id", "expedition_id", name="uq_user_expedition"),)


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer)
    name = Column(String(120), nullable=False)
    email = Column(String(160), nullable=False)
    subject = Column(String(160), default="")
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
