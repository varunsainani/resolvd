# Resolvd

AI support desk. A shared inbox where customer tickets land and AI does the heavy lifting: automatic triage (priority, category, tags, sentiment, one line summary), a grounded suggested reply for agents, canned macros, SLA timers, and a live analytics dashboard. A public submit form shows the customer side with instant AI triage.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind + next-intl (English / Spanish / Portuguese)
- **Backend:** Express + TypeScript + Prisma + PostgreSQL (Neon)
- **AI:** provider interface (Groq by default), used for ticket triage and suggested replies
- **Deploy:** all on Vercel + Neon, single origin via an `/api` proxy

## Layout

```
resolvd/
  backend/    Express + Prisma API
  frontend/   Next.js app
```

## Development

```bash
# backend
cd backend
npm install
npm run db:push
npm run seed
npm run dev

# frontend
cd frontend
npm install
npm run dev
```

## Features

- Shared ticket inbox with status, priority, channel, tags, and assignee filters
- AI auto triage on intake and an AI suggested reply grounded in the knowledge base
- SLA timers per priority with breach flags
- Canned responses and a knowledge base
- Analytics: queue health, response times, volume, and agent performance
- Public ticket submission form with live triage
- Roles: admin and agent, one click demo login, fully multilingual

## Deployment

Resolvd runs entirely on Vercel with a Neon Postgres database, as two projects sharing one origin:

- **`resolvd`** is the Next.js frontend (root directory `frontend`). It proxies `/api/*` to the API through a rewrite, so the browser only ever talks to one origin. Set `APP_URL` to the deployed site URL and `BACKEND_URL` to the API deployment URL.
- **`resolvd-api`** is the Express API as a single Vercel serverless function (`backend/api/index.ts` + `backend/vercel.json`). It needs `DATABASE_URL` and `DIRECT_URL` (Neon pooled + direct), `JWT_SECRET`, and the AI provider keys. See `backend/.env.example`.

Provision the schema and demo data once (not on cold start):

```bash
cd backend
npm run db:push   # sync the Prisma schema to Neon
npm run seed      # load demo users, tickets, KB, and canned responses
```

Both projects connect to this repo, so a push to `main` ships a production deploy.
