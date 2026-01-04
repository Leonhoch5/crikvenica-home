"use client";

import * as React from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
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
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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
