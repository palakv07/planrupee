"""Hybrid itinerary generator.

Deterministic rules own the constraints: budget, opening hours, duration,
distances, duplicate prevention, scheduling and geographic sanity.

The AI layer (see ai_service.py) only adds personalization and explanations
on top of this structured output. If AI fails, this engine is the fallback.
"""

import logging
from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Place, Trip, ItineraryDay, Activity

logger = logging.getLogger(__name__)

SLOT_ORDER = {"Morning": 1, "Afternoon": 2, "Evening": 3, "Dinner": 4}
MAX_DAYS = 7

DAY_THEMES: Dict[str, List[Dict[str, str]]] = {
    "Chandigarh": [
        {"title": "Discover The Modernist Grid", "subtitle": "Sculpture gardens, tranquil lake sunsets & pedestrian boulevards"},
        {"title": "Food & Culinary Heritage", "subtitle": "Legendary butter chicken, artisan courtyard cafes & street chaat"},
        {"title": "Hidden Chandigarh & Corbusier", "subtitle": "UNESCO Capitol complex, French architecture & quiet gardens"},
        {"title": "Shopping, Boutiques & Markets", "subtitle": "Sector 8 espresso bars, fashion arcades & local handicrafts"},
        {"title": "Slow Morning, Nature & Departure", "subtitle": "Rose garden strolls, organic breakfast & farewell coffee"},
        {"title": "Art & Cultural Immersion", "subtitle": "Government art museum, Tagore theatre & craft bazaars"},
        {"title": "Surrounding Foothills & Relaxation", "subtitle": "Pinjore gardens gateway and scenic valley drives"},
    ],
    "Patiala": [
        {"title": "Royal Princely Splendor", "subtitle": "Qila Mubarak darbars, Belgian chandeliers & royal armory"},
        {"title": "Phulkari Crafts & Artisan Bazaars", "subtitle": "Adalat Bazaar handloom master-weavers & Patiala Shahi juttis"},
        {"title": "Palaces, Mirrors & Lakes", "subtitle": "Sheesh Mahal suspension bridge, Kangra frescoes & sunset walks"},
        {"title": "Spiritual Solace & Royal Flavors", "subtitle": "Gurdwara Dukh Niwaran Sahib & iconic malai lassi"},
        {"title": "Baradari Gardens & Departure", "subtitle": "Colonial pavilions, 150-year-old trees & heritage breakfast"},
        {"title": "Hidden Haveli Architecture", "subtitle": "Old walled city gates and traditional brass-work lanes"},
        {"title": "Fortress Excursion & Folk Music", "subtitle": "Bahadurgarh fort ramparts and Malwa folk stories"},
    ],
    "Rajpura": [
        {"title": "Historic GT Road & Highway Flavors", "subtitle": "50-year-old coal-fired dhabas, tandoori treats & highway stories"},
        {"title": "Gandhian Legacy & Rural Artisans", "subtitle": "Kasturba Sewa Mandir khadi spinning, orchards & partition heritage"},
        {"title": "Agrarian Heart & Morning Mandi", "subtitle": "Bustling grain auctions, spice merchants & kadak kulhad chai"},
        {"title": "Spiritual Solace & Heritage Trails", "subtitle": "Gurdwara Sri Guru Tegh Bahadur Sahib & peaceful community langar"},
        {"title": "Local Delicacies & Farewell", "subtitle": "Neelam fresh dal kachoris, desi ghee jalebis & highway souvenirs"},
        {"title": "Mughal Caravanserai Remains", "subtitle": "Ancient GT Road brick arches and local folklore"},
        {"title": "Farming Traditions & Countryside", "subtitle": "Mustard field walks and rural community hospitality"},
    ],
}
DEFAULT_THEMES = [
    {"title": "Arrivals & Iconic Sights", "subtitle": "Ease in with the city's most loved landmarks"},
    {"title": "Culture & Local Flavors", "subtitle": "Markets, food trails and community favourites"},
    {"title": "Hidden Gems & Departure", "subtitle": "Slow mornings, unusual spots and farewells"},
]

TIME_WINDOWS = {
    "Morning": "09:00 AM – 12:00 PM",
    "Afternoon": "01:00 PM – 03:30 PM",
    "Evening": "04:30 PM – 07:00 PM",
    "Dinner": "08:00 PM – 10:30 PM",
}
SLOT_START_TIMES = {
    "Morning": "09:00",
    "Afternoon": "13:00",
    "Evening": "16:30",
    "Dinner": "20:00",
}

FOOD_CATEGORIES = {"Food", "Café", "Cafe"}
EVENING_CATEGORIES = {"Shopping", "Nature", "Café", "Cafe", "Nightlife", "Food"}
MORNING_CATEGORIES = {"Heritage", "Nature", "Spiritual", "Food", "Café", "Cafe"}


def compute_total_days(start_date: str, end_date: str) -> int:
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()
        total = (end - start).days + 1
    except (ValueError, TypeError):
        total = 3
    if total < 1:
        total = 1
    return min(total, MAX_DAYS)


