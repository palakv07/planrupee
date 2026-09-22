"""Simple in-memory rate limiter (no extra dependencies)."""

from __future__ import annotations

import time
from collections import defaultdict, deque
from typing import Deque, Dict, Tuple

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Token-bucket-ish sliding window per client IP.

    Auth and payment endpoints are tighter; public reads are looser.
    Disabled automatically when TESTING=1 so pytest stays deterministic.
    """

    def __init__(self, app, *, window_seconds: int = 60) -> None:
        super().__init__(app)
        self.window = window_seconds
        self._hits: Dict[Tuple[str, str], Deque[float]] = defaultdict(deque)

    def _limit_for(self, path: str, method: str) -> int:
        if path.startswith("/api/auth"):
            return 20
        if path.startswith("/api/payments"):
            return 30
        if method in ("POST", "PUT", "PATCH", "DELETE"):
            return 60
        return 180

    async def dispatch(self, request: Request, call_next):
        import os

        if os.getenv("TESTING") == "1":
            return await call_next(request)

        path = request.url.path
        if path in ("/health", "/api/health", "/docs", "/redoc", "/openapi.json"):
            return await call_next(request)

        client = request.client.host if request.client else "unknown"
        key = (client, path.split("?")[0])
        now = time.time()
        bucket = self._hits[key]
        while bucket and now - bucket[0] > self.window:
            bucket.popleft()

        limit = self._limit_for(path, request.method)
        if len(bucket) >= limit:
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "error": {
                        "code": "RATE_LIMITED",
                        "message": "Too many requests. Please wait a moment and try again.",
                    },
                },
            )
        bucket.append(now)
        return await call_next(request)
