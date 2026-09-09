import type { CannedResponse } from "@/types";
import { CannedCard } from "./canned-card";

// Two-column grid of canned response cards.
export function CannedList({
  responses,
  onEdit,
  onDelete,
}: {
  responses: CannedResponse[];
  onEdit: (canned: CannedResponse) => void;
  onDelete: (canned: CannedResponse) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {responses.map((canned) => (
        <CannedCard
          key={canned.id}
          canned={canned}
          onEdit={() => onEdit(canned)}
          onDelete={() => onDelete(canned)}
        />
      ))}
    </div>
  );
}
