"use client";

import Image from "next/image";
import * as React from "react";

type VillaGalleryProps = {
  images: readonly string[];
  alt: string;
};

const FALLBACK_SRC = "/villas/fallback.jpg";

export function VillaGallery({ images, alt }: VillaGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [safeSources, setSafeSources] = React.useState<string[]>(() =>
    images.slice(0, 3).map((src) => src),
  );

  const activeSrc = safeSources[activeIndex] ?? FALLBACK_SRC;

  function goPrevious() {
    setActiveIndex((i) => (i - 1 + safeSources.length) % safeSources.length);
  }

  function goNext() {
    setActiveIndex((i) => (i + 1) % safeSources.length);
  }

  function handleImageError(index: number) {
    setSafeSources((prev) => {
      const next = prev.slice();
      // Fallback exists for hotlinking/availability changes and legal-safe local rendering.
      next[index] = FALLBACK_SRC;
      return next;
    });
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-background">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={activeSrc}
          alt={alt}
          fill
          priority={false}
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={() => handleImageError(activeIndex)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-70" />

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous image"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background/70 text-foreground/80 backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background/70 text-foreground/80 backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3">
        {safeSources.map((src, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={
                "relative aspect-[4/3] overflow-hidden rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 " +
                (isActive
                  ? "border-foreground/30"
                  : "border-foreground/10 hover:border-foreground/25")
              }
              aria-label={`Open image ${index + 1}`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 140px, 33vw"
                className="object-cover"
                onError={() => handleImageError(index)}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
