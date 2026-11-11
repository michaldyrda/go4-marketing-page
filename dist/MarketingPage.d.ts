import type { MouseEvent, ReactNode } from "react";
import type { MarketingLabelsInput } from "./labels";
import type { LandingLink, MarketingCta, MarketingSection, ResolveHref, TransformImageUrl } from "./types";
export interface MarketingPageProps {
    /** Stored sections, legacy or new shape — normalized, filtered to visible and sorted here. */
    sections: MarketingSection[];
    /**
     * Turns a link target into an href for this host (e.g. the portal prefixes
     * the boutique path). When given, buttons and tiles are `<a href>`; a target
     * that is unavailable or resolves to null is drawn without a link.
     */
    resolveHref?: ResolveHref;
    /** Optional click hook on rendered links (client-side routing in an SPA host). */
    onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, link: LandingLink) => void;
    /** Legacy: without `resolveHref`, CTAs are `<button>`s and the host navigates here. */
    onCtaClick?: (cta: MarketingCta) => void;
    /** Render mobile crops + mobile layout regardless of viewport (editor preview). */
    forceMobile?: boolean;
    /** Optional CDN/Storage resizer. Defaults to identity. */
    transformImageUrl?: TransformImageUrl;
    /**
     * Inject the stylesheet as an inline `<style>` (default). Hosts with a strict
     * Content-Security-Policy set `false` and load `@go4/marketing-page/styles.css`
     * as a file instead (or allow `MARKETING_CSS_SHA256`).
     */
    injectStyles?: boolean;
    /** Texts the package shows (shipping line, styles count, contact labels, empty states). */
    labels?: MarketingLabelsInput;
    /**
     * Editor preview: every section carries `data-section-id`, an empty section
     * shows its name and the missing field instead of disappearing.
     */
    editorMode?: boolean;
    /** Editor: click on a section. */
    onSectionClick?: (id: string) => void;
    /**
     * Editor: slot between sections ("+"). Called with 0…n — the position among the
     * visible sections in display order (0 = before the first, n = after the last).
     */
    renderInsertSlot?: (index: number) => ReactNode;
    className?: string;
    /**
     * Page file — use `renderPageFile`. Every section (hidden ones with `hidden`)
     * carries the contract attributes; sections from go4 data carry only their
     * title, text and options.
     */
    fileMode?: boolean;
}
/**
 * Full landing page — all visible sections in order. Zero dependency on any
 * host design system, so the admin preview, the B2B portal and the public brand
 * page render the same content. No `window` access: safe for server rendering.
 */
export declare function MarketingPage({ sections, resolveHref, onLinkClick, onCtaClick, forceMobile, transformImageUrl, injectStyles, labels, editorMode, onSectionClick, renderInsertSlot, className, fileMode, }: MarketingPageProps): import("react").JSX.Element;
