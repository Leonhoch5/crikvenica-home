"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type LanguageSwitcherProps = {
  value: "en" | "de" | "hr" | "it";
  label: string;
};

const options = [
  { value: "en", label: "EN" },
  { value: "de", label: "DE" },
  { value: "hr", label: "HR" },
  { value: "it", label: "IT" },
] as const;

export function LanguageSwitcher({ value, label }: LanguageSwitcherProps) {
  const router = useRouter();

  function setLocale(nextLocale: (typeof options)[number]["value"]) {
    if (nextLocale === value) return;

    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `locale=${nextLocale}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs font-medium tracking-[0.22em] text-foreground/60 sm:inline">
        {label}
      </span>
      <div className="inline-flex overflow-hidden rounded-full border border-foreground/10 bg-background/70 backdrop-blur">
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLocale(opt.value)}
              aria-pressed={isActive}
              className={
                "h-9 px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 " +
                (isActive
                  ? "bg-foreground text-background"
                  : "text-foreground/70 hover:bg-foreground/5")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
