from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func, or_
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user, require_admin
from app.core.config import settings
from app.db.session import get_db
from app.models import Place, Review, User
from app.schemas.place import PlaceCreate, PlaceUpdate, PlaceResponse, PlaceListParams
from app.schemas.review import ReviewResponse

router = APIRouter(prefix="/places", tags=["Places"])


@router.get("/{place_id}/reviews", response_model=List[ReviewResponse])
def list_place_reviews(place_id: str, db: Session = Depends(get_db)):
    if not db.get(Place, place_id):
        raise HTTPException(status_code=404, detail="Place not found.")
    return db.scalars(select(Review).where(Review.place_id == place_id).order_by(Review.created_at.desc())).all()


@router.get("", response_model=List[PlaceResponse])
def list_places(
    city: Optional[str] = None,
    category: Optional[str] = None,
    budget: Optional[int] = None,
    min_rating: Optional[float] = None,
    max_price: Optional[int] = None,
    best_time: Optional[str] = None,
    duration_max: Optional[int] = None,
    recommendation_type: Optional[str] = None,
    q: Optional[str] = None,
    sort_by: Optional[str] = Query(None, pattern="^(recommended|rating|price|distance)$"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    stmt = select(Place).where(Place.verification_status != "unverified")

    if city:
        stmt = stmt.where(Place.city.ilike(city))
    if category:
        stmt = stmt.where(Place.category.ilike(category))
    if min_rating is not None:
        stmt = stmt.where(Place.rating >= min_rating)
    if max_price is not None:
        stmt = stmt.where(Place.estimated_cost <= max_price)
    if best_time:
        stmt = stmt.where(Place.best_time.ilike(best_time))
    if duration_max is not None:
        stmt = stmt.where(Place.duration_minutes <= duration_max)
    if recommendation_type:
        stmt = stmt.where(
            or_(Place.category.ilike(recommendation_type), Place.tags.contains([recommendation_type]))
        )
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(or_(Place.name.ilike(pattern), Place.description.ilike(pattern), Place.address.ilike(pattern)))

    if sort_by == "rating":
        stmt = stmt.order_by(Place.rating.desc(), Place.review_count.desc())
    elif sort_by == "price":
        stmt = stmt.order_by(Place.estimated_cost.asc())
    elif sort_by == "distance":
        stmt = stmt.order_by(Place.latitude.is_(None), Place.name)
    else:  # recommended
        stmt = stmt.order_by(Place.rating.desc(), Place.review_count.desc())

    stmt = stmt.offset(offset).limit(limit)
    return db.scalars(stmt).all()


@router.get("/{place_id}", response_model=PlaceResponse)
def get_place(place_id: str, db: Session = Depends(get_db)):
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found.")
    return place


@router.post("", response_model=PlaceResponse, status_code=status.HTTP_201_CREATED)
def create_place(
    payload: PlaceCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    place = Place(**payload.model_dump())
    db.add(place)
    db.commit()
    db.refresh(place)
    return place


@router.put("/{place_id}", response_model=PlaceResponse)
def update_place(
    place_id: str,
    payload: PlaceUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found.")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(place, key, value)
    db.commit()
    db.refresh(place)
    return place


@router.delete("/{place_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_place(
    place_id: str,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    place = db.get(Place, place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found.")
    db.delete(place)
    db.commit()