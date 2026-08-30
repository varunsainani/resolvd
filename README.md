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
