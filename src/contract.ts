/**
 * Page file contract (concept §12.1, §12.6) — the `data-go4-*` attributes the
 * package draws in file mode (`renderPageFile`) and the server reads back
 * (`parsePageFile` in the admin app). No React: the server imports it from
 * `./data`. Changing a name here, a `g4mp-*` class or the meaning of a value is
 * a new `CONTRACT_VERSION`; the contract test freezes both lists.
 */
import { SECTION_CATALOG, TEXT_LIMITS } from "./catalog";
import type { CatalogEntry, CatalogField } from "./catalog";
import type { LandingLink, LandingSection } from "./types";

/** Version of the page file contract — classes, `data-go4-*` attributes, file format. */
export const CONTRACT_VERSION = 1;

/** Attributes of the page, sections, fields, items, media and links. */
export const FILE_ATTR = {
  page: "data-go4-page",
  format: "data-go4-format",
  section: "data-go4-section",
  hidden: "data-go4-hidden",
  field: "data-go4-field",
  item: "data-go4-item",
  mediaId: "data-go4-media-id",
  mobileMediaId: "data-go4-mobile-media-id",
  sourceMediaId: "data-go4-source-media-id",
  linkKind: "data-go4-link-kind",
  linkId: "data-go4-link-id",
  /** Decoration the import skips (exit mark, numbering). */
  ignore: "data-go4-ignore",
} as const;

/**
 * Every `g4mp-*` class the package draws or styles (sorted) — the selectors a
 * brand's own CSS may target (E11). Frozen by the contract test.
 */
export const CONTRACT_CLASSES: readonly string[] = [
  "g4mp", "g4mp--mobile", "g4mp-body", "g4mp-btn", "g4mp-btn--outline", "g4mp-btn--outline-dark",
  "g4mp-btn--primary", "g4mp-btns", "g4mp-card", "g4mp-card--link", "g4mp-card__fallback", "g4mp-card__img",
  "g4mp-card__overlay", "g4mp-card__sub", "g4mp-card__title", "g4mp-cards", "g4mp-cards__grid",
  "g4mp-cards__grid--2", "g4mp-cards__grid--3", "g4mp-cards__grid--4", "g4mp-cards__grid--tall",
  "g4mp-cards__head", "g4mp-collections", "g4mp-contact", "g4mp-contact__copy", "g4mp-contact__grid",
  "g4mp-contact__item", "g4mp-contact__label", "g4mp-contact__list", "g4mp-contact__value", "g4mp-cta",
  "g4mp-cta__body", "g4mp-cta__inner", "g4mp-cta__sub", "g4mp-cta__title", "g4mp-empty", "g4mp-empty__box",
  "g4mp-empty__field", "g4mp-empty__type", "g4mp-ext", "g4mp-eyebrow", "g4mp-fact", "g4mp-fact__label",
  "g4mp-fact__value", "g4mp-facts", "g4mp-facts__list", "g4mp-faq", "g4mp-faq__a", "g4mp-faq__inner",
  "g4mp-faq__item", "g4mp-faq__list", "g4mp-faq__q", "g4mp-faq__qt", "g4mp-faq__sign", "g4mp-feature",
  "g4mp-feature--media", "g4mp-feature__body", "g4mp-feature__img", "g4mp-feature__no", "g4mp-feature__text",
  "g4mp-feature__title", "g4mp-features", "g4mp-features__list", "g4mp-features__list--2",
  "g4mp-features__list--3", "g4mp-grid", "g4mp-grid__cap", "g4mp-grid__cell", "g4mp-grid__fig",
  "g4mp-grid__head", "g4mp-grid__items", "g4mp-grid__items--1", "g4mp-grid__items--2", "g4mp-grid__items--3",
  "g4mp-grid__items--captions", "g4mp-grid__subcap", "g4mp-head", "g4mp-head--left", "g4mp-hero",
  "g4mp-hero-split", "g4mp-hero-split__body", "g4mp-hero-split__copy", "g4mp-hero-split__grid",
  "g4mp-hero-split__img", "g4mp-hero-split__media", "g4mp-hero-split__title", "g4mp-hero__body",
  "g4mp-hero__box", "g4mp-hero__fallback", "g4mp-hero__img", "g4mp-hero__inner", "g4mp-hero__scrim",
  "g4mp-img", "g4mp-inner", "g4mp-link", "g4mp-logo", "g4mp-logos", "g4mp-logos__link", "g4mp-logos__list",
  "g4mp-logos__title", "g4mp-product", "g4mp-product__cat", "g4mp-product__frame", "g4mp-product__img",
  "g4mp-product__name", "g4mp-products", "g4mp-products__grid", "g4mp-quote", "g4mp-quote--solo",
  "g4mp-quote__avatar", "g4mp-quote__by", "g4mp-quote__name", "g4mp-quote__role", "g4mp-quote__text",
  "g4mp-quotes", "g4mp-quotes__grid", "g4mp-quotes__grid--2", "g4mp-quotes__grid--3", "g4mp-rich",
  "g4mp-section", "g4mp-section--joined", "g4mp-story", "g4mp-story--left", "g4mp-story__copy",
  "g4mp-story__grid", "g4mp-story__img", "g4mp-story__media", "g4mp-subtitle", "g4mp-text",
  "g4mp-text__inner", "g4mp-title", "g4mp-video", "g4mp-video__caption", "g4mp-video__frame",
  "g4mp-video__inner",
];

