from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ExpeditionResponse(BaseModel):
    id: int
    name: str
    description: str
    image: Optional[str]
    difficulty: str
    duration: int
    price: int
    
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    expedition_id: int
    participants: int = 1