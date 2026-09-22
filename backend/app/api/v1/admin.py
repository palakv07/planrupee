from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.v1.deps import require_admin
from app.core.config import settings
from app.db.session import get_db
from app.models import (
    Booking, ConciergeRequest, Local, Place, Review, Trip, User,
)
from app.schemas.admin import AdminDashboardResponse, AdminPagedResponse, VerifyAction
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard", response_model=AdminDashboardResponse)
def admin_dashboard(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    users = db.scalar(select(func.count(User.id))) or 0
    travelers = db.scalar(select(func.count(User.id)).where(User.role == "traveler")) or 0
    locals_count = db.scalar(select(func.count(User.id)).where(User.role == "local")) or 0
    trips = db.scalar(select(func.count(Trip.id))) or 0
    places = db.scalar(select(func.count(Place.id))) or 0
    bookings = db.scalar(select(func.count(Booking.id))) or 0
    concierge = db.scalar(select(func.count(ConciergeRequest.id))) or 0
    pending_locals = (
        db.scalar(
            select(func.count(Local.id)).where(
                Local.verification_status == "PENDING_VERIFICATION", Local.verified.is_(False)
            )
        )
        or 0
    )
    pending_places = db.scalar(select(func.count(Place.id)).where(Place.verification_status == "unverified")) or 0
    reviews = db.scalar(select(func.count(Review.id))) or 0
    revenue = db.scalar(
        select(func.coalesce(func.sum(Booking.fee), 0)).where(Booking.payment_status == "PAID", Booking.booking_status != "CANCELLED")
    ) or 0
    recent = db.scalars(select(Booking).order_by(Booking.created_at.desc()).limit(5)).all()

    return AdminDashboardResponse(
        users=users,
        travelers=travelers,
        locals_count=locals_count,
        trips=trips,
        places=places,
        bookings=bookings,
        concierge_requests=concierge,
        pending_local_verifications=pending_locals,
        pending_place_verifications=pending_places,
        reviews=reviews,
        revenue=int(revenue),
        recent_bookings=[
            {"id": b.id, "local_id": b.local_id, "date": b.date, "start_time": b.start_time, "booking_status": b.booking_status, "fee": b.fee}
            for b in recent
        ],
    )


@router.get("/locals/pending", response_model=AdminPagedResponse)
def admin_pending_locals(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total = db.scalar(
        select(func.count(Local.id)).where(Local.verification_status == "PENDING_VERIFICATION")
    ) or 0
    items = db.scalars(
        select(Local).where(Local.verification_status == "PENDING_VERIFICATION").offset(offset).limit(limit)
    ).all()
    return AdminPagedResponse(items=[i for i in items], total=total, offset=offset, limit=limit)


@router.put("/locals/{local_id}/verify", response_model=dict)
def admin_verify_local(
    local_id: str,
    payload: VerifyAction,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    local = db.get(Local, local_id)
    if not local:
        raise HTTPException(status_code=404, detail="Local expert not found.")
    if payload.action == "approve":
        local.verified = True
        local.verification_status = "verified"
    else:
        local.verified = False
        local.verification_status = "rejected"
    db.commit()
    db.refresh(local)
    if local.user:
        NotificationService().local_verification(local.user.email, local.verification_status)
    return {"id": local.id, "verification_status": local.verification_status, "verified": local.verified}


@router.get("/places/pending", response_model=AdminPagedResponse)
def admin_pending_places(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total = db.scalar(select(func.count(Place.id)).where(Place.verification_status == "unverified")) or 0
    items = db.scalars(
        select(Place).where(Place.verification_status == "unverified").offset(offset).limit(limit)
    ).all()
    return AdminPagedResponse(items=[p for p in items], total=total, offset=offset, limit=limit)


@router.put("/places/{place_id}/verify", response_model=dict)
def admin_verify_place(
    place_id: str,
    payload: VerifyAction,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found.")
    if payload.action == "approve":
        place.verification_status = "verified"
    else:
        place.verification_status = "unverified"
    db.commit()
    db.refresh(place)
    return {"id": place.id, "verification_status": place.verification_status}


@router.get("/concierge", response_model=AdminPagedResponse)
def admin_concierge(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total = db.scalar(select(func.count(ConciergeRequest.id))) or 0
    items = db.scalars(
        select(ConciergeRequest).order_by(ConciergeRequest.created_at.desc()).offset(offset).limit(limit)
    ).all()
    return AdminPagedResponse(items=[i for i in items], total=total, offset=offset, limit=limit)


@router.get("/users", response_model=AdminPagedResponse)
def admin_users(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total = db.scalar(select(func.count(User.id))) or 0
    items = db.scalars(select(User).order_by(User.created_at.desc()).offset(offset).limit(limit)).all()
    return AdminPagedResponse(items=[i for i in items], total=total, offset=offset, limit=limit)


@router.get("/bookings", response_model=AdminPagedResponse)
def admin_bookings(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total = db.scalar(select(func.count(Booking.id))) or 0
    items = db.scalars(
        select(Booking).order_by(Booking.created_at.desc()).offset(offset).limit(limit)
    ).all()
    return AdminPagedResponse(
        items=[
            {
                "id": b.id, "traveler_id": b.traveler_id, "local_id": b.local_id, "date": b.date,
                "start_time": b.start_time, "fee": b.fee, "payment_status": b.payment_status,
                "booking_status": b.booking_status, "created_at": b.created_at,
            }
            for b in items
        ],
        total=total, offset=offset, limit=limit,
    )


@router.get("/reviews", response_model=AdminPagedResponse)
def admin_reviews(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total = db.scalar(select(func.count(Review.id))) or 0
    items = db.scalars(
        select(Review).order_by(Review.created_at.desc()).offset(offset).limit(limit)
    ).all()
    return AdminPagedResponse(items=[i for i in items], total=total, offset=offset, limit=limit)


class ModerateReview(BaseModel):
    verified: bool


@router.put("/reviews/{review_id}/moderate", response_model=dict)
def admin_moderate_review(
    review_id: str,
    payload: ModerateReview,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    review.verified = payload.verified
    db.commit()
    return {"id": review.id, "verified": review.verified}


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_review(
    review_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    db.delete(review)
    db.commit()