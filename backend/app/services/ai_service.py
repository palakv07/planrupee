"""AI orchestration service.

Only calls an LLM when it adds meaningful value; all structural work stays
deterministic so the flow is affordable and dependable. Any AI failure is
gracefully absorbed by deterministic fallbacks.
"""

import json
import logging
from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Activity, ItineraryDay, Place, Trip
from app.services.ai.base import AIProvider, AIProviderError
from app.services.ai.factory import get_ai_provider
from app.services.trip_generator import (
    TripGenerator,
    build_itinerary,
    assign_itinerary,
    pick_place,
    plan_trip_payload,
)

logger = logging.getLogger(__name__)

FOOD_CATEGORIES = {"Food", "Café", "Cafe"}
OUTDOOR_CATEGORIES = {"Nature", "Heritage", "Shopping", "Photography"}


class AIService:
    def __init__(self, db: Session, provider: Optional[AIProvider] = None) -> None:
        self.db = db
        self.provider = provider or get_ai_provider()

    # ------------------------------------------------------------------ #
    # Planning
    # ------------------------------------------------------------------ #
    def plan_trip(self, *, destination: str, start_date: str, end_date: str,
                  budget: str, moods: Optional[List[str]] = None,
                  interests: Optional[List[str]] = None,
                  preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        generator = TripGenerator(self.db)
        itinerary = generator.plan(
            destination=destination,
            start_date=start_date,
            end_date=end_date,
            budget=budget,
            moods=moods,
            interests=interests,
            preferences=preferences,
        )
        explanation, used_fallback = self._explain(itinerary, destination, budget)
        itinerary["explanation"] = explanation
        itinerary["used_fallback"] = used_fallback
        itinerary["provider"] = self.provider.name
        return itinerary

    def _explain(self, itinerary: Dict[str, Any], destination: str, budget: str) -> tuple:
        preview = json.dumps(itinerary, default=str)[:2400]
        prompt = (
            "You are PlanRupee's travel planner. Explain — in two warm, concise sentences — "
            "why this itinerary fits the traveler (destination: "
            f"{destination}, budget: {budget}). Stay factual. JSON only: "
            '{"explanation": "..."}\n\n'
            f"{preview}"
        )
        try:
            result = self.provider.generate_json(prompt, temperature=0.4)
            explanation = str(result.get("explanation", "")).strip()
            if explanation:
                return explanation, False
        except AIProviderError as exc:
            logger.warning("AI explanation failed, using fallback text: %s", exc)
        return (
            f"This PlanRupee plan mixes iconic {destination} sights with hidden local gems, "
            "keeping budgets stable and mornings free for the most spacious spots.",
            True,
        )

    # ------------------------------------------------------------------ #
    # Natural-language re-planning
    # ------------------------------------------------------------------ #
    def replan_trip(self, trip: Trip, instruction: str,
                    preferences: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Interpret a natural-language instruction and modify in place."""
        generator = TripGenerator(self.db)
        lower = (instruction or "").lower()

        # Build structured snapshot of current itinerary
        itinerary = self._snapshot(trip)
        modified = False

        if any(word in lower for word in ["cheap", "cheaper", "budget", "cut costs", "save money"]):
            self._apply_price_filter(itinerary)
            modified = True
        if any(word in lower for word in ["rain", "raining", "rainy", "drizzle"]):
            self._swap_outdoor_to_indoor(itinerary)
            modified = True
        if any(word in lower for word in ["vegetarian", "vegan", "no meat", "veg only"]):
            self._secure_vegetarian_dinners(itinerary)
            modified = True
        if any(word in lower for word in ["wake up", "wake before 9", "sleep in", "later mornings", "start late"]) or "before 9" in lower:
            self._shift_mornings_later(itinerary)
            modified = True
        if "museum" in lower and any(word in lower for word in ["replace", "outdoor", "outside", "swap"]):
            self._replace_museum_with_outdoor(itinerary, generator)
            modified = True
        if any(word in lower for word in ["hidden", "local food", "street food", "add food", "culinary"]):
            self._add_local_food_activity(itinerary, generator)
            modified = True

        if not modified:
            # Even with no recognized intent, keep the shape and ask for clarification.
            itinerary["explanation"] = (
                "I did not find a specific change in your request. You can say things like "
                "\"Make Day 2 cheaper\", \"I am vegetarian\", or \"It is raining tomorrow\"."
            )
            itinerary["used_fallback"] = True
            return itinerary

        # AI polish on the changed plan when available (safe to skip)
        explanation, used_fallback = self._replan_explanation(trip, instruction)
        itinerary["explanation"] = explanation
        itinerary["used_fallback"] = used_fallback
        itinerary["provider"] = self.provider.name

        # Persist
        assign_itinerary(self.db, trip, itinerary, replace=True)
        self.db.commit()
        return itinerary

    def _snapshot(self, trip: Trip) -> Dict[str, Any]:
        days = []
        for day in sorted(trip.days, key=lambda d: d.day_number):
            acts = []
            for act in sorted(day.activities, key=lambda a: a.order_index):
                acts.append({
                    "id": act.id, "place_id": act.place_id, "title": act.title,
                    "time_slot": act.time_slot, "estimated_cost": int(act.estimated_cost or 0),
                    "start_time": act.start_time, "order_index": act.order_index,
                })
            days.append({"day_number": day.day_number, "date": day.date, "title": day.title,
                         "subtitle": day.subtitle, "activities": acts})
        return {"days": days, "destination": trip.destination, "budget": trip.budget}

    def _query_places(self, *categories: str) -> List[Place]:
        stmt = select(Place).where(Place.category.in_(categories), Place.verification_status != "unverified")
        return list(self.db.scalars(stmt).all())

    def _apply_price_filter(self, itinerary: Dict[str, Any]) -> None:
        for day in itinerary["days"]:
            for act in day["activities"]:
                if act["time_slot"] == "Dinner":
                    candidates = self._query_places(*FOOD_CATEGORIES)
                    if candidates:
                        cheapest = min(candidates, key=lambda p: p.estimated_cost or 0)
                        act["estimated_cost"] = int(min(cheapest.estimated_cost or 0, 650))
                        act["title"] = f"Budget dinner — {cheapest.name}"

    def _swap_outdoor_to_indoor(self, itinerary: Dict[str, Any]) -> None:
        indoor = self._query_places(*{"Heritage", "Café", "Cafe", "Shopping"})
        for day in itinerary["days"]:
            for act in day["activities"]:
                if act["time_slot"] in ("Evening", "Afternoon"):
                    name_lower = act["title"].lower()
                    if any(word in name_lower for word in ["garden", "lake", "park", "sunset", "nature"]):
                        replacement = self._pick_different(indoor, act.get("place_id"))
                        if replacement:
                            act["place_id"] = replacement.id
                            act["title"] = replacement.name + " · indoor alternative"

    def _secure_vegetarian_dinners(self, itinerary: Dict[str, Any]) -> None:
        veg_places = [p for p in self._query_places(*FOOD_CATEGORIES)
                      if p.verification_status in ("verified", "user_generated")]
        for day in itinerary["days"]:
            for act in day["activities"]:
                if act["time_slot"] == "Dinner":
                    replacement = self._pick_different(veg_places, act.get("place_id"))
                    if replacement:
                        act["place_id"] = replacement.id
                        act["title"] = replacement.name + " · vegetarian friendly"

    def _shift_mornings_later(self, itinerary: Dict[str, Any]) -> None:
        for day in itinerary["days"]:
            for act in day["activities"]:
                if act["time_slot"] == "Morning":
                    act["start_time"] = "10:00"

    def _replace_museum_with_outdoor(self, itinerary: Dict[str, Any], generator: TripGenerator) -> None:
        outdoor = generator.city_places(itinerary.get("destination", ""))
        outdoor = [p for p in outdoor if p.category in OUTDOOR_CATEGORIES]
        for day in itinerary["days"]:
            for act in day["activities"]:
                if act["time_slot"] in ("Morning", "Afternoon") and "museum" in act["title"].lower():
                    replacement = self._pick_different(outdoor, act.get("place_id"))
                    if replacement:
                        act["place_id"] = replacement.id
                        act["title"] = replacement.name + " · outdoors"

    def _add_local_food_activity(self, itinerary: Dict[str, Any], generator: TripGenerator) -> None:
        food = [p for p in generator.city_places(itinerary.get("destination", ""))
                if p.category in FOOD_CATEGORIES]
        if not food:
            return
        for day in itinerary["days"]:
            existing_ids = {a.get("place_id") for a in day["activities"]}
            for place in food:
                if place.id not in existing_ids and len(day["activities"]) < 5:
                    day["activities"].append({
                        "place_id": place.id,
                        "title": f"Hidden local pick — {place.name}",
                        "time_slot": "Dinner" if all(a["time_slot"] != "Dinner" for a in day["activities"]) else "Evening",
                        "estimated_cost": int(place.estimated_cost or 300),
                        "start_time": "20:00" if False else "22:00",
                        "order_index": len(day["activities"]),
                    })
                    break
        for day in itinerary["days"]:
            day["activities"].sort(key=lambda a: a["order_index"])

    @staticmethod
    def _pick_different(places: List[Place], exclude_id: Optional[str]) -> Optional[Place]:
        candidates = [p for p in places if p.id != exclude_id]
        if not candidates:
            return places[0] if places else None
        return candidates[0]

    def _replan_explanation(self, trip: Trip, instruction: str) -> tuple:
        prompt = (
            "You edited a PlanRupee itinerary. In one concise sentence, explain to the traveler "
            "what changed in response to: \"" + instruction[:500] + "\". JSON only: {\"explanation\": \"...\"}"
        )
        try:
            result = self.provider.generate_json(prompt, temperature=0.4)
            explanation = str(result.get("explanation", "")).strip()
            if explanation:
                return explanation, False
        except AIProviderError as exc:
            logger.warning("AI replan explanation failed: %s", exc)
        return f"Itinerary updated to match: {instruction[:300]}", True

    # ------------------------------------------------------------------ #
    # Conversational travel chat
    # ------------------------------------------------------------------ #
    def chat(self, message: str, trip: Optional[Trip] = None,
             context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        lower = message.lower()
        actions: List[Dict[str, Any]] = []

        if any(word in lower for word in ["local", "expert", "consultation", "advice"]):
            actions.append({"action": "open_locals", "destination": (trip.destination if trip else None)})
        if any(word in lower for word in ["hidden", "gem", "secret"]):
            actions.append({"action": "open_discover", "filter": "Hidden Gem"})
        if any(word in lower for word in ["book", "concierge", "assist", "arrange"]):
            actions.append({"action": "open_concierge"})

        trip_context = plan_trip_payload(trip) if trip else None
        prompt = (
            "You are PlanRupee, an AI travel planner for Indian destinations. "
            "Answer briefly and warmly. If the traveler asks for hidden gems, recommend "
            "bookable verified locals. JSON only: {\"reply\": \"...\", \"actions\": [...]}. "
            f"Trip: {json.dumps(trip_context, default=str)[:1200] or 'none'}. User: {message[:800]}"
        )
        try:
            result = self.provider.generate_json(prompt, temperature=0.7)
            reply = str(result.get("reply", "")).strip()
            ai_actions = result.get("actions", []) or []
            used_fallback = not reply
        except AIProviderError as exc:
            logger.warning("AI chat failed, using template reply: %s", exc)
            reply = ""
            ai_actions = []
            used_fallback = True

        if not reply:
            reply = (
                "I can refine your trip, find hidden gems, or arrange a concierge request. "
                "Try \"recommend a hidden local place\" or \"book a consultation\"."
            )
        return {
            "reply": reply,
            "actions": actions + [a for a in ai_actions if isinstance(a, dict)],
            "trip": trip_context,
            "used_fallback": used_fallback,
            "provider": self.provider.name,
        }


def build_ai_service(db: Session) -> AIService:
    return AIService(db)