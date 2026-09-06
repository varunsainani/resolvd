import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

// Circular initials avatar. `color` is the user's stored avatarColor; text stays
// white for contrast against the saturated brand colors used for avatars.
export function Avatar({
  name,
  color,
  size = "md",
  className,
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "sm" ? "h-7 w-7 text-xs" : size === "lg" ? "h-11 w-11 text-base" : "h-9 w-9 text-sm";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        dim,
        className,
      )}
      style={{ backgroundColor: color || "#0d9488" }}
      title={name}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
