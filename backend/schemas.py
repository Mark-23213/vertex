from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


# ---------- Expedition ----------

class ExpeditionCard(BaseModel):
    """Краткая карточка для каталога."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    region: Optional[str] = None
    country: Optional[str] = None
    altitude: Optional[int] = None
    duration_days: Optional[int] = None
    difficulty: Optional[str] = None
    price: Optional[int] = None
    currency: str = "₸"
    season: Optional[str] = None
    rating: float = 5.0
    success_rate: Optional[int] = None
    summary: Optional[str] = None
    image: str = ""
    gradient_from: str = "#0ea5e9"
    gradient_to: str = "#0b1220"


class ExpeditionDetail(ExpeditionCard):
    """Полные данные экспедиции."""
    description: Optional[list] = None
    highlights: Optional[list] = None
    itinerary: Optional[list] = None
    included: Optional[list] = None
    excluded: Optional[list] = None


# ---------- Booking ----------

class BookingCreate(BaseModel):
    expedition_id: str
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=3, max_length=160)
    phone: Optional[str] = Field(default="", max_length=40)
    people: int = Field(default=1, ge=1, le=30)
    message: Optional[str] = Field(default="", max_length=2000)


class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    expedition_id: str
    name: str
    email: str
    people: int
    created_at: datetime


class BookingMy(BaseModel):
    id: int
    expedition_id: str
    expedition_name: str
    people: int
    created_at: datetime


# ---------- Support ----------

class SupportCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=3, max_length=160)
    subject: Optional[str] = Field(default="", max_length=160)
    message: str = Field(min_length=5, max_length=4000)


# ---------- Auth ----------

class UserCreate(BaseModel):
    email: str = Field(min_length=3, max_length=160)
    name: str = Field(default="", max_length=120)
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: str = Field(min_length=3, max_length=160)
    password: str = Field(min_length=1, max_length=128)


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    phone: str = ""
    city: str = ""
    experience: str = ""
    about: str = ""


class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=40)
    city: Optional[str] = Field(default=None, max_length=120)
    experience: Optional[str] = Field(default=None, max_length=40)
    about: Optional[str] = Field(default=None, max_length=2000)


class PasswordChange(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
