from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class ActivityCreate(BaseModel):
    place_id: Optional[str] = None
    title: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    time_slot: str = Field("Morning", pattern="^(Morning|Afternoon|Evening|Dinner)$")
    start_time: Optional[str] = None
    duration_minutes: int = Field(90, ge=5, le=720)
    estimated_cost: int = Field(0, ge=0)
    distance_km: Optional[str] = None
    recommendation_reason: Optional[str] = None
    order_index: int = 0
    image: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None


class ActivityUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    place_id: Optional[str] = None
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    time_slot: Optional[str] = Field(None, pattern="^(Morning|Afternoon|Evening|Dinner)$")
    start_time: Optional[str] = None
    duration_minutes: Optional[int] = Field(None, ge=5, le=720)
    estimated_cost: Optional[int] = Field(None, ge=0)
    distance_km: Optional[str] = None
    recommendation_reason: Optional[str] = None
    order_index: Optional[int] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None


class ActivityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    itinerary_day_id: str
    place_id: Optional[str] = None
    title: str
    description: str
    time_slot: str
    start_time: Optional[str] = None
    duration_minutes: int
    estimated_cost: int
    distance_km: Optional[str] = None
    recommendation_reason: Optional[str] = None
    order_index: int
    image: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None


class ItineraryDayResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    day_number: int
    date: str
    title: str
    subtitle: str
    activities: List[ActivityResponse] = []


class TripCreate(BaseModel):
    destination: str = Field(..., min_length=1, max_length=100)
    title: Optional[str] = Field(None, max_length=200)
    tagline: Optional[str] = Field(None, max_length=300)
    total_days: Optional[int] = Field(None, ge=1, le=30)
    start_date: str = Field(..., min_length=1, max_length=20)
    end_date: str = Field(..., min_length=1, max_length=20)
    arrival_time: str = Field("10:00", max_length=20)
    departure_time: str = Field("18:00", max_length=20)
    travelers: str = Field("2", max_length=20)
    budget: str = Field("Moderate", max_length=30)
    currency: str = Field("INR", max_length=10)
    travel_style: Optional[str] = Field(None, max_length=50)
    preferences: Dict[str, Any] = Field(default_factory=dict)


class TripUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    destination: Optional[str] = Field(None, min_length=1, max_length=100)
    title: Optional[str] = Field(None, max_length=200)
    tagline: Optional[str] = Field(None, max_length=300)
    total_days: Optional[int] = Field(None, ge=1, le=30)
    start_date: Optional[str] = Field(None, max_length=20)
    end_date: Optional[str] = Field(None, max_length=20)
    arrival_time: Optional[str] = Field(None, max_length=20)
    departure_time: Optional[str] = Field(None, max_length=20)
    travelers: Optional[str] = Field(None, max_length=20)
    budget: Optional[str] = Field(None, max_length=30)
    currency: Optional[str] = Field(None, max_length=10)
    travel_style: Optional[str] = Field(None, max_length=50)
    preferences: Optional[Dict[str, Any]] = None
    status: Optional[str] = Field(None, pattern="^(active|archived)$")


class TripResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    destination: str
    title: str
    tagline: str
    total_days: int
    start_date: str
    end_date: str
    arrival_time: str
    departure_time: str
    travelers: str
    budget: str
    currency: str
    travel_style: Optional[str] = None
    preferences: Dict[str, Any] = {}
    status: str
    created_at: Any = None
    updated_at: Any = None
    days: List[ItineraryDayResponse] = []


class TripGenerateRequest(BaseModel):
    """Preferences used to (re)generate an itinerary for a trip."""

    destination: Optional[str] = Field(None, max_length=100)
    start_date: Optional[str] = Field(None, max_length=20)
    end_date: Optional[str] = Field(None, max_length=20)
    arrival_time: Optional[str] = Field(None, max_length=20)
    departure_time: Optional[str] = Field(None, max_length=20)
    travelers: Optional[str] = Field(None, max_length=20)
    budget: Optional[str] = Field(None, max_length=30)
    currency: Optional[str] = Field("INR", max_length=10)
    travel_style: Optional[str] = Field(None, max_length=50)
    interests: List[str] = Field(default_factory=list)
    moods: List[str] = Field(default_factory=list)
    preferences: Dict[str, Any] = Field(default_factory=dict)