from typing import Optional

from app.services.maps.base import MapProvider


class MockMapProvider:
    name = "mock"

    def geocode(self, query: str) -> Optional[dict]:
        lowered = (query or "").lower()
        if "patiala" in lowered:
            return {"lat": 30.3398, "lng": 76.3869, "label": "Patiala, Punjab"}
        if "rajpura" in lowered:
            return {"lat": 30.4840, "lng": 76.5950, "label": "Rajpura, Punjab"}
        return {"lat": 30.7333, "lng": 76.7794, "label": "Chandigarh, India"}

    def reverse_geocode(self, latitude: float, longitude: float) -> Optional[dict]:
        return {
            "lat": latitude,
            "lng": longitude,
            "label": f"{latitude:.4f}, {longitude:.4f}",
        }

    def static_map_url(
        self,
        latitude: float,
        longitude: float,
        *,
        zoom: int = 14,
        width: int = 640,
        height: int = 360,
    ) -> Optional[str]:
        # OpenStreetMap embed is public and key-free; used only as a preview URL.
        delta = 0.02 / max(zoom, 1)
        bbox = f"{longitude - delta},{latitude - delta},{longitude + delta},{latitude + delta}"
        return f"https://www.openstreetmap.org/export/embed.html?bbox={bbox}&layer=mapnik&marker={latitude}%2C{longitude}"


assert isinstance(MockMapProvider(), MapProvider)
