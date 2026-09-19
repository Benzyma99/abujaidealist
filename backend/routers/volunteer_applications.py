import os
from dotenv import load_dotenv

load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

from security.auth import get_current_admin
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.email import send_email

from database import get_db
from models.volunteer_application import (
    VolunteerApplication,
    volunteer_application_skills,
    volunteer_application_programs
)
from schemas.volunteer_application import (
    VolunteerApplicationCreate,
    VolunteerApplicationResponse,
    VolunteerApplicationAdminResponse,
    VolunteerApplicationStatusUpdate
)


router = APIRouter()


@router.get("/", response_model=list[VolunteerApplicationAdminResponse])
def get_volunteer_applications(
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    applications = db.query(VolunteerApplication).all()

    return applications


@router.get("/{application_id}", response_model=VolunteerApplicationAdminResponse)
def get_volunteer_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    application = db.query(VolunteerApplication).filter(
        VolunteerApplication.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Volunteer application not found"
        )

    return application


@router.patch(
    "/{application_id}/status",
    response_model=VolunteerApplicationAdminResponse
)
def update_volunteer_application_status(
    application_id: int,
    status_update: VolunteerApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    application = db.query(VolunteerApplication).filter(
        VolunteerApplication.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Volunteer application not found"
        )

    application.status = status_update.status

    db.commit()
    db.refresh(application)

    return application


@router.post("/", response_model=VolunteerApplicationResponse)
def create_volunteer_application(
    application: VolunteerApplicationCreate,
    db: Session = Depends(get_db)
):
    new_application = VolunteerApplication(
        full_name=application.full_name,
        email=application.email,
        phone=application.phone,
        location=application.location,
        education_background=application.education_background,
        occupation=application.occupation,
        previous_volunteering_experience=application.previous_volunteering_experience,
        other_skills_details=application.other_skills_details,
        availability=application.availability,
        motivation=application.motivation,
        consent=application.consent
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    for skill_id in application.skill_ids:
        db.execute(
            volunteer_application_skills.insert().values(
                volunteer_application_id=new_application.id,
                skill_id=skill_id
            )
        )

    db.commit()

    for program_id in application.program_ids:
        db.execute(
            volunteer_application_programs.insert().values(
                volunteer_application_id=new_application.id,
                program_id=program_id
            )
        )

    db.commit()

    try:
        send_email(
            to_email=new_application.email,
            subject="We received your AbujaIdealist volunteer application",
            body=f"""Hello {new_application.full_name},

Thank you for your interest in volunteering with AbujaIdealist.

We have received your volunteer application and our team will review it.

We appreciate your willingness to Connect. Inspire. Act.

Best regards,
AbujaIdealist
"""
        )
    except Exception as e:
        print(f"Applicant email failed: {e}")

    try:
        send_email(
            to_email=ADMIN_EMAIL,
            subject="New AbujaIdealist Volunteer Application",
            body=f"""A new volunteer application has been submitted.

Name: {new_application.full_name}
Email: {new_application.email}
Phone: {new_application.phone}
Location: {new_application.location}
Occupation: {new_application.occupation}
Availability: {new_application.availability}

Please log in to the AbujaIdealist admin dashboard to review the full application.

AbujaIdealist
"""
        )
    except Exception as e:
        print(f"Admin notification email failed: {e}")

    return new_application
