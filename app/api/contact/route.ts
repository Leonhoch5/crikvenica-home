import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


export const runtime = "nodejs";

type ContactPayload = {
  villa: string;
  name: string;
  email: string;
  message: string;
  recaptchaToken?: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // skip verification if not configured

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }).toString(),
  });

  type RecaptchaResponse = { success: boolean; score: number; action: string; "error-codes"?: string[] };
  const data = (await res.json()) as RecaptchaResponse;
  console.log("reCAPTCHA verify response:", JSON.stringify(data));
  return data.success && data.score >= 0.5;
}

export async function POST(request: Request) {
  let payload: Partial<ContactPayload>;
  try {
    payload = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const villa = isNonEmptyString(payload.villa) ? payload.villa.trim() : "";
  const name = isNonEmptyString(payload.name) ? payload.name.trim() : "";
  const email = isNonEmptyString(payload.email) ? payload.email.trim() : "";
  const message = isNonEmptyString(payload.message) ? payload.message.trim() : "";

  if (!villa || !name || !email || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const recaptchaToken = payload.recaptchaToken ?? "";
  const isHuman = await verifyRecaptcha(recaptchaToken);
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
    return NextResponse.json(
      { ok: false, error: "server_not_configured" },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    tls: { servername: smtpServername },
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subject = `New inquiry: ${villa}`;
  const text = [
    `Villa: ${villa}`,
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: contactFrom,
      to: contactTo,
      replyTo: email,
      subject,
      text,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending email:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: "send_failed", detail }, { status: 500 });
  }
}
