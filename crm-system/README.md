# CRM Starter (MERN)

This repository is a minimal starter for a CRM system using the MERN stack (MongoDB, Express, React, Node).

Structure

- `client/` — React + Vite frontend
- `server/` — Express + Mongoose backend
- `.github/workflows/ci.yml` — CI workflow
- `docker-compose.yml` — services for local development
- `docs/` — basic documentation placeholders

Quick start (local)

1. Start services with Docker Compose (recommended):
   - docker-compose up --build

2. Or run services individually:
   - Backend: cd server && npm install && npm start
   - Frontend: cd client && npm install && npm run dev

Notes

- This is intentionally minimal. Add features, auth, and tests incrementally.
