from datetime import date

from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    name: str
    description: str
    date: date
    location: str
    impact: str
    program_id: int
    image_url: str


class ProjectUpdate(BaseModel):
    name: str
    description: str
    date: date
    location: str
    impact: str
    program_id: int
    image_url: str


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str
    date: date
    location: str
    impact: str
    program_name: str
    image_url: str

    model_config = ConfigDict(from_attributes=True)