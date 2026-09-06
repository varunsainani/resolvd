import { hashPassword } from "../src/auth";
import { colorForTag, TAG_COLORS } from "../src/lib/constants";
import { computeSlaDueDates } from "../src/lib/sla";
import { prisma } from "../src/prisma";
import { SEED_CANNED, SEED_KB, SEED_PASSWORD, SEED_TICKETS, SEED_USERS } from "./seed-data";

// Deterministic demo seed. Wipes Resolvd's own tables and rebuilds a realistic
// support desk: a team, a knowledge base, canned replies, and a spread of
// tickets across statuses, priorities, channels, and SLA outcomes so the inbox
// and analytics dashboard have something to show. No AI calls are made; triage
// fields are set directly to keep the seed fast and reproducible.

async function wipe(): Promise<void> {
  // Children before parents. Ticket cascades to messages and tags, but being
  // explicit keeps the order obvious and safe.
  await prisma.ticketTag.deleteMany();
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.kbArticle.deleteMany();
  await prisma.cannedResponse.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers(): Promise<Map<string, string>> {
  const passwordHash = await hashPassword(SEED_PASSWORD);
  const byEmail = new Map<string, string>();
  for (const u of SEED_USERS) {
    const user = await prisma.user.create({
      data: { name: u.name, email: u.email, role: u.role, avatarColor: u.avatarColor, passwordHash },
    });
    byEmail.set(u.email, user.id);
  }
  return byEmail;
}

async function seedTags(): Promise<void> {
  for (const name of Object.keys(TAG_COLORS)) {
    await prisma.tag.create({ data: { name, color: colorForTag(name) } });
  }
}

async function seedKnowledge(): Promise<void> {
  for (const a of SEED_KB) {
    await prisma.kbArticle.create({ data: a });
  }
  for (const c of SEED_CANNED) {
    await prisma.cannedResponse.create({ data: c });
  }
}

// Reuse a customer across tickets (keyed by email) so the directory shows
// repeat customers with a realistic ticket count.
async function ensureCustomer(
  cache: Map<string, string>,
  input: { name: string; email: string; company?: string },
): Promise<string> {
  const hit = cache.get(input.email);
  if (hit) return hit;
  const customer = await prisma.customer.create({
    data: { name: input.name, email: input.email, company: input.company ?? null },
  });
  cache.set(input.email, customer.id);
  return customer.id;
}

async function seedTickets(agents: Map<string, string>): Promise<number> {
  const now = Date.now();
  const customers = new Map<string, string>();
  let count = 0;

  for (const spec of SEED_TICKETS) {
    const createdAt = new Date(now - spec.daysAgo * 86_400_000);
    createdAt.setUTCHours(spec.hour, 0, 0, 0);

    const customerId = await ensureCustomer(customers, spec.customer);
    const { firstDue, resolveDue } = computeSlaDueDates(spec.priority, createdAt);
    const firstResponseAt =
      spec.firstResponseMins != null
        ? new Date(createdAt.getTime() + spec.firstResponseMins * 60_000)
        : null;
    const resolvedAt =
      spec.resolveMins != null ? new Date(createdAt.getTime() + spec.resolveMins * 60_000) : null;

    const ticket = await prisma.ticket.create({
      data: {
        subject: spec.subject,
        status: spec.status,
        priority: spec.priority,
        channel: spec.channel,
        category: spec.category,
        sentiment: spec.sentiment,
        summary: spec.summary,
        aiTriaged: spec.aiTriaged,
        customerId,
        assigneeId: spec.assignee ? agents.get(spec.assignee) ?? null : null,
        createdAt,
        firstResponseAt,
        resolvedAt,
        slaFirstDueAt: firstDue,
        slaResolveDueAt: resolveDue,
        messages: {
          create: spec.messages.map((m) => ({
            authorType: m.author,
            authorUserId: m.author === "AGENT" && spec.assignee ? agents.get(spec.assignee) ?? null : null,
            body: m.body,
            isInternal: m.isInternal ?? false,
            createdAt: new Date(createdAt.getTime() + m.minsAfterCreate * 60_000),
          })),
        },
      },
    });

    for (const name of spec.tags) {
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, color: colorForTag(name) },
      });
      await prisma.ticketTag.create({ data: { ticketId: ticket.id, tagId: tag.id } });
    }
    count += 1;
  }
  return count;
}

async function main(): Promise<void> {
  await wipe();
  const agents = await seedUsers();
  await seedTags();
  await seedKnowledge();
  const tickets = await seedTickets(agents);
  // eslint-disable-next-line no-console
  console.log(
    `seeded ${SEED_USERS.length} users, ${SEED_KB.length} kb, ${SEED_CANNED.length} canned, ${tickets} tickets`,
  );
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
