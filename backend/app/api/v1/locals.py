from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user, require_admin
from app.db.session import get_db
from app.models import Local, Review, User
from app.schemas.local import LocalProfileCreate, LocalProfileUpdate, LocalResponse, LocalListParams
from app.schemas.review import ReviewResponse
from app.services.booking_service import BookingService

router = APIRouter(prefix="/locals", tags=["Locals"])


@router.get("/{local_id}/reviews", response_model=List[ReviewResponse])
def list_local_reviews(local_id: str, db: Session = Depends(get_db)):
    if not db.get(Local, local_id):
        raise HTTPException(status_code=404, detail="Local expert not found.")
    return db.scalars(select(Review).where(Review.local_id == local_id).order_by(Review.created_at.desc())).all()


def _get_local_for_user(db: Session, user: User) -> Local:
    local = db.scalars(select(Local).where(Local.user_id == user.id)).first()
    if not local:
        raise HTTPException(status_code=404, detail="Local profile not found.")
    return local


@router.get("", response_model=List[LocalResponse])
def list_locals(
    city: Optional[str] = None,
    expertise: Optional[str] = None,
    language: Optional[str] = None,
    max_price: Optional[int] = None,
    min_rating: Optional[float] = None,
    search: Optional[str] = None,
    verified_only: bool = True,
    sort_by: Optional[str] = Query(None, pattern="^(rating|price|reviews)$"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    stmt = select(Local)
    if verified_only:
        stmt = stmt.where(Local.verification_status == "verified", Local.verified.is_(True))

    if city:
        stmt = stmt.where(Local.city.ilike(city))
    if expertise:
        stmt = stmt.where(Local.expertise.contains([expertise]))
    if language:
        stmt = stmt.where(Local.languages.contains([language]))
    if max_price is not None:
        stmt = stmt.where(Local.consultation_fee <= max_price)
    if min_rating is not None:
        stmt = stmt.where(Local.rating >= min_rating)
    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(or_(Local.name.ilike(pattern), Local.bio.ilike(pattern), Local.title.ilike(pattern)))

    if sort_by == "rating":
        stmt = stmt.order_by(Local.rating.desc())
    elif sort_by == "reviews":
        stmt = stmt.order_by(Local.review_count.desc())
    elif sort_by == "price":
        stmt = stmt.order_by(Local.consultation_fee.asc())

    stmt = stmt.offset(offset).limit(limit)
    return db.scalars(stmt).all()


@router.get("/{local_id}", response_model=LocalResponse)
def get_local(local_id: str, db: Session = Depends(get_db)):
    local = db.get(Local, local_id)
    if not local:
        raise HTTPException(status_code=404, detail="Local expert not found.")
    return local


@router.get("/{local_id}/availability")
def check_local_availability(
    local_id: str,
    date: str,
    times: str = "09:00,12:00,15:00,18:00",
    db: Session = Depends(get_db),
):
    local = db.get(Local, local_id)
    if not local:
        raise HTTPException(status_code=404, detail="Local expert not found.")
    slot_list = [t.strip() for t in times.split(",") if t.strip()]
    service = BookingService(db)
    return service.check_slots(local, date, slot_list)


@router.post("/profile", response_model=LocalResponse, status_code=status.HTTP_201_CREATED)
def create_local_profile(
    payload: LocalProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.scalars(select(Local).where(Local.user_id == current_user.id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a local profile.")
    local = Local(
        user_id=current_user.id,
        name=payload.name,
        city=payload.city,
        title=payload.title,
        avatar=payload.avatar,
        bio=payload.bio,
        why_choose_me=payload.why_choose_me,
        expertise=payload.expertise,
        languages=payload.languages,
        consultation_fee=payload.consultation_fee,
        years_local=payload.years_local,
        availability=payload.availability,
        instagram_handle=payload.instagram_handle,
        local_picks=payload.local_picks,
        reels=payload.reels,
        places_i_love_ids=payload.places_i_love_ids,
        verification_status="PENDING_VERIFICATION",
        verified=False,
    )
    db.add(local)
    db.commit()
    db.refresh(local)
    return local


@router.put("/profile", response_model=LocalResponse)
def update_local_profile(
    payload: LocalProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    local = _get_local_for_user(db, current_user)
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(local, key, value)
    db.commit()
    db.refresh(local)
    return local


@router.delete("/profile", status_code=status.HTTP_204_NO_CONTENT)
def delete_local_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    local = _get_local_for_user(db, current_user)
    db.delete(local)
    db.commit()


@router.get("/{local_id}/dashboard", response_model=dict)
def local_dashboard(
    local_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    local = db.get(Local, local_id)
    if not local:
        raise HTTPException(status_code=404, detail="Local expert not found.")
    if local.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your local profile.")
    stats = BookingService.local_stats(db, local.id)
    stats["profile_completion"] = _profile_completion(local)
    stats["verification_status"] = local.verification_status
    return stats


def _profile_completion(local: Local) -> int:
    fields = [local.avatar, local.bio, local.why_choose_me, local.expertise, local.languages, local.availability]
    filled = sum(1 for f in fields if f)
    total = len(fields)
    return round((filled / total) * 100)