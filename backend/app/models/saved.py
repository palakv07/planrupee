import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class SavedPlace(Base):
    __tablename__ = "saved_places"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    place_id: Mapped[str] = mapped_column(String(60), ForeignKey("places.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "place_id", name="uq_user_saved_place"),
    )

    # Relationships
    user = relationship("User", back_populates="saved_places")
    place = relationship("Place", back_populates="saved_by")


class SavedLocal(Base):
    __tablename__ = "saved_locals"

    id: Mapped[str] = mapped_column(String(60), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    local_id: Mapped[str] = mapped_column(String(60), ForeignKey("locals.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "local_id", name="uq_user_saved_local"),
    )

    # Relationships
    user = relationship("User", back_populates="saved_locals")
    local = relationship("Local", back_populates="saved_by")
