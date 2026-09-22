import json
import re
from typing import Any, Dict, List
from app.services.ai.base import AIProvider, AIProviderError


class MockAIProvider(AIProvider):
    """Deterministic development provider.

    Never calls an external LLM. Returns stable, well-formed JSON used for
    local development, tests and CI. This keeps development affordable.
    """

    name = "mock"

    def __init__(self) -> None:
        self._request_count = 0

    def is_available(self) -> bool:
        return True

    def generate_text(self, prompt: str, *, max_tokens: int = 2048, temperature: float = 0.7) -> str:
        self._request_count += 1
        markers = {
            "day 1": "Start Day 1 at the Rock Garden before the crowds, then walk the Le Corbusier grid to Capitol Complex.",
            "day 2": "Dedicate Day 2 to Sukhna Lake, Patiala heritage lanes and authentic local street food.",
            "day 3": "Spend Day 3 on unique local experiences and hidden courtyard cafés recommended by verified locals.",
        }
        lower = prompt.lower()
        for key, text in markers.items():
            if key in lower:
                return text
        if "rain" in lower:
            return "A light drizzle is forecast. Prefer indoor venues, court cafés and covered heritage walks."
        if "vegetarian" in lower or "vegan" in lower:
            return "Great news: most PlanRupee-recommended venues offer excellent vegetarian and vegan tasting menus."
        return "Here is your refined PlanRupee itinerary. All selections are budget-aware and read well top to bottom."

    def generate_json(self, prompt: str, *, max_tokens: int = 4096, temperature: float = 0.4) -> Dict[str, Any]:
        self._request_count += 1
        lower = prompt.lower()

        if "explain" in lower:
            return {
                "suggested_text": (
                    "This plan balances iconic heritage with hidden local gems. "
                    "Mornings are reserved for spacious attractions, afternoons for food "
                    "and evenings for scenic sunsets — while keeping the daily budget stable."
                )
            }
        if "replan" in lower or "modify" in lower or "replace" in lower:
            if "rain" in lower:
                return {
                    "new_activities": [
                        {
                            "time_slot": "Afternoon",
                            "instruction": "Swap outdoor garden time for the Government Museum & Art Gallery.",
                            "reason": "Indoor alternative keeps the plan comfortable during rain.",
                        }
                    ],
                    "suggested_text": "Replaced the outdoor walk with an indoor museum visit for Rain Day.",
                }
            if "cheaper" in lower:
                return {
                    "new_activities": [
                        {"time_slot": "Dinner", "instruction": "Replace premium dinner with a well-reviewed local street-food crawl.", "reason": "Keeps the experience local and cuts the day budget."}
                    ],
                    "suggested_text": "Swapped the premium dinner for a verified street-food experience.",
                }
            if "vegetarian" in lower or "vegan" in lower:
                return {
                    "new_activities": [
                        {"time_slot": "Dinner", "instruction": "Book the vegetarian thali at the courtyard café.", "reason": "Matches vegetarian preference."}
                    ],
                    "suggested_text": "Adjusted meal selections to fully vegetarian venues.",
                }
            return {
                "new_activities": [],
                "suggested_text": "The itinerary was re-balanced for flow and budget while keeping your favorites.",
            }

        if "chat" in lower or "recommend" in lower or "hidden" in lower:
            return {
                "reply": "For a hidden gem, ask a verified local in your destination — they know the courtyard cafés and market stalls the guides skip. I can also book a consultation for you right now.",
                "actions": [{"action": "open_locals", "city": "Chandigarh"}],
            }
        if "budget" in lower:
            return {
                "reply": "Your current plan fits a Moderate budget. Want me to tighten it to Budget or upgrade to Premium?",
                "actions": [],
            }

        return {
            "reply": "I can help refine your trip — try asking about a hidden local spot, vegetarian food, or a cheaper Day 2.",
            "actions": [],
        }

    def embed(self, text: str) -> List[float]:
        return [0.0] * 8


_MARKDOWN_CODE_BLOCK = re.compile(r"```(?:json)?\s*(.*?)\s*```", re.DOTALL)


def extract_json(text: str) -> Dict[str, Any]:
    """Safely parse JSON from an LLM response including markdown fences."""
    fenced = _MARKDOWN_CODE_BLOCK.search(text)
    candidate = fenced.group(1) if fenced else text
    try:
        return json.loads(candidate)
    except json.JSONDecodeError as first_error:
        # Some models return a Python-dict-like payload; try to fix single quotes.
        normalized = re.sub(r"(?<!['\"])\b(None|True|False)\b(?!['\"])", lambda m: {
            "None": "null", "True": "true", "False": "false"
        }.get(m.group(1), m.group(1)), candidate)
        try:
            return json.loads(normalized)
        except json.JSONDecodeError:
            raise AIProviderError(f"Could not parse JSON from provider output: {first_error}") from first_error