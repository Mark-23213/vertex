from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bookings = relationship("Booking", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")

class Expedition(Base):
    __tablename__ = "expeditions"
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(Text)
    image = Column(String, nullable=True)
    difficulty = Column(String)
    duration = Column(Integer)
    price = Column(Integer)
    bookings = relationship("Booking", back_populates="expedition")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    expedition_id = Column(Integer, ForeignKey("expeditions.id"))
    participants = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="bookings")
    expedition = relationship("Expedition", back_populates="bookings")

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    expedition_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="favorites")

class Support(Base):
    __tablename__ = "support"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    message = Column(Text)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)