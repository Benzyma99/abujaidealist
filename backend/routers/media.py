import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from security.auth import get_current_admin

router = APIRouter()

MEDIA_DIR = "media/team"

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("/team")
async def upload_team_image(
    file: UploadFile = File(...),
    current_admin: int = Depends(get_current_admin)
):
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG, and WEBP images are allowed"
        )

    os.makedirs(MEDIA_DIR, exist_ok=True)

    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(MEDIA_DIR, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "message": "Image uploaded successfully",
        "filename": filename,
        "image_url": f"/media/team/{filename}"
    }