/** Field name of a button element (`buttons[]`). */
export const BUTTON_FIELD = "button";

/** Section option attribute: `image_side` → `data-go4-image-side`, `show.email` → `data-go4-show-email`. */
export const optionAttr = (key: string) => `data-go4-${key.replace(/[._]/g, "-")}`;

/** Section options carried as attributes: layout and fields that are not text or media. */
const OPTION_KINDS = new Set<CatalogField["kind"]>(["choice", "toggle", "number", "collection"]);
export const optionFields = (entry: CatalogEntry): CatalogField[] => entry.fields.filter((f) => OPTION_KINDS.has(f.kind));

/** Attribute with the ordered id list of a From-go4 section (`data-go4-collections`, `data-go4-products`). */
export const itemListAttr = (entry: CatalogEntry): string | undefined => {
  const f = entry.items?.fields;
  return f && f.length === 1 && (f[0].kind === "collection" || f[0].kind === "product")
    ? `data-go4-${entry.resolved}`
    : undefined;
};

/** Every `data-go4-*` attribute of the contract (sorted) — frozen by the contract test. */
export const CONTRACT_ATTRIBUTES: readonly string[] = (() => {
  const names = new Set<string>(Object.values(FILE_ATTR));
  for (const e of SECTION_CATALOG) {
    if (e.variants) names.add(optionAttr("variant"));
    for (const f of optionFields(e)) names.add(optionAttr(f.key));
    const list = itemListAttr(e);
    if (list) names.add(list);
  }
  return [...names].sort();
})();

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

/** Value of a section option from a normalized config (`show.email` reads `show.email`). */
function optionValue(config: Record<string, unknown>, key: string): unknown {
  let v: unknown = config;
  for (const part of key.split(".")) {
    v = v && typeof v === "object" && own(v as object, part) ? (v as Record<string, unknown>)[part] : undefined;
  }
  return v;
}

/** Attributes of a `<section>` in file mode, from a normalized section. Values come from closed lists. */
export function sectionFileAttrs(section: LandingSection, hidden: boolean): Record<string, string> {
  const entry = SECTION_CATALOG.find((e) => e.type === section.type);
  const out: Record<string, string> = { [FILE_ATTR.section]: section.type };
  if (hidden) out[FILE_ATTR.hidden] = "";
  if (!entry) return out;
  const config = section.config as Record<string, unknown>;
  if (entry.variants && typeof config.variant === "string") out[optionAttr("variant")] = config.variant;
  for (const f of optionFields(entry)) {
    const v = optionValue(config, f.key);
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") out[optionAttr(f.key)] = String(v);
  }
  const list = itemListAttr(entry);
  if (list && entry.items) {
    const key = entry.items.fields[0].key as "collection_id" | "product_id";
    const ids = (section.config.items ?? []).map((i) => i[key]).filter((id): id is string => typeof id === "string");
    if (ids.length) out[list] = ids.join(",");
  }
  return out;
}

