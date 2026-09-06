import { PriorityBadge } from "@/components/domain/priority-badge";
import { SlaBadge } from "@/components/domain/sla-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import { Avatar } from "@/components/ui";
import type { SlaMilestone, TicketPriority, TicketStatus } from "@/types";

interface Row {
  ref: number;
  subject: string;
  customer: string;
  color: string;
  status: TicketStatus;
  priority: TicketPriority;
  sla: SlaMilestone;
}

// Illustrative inbox rows for the hero. Static, but rendered with the real
// badges so the marketing visual matches the product.
const ROWS: Row[] = [
  {
    ref: 1042,
    subject: "Double charged this month",
    customer: "Dana Ruiz",
    color: "#0d9488",
    status: "OPEN",
    priority: "URGENT",
    sla: { dueAt: null, state: "breached", minutesRemaining: -18 },
  },
  {
    ref: 1041,
    subject: "Can't log in after enabling 2FA",
    customer: "Marcus Bell",
    color: "#db2777",
    status: "PENDING",
    priority: "HIGH",
    sla: { dueAt: null, state: "due-soon", minutesRemaining: 22 },
  },
  {
    ref: 1038,
    subject: "How do I export my data?",
    customer: "Lena Fox",
    color: "#2563eb",
    status: "RESOLVED",
    priority: "NORMAL",
    sla: { dueAt: null, state: "met", minutesRemaining: null },
  },
];

export function InboxPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-danger" />
        <span className="h-3 w-3 rounded-full bg-warning" />
        <span className="h-3 w-3 rounded-full bg-success" />
        <span className="ml-2 text-xs font-medium text-muted-foreground">resolvd / inbox</span>
      </div>
      <ul className="divide-y divide-border">
        {ROWS.map((r) => (
          <li key={r.ref} className="flex items-center gap-3 px-4 py-3">
            <Avatar name={r.customer} color={r.color} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{r.subject}</p>
              <p className="truncate text-xs text-muted-foreground">
                #{r.ref} · {r.customer}
              </p>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <PriorityBadge priority={r.priority} />
              <StatusBadge status={r.status} />
            </div>
            <SlaBadge milestone={r.sla} />
          </li>
        ))}
      </ul>
    </div>
  );
}
