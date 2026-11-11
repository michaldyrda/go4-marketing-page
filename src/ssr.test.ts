// @vitest-environment node
import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingPage, MARKETING_CSS } from "./index";
import { BRAND_PAGES, GALLERY_PAGE, resolveHref, toHostSections } from "../test/fixtures/landingPages";

/** Server render (Next.js / Deno-like host): no `window`, no `document`. */
describe("server render without window", () => {
  it("runs in a plain Node environment", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });

  for (const { name, page } of [{ name: "component-gallery", page: GALLERY_PAGE }, ...BRAND_PAGES]) {
    it(`${name}: renderToStaticMarkup, one <h1>, no <button>, stylesheet byte-exact`, () => {
      const html = renderToStaticMarkup(createElement(MarketingPage, { sections: toHostSections(page), resolveHref }));
      expect(html.match(/<h1[ >]/g)).toHaveLength(1);
      expect(html).not.toContain("<button");
      expect(html).toContain(`<style>${MARKETING_CSS}</style>`);
    });
  }
});
