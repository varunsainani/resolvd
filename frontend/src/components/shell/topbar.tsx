"use client";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Brand } from "./brand";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";

// Sticky top bar: mobile menu + brand on small screens, and the global controls
// (language, theme, account) on the right.
export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <MobileNav />
      <Brand className="md:hidden" />
      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
