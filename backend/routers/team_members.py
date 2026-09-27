from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.team_member import TeamMember
from models.department import Department
from schemas.team_member import (
    TeamMemberCreate,
    TeamMemberUpdate,
    TeamMemberResponse
)
from security.auth import get_current_admin

router = APIRouter()


@router.get("/", response_model=list[TeamMemberResponse])
def get_team_members(
    db: Session = Depends(get_db)
):
    team_members = (
        db.query(TeamMember)
        .join(TeamMember.department)
        .filter(TeamMember.is_active == True)
        .order_by(
            TeamMember.is_leadership.desc(),
            TeamMember.display_order
        )
        .all()
    )

    return [
        TeamMemberResponse(
            id=member.id,
            name=member.name,
            role=member.role,
            department_name=member.department.name,
            image_url=member.image_url,
            is_active=member.is_active,
            is_leadership=member.is_leadership,
            display_order=member.display_order
        )
        for member in team_members
    ]
@router.get("/{team_member_id}", response_model=TeamMemberResponse)
def get_team_member(
    team_member_id: int,
    db: Session = Depends(get_db)
):
    team_member = (
        db.query(TeamMember)
        .join(TeamMember.department)
        .filter(TeamMember.id == team_member_id)
        .first()
    )

    if not team_member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    return TeamMemberResponse(
        id=team_member.id,
        name=team_member.name,
        role=team_member.role,
        department_name=team_member.department.name,
        image_url=team_member.image_url,
        is_active=team_member.is_active,
        is_leadership=team_member.is_leadership,
        display_order=team_member.display_order
    )

@router.post("/", response_model=TeamMemberResponse)
def create_team_member(
    team_member: TeamMemberCreate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    department = db.query(Department).filter(
    Department.id == team_member.department_id
).first()

    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    new_team_member = TeamMember(
        name=team_member.name,
        role=team_member.role,
        department_id=team_member.department_id,
        image_url=team_member.image_url,
        is_leadership=team_member.is_leadership,
        display_order=team_member.display_order
    )

    db.add(new_team_member)
    db.commit()
    db.refresh(new_team_member)

    return TeamMemberResponse(
        id=new_team_member.id,
        name=new_team_member.name,
        role=new_team_member.role,
        department_name=department.name,
        image_url=new_team_member.image_url,
        is_active=new_team_member.is_active,
        is_leadership=new_team_member.is_leadership,
        display_order=new_team_member.display_order
    )
    
@router.patch("/{team_member_id}/deactivate", response_model=TeamMemberResponse)
def deactivate_team_member(
    team_member_id: int,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    team_member = db.query(TeamMember).filter(
        TeamMember.id == team_member_id
    ).first()

    if not team_member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    team_member.is_active = False

    db.commit()
    db.refresh(team_member)

    return TeamMemberResponse(
        id=team_member.id,
        name=team_member.name,
        role=team_member.role,
        department_name=team_member.department.name,
        image_url=team_member.image_url,
        is_active=team_member.is_active,
        is_leadership=team_member.is_leadership,
        display_order=team_member.display_order
    )    
    
@router.patch("/{team_member_id}/activate", response_model=TeamMemberResponse)
def activate_team_member(
    team_member_id: int,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    team_member = db.query(TeamMember).filter(
        TeamMember.id == team_member_id
    ).first()

    if not team_member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    team_member.is_active = True

    db.commit()
    db.refresh(team_member)

    return TeamMemberResponse(
        id=team_member.id,
        name=team_member.name,
        role=team_member.role,
        department_name=team_member.department.name,
        image_url=team_member.image_url,
        is_active=team_member.is_active,
        is_leadership=team_member.is_leadership,
        display_order=team_member.display_order
    )

@router.put("/{team_member_id}", response_model=TeamMemberResponse)
def update_team_member(
    team_member_id: int,
    team_member_data: TeamMemberUpdate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    team_member = db.query(TeamMember).filter(
        TeamMember.id == team_member_id
    ).first()

    if not team_member:
        raise HTTPException(
            status_code=404,
            detail="Team member not found"
        )

    department = db.query(Department).filter(
        Department.id == team_member_data.department_id
    ).first()

    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found"
        )

    team_member.name = team_member_data.name
    team_member.role = team_member_data.role
    team_member.department_id = team_member_data.department_id
    team_member.image_url = team_member_data.image_url
    team_member.is_leadership = team_member_data.is_leadership
    team_member.display_order = team_member_data.display_order

    db.commit()
    db.refresh(team_member)

    return TeamMemberResponse(
        id=team_member.id,
        name=team_member.name,
        role=team_member.role,
        department_name=department.name,
        image_url=team_member.image_url,
        is_active=team_member.is_active,
        is_leadership=team_member.is_leadership,
        display_order=team_member.display_order
    )