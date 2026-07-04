# Academic Data Management System

A web-based academic data management platform developed for Antalya Belek University. It enables academic staff to manage their publications, projects, theses, patents, awards, events, courses, and memberships on a single platform.

## Features

- Researcher profile with public profile page
- Management of publications, projects, theses, patents, awards, events, courses, and memberships
- One-click PDF CV download
- Research groups with collaborative work detection
- JWT-based authentication and role system (superadmin / academic)
- Dynamic homepage with statistics and charts
- Turkish / English language support

## Technologies

- Backend: Django 4.2, Django REST Framework, PostgreSQL, Celery, Redis
- Frontend: React 18, Vite, Ant Design, Recharts, React Router DOM
- Infrastructure: Docker, Docker Compose, Nginx

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Steps

1. Clone the repository:

        git clone <repo-url>
        cd <repo-name>

2. Copy the environment file:

        cp .env.example .env

3. Start the system:

        docker compose up -d

4. Access the application at http://localhost:5173

### Demo Login

- Email: demo@belek.edu.tr
- Password: Demo2026!

## Project Structure

    university_academic_system/
    backend/
        apps/
            publications/
            projects/
            theses/
            awards/
            patents/
            events/
            courses/
            memberships/
            research_groups/
            users/
        config/
        requirements/
    frontend/
        src/
            pages/
            components/
    nginx/
    scripts/
    docker-compose.yml
    .env.example
    requirements.txt

## User Roles

| Role | Permission |
|------|------------|
| superadmin | Admin panel, full data management |
| academic | Dashboard, own academic outputs |

## Developer

Ahsen Bükre Oktay
