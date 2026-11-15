
from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CareProfileCreate(BaseModel):
    date_of_birth: date | None = None
    gender: str | None = Field(default=None, max_length=30)
    blood_group: str | None = Field(default=None, max_length=5)
    emergency_contact_name: str | None = Field(
        default=None, max_length=150
    )
    emergency_contact_phone: str | None = Field(
        default=None, max_length=20
    )
    medical_notes: str | None = None


class CareProfileUpdate(BaseModel):
    date_of_birth: date | None = None
    gender: str | None = Field(default=None, max_length=30)
    blood_group: str | None = Field(default=None, max_length=5)
    emergency_contact_name: str | None = Field(
        default=None, max_length=150
    )
    emergency_contact_phone: str | None = Field(
        default=None, max_length=20
    )
    medical_notes: str | None = None


class CareProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    elderly_user_id: UUID
    date_of_birth: date | None
    gender: str | None
    blood_group: str | None
    emergency_contact_name: str | None
    emergency_contact_phone: str | None
    medical_notes: str | None
    created_at: datetime
    updated_at: datetime
