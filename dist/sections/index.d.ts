import type { ComponentType } from "react";
import type { LandingSection, LandingSectionType } from "../types";
export { Empty } from "./Empty";
/** Type → component (closed list). */
export declare const SECTION_COMPONENTS: Record<LandingSectionType, ComponentType<{
    section: LandingSection;
}>>;
