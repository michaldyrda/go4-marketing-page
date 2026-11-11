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
    /** Page file (`renderPageFile`): contract attributes on sections, fields, items, media and links. */
    fileMode: boolean;
}
export declare const PageContext: import("react").Context<PageHost>;
export declare const usePage: () => PageHost;
export interface SectionCtx {
    id: string;
    type: LandingSectionType;
    h1: boolean;
    first: boolean;
    joined: boolean;
    /** File mode: `<section>` attributes (`data-go4-section`, options, hidden). */
    fileAttrs?: Record<string, string>;
    /** File mode: section saved as hidden — drawn with `hidden`. */
    hidden?: boolean;
}
export declare const SectionContext: import("react").Context<SectionCtx>;
export declare function cx(...parts: (string | false | null | undefined)[]): string;
/** File mode: `data-go4-field` on the element of a field (nothing outside file mode). */
export declare function useField(): (name: string) => {
    "data-go4-field": string;
} | {
    "data-go4-field"?: undefined;
};
/** File mode: `data-go4-item` on the element of an item. */
export declare function useItem(): {
    "data-go4-item": string;
} | {
    "data-go4-item"?: undefined;
};
/** File mode: decoration the import skips (exit mark, numbering). */
export declare function useIgnore(): {
    "data-go4-ignore": string;
} | {
    "data-go4-ignore"?: undefined;
};
/**
 * The `<section>` of every component: adjacency class, in the editor the
 * `data-section-id` + click hook, in the page file the contract attributes.
 */
export declare function Frame({ className, children }: {
    className: string;
    children: ReactNode;
}): import("react").JSX.Element;
/** Section title at the level that follows from its position (h1 once per page, else h2). */
export declare function Title({ className, children, field }: {
    className: string;
    children: ReactNode;
    field?: string;
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
export declare function Img({ media, slot, alt, className, field, }: {
    media?: LandingMedia;
    slot: Slot;
    alt: string;
    className?: string;
    /** File mode: field name of the image (`media`, `avatar`). */
    field?: string;
}): import("react").JSX.Element | null;
/** File mode: field and library ids of an image or video. */
export declare function mediaFileAttrs(media: LandingMedia | undefined, field: string): Record<string, string>;
/** Alt text: the brand's own, else the given fallback, else decorative. */
export declare const altOf: (m: {
    alt?: string;
} | undefined, fallback?: string) => string;
export declare function ExitMark(): import("react").JSX.Element;
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
export declare function RichTextView({ value, className, field }: {
    value?: RichText;
    className: string;
    field?: string;
}): import("react").JSX.Element | null;
