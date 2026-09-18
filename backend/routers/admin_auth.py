from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.admin_user import AdminUser
from schemas.admin_user import AdminLogin
from services.password import verify_password
from security.auth import create_access_token


router = APIRouter()


@router.post("/login")
def admin_login(
    login: AdminLogin,
    db: Session = Depends(get_db)
):
    admin = db.query(AdminUser).filter(
        AdminUser.email == login.email
    ).first()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        login.password,
        admin.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(admin.id)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "admin_id": admin.id,
        "name": admin.name,
        "email": admin.email
    }


