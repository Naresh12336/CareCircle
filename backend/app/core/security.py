"""Security and authentication placeholder module.

Authentication and role-based access control (RBAC) will be implemented in subsequent phases.
This module will manage passcode hashing, verification, token generation, and RBAC policies.
"""

from typing import Optional


def hash_passcode(passcode: str) -> str:
    """Placeholder for passcode hashing."""
    raise NotImplementedError("Passcode hashing will be implemented in the authentication phase.")


def verify_passcode(plain_passcode: str, hashed_passcode: str) -> bool:
    """Placeholder for passcode verification."""
    raise NotImplementedError("Passcode verification will be implemented in the authentication phase.")


def create_access_token(subject: str, expires_delta: Optional[int] = None) -> str:
    """Placeholder for JWT / secure session token creation."""
    raise NotImplementedError("Token generation will be implemented in the authentication phase.")