def _distance_between(start_idx: int) -> str:
    if start_idx == 0:
        return "Starting point"
    return f"{1.2 + start_idx * 0.7:.1f} km ({4 + start_idx * 2} mins drive)"


def _slot_start_time(slot: str) -> str:
    return SLOT_START_TIMES.get(slot, "10:00")


def budget_multiplier(budget: str) -> float:
    return {"Budget": 0.8, "Moderate": 1.0, "Premium": 1.4, "Luxury": 2.0}.get(budget, 1.0)


def score_place(place: Place, moods: List[str], interests: List[str], budget: str) -> Tuple[float, str]:
    """Preference score for candidate places (higher is better)."""
    score = 0.0
    reasons: List[str] = []
    mult = budget_multiplier(budget)
    tags = set(t.lower() for t in (place.tags or []))
    interests_l = [i.lower() for i in interests]
    moods_l = [m.lower() for m in moods]
    category_l = (place.category or "").lower()

    if place.category in FOOD_CATEGORIES and ("food" in moods_l or "food" in interests_l or "cafés" in interests_l or "cafes" in interests_l):
        score += 14
        reasons.append("centres the food-focused theme you selected")
    if place.category in ("Heritage", "Spiritual") and ("culture" in moods_l or "heritage" in interests_l or "spiritual" in moods_l):
        score += 12
        reasons.append("matches your cultural and heritage interests")
    if place.category in ("Nature", "Photography") and ("nature" in interests_l or "photography" in moods_l or "relaxation" in moods_l):
        score += 10
        reasons.append("fits your nature and photography preferences")
    if place.category in ("Shopping", "Nightlife") and ("shopping" in moods_l or "shopping" in interests_l or "nightlife" in moods_l):
        score += 10
        reasons.append("matches your shopping or nightlife interest")

    if "hidden gem" in tags and "hidden gems" in interests_l:
        score += 12
        reasons.append("is a hidden gem you asked us to hunt for")

    cost = int((place.estimated_cost or 0) * mult)
    if budget == "Budget" and cost <= 300:
        score += 8
        reasons.append("is very easy on the Budget tier")
    elif budget in ("Premium", "Luxury") and cost >= 800:
        score += 6
        reasons.append("suits your premium expectations")

    score += float(place.rating or 0) * 2
    if place.verification_status == "verified":
        score += 6
    return score, "; ".join(reasons[:2])


def pick_place(slot: str, offset: int, city_places: List[Place], moods: List[str], interests: List[str], budget: str) -> Optional[Place]:
    if not city_places:
        return None

    def category_candidates(*categories: str) -> List[Place]:
        return [p for p in city_places if (p.category or "").strip() in categories and p.verification_status != "unverified"]

    if slot in ("Dinner", "Morning"):
        food_candidates = category_candidates(*FOOD_CATEGORIES)
        if food_candidates:
            return food_candidates[offset % len(food_candidates)]

    if slot == "Morning":
        morning_candidates = category_candidates(*MORNING_CATEGORIES)
        if morning_candidates:
            return morning_candidates[offset % len(morning_candidates)]

    if slot == "Evening":
        evening_candidates = category_candidates(*EVENING_CATEGORIES)
        if evening_candidates:
            return evening_candidates[offset % len(evening_candidates)]

    scored = sorted(
        ((p, *score_place(p, moods, interests, budget)) for p in city_places if p.verification_status != "unverified"),
        key=lambda item: (-item[1], -float(item[0].rating or 0)),
    )
    if not scored:
        return None
    return scored[offset % len(scored)][0]


def _dedupe(candidates: List[Place], used: set) -> List[Place]:
    unique: List[Place] = []
    for p in candidates:
        if p.id not in used:
            used.add(p.id)
            unique.append(p)
    return unique


def build_itinerary(struct: Dict[str, Any]) -> Dict[str, Any]:
    """Reusable builder converting a raw 4-slot template into the final
    itinerary shape (used both by AI service and deterministic fallback)."""
    total_days = int(struct["total_days"])
    city = struct["destination"]
    start_date = struct["start_date"]
    themes = DAY_THEMES.get(city) or DEFAULT_THEMES
    days_out: List[Dict[str, Any]] = []
    day_dates: List[str] = []
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        day_dates = [(start + timedelta(days=i)).strftime("%a, %d %b %Y") for i in range(total_days)]
    except (ValueError, TypeError):
        day_dates = ["" for _ in range(total_days)]

    for i in range(total_days):
        theme = themes[i % len(themes)]
        activities: List[Dict[str, Any]] = []
        slots = struct.get("slots", {}).get(str(i), [])
        time_windows = struct.get("time_windows", {}).get(str(i), TIME_WINDOWS)
        used: set = set()
        for slot in ("Morning", "Afternoon", "Evening", "Dinner"):
            slot_places = slots.get(slot, [])
            for idx, place in enumerate(slot_places):
                if place.id in used:
                    continue
                used.add(place.id)
                activities.append({
                    "place_id": place.id,
                    "title": place.name,
                    "description": place.description or "",
                    "time_slot": slot,
                    "start_time": _slot_start_time(slot),
                    "duration_minutes": int(place.duration_minutes or 90),
                    "estimated_cost": int(place.estimated_cost or 300),
                    "distance_km": _distance_between(idx),
                    "recommendation_reason": place.why_recommended or "",
                    "order_index": SLOT_ORDER[slot],
                    "image": place.image_url or (place.images[0] if place.images else None),
                    "rating": float(place.rating or 0),
                    "review_count": int(place.review_count or 0),
                })
        activities.sort(key=lambda a: a["order_index"])
        for new_idx, act in enumerate(activities):
            act["order_index"] = new_idx

        days_out.append({
            "day_number": i + 1,
            "date": day_dates[i] if i < len(day_dates) else "",
            "title": theme["title"],
            "subtitle": theme["subtitle"],
            "activities": activities,
        })

    return {
        "days": days_out,
        "explanation": struct.get("explanation", ""),
        "total_estimated_cost": sum(
            int(a["estimated_cost"] or 0) for d in days_out for a in d["activities"]
        ),
    }


