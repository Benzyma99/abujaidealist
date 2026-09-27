from datetime import date, time

from pydantic import BaseModel, ConfigDict


class EventCreate(BaseModel):
    name: str
    description: str
    date: date
    start_time: time
    end_time: time
    location: str
    program_id: int
    image_url: str


class EventUpdate(BaseModel):
    name: str
    description: str
    date: date
    start_time: time
    end_time: time
    location: str
    program_id: int
    image_url: str


class EventResponse(BaseModel):
    id: int
    name: str
    description: str
    date: date
    start_time: time
    end_time: time
    location: str
    program_name: str
    image_url: str

    model_config = ConfigDict(from_attributes=True)