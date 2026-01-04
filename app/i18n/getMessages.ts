import type { AbstractIntlMessages } from "next-intl";

export type SupportedLocale = "en" | "de" | "hr" | "it";

export const supportedLocales: readonly SupportedLocale[] = [
  "en",
  "de",
  "hr",
  "it",
] as const;

export const defaultLocale: SupportedLocale = "en";

export async function getMessages(locale: string): Promise<AbstractIntlMessages> {
  const safeLocale = (supportedLocales as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : defaultLocale;

  switch (safeLocale) {
    case "de":
      return (await import("../messages/de.json")).default;
    case "hr":
      return (await import("../messages/hr.json")).default;
    case "it":
      return (await import("../messages/it.json")).default;
    case "en":
    default:
      return (await import("../messages/en.json")).default;
  }
}
