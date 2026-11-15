"""Database engine and session management.

Configured for PostgreSQL using SQLAlchemy.
Connections are lazily initialized so missing or unreachable database connections
do not prevent the application from starting or the health check from responding.
"""

from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Lazy connection initialization with connection timeout
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={
    "connect_timeout": 10,
    "sslmode": "require",
    },
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency that yields a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_health() -> bool:
    """Non-blocking, safe check of PostgreSQL connectivity.

    Returns False if the database is unreachable or not yet provisioned.
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"Database health check failed: {e}")
        return False
