// Horizontal rule, optionally with a centered label ("or").
export function Divider({ label }: { label?: string }) {
  if (!label) return <hr className="border-border" />;
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
