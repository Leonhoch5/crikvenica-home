"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Reveal } from "./Reveal";
import { VillaGallery } from "./VillaGallery";

type VillaCardProps = {
  name: string;
  description: string;
  longDescription: string;
  bedrooms: number | string;
  bathrooms: number | string;
  maxGuests: number | string | null;
  images: readonly string[];
  index: number;
  ctaLabel: string;
  compact?: boolean;
  amenityLabels: {
    pool: string;
    wifi: string;
    parking: string;
    ac: string;
  };
  factLabels: {
    bedrooms: string;
    bathrooms: string;
    sleeps: string;
  };
};

export function VillaCard({
  name,
  description,
  longDescription,
  bedrooms,
  bathrooms,
  maxGuests,
  images,
  index,
  ctaLabel,
  compact = false,
  amenityLabels,
  factLabels,
}: VillaCardProps) {
  // Controls the fullscreen preview modal.
  const [isOpen, setIsOpen] = React.useState(false);

  // Prevents `document` access during SSR and avoids createPortal until mounted.
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    // When the preview is open, lock body scroll and allow Escape to close.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function openIfNotInteractiveTarget(event: React.MouseEvent<HTMLElement>) {
    // Make the whole card clickable, but don't steal clicks from buttons/links.
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest("a,button")) return;
    setIsOpen(true);
  }

  function goToContact() {
    // CTA behavior: close preview (if open) then smooth-scroll to the contact form.
    setIsOpen(false);
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Reveal delayMs={Math.min(index * 80, 240)}>
      <article
        className={`group flex h-full cursor-pointer flex-col rounded-3xl border border-foreground/10 bg-background/60 ${compact ? "p-2 sm:p-3" : "p-3"} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:bg-background`}
        role="button"
        tabIndex={0}
        onClick={openIfNotInteractiveTarget}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {/* Card images (small gallery preview) */}
        <VillaGallery images={images} alt={name} />

        {/* Card summary (title, short description, facts, amenities, CTA) */}
        <div className="flex flex-1 flex-col px-1 pb-2 pt-5">
          <h3 className={`${compact ? "text-lg" : "text-xl"} font-semibold tracking-[-0.02em]`}>{name}</h3>
          <p className={`mt-2 ${compact ? "text-xs leading-5" : "text-sm leading-6"} text-foreground/70`}>{description}</p>

          {/* Quick facts */}
          <div className={`mt-4 flex flex-wrap gap-2 ${compact ? "text-[11px]" : "text-xs"} text-foreground/70`}>
            <Fact label={factLabels.bedrooms} value={bedrooms} />
            <Fact label={factLabels.bathrooms} value={bathrooms} />
            {maxGuests != null ? (
              <Fact label={factLabels.sleeps} value={maxGuests} />
            ) : null}
          </div>

          {/* Amenity chips */}
          <div className={`mt-5 flex flex-wrap items-center gap-2 ${compact ? "text-[11px]" : "text-xs"} text-foreground/70`}>
            <Amenity icon={<PoolIcon className="h-4 w-4" />} label={amenityLabels.pool} />
            <Amenity icon={<WifiIcon className="h-4 w-4" />} label={amenityLabels.wifi} />
            <Amenity icon={<ParkingIcon className="h-4 w-4" />} label={amenityLabels.parking} />
            <Amenity icon={<SnowflakeIcon className="h-4 w-4" />} label={amenityLabels.ac} />
          </div>


        </div>
      </article>

      {isMounted && isOpen
        ? createPortal(
          <div className="fixed inset-0 z-50">
            {/* Backdrop: clicking outside closes the preview */}
            <button
              type="button"
              aria-label="Close preview"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`${name} preview`}
                className="h-[92vh] w-[96vw] max-w-350 overflow-hidden rounded-3xl border border-foreground/10 bg-background"
              >
                <div className="flex h-full flex-col">
                  {/* Preview header */}
                  <div className="flex items-start justify-between gap-4 border-b border-foreground/10 px-6 py-5">
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold tracking-[-0.02em]">{name}</h3>
                      <p className="mt-2 text-sm text-foreground/70">{description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground/70 transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35"
                      aria-label="Close"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Preview content: big images + details */}
                  <div className="grid flex-1 gap-10 overflow-y-auto p-6 lg:grid-cols-2 lg:items-start">
                    <div className="flex flex-col gap-6">
                      {/* Big preview images */}
                      <VillaGallery images={images} alt={name} />

                      {/* Prices table (structure only; data to be added later) */}
                      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background">
                        <table className="w-full border-collapse text-sm">
                          <caption className="px-4 py-3 text-left text-xs font-medium text-foreground/70">
                            Prices
                          </caption>
                          <thead className="border-t border-foreground/10">
                            <tr className="text-left text-xs text-foreground/60">
                              <th scope="col" className="px-4 py-3 font-medium">
                                Season
                              </th>
                              <th scope="col" className="px-4 py-3 font-medium">
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody />
                        </table>
                      </div>
                    </div>

                    {/* Long description + facts + amenities + CTA */}
                    <div className="flex flex-col">
                      <div className="flex flex-wrap gap-2 text-xs text-foreground/70">
                        <Fact label={factLabels.bedrooms} value={bedrooms} />
                        <Fact label={factLabels.bathrooms} value={bathrooms} />
                        {maxGuests != null ? (
                          <Fact label={factLabels.sleeps} value={maxGuests} />
                        ) : null}
                      </div>

                      {/* Long text uses newlines from translations */}
                      <div className="mt-6 whitespace-pre-line text-sm leading-6 text-foreground/70">
                        {longDescription}
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-foreground/70">
                        <Amenity icon={<PoolIcon className="h-4 w-4" />} label={amenityLabels.pool} />
                        <Amenity icon={<WifiIcon className="h-4 w-4" />} label={amenityLabels.wifi} />
                        <Amenity icon={<ParkingIcon className="h-4 w-4" />} label={amenityLabels.parking} />
                        <Amenity icon={<SnowflakeIcon className="h-4 w-4" />} label={amenityLabels.ac} />
                      </div>

                      <div className="mt-8">
                        <button
                          type="button"
                          onClick={goToContact}
                          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
                        >
                          {ctaLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
        : null}
    </Reveal>
  );
}

function Fact({ label, value }: { label: string; value: number | string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-3 py-1">
      <span className="text-foreground/60">{label}</span>
      <span className="font-medium text-foreground/85">{value}</span>
    </span>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function Amenity({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-3 py-1">
      <span className="text-foreground/80" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
}

function PoolIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M4 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M4 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M7 4v7" />
      <path d="M17 4v7" />
      <path d="M7 7h10" />
    </svg>
  );
}

function WifiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M8.5 15.5a6 6 0 0 1 7 0" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function ParkingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M7 4h6a4 4 0 0 1 0 8H7V4z" />
      <path d="M7 12v8" />
      <path d="M5 20h4" />
      <path d="M17 20h2" />
    </svg>
  );
}

function SnowflakeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M12 2v20" />
      <path d="M4.93 4.93l14.14 14.14" />
      <path d="M19.07 4.93L4.93 19.07" />
      <path d="M2 12h20" />
    </svg>
  );
}
