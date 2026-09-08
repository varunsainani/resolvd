"use client";

import { useTranslations } from "next-intl";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useApi } from "@/hooks";
import { agentsApi } from "@/lib/api";
import { useTicketActions } from "./ticket-context";

// Assignee picker: the full roster plus an unassign option, with a one-click
// "assign to me" shortcut when the ticket isn't already the current agent's.
export function AssigneeControl() {
  const t = useTranslations("ticketDetail.properties");
  const { ticket, assign, patching } = useTicketActions();
  const { user } = useAuth();
  const { data } = useApi(() => agentsApi.list(), []);

  const agents = data?.data ?? [];
  const current = ticket.assignee?.id ?? "";
  const mineAlready = current === user?.id;

  return (
    <div className="space-y-2">
      <Select
        aria-label={t("assignee")}
        value={current}
        disabled={patching}
        onChange={(e) => assign(e.target.value || null)}
      >
        <option value="">{t("unassigned")}</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </Select>
      {user && !mineAlready && (
        <Button
          variant="outline"
          size="sm"
          disabled={patching}
          onClick={() => assign(user.id)}
          className="w-full"
        >
          {t("assignToMe")}
        </Button>
      )}
    </div>
  );
}
