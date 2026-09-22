import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Text, Float, Integer, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Place(Base):
    __tablename__ = "places"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    city: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    state: Mapped[str] = mapped_column(String(100), default="Punjab/UT", nullable=False)
    country: Mapped[str] = mapped_column(String(100), default="India", nullable=False)
    category: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    address: Mapped[str] = mapped_column(String(300), nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    images: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    opening_hours: Mapped[str] = mapped_column(String(100), default="10:00 AM – 08:00 PM", nullable=False)
    estimated_cost: Mapped[int] = mapped_column(Integer, default=300, nullable=False)
    price_level: Mapped[str] = mapped_column(String(10), default="₹₹", nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=4.5, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    best_time: Mapped[str] = mapped_column(String(100), default="Morning", nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=90, nullable=False)
    verification_status: Mapped[str] = mapped_column(String(30), default="verified", index=True, nullable=False)
    why_recommended: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    reviews = relationship("Review", back_populates="place", cascade="all, delete-orphan")
    saved_by = relationship("SavedPlace", back_populates="place", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="place")
