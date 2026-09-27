from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ContactMessageCreate(BaseModel):
    full_name: str
    email: str
    subject: str
    message: str


class ContactMessageResponse(BaseModel):
    id: int
    full_name: str
    email: str
    subject: str
    message: str
    status: str
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)