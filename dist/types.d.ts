/**
 * Presentational contract for the collection marketing page.
 *
 * Intentionally a *structural* shape (nullable, loose) so any host — the admin
 * editor, the B2B portal — can pass its own richer types straight in. The
 * package never imports either app's design system or domain types.
 */
export type MarketingCtaType = "order_form" | "external_link";
export interface MarketingCta {
    label?: string | null;
    type?: MarketingCtaType | string | null;
    /** Only meaningful for external_link. Sanitized before use. */
    url?: string | null;
}
export interface MarketingMediaItem {
    role?: string | null;
    media_type?: string | null;
    file_url?: string | null;
    /** Optional mobile crop (different shape) shown on narrow screens. */
    mobile_file_url?: string | null;
}
/** One card of a `cards` section: image + text + optional per-card CTA. */
export interface MarketingCardItem {
    title?: string | null;
    body?: string | null;
    file_url?: string | null;
    mobile_file_url?: string | null;
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
 * identity, so the package works with plain URLs and no host coupling.
 */
export type TransformImageUrl = (url: string, width: number) => string;
