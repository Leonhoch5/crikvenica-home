import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Reveal } from "./components/Reveal";
import { VillaCard } from "./components/VillaCard";
import { villaImagesByName, villas } from "./lib/villas";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { defaultLocale, supportedLocales } from "./i18n/getMessages";

export default async function Home() {
  const t = await getTranslations();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? defaultLocale;
  const safeLocale = (supportedLocales as readonly string[]).includes(locale)
    ? (locale as (typeof supportedLocales)[number])
    : defaultLocale;

  return (
    <div className="min-h-screen">
      <Hero
        locale={safeLocale}
        headline={t("hero.headline")}
        subheadline={t("hero.subheadline")}
        ctaExplore={t("hero.cta")}
        note={t("hero.note")}
        languageLabel={t("language.label")}
      />

      <main className="mx-auto max-w-6xl px-6">
        <section id="villas" className="scroll-mt-16 pb-16 pt-4 sm:pb-24">
          <Reveal>
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                {t("sections.villas.title")}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-foreground/70 sm:text-base">
                {t("sections.villas.subtitle")}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {villas.map((villa, index) => (
              <VillaCard
                key={villa.name}
                name={villa.name}
                description={villa.descriptions[safeLocale]}
                longDescription={villa.longDescriptions[safeLocale]}
                bedrooms={villa.bedrooms}
                bathrooms={villa.bathrooms}
                maxGuests={villa.maxGuests}
                bookingUrl={villa.bookingUrl}
                images={villaImagesByName[villa.name]}
                index={index}
                ctaLabel={t("villa.ctaBooking")}
                amenityLabels={{
                  pool: t("amenities.pool"),
                  wifi: t("amenities.wifi"),
                  parking: t("amenities.parking"),
                  ac: t("amenities.ac"),
                }}
                factLabels={{
                  bedrooms: t("facts.bedrooms"),
                  bathrooms: t("facts.bathrooms"),
                  sleeps: t("facts.sleeps"),
                }}
              />
            ))}
          </div>
        </section>

        <section className="pb-20 sm:pb-28">
          <Reveal>
            <div className="rounded-3xl border border-foreground/10 bg-background/60 p-6 backdrop-blur-sm sm:p-10">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-xs font-medium tracking-[0.22em] text-foreground/60">
                    {t("sections.location.kicker")}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                    {t("sections.location.title")}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-foreground/70 sm:text-base">
                    {t("sections.location.text")}
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background">
                  <div className="relative aspect-[16/10] w-full">
                    <iframe
                      title={t("sections.location.mapTitle")}
                      src="https://www.google.com/maps?q=Crikvenica%2C%20Croatia&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer
        copyright={t("footer.copyright")}
        disclaimer={t("footer.disclaimer")}
      />
    </div>
  );
}
