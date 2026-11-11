/**
 * `buildStructuredData(sections)` — schema.org data for search engines (concept §9):
 * FAQPage from FAQ sections, ItemList from Collections / Products (only from data
 * the host resolved). Returns plain JSON objects; the host puts them in `<head>`
 * (see `jsonLdScriptContent` for safe embedding).
 */
import { drawnCollections, drawnItems, drawnProducts, planPage, resolveTarget } from "./model";
import { richTextPlain } from "./richText";
import type { MarketingSection, ResolveHref } from "./types";

export type JsonLd = Record<string, unknown>;

export interface StructuredDataOptions {
  /** Same resolver as the page; adds `url` to list items (absolute URLs are best for search engines). */
  resolveHref?: ResolveHref;
}

export function buildStructuredData(sections: MarketingSection[], opts: StructuredDataOptions = {}): JsonLd[] {
  const out: JsonLd[] = [];
  const questions: JsonLd[] = [];
  for (const { section, drawn } of planPage(sections, opts.resolveHref)) {
    if (!drawn) continue;
    if (section.type === "faq") {
      for (const it of drawnItems(section)) {
        const answer = richTextPlain(it.answer).trim();
        if (!answer) continue;
        questions.push({
          "@type": "Question",
          name: it.question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        });
      }
    }
    if (section.type === "collections" || section.type === "products") {
      const list =
        section.type === "collections"
          ? drawnCollections(section).map((c) => ({ name: c.name, link: c.link ?? { kind: "collection", id: c.id } }))
          : drawnProducts(section).map((p) => ({ name: p.name, link: p.link ?? { kind: "product", id: p.id } }));
      const items = list
        .filter((x) => x.name)
        .map((x, i) => {
          const target = resolveTarget(x.link, opts.resolveHref);
          return { "@type": "ListItem", position: i + 1, name: x.name, ...(target ? { url: target.href } : {}) };
        });
      if (items.length) {
        out.push({
          "@context": "https://schema.org",
          "@type": "ItemList",
          ...(section.config.title ? { name: section.config.title } : {}),
          itemListElement: items,
        });
      }
    }
  }
  // One FAQPage per page (search engines expect a single one).
  if (questions.length) out.unshift({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions });
  return out;
}

/**
 * JSON for `<script type="application/ld+json">`: `<`, `>` and `&` escaped so
 * page text can never close the script element.
 */
export function jsonLdScriptContent(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
