import Home from "../page";
import { notFound } from "next/navigation";
import { supportedLocales, type SupportedLocale } from "../i18n/getMessages";

export default async function LocaleHome({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!(supportedLocales as readonly string[]).includes(locale)) notFound();

    return <Home locale={locale as SupportedLocale} />;
}