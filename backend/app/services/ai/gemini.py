from typing import Any, Dict, Optional
import httpx
from app.core.config import settings
from app.services.ai.base import AIProvider, AIProviderError
from app.services.ai.mock import extract_json


class GeminiProvider(AIProvider):
    """Google Gemini provider adapter using the REST generateContent API.

    Uses httpx directly to avoid an extra SDK dependency. Reads the API key
    from GEMINI_API_KEY. When no key is configured the provider reports
    itself as unavailable so the factory can fall back to MockAIProvider.
    """

    name = "gemini"
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"
    DEFAULT_MODEL = "gemini-1.5-flash"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None) -> None:
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL or self.DEFAULT_MODEL

    def is_available(self) -> bool:
        return bool(self.api_key)

    def _request(self, prompt: str, *, temperature: float) -> Dict[str, Any]:
        if not self.is_available():
            raise AIProviderError("GEMINI_API_KEY is not configured")
        url = f"{self.BASE_URL}/{self.model}:generateContent"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": temperature,
                "responseMimeType": "application/json",
            },
        }
        try:
            response = httpx.post(url, params={"key": self.api_key}, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPError as exc:
            raise AIProviderError(f"Gemini request failed: {exc}", cause=exc) from exc

        try:
            text = data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError, TypeError) as exc:
            raise AIProviderError("Gemini returned an unexpected response shape", cause=exc) from exc
        return text

    def generate_text(self, prompt: str, *, max_tokens: int = 2048, temperature: float = 0.7) -> str:
        return self._request(prompt, temperature=temperature)

    def generate_json(self, prompt: str, *, max_tokens: int = 4096, temperature: float = 0.4) -> Dict[str, Any]:
        text = self._request(prompt, temperature=temperature)
        return extract_json(text)