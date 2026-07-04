# Academic Data Management System

An academic data management system developed for Antalya Belek University. It enables academic staff to manage their publications, projects, theses, patents, awards, events, courses, and memberships on a single platform.

## Features

- Researcher profile with public profile page
- Management of publications, projects, theses, patents, awards, events, courses, and memberships
- One-click PDF CV download
- Research groups with collaborative work detection
- JWT-based authentication and role system (superadmin / academic)
- Dynamic homepage with statistics, charts, and slider
- Turkish / English language support

## Technologies

**Backend:** Django 4.2, Django REST Framework, PostgreSQL (Neon DB), Celery, Redis

**Frontend:** React 18, Vite, Ant Design, Recharts, React Router DOM

**Infrastructure:** Docker, Docker Compose, Nginx

## Requirements
- Docker and Docker Compose
- Node.js 18+
- Python 3.11+

## Project Structure
```
belek-academic-system/
├── backend/          # Django application
│   ├── apps/         # Modules (publications, projects, theses...)
│   ├── config/       # Settings and URL configuration
│   └── requirements/ # Python dependencies
├── frontend/         # React application
│   ├── src/
│   │   ├── pages/    # Page components
│   │   └── components/ # Shared components
│   └── package.json
├── docker-compose.yml
├── .env.example
└── requirements.txt

## User Roles

| Role | Permission |
|------|------------|
| superadmin | Admin panel, full data management |
| academic | Dashboard, own academic outputs |

```
## Developer

Ahsen Bükre Oktay
