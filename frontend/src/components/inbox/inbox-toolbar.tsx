"use client";

import { useTranslations } from "next-intl";

import type { InboxFilters } from "@/lib/inbox-params";
import { CHANNELS, TICKET_PRIORITIES, TICKET_STATUSES } from "@/types";
import { AssigneeFilter } from "./assignee-filter";
import { FilterSelect } from "./filter-select";
import { InboxSearch } from "./inbox-search";
import { SortSelect } from "./sort-select";

// The inbox controls: full-width search on top, then a wrapping row of status,
// priority, channel, and assignee filters with sort pushed to the end.
export function InboxToolbar({
  filters,
  onChange,
}: {
  filters: InboxFilters;
  onChange: (patch: Partial<InboxFilters>) => void;
}) {
  const t = useTranslations("inbox");
  const tStatus = useTranslations("ticket.status");
  const tPriority = useTranslations("ticket.priority");
  const tChannel = useTranslations("ticket.channel");

  return (
    <div className="space-y-3">
      <InboxSearch value={filters.q} onChange={(q) => onChange({ q })} />
      <div className="flex flex-wrap gap-2">
        <FilterSelect
          label={t("filters.status")}
          allLabel={t("filters.status")}
          value={filters.status}
          options={TICKET_STATUSES.map((status) => ({ value: status, label: tStatus(status) }))}
          onChange={(status) => onChange({ status: status as InboxFilters["status"] })}
        />
        <FilterSelect
          label={t("filters.priority")}
          allLabel={t("filters.priority")}
          value={filters.priority}
          options={TICKET_PRIORITIES.map((priority) => ({
            value: priority,
            label: tPriority(priority),
          }))}
          onChange={(priority) => onChange({ priority: priority as InboxFilters["priority"] })}
        />
        <FilterSelect
          label={t("filters.channel")}
          allLabel={t("filters.channel")}
          value={filters.channel}
          options={CHANNELS.map((channel) => ({ value: channel, label: tChannel(channel) }))}
          onChange={(channel) => onChange({ channel: channel as InboxFilters["channel"] })}
        />
        <AssigneeFilter value={filters.assignee} onChange={(assignee) => onChange({ assignee })} />
        <div className="ml-auto">
          <SortSelect value={filters.sort} onChange={(sort) => onChange({ sort })} />
        </div>
      </div>
    </div>
  );
}
