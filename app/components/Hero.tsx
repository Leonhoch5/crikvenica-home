import { Reveal } from "./Reveal";
import { LanguageSwitcher } from "./LanguageSwitcher";

type HeroProps = {
  locale: "en" | "de" | "hr" | "it";
  headline: string;
  subheadline: string;
  ctaExplore: string;
  note: string;
  languageLabel: string;
};

export function Hero({ locale, headline, subheadline, ctaExplore, note, languageLabel }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1400px_700px_at_20%_0%,color-mix(in_srgb,var(--foreground)_10%,transparent),transparent_60%),radial-gradient(900px_600px_at_90%_10%,color-mix(in_srgb,var(--foreground)_8%,transparent),transparent_60%)]" />
      <div className="mx-auto max-w-6xl px-6 pb-14 pt-20 sm:pb-20 sm:pt-28">
        <div className="flex items-center justify-between gap-6">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.22em] text-foreground/60">
              CRIKVENICA, CROATIA
            </p>
          </Reveal>

          <div className="shrink-0">
            <LanguageSwitcher value={locale} label={languageLabel} />
          </div>
        </div>

        <Reveal delayMs={80}>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl md:text-6xl">
            {headline}
          </h1>
        </Reveal>

        <Reveal delayMs={140}>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-foreground/75 sm:text-lg">
            {subheadline}
          </p>
        </Reveal>

        <Reveal delayMs={200}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#villas"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            >
              {ctaExplore}
            </a>
            <p className="text-sm text-foreground/60">
              {note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
