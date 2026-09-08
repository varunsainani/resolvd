import { CustomerPanel } from "./customer-panel";
import { PropertiesPanel } from "./properties-panel";
import { SlaPanel } from "./sla-panel";
import { SummaryPanel } from "./summary-panel";
import { TagsEditor } from "./tags-editor";

// The ticket detail sidebar: editable properties, the AI summary, SLA clocks,
// the customer card, and the tag editor.
export function TicketSidebar() {
  return (
    <aside className="space-y-4">
      <PropertiesPanel />
      <SummaryPanel />
      <SlaPanel />
      <CustomerPanel />
      <TagsEditor />
    </aside>
  );
}
