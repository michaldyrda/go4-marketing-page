import { describe, it, expect, vi } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { render, fireEvent } from "@testing-library/react";
import { createHash } from "node:crypto";
import { MarketingPage } from "./MarketingPage";
import { MARKETING_CSS } from "./styles";
import { MARKETING_CSS_SHA256 } from "./cssHash";
import { ctaLink } from "./links";
import { safeHref } from "./sanitizeUrl";
import type { LandingLink, MarketingSection } from "./types";
import { LEGACY_PAGES } from "../test/fixtures/legacyPages";
import { MarketingPage as Legacy041 } from "../test/fixtures/legacy-0.4.1.js";

/** Text and image URLs a visitor gets — what must not change between 0.4.1 and 0.5.0. */
function visible(html: string) {
  const root = document.createElement("div");
  root.innerHTML = html;
  root.querySelectorAll("style, .g4mp-ext").forEach((n) => n.remove());
  return {
    text: (root.textContent ?? "").replace(/\s+/g, " ").trim(),
    images: Array.from(root.querySelectorAll("img, video, source")).map(
      (n) => n.getAttribute("src") ?? n.getAttribute("srcset"),
    ),
  };
}

const resolveHref = (link: LandingLink) =>
  link.kind === "catalog"
    ? "/boutique/order?collection=all"
    : link.kind === "collection"
      ? `/boutique/order?collection=${link.id}`
      : link.kind === "external"
        ? link.url ?? null
        : null;

const page = (sections: MarketingSection[], props: Record<string, unknown> = {}) =>
  renderToStaticMarkup(createElement(MarketingPage, { sections, ...props }));

function parity(name: string, sections: MarketingSection[]) {
  const before = visible(renderToStaticMarkup(createElement(Legacy041, { sections })));
  // Legacy host (only onCtaClick) — identical text and images.
  expect(visible(page(sections)), name).toEqual(before);
  // New host with resolveHref — same text except buttons without a target.
  const withLinks = visible(page(sections, { resolveHref }));
  expect(withLinks.images, name).toEqual(before.images);
}

describe("0.5.0 E0a — parity with 0.4.1 on legacy-shape pages", () => {
  for (const p of LEGACY_PAGES) {
    it(`${p.name}: same text and image URLs as 0.4.1`, () => parity(p.name, p.sections));
  }

  // Real production pages are not committed. Run locally with
  // G4MP_PARITY_FIXTURE=/path/to/pages.json (array of { name, sections }).
  const fixture = process.env.G4MP_PARITY_FIXTURE;
  it.skipIf(!fixture || !existsSync(fixture))("production pages from G4MP_PARITY_FIXTURE", () => {
    const pages = JSON.parse(readFileSync(fixture!, "utf8")) as { name: string; sections: MarketingSection[] }[];
    expect(pages.length).toBeGreaterThan(0);
    for (const p of pages) parity(p.name, p.sections);
  });
});

