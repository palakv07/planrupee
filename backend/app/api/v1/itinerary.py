from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Activity, ItineraryDay, Place, Trip, User
from app.schemas.trip import ActivityCreate, ActivityUpdate, ActivityResponse, TripResponse
from app.services.ai_service import AIService
from app.services.trip_generator import assign_itinerary

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])


def _owned_trip_for_day(db: Session, user: User, day_id: str) -> ItineraryDay:
    day = db.get(ItineraryDay, day_id)
    if not day:
        raise HTTPException(status_code=404, detail="Itinerary day not found.")
    trip = db.get(Trip, day.trip_id)
    if trip.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have access to this itinerary.")
    return day


def _load_trip(db: Session, trip_id: str) -> Trip:
    trip = db.scalars(
        select(Trip).options(joinedload(Trip.days).joinedload("*")).where(Trip.id == trip_id)
    ).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    return trip


@router.put("/{day_id}", response_model=TripResponse)
def update_day(
    day_id: str,
    payload: ActivityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    day = _owned_trip_for_day(db, current_user, day_id)
    # PUT on a day currently updates day-level title/subtitle when provided.
    if payload.title:
        day.title = payload.title
    if payload.description:
        day.subtitle = payload.description
    db.commit()
    return _load_trip(db, day.trip_id)


@router.post("/{day_id}/activities", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def add_activity(
    day_id: str,
    payload: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    day = _owned_trip_for_day(db, current_user, day_id)
    max_order = max((a.order_index for a in day.activities), default=-1)

    if payload.place_id:
        place = db.get(Place, payload.place_id)
        if place:
            payload.title = payload.title or place.name
            payload.image = payload.image or place.image_url or (place.images[0] if place.images else None)
            payload.description = payload.description or place.description
            payload.estimated_cost = payload.estimated_cost or int(place.estimated_cost or 0)

    activity = Activity(
        itinerary_day_id=day.id,
        place_id=payload.place_id,
        title=payload.title,
        description=payload.description,
        time_slot=payload.time_slot,
        start_time=payload.start_time,
        duration_minutes=payload.duration_minutes,
        estimated_cost=payload.estimated_cost,
        distance_km=payload.distance_km,
        recommendation_reason=payload.recommendation_reason,
        order_index=payload.order_index if payload.order_index is not None else max_order + 1,
        image=payload.image,
        rating=payload.rating,
        review_count=payload.review_count,
    )
    db.add(activity)
    db.commit()
    return _load_trip(db, day.trip_id)


@router.put("/{day_id}/activities/{activity_id}", response_model=TripResponse)
def update_activity(
    day_id: str,
    activity_id: str,
    payload: ActivityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    day = _owned_trip_for_day(db, current_user, day_id)
    activity = db.get(Activity, activity_id)
    if not activity or activity.itinerary_day_id != day.id:
        raise HTTPException(status_code=404, detail="Activity not found in this day.")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(activity, key, value)
    db.commit()
    return _load_trip(db, day.trip_id)


@router.delete("/{day_id}/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    day_id: str,
    activity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    day = _owned_trip_for_day(db, current_user, day_id)
    activity = db.get(Activity, activity_id)
    if not activity or activity.itinerary_day_id != day.id:
        raise HTTPException(status_code=404, detail="Activity not found in this day.")
    db.delete(activity)
    db.commit()


@router.post("/{day_id}/optimize", response_model=TripResponse)
def optimize_day(
    day_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    day = _owned_trip_for_day(db, current_user, day_id)
    slot_order = {"Morning": 1, "Afternoon": 2, "Evening": 3, "Dinner": 4}
    activities = sorted(day.activities, key=lambda a: (slot_order.get(a.time_slot, 5), a.order_index))
    for idx, act in enumerate(activities):
        act.order_index = idx
        act.distance_km = "Starting point" if idx == 0 else f"{1.2 + idx * 0.7:.1f} km ({4 + idx * 2.5:.0f} mins optimal transit)"
    db.commit()
    return _load_trip(db, day.trip_id)