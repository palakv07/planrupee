"""Structured request logging middleware.

Logs method, path, status and duration for every request without ever logging
sensitive payloads, tokens, or query secrets.
"""

import logging
import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger("planrupee.request")


SENSITIVE_PATHS = ("/auth/login", "/auth/register", "/payments")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        path = request.url.path
        if not any(path.startswith(p) for p in SENSITIVE_PATHS):
            logger.info(
                "request method=%s path=%s status=%s duration_ms=%s",
                request.method,
                path,
                response.status_code,
                duration_ms,
            )
        return response