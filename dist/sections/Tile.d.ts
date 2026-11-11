import type { ResolvedTarget } from "../model";
import type { LandingMedia } from "../types";
/**
 * 2:3 image tile with a title band (Cards, Collections). The whole tile is the
 * link; without a target it is a plain tile. `onLegacyClick` = legacy host.
 */
export declare function Tile({ media, alt, title, lines, target, onLegacyClick, lineFields, }: {
    media?: LandingMedia;
    alt: string;
    title?: string;
    lines: string[];
    target: ResolvedTarget | null;
    onLegacyClick?: () => void;
    /** File mode: field name of each line (Cards: `body`). */
    lineFields?: string[];
}): import("react").JSX.Element;
/** Closed list — content never reaches a class name directly. */
export declare const CARD_GRID_CLASS: Record<number, string>;
export declare const gridCount: (n: number) => number;
