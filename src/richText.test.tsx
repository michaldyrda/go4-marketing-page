import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MarketingPage } from "./MarketingPage";
import { normalizeRichText, richTextFromHtml, richTextToHtml } from "./richText";
import type { LandingLink, MarketingSection, RichText } from "./types";

const U1 = "11111111-1111-4111-8111-111111111111";
const resolveHref = (l: LandingLink) => (l.kind === "external" ? l.url ?? null : l.kind === "collection" ? `/c/${l.id}` : "/all");
const page = (body: unknown) =>
  renderToStaticMarkup(
    createElement(MarketingPage, {
      sections: [{ id: "t", type: "text_block", is_visible: true, order_index: 0, config: { title: "T", body } } as MarketingSection],
      resolveHref,
      injectStyles: false,
    }),
  );

describe("formatted text — drawing", () => {
  it("a string with tags is drawn as text (plain field)", () => {
    const out = page("<b>bold</b> <script>alert(1)</script>");
    expect(out).toContain("&lt;b&gt;bold&lt;/b&gt; &lt;script&gt;");
    expect(out).not.toContain("<b>");
    expect(out).not.toContain("<script");
  });

  it("tags inside a fragment's text stay text", () => {
    const out = page([[{ text: '<img src=x onerror="alert(1)">', bold: true }]]);
    expect(out).toContain("<strong>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</strong>");
    expect(out).not.toContain("<img");
  });

  it("marks and line breaks become elements; unknown keys are ignored", () => {
    const out = page([[{ text: "a", bold: true, italic: true, underline: true }, { text: "b\nc", html: "<i>x</i>", style: "color:red" }]]);
    expect(out).toContain("<p><strong><em><u>a</u></em></strong>b<br/>c</p>");
    expect(out).not.toContain("color:red");
    expect(out).not.toContain("<i>");
  });

  it("link with an unavailable or unknown target leaves the text only", () => {
    const out = page([
      [
        { text: "closed", link: { kind: "collection", id: U1, available: false } },
        { text: " bad", link: { kind: "external", url: "javascript:alert(1)" } },
        { text: " weird", link: { kind: "ftp", url: "ftp://x" } },
        { text: " ok", link: { kind: "collection", id: U1 } },
      ],
    ]);
    expect(out.match(/<a /g)).toHaveLength(1);
    expect(out).toContain(`<a class="g4mp-link" href="/c/${U1}"> ok</a>`);
    expect(out).toContain("closed bad weird");
    expect(out).not.toContain("javascript:");
  });

  it("external inline link: rel, new tab, exit mark", () => {
    const out = page([[{ text: "site", link: { kind: "external", url: "https://brand.example" } }]]);
    expect(out).toContain('href="https://brand.example" rel="noopener noreferrer nofollow" target="_blank"');
    expect(out).toContain('class="g4mp-ext"');
  });
});

