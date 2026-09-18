from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    role = Column(String(50), nullable=False, default="admin")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(
        DateTime,
        nullable=False,
        server_default="CURRENT_TIMESTAMP"
    )