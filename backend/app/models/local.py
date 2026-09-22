import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Local(Base):
    __tablename__ = "locals"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    city: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    why_choose_me: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    expertise: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    languages: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    consultation_fee: Mapped[int] = mapped_column(Integer, default=799, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=4.9, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    years_local: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    travelers_helped: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    verification_status: Mapped[str] = mapped_column(String(30), default="verified", index=True, nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    availability: Mapped[str] = mapped_column(String(200), default="Daily, 10:00 AM – 08:00 PM IST", nullable=False)
    instagram_handle: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    local_picks: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    reels: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    places_i_love_ids: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="local_profile")
    bookings = relationship("Booking", back_populates="local", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="local", cascade="all, delete-orphan")
    saved_by = relationship("SavedLocal", back_populates="local", cascade="all, delete-orphan")
