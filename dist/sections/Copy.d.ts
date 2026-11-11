import type { RichText } from "../types";
/** True when the title / subtitle / text block draws anything. */
export declare const hasCopy: (c: {
    title?: string;
    subtitle?: string;
    body?: RichText;
}) => boolean;
/** Title + subtitle + text — the shared heading block of most sections. */
export declare function Copy({ title, subtitle, body, titleClass, subtitleClass, bodyClass, }: {
    title?: string;
    subtitle?: string;
    body?: RichText;
    titleClass?: string;
    subtitleClass?: string;
    bodyClass?: string;
}): import("react").JSX.Element;
