from typing import Any, Dict, Optional
import httpx
from app.core.config import settings
from app.services.ai.base import AIProvider, AIProviderError
from app.services.ai.mock import extract_json


class OpenAIProvider(AIProvider):
    """OpenAI provider adapter using the /chat/completions REST API.

    Reads the key from OPENAI_API_KEY. When no key is configured the
    provider reports itself as unavailable so the factory falls back.
    """

    name = "openai"
    BASE_URL = "https://api.openai.com/v1/chat/completions"
    DEFAULT_MODEL = "gpt-4o-mini"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None) -> None:
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model = model or settings.OPENAI_MODEL or self.DEFAULT_MODEL

    def is_available(self) -> bool:
        return bool(self.api_key)

    def _chat(self, prompt: str, *, temperature: float, response_format: Optional[str] = None) -> str:
        if not self.is_available():
            raise AIProviderError("OPENAI_API_KEY is not configured")
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
        }
        if response_format == "json":
            payload["response_format"] = {"type": "json_object"}
        headers = {"Authorization": f"Bearer {self.api_key}"}
        try:
            response = httpx.post(self.BASE_URL, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPError as exc:
            raise AIProviderError(f"OpenAI request failed: {exc}", cause=exc) from exc

        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            raise AIProviderError("OpenAI returned an unexpected response shape", cause=exc) from exc

    def generate_text(self, prompt: str, *, max_tokens: int = 2048, temperature: float = 0.7) -> str:
        return self._chat(prompt, temperature=temperature)

    def generate_json(self, prompt: str, *, max_tokens: int = 4096, temperature: float = 0.4) -> Dict[str, Any]:
        text = self._chat(prompt, temperature=temperature, response_format="json")
        return extract_json(text)