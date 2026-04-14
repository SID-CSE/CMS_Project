# Contify CMS Frontend

For complete project documentation, setup flow, architecture, and policies, use the root guide:

- `../README.md`

This file only contains frontend-local commands.

## Run (Development)

```bash
npm install
npm run dev
```

Frontend default URL:
- http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Environment

- Runtime values should be in local `.env`
- Keep `.env.example` as template only

Primary frontend API variable:

```env
VITE_API_BASE_URL=http://localhost:9090/api
```
