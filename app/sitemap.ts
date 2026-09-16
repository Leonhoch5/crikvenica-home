import type { MetadataRoute } from "next";
import { supportedLocales } from "./i18n/getMessages";

const siteUrl = "https://crikvenica-villas.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const languages = Object.fromEntries(
        supportedLocales.map((locale) => [locale, `${siteUrl}/${locale}`]),
    );

    return supportedLocales.map((locale) => ({
        url: `${siteUrl}/${locale}`,
        changeFrequency: "monthly",
        priority: locale === "en" ? 1 : 0.8,
        alternates: { languages },
    }));
}