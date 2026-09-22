import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional

from sqlalchemy.orm import Session

from app.models import ConciergeRequest, Local, User

logger = logging.getLogger(__name__)

# Ordered lifecycle for concierge requests (admin can assign any stage).
STATUS_FLOW = [
    "REQUEST_RECEIVED",
    "UNDER_REVIEW",
    "LOCAL_ASSIGNED",
    "AWAITING_CONFIRMATION",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
]
CANCELLED_STATUS = "CANCELLED"

SENDER_HINTS = {
    "REQUEST_RECEIVED": "System",
    "UNDER_REVIEW": "PlanRupee Concierge",
    "LOCAL_ASSIGNED": "Local Partner",
    "AWAITING_CONFIRMATION": "PlanRupee Concierge",
    "CONFIRMED": "PlanRupee Concierge",
    "IN_PROGRESS": "Local Partner",
    "COMPLETED": "System",
}

STATUS_NOTES = {
    "REQUEST_RECEIVED": "Concierge request logged and validated by the PlanRupee dispatch desk.",
    "UNDER_REVIEW": "A senior concierge operator is reviewing your request with ground partners.",
    "LOCAL_ASSIGNED": "A verified local expert has been assigned to execute this request.",
    "AWAITING_CONFIRMATION": "Waiting for your confirmation before locking the reservation.",
    "CONFIRMED": "Reservations & arrangements confirmed with the private host.",
    "IN_PROGRESS": "Your experience is being delivered on ground right now.",
    "COMPLETED": "Experience delivered successfully. Welcome to PlanRupee.",
    "CANCELLED": "This concierge request was cancelled.",
}


class ConciergeError(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


class ConciergeService:
    def __init__(self, db: Session) -> None:
        self.db = db

    @staticmethod
    def _new_update(status: str, sender: Optional[str], note: Optional[str]) -> Dict[str, str]:
        now = datetime.now(timezone.utc)
        return {
            "timestamp": now.strftime("%H:%M %p"),
            "stage": status,
            "sender": sender or SENDER_HINTS.get(status, "System"),
            "note": note or STATUS_NOTES.get(status, ""),
        }

    def create_request(self, *, user: User, category: str, request_text: str, destination: str,
                       timing: str = "Tonight", preferred_date: Optional[str] = None,
                       budget: Optional[str] = None, travelers: str = "2",
                       contact_name: str, contact_phone: str) -> ConciergeRequest:
        cr = ConciergeRequest(
            user_id=user.id,
            category=category,
            request=request_text,
            destination=destination,
            timing=timing,
            preferred_date=preferred_date,
            budget=budget,
            travelers=travelers,
            contact_name=contact_name,
            contact_phone=contact_phone,
            status="REQUEST_RECEIVED",
            updates=[self._new_update("REQUEST_RECEIVED", "System", None)],
        )
        self.db.add(cr)
        self.db.commit()
        self.db.refresh(cr)
        return cr

    def update_status(self, request_id: str, status: str, *, assigned_local_id: Optional[str] = None,
                      note: Optional[str] = None, sender: Optional[str] = None,
                      actor: Optional[User] = None) -> ConciergeRequest:
        cr = self.db.get(ConciergeRequest, request_id)
        if not cr:
            raise ConciergeError("CONCIERGE_NOT_FOUND", "Concierge request not found.")

        if status not in STATUS_FLOW and status != CANCELLED_STATUS:
            raise ConciergeError("INVALID_STATUS", f"Status must be one of {STATUS_FLOW}.")

        if assigned_local_id and assigned_local_id != cr.assigned_local_id:
            local = self.db.get(Local, assigned_local_id)
            if not local:
                raise ConciergeError("LOCAL_NOT_FOUND", "Assigned local expert not found.")
            cr.assigned_local_id = assigned_local_id

        # Enforce a sane forward progression for non-admin callers; admin actor may set any.
        if actor is None or actor.role != "admin":
            if status != CANCELLED_STATUS:
                current_idx = STATUS_FLOW.index(cr.status) if cr.status in STATUS_FLOW else -1
                new_idx = STATUS_FLOW.index(status) if status in STATUS_FLOW else -1
                if new_idx < current_idx:
                    raise ConciergeError("INVALID_TRANSITION", "Status cannot move backwards.")

        cr.status = status
        updates = list(cr.updates or [])
        updates.append(self._new_update(status, sender, note))
        cr.updates = updates
        self.db.commit()
        self.db.refresh(cr)
        return cr

    @staticmethod
    def public_status_for(item: ConciergeRequest) -> dict:
        return {
            "id": item.id,
            "status": item.status,
            "updates": item.updates,
            "updated_at": item.updated_at,
        }