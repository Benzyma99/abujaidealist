from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    role = Column(String(150), nullable=False)
    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=False
    )
    image_url = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    department = relationship(
        "Department",
        back_populates="team_members"
    )