import { describe, it, expect } from "vitest";
import { sectionsToMarkdown } from "./markdown";
import { buildStructuredData, jsonLdScriptContent } from "./structuredData";
import type { MarketingSection } from "./types";
import { BRAND_PAGES, GALLERY_PAGE, resolveHref, toHostSections } from "../test/fixtures/landingPages";

const C1 = "11111111-1111-4111-8111-111111111111";

describe("buildStructuredData", () => {
  it("FAQPage from FAQ, ItemList from Collections and Products (resolved data only)", () => {
    const data = buildStructuredData(toHostSections(GALLERY_PAGE), { resolveHref });
    expect(data.map((d) => d["@type"])).toEqual(["FAQPage", "ItemList", "ItemList"]);
    const faq = data[0] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faq.mainEntity).toHaveLength(3);
    expect(faq.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Sample question 1?",
      acceptedAnswer: { "@type": "Answer", text: "Sample answer. One or two sentences." },
    });
    const collections = data[1] as { itemListElement: Record<string, unknown>[] };
    expect(collections.itemListElement[0]).toMatchObject({ "@type": "ListItem", position: 1, name: "Collection name 1" });
    expect(String(collections.itemListElement[0].url)).toMatch(/^\/b\/order\?collection=/);
  });

  it("without a resolver: no url; unavailable target: no url; nothing resolved: no list", () => {
    const sections: MarketingSection[] = [
      { id: "a", type: "collections", is_visible: true, order_index: 0, config: { title: "C" }, resolved: { collections: [{ id: C1, name: "H", link: { kind: "collection", id: C1, available: false } }] } },
      { id: "b", type: "products", is_visible: true, order_index: 1, config: {} },
      { id: "c", type: "faq", is_visible: false, order_index: 2, config: { items: [{ question: "Hidden?", answer: "x" }] } },
    ];
    expect(buildStructuredData(sections, { resolveHref })).toEqual([
      { "@context": "https://schema.org", "@type": "ItemList", name: "C", itemListElement: [{ "@type": "ListItem", position: 1, name: "H" }] },
    ]);
    expect(buildStructuredData([])).toEqual([]);
  });

  it("jsonLdScriptContent cannot close the script element", () => {
    const out = jsonLdScriptContent({ name: "</script><script>alert(1)</script> & \u2028" });
    expect(out).not.toMatch(/[<>&\u2028]/);
    expect(JSON.parse(out)).toEqual({ name: "</script><script>alert(1)</script> & \u2028" });
  });
});

describe("sectionsToMarkdown", () => {
  it.skipIf(BRAND_PAGES.length === 0)("studio b3: headings, paragraphs, lists, links through resolveHref", () => {
    const md = sectionsToMarkdown(toHostSections(BRAND_PAGES[0].page), { resolveHref });
    expect(md.startsWith("New season split into two collections, plus Core Black essentials.\n\n# spring\\-summer 2027".replace("\\-", "-"))).toBe(true);
    expect(md).toContain("[Explore All Collections](/b/order?collection=all)");
    expect(md).toContain("## Concrete Black #1 and #2");
    expect(md).toContain(
      "- [Concrete Black #1](/b/order?collection=39e52fa0-0ae3-4a86-b8f0-788dac040f2f) — Spring/Summer 2027 · 46 styles · Shipping: from January 2027",
    );
    expect(md).toContain("- [CORE BLACK](/b/order?collection=f591b171-52dd-49da-9dfb-1e655e9aeadf) — 2027 · 10 styles\n");
    expect(md).toContain("- **When do the collections ship?**  \n  Concrete Black #1 ships from January 2027");
    expect(md).toContain("[Start Order](/b/order?collection=all)");
    expect(md.match(/^# /gm)).toHaveLength(1);
  });

  it("component gallery: every type in one pass; facts, features and FAQ as lists", () => {
    const md = sectionsToMarkdown(toHostSections(GALLERY_PAGE), { resolveHref });
    expect(md).toContain("- **00** sample fact label");
    expect(md).toContain("- **Feature title 1** — Sample feature text. One or two sentences.");
    expect(md).toContain("> Sample quote text. A single quote is shown large and centered.\n>\n> — Author name, Role, Boutique name");
    expect(md).toContain("- E-mail: [hello@example.com](mailto:hello@example.com)");
    expect(md).toContain("- Instagram: [@brandname](https://instagram.com/brandname)");
    expect(md).toContain("- [Card title 1](/b/order?collection=all) — Sample card caption");
  });

  it("formatting, escaping, unavailable links and no resolver", () => {
    const sections: MarketingSection[] = [
      {
        id: "t",
        type: "text_block",
        is_visible: true,
        order_index: 0,
        config: {
          title: "Price *not* shown",
          body: [
            [{ text: "Bold", bold: true }, { text: " " }, { text: "it", italic: true }, { text: " " }, { text: "go", link: { kind: "catalog" } }],
            [{ text: "closed", link: { kind: "collection", id: C1, available: false } }, { text: " # 1. <b>" }],
          ],
          buttons: [{ label: "Hidden", link: { kind: "collection", id: C1, available: false } }],
        },
      },
    ];
    expect(sectionsToMarkdown(sections, { resolveHref })).toBe(
      "# Price \\*not\\* shown\n\n**Bold** _it_ [go](/b/order?collection=all)\n\nclosed # 1. \\<b\\>\n",
    );
    expect(sectionsToMarkdown(sections)).toContain("**Bold** _it_ go");
    expect(sectionsToMarkdown([])).toBe("");
  });
});