/** Attributes of an `<a>` in file mode: the registry target (external: the kind only, the address is `href`). */
export function linkFileAttrs(link: LandingLink | null | undefined): Record<string, string> {
  if (!link) return {};
  const out: Record<string, string> = { [FILE_ATTR.linkKind]: String(link.kind) };
  if (link.kind !== "external" && typeof link.id === "string") out[FILE_ATTR.linkId] = link.id;
  return out;
}

/* ── instruction for the AI (concept §12.7) ───────────────────────────────── */

const KIND_NOTE: Partial<Record<CatalogField["kind"], string>> = {
  richtext: "formatted text",
  image: "image from the library",
  media: "image or video from the library",
  video: "video from the library",
};

function describeField(f: CatalogField): string {
  const note = KIND_NOTE[f.kind];
  const limit = f.maxChars ? ` max ${f.maxChars} chars` : "";
  return `${f.key}${note ? ` (${note})` : ""}${limit}`;
}

function describeEntry(e: CatalogEntry): string {
  const parts: string[] = [];
  const contentFields = e.fields.filter((f) => !OPTION_KINDS.has(f.kind) && !["alt", "label", "link"].includes(f.key));
  if (contentFields.length) parts.push(`fields: ${contentFields.map(describeField).join(", ")}`);
  if (e.buttons) parts.push(`buttons ${e.buttons.min} to ${e.buttons.max} (label max ${TEXT_LIMITS.buttonLabel} chars)`);
  const options: string[] = [];
  if (e.variants) options.push(`${optionAttr("variant")}: ${e.variants.join(" | ")}`);
  for (const f of optionFields(e)) {
    options.push(`${optionAttr(f.key)}${f.options ? `: ${f.options.join(" | ")}` : f.kind === "toggle" ? ": true | false" : f.kind === "number" ? ": number" : ": id"}`);
  }
  const list = itemListAttr(e);
  if (list) options.push(`${list}: ids separated by commas, in display order`);
  if (options.length) parts.push(`options: ${options.join("; ")}`);
  if (e.items && !list) {
    const fields = e.items.fields.filter((f) => f.key !== "alt").map(describeField).join(", ");
    parts.push(`items ${e.items.min} to ${e.items.max}: ${fields}`);
  }
  const from = e.resolved ? " Content comes from go4 data; only the title, text and options are read." : "";
  return `- ${e.type} (${e.group}). ${parts.join(". ")}.${from}`;
}

/**
 * Fixed instruction at the top of the page file — generated from the catalog,
 * never from page content or brand data, so content cannot pose as instructions.
 */
export function pageFileInstructions(): string {
  const lines = [
    `go4 landing page file, format ${CONTRACT_VERSION}.`,
    "",
    "This file is one landing page of a brand on go4, written as HTML. Edit it with an AI",
    "assistant and import it back in go4 (Code, Import). go4 reads the page back into its",
    "components and saves it as a draft; it never stores or shows this HTML.",
    "",
    "You may:",
    "- change the text of elements with data-go4-field;",
    "- use bold, italic, underline, paragraphs and line breaks in formatted text",
    "  (strong, em, u, p, br) and links (a) inside it;",
    "- reorder, remove and add sections (data-go4-section) of the components listed below;",
    "  to add one, copy a section of the same component and change its text;",
    "- add and remove items (data-go4-item) within the limits below;",
    "- change the alt text of images and reorder ids in the option lists.",
    "",
    "Do not:",
    "- change or remove data-go4 attributes, ids or file addresses;",
    "- add images from other addresses or paste image data: images come only from the",
    "  brand's media library in go4 (data-go4-media-id); upload new images there;",
    "- add scripts, styles, classes, forms, frames or other markup: import ignores them;",
    "- write content for sections that show go4 data (collections, products, contact).",
    "",
    "Links: a link to go4 content keeps data-go4-link-kind and data-go4-link-id. A link to",
    "another website is a plain a href with https, mailto or tel; go4 asks to confirm every",
    "new external link after import.",
    "",
    "Text over its limit is imported with a warning and must be shortened before publishing.",
    "Items over the maximum are dropped.",
    "",
    "Components (data-go4-section):",
    ...SECTION_CATALOG.map(describeEntry),
  ];
  // A comment cannot contain "--": it would end or break the HTML comment.
  return lines.join("\n").replace(/-{2,}/g, "-");
}
