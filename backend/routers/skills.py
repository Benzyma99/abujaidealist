from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

router = APIRouter()


@router.get("/")
def get_skills(db: Session = Depends(get_db)):
    from sqlalchemy import text

    result = db.execute(
        text("""
            SELECT id, name
            FROM skills
            ORDER BY id
        """)
    )

    return [
        {
            "id": row.id,
            "name": row.name
        }
        for row in result
    ]