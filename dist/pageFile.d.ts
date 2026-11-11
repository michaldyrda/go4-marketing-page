import type { MarketingLabelsInput } from "./labels";
import type { ResolveHref, TransformImageUrl } from "./types";
export interface PageFileOptions {
    /**
     * Href of a link target, so the file can be clicked. Optional: without it (or
     * when it gives nothing) an external target links to its address and any
     * other target to "/". Import never reads the href of a registry target.
     */
    resolveHref?: ResolveHref;
    /** Optional image resizer (same as the page). */
    transformImageUrl?: TransformImageUrl;
    labels?: MarketingLabelsInput;
    /** Language of the document (BCP 47, e.g. "en"). */
    lang?: string;
}
/** Stored sections (draft or published, legacy or new shape) → the page file (HTML document). */
export declare function renderPageFile(sections: readonly unknown[], opts?: PageFileOptions): string;
