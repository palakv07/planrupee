from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class PlaceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field("Punjab/UT", max_length=100)
    country: str = Field("India", max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    description: str = Field(..., min_length=1)
    address: str = Field(..., min_length=1, max_length=300)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    opening_hours: str = Field("10:00 AM – 08:00 PM", max_length=100)
    estimated_cost: int = Field(300, ge=0)
    price_level: str = Field("₹₹", max_length=10)
    rating: float = Field(4.5, ge=0, le=5)
    review_count: int = Field(0, ge=0)
    best_time: str = Field("Morning", max_length=100)
    duration_minutes: int = Field(90, ge=5, le=720)
    verification_status: str = Field("verified", max_length=30)
    why_recommended: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class PlaceUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: Optional[str] = Field(None, min_length=1, max_length=200)
    city: Optional[str] = Field(None, min_length=1, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, min_length=1)
    address: Optional[str] = Field(None, min_length=1, max_length=300)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    opening_hours: Optional[str] = Field(None, max_length=100)
    estimated_cost: Optional[int] = Field(None, ge=0)
    price_level: Optional[str] = Field(None, max_length=10)
    rating: Optional[float] = Field(None, ge=0, le=5)
    review_count: Optional[int] = Field(None, ge=0)
    best_time: Optional[str] = Field(None, max_length=100)
    duration_minutes: Optional[int] = Field(None, ge=5, le=720)
    verification_status: Optional[str] = Field(None, max_length=30)
    why_recommended: Optional[str] = None
    tags: Optional[List[str]] = None


class PlaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    city: str
    state: str
    country: str
    category: str
    description: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    images: List[str] = []
    opening_hours: str
    estimated_cost: int
    price_level: str
    rating: float
    review_count: int
    best_time: str
    duration_minutes: int
    verification_status: str
    why_recommended: Optional[str] = None
    tags: List[str] = []
    created_at: Any = None
    updated_at: Any = None


class PlaceListParams(BaseModel):
    city: Optional[str] = None
    category: Optional[str] = None
    budget: Optional[int] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    max_price: Optional[int] = None
    best_time: Optional[str] = None
    duration_max: Optional[int] = None
    recommendation_type: Optional[str] = None
    sort_by: Optional[str] = Field(None, pattern="^(recommended|rating|price|distance)$")
    q: Optional[str] = None
    limit: int = Field(50, ge=1, le=200)
    offset: int = Field(0, ge=0)