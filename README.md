# AbujaIdealist

**Connect. Inspire. Act.**

AbujaIdealist is a volunteer-focused platform being developed to make AbujaIdealist's community work more visible, accessible, and easier for people to participate in.

The platform will allow visitors to learn about AbujaIdealist, discover its programs and projects, view events and updates, meet the leadership team, and apply to become volunteers.

## About AbujaIdealist

AbujaIdealist is a volunteer organization focused on community service, youth development, healthcare, and education through volunteering.

The website is being developed as the official online presence for AbujaIdealist.

## Project Goals

The website is designed to help people:

- Learn about AbujaIdealist
- Discover community programs and projects
- See the organization's impact
- Learn about upcoming events
- Read news and updates
- Meet the leadership and team
- Apply to become a volunteer
- Contact AbujaIdealist

## V1 Features

### Public Website

- Home page
- About page
- Leadership & Team
- Programs
- Projects & Impact
- Events
- News & Updates
- Volunteer application
- Contact

### Volunteer System

The volunteer application collects:

- Personal information
- Location
- Education background
- Occupation
- Previous volunteering experience
- Skills
- Areas of interest
- Availability
- Motivation
- Consent

Volunteer applications can be reviewed by administrators and assigned a status:

- NEW
- REVIEWED
- ACCEPTED
- REJECTED

### Admin System

The backend includes:

- Admin login
- Password hashing
- JWT authentication
- Protected admin endpoints
- Admin active/inactive verification
- Volunteer application management
- Application status management

## Technology Stack

### Backend

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT
- Argon2 password hashing
- Uvicorn

### Frontend

The frontend will be developed with:

- React
- JavaScript
- HTML
- CSS

### Development Tools

- Git
- GitHub
- Visual Studio Code

## Project Structure

```text
abujaidealist/
├── backend/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── security/
│   ├── services/
│   ├── database.py
│   ├── main.py
│   ├── create_admin.py
│   └── requirements.txt
│
└── frontend/