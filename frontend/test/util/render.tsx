import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";

import en from "@/messages/en.json";

// Render a component inside the English message catalog so next-intl hooks
// (useTranslations/useLocale) resolve, matching how the app wraps the tree.
export function renderWithIntl(ui: ReactElement, locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={en} timeZone="UTC">
      {ui}
    </NextIntlClientProvider>,
  );
}
