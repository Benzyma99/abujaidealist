from getpass import getpass

from database import SessionLocal
from models.admin_user import AdminUser
from services.password import hash_password


name = input("Admin name: ")
email = input("Admin email: ")
password = getpass("Admin password: ")


db = SessionLocal()

try:
    existing_admin = db.query(AdminUser).filter(
        AdminUser.email == email
    ).first()

    if existing_admin:
        print("An admin with this email already exists.")
    else:
        admin = AdminUser(
            name=name,
            email=email,
            password_hash=hash_password(password)
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully.")

finally:
    db.close()