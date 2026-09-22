from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Booking, Local, Place, Review, User
from app.schemas.review import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])


def _recalculate_place(db: Session, place_id: str) -> None:
    place = db.get(Place, place_id)
    if not place:
        return
    rating, count = db.execute(
        select(func.avg(Review.rating), func.count(Review.id)).where(Review.place_id == place_id, Review.verified.is_(True))
    ).one()
    place.rating = round(float(rating or 4.5), 1)
    place.review_count = int(count or 0)
    db.commit()


def _recalculate_local(db: Session, local_id: str) -> None:
    local = db.get(Local, local_id)
    if not local:
        return
    rating, count = db.execute(
        select(func.avg(Review.rating), func.count(Review.id)).where(Review.local_id == local_id, Review.verified.is_(True))
    ).one()
    local.rating = round(float(rating or 4.9), 2)
    local.review_count = int(count or 0)
    db.commit()


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        payload.validate_target()
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    if payload.place_id:
        if not db.get(Place, payload.place_id):
            raise HTTPException(status_code=404, detail="Place not found.")
        existing = db.scalar(
            select(Review).where(Review.user_id == current_user.id, Review.place_id == payload.place_id)
        )
        if existing:
            raise HTTPException(status_code=409, detail="You have already reviewed this place.")
    if payload.local_id:
        if not db.get(Local, payload.local_id):
            raise HTTPException(status_code=404, detail="Local expert not found.")
        existing = db.scalar(
            select(Review).where(Review.user_id == current_user.id, Review.local_id == payload.local_id)
        )
        if existing:
            raise HTTPException(status_code=409, detail="You have already reviewed this local expert.")
        completed = db.scalar(
            select(Booking).where(
                Booking.traveler_id == current_user.id,
                Booking.local_id == payload.local_id,
                Booking.booking_status == "COMPLETED",
            )
        )
        if not completed:
            raise HTTPException(
                status_code=400,
                detail="Complete a consultation with this local before leaving a review.",
            )

    review = Review(
        user_id=current_user.id,
        place_id=payload.place_id,
        local_id=payload.local_id,
        author_name=current_user.name,
        author_location=payload.author_location,
        rating=payload.rating,
        comment=payload.comment,
        verified=True,
        ratings_breakdown=payload.ratings_breakdown or {},
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    if payload.place_id:
        _recalculate_place(db, payload.place_id)
    elif payload.local_id:
        _recalculate_local(db, payload.local_id)
    return review


@router.get("/place/{place_id}", response_model=List[ReviewResponse])
def list_place_reviews(place_id: str, db: Session = Depends(get_db)):
    if not db.get(Place, place_id):
        raise HTTPException(status_code=404, detail="Place not found.")
    return db.scalars(select(Review).where(Review.place_id == place_id).order_by(Review.created_at.desc())).all()


@router.get("/local/{local_id}", response_model=List[ReviewResponse])
def list_local_reviews(local_id: str, db: Session = Depends(get_db)):
    if not db.get(Local, local_id):
        raise HTTPException(status_code=404, detail="Local expert not found.")
    return db.scalars(select(Review).where(Review.local_id == local_id).order_by(Review.created_at.desc())).all()


@router.get("/my", response_model=List[ReviewResponse])
def my_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.scalars(select(Review).where(Review.user_id == current_user.id).order_by(Review.created_at.desc())).all()