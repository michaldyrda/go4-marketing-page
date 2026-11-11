import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingPage } from "./MarketingPage";
import { MARKETING_CSS } from "./styles";
import { sectionsToMarkdown } from "./markdown";
import { buildStructuredData, jsonLdScriptContent } from "./structuredData";
import type { LandingLink, MarketingSection } from "./types";

/**
 * Content written straight into the stored sections (bypassing the editor and the
 * import) — concept §12.3 point 2 and 9. Whatever is stored, the drawn HTML has
 * no element or attribute outside the contract.
 */
const TEXT = [
  "<script>alert(1)</script>",
  "<img src=x onerror=alert(1)>",
  '"><svg onload=alert(1)>',
  "'><iframe src=//evil.example></iframe>",
  "<object data=x></object><embed src=x>",
  "</style><script>alert(1)</script>",
  "<style>*{display:none}</style>",
  "{{constructor.constructor('alert(1)')()}}",
  "&lt;script&gt;alert(1)&lt;/script&gt;",
  "  <!--",
];
const URLS = [
  "javascript:alert(1)",
  " JaVaScRiPt:alert(1)",
  "java\tscript:alert(1)",
  "jav&#x09;ascript:alert(1)",
  "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
  "data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+",
  "vbscript:msgbox(1)",
  "//evil.example/x",
  "https://u:p@evil.example",
  '/"onmouseover="alert(1)',
  "https://evil.example/\"><script>alert(1)</script>",
];

const BIG = [1e308, -1, Number.MAX_SAFE_INTEGER, Infinity, NaN, 1e21];

const pick = <T,>(list: T[], i: number) => list[i % list.length];

/** One section of every type with every field filled with hostile content. */
function hostileSections(seed: number): MarketingSection[] {
  const t = (n: number) => pick(TEXT, seed + n);
  const u = (n: number) => pick(URLS, seed + n);
  const media = (n: number) => ({
    media_id: t(n),
    file_url: u(n),
    mobile_file_url: u(n + 1),
    poster_url: u(n + 2),
    alt: t(n),
    width: pick(BIG, n),
    height: pick(BIG, n + 1),
    media_type: t(n),
    poster: { file_url: u(n + 3) },
  });
  const link = (n: number) => pick<unknown>(
    [
      { kind: "external", url: u(n) },
      { kind: "collection", id: t(n) },
      { kind: t(n), id: t(n), url: u(n) },
      { kind: "portal_view", id: t(n) },
      { kind: "product", id: '11111111-1111-4111-8111-111111111111" onclick="x' },
    ],
    n,
  );
  const rich = (n: number) => [
    [
      { text: t(n), bold: t(n), link: link(n) },
      { text: t(n + 1), italic: true, underline: true, html: t(n), link: link(n + 1) },
    ],
    t(n + 2),
  ];
  const buttons = [0, 1, 2].map((n) => ({ label: t(n), link: link(n), onclick: t(n) }));
  const cfg = (n: number) => ({
    variant: t(n),
    eyebrow: t(n),
    title: t(n + 1),
    subtitle: t(n + 2),
    body: rich(n),
    caption: t(n + 3),
    media: media(n),
    buttons,
    cta: { label: t(n), type: "external_link", url: u(n) },
    image_side: t(n),
    mode: t(n),
    show_shipping: true,
    className: t(n),
    style: "background:url(javascript:alert(1))",
    items: [0, 1, 2, 3].map((k) => ({
      title: t(k),
      body: rich(k),
      media: media(k),
      file_url: u(k),
      link: link(k),
      cta: { type: "external_link", url: u(k), label: t(k) },
      caption: t(k),
      subcaption: t(k + 1),
      value: pick<unknown>([t(k), 1e308, Infinity], k),
      label: t(k),
      text: rich(k),
      author: t(k),
      role: t(k),
      avatar: media(k),
      name: t(k),
      question: t(k),
      answer: rich(k),
      collection_id: t(k),
      product_id: t(k),
    })),
  });
  const resolved = {
    collections: [{ id: "11111111-1111-4111-8111-111111111111", name: t(1), season: t(2), styles: 1e21, shipping: t(3), cover: media(1), link: link(1), price: "€1" }, { id: t(1) }],
    products: [{ id: "22222222-2222-4222-8222-222222222222", name: t(1), category: t(2), image: media(2), link: link(2), price: "€1" }],
    contact: { address: t(1), email: `${u(1)}@x.example`, website: u(2), instagram: t(3) },
  };
  const types = ["hero", "text_block", "story", "gallery", "video", "cards", "collections", "products", "facts", "features", "quotes", "logos", "faq", "cta", "contact", "team", "materials", t(0), "__proto__", "constructor"];
  return types.map((type, i) => ({
    id: i === 0 ? '"><script>alert(1)</script>' : `h${i}`,
    type,
    variant: t(i),
    is_visible: true,
    order_index: pick(BIG, i),
    config: cfg(i),
    resolved,
  })) as MarketingSection[];
}

const ALLOWED_TAGS = new Set([
  "div", "section", "p", "h1", "h2", "h3", "span", "a", "img", "picture", "source", "video", "ul", "ol",
  "li", "figure", "figcaption", "blockquote", "details", "summary", "strong", "em", "u", "br", "button", "i",
]);

