import type { LandingButton, LandingLink, LandingLinkKind, MarketingCta } from "./types";
/** Link target kinds (closed list, concept §4). */
export declare const LANDING_LINK_KINDS: readonly LandingLinkKind[];
/**
 * Validated link target: kind from the closed list, `id` a UUID for collection /
 * product and a short key for a portal view, `url` only for external (checked by
 * `safeHref`). Server-added `path` / `available` / `reason` are kept for drawing.
 * Anything else → null.
 */
export declare function normalizeLink(raw: unknown): LandingLink | null;
/**
 * Link target of a button / tile, read from either shape:
 * new `cta.link = { kind, id?, url? }` or legacy `cta.type` + `url` / `collection_id`.
 * Legacy mapping (concept §5): `order_form` → all collections; `collection` →
 * that collection; a hand-typed `order?collection=all` → all collections;
 * any other URL → external.
 */
export declare function ctaLink(cta?: MarketingCta | null): LandingLink | null;
export declare const isExternalLink: (link: LandingLink) => boolean;
/**
 * Legacy hosts (only `onCtaClick`, no `resolveHref`) get a 0.4.x-shaped CTA back:
 * `type` + `collection_id` / `url`, plus the `link` itself.
 */
export declare function legacyCta(button: LandingButton): MarketingCta;
