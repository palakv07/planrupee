from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class LocalProfileCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    city: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=150)
    avatar: str = Field(..., min_length=1, max_length=500)
    bio: str = Field(..., min_length=1)
    why_choose_me: Optional[str] = None
    expertise: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    consultation_fee: int = Field(799, ge=0)
    years_local: int = Field(1, ge=0, le=100)
    availability: str = Field("Daily, 10:00 AM – 08:00 PM IST", max_length=200)
    instagram_handle: Optional[str] = Field(None, max_length=100)
    local_picks: Dict[str, Any] = Field(default_factory=dict)
    reels: List[Dict[str, Any]] = Field(default_factory=list)
    places_i_love_ids: List[str] = Field(default_factory=list)


class LocalProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: Optional[str] = Field(None, min_length=1, max_length=120)
    city: Optional[str] = Field(None, min_length=1, max_length=100)
    title: Optional[str] = Field(None, min_length=1, max_length=150)
    avatar: Optional[str] = Field(None, max_length=500)
    bio: Optional[str] = None
    why_choose_me: Optional[str] = None
    expertise: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    consultation_fee: Optional[int] = Field(None, ge=0)
    years_local: Optional[int] = Field(None, ge=0, le=100)
    availability: Optional[str] = Field(None, max_length=200)
    instagram_handle: Optional[str] = Field(None, max_length=100)
    local_picks: Optional[Dict[str, Any]] = None
    reels: Optional[List[Dict[str, Any]]] = None
    places_i_love_ids: Optional[List[str]] = None


class LocalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    name: str
    city: str
    title: str
    avatar: str
    bio: str
    why_choose_me: Optional[str] = None
    expertise: List[str] = []
    languages: List[str] = []
    consultation_fee: int
    rating: float
    review_count: int
    years_local: int
    travelers_helped: int
    verification_status: str
    verified: bool
    availability: str
    instagram_handle: Optional[str] = None
    local_picks: Dict[str, Any] = {}
    reels: List[Dict[str, Any]] = []
    places_i_love_ids: List[str] = []
    created_at: Any = None
    updated_at: Any = None


class LocalListParams(BaseModel):
    city: Optional[str] = None
    expertise: Optional[str] = None
    language: Optional[str] = None
    max_price: Optional[int] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    search: Optional[str] = None
    verified_only: bool = True
    sort_by: Optional[str] = Field(None, pattern="^(rating|price|reviews)$")
    limit: int = Field(50, ge=1, le=200)
    offset: int = Field(0, ge=0)