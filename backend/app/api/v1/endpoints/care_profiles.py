
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.care_profile import CareProfile
from app.schemas.care_profile import (
    CareProfileCreate,
    CareProfileUpdate,
    CareProfileResponse,
)

router = APIRouter()


def get_owned_profile(
    db: Session,
    user_id,
) -> CareProfile:
    profile = db.scalar(
        select(CareProfile).where(
            CareProfile.elderly_user_id == user_id
        )
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Care profile not found",
        )

    return profile


@router.post(
    "",
    response_model=CareProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_care_profile(
    profile_data: CareProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ELDERLY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only elderly users can create their own care profile",
        )

    existing_profile = db.scalar(
        select(CareProfile).where(
            CareProfile.elderly_user_id == current_user.id
        )
    )

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Care profile already exists",
        )

    profile = CareProfile(
        elderly_user_id=current_user.id,
        **profile_data.model_dump(),
    )

    db.add(profile)

    try:
        db.commit()
        db.refresh(profile)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Care profile already exists",
        )

    return profile


@router.get(
    "/me",
    response_model=CareProfileResponse,
)
def get_my_care_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_owned_profile(db, current_user.id)


@router.patch(
    "/me",
    response_model=CareProfileResponse,
)
def update_my_care_profile(
    profile_data: CareProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_owned_profile(db, current_user.id)

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    try:
        db.commit()
        db.refresh(profile)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update care profile",
        )

    return profile
