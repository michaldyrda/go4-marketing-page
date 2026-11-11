import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { normalizeSection } from "./normalize";
import { MarketingPage } from "./MarketingPage";
import type { LandingLink, MarketingSection } from "./types";
import { LEGACY_PAGES } from "../test/fixtures/legacyPages";

const U1 = "11111111-1111-4111-8111-111111111111";
const M1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const img = (n: string, extra: Record<string, unknown> = {}) => ({ media_type: "image", file_url: `https://cdn.example/${n}.jpg`, ...extra });
const sec = (type: string, config: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({
  id: "x",
  type,
  is_visible: true,
  order_index: 3,
  config,
  ...extra,
});

/** Legacy (0.4.x) and new stored shapes → normalized config (concept §5 mapping). */
const CASES: [string, unknown, unknown][] = [
  [
    "hero: subtitle → eyebrow, media[] by role, cta → buttons[]",
    sec("hero", {
      title: "T",
      subtitle: "Eye",
      body: "B",
      media: [img("a", { role: "gallery" }), img("b", { role: "hero_image", mobile_file_url: "https://cdn.example/b-m.jpg", media_id: M1 })],
      cta: { type: "order_form", label: "Go", url: "" },
    }),
    {
      type: "hero",
      config: {
        variant: "cover",
        eyebrow: "Eye",
        title: "T",
        body: "B",
        media: { media_id: M1, media_type: "image", file_url: "https://cdn.example/b.jpg", mobile_file_url: "https://cdn.example/b-m.jpg" },
        buttons: [{ label: "Go", link: { kind: "catalog" } }],
      },
    },
  ],
  [
    "hero: role background, else first image",
    sec("hero", { media: [{ media_type: "video", file_url: "https://cdn.example/v.mp4" }, img("c"), img("d", { role: "background" })] }),
    { config: { variant: "cover", media: { media_type: "image", file_url: "https://cdn.example/d.jpg" } } },
  ],
  [
    "hero: hand-typed order?collection=all → catalog",
    sec("hero", { title: "T", cta: { type: "external_link", url: "order?collection=all", label: "All" } }),
    { config: { buttons: [{ label: "All", link: { kind: "catalog" } }] } },
  ],
  [
    "cta: collection → collection target; external URL → external",
    sec("cta", { title: "T", cta: { type: "collection", collection_id: U1, label: "See" } }),
    { type: "cta", config: { title: "T", buttons: [{ label: "See", link: { kind: "collection", id: U1 } }] } },
  ],
  [
    "cta: external_link https",
    sec("cta", { cta: { type: "external_link", url: "https://brand.example/c", label: "Contact" } }),
    { config: { buttons: [{ label: "Contact", link: { kind: "external", url: "https://brand.example/c" } }] } },
  ],
  [
    "cta: javascript: URL → button without a target",
    sec("cta", { cta: { type: "external_link", url: "javascript:alert(1)", label: "Bad" } }),
    { config: { buttons: [{ label: "Bad", link: null }] } },
  ],
  [
    "team → gallery: every image of media[], in order",
    sec("team", { title: "Team", subtitle: "Makers", body: "People", media: [img("t1", { role: "hero_image" }), { media_type: "video", file_url: "https://cdn.example/v.mp4" }, img("t2", { alt: "Two" })] }),
    {
      type: "gallery",
      config: {
        title: "Team",
        subtitle: "Makers",
        body: "People",
        items: [{ media: { media_type: "image", file_url: "https://cdn.example/t1.jpg" } }, { media: { media_type: "image", file_url: "https://cdn.example/t2.jpg", alt: "Two" } }],
      },
    },
  ],
  ["materials → gallery", sec("materials", { title: "M", media: [] }), { type: "gallery", config: { title: "M" } }],
  [
    "story: first image; legacy cta not carried (0.4.x never drew it)",
    sec("story", { title: "S", media: [img("s")], cta: { type: "order_form", label: "Hidden" } }),
    { type: "story", config: { title: "S", media: { media_type: "image", file_url: "https://cdn.example/s.jpg" } } },
  ],
  ["text_block: legacy cta not carried", sec("text_block", { title: "X", cta: { type: "order_form", label: "No" } }), { config: { title: "X" } }],
  [
    "video: media[] → the video with a file, poster kept",
    sec("video", { title: "V", caption: "C", media: [{ role: "video_main", media_type: "video", file_url: "https://cdn.example/v.mp4", poster_url: "https://cdn.example/p.jpg" }] }),
    { config: { title: "V", caption: "C", media: { media_type: "video", file_url: "https://cdn.example/v.mp4", poster_url: "https://cdn.example/p.jpg" } } },
  ],
  ["video: no file → no media", sec("video", { title: "V", media: [{ media_type: "video" }] }), { config: { title: "V" } }],
  [
    "cards: legacy item fields → media + link",
    sec("cards", { title: "C", items: [{ title: "A", body: "Sub", file_url: "https://cdn.example/a.jpg", width: 800, height: 1200, cta: { type: "collection", collection_id: U1 } }] }),
    { config: { title: "C", items: [{ title: "A", body: "Sub", media: { media_type: "image", file_url: "https://cdn.example/a.jpg", width: 800, height: 1200 }, link: { kind: "collection", id: U1 } }] } },
  ],
  [
    "new hero: variant next to config (template file), buttons[] with links",
    sec("hero", { eyebrow: "E", title: "T", buttons: [{ label: "A", link: { kind: "catalog" } }, { label: "B", link: { kind: "collection", id: U1 } }, { label: "C", link: { kind: "catalog" } }] }, { variant: "split" }),
    { config: { variant: "split", eyebrow: "E", title: "T", buttons: [{ label: "A", link: { kind: "catalog" } }, { label: "B", link: { kind: "collection", id: U1 } }] } },
  ],
  [
    "new: variant / image_side / mode outside the closed list → default or dropped",
    sec("story", { title: "S", image_side: "top", variant: "x" }),
    { config: { title: "S" } },
  ],
  ["hero: unknown variant → cover", sec("hero", { title: "T", variant: "fullscreen" }), { config: { variant: "cover", title: "T" } }],
  [
    "collections: mode, UUID items only, limit, shipping",
    sec("collections", { title: "C", mode: "selected", items: [{ collection_id: U1, _name: "x" }, { collection_id: "nope" }], limit: 4, show_shipping: true, extra: 1 }),
    { config: { title: "C", mode: "selected", items: [{ collection_id: U1 }], limit: 4, show_shipping: true } },
  ],
  [
    "products: mode from a collection",
    sec("products", { mode: "collection", collection_id: U1.toUpperCase(), limit: 8 }),
    { config: { mode: "collection", collection_id: U1, limit: 8 } },
  ],
  [
    "faq / facts / quotes / logos / features items keep known keys",
    sec("faq", { title: "F", items: [{ question: "Q?", answer: "A", onclick: "x" }, { answer: "no question" }] }),
    { config: { title: "F", items: [{ question: "Q?", answer: "A" }] } },
  ],
  [
    "facts: numbers become text; empty value dropped",
    sec("facts", { items: [{ value: 30, label: "styles" }, { value: "", label: "x" }, { value: Infinity }] }),
    { config: { items: [{ value: "30", label: "styles" }] } },
  ],
  [
    "contact: toggles",
    sec("contact", { title: "C", show: { address: false, email: true, bogus: true } }),
    { config: { title: "C", show: { address: false, email: true } } },
  ],
  [
    "resolved data is validated too",
    sec("collections", {}, { resolved: { collections: [{ id: U1, name: "H", styles: 3, price: 10 }, { id: "bad" }] } }),
    { resolved: { collections: [{ id: U1, name: "H", styles: 3 }] } },
  ],
  [
    "rich text keeps known fragment keys",
    sec("text_block", { body: [[{ text: "a", bold: true, color: "red" }, { text: "b", italic: "yes" }], [], "plain"] }),
    { config: { body: [[{ text: "a", bold: true }, { text: "b" }], [{ text: "plain" }]] } },
  ],
];

describe("normalizeSection — old → new shape", () => {
  for (const [name, raw, expected] of CASES) {
    it(name, () => {
      expect(normalizeSection(raw)).toMatchObject(expected as object);
      // Exact config where given (no extra keys).
      const exp = expected as { config?: object };
      if (exp.config && Object.keys(exp.config).length > 1) {
        expect(JSON.parse(JSON.stringify(normalizeSection(raw)!.config))).toEqual(
          expect.objectContaining(exp.config),
        );
      }
    });
  }

  it("exact output for one legacy section (no stray keys)", () => {
    expect(normalizeSection(CASES[0][1])).toEqual({
      id: "x",
      type: "hero",
      is_visible: true,
      order_index: 3,
      config: (CASES[0][2] as { config: object }).config,
    });
  });

  it("unknown type → null; id / visibility / order pass through", () => {
    expect(normalizeSection(sec("legacy_banner", {}))).toBeNull();
    expect(normalizeSection({ type: "toString", config: {} })).toBeNull();
    expect(normalizeSection(null)).toBeNull();
    expect(normalizeSection({ id: "s1", type: "faq", is_visible: false, order_index: 7, config: {} })).toMatchObject({ id: "s1", is_visible: false, order_index: 7 });
    expect(normalizeSection({ type: "faq", order_index: Infinity })?.order_index).toBe(0);
  });

  it("is idempotent: normalizing the normalized shape changes nothing (E9 rewrite)", () => {
    for (const p of LEGACY_PAGES) {
      for (const raw of p.sections) {
        const once = normalizeSection(raw);
        if (!once) continue;
        const stored = JSON.parse(JSON.stringify(once));
        expect(normalizeSection(stored), `${p.name}/${raw.id}`).toEqual(stored);
      }
    }
  });

  it("legacy pages rewritten to the new shape draw the same text and images", () => {
    const resolveHref = (l: LandingLink) => (l.kind === "external" ? l.url ?? null : `/b/${l.kind}/${l.id ?? ""}`);
    const visible = (sections: MarketingSection[], props: Record<string, unknown>) => {
      const root = document.createElement("div");
      root.innerHTML = renderToStaticMarkup(createElement(MarketingPage, { sections, injectStyles: false, ...props }));
      root.querySelectorAll(".g4mp-ext").forEach((n) => n.remove());
      return {
        text: (root.textContent ?? "").replace(/\s+/g, " ").trim(),
        images: Array.from(root.querySelectorAll("img, video, source")).map((n) => n.getAttribute("src") ?? n.getAttribute("srcset")),
        links: Array.from(root.querySelectorAll("a")).map((a) => a.getAttribute("href")),
      };
    };
    for (const p of LEGACY_PAGES) {
      const rewritten = JSON.parse(
        JSON.stringify(p.sections.map(normalizeSection).filter(Boolean)),
      ) as MarketingSection[];
      for (const props of [{}, { resolveHref }]) {
        expect(visible(rewritten, props), p.name).toEqual(visible(p.sections, props));
      }
    }
  });
});
