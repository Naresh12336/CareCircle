
from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.medication import DoseStatus


class MedicationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    dosage: str = Field(min_length=1, max_length=100)
    frequency: str = Field(min_length=1, max_length=100)
    instructions: str | None = None
    start_date: date
    end_date: date | None = None


class MedicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    care_profile_id: UUID
    name: str
    dosage: str
    frequency: str
    instructions: str | None
    start_date: date
    end_date: date | None
    is_active: bool
    created_at: datetime


class DoseCreate(BaseModel):
    scheduled_at: datetime
    status: DoseStatus


class DoseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    medication_id: UUID
    scheduled_at: datetime
    status: DoseStatus
    recorded_at: datetime


class AdherenceResponse(BaseModel):
    total_recorded: int
    taken: int
    missed: int
    skipped: int
    adherence_percentage: float
