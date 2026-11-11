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
/**
 * A section as stored — legacy (0.4.x) or new shape. The package reads it through
 * `normalizeSection`, so `config` is deliberately loose: content can reach the
 * database without passing the editor and is validated on every render.
 */
export interface MarketingSection {
    id: string;
    type: MarketingSectionType | LandingSectionType | string;
    is_visible: boolean;
    order_index: number;
    config: MarketingSectionConfig | LandingSectionConfig | Record<string, unknown>;
    /** Hero layout may also sit next to `config` (template files). */
    variant?: string | null;
    /** Data resolved by the host for Collections / Products / Contact. */
    resolved?: LandingResolved | null;
}
/**
 * Optional image-URL transformer (e.g. a CDN/Storage resizer). Receives the
 * source URL and the intended CSS width; returns the URL to load. Defaults to
 * identity, so the package works with plain URLs and no host coupling. When a
 * host passes one, images also get a `srcset` of several widths.
 */
export type TransformImageUrl = (url: string, width: number) => string;
/** Section types of the 15-component catalog (closed list). */
export type LandingSectionType = "hero" | "text_block" | "story" | "gallery" | "video" | "cards" | "collections" | "products" | "facts" | "features" | "quotes" | "logos" | "faq" | "cta" | "contact";
/** One image or video from the brand's library. */
export interface LandingMedia {
    /** Library file (UUID). */
    media_id?: string;
    /** Original file the crop was made from (UUID). */
    source_media_id?: string;
    /** Library file of the mobile crop (UUID). */
    mobile_media_id?: string;
    media_type?: "image" | "video";
    file_url?: string;
    mobile_file_url?: string;
    alt?: string;
    width?: number;
    height?: number;
    /** Video poster image. */
    poster_url?: string;
}
/** Inline text run of a formatted ("rich") text field (concept §11). */
export interface RichFragment {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    link?: LandingLink;
}
/** Paragraph = list of fragments. */
export type RichParagraph = RichFragment[];
/** Plain text (paragraphs split by an empty line) or a list of paragraphs. */
export type RichText = string | RichParagraph[];
export interface LandingButton {
    label: string;
    /** Null = no target yet (drawn only by legacy hosts). */
    link: LandingLink | null;
}
/** One element of `items[]`; which keys apply depends on the section type. */
export interface LandingItem {
    title?: string;
    body?: RichText;
    media?: LandingMedia;
    link?: LandingLink;
    caption?: string;
    subcaption?: string;
    value?: string;
    label?: string;
    text?: RichText;
    author?: string;
    role?: string;
    avatar?: LandingMedia;
    name?: string;
    question?: string;
    answer?: RichText;
    collection_id?: string;
    product_id?: string;
}
export interface LandingContactToggles {
    address?: boolean;
    email?: boolean;
    website?: boolean;
    instagram?: boolean;
}
/** Normalized `config` — the new stored shape. */
export interface LandingSectionConfig {
    variant?: "cover" | "split";
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    body?: RichText;
    caption?: string;
    media?: LandingMedia;
    buttons?: LandingButton[];
    items?: LandingItem[];
    image_side?: "left" | "right";
    mode?: "all" | "selected" | "collection";
    limit?: number;
    collection_id?: string;
    show_shipping?: boolean;
    show?: LandingContactToggles;
}
/** Collection tile data served by the host (never fetched by the package). */
export interface ResolvedCollection {
    id: string;
    name?: string;
    season?: string;
    /** Number of styles (products). */
    styles?: number;
    /** Shipping date text — the host omits it for guests (no wholesale info in public). */
    shipping?: string;
    cover?: LandingMedia;
    /** Server-resolved target (path / available); default `{ kind: "collection", id }`. */
    link?: LandingLink;
}
export interface ResolvedProduct {
    id: string;
    name?: string;
    category?: string;
    image?: LandingMedia;
    link?: LandingLink;
}
/** Brand details from Settings, only the ones the brand filled in. */
export interface ResolvedContact {
    address?: string;
    email?: string;
    website?: string;
    instagram?: string;
}
/** Data the host resolved for "From go4" sections (Collections, Products, Contact). */
export interface LandingResolved {
    collections?: ResolvedCollection[];
    products?: ResolvedProduct[];
    contact?: ResolvedContact;
}
export interface LandingSection {
    id: string;
    type: LandingSectionType;
    is_visible: boolean;
    order_index: number;
    config: LandingSectionConfig;
    resolved?: LandingResolved;
}
