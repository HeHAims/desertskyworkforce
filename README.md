# WorkFlowOS

WorkFlowOS is a reusable bilingual workforce operations platform for local service businesses. It combines Monday-style boards with ClickUp-style task detail, simple inventory tracking, role-based work, and owner/manager notifications.

Desert Sky Vegas is the first demo workspace and customer template.

## Product direction

The goal is to build one core app that can be reused across companies. Each client gets its own workspace, branding, workflow labels, roles, inventory categories, notification rules, and employee experience.

Core MVP promise:

- Track every job from intake through completion.
- Keep milestone progress visible for owners, managers, and employees.
- Show what inventory is on hand, low, or missing for active jobs.
- Send owner/manager alerts when jobs, milestones, or inventory change.
- Support English and Spanish operations.
- Give small businesses a company-owned workflow system instead of a generic SaaS subscription.

## Architecture

- Frontend: React 18, Vite, Tailwind CSS, Lucide React.
- Backend: Node.js, Express, dotenv, cors, Twilio.
- Data layer today: localized JSON seed records.
- Data layer next: Supabase/Postgres with Auth and Row Level Security.
- Repo layout: `/frontend` and `/backend` workspaces with a root orchestration package.

## Current Demo Workspace

The current seed data models Desert Sky Vegas Furniture & Upholstery:

- Furniture repair jobs
- Upholstery and restoration milestones
- Simple warehouse inventory
- Work stations
- Owner phone alerts
- English/Spanish copy

## What The Dashboard Includes

- Operations Rollup for job, station, inventory, and alert counts.
- Work Order Grid with expandable subtasks, filters, and status chips.
- Milestone Board with board and timeline views.
- Pulse Details Drawer for job detail and milestone notification.
- Simple Inventory Snapshot for materials, locations, and shortages.
- Instant EN/ES navigation and content switching without refresh.
- Twilio notification route for owner/manager alerts.

## Local Development

1. Copy `.env.example` to `.env` and fill in your Twilio credentials.
2. Install dependencies from the repository root.
3. Start both applications with a single command.

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and the backend on `http://localhost:8080`.

## Twilio Integration

The backend exposes:

- `POST /api/notify` for direct alerts.
- `PATCH /api/tasks/:taskId/milestone` for milestone changes that can notify the owner/manager.

Required environment variables:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `NOTIFICATION_TARGET_NUMBER`

The notification line is enforced in the backend service layer so users cannot override the destination from the browser.

## Reusable Platform Plan

See [docs/REUSABLE_PLATFORM_PLAN.md](docs/REUSABLE_PLATFORM_PLAN.md).

Recommended next build steps:

- Add Supabase project.
- Create workspace, user, role, job, milestone, inventory, notification, and activity tables.
- Add login.
- Add role permissions.
- Move JSON seed data into the database.
- Add employee mode.
- Deploy a live demo.
