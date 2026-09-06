# Resolvd frontend

Next.js 16 (App Router) + TypeScript + Tailwind v4 + next-intl. The UI for the
Resolvd support desk: inbox, ticket detail, analytics, knowledge base, canned
responses, team management, and the public submit form.

## Stack

- **Next.js 16** App Router, React 19, Turbopack
- **Tailwind v4** with CSS-first design tokens (teal/emerald brand, slate canvas,
  amber/red SLA states), class-based dark mode
- **next-intl** for EN / ES / PT, cookie-driven (no URL locale prefix)
- **Fonts:** Inter (body) + Plus Jakarta Sans (display)

## Development

```bash
npm install
cp .env.example .env.local   # set BACKEND_URL if the API is not on :8000
npm run dev
```

The backend must be running (see `../backend`). Requests to `/api/*` are proxied
to `BACKEND_URL` by `next.config.ts`.

## Structure

```
src/
  app/            routes (App Router); (app) = authenticated shell
  components/
    ui/           design-system primitives
    shell/        sidebar, top bar, navigation
    domain/       status / priority / SLA badges
    theme/        theme provider + toggle
    auth/         auth provider
    i18n/         language switcher
  lib/api/        typed API client (one module per resource)
  types/          shared API types (mirror the backend serializers)
  i18n/           locale config + next-intl request config
  messages/       en / es / pt catalogs
```
