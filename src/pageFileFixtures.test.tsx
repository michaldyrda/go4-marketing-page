// @vitest-environment node
/**
 * Writes the round-trip fixtures of the admin app's file reader (`parsePageFile`,
 * E10.2): for the component gallery and both test pages — the stored sections
 * (with library ids on every image) and the page file drawn from them. Runs only
 * with G4MP_FIXTURES_OUT=<dir>; the admin app commits the result.
 */
import { describe, it } from "vitest";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderPageFile } from "./pageFile";
import { BRAND_PAGES, GALLERY_PAGE, toHostSections } from "../test/fixtures/landingPages";

const OUT = process.env.G4MP_FIXTURES_OUT;

/** Every media object gets a stable library id (the mockup placeholders have none). */
function withMediaIds(v: unknown, next: () => string): unknown {
  if (Array.isArray(v)) return v.map((x) => withMediaIds(x, next));
  if (v && typeof v === "object") {
    const o = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withMediaIds(x, next)])) as Record<string, unknown>;
    if (typeof o.file_url === "string" && !o.media_id) o.media_id = next();
    return o;
  }
  return v;
}

describe.skipIf(!OUT)("round-trip fixtures for parsePageFile", () => {
  it("writes them", () => {
    let n = 0;
    const next = () => `00000000-0000-4000-8000-${(++n).toString(16).padStart(12, "0")}`;
    for (const { name, page } of [{ name: "component-gallery", page: GALLERY_PAGE }, ...BRAND_PAGES]) {
      const sections = toHostSections(page).map((s) => ({ ...s, config: withMediaIds(s.config, next) }));
      writeFileSync(join(OUT!, `${name}.sections.json`), JSON.stringify(sections, null, 1) + "\n");
      writeFileSync(join(OUT!, `${name}.html`), renderPageFile(sections));
    }
  });
});
