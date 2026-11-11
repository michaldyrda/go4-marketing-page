import type { ComponentType } from "react";
import type { LandingSection, LandingSectionType } from "../types";
export { Empty } from "./Empty";
export { FileData, FILE_DATA_TYPES } from "./FileData";
/** Type → component (closed list). */
export declare const SECTION_COMPONENTS: Record<LandingSectionType, ComponentType<{
    section: LandingSection;
}>>;
