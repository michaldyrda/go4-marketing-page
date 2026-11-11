/**
 * Drawing rules shared by the React components, `sectionsToMarkdown` and
 * `buildStructuredData` — one place decides what of a normalized section is
 * drawn, so HTML, text and structured data never disagree.
 */
import { legacyCtaOf, normalizeSection } from "./normalize";
import { hasRichText } from "./richText";
import { safeHref, safeImgSrc } from "./sanitizeUrl";
import type {
  LandingButton,
  LandingItem,
  LandingLink,
  LandingMedia,
  LandingSection,
  ResolveHref,
  ResolvedCollection,
  ResolvedProduct,
} from "./types";

export const has = (s?: string | null): s is string => typeof s === "string" && s.trim() !== "";

export interface ResolvedTarget {
  href: string;
  external: boolean;
  link: LandingLink;
}

/** Link target → href via the host; null when unavailable, unresolved or unsafe. */
export function resolveTarget(link: LandingLink | null | undefined, resolveHref?: ResolveHref): ResolvedTarget | null {
  if (!link || !resolveHref || link.available === false) return null;
  const href = safeHref(resolveHref(link));
  return href ? { href, external: link.kind === "external", link } : null;
}

/**
 * Buttons that are drawn. With `resolveHref`: label + resolvable target only.
 * Legacy host (no `resolveHref`): every labelled button, as 0.4.x did.
 */
export function drawnButtons(
  buttons: LandingButton[] | undefined,
  resolveHref?: ResolveHref,
): { button: LandingButton; target: ResolvedTarget | null }[] {
  const list = (buttons ?? []).filter((b) => has(b.label));
  if (!resolveHref) return list.map((button) => ({ button, target: null }));
  return list
    .map((button) => ({ button, target: resolveTarget(button.link, resolveHref) }))
    .filter((b) => b.target);
}

export const mediaSrc = (m?: LandingMedia) => !!m && !!(safeImgSrc(m.file_url) || safeImgSrc(m.mobile_file_url));

/** Upper bounds when drawing (catalog max). Cards and Gallery keep every legacy item. */
export const RENDER_MAX: Partial<Record<LandingSection["type"], number>> = {
  collections: 12,
  products: 8,
  facts: 4,
  features: 6,
  quotes: 6,
  logos: 12,
  faq: 12,
};
const capped = <T,>(type: LandingSection["type"], list: T[] | undefined): T[] =>
  (list ?? []).slice(0, RENDER_MAX[type] ?? Infinity);

/** Items of a section that are drawn. */
export function drawnItems(section: LandingSection): LandingItem[] {
  const { type, config } = section;
  const items = config.items ?? [];
  switch (type) {
    case "gallery":
      return items.filter((i) => mediaSrc(i.media));
    case "cards":
      return items;
    case "facts":
      return capped(type, items.filter((i) => has(i.value)));
    case "features":
      return capped(type, items.filter((i) => has(i.title) || hasRichText(i.body)));
    case "quotes":
      // A quote without an author is not drawn (concept §5).
      return capped(type, items.filter((i) => hasRichText(i.text) && has(i.author)));
    case "logos":
      return capped(type, items.filter((i) => mediaSrc(i.media)));
    case "faq":
      return capped(type, items.filter((i) => has(i.question)));
    default:
      return [];
  }
}

export const drawnCollections = (s: LandingSection): ResolvedCollection[] =>
  s.type === "collections" ? capped("collections", s.resolved?.collections) : [];
export const drawnProducts = (s: LandingSection): ResolvedProduct[] =>
  s.type === "products" ? capped("products", s.resolved?.products) : [];

export const CONTACT_KEYS = ["address", "email", "website", "instagram"] as const;
export type ContactKey = (typeof CONTACT_KEYS)[number];

