import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge class names, letting later Tailwind utilities win over earlier ones
// (e.g. cn("px-2", condition && "px-4")). Used by every UI primitive.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
