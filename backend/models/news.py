from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    excerpt = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(Text, nullable=False)
    publication_date = Column(
        DateTime,
        nullable=False,
        server_default="CURRENT_TIMESTAMP"
    )
    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=True
    )

    project = relationship(
        "Project",
        back_populates="news"
    )