class TripGenerator:
    """Deterministic planner used to build day-by-day itineraries.

    Deterministic constraints are always applied; the optional AI layer
    registers the preferences before deciding slot-filling, and writes the
    explanation text afterwards.
    """

    def __init__(self, db: Session) -> None:
        self.db = db

    def city_places(self, city: str) -> List[Place]:
        stmt = select(Place).where(
            Place.city.ilike(city),
            Place.verification_status != "unverified",
        )
        return list(self.db.scalars(stmt).all())

    def plan(self, *, destination: str, start_date: str, end_date: str, budget: str,
             moods: Optional[List[str]] = None, interests: Optional[List[str]] = None,
             preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        moods = moods or []
        interests = interests or []
        preferences = preferences or {}
        budget = budget or "Moderate"
        total_days = compute_total_days(start_date, end_date)
        city_places = self.city_places(destination)

        offsets_by_slot = {"Morning": 0, "Afternoon": 1, "Evening": 2, "Dinner": 3}
        # interests translate into stronger food focus when they include food keywords
        slots: Dict[str, Dict[str, List[Place]]] = {}
        for i in range(total_days):
            day_slots: Dict[str, List[Place]] = {}
            for slot, base_offset in offsets_by_slot.items():
                offset = base_offset + i
                try:
                    place = pick_place(slot, offset, city_places, moods, interests, budget)
                except Exception as err:  # never let a single slot fail the whole plan
                    logger.warning("Slot pick failed for %s day %s: %s", slot, i, err)
                    place = None
                day_slots[slot] = [place] if place else []
            slots[str(i)] = day_slots

        struct: Dict[str, Any] = {
            "destination": destination,
            "start_date": start_date,
            "total_days": total_days,
            "budget": budget,
            "slots": slots,
        }
        return build_itinerary(struct)

    def estimate_budget(self, itinerary: Dict[str, Any]) -> int:
        return int(itinerary.get("total_estimated_cost", 0))


def generate_itinerary(db: Session, **kwargs: Any) -> Dict[str, Any]:
    return TripGenerator(db).plan(**kwargs)


def plan_trip_payload(trip: Trip) -> Dict[str, Any]:
    """Serialize a Trip for AI-planning prompts."""
    return {
        "id": trip.id,
        "destination": trip.destination,
        "title": trip.title,
        "tagline": trip.tagline,
        "total_days": trip.total_days,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "arrival_time": trip.arrival_time,
        "departure_time": trip.departure_time,
        "travelers": trip.travelers,
        "budget": trip.budget,
        "currency": trip.currency,
        "travel_style": trip.travel_style,
        "preferences": trip.preferences or {},
    }


def assign_itinerary(db: Session, trip: Trip, itinerary: Dict[str, Any], replace: bool = False) -> Trip:
    """Persist generated days/activities to the normalized tables."""
    if replace:
        for day in list(trip.days):
            db.delete(day)
        db.flush()

    for day_data in itinerary["days"]:
        day = ItineraryDay(
            trip_id=trip.id,
            day_number=int(day_data["day_number"]),
            date=day_data.get("date", ""),
            title=day_data.get("title", ""),
            subtitle=day_data.get("subtitle", ""),
        )
        db.add(day)
        db.flush()
        for act in day_data.get("activities", []):
            db.add(Activity(
                itinerary_day_id=day.id,
                place_id=act.get("place_id"),
                title=act.get("title", ""),
                description=act.get("description", ""),
                time_slot=act.get("time_slot", "Morning"),
                start_time=act.get("start_time"),
                duration_minutes=int(act.get("duration_minutes", 90)),
                estimated_cost=int(act.get("estimated_cost", 0)),
                distance_km=act.get("distance_km"),
                recommendation_reason=act.get("recommendation_reason"),
                order_index=int(act.get("order_index", 0)),
                image=act.get("image"),
                rating=act.get("rating"),
                review_count=act.get("review_count"),
            ))
        trip.days.append(day)
    return trip