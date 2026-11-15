"""Application Configuration using Pydantic Settings."""

from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CareCircle"
    PROJECT_DESCRIPTION: str = "Elderly Care and Medication Management Platform"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return v

    # PostgreSQL Database URL
    DATABASE_URL: str = "postgresql+psycopg2://carecircle:carecircle_secret@localhost:5432/carecircle_db"

    # Private Storage
    UPLOAD_DIR: str = "storage/uploads"

    # Security placeholders
    SECRET_KEY: str = "insecure-placeholder-change-in-production"
    PASSCODE_SALT: str = "insecure-salt-placeholder"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Optional AI / Gemini
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
