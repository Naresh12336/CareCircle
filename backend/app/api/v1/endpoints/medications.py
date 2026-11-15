
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.care_profile import CareProfile
from app.models.medication import Medication, MedicationDose, DoseStatus
from app.schemas.medication import (
    MedicationCreate,
    MedicationResponse,
    DoseCreate,
    DoseResponse,
    AdherenceResponse,
)

router = APIRouter()


def get_my_profile(db: Session, user: User):
    if user.role != UserRole.ELDERLY:
        raise HTTPException(
            status_code=403,
            detail="Only the profile owner can manage medications",
        )

    profile = db.scalar(
        select(CareProfile).where(
            CareProfile.elderly_user_id == user.id
        )
    )

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Care profile not found",
        )

    return profile


def get_owned_medication(
    db: Session,
    medication_id: UUID,
    user: User,
):
    profile = get_my_profile(db, user)

    medication = db.scalar(
        select(Medication).where(
            Medication.id == medication_id,
            Medication.care_profile_id == profile.id,
        )
    )

    if medication is None:
        raise HTTPException(
            status_code=404,
            detail="Medication not found",
        )

    return medication


@router.post(
    "",
    response_model=MedicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_medication(
    data: MedicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_my_profile(db, current_user)

    if data.end_date and data.end_date < data.start_date:
        raise HTTPException(
            status_code=422,
            detail="End date cannot be before start date",
        )

    medication = Medication(
        care_profile_id=profile.id,
        **data.model_dump(),
    )

    db.add(medication)
    db.commit()
    db.refresh(medication)

    return medication


@router.get("", response_model=list[MedicationResponse])
def list_medications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_my_profile(db, current_user)

    return db.scalars(
        select(Medication)
        .where(Medication.care_profile_id == profile.id)
        .order_by(Medication.created_at.desc())
    ).all()


@router.post(
    "/{medication_id}/doses",
    response_model=DoseResponse,
    status_code=status.HTTP_201_CREATED,
)
def record_dose(
    medication_id: UUID,
    data: DoseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medication = get_owned_medication(
        db, medication_id, current_user
    )

    if not medication.is_active:
        raise HTTPException(
            status_code=400,
            detail="Cannot record a dose for an inactive medication",
        )

    dose = MedicationDose(
        medication_id=medication.id,
        **data.model_dump(),
    )

    db.add(dose)

    try:
        db.commit()
        db.refresh(dose)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Unable to record this dose",
        )

    return dose


@router.get(
    "/{medication_id}/adherence",
    response_model=AdherenceResponse,
)
def get_adherence(
    medication_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    medication = get_owned_medication(
        db, medication_id, current_user
    )

    doses = db.scalars(
        select(MedicationDose).where(
            MedicationDose.medication_id == medication.id
        )
    ).all()

    taken = sum(d.status == DoseStatus.TAKEN for d in doses)
    missed = sum(d.status == DoseStatus.MISSED for d in doses)
    skipped = sum(d.status == DoseStatus.SKIPPED for d in doses)

    total = len(doses)
    percentage = round((taken / total) * 100, 2) if total else 0.0

    return AdherenceResponse(
        total_recorded=total,
        taken=taken,
        missed=missed,
        skipped=skipped,
        adherence_percentage=percentage,
    )
