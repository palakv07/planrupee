from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AIPlanTripRequest(BaseModel):
    destination: str = Field(..., min_length=1, max_length=100)
    start_date: str = Field(..., max_length=20)
    end_date: str = Field(..., max_length=20)
    arrival_time: str = Field("10:00", max_length=20)
    departure_time: str = Field("18:00", max_length=20)
    travelers: str = Field("2", max_length=20)
    budget: str = Field("Moderate", max_length=30)
    currency: str = Field("INR", max_length=10)
    travel_style: Optional[str] = Field(None, max_length=50)
    interests: List[str] = Field(default_factory=list)
    moods: List[str] = Field(default_factory=list)
    preferences: Dict[str, Any] = Field(default_factory=dict)


class AIReplanRequest(BaseModel):
    trip_id: str = Field(..., min_length=1)
    instruction: str = Field(..., min_length=1)
    preferences: Dict[str, Any] = Field(default_factory=dict)


class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    trip_id: Optional[str] = None
    context: Dict[str, Any] = Field(default_factory=dict)


class AIResponse(BaseModel):
    """Structured, validated response from the AI planning/replanning endpoints."""

    success: bool
    trip: Dict[str, Any]
    explanation: Optional[str] = None
    used_fallback: bool = False
    provider: Optional[str] = None


class AIChatResponse(BaseModel):
    success: bool
    reply: str = ""
    actions: List[Dict[str, Any]] = Field(default_factory=list)
    trip: Optional[Dict[str, Any]] = None
    used_fallback: bool = False
    provider: Optional[str] = None