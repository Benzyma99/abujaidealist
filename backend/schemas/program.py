from pydantic import BaseModel

class ProgramCreate(BaseModel):
    name: str
    description: str
    image_url: str