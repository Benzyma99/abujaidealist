from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.event import Event
from models.program import Program
from schemas.event import EventCreate, EventUpdate, EventResponse
from security.auth import get_current_admin

router = APIRouter()


def build_event_response(event: Event) -> EventResponse:
    return EventResponse(
        id=event.id,
        name=event.name,
        description=event.description,
        date=event.date,
        start_time=event.start_time,
        end_time=event.end_time,
        location=event.location,
        program_name=event.program.name,
        image_url=event.image_url
    )


@router.get("/", response_model=list[EventResponse])
def get_events(
    db: Session = Depends(get_db)
):
    events = (
        db.query(Event)
        .order_by(Event.date.desc(), Event.start_time)
        .all()
    )

    return [
        build_event_response(event)
        for event in events
    ]


@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return build_event_response(event)


@router.post("/", response_model=EventResponse)
def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    program = db.query(Program).filter(
        Program.id == event_data.program_id
    ).first()

    if not program:
        raise HTTPException(
            status_code=404,
            detail="Program not found"
        )

    new_event = Event(
        name=event_data.name,
        description=event_data.description,
        date=event_data.date,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
        location=event_data.location,
        program_id=event_data.program_id,
        image_url=event_data.image_url
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return build_event_response(new_event)


@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    event = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    program = db.query(Program).filter(
        Program.id == event_data.program_id
    ).first()

    if not program:
        raise HTTPException(
            status_code=404,
            detail="Program not found"
        )

    event.name = event_data.name
    event.description = event_data.description
    event.date = event_data.date
    event.start_time = event_data.start_time
    event.end_time = event_data.end_time
    event.location = event_data.location
    event.program_id = event_data.program_id
    event.image_url = event_data.image_url

    db.commit()
    db.refresh(event)

    return build_event_response(event)


@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_admin: int = Depends(get_current_admin)
):
    event = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    db.delete(event)
    db.commit()

    return {
        "message": "Event deleted successfully"
    }