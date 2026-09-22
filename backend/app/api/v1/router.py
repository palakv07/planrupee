from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.trips import router as trips_router
from app.api.v1.itinerary import router as itinerary_router
from app.api.v1.places import router as places_router
from app.api.v1.locals import router as locals_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.saved import router as saved_router
from app.api.v1.concierge import router as concierge_router
from app.api.v1.ai import router as ai_router
from app.api.v1.payments import router as payments_router
from app.api.v1.admin import router as admin_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(trips_router)
api_router.include_router(itinerary_router)
api_router.include_router(places_router)
api_router.include_router(locals_router)
api_router.include_router(bookings_router)
api_router.include_router(reviews_router)
api_router.include_router(saved_router)
api_router.include_router(concierge_router)
api_router.include_router(ai_router)
api_router.include_router(payments_router)
api_router.include_router(admin_router)

__all__ = ["api_router"]