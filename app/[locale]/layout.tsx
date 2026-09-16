import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { defaultLocale, getMessages, supportedLocales, type SupportedLocale } from "../i18n/getMessages";

const siteUrl = "https://crikvenica-villas.com";

function isSupportedLocale(value: string): value is SupportedLocale {
    return (supportedLocales as readonly string[]).includes(value);
}

export function generateStaticParams() {
    return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale: value } = await params;
    const locale = isSupportedLocale(value) ? value : defaultLocale;
    const languages = Object.fromEntries(
        supportedLocales.map((supportedLocale) => [supportedLocale, `${siteUrl}/${supportedLocale}`]),
    );

    return {
        alternates: {
            canonical: `${siteUrl}/${locale}`,
            languages,
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale: value } = await params;
    if (!isSupportedLocale(value)) notFound();

    const messages = await getMessages(value);
    return (
        <div lang={value}>
            <NextIntlClientProvider locale={value} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </div>
    );
}