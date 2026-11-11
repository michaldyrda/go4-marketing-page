/**
 * Formatted text (concept §11). A "text" field holds plain text or a list of
 * paragraphs made of fragments `{ text, bold?, italic?, underline?, link? }`.
 * HTML is never stored: these pure functions convert between the editor's /
 * import file's HTML and the stored value. No DOM — they run in Node and Deno.
 */
import { normalizeLink } from "./links";
import { safeExternalUrl } from "./sanitizeUrl";
import type { LandingLink, RichFragment, RichParagraph, RichText } from "./types";

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

/* ── normalization (stored value → safe value) ─────────────────────────────── */

function normalizeFragment(raw: unknown): RichFragment | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const text = own(r, "text") ? r.text : undefined;
  if (typeof text !== "string" || text === "") return null;
  const f: RichFragment = { text };
  if (own(r, "bold") && r.bold === true) f.bold = true;
  if (own(r, "italic") && r.italic === true) f.italic = true;
  if (own(r, "underline") && r.underline === true) f.underline = true;
  const link = own(r, "link") ? normalizeLink(r.link) : null;
  if (link) f.link = link;
  return f;
}

/** Plain string stays a string; a paragraph list keeps known keys only. Empty → undefined. */
export function normalizeRichText(raw: unknown): RichText | undefined {
  if (typeof raw === "string") return raw.trim() ? raw : undefined;
  if (!Array.isArray(raw)) return undefined;
  const paragraphs: RichParagraph[] = [];
  for (const p of raw) {
    const frags = typeof p === "string" ? [{ text: p }] : Array.isArray(p) ? p : [];
    const para = mergeFragments(frags.map(normalizeFragment).filter((f): f is RichFragment => !!f));
    if (para.some((f) => f.text.trim())) paragraphs.push(para);
  }
  return paragraphs.length ? paragraphs : undefined;
}

/** True when the value carries visible text. */
export function hasRichText(v: RichText | undefined | null): boolean {
  if (typeof v === "string") return v.trim() !== "";
  return Array.isArray(v) && v.some((p) => p.some((f) => f.text.trim() !== ""));
}

/** Text only (for limits, alt fallbacks, structured data): paragraphs joined by an empty line. */
export function richTextPlain(v: RichText | undefined | null): string {
  if (typeof v === "string") return v;
  if (!Array.isArray(v)) return "";
  return v.map((p) => p.map((f) => f.text).join("")).join("\n\n");
}

/** Paragraphs of either form — a plain string splits on empty lines. */
export function richParagraphs(v: RichText | undefined | null): RichParagraph[] {
  if (typeof v === "string") {
    return v
      .split(/\n[ \t]*\n/)
      .map((p) => p.replace(/^\n+|\n+$/g, ""))
      .filter((p) => p.trim())
      .map((text) => [{ text }]);
  }
  return Array.isArray(v) ? v : [];
}

const sameLink = (a?: LandingLink, b?: LandingLink) =>
  a === b || (!!a && !!b && a.kind === b.kind && (a.id ?? null) === (b.id ?? null) && (a.url ?? null) === (b.url ?? null));

const sameMarks = (a: RichFragment, b: RichFragment) =>
  !!a.bold === !!b.bold && !!a.italic === !!b.italic && !!a.underline === !!b.underline && sameLink(a.link, b.link);

function mergeFragments(frags: RichFragment[]): RichFragment[] {
  const out: RichFragment[] = [];
  for (const f of frags) {
    const last = out[out.length - 1];
    if (last && sameMarks(last, f)) out[out.length - 1] = { ...last, text: last.text + f.text };
    else out.push({ ...f });
  }
  return out;
}

/* ── HTML → value ──────────────────────────────────────────────────────────── */

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]{1,6}|#[0-9]{1,7}|[a-z]{2,6});/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return n > 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff) ? String.fromCodePoint(n) : "";
    }
    const k = e.toLowerCase();
    return own(NAMED, k) ? NAMED[k] : m;
  });
}

/** Elements whose content is never text for the reader — dropped with everything inside. */
const DROP_WITH_CONTENT = new Set([
  "script", "style", "template", "noscript", "iframe", "object", "embed", "svg", "math",
  "textarea", "title", "select", "head", "frameset", "noembed", "noframes", "xmp", "plaintext",
]);
/** Block elements outside the allow-list: their text stays, as a separate paragraph. */
const BLOCKS = new Set([
  "div", "section", "article", "header", "footer", "main", "aside", "nav", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "dl", "dt", "dd", "table", "tr",
  "td", "th", "pre", "figure", "figcaption", "address", "details", "summary", "hr",
]);
const MARKS: Record<string, "bold" | "italic" | "underline"> = {
  b: "bold", strong: "bold", i: "italic", em: "italic", u: "underline",
};

