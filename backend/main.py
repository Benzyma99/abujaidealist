from fastapi import FastAPI

from routers.programs import router as programs_router
from routers.volunteer_applications import router as volunteer_router
from routers.admin_auth import router as admin_auth_router

app = FastAPI()


@app.get("/")
def home():
    return {"message": "AbujaIdealist API is running"}


app.include_router(
    programs_router,
    prefix="/programs",
    tags=["Programs"]
)
app.include_router(
    volunteer_router,
    prefix="/volunteer-applications",
    tags=["Volunteer Applications"]
)
app.include_router(
    admin_auth_router,
    prefix="/admin-auth",
    tags=["Admin Authentication"]
)