describe("0.5.0 E0a — links", () => {
  it("with resolveHref: zero <button>, CTAs and tiles are <a href>", () => {
    for (const p of LEGACY_PAGES) {
      const { container } = render(<MarketingPage sections={p.sections} resolveHref={resolveHref} />);
      expect(container.querySelectorAll("button"), p.name).toHaveLength(0);
      container.remove();
    }
    const { container } = render(<MarketingPage sections={LEGACY_PAGES[0].sections} resolveHref={resolveHref} />);
    const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      "/boutique/order?collection=all",
      "/boutique/order?collection=11111111-1111-4111-8111-111111111111",
      "/boutique/order?collection=22222222-2222-4222-8222-222222222222",
      "/boutique/order?collection=33333333-3333-4333-8333-333333333333",
      "/boutique/order?collection=all",
    ]);
  });

  it("unavailable target: no <a>, button gone, tile stays without a link", () => {
    const sections: MarketingSection[] = [
      { id: "c", type: "cta", is_visible: true, order_index: 0, config: { title: "T", cta: { label: "Go", link: { kind: "collection", id: "x", available: false } } } },
      { id: "k", type: "cards", is_visible: true, order_index: 1, config: { items: [{ title: "Tile", cta: { link: { kind: "collection", id: "y", available: false } } }] } },
      { id: "n", type: "cta", is_visible: true, order_index: 2, config: { title: "Null", cta: { label: "Nope", type: "collection", collection_id: "z" } } },
    ];
    const { container, getByText } = render(
      <MarketingPage sections={sections} resolveHref={(l) => (l.id === "z" ? null : "/ok")} />,
    );
    expect(container.querySelectorAll("a, button")).toHaveLength(0);
    expect(getByText("Tile").closest("div.g4mp-card")).not.toBeNull();
    expect(container.textContent).not.toContain("Go");
    expect(container.textContent).not.toContain("Nope");
  });

  it("unsafe href from the host is dropped (safeHref on every path)", () => {
    const sections: MarketingSection[] = [
      { id: "c", type: "cta", is_visible: true, order_index: 0, config: { title: "T", cta: { label: "Go", type: "order_form" } } },
    ];
    for (const bad of ["javascript:alert(1)", "//evil.example", "data:text/html,x", "https://u:p@evil.example", "java\nscript:x", "/\\evil"]) {
      const { container } = render(<MarketingPage sections={sections} resolveHref={() => bad} />);
      expect(container.querySelector("a"), bad).toBeNull();
      container.remove();
    }
  });

  it("external link: rel noopener noreferrer nofollow, new tab, exit mark", () => {
    const { container } = render(
      <MarketingPage
        resolveHref={resolveHref}
        sections={[{ id: "c", type: "cta", is_visible: true, order_index: 0, config: { title: "T", cta: { type: "external_link", url: "https://brand.example/x", label: "Visit" } } }]}
      />,
    );
    const a = container.querySelector("a")!;
    expect(a.getAttribute("href")).toBe("https://brand.example/x");
    expect(a.getAttribute("rel")).toBe("noopener noreferrer nofollow");
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.querySelector(".g4mp-ext")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("onLinkClick receives the link (SPA routing)", () => {
    const onLinkClick = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    const { container } = render(
      <MarketingPage
        resolveHref={resolveHref}
        onLinkClick={onLinkClick}
        sections={[{ id: "c", type: "cta", is_visible: true, order_index: 0, config: { title: "T", cta: { type: "order_form", label: "Go" } } }]}
      />,
    );
    fireEvent.click(container.querySelector("a")!);
    expect(onLinkClick).toHaveBeenCalledWith(expect.anything(), { kind: "catalog" });
  });

  it("ctaLink maps the legacy shape (concept §5)", () => {
    expect(ctaLink({ type: "order_form" })).toEqual({ kind: "catalog" });
    expect(ctaLink({ type: "external_link", url: "order?collection=all" })).toEqual({ kind: "catalog" });
    expect(ctaLink({ type: "external_link", url: "/b/order?collection=all" })).toEqual({ kind: "catalog" });
    expect(ctaLink({ type: "collection", collection_id: "c" })).toEqual({ kind: "collection", id: "c" });
    expect(ctaLink({ type: "external_link", url: "https://x.example" })).toEqual({ kind: "external", url: "https://x.example" });
    expect(ctaLink({ type: "external_link", url: "" })).toBeNull();
    expect(ctaLink({ type: "collection" })).toBeNull();
    expect(ctaLink({ link: { kind: "product", id: "p" }, type: "order_form" })).toEqual({ kind: "product", id: "p" });
  });

  it("safeHref allows mailto/tel in a strict form only", () => {
    expect(safeHref("mailto:hello@brand.example")).toBe("mailto:hello@brand.example");
    expect(safeHref("mailto:a@b.example?bcc=x@y.example")).toBeUndefined();
    expect(safeHref("tel:+48600100200")).toBe("tel:+48600100200");
    expect(safeHref("tel:+48 600 100 200")).toBeUndefined();
    expect(safeHref("tel:600;ext=1")).toBeUndefined();
  });
});

