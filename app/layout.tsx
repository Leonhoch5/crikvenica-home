import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { defaultLocale, getMessages, supportedLocales } from "./i18n/getMessages";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crikvenica Villas",
  description:
    "Three exceptional villas in Crikvenica, Croatia. Informational site — reservations completed securely via Booking.com.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? defaultLocale;
  const safeLocale = (supportedLocales as readonly string[]).includes(locale)
    ? locale
    : defaultLocale;
  const messages = await getMessages(safeLocale);
  return (
    <html lang={safeLocale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
