import type { LandingSection } from "../types";
/**
 * Page file only: a section drawn from go4 data (Collections, Products, Contact)
 * carries its title, text and options (`data-go4-*` on the section) — never the
 * data itself, which go4 resolves when the page is shown.
 */
export declare function FileData({ section }: {
    section: LandingSection;
}): import("react").JSX.Element;
/** Section types whose content comes from go4 data. */
export declare const FILE_DATA_TYPES: ReadonlySet<LandingSection["type"]>;
