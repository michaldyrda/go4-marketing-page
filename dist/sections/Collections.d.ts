import type { LandingSection } from "../types";
/**
 * Collections — covers from data the host resolved (`section.resolved.collections`).
 * Draws only what the host served: no shipping for guests, never prices.
 */
export declare function Collections({ section }: {
    section: LandingSection;
}): import("react").JSX.Element;
