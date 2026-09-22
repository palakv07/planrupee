from app.core.config import settings
from app.services.maps.base import MapProvider
from app.services.maps.mock import MockMapProvider


def get_map_provider() -> MapProvider:
    provider = (settings.MAPS_PROVIDER or "mock").lower()
    if provider in ("google", "mapbox", "openstreetmap", "osm"):
        # Real adapters can be added without changing callers.
        return MockMapProvider()
    return MockMapProvider()
