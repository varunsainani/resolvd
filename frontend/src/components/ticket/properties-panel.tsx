"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssigneeControl } from "./assignee-control";
import { CategoryControl } from "./category-control";
import { PriorityControl } from "./priority-control";
import { StatusControl } from "./status-control";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

// The editable ticket properties: status, priority, category, and assignee.
export function PropertiesPanel() {
  const t = useTranslations("ticketDetail.properties");
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Row label={t("status")}>
          <StatusControl />
        </Row>
        <Row label={t("priority")}>
          <PriorityControl />
        </Row>
        <Row label={t("category")}>
          <CategoryControl />
        </Row>
        <Row label={t("assignee")}>
          <AssigneeControl />
        </Row>
      </CardContent>
    </Card>
  );
}
