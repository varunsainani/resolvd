"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import type { AgentSummary, Role } from "@/types";
import { AgentRoleSelect } from "./agent-role-select";

// The team roster: each agent with their assigned-ticket load, an inline role
// picker, and a remove action (disabled for the current user).
export function AgentTable({
  agents,
  currentUserId,
  busyId,
  onRoleChange,
  onRemove,
}: {
  agents: AgentSummary[];
  currentUserId?: string;
  busyId: string | null;
  onRoleChange: (agent: AgentSummary, role: Role) => void;
  onRemove: (agent: AgentSummary) => void;
}) {
  const t = useTranslations("team");

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <THead>
          <TR className="hover:bg-transparent">
            <TH>{t("name")}</TH>
            <TH className="hidden text-right md:table-cell">{t("assigned")}</TH>
            <TH>{t("role")}</TH>
            <TH className="text-right">{t("remove")}</TH>
          </TR>
        </THead>
        <TBody>
          {agents.map((agent) => {
            const isSelf = agent.id === currentUserId;
            return (
              <TR key={agent.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <Avatar name={agent.name} color={agent.avatarColor} size="sm" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate font-medium text-foreground">
                        {agent.name}
                        {isSelf && <Badge tone="neutral">{t("you")}</Badge>}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{agent.email}</p>
                    </div>
                  </div>
                </TD>
                <TD className="hidden text-right tabular-nums text-muted-foreground md:table-cell">
                  {agent.openAssigned} / {agent.totalAssigned}
                </TD>
                <TD>
                  <AgentRoleSelect
                    value={agent.role}
                    disabled={busyId === agent.id}
                    onChange={(role) => onRoleChange(agent, role)}
                  />
                </TD>
                <TD className="text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(agent)}
                    disabled={isSelf || busyId === agent.id}
                    aria-label={t("remove")}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-danger disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
