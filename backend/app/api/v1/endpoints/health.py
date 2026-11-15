"""Health check endpoint."""

from fastapi import APIRouter
from app.core.config import settings
from app.core.database import check_db_health
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Service Health Check")
def health_check() -> HealthResponse:
    """Check system health status.

    Returns the application status, current environment, version, and database connectivity.
    Does not fail if the database connection has not been initialized.
    """
    db_ok = check_db_health()
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database="connected" if db_ok else "disconnected",
    )
