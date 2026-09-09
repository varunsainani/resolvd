"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useMutation } from "@/hooks";
import { customersApi } from "@/lib/api";
import type { Customer } from "@/types";

// Edit a customer's name and company. Email is the identity and stays fixed.
export function EditCustomerModal({
  open,
  onClose,
  customer,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  customer: Customer;
  onSaved: (customer: Customer) => void;
}) {
  const t = useTranslations("customers.editModal");
  const { toast } = useToast();
  const [name, setName] = useState(customer.name);
  const [company, setCompany] = useState(customer.company ?? "");
  const save = useMutation((body: { name: string; company: string }) =>
    customersApi.update(customer.id, body),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await save.mutate({ name: name.trim(), company: company.trim() });
    if (res) {
      onSaved(res.customer);
      toast(t("saved"));
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t("title")}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormError message={save.error} />
        <Field label={t("name")} htmlFor="ec-name">
          <Input id="ec-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label={t("company")} htmlFor="ec-company">
          <Input
            id="ec-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t("companyPlaceholder")}
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" loading={save.loading}>
            {save.loading ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
