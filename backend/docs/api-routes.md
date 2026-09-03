# API routes: auth, tickets, messages

All routes are mounted under `/api`. Errors return `{ "detail": "<localized message>" }`
with the status below; the locale comes from the `x-locale` header or `Accept-Language`.
Authenticated routes expect `Authorization: Bearer <token>`.

## Auth (`/api/auth`)

| Method | Path      | Auth | Body                                   | Notes |
| ------ | --------- | ---- | -------------------------------------- | ----- |
| POST   | `/signup` | no   | `{ name, email, password }`            | 201 → `{ token, user }`. 409 `email_taken`. |
| POST   | `/login`  | no   | `{ email, password }`                  | 200 → `{ token, user }`. 401 `invalid_credentials`. |
| POST   | `/demo`   | no   | —                                      | One-click sign-in to the demo account. |
| GET    | `/me`     | yes  | —                                      | Current profile. |
| PATCH  | `/me`     | yes  | `{ name?, locale?, theme? }`           | Locale ∈ en/es/pt, theme ∈ light/dark. |

## Tickets (`/api/tickets`)

| Method | Path          | Body / Query                                          | Notes |
| ------ | ------------- | ----------------------------------------------------- | ----- |
| GET    | `/`           | `?status&priority&assignee&q&sort&page&pageSize`      | Filtered, paginated inbox. `assignee=me\|unassigned\|<id>`, `sort=newest\|oldest\|updated\|priority`. Returns `{ data, meta }`. |
| GET    | `/:id`        | —                                                     | Full ticket with the conversation thread. 404 `ticket_not_found`. |
| POST   | `/`           | `{ subject, message, customer:{name,email,company?}, channel?, priority? }` | Creates a ticket: reuses/creates the customer, AI-triages the opening message, starts the SLA clocks, applies triage tags. |
| PATCH  | `/:id`        | `{ status?, priority?, category?, assigneeId? }`      | Priority change recomputes SLA due dates; resolving stamps `resolvedAt`. |
| POST   | `/:id/assign` | `{ assigneeId? }`                                     | No body → assign to caller; `null` → release. |

## Messages (`/api/tickets/:ticketId`)

| Method | Path        | Body                          | Notes |
| ------ | ----------- | ----------------------------- | ----- |
| POST   | `/messages` | `{ body, isInternal?, status? }` | Agent reply or internal note. The first public reply stamps `firstResponseAt` (meets the response SLA). |
| POST   | `/suggest`  | —                             | AI reply grounded in matching KB articles. Rate-limited per agent per day (`daily_suggest_limit`, 429). Internal notes are excluded from grounding. |

## Behaviour notes

- **AI triage / suggestions** run through the `LLMProvider` (Groq default, Gemini switchable).
  A slow or unavailable provider aborts at `REQUEST_TIMEOUT_MS` and degrades to the
  deterministic fallback, so intake and replies never hang.
- **SLA** targets come from `SLA_MINUTES` per priority; every ticket payload carries an
  `sla` block with `state` and `minutesRemaining` for the first-response and resolution
  milestones.
