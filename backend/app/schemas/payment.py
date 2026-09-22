from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class PaymentOrderRequest(BaseModel):
    booking_id: str = Field(..., min_length=1)
    amount: Optional[int] = Field(None, ge=1)
    notes: Dict[str, Any] = Field(default_factory=dict)


class PaymentOrderResponse(BaseModel):
    booking_id: str
    order_id: str
    amount: int
    currency: str
    key_id: str
    provider: str


class PaymentVerification(BaseModel):
    """Server-side verification result of a Razorpay signature."""

    valid: bool
    booking_id: Optional[str] = None
    payment_id: Optional[str] = None
    order_id: Optional[str] = None
    amount: Optional[int] = None
    currency: Optional[str] = None