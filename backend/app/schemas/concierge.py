from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

CONCIERGE_STATUSES = [
    "REQUEST_RECEIVED",
    "UNDER_REVIEW",
    "LOCAL_ASSIGNED",
    "AWAITING_CONFIRMATION",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
]


class ConciergeRequestCreate(BaseModel):
    category: str = Field(..., min_length=1, max_length=80)
    request: str = Field(..., min_length=1)
    destination: str = Field(..., min_length=1, max_length=100)
    timing: str = Field("Tonight", max_length=100)
    preferred_date: Optional[str] = Field(None, max_length=30)
    budget: Optional[str] = Field(None, max_length=50)
    travelers: str = Field("2", max_length=20)
    contact_name: str = Field(..., min_length=1, max_length=120)
    contact_phone: str = Field(..., min_length=1, max_length=50)


class ConciergeStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(" + "|".join(CONCIERGE_STATUSES) + ")$")
    assigned_local_id: Optional[str] = None
    note: Optional[str] = Field(None, max_length=1000)
    sender: Optional[str] = Field(None, max_length=120)


class ConciergeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    category: str
    request: str
    destination: str
    timing: str
    preferred_date: Optional[str] = None
    budget: Optional[str] = None
    travelers: str
    contact_name: str
    contact_phone: str
    status: str
    assigned_local_id: Optional[str] = None
    updates: List[Dict[str, Any]] = []
    created_at: Any = None
    updated_at: Any = None
    assigned_local_name: Optional[str] = None