
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

password_hash = PasswordHash.recommended()

ALGORITHM = "HS256"


def hash_passcode(passcode: str) -> str:
    """Hash a user's password using Argon2."""
    return password_hash.hash(passcode)


def verify_passcode(plain_passcode: str, hashed_passcode: str) -> bool:
    """Verify a password against its stored Argon2 hash."""
    return password_hash.verify(plain_passcode, hashed_passcode)


def create_access_token(
    subject: str,
    expires_delta: Optional[int] = None,
) -> str:
    """Generate a signed JWT access token."""
    if expires_delta is None:
        expires_delta = settings.ACCESS_TOKEN_EXPIRE_MINUTES

    now = datetime.now(timezone.utc)

    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(minutes=expires_delta),
        "type": "access",
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token."""
    payload = jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[ALGORITHM],
        options={"require": ["exp", "sub"]},
    )

    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("Invalid token type")

    return payload
