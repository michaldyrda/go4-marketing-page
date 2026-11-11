import type { MarketingSection, ResolveHref } from "./types";
export type JsonLd = Record<string, unknown>;
export interface StructuredDataOptions {
    /** Same resolver as the page; adds `url` to list items (absolute URLs are best for search engines). */
    resolveHref?: ResolveHref;
}
export declare function buildStructuredData(sections: MarketingSection[], opts?: StructuredDataOptions): JsonLd[];
/**
 * JSON for `<script type="application/ld+json">`: `<`, `>` and `&` escaped so
 * page text can never close the script element.
 */
export declare function jsonLdScriptContent(data: JsonLd | JsonLd[]): string;
