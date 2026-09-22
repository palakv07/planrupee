import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class ConciergeRequest(Base):
    __tablename__ = "concierge_requests"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    request: Mapped[str] = mapped_column(Text, nullable=False)
    destination: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    timing: Mapped[str] = mapped_column(String(100), default="Tonight", nullable=False)
    preferred_date: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    budget: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    travelers: Mapped[str] = mapped_column(String(20), default="2", nullable=False)
    contact_name: Mapped[str] = mapped_column(String(120), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="REQUEST_RECEIVED", index=True, nullable=False)
    assigned_local_id: Mapped[Optional[str]] = mapped_column(String(60), ForeignKey("locals.id", ondelete="SET NULL"), nullable=True)
    updates: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = relationship("User", back_populates="concierge_requests")
    assigned_local = relationship("Local")
