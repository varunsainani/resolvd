import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Brand } from "@/components/shell/brand";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Public, centered layout for the login and signup screens.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-16 items-center justify-between px-4 md:px-6">
        <Brand />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">{children}</main>
    </div>
  );
}
