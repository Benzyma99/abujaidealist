from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.program import Program
from schemas.program import ProgramCreate


router = APIRouter()


@router.get("/")
def get_programs(db: Session = Depends(get_db)):
    return db.query(Program).all()


@router.post("/")
def create_program(program: ProgramCreate, db: Session = Depends(get_db)):
    new_program = Program(
        name=program.name,
        description=program.description,
        image_url=program.image_url
    )

    db.add(new_program)
    db.commit()
    db.refresh(new_program)

    return new_program


@router.get("/{program_id}")
def get_program(program_id: int, db: Session = Depends(get_db)):
    program = db.query(Program).filter(
        Program.id == program_id
    ).first()

    if not program:
        raise HTTPException(
            status_code=404,
            detail="Program not found"
        )

    return program


@router.put("/{program_id}")
def update_program(
    program_id: int,
    program: ProgramCreate,
    db: Session = Depends(get_db)
):
    existing_program = db.query(Program).filter(
        Program.id == program_id
    ).first()

    if not existing_program:
        raise HTTPException(
            status_code=404,
            detail="Program not found"
        )

    existing_program.name = program.name
    existing_program.description = program.description
    existing_program.image_url = program.image_url

    db.commit()
    db.refresh(existing_program)

    return existing_program


@router.delete("/{program_id}")
def delete_program(
    program_id: int,
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(
        Program.id == program_id
    ).first()

    if not program:
        raise HTTPException(
            status_code=404,
            detail="Program not found"
        )

    db.delete(program)
    db.commit()

    return {"message": "Program deleted successfully"}