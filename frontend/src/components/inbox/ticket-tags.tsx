import type { Tag } from "@/types";

// Inline tag chips. On dense rows we cap how many render and summarize the rest
// as "+N" so a heavily tagged ticket never blows out the row height.
export function TicketTags({ tags, max = 3 }: { tags: Tag[]; max?: number }) {
  if (tags.length === 0) return null;
  const shown = tags.slice(0, max);
  const extra = tags.length - shown.length;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {shown.map((tag) => (
        <span
          key={tag.name}
          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: tag.color }}
            aria-hidden="true"
          />
          {tag.name}
        </span>
      ))}
      {extra > 0 && <span className="text-[11px] text-muted-foreground">+{extra}</span>}
    </div>
  );
}
