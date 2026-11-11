/**
 * Page file (E10.1, concept §12.1, §12.6–§12.7): the contract attributes are
 * drawn only in file mode, the file is the package's own drawing with a fixed
 * instruction, and the lists of classes and `data-go4-*` attributes are frozen.
 * Changing a frozen list = a deliberate change of the contract (CONTRACT_VERSION).
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, readdirSync } from "node:fs";
import { CONTRACT_ATTRIBUTES, CONTRACT_CLASSES, CONTRACT_VERSION, pageFileInstructions } from "./contract";
import { MarketingPage } from "./MarketingPage";
import { renderPageFile } from "./pageFile";
import { MARKETING_CSS } from "./styles";
import type { MarketingSection } from "./types";
import { BRAND_PAGES, GALLERY_PAGE, resolveHref, toHostSections } from "../test/fixtures/landingPages";

const PAGES = [{ name: "component-gallery", page: GALLERY_PAGE }, ...BRAND_PAGES];

/** Frozen contract of format 1. */
const FROZEN_ATTRIBUTES = [
  "data-go4-collection-id",
  "data-go4-collections",
  "data-go4-field",
  "data-go4-format",
  "data-go4-hidden",
  "data-go4-ignore",
  "data-go4-image-side",
  "data-go4-item",
  "data-go4-limit",
  "data-go4-link-id",
  "data-go4-link-kind",
  "data-go4-media-id",
  "data-go4-mobile-media-id",
  "data-go4-mode",
  "data-go4-page",
  "data-go4-products",
  "data-go4-section",
  "data-go4-show-address",
  "data-go4-show-email",
  "data-go4-show-instagram",
  "data-go4-show-shipping",
  "data-go4-show-website",
  "data-go4-source-media-id",
  "data-go4-variant",
];

const dom = (html: string) => new DOMParser().parseFromString(html, "text/html");

function attrsAndClasses(doc: Document) {
  const attrs = new Set<string>();
  const classes = new Set<string>();
  for (const el of Array.from(doc.querySelectorAll("*"))) {
    for (const a of Array.from(el.attributes)) if (a.name.startsWith("data-go4")) attrs.add(a.name);
    for (const c of Array.from(el.classList)) classes.add(c);
  }
  return { attrs, classes };
}

describe("contract lists (frozen)", () => {
  it("CONTRACT_VERSION is 1", () => {
    expect(CONTRACT_VERSION).toBe(1);
  });

  it("data-go4-* attributes", () => {
    expect([...CONTRACT_ATTRIBUTES]).toEqual(FROZEN_ATTRIBUTES);
  });

  it("g4mp-* classes = the stylesheet's classes + the classes the components draw", () => {
    const css = MARKETING_CSS.match(/\.g4mp[a-z0-9_-]*/g)!.map((c) => c.slice(1));
    const files = [
      ...readdirSync("src").filter((f) => f.endsWith(".tsx") && !f.includes(".test.")).map((f) => `src/${f}`),
      ...readdirSync("src/sections").map((f) => `src/sections/${f}`),
    ];
    const drawn: string[] = [];
    for (const f of files) {
      for (const m of readFileSync(f, "utf8").matchAll(/"([^"\n]*)"/g)) {
        for (const t of m[1].split(/\s+/)) if (/^g4mp[a-z0-9_-]*$/.test(t)) drawn.push(t);
      }
    }
    expect([...CONTRACT_CLASSES]).toEqual([...new Set([...css, ...drawn])].sort());
  });

  it("every file of the test pages draws only contract attributes and classes", () => {
    for (const { name, page } of PAGES) {
      const { attrs, classes } = attrsAndClasses(dom(renderPageFile(toHostSections(page), { resolveHref })));
      expect([...attrs].filter((a) => !CONTRACT_ATTRIBUTES.includes(a)), name).toEqual([]);
      expect([...classes].filter((c) => !CONTRACT_CLASSES.includes(c)), name).toEqual([]);
    }
  });
});

