from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.department import Department
from schemas.department import DepartmentResponse

router = APIRouter()


@router.get("/", response_model=list[DepartmentResponse])
def get_departments(
    db: Session = Depends(get_db)
):
    departments = (
        db.query(Department)
        .order_by(Department.id)
        .all()
    )

    return departments