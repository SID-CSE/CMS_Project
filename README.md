# Contify CMS

Contify CMS is a role-based content management workflow platform built with React + Spring Boot + MySQL.

It supports a full multi-role process where stakeholders request projects, admins plan and assign work, editors submit deliverables, and stakeholders review final output.

## Documentation Structure

This file is the single source of truth for project-level setup and architecture.

Module-specific quick docs:
- `client/README.md` (frontend run/build shortcuts)
- `server/README.md` (backend run/build shortcuts)
- `server/API_DOCUMENTATION.md` (endpoint reference)

## Project Status

This project is under active development.

Current build includes major workflow and authentication foundations, and more features are planned (see Roadmap).

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS

### Backend
- Spring Boot 4
- Spring Data JPA
- Spring Security
- JWT authentication (jjwt)
- MySQL

## Main Features (Currently Implemented)

### Authentication and User Roles
- JWT-based login and signup
- Role-based dashboard routing
- User records persisted in MySQL
- Username, email, and hashed password storage

### Public Pages
- Landing page
- Login
- Signup with role selection
- Forgot password UI

### Stakeholder Features
- Create project request
- View own project requests
- Review project proposal from admin
- Accept proposal (mark as done)
- Request proposal changes
- View assigned task outputs
- Sign off delivery after approval cycle

### Admin Features
- View incoming project requests
- Open project detail
- Create proposal (timeline, notes, milestones)
- Send proposal to stakeholder
- Create and assign tasks to editors
- Review editor submissions
- Approve or send for revision
- Additional admin modules/pages (analytics, audit log, settings, finance, users, messaging)

### Editor Features
- View assigned tasks
- Submit work using delivery links/metadata
- Track task status and revisions
- Additional editor modules/pages (notifications, profile, finance, messaging, versions)

### System Features
- Notification service endpoints
- Project/task state transitions
- Structured DTO-based API responses
- Global exception handling
- CORS configuration for local frontend/backend development

## Workflow Stages

Implemented workflow follows this model:

1. Stakeholder submits project request
2. Admin creates proposal and sends to stakeholder
3. Stakeholder accepts proposal or requests changes
4. Admin creates tasks and assigns to editors
5. Editors submit work deliverables
6. Admin reviews and approves/revises submissions
7. Stakeholder signs off final delivery

## Repository Structure

```text
CMS_Project/
  client/   # React frontend
  server/   # Spring Boot backend
```

## Local Setup

## Prerequisites
- Node.js 18+
- Java 21+
- Maven (or use mvnw wrapper in server)
- MySQL 8+

## 1) Clone and install

```bash
git clone <your-repo-url>
cd CMS_Project
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### Backend

```bash
cd server
mvnw spring-boot:run
```

Backend runs on http://localhost:9090

## Environment Files Policy

- Use local `.env` files for real credentials.
- Keep `.env.example` files template-only (no live secrets).
- Never commit real secrets to git.

## 2) Database configuration

Update backend config in server/src/main/resources/application.properties:

- spring.datasource.url
- spring.datasource.username
- spring.datasource.password
- app.jwt.secret (set a secure secret in production)

Default database name expected by current config: Contify

Hibernate is set to update schema automatically.

## API Base

Frontend expects backend API at:

- http://localhost:9090/api

## Key Route Overview (Frontend)

### Public
- /
- /login
- /signup/:roleName
- /roles

### Admin
- /admin/dashboard
- /admin/projects
- /admin/projects/:id

### Editor
- /editor/dashboard
- /projects
- /projects/:id/content

### Stakeholder
- /stakeholder/home
- /stakeholder/create-project-request
- /stakeholder/projects/:id

## Security Notes

- Passwords are stored as hashed values (BCrypt) in MySQL.
- JWT is used for stateless authentication after login.
- Do not commit production secrets or credentials to GitHub.

## In Development / Upcoming Features

Planned enhancements include:

- Stronger route guards and role authorization enforcement on UI and API
- Secure refresh token flow and token rotation
- File upload pipeline (S3/Blob storage) with signed URLs
- Better notification center UX (real-time updates)
- Task comments and threaded review feedback
- Search/filter/sort improvements across dashboards
- Rich analytics and project insights
- Automated testing suite (unit, integration, E2E)
- CI/CD workflows for staging and production
- Performance optimizations and caching
- Improved audit trail and admin governance controls

## Contribution

Contributions, issues, and suggestions are welcome while the project evolves.

If you open an issue, include:
- role used (admin/editor/stakeholder)
- exact page/route
- expected vs actual behavior
- logs or screenshots when possible

## License

Add your preferred license here (MIT, Apache-2.0, etc.).