describe("0.5.0 E0a — headings, images, video", () => {
  it("exactly one <h1> on every page: the first title drawn", () => {
    for (const p of LEGACY_PAGES) {
      const { container } = render(<MarketingPage sections={p.sections} resolveHref={resolveHref} />);
      expect(container.querySelectorAll("h1"), p.name).toHaveLength(1);
      container.remove();
    }
    // Page 4: hero without title, video without file → the text block gets <h1>.
    const { container } = render(<MarketingPage sections={LEGACY_PAGES[3].sections} />);
    expect(container.querySelector("h1")?.textContent).toBe("First real title");
    expect(container.querySelector(".g4mp-hero h2")).toBeNull();
  });

  it("card titles are <h3> in link/plain tiles, <span> inside legacy <button>", () => {
    const sections = LEGACY_PAGES[0].sections;
    const withLinks = render(<MarketingPage sections={sections} resolveHref={resolveHref} />);
    expect(withLinks.container.querySelectorAll(".g4mp-card h3")).toHaveLength(3);
    withLinks.unmount();
    const legacy = render(<MarketingPage sections={sections} onCtaClick={() => {}} />);
    expect(legacy.container.querySelectorAll("button h3")).toHaveLength(0);
  });

  it("alt: brand alt first, then section title; grid images decorative without alt", () => {
    const { container } = render(
      <MarketingPage
        sections={[
          { id: "h", type: "hero", is_visible: true, order_index: 0, config: { title: "Season", media: [{ media_type: "image", file_url: "https://cdn.example/a.jpg", alt: "Model in a black coat" }] } },
          { id: "s", type: "story", is_visible: true, order_index: 1, config: { title: "Story title", media: [{ media_type: "image", file_url: "https://cdn.example/b.jpg" }] } },
          { id: "g", type: "materials", is_visible: true, order_index: 2, config: { media: [{ media_type: "image", file_url: "https://cdn.example/c.jpg", alt: "Linen close-up" }, { media_type: "image", file_url: "https://cdn.example/d.jpg" }] } },
          { id: "n", type: "hero", is_visible: true, order_index: 3, config: { media: [{ media_type: "image", file_url: "https://cdn.example/e.jpg" }] } },
        ]}
      />,
    );
    const alts = Array.from(container.querySelectorAll("img")).map((i) => i.getAttribute("alt"));
    expect(alts).toEqual(["Model in a black coat", "Story title", "Linen close-up", "", ""]);
  });

  it("lazy loading outside the first section; width/height from content; srcset with a resizer", () => {
    const { container } = render(
      <MarketingPage
        transformImageUrl={(u, w) => `${u}?w=${w}`}
        sections={[
          { id: "h", type: "hero", is_visible: true, order_index: 0, config: { title: "H", media: [{ media_type: "image", file_url: "https://cdn.example/a.jpg", width: 2560, height: 1097 }] } },
          { id: "s", type: "story", is_visible: true, order_index: 1, config: { title: "S", media: [{ media_type: "image", file_url: "https://cdn.example/b.jpg", width: -5 }] } },
        ]}
      />,
    );
    const [hero, story] = Array.from(container.querySelectorAll("img"));
    expect(hero.getAttribute("loading")).toBeNull();
    expect(hero.getAttribute("width")).toBe("2560");
    expect(hero.getAttribute("height")).toBe("1097");
    expect(hero.getAttribute("srcset")).toContain("https://cdn.example/a.jpg?w=1920 1920w");
    expect(hero.getAttribute("sizes")).toBe("100vw");
    expect(story.getAttribute("loading")).toBe("lazy");
    expect(story.getAttribute("width")).toBeNull();
    expect(story.getAttribute("src")).toBe("https://cdn.example/b.jpg?w=600");
  });

  it("no resizer → no srcset (identity would repeat one URL)", () => {
    const { container } = render(<MarketingPage sections={LEGACY_PAGES[0].sections} />);
    expect(container.querySelector("img[srcset]")).toBeNull();
  });

  it("video: poster + preload=none when a poster exists, else metadata", () => {
    const v = (poster?: string): MarketingSection => ({
      id: poster ?? "np", type: "video", is_visible: true, order_index: 0,
      config: { title: "V", media: [{ media_type: "video", file_url: "https://cdn.example/v.mp4", poster_url: poster }] },
    });
    const a = render(<MarketingPage sections={[v("https://cdn.example/p.jpg")]} />).container.querySelector("video")!;
    expect(a.getAttribute("poster")).toBe("https://cdn.example/p.jpg");
    expect(a.getAttribute("preload")).toBe("none");
    const b = render(<MarketingPage sections={[v()]} />).container.querySelector("video")!;
    expect(b.getAttribute("preload")).toBe("metadata");
  });
});

describe("0.5.0 E0a — stylesheet as a file (CSP)", () => {
  it("MARKETING_CSS_SHA256 matches the stylesheet (run `npm run build` after editing styles)", () => {
    const hash = createHash("sha256").update(MARKETING_CSS, "utf8").digest("base64");
    expect(MARKETING_CSS_SHA256).toBe(`sha256-${hash}`);
  });

  it("server render keeps the CSS byte-exact (no &quot; escaping), so the hash holds", () => {
    const html = page(LEGACY_PAGES[0].sections);
    const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
    expect(css).toBe(MARKETING_CSS);
    expect(MARKETING_CSS).not.toMatch(/<\//);
  });

  it("injectStyles={false} renders no <style>", () => {
    expect(page(LEGACY_PAGES[0].sections, { injectStyles: false })).not.toContain("<style");
  });

  it("content never reaches a class name or an attribute name", () => {
    const html = page([
      { id: "x", type: "cards", is_visible: true, order_index: 0, config: { items: Array.from({ length: 9 }, (_, i) => ({ title: `t${i}` })) } },
      { id: "y", type: 'hero" onmouseover="x', is_visible: true, order_index: 1, config: { title: "evil" } },
    ]);
    expect(html).toContain("g4mp-cards__grid--4");
    expect(html).not.toContain("onmouseover");
    expect(html).not.toContain("evil");
  });
});
