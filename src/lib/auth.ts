const COOKIE_NAME = "craftick_admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

type SessionPayload = {
  username: string;
  exp: number;
};

// Encode/decode helpers (base64url, works in Workers + Node 18+)
function toBase64Url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function fromBase64Url(str: string): ArrayBuffer {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSession(
  username: string,
  secret: string
): Promise<string> {
  const payload: SessionPayload = { username, exp: Date.now() + SESSION_TTL_MS };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${toBase64Url(sig)}`;
}

export async function verifySession(
  cookie: string,
  secret: string
): Promise<SessionPayload | null> {
  try {
    const dot = cookie.lastIndexOf(".");
    if (dot === -1) return null;
    const payloadB64 = cookie.slice(0, dot);
    const sigB64 = cookie.slice(dot + 1);

    const key = await getHmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sigB64),
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return null;

    const payload: SessionPayload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payloadB64))
    );
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

// Timing-safe string comparison to prevent timing attacks
export function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  if (aBytes.length !== bBytes.length) {
    // still iterate to avoid timing leak on length
    let result = 1;
    for (let i = 0; i < aBytes.length; i++) result |= aBytes[i] ^ (bBytes[i % bBytes.length] ?? 0);
    return false;
  }
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}

export { COOKIE_NAME };
