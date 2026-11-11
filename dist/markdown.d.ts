import type { MarketingLabelsInput } from "./labels";
import type { MarketingSection, ResolveHref } from "./types";
export interface MarkdownOptions {
    /** Same resolver as the page. Without it links are written as plain text. */
    resolveHref?: ResolveHref;
    labels?: MarketingLabelsInput;
}
export declare function sectionsToMarkdown(sections: MarketingSection[], opts?: MarkdownOptions): string;
