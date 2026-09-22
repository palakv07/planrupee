from typing import Optional
from pydantic import BaseModel, ConfigDict


class SavedPlaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    place_id: str
    created_at: Optional[object] = None


class SavedLocalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    local_id: str
    created_at: Optional[object] = None