from typing import Optional, Protocol, runtime_checkable


@runtime_checkable
class MapProvider(Protocol):
    """Provider-agnostic maps interface (Google / Mapbox / OSM / mock)."""

    name: str

    def geocode(self, query: str) -> Optional[dict]:
        ...

    def reverse_geocode(self, latitude: float, longitude: float) -> Optional[dict]:
        ...

    def static_map_url(
        self,
        latitude: float,
        longitude: float,
        *,
        zoom: int = 14,
        width: int = 640,
        height: int = 360,
    ) -> Optional[str]:
        ...
