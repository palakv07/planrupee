from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.models import Local, Place, SavedLocal, SavedPlace, User

router = APIRouter(prefix="/saved", tags=["Saved"])


@router.post("/places/{place_id}", response_model=List[str], status_code=status.HTTP_201_CREATED)
def save_place(
    place_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not db.get(Place, place_id):
        raise HTTPException(status_code=404, detail="Place not found.")
    existing = db.scalar(
        select(SavedPlace).where(SavedPlace.user_id == current_user.id, SavedPlace.place_id == place_id)
    )
    if not existing:
        db.add(SavedPlace(user_id=current_user.id, place_id=place_id))
        db.commit()
    ids = db.scalars(select(SavedPlace.place_id).where(SavedPlace.user_id == current_user.id)).all()
    return list(ids)


@router.delete("/places/{place_id}", response_model=List[str])
def unsave_place(
    place_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    saved = db.scalar(
        select(SavedPlace).where(SavedPlace.user_id == current_user.id, SavedPlace.place_id == place_id)
    )
    if saved:
        db.delete(saved)
        db.commit()
    ids = db.scalars(select(SavedPlace.place_id).where(SavedPlace.user_id == current_user.id)).all()
    return list(ids)


@router.get("/places", response_model=List[str])
def my_saved_places(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list(db.scalars(select(SavedPlace.place_id).where(SavedPlace.user_id == current_user.id)).all())


@router.post("/locals/{local_id}", response_model=List[str], status_code=status.HTTP_201_CREATED)
def save_local(
    local_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not db.get(Local, local_id):
        raise HTTPException(status_code=404, detail="Local expert not found.")
    existing = db.scalar(
        select(SavedLocal).where(SavedLocal.user_id == current_user.id, SavedLocal.local_id == local_id)
    )
    if not existing:
        db.add(SavedLocal(user_id=current_user.id, local_id=local_id))
        db.commit()
    ids = db.scalars(select(SavedLocal.local_id).where(SavedLocal.user_id == current_user.id)).all()
    return list(ids)


@router.delete("/locals/{local_id}", response_model=List[str])
def unsave_local(
    local_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    saved = db.scalar(
        select(SavedLocal).where(SavedLocal.user_id == current_user.id, SavedLocal.local_id == local_id)
    )
    if saved:
        db.delete(saved)
        db.commit()
    ids = db.scalars(select(SavedLocal.local_id).where(SavedLocal.user_id == current_user.id)).all()
    return list(ids)


@router.get("/locals", response_model=List[str])
def my_saved_locals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list(db.scalars(select(SavedLocal.local_id).where(SavedLocal.user_id == current_user.id)).all())