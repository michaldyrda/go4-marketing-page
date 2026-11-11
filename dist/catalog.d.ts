/**
 * The component catalog (concept §5) — one source for the editor (palette,
 * fields, limits, crops), the HTML import and the server. Limits count text only.
 */
import type { LandingSectionType } from "./types";
/** Character limits from concept §5. */
export declare const TEXT_LIMITS: {
    readonly eyebrow: 80;
    readonly title: 80;
    readonly subtitle: 120;
    readonly body: 600;
    readonly heroBody: 300;
    readonly buttonLabel: 30;
    readonly alt: 125;
};
export type CatalogGroup = "Opening" | "Content" | "Media" | "From go4" | "Trust";
export declare const CATALOG_GROUPS: readonly CatalogGroup[];
export type CatalogFieldKind = "text" | "richtext" | "image" | "media" | "video" | "link" | "choice" | "toggle" | "number" | "collection" | "product";
export interface CatalogField {
    key: string;
    kind: CatalogFieldKind;
    /** Character limit (text only). Absent = the concept sets none. */
    maxChars?: number;
    /** Closed list for `choice`. */
    options?: readonly string[];
}
/** Image frame, desktop / mobile, as `width:height`. */
export interface CatalogCrop {
    desktop: string;
    mobile: string;
}
export interface CatalogEntry {
    type: LandingSectionType;
    group: CatalogGroup;
    /** Layouts (closed list); the first is the default. */
    variants?: readonly string[];
    fields: readonly CatalogField[];
    /** Number of buttons. */
    buttons?: {
        min: number;
        max: number;
    };
    /** Number and fields of `items[]`. */
    items?: {
        min: number;
        max: number;
        fields: readonly CatalogField[];
    };
    /** Image frames by slot (variant name, `image`, `one` / `many`, `cover`, `avatar`…). */
    crops?: Readonly<Record<string, CatalogCrop>>;
    /** Content drawn from data the host resolves (`section.resolved`). */
    resolved?: "collections" | "products" | "contact";
    /** Retired 0.4.x types read as this component. */
    legacyTypes?: readonly string[];
}
/** Version of the catalog (types, fields, limits). Classes and `data-go4-*` attributes: `CONTRACT_VERSION`. */
export declare const CATALOG_VERSION = 1;
export declare const SECTION_CATALOG: readonly CatalogEntry[];
/** Catalog entry by type (own keys only). */
export declare const catalogEntry: (type: string) => CatalogEntry | undefined;
