from sqlalchemy import Column, Integer, String, Text, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    location = Column(String(200), nullable=False)
    program_id = Column(
        Integer,
        ForeignKey("programs.id"),
        nullable=False
    )
    image_url = Column(Text, nullable=False)

    program = relationship(
        "Program",
        back_populates="events"
    )