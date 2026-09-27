from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="NEW")
    submitted_at = Column(
        DateTime,
        nullable=False,
        server_default="CURRENT_TIMESTAMP"
    )