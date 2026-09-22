from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class ReviewCreate(BaseModel):
    place_id: Optional[str] = Field(None, min_length=1)
    local_id: Optional[str] = Field(None, min_length=1)
    rating: float = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=1, max_length=3000)
    author_location: Optional[str] = Field(None, max_length=120)
    ratings_breakdown: Dict[str, Any] = Field(default_factory=dict)

    def validate_target(self) -> None:
        if (self.place_id is None) == (self.local_id is None):
            raise ValueError("Exactly one of place_id or local_id must be provided.")


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    place_id: Optional[str] = None
    local_id: Optional[str] = None
    author_name: str
    author_location: Optional[str] = None
    rating: float
    comment: str
    verified: bool
    ratings_breakdown: Dict[str, Any] = {}
    created_at: Any = None