describe("richTextFromHtml / richTextToHtml", () => {
  it("reads the allow-list into paragraphs and fragments", () => {
    expect(richTextFromHtml("<p>Hello <strong>world</strong>!</p><p>Line<br>two <em>it</em> <u>u</u> <b>b</b> <i>i</i></p>")).toEqual([
      [{ text: "Hello " }, { text: "world", bold: true }, { text: "!" }],
      [
        { text: "Line\ntwo " },
        { text: "it", italic: true },
        { text: " " },
        { text: "u", underline: true },
        { text: " " },
        { text: "b", bold: true },
        { text: " " },
        { text: "i", italic: true },
      ],
    ]);
  });

  it("links: go4 target by data attributes, external by https/mailto/tel href only", () => {
    expect(
      richTextFromHtml(
        `<p><a data-go4-link-kind="collection" data-go4-link-id="${U1}" href="#">c</a> <a href="https://x.example/a?b=1&amp;c=2">x</a> <a href="mailto:a@b.example">m</a> <a href="/relative">r</a> <a data-go4-link-kind="collection" data-go4-link-id="nope">n</a> <a data-go4-link-kind="evil">e</a></p>`,
      ),
    ).toEqual([
      [
        { text: "c", link: { kind: "collection", id: U1 } },
        { text: " " },
        { text: "x", link: { kind: "external", url: "https://x.example/a?b=1&c=2" } },
        { text: " " },
        { text: "m", link: { kind: "external", url: "mailto:a@b.example" } },
        { text: " r n e" },
      ],
    ]);
  });

  it("script, style, event handlers and javascript: disappear; other tags leave their text", () => {
    const value = richTextFromHtml(
      `<div>Intro<script>alert(1)</script><style>p{}</style></div><img src=x onerror=alert(1)><p onclick="x()">Click <a href="javascript:alert(1)">me</a> <a href=" JaVaScRiPt:alert(1)">too</a><iframe src="https://evil.example">inside</iframe></p><h2>Head</h2><ul><li>One</li></ul><span style="color:red">Red</span><!-- <script>x</script> --><svg><text>svg</text></svg>`,
    );
    const html = richTextToHtml(value);
    expect(html).toBe("<p>Intro</p><p>Click me too</p><p>Head</p><p>One</p><p>Red</p>");
    for (const bad of ["script", "onerror", "onclick", "javascript", "iframe", "style", "svg", "alert"]) {
      expect(html.toLowerCase()).not.toContain(bad);
    }
  });

  it("entities decode to text and encode back", () => {
    const v = richTextFromHtml("<p>&lt;script&gt; &amp; &quot;q&quot; &#39;s&#39; &#x41;&nbsp;</p>");
    expect(v).toEqual([[{ text: "<script> & \"q\" 's' A " }]]);
    expect(richTextToHtml(v)).toBe("<p>&lt;script&gt; &amp; &quot;q&quot; &#39;s&#39; A </p>");
  });

  it("whitespace collapses like HTML; <br> stays a line break", () => {
    expect(richTextFromHtml("<p>  a \n  b <br>  c  </p>")).toEqual([[{ text: "a b\nc" }]]);
    expect(richTextFromHtml("text without p\n\nstill one paragraph")).toEqual([[{ text: "text without p still one paragraph" }]]);
    expect(richTextFromHtml("")).toEqual([]);
    expect(richTextFromHtml("<p> </p><p><br></p>")).toEqual([]);
  });

  it("HTML → value → HTML is stable", () => {
    const inputs = [
      `<p>Plain</p><p><strong>b <em>bi</em></strong> <u>u</u></p>`,
      `<p><a data-go4-link-kind="catalog">all</a> and <a href="https://x.example">x <strong>y</strong></a><br>next</p>`,
      `Loose <b>text</b><div>block</div>`,
      `<p>a &amp; b &lt;c&gt;</p>`,
    ];
    for (const h of inputs) {
      const once = richTextToHtml(richTextFromHtml(h));
      expect(richTextToHtml(richTextFromHtml(once)), h).toBe(once);
    }
  });

  it("value → HTML → value returns the value", () => {
    const value: RichText = [
      [{ text: "Bold", bold: true }, { text: " and " }, { text: "link", link: { kind: "collection", id: U1 }, italic: true }],
      [{ text: "a\nb" }, { text: "out", link: { kind: "external", url: "https://x.example/?q=1&r=2" } }],
    ];
    const html = richTextToHtml(value);
    expect(html).toBe(
      `<p><strong>Bold</strong> and <a data-go4-link-kind="collection" data-go4-link-id="${U1}"><em>link</em></a></p><p>a<br>b<a href="https://x.example/?q=1&amp;r=2">out</a></p>`,
    );
    expect(richTextFromHtml(html)).toEqual(value);
  });

  it("an unsafe stored URL never reaches the HTML (text stays)", () => {
    const html = richTextToHtml([[{ text: "x", link: { kind: "external", url: "https://x.example/<2>" } }]]);
    expect(html).toBe("<p>x</p>");
  });

  it("a plain string value converts by empty lines", () => {
    expect(richTextToHtml("One\nline\n\nTwo <b>")).toBe("<p>One<br>line</p><p>Two &lt;b&gt;</p>");
  });
});
