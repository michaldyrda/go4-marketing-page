import type { LandingLink, MarketingCta } from "./types";
/**
 * Link target of a button / tile, read from either shape:
 * new `cta.link = { kind, id?, url? }` or legacy `cta.type` + `url` / `collection_id`.
 * Legacy mapping (concept §5): `order_form` → all collections; `collection` →
 * that collection; a hand-typed `order?collection=all` → all collections;
 * any other URL → external.
 */
export declare function ctaLink(cta?: MarketingCta | null): LandingLink | null;
export declare const isExternalLink: (link: LandingLink) => boolean;
