from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Trip, User
from app.schemas.ai import (
    AIPlanTripRequest,
    AIReplanRequest,
    AIChatRequest,
    AIResponse,
    AIChatResponse,
)
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI"])


def _owned_trip(db: Session, user: User, trip_id: str) -> Trip:
    trip = db.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    if trip.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not have access to this trip.")
    return trip


@router.post("/plan-trip", response_model=AIResponse)
def ai_plan_trip(
    payload: AIPlanTripRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AIService(db)
    itinerary = service.plan_trip(
        destination=payload.destination,
        start_date=payload.start_date,
        end_date=payload.end_date,
        budget=payload.budget,
        moods=payload.moods,
        interests=payload.interests,
        preferences={**payload.preferences, "travel_style": payload.travel_style},
    )
    return AIResponse(
        success=True,
        trip={
            "destination": payload.destination,
            "start_date": payload.start_date,
            "end_date": payload.end_date,
            "budget": payload.budget,
            "currency": payload.currency,
            "total_days": len(itinerary["days"]),
            "days": itinerary["days"],
        },
        explanation=itinerary.get("explanation"),
        used_fallback=itinerary.get("used_fallback", False),
        provider=itinerary.get("provider"),
    )


@router.post("/replan-trip", response_model=AIResponse)
def ai_replan_trip(
    payload: AIReplanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = _owned_trip(db, current_user, payload.trip_id)
    service = AIService(db)
    itinerary = service.replan_trip(trip, payload.instruction, payload.preferences)
    return AIResponse(
        success=True,
        trip={
            "id": trip.id,
            "destination": trip.destination,
            "start_date": trip.start_date,
            "end_date": trip.end_date,
            "budget": trip.budget,
            "total_days": len(itinerary["days"]),
            "days": itinerary["days"],
        },
        explanation=itinerary.get("explanation"),
        used_fallback=itinerary.get("used_fallback", False),
        provider=itinerary.get("provider"),
    )


@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    payload: AIChatRequest,
    db: Session = Depends(get_db),
):
    trip = None
    if payload.trip_id:
        trip = db.get(Trip, payload.trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found.")
    service = AIService(db)
    result = service.chat(payload.message, trip, payload.context)
    return AIChatResponse(
        success=True,
        reply=result["reply"],
        actions=result["actions"],
        trip=result["trip"],
        used_fallback=result["used_fallback"],
        provider=result["provider"],
    )