describe("renderPageFile", () => {
  const gallery = toHostSections(GALLERY_PAGE);

  it("is a document: fixed instruction first, the package stylesheet, one page root with the format", () => {
    const file = renderPageFile(gallery);
    expect(file.startsWith(`<!--\n${pageFileInstructions()}\n-->\n<!doctype html>`)).toBe(true);
    expect(file).toContain(`<style>${MARKETING_CSS}</style>`);
    const doc = dom(file);
    const roots = doc.querySelectorAll("[data-go4-page]");
    expect(roots).toHaveLength(1);
    expect(roots[0].tagName).toBe("MAIN");
    expect(roots[0].getAttribute("data-go4-format")).toBe(String(CONTRACT_VERSION));
    expect(doc.querySelectorAll("[data-go4-section]").length).toBe(GALLERY_PAGE.sections.length);
    expect(doc.querySelectorAll("script")).toHaveLength(0);
  });

  it("the instruction is fixed: same for every page, no page content, no comment breaker", () => {
    const a = renderPageFile(gallery);
    const comment = (s: string) => s.slice(0, s.indexOf("-->") + 3);
    for (const { page } of BRAND_PAGES) expect(comment(renderPageFile(toHostSections(page)))).toBe(comment(a));
    const text = pageFileInstructions();
    expect(text).not.toMatch(/--|<|>/);
    for (const s of gallery) {
      const title = (s.config as { title?: string }).title;
      if (title) expect(text).not.toContain(title);
    }
    // Lists every component of the catalog.
    for (const t of ["hero", "text_block", "story", "gallery", "video", "cards", "collections", "products", "facts", "features", "quotes", "logos", "faq", "cta", "contact"]) {
      expect(text).toContain(`- ${t} (`);
    }
  });

  it("MARKETING_CSS cannot close the <style> of the file", () => {
    expect(MARKETING_CSS).not.toMatch(/<\/style/i);
  });

  it("portal and public page get no contract attributes (only file mode draws them)", () => {
    for (const { page } of PAGES) {
      for (const editorMode of [false, true]) {
        const html = renderToStaticMarkup(createElement(MarketingPage, { sections: toHostSections(page), resolveHref, editorMode }));
        expect(html).not.toContain("data-go4");
        expect(html).not.toContain("<main");
      }
    }
  });

  it("sections from go4 data carry only title, text and options — no data content", () => {
    const studio = BRAND_PAGES.find((p) => p.name === "studio-b3");
    if (!studio) return; // brand pages are not committed in this repo
    const doc = dom(renderPageFile(toHostSections(studio.page)));
    const col = doc.querySelector('[data-go4-section="collections"]')!;
    expect(col.getAttribute("data-go4-collections")).toBe(
      studio.page.sections.find((s: { type: string }) => s.type === "collections").config.items.map((i: { collection_id: string }) => i.collection_id).join(","),
    );
    expect(col.querySelectorAll("img, a")).toHaveLength(0);
    expect(doc.body.textContent).not.toContain("BARELL pants"); // a resolved product name
    expect(doc.body.textContent).not.toContain("46 styles"); // resolved collection data
    const prod = doc.querySelector('[data-go4-section="products"]')!;
    expect(prod.getAttribute("data-go4-products")?.split(",")).toHaveLength(
      studio.page.sections.find((s: { type: string }) => s.type === "products").config.items.length,
    );
    expect(prod.querySelectorAll("img, a")).toHaveLength(0);
  });

  it("keeps what the page would not draw: hidden and empty sections, a button without a target, an unavailable target", () => {
    const sections: MarketingSection[] = [
      { id: "a", type: "text_block", is_visible: false, order_index: 0, config: { title: "Hidden" } },
      { id: "b", type: "text_block", is_visible: true, order_index: 1, config: {} },
      {
        id: "c",
        type: "cta",
        is_visible: true,
        order_index: 2,
        config: {
          title: "Order",
          buttons: [
            { label: "No target yet", link: null },
            { label: "Sold out", link: { kind: "collection", id: "11111111-1111-4111-8111-111111111111", available: false, path: "x" } },
          ],
        },
      },
      { id: "d", type: "video", is_visible: true, order_index: 3, config: { title: "Film without a file" } },
    ];
    const doc = dom(renderPageFile(sections));
    const all = doc.querySelectorAll("[data-go4-section]");
    expect(all).toHaveLength(4);
    expect(all[0].hasAttribute("hidden")).toBe(true);
    expect(all[0].hasAttribute("data-go4-hidden")).toBe(true);
    const buttons = all[2].querySelectorAll('[data-go4-field="button"]');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].hasAttribute("href")).toBe(false);
    expect(buttons[1].getAttribute("data-go4-link-kind")).toBe("collection");
    expect(buttons[1].getAttribute("data-go4-link-id")).toBe("11111111-1111-4111-8111-111111111111");
    expect(all[3].querySelector('[data-go4-field="title"]')?.textContent).toBe("Film without a file");
  });

  it("image alt in the file is the brand's own alt (no fallback from the title)", () => {
    const doc = dom(
      renderPageFile([
        { id: "s", type: "story", is_visible: true, order_index: 0, config: { title: "Title", media: { media_id: "22222222-2222-4222-8222-222222222222", file_url: "https://cdn.example/a.jpg" } } },
      ]),
    );
    const img = doc.querySelector('img[data-go4-field="media"]')!;
    expect(img.getAttribute("alt")).toBe("");
    expect(img.getAttribute("data-go4-media-id")).toBe("22222222-2222-4222-8222-222222222222");
  });

  it("formatted text and its links carry the registry target; external links keep only their address", () => {
    const doc = dom(
      renderPageFile([
        {
          id: "t",
          type: "text_block",
          is_visible: true,
          order_index: 0,
          config: {
            body: [[{ text: "See " }, { text: "all", bold: true, link: { kind: "catalog" } }, { text: " or " }, { text: "us", link: { kind: "external", url: "https://example.com/" } }]],
          },
        },
      ]),
    );
    const links = doc.querySelectorAll('[data-go4-field="body"] a');
    expect(links[0].getAttribute("data-go4-link-kind")).toBe("catalog");
    expect(links[1].getAttribute("data-go4-link-kind")).toBe("external");
    expect(links[1].getAttribute("href")).toBe("https://example.com/");
    expect(links[1].querySelector("[data-go4-ignore]")?.textContent).toBe("↗");
  });
});
