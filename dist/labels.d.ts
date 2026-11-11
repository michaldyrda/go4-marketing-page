import type { LandingSectionType } from "./types";
/**
 * Every text the package itself shows (wording from the accepted mockup,
 * 2026-11-11). A host passes `labels` to translate or adjust them; anything it
 * leaves out falls back to these.
 */
export declare const DEFAULT_LABELS: {
    /** Component names — the empty state in `editorMode`. */
    sections: Record<LandingSectionType, string>;
    /** Field names — the missing field in the empty state. */
    fields: {
        title: string;
        media: string;
        button: string;
    };
    /** Collection tile: `{date}` is the shipping text served by the host. */
    shipping: string;
    /** Collection tile: number of styles. */
    styles: {
        one: string;
        other: string;
    };
    /** Contact section row labels. */
    contact: {
        address: string;
        email: string;
        website: string;
        instagram: string;
    };
};
export type MarketingLabels = typeof DEFAULT_LABELS;
/** Partial labels from the host, any depth. */
export type MarketingLabelsInput = {
    [K in keyof MarketingLabels]?: MarketingLabels[K] extends string ? string : Partial<MarketingLabels[K]>;
};
/** Host labels over the defaults; non-string values are ignored. */
export declare function mergeLabels(input?: MarketingLabelsInput | null): MarketingLabels;
/** `{name}` placeholders → values (plain text; React escapes the result). */
export declare const fill: (template: string, values: Record<string, string | number>) => string;
