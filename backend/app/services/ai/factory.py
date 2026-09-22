import logging
from typing import Optional
from app.core.config import settings
from app.services.ai.base import AIProvider
from app.services.ai.mock import MockAIProvider

logger = logging.getLogger(__name__)

REGISTRY: dict[str, type[AIProvider]] = {}


def register_provider(provider: type[AIProvider]) -> None:
    REGISTRY[provider.name] = provider


def register_default_providers() -> None:
    from app.services.ai.mock import MockAIProvider
    from app.services.ai.gemini import GeminiProvider
    from app.services.ai.openai import OpenAIProvider

    register_provider(MockAIProvider)
    register_provider(GeminiProvider)
    register_provider(OpenAIProvider)


def get_ai_provider(name: Optional[str] = None) -> AIProvider:
    """Return a configured provider instance.

    Resolution order:
      1. explicit ``name`` if available
      2. settings.AI_PROVIDER if available
      3. the first registered provider that reports is_available()
      4. MockAIProvider (always available)
    """
    if not REGISTRY:
        register_default_providers()

    requested = name or settings.AI_PROVIDER
    if requested and requested in REGISTRY:
        provider = REGISTRY[requested]()
        if provider.is_available():
            return provider
        logger.warning("AI provider '%s' is not configured; trying available providers.", requested)

    for provider_cls in REGISTRY.values():
        candidate = provider_cls()
        if provider_cls is not MockAIProvider and candidate.is_available():
            return candidate

    return MockAIProvider()


PROVIDER = get_ai_provider()