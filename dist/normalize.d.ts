import type { LandingMedia, LandingSection, LandingSectionType, MarketingCta } from "./types";
export declare const legacyCtaOf: (o: object) => MarketingCta | undefined;
export declare const SECTION_TYPES: readonly LandingSectionType[];
export declare function normalizeMedia(raw: unknown): LandingMedia | undefined;
/**
 * Stored section (legacy or new shape) → normalized section, or null for an
 * unknown type. Pure; keeps only known keys; never throws on bad content.
 */
export declare function normalizeSection(raw: unknown): LandingSection | null;