function parseAttrs(src: string): Record<string, string> {
  const attrs: Record<string, string> = Object.create(null);
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const name = m[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

/** Link of an `<a>`: a go4 target (`data-go4-link-kind` + `-id`) or an external https/mailto/tel href. */
function linkFromAttrs(attrs: Record<string, string>): LandingLink | null {
  const kind = attrs["data-go4-link-kind"];
  if (kind && kind !== "external") {
    return normalizeLink({ kind, id: attrs["data-go4-link-id"] });
  }
  const url = safeExternalUrl(attrs["href"]);
  return url ? { kind: "external", url } : null;
}

/**
 * Strict tokenizer with an allow-list: `p, br, b, strong, i, em, u, a`.
 * Any other tag is removed (its text stays; block tags start a new paragraph);
 * `script`, `style` and similar are removed with their content; attributes other
 * than the link ones are ignored. Whitespace collapses as in HTML.
 */
export function richTextFromHtml(html: string): RichParagraph[] {
  const src = typeof html === "string" ? html : "";
  const paragraphs: RichParagraph[] = [];
  let current: RichFragment[] = [];
  const stack: { tag: string; link?: LandingLink | null }[] = [];

  const marks = () => {
    const f: Omit<RichFragment, "text"> = {};
    let link: LandingLink | null | undefined;
    for (const s of stack) {
      const mark = MARKS[s.tag];
      if (mark) f[mark] = true;
      if (s.tag === "a") link = s.link; // innermost <a> wins
    }
    if (link) f.link = link;
    return f;
  };
  /** Last character pushed in this paragraph — a space or line start swallows the next space. */
  let atSpace = true;
  const pushText = (raw: string) => {
    // HTML whitespace collapses; explicit <br> is added separately.
    let text = raw.replace(/[ \t\r\n\f]+/g, " ");
    if (atSpace) text = text.replace(/^ /, "");
    if (!text) return;
    atSpace = text.endsWith(" ");
    current.push({ text, ...marks() });
  };
  const pushBreak = () => {
    trimEnd(current, current.length && current[current.length - 1].text.endsWith(" ") ? 1 : 0);
    current.push({ text: "\n", ...marks() });
    atSpace = true;
  };
  const flush = () => {
    trimEnd(current, current.length && current[current.length - 1].text.endsWith(" ") ? 1 : 0);
    const para = mergeFragments(current.filter((f) => f.text !== ""));
    // A paragraph never starts or ends with a line break.
    while (para.length && /^\n/.test(para[0].text)) {
      para[0] = { ...para[0], text: para[0].text.replace(/^\n+/, "") };
      if (!para[0].text) para.shift();
    }
    while (para.length && /\n$/.test(para[para.length - 1].text)) {
      const k = para.length - 1;
      para[k] = { ...para[k], text: para[k].text.replace(/\n+$/, "") };
      if (!para[k].text) para.pop();
    }
    if (para.some((f) => f.text.trim())) paragraphs.push(para);
    current = [];
    atSpace = true;
  };

  let i = 0;
  while (i < src.length) {
    const lt = src.indexOf("<", i);
    if (lt === -1) {
      pushText(decodeEntities(src.slice(i)));
      break;
    }
    if (lt > i) pushText(decodeEntities(src.slice(i, lt)));
    // Comment / doctype / CDATA / processing instruction → removed.
    if (src.startsWith("<!--", lt)) {
      const end = src.indexOf("-->", lt + 4);
      i = end === -1 ? src.length : end + 3;
      continue;
    }
    const tagMatch = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/.exec(src.slice(lt));
    if (!tagMatch) {
      if (/^<[!?]/.test(src.slice(lt, lt + 2))) {
        const end = src.indexOf(">", lt);
        i = end === -1 ? src.length : end + 1;
        continue;
      }
      pushText("<"); // a lone "<" is text
      i = lt + 1;
      continue;
    }
    const [whole, slash, rawName, attrSrc] = tagMatch;
    const tag = rawName.toLowerCase();
    i = lt + whole.length;
    const closing = slash === "/";

    if (DROP_WITH_CONTENT.has(tag)) {
      if (!closing && !/\/\s*$/.test(attrSrc)) {
        const close = new RegExp(`</${tag}\\s*>`, "i").exec(src.slice(i));
        i = close ? i + close.index + close[0].length : src.length;
      }
      continue;
    }
    if (tag === "br") {
      pushBreak();
      continue;
    }
    if (tag === "p" || BLOCKS.has(tag)) {
      flush();
      continue;
    }
    if (tag === "a" || own(MARKS, tag)) {
      if (closing) {
        for (let k = stack.length - 1; k >= 0; k--) {
          if (stack[k].tag === tag) {
            stack.splice(k, 1);
            break;
          }
        }
      } else {
        stack.push({ tag, link: tag === "a" ? linkFromAttrs(parseAttrs(attrSrc)) : undefined });
      }
      continue;
    }
    // Any other inline tag: dropped, text kept.
  }
  flush();
  return paragraphs;
}

function trimEnd(frags: RichFragment[], n: number) {
  for (let k = frags.length - 1; k >= 0 && n > 0; k--) {
    const f = frags[k];
    const cut = Math.min(n, f.text.length);
    f.text = f.text.slice(0, f.text.length - cut);
    n -= cut;
  }
}

/* ── value → HTML ──────────────────────────────────────────────────────────── */

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);

function linkOpen(link: LandingLink): string {
  if (link.kind === "external") {
    const url = safeExternalUrl(link.url);
    return url ? `<a href="${esc(url)}">` : "";
  }
  return `<a data-go4-link-kind="${esc(String(link.kind))}"${link.id ? ` data-go4-link-id="${esc(String(link.id))}"` : ""}>`;
}

/**
 * Stored value → HTML of the allow-list (`p, br, strong, em, u, a`), for the
 * editor and the page file. Internal targets are written as
 * `<a data-go4-link-kind data-go4-link-id>`, external ones as `<a href>`.
 * `richTextFromHtml(richTextToHtml(v))` returns `v` (normalized).
 */
export function richTextToHtml(value: RichText | undefined | null): string {
  const paras = richParagraphs(normalizeRichText(value) ?? "");
  return paras
    .map((p) => {
      const inner = p
        .map((f) => {
          let s = esc(f.text).replace(/\n/g, "<br>");
          if (f.underline) s = `<u>${s}</u>`;
          if (f.italic) s = `<em>${s}</em>`;
          if (f.bold) s = `<strong>${s}</strong>`;
          const open = f.link ? linkOpen(f.link) : "";
          return open ? `${open}${s}</a>` : s;
        })
        .join("");
      return `<p>${inner}</p>`;
    })
    .join("");
}
