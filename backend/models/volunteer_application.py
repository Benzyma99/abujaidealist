from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    Table,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base


volunteer_application_skills = Table(
    "volunteer_application_skills",
    Base.metadata,
    Column(
        "volunteer_application_id",
        ForeignKey("volunteer_applications.id"),
        primary_key=True
    ),
    Column(
        "skill_id",
        ForeignKey("skills.id"),
        primary_key=True
    )
)


volunteer_application_programs = Table(
    "volunteer_application_programs",
    Base.metadata,
    Column(
        "volunteer_application_id",
        ForeignKey("volunteer_applications.id"),
        primary_key=True
    ),
    Column(
        "program_id",
        ForeignKey("programs.id"),
        primary_key=True
    )
)


class VolunteerApplication(Base):
    __tablename__ = "volunteer_applications"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=False)
    location = Column(String(150), nullable=False)

    education_background = Column(Text, nullable=False)
    occupation = Column(String(150), nullable=False)
    previous_volunteering_experience = Column(Text, nullable=False)

    other_skills_details = Column(Text, nullable=True)
    availability = Column(Text, nullable=False)

    motivation = Column(Text, nullable=False)
    consent = Column(Boolean, nullable=False)
    status = Column(String(30), nullable=False, default="NEW")
    submitted_at = Column(
        DateTime,
        nullable=False,
        server_default="CURRENT_TIMESTAMP"
    )

    skills = relationship(
        "Skill",
        secondary=volunteer_application_skills
    )

    programs = relationship(
        "Program",
        secondary=volunteer_application_programs
    )