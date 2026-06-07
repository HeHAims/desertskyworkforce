# WorkFlowOS Reusable Platform Plan

WorkFlowOS is the reusable app. Desert Sky Vegas is the first customer workspace.

The goal is to build one core platform that can be resold to businesses that need simple workforce operations: shops, contractors, field services, repair companies, warehouses, clinics, cleaning teams, event teams, and local service companies.

## Core Product

WorkFlowOS combines the useful parts of Monday and ClickUp:

- Boards for status and workflow stages
- Detailed tasks with subtasks and milestones
- Simple inventory tracking
- Employee-friendly updates
- Owner/manager notifications
- English/Spanish workflows
- Role-based access

## What Is Reusable

These modules should stay generic:

- Users
- Roles
- Workspaces
- Jobs
- Tasks
- Milestones
- Inventory items
- Inventory movements
- Notifications
- Activity log
- Comments and files
- Dashboard views

## What Changes Per Client

Each client workspace gets its own:

- Company name
- Industry language
- Status labels
- Milestone templates
- Inventory categories
- Employee roles
- Notification rules
- Phone numbers
- Branding
- Default language

## First Customer Template: Desert Sky Vegas

Desert Sky uses:

- Furniture jobs
- Upholstery milestones
- Custom build milestones
- Repair and restoration tasks
- Fabric, foam, thread, hardware, and supply inventory
- Owner SMS notifications
- Spanish-friendly employee screens

## Database Tables To Build Next

- `workspaces`
- `users`
- `workspace_members`
- `roles`
- `permissions`
- `jobs`
- `job_tasks`
- `milestones`
- `inventory_items`
- `inventory_movements`
- `notifications`
- `activity_log`

## Role Rules

Owner:
Can manage everything and receives alerts.

Manager:
Can manage jobs, milestones, inventory, and employee work.

Employee:
Can see assigned work, update status, complete subtasks, and report missing inventory.

Viewer:
Future optional role for customer portals.

## Build Order

1. Add database and authentication.
2. Add workspace/member/role tables.
3. Move JSON seed data into database records.
4. Add role checks to backend routes.
5. Add employee mode with simple mobile-first screens.
6. Add inventory movement tracking.
7. Add notification rules.
8. Deploy a live demo.
9. Duplicate workspace templates for the next client.

## Recommended Stack

- Frontend: React/Vite
- Backend: Express
- Database/Auth: Supabase
- Notifications: Twilio SMS first, web push later
- Frontend hosting: Vercel or Netlify
- Backend hosting: Render, Railway, or Google Cloud Run

Supabase is recommended because Postgres tables, Auth, and Row Level Security map well to roles and reusable workspaces.
