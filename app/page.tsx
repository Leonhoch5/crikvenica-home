import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { ContactForm } from "./components/ContactForm";
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

  const storyText = [
    "Perched on a peaceful hillside above the Adriatic Sea, Crikvenica Villas is a unique collection of three beautifully restored stone villas in Crikvenica, on Croatia's stunning Kvarner coast.",
    "Surrounded by vineyards, olive groves, lavender, rosemary, and fragrant Mediterranean herbs, the property captures the authentic spirit of Croatia's Kvarner coast while offering every modern comfort.",
    "Set within nearly 2,000 m² of landscaped grounds, the property comprises three carefully restored 19th-century stone villas. Renovated in 2007, each villa preserves the character of a traditional stara primorska kuća—the authentic stone houses of the Primorje region—while providing the comfort, privacy, and amenities expected of a rural holiday home.",
    "The three villas — Villa Ivanka, Villa Milka, and Villa Vesna — were lovingly restored from traditional 19th - century stone houses, preserving their original character while creating welcoming spaces for today’s travellers. Each villa has its own private garden and swimming pool, allowing couples, families, and groups of friends to enjoy a truly relaxing escape surrounded by nature. Although the villas offer complete peace and privacy, the seaside town of Crikvenica is only about 3 km away. There you will find everything you need for your holiday: local shops for daily essentials, a wide choice of restaurants, cafés, bars, and ice - cream parlours, as well as numerous activities both on the water and on land.",
    "Our vineyard and olive grove were planted in 2008 and remain a cherished family project. Although we do not live on the property, you may occasionally see us caring for the vines, olive trees, and gardens to ensure they flourish throughout the seasons. We invite you to enjoy the fresh herbs growing around the villas, adding the flavours and aromas of the Mediterranean to your meals.",

    "Whether you are planning a romantic escape, a relaxing family holiday, or a memorable gathering with friends, Crikvenica Villas offers an unforgettable retreat where heritage, nature, and contemporary comfort come together.",
  ];

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
      <main className="mx-auto max-w-6xl px-4 sm:px-5">
        <section className="-mx-4 pb-16 pt-2 sm:-mx-5 sm:pb-20">
          <Reveal>
            <div className="rounded-3xl border border-foreground/10 bg-background/60 p-6 backdrop-blur-sm sm:p-8">
              <div className="grid gap-8">
                {/* Text container – no max-width restriction */}
                <div>
                  {/* Map – floated right, compact size */}
                  <div className="float-right ml-6 mb-4 w-full max-w-xs h-72 overflow-hidden rounded-2xl border border-foreground/10 bg-background">
                    <div className="relative w-full h-full">
                      <iframe
                        title={t("sections.location.mapTitle")}
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d679.625034542714!2d14.713653386830547!3d45.17470800163428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47637b8b1475e16f%3A0x6e62c1f71f20026a!2sKu%C4%87e%20kamene%20d.o.o.!5e1!3m2!1sde!2shr!4v1785511855481!5m2!1sde!2shr"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  </div>

                  {/* Story paragraphs – text wraps around map */}
                  {storyText.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className={`text-sm leading-7 text-foreground/75 sm:text-base ${idx > 0 ? "mt-5" : ""
                        }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div id="villas">
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                    {t("sections.villas.title")}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-foreground/75 sm:text-base">
                    {t("sections.villas.subtitle")}
                  </p>
                </div>
                {/* Villa cards */}
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" >
                  {villas.slice(0, 3).map((villa, index) => (
                    <div key={villa.name} className="w-full">
                      <VillaCard
                        compact
                        name={villa.name}
                        description={villa.descriptions[safeLocale]}
                        longDescription={villa.longDescriptions[safeLocale]}
                        bedrooms={villa.bedrooms}
                        bathrooms={villa.bathrooms}
                        maxGuests={villa.maxGuests}
                        images={villaImagesByName[villa.name]}
                        index={index}
                        ctaLabel={t("villa.ctaContact")}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="scroll-mt-16 pb-20 sm:pb-28">
          <Reveal>
            <div className="rounded-3xl border border-foreground/10 bg-background/60 p-6 backdrop-blur-sm sm:p-10">
              <div className="grid gap-10">
                <div>
                  <p className="text-xs font-medium tracking-[0.22em] text-foreground/60">
                    {t("sections.contact.kicker")}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                    {t("sections.contact.title")}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-foreground/75 sm:text-base">
                    {t("sections.contact.text")}
                  </p>
                </div>
                <ContactForm
                  villaLabel={t("contact.villaLabel")}
                  nameLabel={t("contact.nameLabel")}
                  emailLabel={t("contact.yourEmailLabel")}
                  messageLabel={t("contact.messageLabel")}
                  submitLabel={t("contact.submit")}
                  sendingLabel={t("contact.sending")}
                  successTitle={t("contact.successTitle")}
                  successText={t("contact.successText")}
                  errorTitle={t("contact.errorTitle")}
                  errorText={t("contact.errorText")}
                  villas={villas.map((v) => v.name)}
                />
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