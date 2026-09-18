from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(Date, nullable=False)
    location = Column(String(200), nullable=False)
    impact = Column(Text, nullable=False)
    program_id = Column(
        Integer,
        ForeignKey("programs.id"),
        nullable=False
    )
    image_url = Column(Text, nullable=False)

    program = relationship("Program", back_populates="projects")
    news = relationship("News", back_populates="project")