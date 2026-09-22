from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.orm import Session, joinedload

from app.api.v1.deps import get_current_user, require_admin
from app.db.session import get_db
from app.models import ConciergeRequest, Local, User
from app.schemas.concierge import (
    ConciergeRequestCreate,
    ConciergeStatusUpdate,
    ConciergeResponse,
)
from app.services.concierge_service import ConciergeService, ConciergeError
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/concierge", tags=["Concierge"])


def _hydrate(item: ConciergeRequest) -> ConciergeResponse:
    response = ConciergeResponse.model_validate(item)
    if item.assigned_local:
        response.assigned_local_name = item.assigned_local.name
    return response


@router.post("", response_model=ConciergeResponse, status_code=status.HTTP_201_CREATED)
def create_concierge_request(
    payload: ConciergeRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = ConciergeService(db)
    item = service.create_request(
        user=current_user,
        category=payload.category,
        request_text=payload.request,
        destination=payload.destination,
        timing=payload.timing,
        preferred_date=payload.preferred_date,
        budget=payload.budget,
        travelers=payload.travelers,
        contact_name=payload.contact_name,
        contact_phone=payload.contact_phone,
    )
    return _hydrate(item)


@router.get("", response_model=List[ConciergeResponse])
def list_concierge_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = (
        select(ConciergeRequest)
        .options(joinedload(ConciergeRequest.assigned_local))
        .order_by(ConciergeRequest.created_at.desc())
    )
    if current_user.role == "admin":
        pass
    elif current_user.role == "local":
        local = db.scalars(select(Local).where(Local.user_id == current_user.id)).first()
        if not local:
            return []
        stmt = stmt.where(or_(ConciergeRequest.user_id == current_user.id, ConciergeRequest.assigned_local_id == local.id))
    else:
        stmt = stmt.where(ConciergeRequest.user_id == current_user.id)
    items = db.scalars(stmt).unique().all()
    return [_hydrate(i) for i in items]


@router.get("/{concierge_id}", response_model=ConciergeResponse)
def get_concierge_request(
    concierge_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.scalars(
        select(ConciergeRequest)
        .options(joinedload(ConciergeRequest.assigned_local))
        .where(ConciergeRequest.id == concierge_id)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Concierge request not found.")
    is_owner = item.user_id == current_user.id
    is_assignee = item.assigned_local_id and (item.assigned_local.user_id == current_user.id)
    if not (is_owner or is_assignee or current_user.role == "admin"):
        raise HTTPException(status_code=403, detail="You do not have access to this request.")
    return _hydrate(item)


@router.put("/{concierge_id}/status", response_model=ConciergeResponse)
def update_concierge_status(
    concierge_id: str,
    payload: ConciergeStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.get(ConciergeRequest, concierge_id)
    if not item:
        raise HTTPException(status_code=404, detail="Concierge request not found.")

    is_owner = item.user_id == current_user.id
    is_admin = current_user.role == "admin"
    is_assignee = bool(
        item.assigned_local_id
        and (local := db.get(Local, item.assigned_local_id))
        and local.user_id == current_user.id
    )
    if not (is_owner or is_admin or is_assignee):
        raise HTTPException(status_code=403, detail="You do not have access to this request.")

    # Travelers may only cancel their own open requests.
    if is_owner and not is_admin and payload.status != "CANCELLED":
        raise HTTPException(status_code=403, detail="Only a concierge operator can move this request forward.")

    service = ConciergeService(db)
    try:
        updated = service.update_status(
            concierge_id,
            payload.status,
            assigned_local_id=payload.assigned_local_id,
            note=payload.note,
            sender=payload.sender,
            actor=current_user if is_admin or is_assignee else None,
        )
    except ConciergeError as err:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=err.message)

    NotificationService().concierge_update(item.user.email if item.user else "", updated.status, item.request[:140])
    return _hydrate(updated)