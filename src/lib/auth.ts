import { createHmac, timingSafeEqual } from "crypto";
import { SESSION_DURATION_MS } from "./auth-constants";

export { SESSION_COOKIE, SESSION_DURATION_MS } from "./auth-constants";

export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

function getSecret(): string {
  const secret =
    process.env.ADMIN_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim();
  if (!secret) {
    throw new Error("AUTH_NOT_CONFIGURED");
  }
  return secret;
}

export function createSessionToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_DURATION_MS });
  const signature = createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    if (!isAuthConfigured()) return false;

    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;

    const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
    const expected = createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");

    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (sigBuffer.length !== expectedBuffer.length) return false;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return false;

    const { exp } = JSON.parse(payload) as { exp: number };
    return Date.now() < exp;
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;

  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);
  if (inputBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(inputBuffer, expectedBuffer);
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DURATION_MS / 1000,
};
