/**
 * `sectionsToMarkdown(sections)` — text version of the page (`.md` for AI and
 * readers, concept §9). Same normalization and drawing rules as the HTML: a
 * section, button or link that the page does not draw is not in the text.
 */
import { fill, mergeLabels } from "./labels";
import type { MarketingLabelsInput } from "./labels";
import {
  contactRows,
  drawnButtons,
  drawnCollections,
  drawnItems,
  drawnProducts,
  has,
  planPage,
  resolveTarget,
} from "./model";
import { richParagraphs } from "./richText";
import type { LandingSection, MarketingSection, ResolveHref, RichText } from "./types";

export interface MarkdownOptions {
  /** Same resolver as the page. Without it links are written as plain text. */
  resolveHref?: ResolveHref;
  labels?: MarketingLabelsInput;
}

/** Escapes inline Markdown syntax in content text. */
const mdInline = (s: string) => s.replace(/[\\`*_[\]<>&]/g, (c) => `\\${c}`);
/** Escapes block markers (heading, list, numbered list) at the start of each line. */
const mdLineStarts = (s: string) =>
  s
    .split("\n")
    .map((line) => line.replace(/^(\s*)([#+-]|\d+\.)(?=\s|$)/, "$1\\$2"))
    .join("\n");
/** Escapes Markdown syntax in content text. */
const mdText = (s: string) => mdLineStarts(mdInline(s));
/** Single line (headings, list items): line breaks become spaces. */
const mdLine = (s: string) => mdText(s.replace(/\s*\n\s*/g, " ").trim());
const mdHref = (href: string) => href.replace(/[()\s]/g, (c) => encodeURIComponent(c));
const mdLink = (text: string, href: string) => `[${text}](${mdHref(href)})`;

function richToMd(v: RichText | undefined, resolveHref?: ResolveHref): string[] {
  return richParagraphs(v).map((p) =>
    p
      .map((f) => {
        let t = mdInline(f.text).split("\n").join("  \n");
        if (!t.trim()) return t;
        if (f.italic) t = `_${t}_`;
        if (f.bold) t = `**${t}**`;
        const target = resolveTarget(f.link, resolveHref);
        return target ? mdLink(t, target.href) : t;
      })
      .join(""),
  ).map(mdLineStarts);
}

export function sectionsToMarkdown(sections: MarketingSection[], opts: MarkdownOptions = {}): string {
  const { resolveHref } = opts;
  const labels = mergeLabels(opts.labels);
  const blocks: string[] = [];

  const heading = (h1: boolean, title?: string) => {
    if (has(title)) blocks.push(`${h1 ? "#" : "##"} ${mdLine(title)}`);
  };
  const para = (s?: string) => {
    if (has(s)) blocks.push(mdText(s.trim()));
  };
  const rich = (v?: RichText) => blocks.push(...richToMd(v, resolveHref).filter((p) => p.trim()));
  const buttons = (s: LandingSection) => {
    const links = drawnButtons(s.config.buttons, resolveHref)
      .filter((b) => b.target)
      .map((b) => mdLink(mdLine(b.button.label), b.target!.href));
    if (links.length) blocks.push(links.join(" · "));
  };
  const list = (lines: string[]) => {
    if (lines.length) blocks.push(lines.map((l) => `- ${l}`).join("\n"));
  };

  for (const { section: s, drawn, h1 } of planPage(sections, resolveHref)) {
    if (!drawn) continue;
    const c = s.config;
    switch (s.type) {
      case "hero":
        para(c.eyebrow);
        heading(h1, c.title);
        rich(c.body);
        buttons(s);
        break;
      case "text_block":
      case "story":
      case "cta":
        heading(h1, c.title);
        para(c.subtitle);
        rich(c.body);
        buttons(s);
        break;
      case "gallery":
        heading(h1, c.title);
        para(c.subtitle);
        rich(c.body);
        list(
          drawnItems(s)
            .filter((i) => has(i.caption))
            .map((i) => [mdLine(i.caption!), has(i.subcaption) ? mdLine(i.subcaption) : ""].filter(Boolean).join(" — ")),
        );
        break;
      case "video":
        heading(h1, c.title);
        para(c.caption);
        break;
      case "cards":
        heading(h1, c.title);
        para(c.subtitle);
        rich(c.body);
        list(
          drawnItems(s)
            .map((i) => ({ i, sub: typeof i.body === "string" ? i.body : undefined }))
            .filter(({ i, sub }) => has(i.title) || has(sub))
            .map(({ i, sub }) => {
              const target = resolveTarget(i.link, resolveHref);
              const name = mdLine(i.title ?? sub ?? "");
              const title = target ? mdLink(name, target.href) : name;
              return has(i.title) && has(sub) ? `${title} — ${mdLine(sub)}` : title;
            }),
        );
        break;
      case "collections":
        heading(h1, c.title);
        list(
          drawnCollections(s)
            .filter((it) => has(it.name))
            .map((it) => {
              const target = resolveTarget(it.link ?? { kind: "collection", id: it.id }, resolveHref);
              const name = target ? mdLink(mdLine(it.name!), target.href) : mdLine(it.name!);
              const styles =
                it.styles != null ? fill(it.styles === 1 ? labels.styles.one : labels.styles.other, { n: it.styles }) : undefined;
              const shipping = c.show_shipping && has(it.shipping) ? fill(labels.shipping, { date: it.shipping }) : undefined;
              const meta = [it.season, styles, shipping].filter(has).map(mdLine).join(" · ");
              return meta ? `${name} — ${meta}` : name;
            }),
        );
        break;
      case "products":
        heading(h1, c.title);
        para(c.subtitle);
        list(
          drawnProducts(s)
            .filter((p) => has(p.name))
            .map((p) => {
              const target = resolveTarget(p.link ?? { kind: "product", id: p.id }, resolveHref);
              const name = target ? mdLink(mdLine(p.name!), target.href) : mdLine(p.name!);
              return has(p.category) ? `${name} — ${mdLine(p.category)}` : name;
            }),
        );
        break;
      case "facts":
        list(drawnItems(s).map((i) => [`**${mdLine(i.value!)}**`, has(i.label) ? mdLine(i.label) : ""].filter(Boolean).join(" ")));
        break;
      case "features":
        heading(h1, c.title);
        list(
          drawnItems(s).map((i) => {
            const body = richToMd(i.body, resolveHref).join(" ");
            return [has(i.title) ? `**${mdLine(i.title)}**` : "", body].filter(Boolean).join(" — ");
          }),
        );
        break;
      case "quotes":
        heading(h1, c.title);
        for (const q of drawnItems(s)) {
          const text = richToMd(q.text, resolveHref).map((p) => `> ${p}`).join("\n>\n");
          const by = [q.author, q.role].filter(has).map(mdLine).join(", ");
          blocks.push(`${text}\n>\n> — ${by}`);
        }
        break;
      case "logos":
        heading(h1, c.title);
        list(
          drawnItems(s)
            .filter((i) => has(i.name) || has(i.media?.alt))
            .map((i) => {
              const name = mdLine(i.name ?? i.media!.alt!);
              const target = resolveTarget(i.link, resolveHref);
              return target ? mdLink(name, target.href) : name;
            }),
        );
        break;
      case "faq":
        heading(h1, c.title);
        list(
          drawnItems(s).map((i) => {
            const answer = richToMd(i.answer, resolveHref).join("\n\n  ");
            return answer ? `**${mdLine(i.question!)}**  \n  ${answer}` : `**${mdLine(i.question!)}**`;
          }),
        );
        break;
      case "contact":
        heading(h1, c.title);
        rich(c.body);
        list(
          contactRows(s).map((r) => {
            const value = mdLine(r.value);
            return `${mdLine(labels.contact[r.key])}: ${r.href ? mdLink(value, r.href) : value}`;
          }),
        );
        break;
    }
  }
  return blocks.length ? `${blocks.join("\n\n")}\n` : "";
}
