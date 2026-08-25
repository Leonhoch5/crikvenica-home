"use client";

import * as React from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(() => {
    // If the user prefers reduced motion, or IntersectionObserver isn't available
    // (older mobile browsers, privacy modes), just show the content immediately.
    if (typeof window === "undefined") return false;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    return Boolean(prefersReducedMotion) || typeof IntersectionObserver === "undefined";
  });

  React.useEffect(() => {
    if (isVisible) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      // A small positive margin so content just below the fold reveals slightly
      // early instead of waiting for a large negative margin to be crossed
      // (which can make the animation feel like it never fires, especially on
      // short mobile viewports with tall sections).
      { root: null, rootMargin: "0px 0px 40px 0px", threshold: 0 },
    );

    observer.observe(element);

    // Safety net: if the observer never fires (e.g. layout quirks on some
    // mobile browsers), make sure the content still becomes visible.
    const fallback = window.setTimeout(() => setIsVisible(true), 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [isVisible]);


  return (
    <div
      ref={ref}
      className={
        "transition-all duration-700 ease-out will-change-transform " +
        (isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3") +
        (className ? ` ${className}` : "")
      }
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
