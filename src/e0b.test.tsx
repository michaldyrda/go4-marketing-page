import { describe, it, expect, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { render, fireEvent } from "@testing-library/react";
import { MarketingPage } from "./MarketingPage";
import type { MarketingPageProps } from "./MarketingPage";
import { DEFAULT_LABELS } from "./labels";
import { SECTION_CATALOG, TEXT_LIMITS } from "./catalog";
import { SECTION_TYPES } from "./normalize";
import { MARKETING_CSS } from "./styles";
import type { MarketingSection } from "./types";
import { BRAND_PAGES, GALLERY_PAGE, resolveHref, toHostSections } from "../test/fixtures/landingPages";

const html = (sections: MarketingSection[], props: Partial<MarketingPageProps> = {}) =>
  renderToStaticMarkup(createElement(MarketingPage, { sections, resolveHref, injectStyles: false, ...props }));

const dom = (markup: string) => {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
};

/**
 * What the server does when every target is closed: each link object gets
 * `available: false`, and Collections / Products items get an explicit link.
 */
function unavailable(v: any): any {
  if (Array.isArray(v)) return v.map(unavailable);
  if (v && typeof v === "object") {
    const out = Object.fromEntries(Object.entries(v).map(([key, x]) => [key, unavailable(x)]));
    if (isLink(out)) out.available = false;
    if (out.collections) out.collections = out.collections.map((c: any) => ({ ...c, link: { kind: "collection", id: c.id, available: false } }));
    if (out.products) out.products = out.products.map((p: any) => ({ ...p, link: { kind: "product", id: p.id, available: false } }));
    return out;
  }
  return v;
}
const isLink = (o: any) =>
  typeof o.kind === "string" && ["catalog", "collection", "product", "external", "portal_view", "login", "register"].includes(o.kind);

const PAGES = [{ name: "component-gallery", page: GALLERY_PAGE }, ...BRAND_PAGES];

const s = (id: string, type: string, config: Record<string, unknown>, extra: Partial<MarketingSection> = {}): MarketingSection => ({
  id, type, is_visible: true, order_index: Number(id.replace(/\D/g, "")) || 0, config, ...extra,
});

describe("0.5.0 E0b — test pages in the new shape", () => {
  it.skipIf(BRAND_PAGES.length === 0)("brand pages (studio b3, Måke) are available locally", () => {
    expect(BRAND_PAGES.map((p) => p.name)).toEqual(["studio-b3", "make-fashion"]);
  });

  for (const { name, page } of PAGES) {
    it(`${name}: draws, exactly one <h1>, zero <button> with resolveHref`, () => {
      const root = dom(html(toHostSections(page)));
      expect(root.querySelectorAll("h1"), name).toHaveLength(1);
      expect(root.querySelectorAll("button"), name).toHaveLength(0);
      expect(root.querySelectorAll("section").length, name).toBe(page.sections.length);
      expect(root.querySelector("h1")?.textContent).toBe(page.sections[0].config.title);
    });

    it(`${name}: targets marked available:false are drawn without <a>`, () => {
      const root = dom(html(unavailable(toHostSections(page))));
      const links = Array.from(root.querySelectorAll("a")).filter((a) => !a.closest(".g4mp-contact"));
      expect(links, name).toHaveLength(0);
      expect(root.querySelectorAll("button"), name).toHaveLength(0);
    });
  }

  it("component gallery draws all 15 types (hero in both layouts)", () => {
    const root = dom(html(toHostSections(GALLERY_PAGE)));
    for (const cls of [
      "g4mp-hero", "g4mp-hero-split", "g4mp-text", "g4mp-story", "g4mp-grid", "g4mp-video", "g4mp-cards",
      "g4mp-collections", "g4mp-products", "g4mp-facts", "g4mp-features", "g4mp-quotes", "g4mp-logos",
      "g4mp-faq", "g4mp-cta", "g4mp-contact",
    ]) {
      expect(root.querySelector(`section.${cls}`), cls).not.toBeNull();
    }
    expect(root.querySelectorAll("details.g4mp-faq__item")).toHaveLength(3);
    expect(root.querySelector(".g4mp-grid__items--1")).not.toBeNull();
    expect(root.querySelector(".g4mp-quote--solo")).not.toBeNull();
    expect(root.querySelector(".g4mp-features__list--3")).not.toBeNull();
    // Collections with shipping: taller band and the line from the mockup.
    expect(root.querySelector(".g4mp-cards__grid--tall")).not.toBeNull();
    expect(root.textContent).toContain("Shipping: from Month Year");
    expect(root.textContent).toContain("Season · 12 styles");
  });

  it("headings: section titles <h2>, item titles <h3>", () => {
    const root = dom(html(toHostSections(GALLERY_PAGE)));
    expect(root.querySelectorAll(".g4mp-card__title").length).toBeGreaterThan(0);
    root.querySelectorAll(".g4mp-card__title, .g4mp-product__name, .g4mp-feature__title, .g4mp-faq__qt").forEach((n) =>
      expect(n.tagName).toBe("H3"),
    );
    expect(root.querySelector(".g4mp-hero-split__title")?.tagName).toBe("H2");
  });

  it.skipIf(BRAND_PAGES.length === 0)("studio b3: collections join the text above; Måke: facts join the split hero", () => {
    const b3 = dom(html(toHostSections(BRAND_PAGES[0].page)));
    expect(b3.querySelector("section.g4mp-collections")?.classList.contains("g4mp-section--joined")).toBe(true);
    expect(b3.querySelectorAll(".g4mp-section--joined")).toHaveLength(1);
    const make = dom(html(toHostSections(BRAND_PAGES[1].page)));
    expect(make.querySelector("section.g4mp-facts")?.classList.contains("g4mp-section--joined")).toBe(true);
  });

  it.skipIf(BRAND_PAGES.length === 0)("studio b3: hero image, eager; later images lazy; links to collections", () => {
    const root = dom(html(toHostSections(BRAND_PAGES[0].page)));
    const imgs = Array.from(root.querySelectorAll("img"));
    expect(imgs[0].className).toContain("g4mp-hero__img");
    expect(imgs[0].getAttribute("loading")).toBeNull();
    expect(imgs.slice(1).every((i) => i.getAttribute("loading") === "lazy")).toBe(true);
    expect(imgs.every((i) => (i.getAttribute("alt") ?? "").length > 0)).toBe(true);
    const hrefs = Array.from(root.querySelectorAll(".g4mp-collections a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      "/b/order?collection=39e52fa0-0ae3-4a86-b8f0-788dac040f2f",
      "/b/order?collection=7405eb01-367c-4905-bd7f-b732e8a2bcc7",
      "/b/order?collection=f591b171-52dd-49da-9dfb-1e655e9aeadf",
    ]);
  });
});

describe("0.5.0 E0b — Collections / Products draw only what the host resolved", () => {
  const C1 = "11111111-1111-4111-8111-111111111111";
  const P1 = "22222222-2222-4222-8222-222222222222";
  const collections = (resolved: unknown, config: Record<string, unknown> = {}) =>
    s("c1", "collections", { title: "Open", mode: "all", show_shipping: true, ...config }, { resolved: resolved as never });

  it("guest context: no shipping field → no shipping line", () => {
    const root = dom(html([collections({ collections: [{ id: C1, name: "Harbour", season: "SS27", styles: 1 }] })]));
    expect(root.textContent).toContain("SS27 · 1 style");
    expect(root.textContent).not.toContain("Shipping");
    expect(root.querySelector(".g4mp-cards__grid--tall")).toBeNull();
  });

  it("show_shipping off hides a served shipping date", () => {
    const root = dom(html([collections({ collections: [{ id: C1, name: "H", shipping: "Jan 2027" }] }, { show_shipping: false })]));
    expect(root.textContent).not.toContain("Jan 2027");
  });

  it("no prices, even when the host passes one; unknown keys dropped", () => {
    const root = dom(
      html([
        collections({ collections: [{ id: C1, name: "H", price: "€ 99", wholesale_price: 50 }] }),
        s("p2", "products", { title: "P" }, { resolved: { products: [{ id: P1, name: "Shirt", price: "€ 120", category: "Shirts" }, { id: P1, name: "Pants" }] } as never }),
      ]),
    );
    expect(root.textContent).not.toMatch(/€|99|120|50/);
    expect(root.querySelectorAll(".g4mp-product")).toHaveLength(2);
  });

  it("nothing resolved → the section is not drawn (nothing fetched by the package)", () => {
    const root = dom(html([collections(undefined), s("p2", "products", { title: "P", items: [{ product_id: P1 }] })]));
    expect(root.querySelectorAll("section")).toHaveLength(0);
  });

  it("server-resolved link with available:false → tile without a link", () => {
    const root = dom(html([collections({ collections: [{ id: C1, name: "H", link: { kind: "collection", id: C1, available: false } }] })]));
    expect(root.querySelector("a")).toBeNull();
    expect(root.querySelector("div.g4mp-card")).not.toBeNull();
  });
});

describe("0.5.0 E0b — drawing rules and editor mode", () => {
  const sections = [
    s("a1", "hero", { title: "Page title", media: { file_url: "https://cdn.example/a.jpg", alt: "A" } }),
    s("a2", "story", { title: "", body: "" }),
    s("a3", "cta", { title: "", buttons: [{ label: "Go" }] }),
    s("a4", "gallery", { title: "Gallery", items: [] }),
    s("a5", "faq", { title: "", items: [{ question: "" }] }),
  ];

  it("empty sections and buttons without a link are not drawn", () => {
    const root = dom(html(sections));
    expect(root.querySelectorAll("section")).toHaveLength(2); // hero + gallery head
    expect(root.textContent).not.toContain("Go");
  });

  it("editorMode: empty state with the component and missing field names, data-section-id on every section", () => {
    const root = dom(html(sections, { editorMode: true }));
    const all = Array.from(root.querySelectorAll("section"));
    expect(all.map((x) => x.getAttribute("data-section-id"))).toEqual(["a1", "a2", "a3", "a4", "a5"]);
    const empty = Array.from(root.querySelectorAll(".g4mp-empty")).map((e) => e.textContent);
    expect(empty).toEqual(["Image and textImage", "Call to actionButton", "FAQ"]);
  });

  it("no data-section-id outside the editor", () => {
    expect(html(sections)).not.toContain("data-section-id");
  });

  it("onSectionClick and renderInsertSlot", () => {
    const onSectionClick = vi.fn();
    const { container } = render(
      <MarketingPage
        sections={sections}
        resolveHref={resolveHref}
        editorMode
        onSectionClick={onSectionClick}
        renderInsertSlot={(i) => <i data-slot={i} />}
      />,
    );
    fireEvent.click(container.querySelector('[data-section-id="a2"]')!);
    expect(onSectionClick).toHaveBeenCalledWith("a2");
    expect(Array.from(container.querySelectorAll("[data-slot]")).map((n) => n.getAttribute("data-slot"))).toEqual(["0", "1", "2", "3", "4", "5"]);
  });

  it("labels from the host replace the defaults (others stay)", () => {
    const root = dom(
      html(
        [
          s("b1", "collections", { show_shipping: true }, { resolved: { collections: [{ id: "11111111-1111-4111-8111-111111111111", name: "H", styles: 3, shipping: "stycznia" }] } as never }),
          s("b2", "contact", { title: "C" }, { resolved: { contact: { email: "a@b.example" } } as never }),
          s("b3", "story", {}),
        ],
        { editorMode: true, labels: { shipping: "Wysyłka: od {date}", styles: { other: "{n} modeli" }, contact: { email: "E-mail" } } },
      ),
    );
    expect(root.textContent).toContain("Wysyłka: od stycznia");
    expect(root.textContent).toContain("3 modeli");
    expect(root.textContent).toContain("Image and text");
  });

  it("DEFAULT_LABELS holds every package text", () => {
    expect(DEFAULT_LABELS.shipping).toBe("Shipping: from {date}");
    expect(Object.keys(DEFAULT_LABELS.sections).sort()).toEqual([...SECTION_TYPES].sort());
  });

  it("a section without a heading joins only a previous drawn section with the same background", () => {
    const root = dom(
      html([
        s("j1", "text_block", { title: "Intro" }),
        s("j2", "story", { title: "" }), // empty → not drawn, skipped by the rule
        s("j3", "cards", { items: [{ title: "A" }, { title: "B" }] }),
        s("j4", "gallery", { items: [{ media: { file_url: "https://cdn.example/g.jpg" } }] }),
      ]),
    );
    const secs = Array.from(root.querySelectorAll("section"));
    expect(secs.map((x) => x.classList.contains("g4mp-section--joined"))).toEqual([false, true, false]);
  });

  it("formatted text: paragraphs, marks and an inline link through resolveHref", () => {
    const root = dom(
      html([
        s("r1", "text_block", {
          title: "T",
          body: [
            [{ text: "Bold", bold: true }, { text: " and " }, { text: "link", link: { kind: "catalog" } }],
            [{ text: "Gone", link: { kind: "collection", id: "11111111-1111-4111-8111-111111111111", available: false } }],
          ],
        }),
      ]),
    );
    const body = root.querySelector(".g4mp-body.g4mp-rich")!;
    expect(body.querySelectorAll("p")).toHaveLength(2);
    expect(body.querySelector("strong")?.textContent).toBe("Bold");
    expect(body.querySelector("a.g4mp-link")?.getAttribute("href")).toBe("/b/order?collection=all");
    expect(body.querySelectorAll("a")).toHaveLength(1);
    expect(body.textContent).toContain("Gone");
  });

  it("story image side and hero layout come from closed lists", () => {
    const out = html([
      s("v1", "hero", { title: "H", variant: "split" }),
      s("v2", "story", { title: "S", image_side: "left" }),
      s("v3", "story", { title: "X", image_side: 'left" onclick="x' }),
      s("v4", "hero", { title: "Y", variant: "evil-class" }),
    ]);
    expect(out).toContain("g4mp-hero-split");
    expect(out).toContain("g4mp-story--left");
    expect(out.match(/g4mp-story--left/g)).toHaveLength(1);
    expect(out).not.toContain("evil");
    expect(out).not.toContain("onclick");
  });
});

describe("0.5.0 E0b — catalog and host variables", () => {
  it("SECTION_CATALOG: 15 types, groups, limits, items, crops", () => {
    expect(SECTION_CATALOG.map((e) => e.type).sort()).toEqual([...SECTION_TYPES].sort());
    const hero = SECTION_CATALOG.find((e) => e.type === "hero")!;
    expect(hero.variants).toEqual(["cover", "split"]);
    expect(hero.fields.find((f) => f.key === "body")?.maxChars).toBe(TEXT_LIMITS.heroBody);
    expect(hero.crops?.cover).toEqual({ desktop: "21:9", mobile: "4:5" });
    expect(SECTION_CATALOG.find((e) => e.type === "gallery")?.items).toMatchObject({ min: 1, max: 12 });
    expect(SECTION_CATALOG.find((e) => e.type === "gallery")?.legacyTypes).toEqual(["team", "materials"]);
    expect(new Set(SECTION_CATALOG.map((e) => e.group))).toEqual(new Set(["Opening", "Content", "Media", "From go4", "Trust"]));
  });

  it("stylesheet reads host variables with the 0.4.1 values as defaults", () => {
    for (const v of [
      "var(--g4mp-bg, #fafafa)",
      "var(--g4mp-ink, #0a0a0a)",
      "var(--g4mp-surface, #ffffff)",
      "var(--g4mp-radius, 12px)",
      "var(--g4mp-radius, 8px)",
      'var(--g4mp-font-body, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif)',
      "var(--g4mp-font-heading, var(--g4mp-c-font-body))",
    ]) {
      expect(MARKETING_CSS).toContain(v);
    }
    // Every colour / radius use goes through the resolved variable.
    expect(MARKETING_CSS).not.toMatch(/var\(--g4mp-(bg|ink|surface|surface-2|muted|ondark|line)\)/);
    expect(MARKETING_CSS).not.toMatch(/border-radius: (8|12)px/);
  });
});
