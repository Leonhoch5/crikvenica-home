import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// In-memory rate limiter: max 5 submissions per IP per 15 minutes
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

type ContactPayload = {
  villa: string;
  name: string;
  email: string;
  message: string;
  recaptchaToken?: string;
  website?: string; // honeypot — must be empty
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }).toString(),
  });

  type RecaptchaResponse = {
    success: boolean;
    score: number;
    action: string;
    "error-codes"?: string[];
  };
  const data = (await res.json()) as RecaptchaResponse;
  return data.success && data.score >= 0.5;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtmlEmail(
  villa: string,
  name: string,
  email: string,
  message: string,
  origin: string,
): string {
  const host = origin.replace(/^https?:\/\//, "");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  body{font-family:ui-sans-serif,system-ui,sans-serif;color:#171717;background:#fff;margin:0;padding:0}
  .wrap{max-width:560px;margin:40px auto;padding:32px;border:1px solid #e5e5e5;border-radius:12px}
  h2{font-size:17px;font-weight:600;margin:0 0 24px}
  .field{margin-bottom:16px}
  .label{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:4px}
  .value{font-size:14px;color:#171717}
  .msg{background:#f5f5f5;border-radius:8px;padding:12px 14px;font-size:14px;line-height:1.6;white-space:pre-wrap}
  .foot{margin-top:24px;font-size:11px;color:#aaa}
  a{color:#171717}
</style>
</head>
<body>
<div class="wrap">
  <h2>New booking inquiry received via ${escapeHtml(host)}</h2>
  <div class="field"><div class="label">Property</div><div class="value">${escapeHtml(villa)}</div></div>
  <div class="field"><div class="label">Guest</div><div class="value">${escapeHtml(name)}</div></div>
  <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div></div>
  <div class="field"><div class="label">Message</div><div class="msg">${escapeHtml(message)}</div></div>
  <div class="foot">Submitted from: <a href="${escapeHtml(origin)}">${escapeHtml(origin)}</a></div>
</div>
</body>
</html>`;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let payload: Partial<ContactPayload>;
  try {
    payload = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: silently succeed so bots don't know they were blocked
  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  const villa = isNonEmptyString(payload.villa) ? payload.villa.trim() : "";
  const name = isNonEmptyString(payload.name) ? payload.name.trim() : "";
  const email = isNonEmptyString(payload.email) ? payload.email.trim() : "";
  const message = isNonEmptyString(payload.message) ? payload.message.trim() : "";

  if (!villa || !name || !email || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const isHuman = await verifyRecaptcha(payload.recaptchaToken ?? "");
  if (!isHuman) {
    return NextResponse.json({ ok: false, error: "recaptcha_failed" }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpServername = process.env.SMTP_SERVERNAME;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactTo = process.env.CONTACT_TO;
  const contactFrom = process.env.CONTACT_FROM;

  if (!smtpHost || !smtpServername || !smtpPort || !smtpUser || !smtpPass || !contactTo) {
    return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    tls: { servername: smtpServername },
    auth: { user: smtpUser, pass: smtpPass },
  });

  const origin = request.headers.get("origin") ?? "https://crikvenica-villas.com";
  const subject = `Booking inquiry for ${villa}`;
  const plainText = [
    `Property: ${villa}`,
    `Guest: ${name}`,
    `Email: ${email}`,
    "",
    message,
    "",
    `Submitted from: ${origin}`,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: contactFrom,
      to: contactTo,
      replyTo: email,
      subject,
      text: plainText,
      html: buildHtmlEmail(villa, name, email, message, origin),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending email:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: "send_failed", detail }, { status: 500 });
  }
}
