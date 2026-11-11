/**
 * `@go4/marketing-page/file` — the page file (Download / Copy HTML in the
 * editor). A separate entry: it pulls `react-dom/server`, which the page entry
 * (portal, public page) does not need.
 */
export { renderPageFile } from "./pageFile";
export type { PageFileOptions } from "./pageFile";
export { CONTRACT_VERSION, CONTRACT_ATTRIBUTES, CONTRACT_CLASSES, FILE_ATTR, pageFileInstructions } from "./contract";
