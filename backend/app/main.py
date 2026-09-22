import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, HTTPException
from app.core.config import settings
from app.core.logging import RequestLoggingMiddleware
from app.core.rate_limit import RateLimitMiddleware
from app.db.session import SessionLocal, engine
from app.utils.seed import init_db
from app.api.v1.router import api_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(name)s | %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing PlanRupee database and checking seed state...")
    db = SessionLocal()
    try:
        init_db(db)
    except Exception as e:
        logger.error(f"Error during database startup seed: {e}")
    finally:
        db.close()
    yield
    logger.info("Shutting down PlanRupee API...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered travel planning with local expertise and human concierge.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Request logging + CORS Middleware
app.add_middleware(RateLimitMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers for structured error responses
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    message = "; ".join([f"{err.get('loc', ['field'])[-1]}: {err.get('msg', 'invalid')}" for err in errors])
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": message,
                "details": errors
            }
        }
    )


# Keep HTTPException responses consistent with the rest of the API
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": str(exc.detail),
            },
        },
        headers=exc.headers,
    )


# Generic catch-all so the API never crashes on an unhandled error
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred. Please try again.",
            },
        },
    )


@app.get("/api/health", tags=["Health"])
@app.get("/health", tags=["Health"])
def health_check():
    db_type = "sqlite" if "sqlite" in str(engine.url) else "postgresql"
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_type,
        "philosophy": "AI plans. Locals advise. Concierge executes."
    }


# Include Routers with both /api and /api/v1 prefixes
app.include_router(api_router, prefix="/api")
app.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
