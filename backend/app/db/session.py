import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL
if os.getenv("TESTING") == "1":
    db_url = settings.SQLITE_URL

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

is_sqlite = "sqlite" in db_url

if not is_sqlite:
    try:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 2},
            echo=False
        )
        with engine.connect() as conn:
            logger.info("Successfully connected to PostgreSQL database.")
    except Exception as e:
        if settings.ALLOW_SQLITE_FALLBACK:
            logger.warning(f"PostgreSQL unreachable ({e}). Using local SQLite: {settings.SQLITE_URL}")
            db_url = settings.SQLITE_URL
            is_sqlite = True
            engine = create_engine(
                db_url,
                connect_args={"check_same_thread": False},
                echo=False
            )
        else:
            raise e
else:
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False},
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
