from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NewsCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: str
    project_id: int | None = None


class NewsUpdate(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: str
    project_id: int | None = None


class NewsResponse(BaseModel):
    id: int
    title: str
    excerpt: str
    content: str
    image_url: str
    publication_date: datetime
    project_name: str | None = None

    model_config = ConfigDict(from_attributes=True)