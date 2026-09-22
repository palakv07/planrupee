import logging
from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Booking, Local, User

logger = logging.getLogger(__name__)

BOOKING_STATUSES = {"PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"}
PAYMENT_STATUSES = {"PENDING", "PAID", "REFUNDED"}


def to_minutes(time_str: str) -> Optional[int]:
    """Convert 'HH:MM' (12 or 24 hour) strings to minutes since midnight."""
    try:
        if ":" not in time_str:
            return None
        hour, minute = time_str.strip().split(":")
        hour = int(hour)
        minute = int(minute)
        lower = time_str.strip().lower()
        if "pm" in lower and hour != 12:
            hour += 12
        if "am" in lower and hour == 12:
            hour = 0
        return hour * 60 + minute
    except (ValueError, TypeError):
        return None


class BookingError(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


class BookingService:
    """Encapsulates booking lifecycle rules and server-side availability."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def _existing_conflicts(self, local_id: str, date: str, start_time: str, end_time: Optional[str],
                            exclude_id: Optional[str] = None) -> List[Booking]:
        start_min = to_minutes(start_time)
        query = select(Booking).where(
            Booking.local_id == local_id,
            Booking.date == date,
            Booking.booking_status.in_(["PENDING", "CONFIRMED", "IN_PROGRESS"]),
        )
        if exclude_id:
            query = query.where(Booking.id != exclude_id)
        existing = list(self.db.scalars(query).all())
        if start_min is None:
            return []
        conflicts: List[Booking] = []
        for booking in existing:
            other_min = to_minutes(booking.start_time)
            if other_min is None:
                conflicts.append(booking)
                continue
            other_end = to_minutes(booking.end_time) if booking.end_time else other_min + 60
            new_end = (start_min + 60) if not end_time else (to_minutes(end_time) or start_min + 60)
            if start_min < other_end and other_min < new_end:
                conflicts.append(booking)
        return conflicts

    def create_booking(self, *, traveler: User, local_id: str, date: str, start_time: str,
                       end_time: Optional[str], travelers: str, question: str) -> Booking:
        local = self.db.get(Local, local_id)
        if not local:
            raise BookingError("LOCAL_NOT_FOUND", "Local expert not found.")
        if local.verification_status == "PENDING_VERIFICATION" or not local.verified:
            raise BookingError("LOCAL_NOT_AVAILABLE", "This local expert is not yet bookable.")
        if to_minutes(start_time) is None:
            raise BookingError("INVALID_TIME", "Please provide a valid start time like 10:00 or 10:00 AM.")

        conflicts = self._existing_conflicts(local_id, date, start_time, end_time)
        if conflicts:
            raise BookingError(
                "BOOKING_UNAVAILABLE",
                "This time slot is no longer available. Please choose another slot.",
            )

        fee = int(local.consultation_fee or 0)
        booking = Booking(
            traveler_id=traveler.id,
            local_id=local_id,
            date=date,
            start_time=start_time,
            end_time=end_time,
            travelers=travelers,
            question=question,
            fee=fee,
            payment_status="PENDING",
            booking_status="PENDING",
        )
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def update_status(self, booking_id: str, status: str, notes: Optional[str] = None) -> Booking:
        booking = self.db.get(Booking, booking_id)
        if not booking:
            raise BookingError("BOOKING_NOT_FOUND", "Booking not found.")
        if status not in BOOKING_STATUSES:
            raise BookingError("INVALID_STATUS", f"Status must be one of {sorted(BOOKING_STATUSES)}.")

        if booking.booking_status == status:
            raise BookingError("INVALID_TRANSITION", f"Booking is already {status}.")

        allowed_from = {
            "PENDING": {"CONFIRMED", "CANCELLED"},
            "CONFIRMED": {"COMPLETED", "CANCELLED"},
            "CANCELLED": set(),
            "COMPLETED": set(),
        }
        if status not in allowed_from.get(booking.booking_status, set()):
            raise BookingError(
                "INVALID_TRANSITION",
                f"Cannot move a booking from {booking.booking_status} to {status}.",
            )

        booking.booking_status = status
        if notes:
            booking.notes = notes
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def check_slots(self, local: Local, date: str, times: List[str]) -> List[dict]:
        busy = {b.start_time for b in self._existing_conflicts(local.id, date, "", None)}
        results = []
        for time_slot in times:
            candidate = self._existing_conflicts(local.id, date, time_slot, None)
            results.append({
                "time": time_slot,
                "available": not candidate,
                "reason": None if not candidate else "slot already booked",
            })
        return results

    @staticmethod
    def local_stats(db: Session, local_id: str) -> dict:
        bookings = list(db.scalars(select(Booking).where(Booking.local_id == local_id)).all())
        from collections import Counter
        by_status = Counter(b.booking_status for b in bookings)
        paid = [b for b in bookings if b.payment_status == "PAID" and b.booking_status != "CANCELLED"]
        earnings = sum(int(b.fee or 0) for b in paid)
        return {
            "total_bookings": len(bookings),
            "confirmed": by_status.get("CONFIRMED", 0),
            "pending": by_status.get("PENDING", 0),
            "completed": by_status.get("COMPLETED", 0),
            "cancelled": by_status.get("CANCELLED", 0),
            "earnings": earnings,
        }