from datetime import datetime
from pydantic import BaseModel, ConfigDict


class VolunteerApplicationCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    location: str
    education_background: str
    occupation: str
    previous_volunteering_experience: str
    other_skills_details: str | None = None
    availability: str
    motivation: str
    consent: bool
    skill_ids: list[int]
    program_ids: list[int]


class VolunteerApplicationResponse(BaseModel):
    id: int
    full_name: str
    email: str
    status: str

    model_config = ConfigDict(from_attributes=True)


class SkillResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ProgramResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class VolunteerApplicationAdminResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    location: str
    education_background: str
    occupation: str
    previous_volunteering_experience: str
    other_skills_details: str | None
    availability: str
    motivation: str
    consent: bool
    status: str
    submitted_at: datetime
    skills: list[SkillResponse]
    programs: list[ProgramResponse]

    model_config = ConfigDict(from_attributes=True)


from typing import Literal
    
class VolunteerApplicationStatusUpdate(BaseModel):
    status: Literal["NEW", "REVIEWED", "ACCEPTED", "REJECTED"]