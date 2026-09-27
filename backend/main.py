from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from routers.programs import router as programs_router
from routers.volunteer_applications import router as volunteer_router
from routers.admin_auth import router as admin_auth_router
from routers.team_members import router as team_members_router
from routers.departments import router as departments_router
from routers.media import router as media_router
from routers.projects import router as projects_router
from routers.events import router as events_router
from routers.news import router as news_router
from routers.contact_messages import router as contact_messages_router
from routers.skills import router as skills_router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AbujaIdealist API is running"}
    
app.include_router(skills_router, prefix="/skills", tags=["Skills"])

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

app.include_router(
    team_members_router,
    prefix="/team-members",
    tags=["Team Members"]
)

app.include_router(
    departments_router,
    prefix="/departments",
    tags=["Departments"]
)

app.include_router(
    media_router,
    prefix="/media",
    tags=["Media"]
)

app.include_router(
    projects_router,
    prefix="/projects",
    tags=["Projects"]
)

app.include_router(
    events_router,
    prefix="/events",
    tags=["Events"]
)

app.include_router(
    news_router,
    prefix="/news",
    tags=["News"]
)

app.include_router(
    contact_messages_router,
    prefix="/contact-messages",
    tags=["Contact Messages"]
)


app.mount(
    "/media",
    StaticFiles(directory="media"),
    name="media"
)