from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Booking, Local, User
from app.schemas.booking import BookingCreate, BookingStatusUpdate, BookingResponse
from app.services.booking_service import BookingService, BookingError
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def _hydrate(booking: Booking) -> BookingResponse:
    response = BookingResponse.model_validate(booking)
    if booking.local:
        response.local_name = booking.local.name
        response.local_avatar = booking.local.avatar
        response.local_city = booking.local.city
    if booking.traveler:
        response.traveler_name = booking.traveler.name
    return response


def _can_manage(booking: Booking, user: User) -> bool:
    if user.role == "admin":
        return True
    if booking.traveler_id == user.id:
        return True
    # Local owner (or verified local whose profile this booking belongs to)
    local = booking.local
    return bool(local and local.user_id == user.id)


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = BookingService(db)
    try:
        booking = service.create_booking(
            traveler=current_user,
            local_id=payload.local_id,
            date=payload.date,
            start_time=payload.start_time,
            end_time=payload.end_time,
            travelers=payload.travelers,
            question=payload.question,
        )
    except BookingError as err:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT if err.code == "BOOKING_UNAVAILABLE" else status.HTTP_400_BAD_REQUEST,
            detail=err.message,
        )
    return _hydrate(booking)


@router.get("", response_model=List[BookingResponse])
def list_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Booking).options(joinedload(Booking.local), joinedload(Booking.traveler))
    if current_user.role == "admin":
        pass
    elif current_user.role == "local":
        local = db.scalars(select(Local).where(Local.user_id == current_user.id)).first()
        if not local:
            return []
        stmt = stmt.where(Booking.local_id == local.id)
    else:
        stmt = stmt.where(Booking.traveler_id == current_user.id)
    bookings = db.scalars(stmt.order_by(Booking.created_at.desc())).all()
    return [_hydrate(b) for b in bookings]


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.scalars(
        select(Booking).options(joinedload(Booking.local), joinedload(Booking.traveler)).where(Booking.id == booking_id)
    ).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    if not _can_manage(booking, current_user):
        raise HTTPException(status_code=403, detail="You do not have access to this booking.")
    return _hydrate(booking)


@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: str,
    payload: BookingStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.scalars(
        select(Booking).options(joinedload(Booking.local), joinedload(Booking.traveler)).where(Booking.id == booking_id)
    ).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    if not _can_manage(booking, current_user):
        raise HTTPException(status_code=403, detail="You do not have access to this booking.")

    service = BookingService(db)
    try:
        updated = service.update_status(booking_id, payload.status, payload.notes)
    except BookingError as err:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=err.message)

    if payload.status == "CONFIRMED" and booking.traveler:
        NotificationService().booking_confirmed(
            booking.traveler.email, booking.local.name if booking.local else "local expert",
            booking.date, booking.start_time,
        )
    return _hydrate(updated)