import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, Text, Float, Boolean, DateTime, ForeignKey, CheckConstraint, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    place_id: Mapped[Optional[str]] = mapped_column(String(60), ForeignKey("places.id", ondelete="CASCADE"), nullable=True, index=True)
    local_id: Mapped[Optional[str]] = mapped_column(String(60), ForeignKey("locals.id", ondelete="CASCADE"), nullable=True, index=True)
    
    author_name: Mapped[str] = mapped_column(String(120), nullable=False)
    author_location: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    ratings_breakdown: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "(place_id IS NOT NULL AND local_id IS NULL) OR (place_id IS NULL AND local_id IS NOT NULL)",
            name="check_review_target_exclusive"
        ),
    )

    # Relationships
    user = relationship("User", back_populates="reviews")
    place = relationship("Place", back_populates="reviews")
    local = relationship("Local", back_populates="reviews")
