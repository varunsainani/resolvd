import { describe, expect, it } from "vitest";

import {
  CATEGORIES,
  CHANNELS,
  SENTIMENTS,
  TAG_COLORS,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../../src/lib/constants";
import { config } from "../../src/config";
import {
  SEED_CANNED,
  SEED_KB,
  SEED_TICKETS,
  SEED_USERS,
} from "../../prisma/seed-data";

const userEmails = new Set(SEED_USERS.map((u) => u.email));

describe("seed users", () => {
  it("includes the demo and admin accounts the config expects", () => {
    expect(userEmails.has(config.demoEmail)).toBe(true);
    expect(userEmails.has(config.adminEmail)).toBe(true);
  });

  it("has exactly one admin", () => {
    expect(SEED_USERS.filter((u) => u.role === "admin")).toHaveLength(1);
  });

  it("uses unique emails", () => {
    expect(userEmails.size).toBe(SEED_USERS.length);
  });
});

describe("seed knowledge and macros", () => {
  it("uses only known categories", () => {
    for (const a of [...SEED_KB, ...SEED_CANNED]) {
      expect(CATEGORIES).toContain(a.category as (typeof CATEGORIES)[number]);
    }
  });

  it("gives every KB article searchable keywords", () => {
    for (const a of SEED_KB) expect(a.keywords.trim().length).toBeGreaterThan(0);
  });
});

describe("seed tickets", () => {
  it("references only real agents (or no assignee)", () => {
    for (const t of SEED_TICKETS) {
      if (t.assignee !== null) expect(userEmails.has(t.assignee)).toBe(true);
    }
  });

  it("uses valid enum values throughout", () => {
    for (const t of SEED_TICKETS) {
      expect(TICKET_STATUSES).toContain(t.status);
      expect(TICKET_PRIORITIES).toContain(t.priority);
      expect(CHANNELS).toContain(t.channel);
      expect(SENTIMENTS).toContain(t.sentiment);
      expect(CATEGORIES).toContain(t.category as (typeof CATEGORIES)[number]);
    }
  });

  it("only uses tags from the shared palette", () => {
    const palette = new Set(Object.keys(TAG_COLORS));
    for (const t of SEED_TICKETS) {
      for (const tag of t.tags) expect(palette.has(tag)).toBe(true);
    }
  });

  it("stamps response and resolution times on every resolved or closed ticket", () => {
    for (const t of SEED_TICKETS) {
      if (t.status === "RESOLVED" || t.status === "CLOSED") {
        expect(t.firstResponseMins).not.toBeNull();
        expect(t.resolveMins).not.toBeNull();
      }
    }
  });

  it("opens every ticket with a customer message at minute zero", () => {
    for (const t of SEED_TICKETS) {
      expect(t.messages.length).toBeGreaterThan(0);
      expect(t.messages[0]).toMatchObject({ author: "CUSTOMER", minsAfterCreate: 0 });
    }
  });
});
