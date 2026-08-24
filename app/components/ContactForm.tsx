"use client";

import * as React from "react";

type ContactFormProps = {
  villas: readonly string[];
  villaLabel: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  sendingLabel: string;
  successTitle: string;
  successText: string;
  errorTitle: string;
  errorText: string;
};

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

async function getRecaptchaToken(): Promise<string> {
  if (!SITE_KEY || typeof window === "undefined" || !window.grecaptcha) return "";
  return new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action: "contact" }).then(resolve);
    });
  });
}

export function ContactForm({
  villas,
  villaLabel,
  nameLabel,
  emailLabel,
  messageLabel,
  submitLabel,
  sendingLabel,
  successTitle,
  successText,
  errorTitle,
  errorText,
}: ContactFormProps) {
  const [villa, setVilla] = React.useState(villas[0] ?? "");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "sending" | "success" | "error">("idle");

  React.useEffect(() => {
    if (!SITE_KEY) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    try {
      const recaptchaToken = await getRecaptchaToken();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ villa, name, email, message, recaptchaToken }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-foreground/10 bg-background p-6">
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm">
          <span className="text-foreground/80">{villaLabel}</span>
          <select
            value={villa}
            onChange={(event) => setVilla(event.target.value)}
            className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground/35"
          >
            {villas.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-foreground/80">{nameLabel}</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground/35"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-foreground/80">{emailLabel}</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
            className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground/35"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-foreground/80">{messageLabel}</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            rows={6}
            className="resize-none rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-foreground/35"
          />
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? sendingLabel : submitLabel}
        </button>

        {status === "success" ? (
          <div className="rounded-xl border border-foreground/10 bg-background px-4 py-3">
            <p className="text-sm font-medium text-foreground/85">{successTitle}</p>
            <p className="mt-1 text-sm text-foreground/70">{successText}</p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-xl border border-foreground/10 bg-background px-4 py-3">
            <p className="text-sm font-medium text-foreground/85">{errorTitle}</p>
            <p className="mt-1 text-sm text-foreground/70">{errorText}</p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
