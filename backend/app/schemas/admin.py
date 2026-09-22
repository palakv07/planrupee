from typing import Optional, List, Any
from pydantic import BaseModel, Field


class AdminDashboardResponse(BaseModel):
    users: int = 0
    travelers: int = 0
    locals_count: int = 0
    trips: int = 0
    places: int = 0
    bookings: int = 0
    concierge_requests: int = 0
    pending_local_verifications: int = 0
    pending_place_verifications: int = 0
    reviews: int = 0
    revenue: int = 0
    recent_bookings: List[Any] = Field(default_factory=list)


class AdminPagedResponse(BaseModel):
    items: List[Any] = Field(default_factory=list)
    total: int = 0
    offset: int = 0
    limit: int = 50


class VerifyAction(BaseModel):
    action: str = Field(..., pattern="^(approve|reject)$")
    verification_status: Optional[str] = Field(None, max_length=30)