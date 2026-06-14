# Helpdesk Ticketing System

A scoped customer support ticketing system for the 5-day full-stack challenge. The app supports customer ticket submission and tracking, agent queue triage, public replies, status updates, role-aware access, persisted data, seed users, and local development setup.

## Tech Stack

- Next.js for the frontend because the assignment requires it and the existing project already has a configured app.
- Hono and tRPC for the backend API because this repo was scaffolded with that stack and already had typed client wiring.
- Better Auth for email/password authentication.
- Prisma with SQLite/libSQL for local persistent storage.
- Tailwind and shared shadcn-style UI primitives for accessible, responsive forms and layouts.
- Turborepo and pnpm workspaces for monorepo scripts.

## Run From Zero Locally

Prerequisites:

- Node.js 24.x
- pnpm 11.x through Corepack or a local pnpm install

From a fresh clone, install dependencies:

```bash
pnpm install
```

Create the app env files:

```bash
cp .env.example apps/server/.env
cp .env.example apps/web/.env
```

Use these values in `apps/server/.env`:

```env
DATABASE_URL=file:../../local.db
BETTER_AUTH_SECRET=replace-with-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development
```

Use these values in `apps/web/.env`:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
SERVER_API_URL=http://localhost:3000
```

Generate the Prisma client, apply the schema, and seed reviewer data:

```bash
pnpm run db:generate
pnpm run db:push
pnpm run db:seed
```

Start the local development servers:

```bash
pnpm run dev
```

Open:

- Web app: `http://localhost:3001`
- API: `http://localhost:3000`

To run the production build locally instead:

```bash
pnpm run build
pnpm run start
```

Local SQLite data is stored in `local.db` at the repo root. To reset local data:

```bash
rm -f local.db local.db-journal
pnpm run db:push
pnpm run db:seed
```

## Demo Users

All seeded users use the password `Password123!`.

- Customer: `sarah.customer@example.com`
- Customer: `ali.customer@example.com`
- Customer: `maya.customer@example.com`
- Agent: `omar.agent@example.com`

New signups are customer accounts. Agent accounts are seeded only.

## Product Workflows

Customers can:

- view only their own tickets
- filter by status, category, priority, and booked date
- search ticket number, title, description, customer name, or comment text within their allowed tickets
- create tickets with title, description, category, priority, optional booking time, and contact preference
- open ticket details and add public comments

Agents can:

- view the full queue
- filter/search tickets
- open ticket details
- add public replies
- update status to Open, In Progress, Resolved, or Closed

Backend authorization enforces these rules in tRPC procedures. UI routing is only a convenience layer.

## Scripts

- `pnpm run dev`: start web and server in development mode
- `pnpm run build`: build all workspaces
- `pnpm run start`: start built web and server apps
- `pnpm run check-types`: run TypeScript checks
- `pnpm run check`: run Biome formatting/linting with writes
- `pnpm run db:push`: apply Prisma schema
- `pnpm run db:generate`: generate Prisma client
- `pnpm run db:seed`: seed demo users and tickets
- `pnpm run dev:web`: start only the web app
- `pnpm run dev:server`: start only the API server

## Known Limitations

- Ticket numbers are generated from the current max `HD-####` value, which is sufficient for a local challenge app but should become transactional for production.
- Comments are public only; there is no internal agent note type.
- Agent accounts are seed-managed instead of admin-managed.
- The app uses tRPC rather than REST to match the existing project stack.
- the database is for dev only

## With More Time

- Add integration tests for authorization edge cases.
- Add optimistic UI updates for replies/status changes.
- Add pagination and saved queue views.
- Add multilingual UI copy and locale-aware date formatting.
- Add internal notes and assignment/ownership for agents.
- Add production-ready migrations and deployment hardening.
- dockerize the project
