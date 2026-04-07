# Contify CMS Frontend

This is the React + Vite frontend for Contify CMS.

It provides role-based UI flows for:
- Stakeholder
- Admin
- Editor

## Status

This module is under active development.

Core workflow pages and integrations are implemented, with more polish and features planned.

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS

## Implemented Features

### Authentication UI
- Login and Signup pages
- Role-based redirect after login
- JWT token usage through shared API client

### Stakeholder
- Create project request
- View project status
- Review proposal
- Accept proposal or request changes
- Sign off final delivery

### Admin
- View incoming requests
- Open project detail
- Create proposal and send to stakeholder
- Create tasks and assign editors
- Review editor submissions

### Editor
- View assigned tasks
- Submit task deliverables
- Track task status updates

### Shared UI
- Role-specific dashboards
- Profile/messages/notifications sections
- Sidebar/navbar based modular layout

## Run Locally

From the client folder:

```bash
npm install
npm run dev
```

Frontend runs on:
- http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## API Configuration

The frontend calls backend APIs using:
- `VITE_API_URL` if provided
- fallback: `http://localhost:9090/api`

Set `VITE_API_URL` in a `.env` file if needed:

```env
VITE_API_URL=http://localhost:9090/api
```

## Key Route Groups

- Public: `/`, `/login`, `/roles`, `/signup/:roleName`
- Admin: `/admin/*`
- Editor: `/editor/*`, `/projects/*`
- Stakeholder: `/stakeholder/*`

## Notes

- The frontend expects the backend server to be running.
- Some legacy routes are preserved as aliases for compatibility.