function assertClean(html: string, label: string) {
  const errors: string[] = [];
  // The package's own stylesheet is the only <style>, byte-exact.
  const styles = html.match(/<style>[\s\S]*?<\/style>/g) ?? [];
  if (styles.length > 1 || (styles[0] && styles[0] !== `<style>${MARKETING_CSS}</style>`)) errors.push("foreign <style>");
  const body = html.replace(/<style>[\s\S]*?<\/style>/, "");
  if (/<(script|iframe|object|embed|style|svg|math|form|base|meta|link)\b/i.test(body)) errors.push("forbidden element");
  if (/javascript:|vbscript:|data:text/i.test(body)) errors.push("dangerous scheme");

  const root = document.createElement("div");
  root.innerHTML = body;
  for (const el of Array.from(root.querySelectorAll("*"))) {
    const tag = el.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) errors.push(`<${tag}>`);
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith("on")) errors.push(`${tag}[${attr.name}]`);
      if (["style", "srcdoc", "formaction", "xlink:href"].includes(attr.name)) errors.push(`${tag}[${attr.name}]`);
      if (["href", "src", "poster", "srcset"].includes(attr.name)) {
        const urls = attr.name === "srcset" ? attr.value.split(/,\s*/).map((x) => x.split(" ")[0]) : [attr.value];
        for (const url of urls) {
          if (!/^(https?:\/\/[^@\s]+$|\/(?!\/)|mailto:[^?]+$|tel:\+?\d+$)/.test(url)) errors.push(`${tag}[${attr.name}]=${url}`);
        }
      }
      if (attr.name === "class" && !attr.value.split(/\s+/).every((c) => /^g4mp[a-z0-9_-]*$/.test(c))) errors.push(`class=${attr.value}`);
    }
  }
  expect(errors, label).toEqual([]);
}

const resolvers: [string, ((l: LandingLink) => string | null) | undefined][] = [
  ["legacy host (no resolveHref)", undefined],
  ["portal resolver", (l) => (l.kind === "external" ? l.url ?? null : `/b/${l.kind}/${l.id ?? ""}`)],
  ["host that returns the raw url", (l) => (l.url ?? l.id ?? null) as string | null],
  ["broken host returning javascript:", () => "javascript:alert(1)"],
];

describe("hostile content written straight into sections", () => {
  for (const [name, resolveHref] of resolvers) {
    for (const seed of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      it(`${name} · corpus ${seed}`, () => {
        const sections = hostileSections(seed);
        for (const editorMode of [false, true]) {
          const html = renderToStaticMarkup(
            createElement(MarketingPage, {
              sections,
              resolveHref,
              editorMode,
              injectStyles: seed === 0,
              transformImageUrl: seed % 2 ? (url, w) => `${url}?w=${w}` : undefined,
            }),
          );
          assertClean(html, `${name}/${seed}/${editorMode}`);
        }
      });
    }
  }

  it("prototype keys in stored JSON do not leak into the page", () => {
    const sections = JSON.parse(
      `[{"id":"p","type":"text_block","is_visible":true,"order_index":0,"config":{"__proto__":{"title":"<script>polluted</script>","body":"x"},"constructor":{"prototype":{"title":"c"}}}},
        {"id":"q","type":"faq","is_visible":true,"order_index":1,"config":{"title":"F","items":[{"__proto__":{"question":"proto?"}}]}}]`,
    );
    // Object literal with a real prototype (not only an own "__proto__" key).
    sections.push({ id: "r", type: "cta", is_visible: true, order_index: 2, config: Object.create({ title: "inherited", buttons: [{ label: "x", link: { kind: "catalog" } }] }) });
    const html = renderToStaticMarkup(createElement(MarketingPage, { sections, resolveHref: () => "/x", injectStyles: false }));
    expect(html).toBe('<div class="g4mp"></div>');
    expect(({} as Record<string, unknown>).title).toBeUndefined();
  });

  it("huge and negative numbers never reach attributes", () => {
    const html = renderToStaticMarkup(
      createElement(MarketingPage, {
        injectStyles: false,
        sections: [
          { id: "n", type: "story", is_visible: true, order_index: 1e308, config: { title: "S", media: { file_url: "https://cdn.example/a.jpg", width: 1e308, height: -5 } } },
          { id: "m", type: "collections", is_visible: true, order_index: -Infinity, config: {}, resolved: { collections: [{ id: "11111111-1111-4111-8111-111111111111", name: "H", styles: 1e21 }] } },
        ],
      }),
    );
    expect(html).not.toMatch(/width=|height=/);
    expect(html).not.toContain("e+");
  });

  it("text output: Markdown and structured data stay inert", () => {
    const resolveHref = (l: LandingLink) => (l.kind === "external" ? l.url ?? null : `/b/${l.kind}`);
    const md = sectionsToMarkdown(hostileSections(3), { resolveHref });
    expect(md.toLowerCase()).not.toContain("javascript:");
    // Content "<" only as a Markdown escape (\\<), never as raw HTML.
    expect(md).not.toMatch(/(^|[^\\])</m);
    const json = jsonLdScriptContent(buildStructuredData(hostileSections(0), { resolveHref }));
    expect(json).not.toMatch(/[<>]/);
    expect(json.toLowerCase()).not.toContain("javascript:");
  });
});
