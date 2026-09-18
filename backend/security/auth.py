import os
from datetime import datetime, timedelta, timezone
from database import get_db
from models.admin_user import AdminUser

from dotenv import load_dotenv
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


load_dotenv()


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)


security = HTTPBearer()


def create_access_token(admin_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(admin_id),
        "exp": expire
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


def verify_access_token(token: str) -> int:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        admin_id = payload.get("sub")

        if admin_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        return int(admin_id)

    except (JWTError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> int:
    admin_id = verify_access_token(credentials.credentials)

    admin = db.query(AdminUser).filter(
        AdminUser.id == admin_id
    ).first()

    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=401,
            detail="Admin account is inactive or does not exist"
        )

    return admin.id