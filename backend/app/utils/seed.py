import json
import logging
from pathlib import Path
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.models.place import Place
from app.models.local import Local
from app.models.trip import Trip, ItineraryDay, Activity
from app.models.booking import Booking
from app.models.review import Review
from app.models.saved import SavedPlace, SavedLocal
from app.models.concierge import ConciergeRequest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_FILE = Path(__file__).parent.parent / "data" / "seed_data.json"


def init_db(db: Session) -> None:
    # 1. Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created or verified.")

    # 2. Seed Users
    admin_email = "admin@planrupee.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        admin = User(
            name="PlanRupee Admin",
            email=admin_email,
            password_hash=get_password_hash("Admin@123456"),
            role="admin",
            bio="Lead Operations & Trust Moderator for PlanRupee Platform"
        )
        db.add(admin)
        logger.info(f"Seeded Admin User: {admin_email}")

    local_email = "simran@planrupee.com"
    local_user = db.query(User).filter(User.email == local_email).first()
    if not local_user:
        local_user = User(
            name="Simran Kaur",
            email=local_email,
            password_hash=get_password_hash("Local@123456"),
            role="local",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            bio="Born and raised in Sector 9, Chandigarh. Coffee geek, courtyard cafe explorer and architecture heritage guide."
        )
        db.add(local_user)
        logger.info(f"Seeded Local User: {local_email}")

    traveler_email = "traveler@planrupee.com"
    traveler = db.query(User).filter(User.email == traveler_email).first()
    if not traveler:
        traveler = User(
            name="Aman Varma",
            email=traveler_email,
            password_hash=get_password_hash("Traveler@123456"),
            role="traveler",
            bio="Curious traveler exploring Punjab culinary trails."
        )
        db.add(traveler)
        logger.info(f"Seeded Traveler User: {traveler_email}")

    db.commit()

    # 3. Seed Places & Locals from seed_data.json
    if DATA_FILE.exists():
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Seed Places
        if db.query(Place).count() == 0:
            for p in data.get("places", []):
                place = Place(
                    id=p["id"],
                    name=p["name"],
                    city=p["city"],
                    state="Punjab/UT",
                    country="India",
                    category=p["category"],
                    description=p["description"],
                    address=p["address"],
                    latitude=p.get("coordinates", {}).get("lat") if p.get("coordinates") else None,
                    longitude=p.get("coordinates", {}).get("lng") if p.get("coordinates") else None,
                    image_url=p["images"][0] if p.get("images") else None,
                    images=p.get("images", []),
                    opening_hours=p.get("openingHours", "10:00 AM – 08:00 PM"),
                    estimated_cost=p.get("approxCostInr", 300),
                    price_level=p.get("priceLevel", "₹₹"),
                    rating=p.get("rating", 4.5),
                    review_count=p.get("reviewCount", 0),
                    best_time=p.get("bestTimeToVisit", "Morning"),
                    duration_minutes=90,
                    verification_status=p.get("verificationStatus", "verified"),
                    why_recommended=p.get("whyPlanRupeeRecommends"),
                    tags=p.get("tags", [])
                )
                db.add(place)
            db.commit()
            logger.info(f"Seeded {len(data.get('places', []))} places.")

        # Seed Locals
        if db.query(Local).count() == 0:
            for l in data.get("locals", []):
                uid = local_user.id if l["id"] == "local-simran" else None
                local = Local(
                    id=l["id"],
                    user_id=uid,
                    name=l["name"],
                    city=l["city"],
                    title=l["title"],
                    avatar=l["avatar"],
                    bio=l["bio"],
                    why_choose_me=l.get("whyChooseMe"),
                    expertise=l.get("expertise", []),
                    languages=l.get("languages", []),
                    consultation_fee=l.get("consultationFee", 799),
                    rating=l.get("rating", 4.9),
                    review_count=l.get("reviewCount", 0),
                    years_local=10,
                    travelers_helped=l.get("travelersHelped", 0),
                    verification_status=l.get("verificationStatus", "verified"),
                    verified=l.get("verified", True),
                    availability=l.get("availability", "Daily, 10:00 AM – 08:00 PM IST"),
                    instagram_handle=l.get("instagramHandle"),
                    local_picks=l.get("localPicks", {}),
                    reels=l.get("reels", []),
                    places_i_love_ids=l.get("placesILoveIds", [])
                )
                db.add(local)
            db.commit()
            logger.info(f"Seeded {len(data.get('locals', []))} locals.")

        # Seed Reviews
        if db.query(Review).count() == 0:
            for r in data.get("place_reviews", []):
                review = Review(
                    id=r["id"],
                    user_id=traveler.id,
                    place_id=r["placeId"],
                    local_id=None,
                    author_name=r["authorName"],
                    author_location=r.get("authorLocation"),
                    rating=r["overallRating"],
                    comment=r["comment"],
                    verified=(r.get("verificationType") == "verified_visit"),
                    ratings_breakdown={
                        "foodRating": r.get("foodRating", 5),
                        "ambienceRating": r.get("ambienceRating", 5),
                        "valueRating": r.get("valueRating", 5),
                        "cleanlinessRating": r.get("cleanlinessRating", 5),
                        "experienceRating": r.get("experienceRating", 5)
                    }
                )
                db.add(review)

            for r in data.get("local_reviews", []):
                review = Review(
                    id=r["id"],
                    user_id=traveler.id,
                    place_id=None,
                    local_id=r["localId"],
                    author_name=r["authorName"],
                    author_location=r.get("authorCity"),
                    rating=r["overallRating"],
                    comment=r["comment"],
                    verified=(r.get("verificationType") == "verified_consultation"),
                    ratings_breakdown={
                        "knowledgeRating": r.get("knowledgeRating", 5),
                        "helpfulnessRating": r.get("helpfulnessRating", 5),
                        "responsivenessRating": r.get("responsivenessRating", 5),
                        "recommendationQualityRating": r.get("recommendationQualityRating", 5)
                    }
                )
                db.add(review)
            db.commit()
            logger.info("Seeded place and local reviews.")

    # 4. Seed default Sample Concierge Request
    if db.query(ConciergeRequest).count() == 0:
        cr = ConciergeRequest(
            id="cr-sample-1",
            user_id=traveler.id,
            category="Food",
            request="Arrange an authentic candlelit table at Virgin Courtyard with curated Italian tasting menu for 2 guests.",
            destination="Chandigarh",
            timing="Tonight, 8:30 PM",
            budget="₹3,000",
            travelers="2",
            contact_name="Aman Varma",
            contact_phone="+91 98140 XXXXX",
            status="LOCAL_ASSIGNED",
            updates=[
                {"timestamp": "07:15 PM", "stage": "REQUEST_RECEIVED", "sender": "System", "note": "Concierge request logged and validated by PlanRupee Priority desk."},
                {"timestamp": "07:22 PM", "stage": "PLANRUPEE_CONCIERGE", "sender": "PlanRupee Concierge", "note": "Assigned to Senior Concierge Rajesh. Reviewing courtyard table availability at Virgin Courtyard."},
                {"timestamp": "07:35 PM", "stage": "LOCAL_PARTNER", "sender": "Local Partner", "note": "Virgin Courtyard GM confirmed outdoor bougainvillea pergola table. Finalizing tasting menu pairing."}
            ]
        )
        db.add(cr)
        db.commit()
        logger.info("Seeded sample concierge request.")

    # 5. Seed default Saved Items
    if db.query(SavedPlace).count() == 0:
        db.add(SavedPlace(user_id=traveler.id, place_id="chd-rock-garden"))
        db.add(SavedPlace(user_id=traveler.id, place_id="chd-pal-dhaba"))
    if db.query(SavedLocal).count() == 0:
        db.add(SavedLocal(user_id=traveler.id, local_id="local-simran"))
    db.commit()
    logger.info("Database seeding completed successfully.")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
