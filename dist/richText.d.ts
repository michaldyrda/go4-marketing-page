import type { RichParagraph, RichText } from "./types";
/** Plain string stays a string; a paragraph list keeps known keys only. Empty → undefined. */
export declare function normalizeRichText(raw: unknown): RichText | undefined;
/** True when the value carries visible text. */
export declare function hasRichText(v: RichText | undefined | null): boolean;
/** Text only (for limits, alt fallbacks, structured data): paragraphs joined by an empty line. */
export declare function richTextPlain(v: RichText | undefined | null): string;
/** Paragraphs of either form — a plain string splits on empty lines. */
export declare function richParagraphs(v: RichText | undefined | null): RichParagraph[];
/**
 * Strict tokenizer with an allow-list: `p, br, b, strong, i, em, u, a`.
 * Any other tag is removed (its text stays; block tags start a new paragraph);
 * `script`, `style` and similar are removed with their content; attributes other
 * than the link ones are ignored. Whitespace collapses as in HTML.
 */
export declare function richTextFromHtml(html: string): RichParagraph[];
/**
 * Stored value → HTML of the allow-list (`p, br, strong, em, u, a`), for the
 * editor and the page file. Internal targets are written as
 * `<a data-go4-link-kind data-go4-link-id>`, external ones as `<a href>`.
 * `richTextFromHtml(richTextToHtml(v))` returns `v` (normalized).
 */
export declare function richTextToHtml(value: RichText | undefined | null): string;
