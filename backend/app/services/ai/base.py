from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class AIProviderError(Exception):
    """Raised when an AI provider fails to produce a usable response."""

    def __init__(self, message: str = "AI provider failed", cause: Optional[BaseException] = None):
        super().__init__(message)
        self.cause = cause


class AIProvider(ABC):
    """Provider abstraction so the LLM backend can be swapped without
    rewriting the application (Gemini / OpenAI / Mock)."""

    name: str = "base"

    @abstractmethod
    def generate_text(self, prompt: str, *, max_tokens: int = 2048, temperature: float = 0.7) -> str:
        """Return plain text generated from the prompt."""

    @abstractmethod
    def generate_json(self, prompt: str, *, max_tokens: int = 4096, temperature: float = 0.4) -> Dict[str, Any]:
        """Return a JSON object parsed from the model output.

        Providers must strip markdown fences before parsing.
        """

    def embed(self, text: str) -> List[float]:
        """Optional embedding support; default returns an empty vector."""
        return []

    def is_available(self) -> bool:
        """Whether this provider is configured and usable right now."""
        return True