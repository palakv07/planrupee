import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Text, Float, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    destination: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    tagline: Mapped[str] = mapped_column(String(300), default="", nullable=False)
    total_days: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    start_date: Mapped[str] = mapped_column(String(20), nullable=False)
    end_date: Mapped[str] = mapped_column(String(20), nullable=False)
    arrival_time: Mapped[str] = mapped_column(String(20), default="10:00", nullable=False)
    departure_time: Mapped[str] = mapped_column(String(20), default="18:00", nullable=False)
    travelers: Mapped[str] = mapped_column(String(20), default="2", nullable=False)
    budget: Mapped[str] = mapped_column(String(30), default="Moderate", nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    travel_style: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    preferences: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="active", index=True, nullable=False)  # 'active', 'archived'
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="trips")
    days = relationship("ItineraryDay", back_populates="trip", cascade="all, delete-orphan", order_by="ItineraryDay.day_number")


class ItineraryDay(Base):
    __tablename__ = "itinerary_days"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String(60), ForeignKey("trips.id", ondelete="CASCADE"), index=True, nullable=False)
    day_number: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[str] = mapped_column(String(30), default="", nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    subtitle: Mapped[str] = mapped_column(String(300), default="", nullable=False)

    # Relationships
    trip = relationship("Trip", back_populates="days")
    activities = relationship("Activity", back_populates="day", cascade="all, delete-orphan", order_by="Activity.order_index")


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    itinerary_day_id: Mapped[str] = mapped_column(String(60), ForeignKey("itinerary_days.id", ondelete="CASCADE"), index=True, nullable=False)
    place_id: Mapped[Optional[str]] = mapped_column(String(60), ForeignKey("places.id", ondelete="SET NULL"), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    time_slot: Mapped[str] = mapped_column(String(20), default="Morning", nullable=False)  # 'Morning', 'Afternoon', 'Evening', 'Dinner'
    start_time: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=90, nullable=False)
    estimated_cost: Mapped[int] = mapped_column(Integer, default=300, nullable=False)
    distance_km: Mapped[Optional[str]] = mapped_column(String(100), default="Starting point", nullable=True)
    recommendation_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    rating: Mapped[Optional[float]] = mapped_column(Float, default=4.5, nullable=True)
    review_count: Mapped[Optional[int]] = mapped_column(Integer, default=0, nullable=True)

    # Relationships
    day = relationship("ItineraryDay", back_populates="activities")
    place = relationship("Place", back_populates="activities")
