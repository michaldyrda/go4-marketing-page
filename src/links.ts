import type { LandingLink, MarketingCta } from "./types";

const ALL_COLLECTIONS_URL = /^\/?(?:[^?#]*\/)?order\?collection=all$/i;

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
