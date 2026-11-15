"""ORM Models package.

Import all models here so Alembic can discover them via Base.metadata.
"""

from app.models.base import Base

__all__ = ["Base"]
