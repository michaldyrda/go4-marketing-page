/**
 * Drawing rules shared by the React components, `sectionsToMarkdown` and
 * `buildStructuredData` — one place decides what of a normalized section is
 * drawn, so HTML, text and structured data never disagree.
 */
import { legacyCtaOf } from "./normalize";
import type { LandingButton, LandingItem, LandingLink, LandingMedia, LandingSection, ResolveHref, ResolvedCollection, ResolvedProduct } from "./types";
export declare const has: (s?: string | null) => s is string;
export interface ResolvedTarget {
    href: string;
    external: boolean;
    link: LandingLink;
}
/** Link target → href via the host; null when unavailable, unresolved or unsafe. */
export declare function resolveTarget(link: LandingLink | null | undefined, resolveHref?: ResolveHref): ResolvedTarget | null;
/**
 * Buttons that are drawn. With `resolveHref`: label + resolvable target only.
 * Legacy host (no `resolveHref`): every labelled button, as 0.4.x did.
 */
export declare function drawnButtons(buttons: LandingButton[] | undefined, resolveHref?: ResolveHref): {
    button: LandingButton;
    target: ResolvedTarget | null;
}[];
export declare const mediaSrc: (m?: LandingMedia) => boolean;
/** Upper bounds when drawing (catalog max). Cards and Gallery keep every legacy item. */
export declare const RENDER_MAX: Partial<Record<LandingSection["type"], number>>;
/** Items of a section that are drawn. */
export declare function drawnItems(section: LandingSection): LandingItem[];
export declare const drawnCollections: (s: LandingSection) => ResolvedCollection[];
export declare const drawnProducts: (s: LandingSection) => ResolvedProduct[];
export declare const CONTACT_KEYS: readonly ["address", "email", "website", "instagram"];
export type ContactKey = (typeof CONTACT_KEYS)[number];
/** Contact rows: brand data the host served, minus the ones switched off. */
export declare function contactRows(s: LandingSection): {
    key: ContactKey;
    value: string;
    href?: string;
    external: boolean;
}[];
/** Does the section draw anything? An empty section is not drawn (editor: empty state). */
export declare function hasContent(s: LandingSection, resolveHref?: ResolveHref): boolean;
/** Title drawn as the section heading (Key facts has none). */
export declare const sectionTitle: (s: LandingSection) => string | undefined;
/** Name of the missing field shown in the editor's empty state. */
export declare const MISSING_FIELD: Record<LandingSection["type"], "title" | "media" | "button" | null>;
type Surface = "image" | "bg" | "surface" | "surface-2" | "ink";
export declare const surfaceOf: (s: LandingSection) => Surface;
export declare function hasHead(s: LandingSection): boolean;
export interface PlannedSection {
    section: LandingSection;
    /** Draws content (false = only the editor's empty state). */
    drawn: boolean;
    /** Its title is the page's single <h1>. */
    h1: boolean;
    /** First drawn section — images load eagerly. */
    first: boolean;
    /** Joins the previous drawn section (no top padding). */
    joined: boolean;
}
/** Normalizes stored sections and decides, once, what each of them draws. */
export declare function planPage(raw: readonly unknown[], resolveHref?: ResolveHref): PlannedSection[];
/** Legacy CTA behind a button / card (hosts with only `onCtaClick`). */
export { legacyCtaOf };
