from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.v1.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models import Booking, User
from app.schemas.payment import PaymentOrderRequest, PaymentOrderResponse, PaymentVerification
from app.services.notification_service import NotificationService
from app.services.payment_service import PaymentError, PaymentService, payment_service

router = APIRouter(prefix="/payments", tags=["Payments"])


class WebhookPayload(BaseModel):
    event: str
    payload: dict


def _owned_booking(db: Session, user: User, booking_id: str) -> Booking:
    booking = db.scalars(
        select(Booking).options(joinedload(Booking.local)).where(Booking.id == booking_id)
    ).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    if booking.traveler_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="This booking does not belong to you.")
    return booking


@router.post("/order", response_model=PaymentOrderResponse)
def create_payment_order(
    payload: PaymentOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = _owned_booking(db, current_user, payload.booking_id)
    try:
        order = payment_service.create_order(booking, payload.amount)
    except PaymentError as err:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT if err.code in ("ALREADY_PAID", "BOOKING_CANCELLED") else status.HTTP_400_BAD_REQUEST,
            detail=err.message,
        )
    return PaymentOrderResponse(
        booking_id=booking.id,
        order_id=order["id"],
        amount=order["amount"],
        currency=order.get("currency", "INR"),
        key_id=settings.RAZORPAY_KEY_ID,
        provider="razorpay" if not payment_service.mock_mode else "mock",
    )


class ClientSignature(BaseModel):
    order_id: str
    payment_id: str
    signature: str
    booking_id: str


@router.post("/verify", response_model=PaymentVerification)
def verify_client_payment(
    payload: ClientSignature,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = _owned_booking(db, current_user, payload.booking_id)
    if payment_service.mock_mode and payload.signature == "mock":
        valid = True
    else:
        valid = payment_service.verify_signature(payload.order_id, payload.payment_id, payload.signature)
    if valid:
        booking.payment_status = "PAID"
        if booking.booking_status == "PENDING":
            booking.booking_status = "CONFIRMED"
        db.commit()
        NotificationService().payment_confirmed(current_user.email, booking.id)
    return PaymentVerification(
        valid=valid,
        booking_id=booking.id,
        payment_id=payload.payment_id,
        order_id=payload.order_id,
        amount=int(booking.fee or 0),
        currency="INR",
    )


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """Razorpay webhook. Verifies X-Razorpay-Signature over the raw body."""
    raw_body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    if not payment_service.verify_webhook(raw_body, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    data = PaymentWebhookWrapper.model_validate_json(raw_body)
    return _process_webhook(db, data)


class PaymentWebhookWrapper(BaseModel):
    event: Optional[str] = None
    payload: Optional[dict] = None


def _process_webhook(db: Session, data: PaymentWebhookWrapper) -> dict:
    event = data.event or ""
    if not data.payload:
        return {"received": True, "processed": False}
    entity = (data.payload.get("payment", {}) if isinstance(data.payload, dict) else {})
    notes = entity.get("notes", {}) if isinstance(entity, dict) else {}
    booking_id = notes.get("booking_id") if isinstance(notes, dict) else None
    processed = False
    if booking_id:
        booking = db.get(Booking, booking_id)
        if booking:
            booking.payment_status = "PAID"
            if booking.booking_status == "PENDING":
                booking.booking_status = "CONFIRMED"
            db.commit()
            processed = True
    return {"received": True, "event": event, "processed": processed}