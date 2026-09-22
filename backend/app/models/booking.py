import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    traveler_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    local_id: Mapped[str] = mapped_column(String(60), ForeignKey("locals.id", ondelete="CASCADE"), nullable=False, index=True)
    
    date: Mapped[str] = mapped_column(String(30), nullable=False)
    start_time: Mapped[str] = mapped_column(String(30), nullable=False)
    end_time: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    travelers: Mapped[str] = mapped_column(String(20), default="2", nullable=False)
    question: Mapped[str] = mapped_column(Text, default="", nullable=False)
    
    fee: Mapped[int] = mapped_column(Integer, default=799, nullable=False)
    payment_status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=False)  # 'PENDING', 'PAID', 'REFUNDED'
    booking_status: Mapped[str] = mapped_column(String(30), default="CONFIRMED", index=True, nullable=False)  # 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    traveler = relationship("User", back_populates="bookings")
    local = relationship("Local", back_populates="bookings")
