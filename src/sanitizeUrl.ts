/**
 * URL guards. Page content is authored data and can be written to the database
 * without passing through the editor, so every URL is checked again here before
 * it reaches an href or <img src> — defence in depth against `javascript:`,
 * `data:text`, protocol-relative and credential-carrying URLs.
 */

// Control characters and whitespace inside a URL are never legitimate here.
const UNSAFE_CHARS = /[\x00-\x20\x7f-\x9f<>"'`\\]/;

/**
 * Allowed: http(s) without credentials, same-origin path, `mailto:` (address
 * only, no parameters), `tel:` (optional + and digits — the server normalizes). Undefined otherwise.
 */
export function safeHref(url?: string | null): string | undefined {
  if (!url) return undefined;
  const t = url.trim();
  if (!t || UNSAFE_CHARS.test(t)) return undefined;
  if (/^https?:\/\//i.test(t)) {
    try {
      const u = new URL(t);
      if (u.username || u.password) return undefined;
      if (u.protocol !== "http:" && u.protocol !== "https:") return undefined;
      return t;
    } catch {
      return undefined;
    }
  }
  if (/^mailto:/i.test(t)) {
    return /^mailto:[^\s?&#@:/]+@[^\s?&#@:/]+$/i.test(t) ? t : undefined;
  }
  if (/^tel:/i.test(t)) {
    return /^tel:\+?[0-9]{3,20}$/.test(t) ? t : undefined;
  }
  if (t.startsWith("/") && !t.startsWith("//") && !t.startsWith("/\\")) return t; // same-origin path
  return undefined;
}

/** http(s), same-origin path, or a data:image/* URI. Returns undefined otherwise. */
export function safeImgSrc(url?: string | null): string | undefined {
  if (!url) return undefined;
  const t = url.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (/^data:image\/(png|jpe?g|gif|webp|avif);/i.test(t)) return t;
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  return undefined;
}

/** Positive integer pixel size, or undefined. */
export function safeDimension(n?: number | null): number | undefined {
  return typeof n === "number" && Number.isFinite(n) && n > 0 && n < 20000
    ? Math.round(n)
    : undefined;
}
