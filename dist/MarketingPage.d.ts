import type { MarketingCta, MarketingSection, TransformImageUrl } from "./types";
export interface MarketingPageProps {
    sections: MarketingSection[];
    /** CTA click (e.g. "Start order" → go to catalogue). External links are host-handled. */
    onCtaClick?: (cta: MarketingCta) => void;
    /** Render mobile crops + mobile layout regardless of viewport (editor preview). */
    forceMobile?: boolean;
    /** Optional CDN/Storage resizer. Defaults to identity. */
    transformImageUrl?: TransformImageUrl;
    className?: string;
}
/**
 * Full collection marketing page — all visible sections in order, with its own
 * self-contained styles injected inline. Zero dependency on any host design
 * system, so the admin preview and the B2B portal render it identically.
 */
export declare function MarketingPage({ sections, onCtaClick, forceMobile, transformImageUrl, className, }: MarketingPageProps): import("react").JSX.Element;
