"use client";

import { Plus, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { useToast } from "@/components/ui/toast";
import { useApi, useDisclosure, useMutation } from "@/hooks";
import { adminApi } from "@/lib/api";
import type { AgentSummary, Role } from "@/types";
import { AddAgentModal } from "./add-agent-modal";
import { AgentTable } from "./agent-table";

export function TeamView() {
  const t = useTranslations("team");
  const tCommon = useTranslations("common");
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";

  // Only admins hit the endpoint; others get the forbidden state below.
  const { data, loading, error, refetch } = useApi(
    () => (isAdmin ? adminApi.agents() : Promise.resolve({ data: [] as AgentSummary[] })),
    [isAdmin],
  );
  const [agents, setAgents] = useState<AgentSummary[] | null>(null);
  useEffect(() => {
    if (data) setAgents(data.data);
  }, [data]);

  const add = useDisclosure();
  const [removing, setRemoving] = useState<AgentSummary | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const roleMut = useMutation((args: { id: string; role: Role }) =>
    adminApi.update(args.id, { role: args.role }),
  );
  const removeMut = useMutation((id: string) => adminApi.remove(id));

  async function changeRole(agent: AgentSummary, role: Role) {
    if (role === agent.role) return;
    setBusyId(agent.id);
    const res = await roleMut.mutate({ id: agent.id, role });
    setBusyId(null);
    if (res) {
      setAgents((list) => list?.map((a) => (a.id === agent.id ? res.agent : a)) ?? null);
      toast(t("roleChanged"));
    } else if (roleMut.error) {
      toast(roleMut.error, "error");
    }
  }

  async function confirmRemove() {
    if (!removing) return;
    setBusyId(removing.id);
    const res = await removeMut.mutate(removing.id);
    setBusyId(null);
    if (res) {
      setAgents((list) => list?.filter((a) => a.id !== removing.id) ?? null);
      toast(t("removeConfirm.removed"));
    } else if (removeMut.error) {
      toast(removeMut.error, "error");
    }
    setRemoving(null);
  }

  if (!isAdmin) {
    return (
      <>
        <PageHeader title={t("title")} description={t("subtitle")} />
        <EmptyState icon={ShieldAlert} title={t("forbidden.title")} description={t("forbidden.body")} />
      </>
    );
  }

  const list = agents ?? [];

  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        action={
          <Button onClick={add.onOpen}>
            <Plus className="h-4 w-4" />
            {t("add")}
          </Button>
        }
      />
      <div className="space-y-4">
        {error ? (
          <ErrorState message={error} onRetry={refetch} retryLabel={tCommon("retry")} />
        ) : loading && !agents ? (
          <ListSkeleton rows={4} />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{t("count", { count: list.length })}</p>
            <AgentTable
              agents={list}
              currentUserId={user?.id}
              busyId={busyId}
              onRoleChange={changeRole}
              onRemove={setRemoving}
            />
          </>
        )}
      </div>

      <AddAgentModal
        open={add.open}
        onClose={add.onClose}
        onAdded={(agent) => setAgents((l) => [...(l ?? []), agent])}
      />
      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemove}
        title={t("removeConfirm.title")}
        message={removing ? t("removeConfirm.message", { name: removing.name }) : ""}
        confirmLabel={t("removeConfirm.confirm")}
        cancelLabel={tCommon("cancel")}
        loading={removeMut.loading}
        danger
      />
    </>
  );
}
