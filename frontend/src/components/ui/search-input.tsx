import { Search } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/lib/cn";
import { Input, type InputProps } from "./input";

// Text input with a leading search icon.
export const SearchInput = forwardRef<HTMLInputElement, InputProps>(function SearchInput(
  { className, ...props },
  ref,
) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input ref={ref} type="search" className={cn("pl-9", className)} {...props} />
    </div>
  );
});
