# Desert Sky Workforce

Desert Sky Workforce is a bilingual workforce operations platform for Desert Sky Vegas Furniture & Upholstery. It is shaped around furniture repair, upholstery, custom builds, restoration jobs, production milestones, and owner phone alerts.

## Product direction

The client asked for a Monday-style work platform. This project positions the MVP as a more tailored system: Monday-style boards plus ClickUp-style task detail, built around Desert Sky's actual shop workflow.

Core MVP promise:

- Track every customer job from intake through delivery.
- Keep milestone progress visible for the owner and shop team.
- Show what inventory is on hand, low, or missing for active jobs.
- Send SMS alerts to the owner's phone when jobs are created or milestones change.
- Support English and Spanish operations.
- Give Desert Sky a custom workflow tool instead of forcing the business into generic SaaS.

## Architecture

- Frontend: React 18, Vite, Tailwind CSS, Lucide React.
- Backend: Node.js, Express, dotenv, cors, Twilio.
- Data layer: localized JSON seed records designed for a later database migration.
- Repo layout: `/frontend` and `/backend` workspaces with a root orchestration package.

## What the dashboard includes

- Shop Rollup for top-level job, station, standard, and alert counts.
- Work Order Grid with expandable subtasks, filters, and status chips.
- Milestone Board with board and timeline views.
- Pulse Details Drawer for job detail and milestone notification.
- Simple Inventory Snapshot for fabric, foam, supplies, locations, and shortages.
- Instant EN/ES navigation and content switching without refresh.
- Twilio notification route for owner phone alerts.

## Local development

1. Copy `.env.example` to `.env` and fill in your Twilio credentials.
2. Install dependencies from the repository root.
3. Start both applications with a single command.

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and the backend on `http://localhost:8080`.

## Twilio integration

The backend exposes:

- `POST /api/notify` for direct owner alerts.
- `PATCH /api/tasks/:taskId/milestone` for milestone changes that can notify the owner.

Required environment variables:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `NOTIFICATION_TARGET_NUMBER` defaults to `+14428882240`

The owner notification line is enforced in the backend service layer so users cannot override the destination from the browser.

## MVP boundaries

For a paid first phase, this should be sold as a custom MVP, not a full Monday or ClickUp clone. Recommended Phase 1 scope:

- Customer job tracking
- Milestone updates
- Board, grid, and timeline views
- Owner SMS alerts
- Simple warehouse inventory: have, need, low, missing
- English/Spanish workflow copy
- Basic shop dashboard

Later phases can add user accounts, roles, file/photo uploads, invoices, customer portal access, calendar scheduling, and reporting.
