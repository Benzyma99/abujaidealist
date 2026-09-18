from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from database import Base


class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    image_url = Column(Text, nullable=False)

    projects = relationship("Project", back_populates="program")
    events = relationship("Event", back_populates="program")