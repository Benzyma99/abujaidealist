from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.project import Project
from models.program import Program
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from security.auth import get_current_admin

router = APIRouter()


def build_project_response(project: Project) -> ProjectResponse:
    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        date=project.date,
        location=project.location,
        impact=project.impact,
        program_name=project.program.name,
        image_url=project.image_url
    )


@router.get("/", response_model=list[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db)
):
    projects = (
        db.query(Project)
        .order_by(Project.date.desc())
        .all()
    )

    return [
        build_project_response(project)
        for project in projects
    ]


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return build_project_response(project)


@router.post("/", response_model=ProjectResponse)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    program = db.query(Program).filter(
        Program.id == project_data.program_id
    ).first()

    if not program:
        raise HTTPException(
            status_code=404,
            detail="Program not found"
        )

    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        date=project_data.date,
        location=project_data.location,
        impact=project_data.impact,
        program_id=project_data.program_id,
        image_url=project_data.image_url
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return build_project_response(new_project)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    program = db.query(Program).filter(
        Program.id == project_data.program_id
    ).first()

    if not program:
        raise HTTPException(
            status_code=404,
            detail="Program not found"
        )

    project.name = project_data.name
    project.description = project_data.description
    project.date = project_data.date
    project.location = project_data.location
    project.impact = project_data.impact
    project.program_id = project_data.program_id
    project.image_url = project_data.image_url

    db.commit()
    db.refresh(project)

    return build_project_response(project)


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully"
    }