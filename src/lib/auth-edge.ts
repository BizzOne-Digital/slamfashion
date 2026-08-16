function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );
  return atob(padded);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifySessionTokenEdge(
  token: string
): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
    if (!secret) return false;

    const [payloadB64, signatureHex] = token.split(".");
    if (!payloadB64 || !signatureHex) return false;

    const payload = decodeBase64Url(payloadB64);
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );
    const expectedHex = bufferToHex(sigBuffer);

    if (signatureHex !== expectedHex) return false;

    const { exp } = JSON.parse(payload) as { exp: number };
    return Date.now() < exp;
  } catch {
    return false;
  }
}
