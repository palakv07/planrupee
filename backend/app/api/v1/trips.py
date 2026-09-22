from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Trip, User
from app.schemas.trip import TripCreate, TripUpdate, TripResponse
from app.services.ai_service import AIService
from app.services.trip_generator import assign_itinerary

router = APIRouter(prefix="/trips", tags=["Trips"])


def _get_owned_trip(db: Session, user: User, trip_id: str) -> Trip:
    trip = db.scalars(
        select(Trip)
        .options(
            joinedload(Trip.days).joinedload("*"),
        )
        .where(Trip.id == trip_id)
    ).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    if trip.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have access to this trip.")
    return trip


def _load_trip(db: Session, trip_id: str) -> Trip:
    trip = db.scalars(
        select(Trip).options(joinedload(Trip.days).joinedload("*")).where(Trip.id == trip_id)
    ).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    return trip


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(
    payload: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_days = payload.total_days
    if total_days is None:
        from app.services.trip_generator import compute_total_days
        total_days = compute_total_days(payload.start_date, payload.end_date)

    trip = Trip(
        user_id=current_user.id,
        destination=payload.destination,
        title=payload.title or f"{payload.destination} Getaway",
        tagline=payload.tagline or "Your personalized PlanRupee itinerary.",
        total_days=total_days,
        start_date=payload.start_date,
        end_date=payload.end_date,
        arrival_time=payload.arrival_time,
        departure_time=payload.departure_time,
        travelers=payload.travelers,
        budget=payload.budget,
        currency=payload.currency,
        travel_style=payload.travel_style,
        preferences=payload.preferences,
        status="active",
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.get("", response_model=List[TripResponse])
def list_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Trip)
        .options(joinedload(Trip.days).joinedload("*"))
        .where(Trip.user_id == current_user.id)
        .order_by(Trip.created_at.desc())
    )
    if current_user.role == "admin":
        stmt = select(Trip).options(joinedload(Trip.days).joinedload("*")).order_by(Trip.created_at.desc())
    return db.scalars(stmt).unique().all()


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _get_owned_trip(db, current_user, trip_id)


@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: str,
    payload: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = _get_owned_trip(db, current_user, trip_id)
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(trip, key, value)
    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = _get_owned_trip(db, current_user, trip_id)
    db.delete(trip)
    db.commit()


@router.post("/{trip_id}/generate", response_model=TripResponse)
def generate_itinerary_for_trip(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = _get_owned_trip(db, current_user, trip_id)
    service = AIService(db)
    preferences = trip.preferences or {}
    itinerary = service.plan_trip(
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        budget=trip.budget,
        moods=preferences.get("moods"),
        interests=preferences.get("interests"),
        preferences=preferences,
    )
    trip.tagline = itinerary.get("explanation") or trip.tagline
    assign_itinerary(db, trip, itinerary, replace=True)
    db.commit()
    return _load_trip(db, trip.id)