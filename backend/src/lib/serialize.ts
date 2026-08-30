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
