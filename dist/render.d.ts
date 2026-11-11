import type { MouseEvent, ReactNode } from "react";
import type { MarketingLabels } from "./labels";
import type { ResolvedTarget } from "./model";
import type { LandingButton, LandingLink, LandingMedia, LandingSectionType, MarketingCta, ResolveHref, RichText, TransformImageUrl } from "./types";
export interface PageHost {
    resolveHref?: ResolveHref;
    onCtaClick?: (cta: MarketingCta) => void;
    onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, link: LandingLink) => void;
    forceMobile: boolean;
    transform: {
        fn: TransformImageUrl;
        resizes: boolean;
    };
    labels: MarketingLabels;
    editorMode: boolean;
    onSectionClick?: (id: string) => void;
}
export declare const PageContext: import("react").Context<PageHost>;
export declare const usePage: () => PageHost;
export interface SectionCtx {
    id: string;
    type: LandingSectionType;
    h1: boolean;
    first: boolean;
    joined: boolean;
}
export declare const SectionContext: import("react").Context<SectionCtx>;
export declare function cx(...parts: (string | false | null | undefined)[]): string;
/**
 * The `<section>` of every component: adjacency class, and in the editor the
 * `data-section-id` + click hook.
 */
export declare function Frame({ className, children }: {
    className: string;
    children: ReactNode;
}): import("react").JSX.Element;
/** Section title at the level that follows from its position (h1 once per page, else h2). */
export declare function Title({ className, children }: {
    className: string;
    children: ReactNode;
}): import("react").JSX.Element;
export interface Slot {
    /** Intended CSS width handed to the resizer. */
    width: number;
    /** Widths offered in srcset (only with a resizer). */
    srcset: number[];
    /** `sizes` attribute (only with a resizer). */
    sizes: string;
}
export declare const SLOTS: {
    HERO: {
        width: number;
        srcset: number[];
        sizes: string;
    };
    WIDE: {
        width: number;
        srcset: number[];
        sizes: string;
    };
    SPLIT: {
        width: number;
        srcset: number[];
        sizes: string;
    };
    STORY: {
        width: number;
        srcset: number[];
        sizes: string;
    };
    GRID: {
        width: number;
        srcset: number[];
        sizes: string;
    };
    FEATURE: {
        width: number;
        srcset: number[];
        sizes: string;
    };
    LOGO: {
        width: number;
        srcset: number[];
        sizes: string;
    };
    AVATAR: {
        width: number;
        srcset: number[];
        sizes: string;
    };
};
/** <img> that swaps to a mobile crop: forced in preview, else viewport-driven. */
export declare function Img({ media, slot, alt, className, }: {
    media?: LandingMedia;
    slot: Slot;
    alt: string;
    className?: string;
}): import("react").JSX.Element | null;
/** Alt text: the brand's own, else the given fallback, else decorative. */
export declare const altOf: (m: {
    alt?: string;
} | undefined, fallback?: string) => string;
export declare const ExitMark: () => import("react").JSX.Element;
/** Props of an `<a>` for a resolved target (rel/target for external links). */
export declare function useAnchorProps(): (target: ResolvedTarget) => {
    onClick: ((e: MouseEvent<HTMLAnchorElement>) => void) | undefined;
    rel?: string | undefined;
    target?: "_blank" | undefined;
    href: string;
};
export declare function useTarget(link?: LandingLink | null): ResolvedTarget | null;
/** Variant of a button in a pair (closed list → class). */
export type ButtonVariant = "plain" | "primary" | "outline" | "outline-dark";
/** 0–2 buttons; variants by position. Nothing when no button is drawn. */
export declare function Buttons({ buttons, variants }: {
    buttons?: LandingButton[];
    variants: ButtonVariant[];
}): import("react").JSX.Element | null;
/**
 * Text field. A plain string is one element with `white-space: pre-line`
 * (unchanged from 0.4.x). Paragraphs are `<p>` with `<strong>`, `<em>`, `<u>`,
 * `<a href>` and `<br>` built as elements — content is never parsed as HTML.
 */
export declare function RichTextView({ value, className }: {
    value?: RichText;
    className: string;
}): import("react").JSX.Element | null;
