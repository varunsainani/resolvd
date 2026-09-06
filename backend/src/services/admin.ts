// Guard used before demoting or removing an admin: true when the target is the
// only remaining admin, so the last set of keys can never be taken away. Pure,
// so the rule is unit tested without touching the database.
export function isLastAdmin(adminIds: string[], targetId: string): boolean {
  return adminIds.includes(targetId) && adminIds.length <= 1;
}
