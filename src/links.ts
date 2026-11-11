import { isUuid, safeHref } from "./sanitizeUrl";
import type { LandingButton, LandingLink, LandingLinkKind, MarketingCta } from "./types";

const ALL_COLLECTIONS_URL = /^\/?(?:[^?#]*\/)?order\?collection=all$/i;

/** Link target kinds (closed list, concept §4). */
export const LANDING_LINK_KINDS: readonly LandingLinkKind[] = [
  "catalog",
  "collection",
  "product",
  "portal_view",
  "external",
  "login",
  "register",
];

const PORTAL_VIEW_KEY = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

/**
 * Validated link target: kind from the closed list, `id` a UUID for collection /
 * product and a short key for a portal view, `url` only for external (checked by
 * `safeHref`). Server-added `path` / `available` / `reason` are kept for drawing.
 * Anything else → null.
 */
export function normalizeLink(raw: unknown): LandingLink | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const kind = own(r, "kind") ? r.kind : undefined;
  if (typeof kind !== "string" || !(LANDING_LINK_KINDS as readonly string[]).includes(kind)) return null;
  const out: LandingLink = { kind };
  const id = own(r, "id") ? r.id : undefined;
  if (kind === "collection" || kind === "product") {
    if (!isUuid(id)) return null;
    out.id = id.toLowerCase();
  } else if (kind === "portal_view") {
    if (typeof id !== "string" || !PORTAL_VIEW_KEY.test(id)) return null;
    out.id = id;
  } else if (kind === "external") {
    const url = safeHref(typeof r.url === "string" ? r.url : null);
    if (!url || !own(r, "url")) return null;
    out.url = url;
  }
  if (own(r, "path") && typeof r.path === "string") out.path = r.path;
  if (own(r, "available") && typeof r.available === "boolean") out.available = r.available;
  if (own(r, "reason") && typeof r.reason === "string") out.reason = r.reason;
  return out;
}

/**
 * Link target of a button / tile, read from either shape:
 * new `cta.link = { kind, id?, url? }` or legacy `cta.type` + `url` / `collection_id`.
 * Legacy mapping (concept §5): `order_form` → all collections; `collection` →
 * that collection; a hand-typed `order?collection=all` → all collections;
 * any other URL → external.
 */
export function ctaLink(cta?: MarketingCta | null): LandingLink | null {
  if (!cta) return null;
  if (cta.link && typeof cta.link === "object" && typeof cta.link.kind === "string") {
    return cta.link;
  }
  switch (cta.type) {
    case "order_form":
      return { kind: "catalog" };
    case "collection":
      return cta.collection_id ? { kind: "collection", id: cta.collection_id } : null;
    case "external_link": {
      const url = cta.url?.trim();
      if (!url) return null;
      if (ALL_COLLECTIONS_URL.test(url)) return { kind: "catalog" };
      return { kind: "external", url };
    }
    default:
      return null;
  }
}

export const isExternalLink = (link: LandingLink) => link.kind === "external";

/**
 * Legacy hosts (only `onCtaClick`, no `resolveHref`) get a 0.4.x-shaped CTA back:
 * `type` + `collection_id` / `url`, plus the `link` itself.
 */
export function legacyCta(button: LandingButton): MarketingCta {
  const { label, link } = button;
  if (!link) return { label };
  switch (link.kind) {
    case "catalog":
      return { label, type: "order_form", link };
    case "collection":
      return { label, type: "collection", collection_id: link.id ?? null, link };
    case "external":
      return { label, type: "external_link", url: link.url ?? null, link };
    default:
      return { label, link };
  }
}
