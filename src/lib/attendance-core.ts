/**
 * Attendance primitives shared by the demo server and (mirrored in) the backend.
 * Rotating tokens: HMAC-SHA256(secret, `${sessionId}:${window}`), window = 15 s.
 */
export const TOKEN_WINDOW_MS = 15_000;
export const CAMPUS = { lat: 19.17995, lng: 72.97195, radiusM: 500 };
export const LATE_AFTER_MIN = 10;

const enc = new TextEncoder();
const keyCache = new Map<string, CryptoKey>();

async function hmacHex(secret: string, message: string) {
  let key = keyCache.get(secret);
  if (!key) {
    key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    keyCache.set(secret, key);
  }
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const currentWindow = (now = Date.now()) => Math.floor(now / TOKEN_WINDOW_MS);

/** QR token (16 hex) and 6-digit fallback code for a session at a given window. */
export async function tokenFor(sessionId: string, secret: string, window = currentWindow()) {
  const h = await hmacHex(secret, `${sessionId}:${window}`);
  const code = String(parseInt(h.slice(0, 8), 16) % 1_000_000).padStart(6, '0');
  return { token: h.slice(0, 16), code, window, expiresInMs: (window + 1) * TOKEN_WINDOW_MS - Date.now() };
}

/** Accepts the current or previous window (≤ 30 s old) to tolerate slow networks. */
export async function verifyToken(sessionId: string, secret: string, input: { token?: string; code?: string }, now = Date.now()) {
  const w = currentWindow(now);
  for (const win of [w, w - 1]) {
    const v = await tokenFor(sessionId, secret, win);
    if ((input.token && input.token === v.token) || (input.code && input.code.replace(/\s/g, '') === v.code)) return true;
  }
  return false;
}

export function distanceM(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/** A per-browser id used to flag one phone marking several trainees in the same session. */
export function deviceId() {
  try {
    let id = localStorage.getItem('iti.device');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('iti.device', id);
    }
    return id;
  } catch {
    return 'unknown-device';
  }
}

export const pct = (num: number, den: number) => (den ? Math.round((num / den) * 1000) / 10 : 0);
