
import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    String,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class RelationshipStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    REVOKED = "revoked"


class CareRelationship(Base):
    __tablename__ = "care_relationships"

    __table_args__ = (
        UniqueConstraint(
            "care_profile_id",
            "user_id",
            name="uq_care_profile_user",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    care_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("care_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    relationship_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    can_view_medications: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    can_manage_medications: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    can_view_appointments: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    can_manage_appointments: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    status: Mapped[RelationshipStatus] = mapped_column(
        Enum(
            RelationshipStatus,
            name="relationship_status",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        default=RelationshipStatus.PENDING,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    care_profile = relationship(
        "CareProfile",
        back_populates="relationships",
    )

    user = relationship("User")
