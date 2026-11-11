import type { CatalogEntry, CatalogField } from "./catalog";
import type { LandingLink, LandingSection } from "./types";
/** Version of the page file contract — classes, `data-go4-*` attributes, file format. */
export declare const CONTRACT_VERSION = 1;
/** Attributes of the page, sections, fields, items, media and links. */
export declare const FILE_ATTR: {
    readonly page: "data-go4-page";
    readonly format: "data-go4-format";
    readonly section: "data-go4-section";
    readonly hidden: "data-go4-hidden";
    readonly field: "data-go4-field";
    readonly item: "data-go4-item";
    readonly mediaId: "data-go4-media-id";
    readonly mobileMediaId: "data-go4-mobile-media-id";
    readonly sourceMediaId: "data-go4-source-media-id";
    readonly linkKind: "data-go4-link-kind";
    readonly linkId: "data-go4-link-id";
    /** Decoration the import skips (exit mark, numbering). */
    readonly ignore: "data-go4-ignore";
};
/**
 * Every `g4mp-*` class the package draws or styles (sorted) — the selectors a
 * brand's own CSS may target (E11). Frozen by the contract test.
 */
export declare const CONTRACT_CLASSES: readonly string[];
/** Field name of a button element (`buttons[]`). */
export declare const BUTTON_FIELD = "button";
/** Section option attribute: `image_side` → `data-go4-image-side`, `show.email` → `data-go4-show-email`. */
export declare const optionAttr: (key: string) => string;
export declare const optionFields: (entry: CatalogEntry) => CatalogField[];
/** Attribute with the ordered id list of a From-go4 section (`data-go4-collections`, `data-go4-products`). */
export declare const itemListAttr: (entry: CatalogEntry) => string | undefined;
/** Every `data-go4-*` attribute of the contract (sorted) — frozen by the contract test. */
export declare const CONTRACT_ATTRIBUTES: readonly string[];
/** Attributes of a `<section>` in file mode, from a normalized section. Values come from closed lists. */
export declare function sectionFileAttrs(section: LandingSection, hidden: boolean): Record<string, string>;
/** Attributes of an `<a>` in file mode: the registry target (external: the kind only, the address is `href`). */
export declare function linkFileAttrs(link: LandingLink | null | undefined): Record<string, string>;
/**
 * Fixed instruction at the top of the page file — generated from the catalog,
 * never from page content or brand data, so content cannot pose as instructions.
 */
export declare function pageFileInstructions(): string;
