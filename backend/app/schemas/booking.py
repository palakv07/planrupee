from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict

BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]
PAYMENT_STATUSES = ["PENDING", "PAID", "REFUNDED"]


class BookingCreate(BaseModel):
    local_id: str = Field(..., min_length=1)
    date: str = Field(..., min_length=1, max_length=30)
    start_time: str = Field(..., min_length=1, max_length=30)
    end_time: Optional[str] = Field(None, max_length=30)
    travelers: str = Field("2", max_length=20)
    question: str = Field("", max_length=2000)


class BookingStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(PENDING|CONFIRMED|CANCELLED|COMPLETED)$")
    notes: Optional[str] = Field(None, max_length=1000)


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    traveler_id: Optional[str] = None
    local_id: str
    date: str
    start_time: str
    end_time: Optional[str] = None
    travelers: str
    question: str
    fee: int
    payment_status: str
    booking_status: str
    notes: Optional[str] = None
    created_at: Any = None
    updated_at: Any = None
    local_name: Optional[str] = None
    local_avatar: Optional[str] = None
    local_city: Optional[str] = None
    traveler_name: Optional[str] = None


class AvailabilitySlot(BaseModel):
    date: str
    start_time: str
    end_time: Optional[str] = None
    available: bool
    reason: Optional[str] = None


class BookingAnalytics(BaseModel):
    total_bookings: int
    confirmed_bookings: int
    pending_bookings: int
    cancelled_bookings: int
    completed_bookings: int
    total_earnings: int