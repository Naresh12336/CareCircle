"""Health check response schemas."""

from datetime import datetime, timezone
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="Overall service status")
    project: str = Field(default="CareCircle", description="Application name")
    version: str = Field(default="0.1.0", description="API version")
    environment: str = Field(default="development", description="Current environment")
    database: str = Field(default="disconnected", description="Database connection status")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC timestamp of the health check"
    )
