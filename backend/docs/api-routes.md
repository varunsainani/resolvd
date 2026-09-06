# API routes: auth, tickets, messages, customers, kb, canned, analytics, agents, admin, public

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

## Customers (`/api/customers`)

| Method | Path   | Body / Query                        | Notes |
| ------ | ------ | ----------------------------------- | ----- |
| GET    | `/`    | `?q&sort&page&pageSize`             | Directory with a ticket count per row. `sort=recent\|name\|tickets`. Returns `{ data, meta }`. |
| GET    | `/:id` | —                                   | One customer plus their tickets. 404 `customer_not_found`. |
| PATCH  | `/:id` | `{ name?, company? }`               | Email is the identity key and cannot change here. |

## Knowledge base (`/api/kb`)

| Method | Path   | Body / Query                                | Notes |
| ------ | ------ | ------------------------------------------- | ----- |
| GET    | `/`    | `?q&category&page&pageSize`                 | Search over title/keywords/body. |
| GET    | `/:id` | —                                           | 404 `article_not_found`. |
| POST   | `/`    | `{ title, body, category?, keywords? }`     | 201 → `{ article }`. Keywords power AI grounding. |
| PATCH  | `/:id` | `{ title?, body?, category?, keywords? }`   | |
| DELETE | `/:id` | —                                           | → `{ ok: true }`. |

## Canned responses (`/api/canned`)

| Method | Path   | Body / Query                    | Notes |
| ------ | ------ | ------------------------------- | ----- |
| GET    | `/`    | `?q&category&page&pageSize`     | Search over title/body. |
| GET    | `/:id` | —                               | 404 `canned_not_found`. |
| POST   | `/`    | `{ title, body, category? }`    | 201 → `{ canned }`. |
| PATCH  | `/:id` | `{ title?, body?, category? }`  | |
| DELETE | `/:id` | —                               | → `{ ok: true }`. |

## Tags (`/api/tags`, `/api/tickets/:id/tags`)

| Method | Path                          | Body            | Notes |
| ------ | ----------------------------- | --------------- | ----- |
| GET    | `/api/tags`                   | —               | Every tag in the shared vocabulary, with usage counts. |
| POST   | `/api/tickets/:id/tags`       | `{ name }`      | Manually add a tag to a ticket (idempotent). |
| DELETE | `/api/tickets/:id/tags/:name` | —               | Remove a tag from a ticket. |

## Analytics (`/api/analytics`)

| Method | Path        | Notes |
| ------ | ----------- | ----- |
| GET    | `/overview` | Totals (open, unassigned, resolved, AI-triaged %, resolution rate), SLA breach counts, average first-response and resolution minutes, breakdowns by status/priority/channel/category/sentiment, and a 14-day created-ticket trend. |

## Agents (`/api/agents`)

| Method | Path | Notes |
| ------ | ---- | ----- |
| GET    | `/`  | Team roster for the assignee picker (any authenticated agent). |

## Admin (`/api/admin`, admin role only)

| Method | Path           | Body                          | Notes |
| ------ | -------------- | ----------------------------- | ----- |
| GET    | `/agents`      | —                             | Roster with open/total assigned counts per member. |
| POST   | `/agents`      | `{ name, email, password, role? }` | Invite a member. 409 `email_taken`. Role ∈ admin/agent. |
| PATCH  | `/agents/:id`  | `{ name?, role? }`            | Demoting the last admin is refused (`last_admin`). |
| DELETE | `/agents/:id`  | —                             | Cannot remove yourself (`cannot_remove_self`). Tickets fall back to unassigned. |

## Public (`/api/public`, no auth)

| Method | Path                        | Body / Query                              | Notes |
| ------ | --------------------------- | ----------------------------------------- | ----- |
| POST   | `/tickets`                  | `{ name, email, subject, message, company? }` | Customer submit form. Runs AI intake and returns the instant triage view. Rate-limited per email per day (`public_submit_limit`, 429). |
| GET    | `/tickets/:reference`       | `?email=`                                 | Status lookup; the email must match the ticket's customer. 404 `ticket_not_found`. |

## Behaviour notes

- **AI triage / suggestions** run through the `LLMProvider` (Groq default, Gemini switchable).
  A slow or unavailable provider aborts at `REQUEST_TIMEOUT_MS` and degrades to the
  deterministic fallback, so intake and replies never hang.
- **SLA** targets come from `SLA_MINUTES` per priority; every ticket payload carries an
  `sla` block with `state` and `minutesRemaining` for the first-response and resolution
  milestones.
