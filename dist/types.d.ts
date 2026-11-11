/**
 * Presentational contract for the collection marketing page.
 *
 * Intentionally a *structural* shape (nullable, loose) so any host — the admin
 * editor, the B2B portal, the public brand page — can pass its own richer types
 * straight in. The package never imports any app's design system or domain types.
 */
export type MarketingCtaType = "order_form" | "external_link" | "collection";
/**
 * Where a button, tile or inline link leads. Authored content stores only
 * `{ kind, id?, url? }`; the server that serves the page may add `path` and
 * `available` for the context it serves (B2B Space, public page). The package
 * never computes availability itself — it asks the host via `resolveHref`.
 */
export type LandingLinkKind = "catalog" | "collection" | "product" | "portal_view" | "external" | "login" | "register";
export interface LandingLink {
    kind: LandingLinkKind | string;
    /** Collection / product UUID or portal view key. */
    id?: string | null;
    /** Only for `external`. Sanitized before use. */
    url?: string | null;
    /** Relative path resolved by the server for the current context. */
    path?: string | null;
    /** `false` = target unavailable in this context → no link is rendered. */
    available?: boolean | null;
    reason?: string | null;
}
/** Host turns a link target into an href (or null = render without a link). */
export type ResolveHref = (link: LandingLink) => string | null | undefined;
export interface MarketingCta {
    label?: string | null;
    type?: MarketingCtaType | string | null;
    /** Only meaningful for external_link. Sanitized before use. */
    url?: string | null;
    /** Only meaningful for type "collection": the target collection UUID. */
    collection_id?: string | null;
    /** New shape: explicit link target. Wins over `type` / `url` / `collection_id`. */
    link?: LandingLink | null;
}
export interface MarketingMediaItem {
    role?: string | null;
    media_type?: string | null;
    file_url?: string | null;
    /** Optional mobile crop (different shape) shown on narrow screens. */
    mobile_file_url?: string | null;
    /** Alternative text written by the brand. */
    alt?: string | null;
    /** Intrinsic pixel size of `file_url` — prevents layout shift. */
    width?: number | null;
    height?: number | null;
    /** Video poster image. */
    poster_url?: string | null;
}
/** One card of a `cards` section: image + text + optional per-card CTA. */
export interface MarketingCardItem {
    title?: string | null;
    body?: string | null;
    file_url?: string | null;
    mobile_file_url?: string | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
    cta?: MarketingCta | null;
}
export interface MarketingSectionConfig {
    title?: string | null;
    subtitle?: string | null;
    body?: string | null;
    caption?: string | null;
    media?: MarketingMediaItem[] | null;
    items?: MarketingCardItem[] | null;
    cta?: MarketingCta | null;
}
export type MarketingSectionType = "hero" | "story" | "team" | "materials" | "text_block" | "cta" | "video" | "cards";
export interface MarketingSection {
    id: string;
    type: MarketingSectionType | string;
    is_visible: boolean;
    order_index: number;
    config: MarketingSectionConfig;
}
/**
 * Optional image-URL transformer (e.g. a CDN/Storage resizer). Receives the
 * source URL and the intended CSS width; returns the URL to load. Defaults to
 * identity, so the package works with plain URLs and no host coupling. When a
 * host passes one, images also get a `srcset` of several widths.
 */
export type TransformImageUrl = (url: string, width: number) => string;
