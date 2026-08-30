import type { Customer, Message, User } from "@prisma/client";

// Public shape of an authenticated user (never leaks the password hash).
export function serializeUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    locale: u.locale,
    theme: u.theme,
    avatarColor: u.avatarColor,
  };
}

// Compact reference to an agent, used for assignee and message author display.
export function serializeAgentRef(u: Pick<User, "id" | "name" | "avatarColor"> | null | undefined) {
  if (!u) return null;
  return { id: u.id, name: u.name, avatarColor: u.avatarColor };
}

export function serializeCustomer(c: Customer) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    company: c.company,
    createdAt: c.createdAt.toISOString(),
  };
}

type MessageWithAuthor = Message & {
  authorUser?: Pick<User, "id" | "name" | "avatarColor"> | null;
};

export function serializeMessage(m: MessageWithAuthor) {
  return {
    id: m.id,
    authorType: m.authorType,
    author: serializeAgentRef(m.authorUser),
    body: m.body,
    isInternal: m.isInternal,
    createdAt: m.createdAt.toISOString(),
  };
}
