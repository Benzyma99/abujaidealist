from pydantic import BaseModel, ConfigDict


class TeamMemberCreate(BaseModel):
    name: str
    role: str
    department_id: int
    image_url: str
    is_leadership: bool = False
    display_order: int = 0


class TeamMemberUpdate(BaseModel):
    name: str
    role: str
    department_id: int
    image_url: str
    is_leadership: bool
    display_order: int


class TeamMemberResponse(BaseModel):
    id: int
    name: str
    role: str
    department_name: str
    image_url: str
    is_active: bool
    is_leadership: bool
    display_order: int

    model_config = ConfigDict(from_attributes=True)