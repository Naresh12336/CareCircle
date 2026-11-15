
from fastapi import APIRouter

from app.api.v1.endpoints import (
    health,
    auth,
    care_profiles,
    medications,
)

api_router = APIRouter()

api_router.include_router(
    health.router,
    prefix="",
    tags=["Health"],
)

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

api_router.include_router(
    care_profiles.router,
    prefix="/care-profiles",
    tags=["Care Profiles"],
)

api_router.include_router(
    medications.router,
    prefix="/medications",
    tags=["Medications"],
)
