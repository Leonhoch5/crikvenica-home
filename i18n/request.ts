import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const supportedLocales = ["en", "de", "hr", "it"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const defaultLocale: SupportedLocale = "en";

function toSupportedLocale(value: string | undefined): SupportedLocale {
  if (!value) return defaultLocale;
  return (supportedLocales as readonly string[]).includes(value)
    ? (value as SupportedLocale)
    : defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = toSupportedLocale(cookieStore.get("locale")?.value);

  const messages = (await import(`../app/messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