/** Contact rows: brand data the host served, minus the ones switched off. */
export function contactRows(s: LandingSection): { key: ContactKey; value: string; href?: string; external: boolean }[] {
  const data = s.resolved?.contact;
  if (s.type !== "contact" || !data) return [];
  const show = s.config.show ?? {};
  const rows: { key: ContactKey; value: string; href?: string; external: boolean }[] = [];
  for (const key of CONTACT_KEYS) {
    const value = data[key];
    if (!has(value) || show[key] === false) continue;
    const href =
      key === "email"
        ? safeHref(`mailto:${value.trim()}`)
        : key === "website"
          ? safeHref(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`)
          : key === "instagram"
            ? safeHref(`https://instagram.com/${value.trim().replace(/^@/, "")}`)
            : undefined;
    rows.push({ key, value, href, external: key === "website" || key === "instagram" });
  }
  return rows;
}

/** Text fields of a section heading. */
const headText = (s: LandingSection) =>
  has(s.config.title) || has(s.config.subtitle) || hasRichText(s.config.body);

/** Does the section draw anything? An empty section is not drawn (editor: empty state). */
export function hasContent(s: LandingSection, resolveHref?: ResolveHref): boolean {
  const c = s.config;
  const buttons = drawnButtons(c.buttons, resolveHref).length > 0;
  switch (s.type) {
    case "hero":
      return has(c.eyebrow) || has(c.title) || hasRichText(c.body) || buttons || mediaSrc(c.media) || (c.media?.media_type === "video" && !!safeImgSrc(c.media.file_url));
    case "text_block":
      return headText(s) || buttons;
    case "story":
      return headText(s) || buttons || mediaSrc(c.media);
    case "gallery":
      return headText(s) || drawnItems(s).length > 0;
    case "video":
      return !!safeImgSrc(c.media?.file_url);
    case "cards":
      return drawnItems(s).length > 0;
    case "collections":
      return drawnCollections(s).length > 0;
    case "products":
      return drawnProducts(s).length > 0;
    case "facts":
    case "quotes":
    case "logos":
    case "faq":
      return drawnItems(s).length > 0;
    case "features":
      return has(c.title) || drawnItems(s).length > 0;
    case "cta":
      return has(c.title) || has(c.subtitle) || hasRichText(c.body) || buttons;
    case "contact":
      return has(c.title) || hasRichText(c.body) || contactRows(s).length > 0;
  }
}

/** Title drawn as the section heading (Key facts has none). */
export const sectionTitle = (s: LandingSection): string | undefined =>
  s.type !== "facts" && has(s.config.title) ? s.config.title : undefined;

/** Name of the missing field shown in the editor's empty state. */
export const MISSING_FIELD: Record<LandingSection["type"], "title" | "media" | "button" | null> = {
  hero: "title",
  text_block: "title",
  story: "media",
  gallery: "media",
  video: null,
  cards: null,
  collections: null,
  products: null,
  facts: null,
  features: null,
  quotes: null,
  logos: null,
  faq: null,
  cta: "button",
  contact: null,
};

/* ── adjacency (mockup decision 2): a section without a heading joins the
      previous drawn section with the same background ─────────────────────── */

type Surface = "image" | "bg" | "surface" | "surface-2" | "ink";
const SURFACE: Record<LandingSection["type"], Surface> = {
  hero: "image",
  text_block: "surface",
  story: "surface",
  video: "surface",
  cards: "surface",
  collections: "surface",
  logos: "surface",
  faq: "surface",
  gallery: "surface-2",
  products: "bg",
  facts: "bg",
  features: "bg",
  quotes: "bg",
  contact: "bg",
  cta: "ink",
};
export const surfaceOf = (s: LandingSection): Surface =>
  s.type === "hero" ? (s.config.variant === "split" ? "bg" : "image") : SURFACE[s.type];

const ALWAYS_HEAD = new Set<LandingSection["type"]>(["hero", "cta", "story", "text_block", "contact", "video"]);
export function hasHead(s: LandingSection): boolean {
  if (ALWAYS_HEAD.has(s.type)) return true;
  if (s.type === "facts") return false;
  return headText(s);
}

export interface PlannedSection {
  section: LandingSection;
  /** Draws content (false = only the editor's empty state). */
  drawn: boolean;
  /** Its title is the page's single <h1>. */
  h1: boolean;
  /** First drawn section — images load eagerly. */
  first: boolean;
  /** Joins the previous drawn section (no top padding). */
  joined: boolean;
}

/** Sort key of stored sections: `order_index`, then position. */
const visibleSorted = (sections: LandingSection[]) =>
  sections
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.is_visible)
    .sort((a, b) => a.s.order_index - b.s.order_index || a.i - b.i)
    .map(({ s }) => s);

/** Normalizes stored sections and decides, once, what each of them draws. */
export function planPage(raw: readonly unknown[], resolveHref?: ResolveHref): PlannedSection[] {
  const sections = visibleSorted(
    (Array.isArray(raw) ? raw : []).map(normalizeSection).filter((s): s is LandingSection => !!s),
  );
  let prev: LandingSection | null = null;
  let h1Used = false;
  let firstUsed = false;
  return sections.map((section) => {
    const drawn = hasContent(section, resolveHref);
    const h1 = drawn && !h1Used && !!sectionTitle(section);
    const joined = drawn && !!prev && !hasHead(section) && surfaceOf(section) === surfaceOf(prev);
    const first = drawn && !firstUsed;
    if (drawn) {
      prev = section;
      firstUsed = true;
      if (h1) h1Used = true;
    }
    return { section, drawn, h1, first, joined };
  });
}

/** Legacy CTA behind a button / card (hosts with only `onCtaClick`). */
export { legacyCtaOf };
