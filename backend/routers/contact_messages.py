from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.contact_message import ContactMessage
from schemas.contact_message import (
    ContactMessageCreate,
    ContactMessageResponse
)
from security.auth import get_current_admin

router = APIRouter()


@router.post("/", response_model=ContactMessageResponse)
def create_contact_message(
    message_data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    new_message = ContactMessage(
        full_name=message_data.full_name,
        email=message_data.email,
        subject=message_data.subject,
        message=message_data.message
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return new_message


@router.get(
    "/",
    response_model=list[ContactMessageResponse]
)
def get_contact_messages(
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    return (
        db.query(ContactMessage)
        .order_by(ContactMessage.submitted_at.desc())
        .all()
    )


@router.get(
    "/{message_id}",
    response_model=ContactMessageResponse
)
def get_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    message = (
        db.query(ContactMessage)
        .filter(ContactMessage.id == message_id)
        .first()
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Contact message not found"
        )

    return message