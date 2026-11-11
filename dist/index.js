"use client";

// src/MarketingPage.tsx
import { Fragment as Fragment7 } from "react";

// src/catalog.ts
var TEXT_LIMITS = {
  eyebrow: 80,
  title: 80,
  subtitle: 120,
  body: 600,
  heroBody: 300,
  buttonLabel: 30,
  alt: 125
};
var CATALOG_GROUPS = ["Opening", "Content", "Media", "From go4", "Trust"];
var L = TEXT_LIMITS;
var f = (key, kind, maxChars, options) => ({ key, kind, ...maxChars ? { maxChars } : {}, ...options ? { options } : {} });
var title = f("title", "text", L.title);
var subtitle = f("subtitle", "text", L.subtitle);
var body = f("body", "richtext", L.body);
var alt = f("alt", "text", L.alt);
var buttonLabel = f("label", "text", L.buttonLabel);
var CATALOG_VERSION = 1;
var SECTION_CATALOG = [
  {
    type: "hero",
    group: "Opening",
    variants: ["cover", "split"],
    fields: [f("eyebrow", "text", L.eyebrow), title, f("body", "richtext", L.heroBody), f("media", "media"), alt, buttonLabel, f("link", "link")],
    buttons: { min: 0, max: 2 },
    crops: { cover: { desktop: "21:9", mobile: "4:5" }, split: { desktop: "4:5", mobile: "4:5" } }
  },
  {
    type: "cta",
    group: "Opening",
    fields: [title, body, buttonLabel, f("link", "link")],
    buttons: { min: 1, max: 2 }
  },
  {
    type: "text_block",
    group: "Content",
    fields: [title, subtitle, body, buttonLabel, f("link", "link")],
    buttons: { min: 0, max: 1 }
  },
  {
    type: "story",
    group: "Content",
    fields: [title, subtitle, body, f("media", "image"), alt, f("image_side", "choice", void 0, ["right", "left"]), buttonLabel, f("link", "link")],
    buttons: { min: 0, max: 1 },
    crops: { image: { desktop: "4:3", mobile: "4:3" } }
  },
  {
    type: "cards",
    group: "Content",
    fields: [title, subtitle, body],
    items: { min: 2, max: 4, fields: [f("media", "image"), alt, title, f("body", "text"), f("link", "link")] },
    crops: { image: { desktop: "2:3", mobile: "2:3" } }
  },
  {
    type: "faq",
    group: "Content",
    fields: [title],
    items: { min: 2, max: 12, fields: [f("question", "text"), f("answer", "richtext", L.body)] }
  },
  {
    type: "gallery",
    group: "Media",
    fields: [title, body],
    items: { min: 1, max: 12, fields: [f("media", "image"), alt, f("caption", "text"), f("subcaption", "text")] },
    crops: { one: { desktop: "21:9", mobile: "16:9" }, many: { desktop: "1:1", mobile: "1:1" } },
    legacyTypes: ["team", "materials"]
  },
  {
    type: "video",
    group: "Media",
    fields: [f("media", "video"), title, f("caption", "text")],
    crops: { poster: { desktop: "16:9", mobile: "16:9" } }
  },
  {
    type: "collections",
    group: "From go4",
    fields: [title, f("mode", "choice", void 0, ["all", "selected"]), f("limit", "number"), f("show_shipping", "toggle")],
    items: { min: 1, max: 12, fields: [f("collection_id", "collection")] },
    crops: { cover: { desktop: "2:3", mobile: "2:3" } },
    resolved: "collections"
  },
  {
    type: "products",
    group: "From go4",
    fields: [title, subtitle, f("mode", "choice", void 0, ["selected", "collection"]), f("collection_id", "collection"), f("limit", "number")],
    items: { min: 2, max: 8, fields: [f("product_id", "product")] },
    crops: { image: { desktop: "4:5", mobile: "4:5" } },
    resolved: "products"
  },
  {
    type: "contact",
    group: "From go4",
    fields: [title, body, f("show.address", "toggle"), f("show.email", "toggle"), f("show.website", "toggle"), f("show.instagram", "toggle")],
    resolved: "contact"
  },
  {
    type: "facts",
    group: "Trust",
    fields: [],
    items: { min: 2, max: 4, fields: [f("value", "text"), f("label", "text")] }
  },
  {
    type: "features",
    group: "Trust",
    fields: [title],
    items: { min: 2, max: 6, fields: [title, f("body", "richtext", L.body), f("media", "image"), alt] },
    crops: { image: { desktop: "3:2", mobile: "3:2" } }
  },
  {
    type: "quotes",
    group: "Trust",
    fields: [title],
    items: { min: 1, max: 6, fields: [f("text", "richtext", L.body), f("author", "text"), f("role", "text"), f("avatar", "image"), alt] },
    crops: { avatar: { desktop: "1:1", mobile: "1:1" } }
  },
  {
    type: "logos",
    group: "Trust",
    fields: [title],
    items: { min: 3, max: 12, fields: [f("media", "image"), f("name", "text", L.alt), f("link", "link")] }
  }
];
var catalogEntry = (type) => SECTION_CATALOG.find((e) => e.type === type);

// src/contract.ts
var CONTRACT_VERSION = 1;
var FILE_ATTR = {
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
  ignore: "data-go4-ignore"
};
var CONTRACT_CLASSES = [
  "g4mp",
  "g4mp--mobile",
  "g4mp-body",
  "g4mp-btn",
  "g4mp-btn--outline",
  "g4mp-btn--outline-dark",
  "g4mp-btn--primary",
  "g4mp-btns",
  "g4mp-card",
  "g4mp-card--link",
  "g4mp-card__fallback",
  "g4mp-card__img",
  "g4mp-card__overlay",
  "g4mp-card__sub",
  "g4mp-card__title",
  "g4mp-cards",
  "g4mp-cards__grid",
  "g4mp-cards__grid--2",
  "g4mp-cards__grid--3",
  "g4mp-cards__grid--4",
  "g4mp-cards__grid--tall",
  "g4mp-cards__head",
  "g4mp-collections",
  "g4mp-contact",
  "g4mp-contact__copy",
  "g4mp-contact__grid",
  "g4mp-contact__item",
  "g4mp-contact__label",
  "g4mp-contact__list",
  "g4mp-contact__value",
  "g4mp-cta",
  "g4mp-cta__body",
  "g4mp-cta__inner",
  "g4mp-cta__sub",
  "g4mp-cta__title",
  "g4mp-empty",
  "g4mp-empty__box",
  "g4mp-empty__field",
  "g4mp-empty__type",
  "g4mp-ext",
  "g4mp-eyebrow",
  "g4mp-fact",
  "g4mp-fact__label",
  "g4mp-fact__value",
  "g4mp-facts",
  "g4mp-facts__list",
  "g4mp-faq",
  "g4mp-faq__a",
  "g4mp-faq__inner",
  "g4mp-faq__item",
  "g4mp-faq__list",
  "g4mp-faq__q",
  "g4mp-faq__qt",
  "g4mp-faq__sign",
  "g4mp-feature",
  "g4mp-feature--media",
  "g4mp-feature__body",
  "g4mp-feature__img",
  "g4mp-feature__no",
  "g4mp-feature__text",
  "g4mp-feature__title",
  "g4mp-features",
  "g4mp-features__list",
  "g4mp-features__list--2",
  "g4mp-features__list--3",
  "g4mp-grid",
  "g4mp-grid__cap",
  "g4mp-grid__cell",
  "g4mp-grid__fig",
  "g4mp-grid__head",
  "g4mp-grid__items",
  "g4mp-grid__items--1",
  "g4mp-grid__items--2",
  "g4mp-grid__items--3",
  "g4mp-grid__items--captions",
  "g4mp-grid__subcap",
  "g4mp-head",
  "g4mp-head--left",
  "g4mp-hero",
  "g4mp-hero-split",
  "g4mp-hero-split__body",
  "g4mp-hero-split__copy",
  "g4mp-hero-split__grid",
  "g4mp-hero-split__img",
  "g4mp-hero-split__media",
  "g4mp-hero-split__title",
  "g4mp-hero__body",
  "g4mp-hero__box",
  "g4mp-hero__fallback",
  "g4mp-hero__img",
  "g4mp-hero__inner",
  "g4mp-hero__scrim",
  "g4mp-img",
  "g4mp-inner",
  "g4mp-link",
  "g4mp-logo",
  "g4mp-logos",
  "g4mp-logos__link",
  "g4mp-logos__list",
  "g4mp-logos__title",
  "g4mp-product",
  "g4mp-product__cat",
  "g4mp-product__frame",
  "g4mp-product__img",
  "g4mp-product__name",
  "g4mp-products",
  "g4mp-products__grid",
  "g4mp-quote",
  "g4mp-quote--solo",
  "g4mp-quote__avatar",
  "g4mp-quote__by",
  "g4mp-quote__name",
  "g4mp-quote__role",
  "g4mp-quote__text",
  "g4mp-quotes",
  "g4mp-quotes__grid",
  "g4mp-quotes__grid--2",
  "g4mp-quotes__grid--3",
  "g4mp-rich",
  "g4mp-section",
  "g4mp-section--joined",
  "g4mp-story",
  "g4mp-story--left",
  "g4mp-story__copy",
  "g4mp-story__grid",
  "g4mp-story__img",
  "g4mp-story__media",
  "g4mp-subtitle",
  "g4mp-text",
  "g4mp-text__inner",
  "g4mp-title",
  "g4mp-video",
  "g4mp-video__caption",
  "g4mp-video__frame",
  "g4mp-video__inner"
];
var BUTTON_FIELD = "button";
var optionAttr = (key) => `data-go4-${key.replace(/[._]/g, "-")}`;
var OPTION_KINDS = /* @__PURE__ */ new Set(["choice", "toggle", "number", "collection"]);
var optionFields = (entry) => entry.fields.filter((f2) => OPTION_KINDS.has(f2.kind));
var itemListAttr = (entry) => {
  const f2 = entry.items?.fields;
  return f2 && f2.length === 1 && (f2[0].kind === "collection" || f2[0].kind === "product") ? `data-go4-${entry.resolved}` : void 0;
};
var CONTRACT_ATTRIBUTES = (() => {
  const names = new Set(Object.values(FILE_ATTR));
  for (const e of SECTION_CATALOG) {
    if (e.variants) names.add(optionAttr("variant"));
    for (const f2 of optionFields(e)) names.add(optionAttr(f2.key));
    const list = itemListAttr(e);
    if (list) names.add(list);
  }
  return [...names].sort();
})();
var own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
function optionValue(config, key) {
  let v = config;
  for (const part of key.split(".")) {
    v = v && typeof v === "object" && own(v, part) ? v[part] : void 0;
  }
  return v;
}
function sectionFileAttrs(section, hidden) {
  const entry = SECTION_CATALOG.find((e) => e.type === section.type);
  const out = { [FILE_ATTR.section]: section.type };
  if (hidden) out[FILE_ATTR.hidden] = "";
  if (!entry) return out;
  const config = section.config;
  if (entry.variants && typeof config.variant === "string") out[optionAttr("variant")] = config.variant;
  for (const f2 of optionFields(entry)) {
    const v = optionValue(config, f2.key);
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") out[optionAttr(f2.key)] = String(v);
  }
  const list = itemListAttr(entry);
  if (list && entry.items) {
    const key = entry.items.fields[0].key;
    const ids = (section.config.items ?? []).map((i) => i[key]).filter((id) => typeof id === "string");
    if (ids.length) out[list] = ids.join(",");
  }
  return out;
}
function linkFileAttrs(link) {
  if (!link) return {};
  const out = { [FILE_ATTR.linkKind]: String(link.kind) };
  if (link.kind !== "external" && typeof link.id === "string") out[FILE_ATTR.linkId] = link.id;
  return out;
}
var KIND_NOTE = {
  richtext: "formatted text",
  image: "image from the library",
  media: "image or video from the library",
  video: "video from the library"
};
function describeField(f2) {
  const note = KIND_NOTE[f2.kind];
  const limit = f2.maxChars ? ` max ${f2.maxChars} chars` : "";
  return `${f2.key}${note ? ` (${note})` : ""}${limit}`;
}
function describeEntry(e) {
  const parts = [];
  const contentFields = e.fields.filter((f2) => !OPTION_KINDS.has(f2.kind) && !["alt", "label", "link"].includes(f2.key));
  if (contentFields.length) parts.push(`fields: ${contentFields.map(describeField).join(", ")}`);
  if (e.buttons) parts.push(`buttons ${e.buttons.min} to ${e.buttons.max} (label max ${TEXT_LIMITS.buttonLabel} chars)`);
  const options = [];
  if (e.variants) options.push(`${optionAttr("variant")}: ${e.variants.join(" | ")}`);
  for (const f2 of optionFields(e)) {
    options.push(`${optionAttr(f2.key)}${f2.options ? `: ${f2.options.join(" | ")}` : f2.kind === "toggle" ? ": true | false" : f2.kind === "number" ? ": number" : ": id"}`);
  }
  const list = itemListAttr(e);
  if (list) options.push(`${list}: ids separated by commas, in display order`);
  if (options.length) parts.push(`options: ${options.join("; ")}`);
  if (e.items && !list) {
    const fields = e.items.fields.filter((f2) => f2.key !== "alt").map(describeField).join(", ");
    parts.push(`items ${e.items.min} to ${e.items.max}: ${fields}`);
  }
  const from = e.resolved ? " Content comes from go4 data; only the title, text and options are read." : "";
  return `- ${e.type} (${e.group}). ${parts.join(". ")}.${from}`;
}
function pageFileInstructions() {
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
    ...SECTION_CATALOG.map(describeEntry)
  ];
  return lines.join("\n").replace(/-{2,}/g, "-");
}

// src/labels.ts
var DEFAULT_LABELS = {
  /** Component names — the empty state in `editorMode`. */
  sections: {
    hero: "Hero",
    text_block: "Text",
    story: "Image and text",
    gallery: "Gallery",
    video: "Video",
    cards: "Cards",
    collections: "Collections",
    products: "Products",
    facts: "Key facts",
    features: "Features",
    quotes: "Quotes",
    logos: "Logos",
    faq: "FAQ",
    cta: "Call to action",
    contact: "Contact"
  },
  /** Field names — the missing field in the empty state. */
  fields: {
    title: "Title",
    media: "Image",
    button: "Button"
  },
  /** Collection tile: `{date}` is the shipping text served by the host. */
  shipping: "Shipping: from {date}",
  /** Collection tile: number of styles. */
  styles: { one: "{n} style", other: "{n} styles" },
  /** Contact section row labels. */
  contact: {
    address: "Address",
    email: "E-mail",
    website: "Website",
    instagram: "Instagram"
  }
};
function mergeLabels(input) {
  if (!input) return DEFAULT_LABELS;
  const pickStr = (v, d) => typeof v === "string" ? v : d;
  const group = (d, v) => {
    const out = { ...d };
    if (v && typeof v === "object") {
      for (const k of Object.keys(d)) {
        if (Object.prototype.hasOwnProperty.call(v, k)) out[k] = pickStr(v[k], d[k]);
      }
    }
    return out;
  };
  return {
    sections: group(DEFAULT_LABELS.sections, input.sections),
    fields: group(DEFAULT_LABELS.fields, input.fields),
    shipping: pickStr(input.shipping, DEFAULT_LABELS.shipping),
    styles: group(DEFAULT_LABELS.styles, input.styles),
    contact: group(DEFAULT_LABELS.contact, input.contact)
  };
}
var fill = (template, values) => template.replace(
  /\{(\w+)\}/g,
  (m, k) => Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m
);

// src/sanitizeUrl.ts
var UNSAFE_CHARS = /[\x00-\x20\x7f-\x9f<>"'`\\]/;
function safeHref(url) {
  if (!url) return void 0;
  const t = url.trim();
  if (!t || UNSAFE_CHARS.test(t)) return void 0;
  if (/^https?:\/\//i.test(t)) {
    try {
      const u = new URL(t);
      if (u.username || u.password) return void 0;
      if (u.protocol !== "http:" && u.protocol !== "https:") return void 0;
      return t;
    } catch {
      return void 0;
    }
  }
  if (/^mailto:/i.test(t)) {
    return /^mailto:[^\s?&#@:/]+@[^\s?&#@:/]+$/i.test(t) ? t : void 0;
  }
  if (/^tel:/i.test(t)) {
    return /^tel:\+?[0-9]{3,20}$/.test(t) ? t : void 0;
  }
  if (t.startsWith("/") && !t.startsWith("//") && !t.startsWith("/\\")) return t;
  return void 0;
}
function safeImgSrc(url) {
  if (!url) return void 0;
  const t = url.trim();
  if (/^data:image\/(png|jpe?g|gif|webp|avif);base64,[A-Za-z0-9+/=]+$/i.test(t)) return t;
  if (UNSAFE_CHARS.test(t)) return void 0;
  if (/^https?:\/\//i.test(t)) {
    try {
      const u = new URL(t);
      return u.username || u.password ? void 0 : t;
    } catch {
      return void 0;
    }
  }
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  return void 0;
}
function safeDimension(n) {
  return typeof n === "number" && Number.isFinite(n) && n > 0 && n < 2e4 ? Math.round(n) : void 0;
}
var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(v) {
  return typeof v === "string" && UUID.test(v);
}
function safeExternalUrl(url) {
  const href = safeHref(url);
  if (!href) return void 0;
  return /^(https?:\/\/|mailto:|tel:)/i.test(href) ? href : void 0;
}

// src/links.ts
var ALL_COLLECTIONS_URL = /^\/?(?:[^?#]*\/)?order\?collection=all$/i;
var LANDING_LINK_KINDS = [
  "catalog",
  "collection",
  "product",
  "portal_view",
  "external",
  "login",
  "register"
];
var PORTAL_VIEW_KEY = /^[a-z0-9][a-z0-9_-]{0,63}$/;
var own2 = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
function normalizeLink(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw;
  const kind = own2(r, "kind") ? r.kind : void 0;
  if (typeof kind !== "string" || !LANDING_LINK_KINDS.includes(kind)) return null;
  const out = { kind };
  const id = own2(r, "id") ? r.id : void 0;
  if (kind === "collection" || kind === "product") {
    if (!isUuid(id)) return null;
    out.id = id.toLowerCase();
  } else if (kind === "portal_view") {
    if (typeof id !== "string" || !PORTAL_VIEW_KEY.test(id)) return null;
    out.id = id;
  } else if (kind === "external") {
    const url = safeHref(typeof r.url === "string" ? r.url : null);
    if (!url || !own2(r, "url")) return null;
    out.url = url;
  }
  if (own2(r, "path") && typeof r.path === "string") out.path = r.path;
  if (own2(r, "available") && typeof r.available === "boolean") out.available = r.available;
  if (own2(r, "reason") && typeof r.reason === "string") out.reason = r.reason;
  return out;
}
function ctaLink(cta) {
  if (!cta) return null;
  if (cta.link && typeof cta.link === "object" && typeof cta.link.kind === "string") {
    return cta.link;
  }
  switch (cta.type) {
    case "order_form":
      return { kind: "catalog" };
    case "collection":
      return cta.collection_id ? { kind: "collection", id: cta.collection_id } : null;
    case "external_link": {
      const url = cta.url?.trim();
      if (!url) return null;
      if (ALL_COLLECTIONS_URL.test(url)) return { kind: "catalog" };
      return { kind: "external", url };
    }
    default:
      return null;
  }
}
function legacyCta(button) {
  const { label, link } = button;
  if (!link) return { label };
  switch (link.kind) {
    case "catalog":
      return { label, type: "order_form", link };
    case "collection":
      return { label, type: "collection", collection_id: link.id ?? null, link };
    case "external":
      return { label, type: "external_link", url: link.url ?? null, link };
    default:
      return { label, link };
  }
}

// src/richText.ts
var own3 = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
function normalizeFragment(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw;
  const text = own3(r, "text") ? r.text : void 0;
  if (typeof text !== "string" || text === "") return null;
  const f2 = { text };
  if (own3(r, "bold") && r.bold === true) f2.bold = true;
  if (own3(r, "italic") && r.italic === true) f2.italic = true;
  if (own3(r, "underline") && r.underline === true) f2.underline = true;
  const link = own3(r, "link") ? normalizeLink(r.link) : null;
  if (link) f2.link = link;
  return f2;
}
function normalizeRichText(raw) {
  if (typeof raw === "string") return raw.trim() ? raw : void 0;
  if (!Array.isArray(raw)) return void 0;
  const paragraphs = [];
  for (const p of raw) {
    const frags = typeof p === "string" ? [{ text: p }] : Array.isArray(p) ? p : [];
    const para = mergeFragments(frags.map(normalizeFragment).filter((f2) => !!f2));
    if (para.some((f2) => f2.text.trim())) paragraphs.push(para);
  }
  return paragraphs.length ? paragraphs : void 0;
}
function hasRichText(v) {
  if (typeof v === "string") return v.trim() !== "";
  return Array.isArray(v) && v.some((p) => p.some((f2) => f2.text.trim() !== ""));
}
function richTextPlain(v) {
  if (typeof v === "string") return v;
  if (!Array.isArray(v)) return "";
  return v.map((p) => p.map((f2) => f2.text).join("")).join("\n\n");
}
function richParagraphs(v) {
  if (typeof v === "string") {
    return v.split(/\n[ \t]*\n/).map((p) => p.replace(/^\n+|\n+$/g, "")).filter((p) => p.trim()).map((text) => [{ text }]);
  }
  return Array.isArray(v) ? v : [];
}
var sameLink = (a, b) => a === b || !!a && !!b && a.kind === b.kind && (a.id ?? null) === (b.id ?? null) && (a.url ?? null) === (b.url ?? null);
var sameMarks = (a, b) => !!a.bold === !!b.bold && !!a.italic === !!b.italic && !!a.underline === !!b.underline && sameLink(a.link, b.link);
function mergeFragments(frags) {
  const out = [];
  for (const f2 of frags) {
    const last = out[out.length - 1];
    if (last && sameMarks(last, f2)) out[out.length - 1] = { ...last, text: last.text + f2.text };
    else out.push({ ...f2 });
  }
  return out;
}
var NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\xA0" };
function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]{1,6}|#[0-9]{1,7}|[a-z]{2,6});/gi, (m, e) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return n > 0 && n <= 1114111 && !(n >= 55296 && n <= 57343) ? String.fromCodePoint(n) : "";
    }
    const k = e.toLowerCase();
    return own3(NAMED, k) ? NAMED[k] : m;
  });
}
var DROP_WITH_CONTENT = /* @__PURE__ */ new Set([
  "script",
  "style",
  "template",
  "noscript",
  "iframe",
  "object",
  "embed",
  "svg",
  "math",
  "textarea",
  "title",
  "select",
  "head",
  "frameset",
  "noembed",
  "noframes",
  "xmp",
  "plaintext"
]);
var BLOCKS = /* @__PURE__ */ new Set([
  "div",
  "section",
  "article",
  "header",
  "footer",
  "main",
  "aside",
  "nav",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "dl",
  "dt",
  "dd",
  "table",
  "tr",
  "td",
  "th",
  "pre",
  "figure",
  "figcaption",
  "address",
  "details",
  "summary",
  "hr"
]);
var MARKS = {
  b: "bold",
  strong: "bold",
  i: "italic",
  em: "italic",
  u: "underline"
};
function parseAttrs(src) {
  const attrs = /* @__PURE__ */ Object.create(null);
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while (m = re.exec(src)) {
    const name = m[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}
function linkFromAttrs(attrs) {
  const kind = attrs["data-go4-link-kind"];
  if (kind && kind !== "external") {
    return normalizeLink({ kind, id: attrs["data-go4-link-id"] });
  }
  const url = safeExternalUrl(attrs["href"]);
  return url ? { kind: "external", url } : null;
}
function richTextFromHtml(html) {
  const src = typeof html === "string" ? html : "";
  const paragraphs = [];
  let current = [];
  const stack = [];
  const marks = () => {
    const f2 = {};
    let link;
    for (const s of stack) {
      const mark = MARKS[s.tag];
      if (mark) f2[mark] = true;
      if (s.tag === "a") link = s.link;
    }
    if (link) f2.link = link;
    return f2;
  };
  let atSpace = true;
  const pushText = (raw) => {
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
    const para = mergeFragments(current.filter((f2) => f2.text !== ""));
    while (para.length && /^\n/.test(para[0].text)) {
      para[0] = { ...para[0], text: para[0].text.replace(/^\n+/, "") };
      if (!para[0].text) para.shift();
    }
    while (para.length && /\n$/.test(para[para.length - 1].text)) {
      const k = para.length - 1;
      para[k] = { ...para[k], text: para[k].text.replace(/\n+$/, "") };
      if (!para[k].text) para.pop();
    }
    if (para.some((f2) => f2.text.trim())) paragraphs.push(para);
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
      pushText("<");
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
    if (tag === "a" || own3(MARKS, tag)) {
      if (closing) {
        for (let k = stack.length - 1; k >= 0; k--) {
          if (stack[k].tag === tag) {
            stack.splice(k, 1);
            break;
          }
        }
      } else {
        stack.push({ tag, link: tag === "a" ? linkFromAttrs(parseAttrs(attrSrc)) : void 0 });
      }
      continue;
    }
  }
  flush();
  return paragraphs;
}
function trimEnd(frags, n) {
  for (let k = frags.length - 1; k >= 0 && n > 0; k--) {
    const f2 = frags[k];
    const cut = Math.min(n, f2.text.length);
    f2.text = f2.text.slice(0, f2.text.length - cut);
    n -= cut;
  }
}
var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var esc = (s) => s.replace(/[&<>"']/g, (c) => ESC[c]);
function linkOpen(link) {
  if (link.kind === "external") {
    const url = safeExternalUrl(link.url);
    return url ? `<a href="${esc(url)}">` : "";
  }
  return `<a data-go4-link-kind="${esc(String(link.kind))}"${link.id ? ` data-go4-link-id="${esc(String(link.id))}"` : ""}>`;
}
function richTextToHtml(value) {
  const paras = richParagraphs(normalizeRichText(value) ?? "");
  return paras.map((p) => {
    const inner = p.map((f2) => {
      let s = esc(f2.text).replace(/\n/g, "<br>");
      if (f2.underline) s = `<u>${s}</u>`;
      if (f2.italic) s = `<em>${s}</em>`;
      if (f2.bold) s = `<strong>${s}</strong>`;
      const open = f2.link ? linkOpen(f2.link) : "";
      return open ? `${open}${s}</a>` : s;
    }).join("");
    return `<p>${inner}</p>`;
  }).join("");
}

// src/normalize.ts
var own4 = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
var isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
var get = (o, k) => isObj(o) && own4(o, k) ? o[k] : void 0;
var arr = (v) => Array.isArray(v) ? v : [];
function str(v) {
  if (typeof v === "string") return v.trim() ? v : void 0;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return void 0;
}
function bool(v) {
  return typeof v === "boolean" ? v : void 0;
}
function int(v, min, max) {
  return typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : void 0;
}
function dim(v) {
  return typeof v === "number" && Number.isFinite(v) && v > 0 && v < 2e4 ? Math.round(v) : void 0;
}
function oneOf(v, list) {
  return typeof v === "string" && list.includes(v) ? v : void 0;
}
function clean(o) {
  for (const k of Object.keys(o)) if (o[k] === void 0) delete o[k];
  return o;
}
var LEGACY_CTA = /* @__PURE__ */ new WeakMap();
var legacyCtaOf = (o) => LEGACY_CTA.get(o);
var SECTION_TYPES = [
  "hero",
  "text_block",
  "story",
  "gallery",
  "video",
  "cards",
  "collections",
  "products",
  "facts",
  "features",
  "quotes",
  "logos",
  "faq",
  "cta",
  "contact"
];
var LEGACY_TYPES = { team: "gallery", materials: "gallery" };
function normalizeMedia(raw) {
  if (!isObj(raw)) return void 0;
  const type = oneOf(get(raw, "media_type"), ["image", "video"]);
  const poster = get(raw, "poster");
  const m = clean({
    media_id: isUuid(get(raw, "media_id")) ? get(raw, "media_id") : void 0,
    source_media_id: isUuid(get(raw, "source_media_id")) ? get(raw, "source_media_id") : void 0,
    mobile_media_id: isUuid(get(raw, "mobile_media_id")) ? get(raw, "mobile_media_id") : void 0,
    media_type: type,
    file_url: safeImgSrc(str(get(raw, "file_url"))),
    mobile_file_url: safeImgSrc(str(get(raw, "mobile_file_url"))),
    alt: str(get(raw, "alt")),
    width: dim(get(raw, "width")),
    height: dim(get(raw, "height")),
    poster_url: safeImgSrc(str(get(raw, "poster_url")) ?? str(get(poster, "file_url")))
  });
  return m.file_url || m.mobile_file_url || m.poster_url ? m : void 0;
}
var isImage = (m) => get(m, "media_type") === "image" || !get(m, "media_type") && !!get(m, "file_url");
function pickLegacyImage(list, roles = []) {
  const byRole = list.find((m) => roles.includes(get(m, "role")));
  return normalizeMedia(byRole ?? list.find(isImage));
}
function mediaField(v, roles) {
  return Array.isArray(v) ? pickLegacyImage(v, roles) : normalizeMedia(v);
}
function normalizeButton(raw) {
  const label = str(get(raw, "label"));
  if (!label) return void 0;
  return { label, link: normalizeLink(get(raw, "link")) };
}
function buttonsField(config, max, legacyCta2) {
  if (own4(config, "buttons")) {
    const list = arr(config.buttons).map(normalizeButton).filter((b) => !!b);
    return list.length ? list.slice(0, max) : void 0;
  }
  const cta = get(config, "cta");
  if (!legacyCta2 || !isObj(cta)) return void 0;
  const label = str(get(cta, "label"));
  if (!label) return void 0;
  const button = { label, link: normalizeLink(ctaLink(cta)) };
  LEGACY_CTA.set(button, cta);
  return [button];
}
function items(v, fn) {
  const out = arr(v).map(fn).filter((x) => x !== void 0);
  return out.length ? out : void 0;
}
var galleryItem = (raw) => {
  if (!isObj(raw)) return void 0;
  const media = own4(raw, "media") ? normalizeMedia(raw.media) : isImage(raw) ? normalizeMedia(raw) : void 0;
  if (!media) return void 0;
  return clean({ media, caption: str(get(raw, "caption")), subcaption: str(get(raw, "subcaption")) });
};
var cardItem = (raw) => {
  if (!isObj(raw)) return void 0;
  const legacy = get(raw, "cta");
  const media = own4(raw, "media") ? normalizeMedia(raw.media) : normalizeMedia({ ...pick(raw, ["file_url", "mobile_file_url", "alt", "width", "height"]), media_type: "image" });
  const link = own4(raw, "link") ? normalizeLink(raw.link) : isObj(legacy) ? normalizeLink(ctaLink(legacy)) : null;
  const item = clean({
    title: str(get(raw, "title")),
    body: str(get(raw, "body")),
    media,
    link: link ?? void 0
  });
  if (!own4(raw, "link") && isObj(legacy)) LEGACY_CTA.set(item, legacy);
  return item.title || item.body || item.media || item.link || LEGACY_CTA.has(item) ? item : void 0;
};
function pick(o, keys) {
  const out = {};
  for (const k of keys) if (own4(o, k)) out[k] = o[k];
  return out;
}
var idItem = (key) => (raw) => {
  const id = get(raw, key);
  return isUuid(id) ? { [key]: id.toLowerCase() } : void 0;
};
var factItem = (raw) => {
  const value = str(get(raw, "value"));
  return value ? clean({ value, label: str(get(raw, "label")) }) : void 0;
};
var featureItem = (raw) => {
  const item = clean({
    title: str(get(raw, "title")),
    body: normalizeRichText(get(raw, "body")),
    media: normalizeMedia(get(raw, "media"))
  });
  return item.title || item.body ? item : void 0;
};
var quoteItem = (raw) => {
  const item = clean({
    text: normalizeRichText(get(raw, "text")),
    author: str(get(raw, "author")),
    role: str(get(raw, "role")),
    avatar: normalizeMedia(get(raw, "avatar"))
  });
  return item.text ? item : void 0;
};
var logoItem = (raw) => {
  const media = normalizeMedia(get(raw, "media"));
  if (!media) return void 0;
  const link = normalizeLink(get(raw, "link"));
  return clean({ name: str(get(raw, "name")), media, link: link ?? void 0 });
};
var faqItem = (raw) => {
  const question = str(get(raw, "question"));
  return question ? clean({ question, answer: normalizeRichText(get(raw, "answer")) }) : void 0;
};
function resolvedCollection(raw) {
  const id = get(raw, "id");
  if (!isUuid(id)) return void 0;
  const link = normalizeLink(get(raw, "link"));
  return clean({
    id: id.toLowerCase(),
    name: str(get(raw, "name")),
    season: str(get(raw, "season")),
    styles: int(get(raw, "styles"), 0, 1e6),
    shipping: str(get(raw, "shipping")),
    cover: normalizeMedia(get(raw, "cover")),
    link: link ?? void 0
  });
}
function resolvedProduct(raw) {
  const id = get(raw, "id");
  if (!isUuid(id)) return void 0;
  const link = normalizeLink(get(raw, "link"));
  return clean({
    id: id.toLowerCase(),
    name: str(get(raw, "name")),
    category: str(get(raw, "category")),
    image: normalizeMedia(get(raw, "image")),
    link: link ?? void 0
  });
}
var INSTAGRAM_HANDLE = /^@?[A-Za-z0-9._]{1,30}$/;
function resolvedContact(raw) {
  if (!isObj(raw)) return void 0;
  const email = str(get(raw, "email"))?.trim();
  const website = str(get(raw, "website"))?.trim();
  const instagram = str(get(raw, "instagram"))?.trim();
  const c = clean({
    address: str(get(raw, "address")),
    email: email && safeHref(`mailto:${email}`) ? email : void 0,
    website: website && safeExternalUrl(/^https?:\/\//i.test(website) ? website : `https://${website}`) ? website : void 0,
    instagram: instagram && INSTAGRAM_HANDLE.test(instagram) ? instagram : void 0
  });
  return Object.keys(c).length ? c : void 0;
}
function normalizeResolved(type, raw) {
  if (!isObj(raw)) return void 0;
  if (type === "collections") {
    const list = items(get(raw, "collections"), resolvedCollection);
    return list ? { collections: list } : void 0;
  }
  if (type === "products") {
    const list = items(get(raw, "products"), resolvedProduct);
    return list ? { products: list } : void 0;
  }
  if (type === "contact") {
    const contact = resolvedContact(get(raw, "contact"));
    return contact ? { contact } : void 0;
  }
  return void 0;
}
function normalizeConfig(type, c, raw, legacyType) {
  const title2 = str(get(c, "title"));
  const subtitle2 = str(get(c, "subtitle"));
  const body2 = normalizeRichText(get(c, "body"));
  switch (type) {
    case "hero":
      return clean({
        variant: oneOf(get(c, "variant") ?? get(raw, "variant"), ["cover", "split"]) ?? "cover",
        // Legacy Hero: subtitle above the title → eyebrow.
        eyebrow: str(get(c, "eyebrow")) ?? subtitle2,
        title: title2,
        body: body2,
        media: mediaField(get(c, "media"), ["hero_image", "background"]),
        buttons: buttonsField(c, 2, true)
      });
    case "text_block":
      return clean({ title: title2, subtitle: subtitle2, body: body2, buttons: buttonsField(c, 1, false) });
    case "story":
      return clean({
        title: title2,
        subtitle: subtitle2,
        body: body2,
        media: mediaField(get(c, "media")),
        buttons: buttonsField(c, 1, false),
        image_side: oneOf(get(c, "image_side"), ["left", "right"])
      });
    case "gallery":
      return clean({
        title: title2,
        subtitle: subtitle2,
        body: body2,
        // Legacy team / materials: every image of `media[]`, in order.
        items: legacyType ? items(arr(get(c, "media")).filter(isImage), galleryItem) : items(get(c, "items"), galleryItem)
      });
    case "video": {
      const media = get(c, "media");
      const video = Array.isArray(media) ? normalizeMedia(media.find((m) => get(m, "media_type") === "video" && get(m, "file_url"))) : normalizeMedia(media);
      return clean({ title: title2, caption: str(get(c, "caption")), media: video?.file_url ? { ...video, media_type: "video" } : void 0 });
    }
    case "cards":
      return clean({ title: title2, subtitle: subtitle2, body: body2, items: items(get(c, "items"), cardItem) });
    case "collections":
      return clean({
        title: title2,
        mode: oneOf(get(c, "mode"), ["all", "selected"]),
        items: items(get(c, "items"), idItem("collection_id")),
        limit: int(get(c, "limit"), 1, 100),
        show_shipping: bool(get(c, "show_shipping"))
      });
    case "products":
      return clean({
        title: title2,
        subtitle: subtitle2,
        mode: oneOf(get(c, "mode"), ["selected", "collection"]),
        items: items(get(c, "items"), idItem("product_id")),
        collection_id: isUuid(get(c, "collection_id")) ? get(c, "collection_id").toLowerCase() : void 0,
        limit: int(get(c, "limit"), 1, 100)
      });
    case "facts":
      return clean({ items: items(get(c, "items"), factItem) });
    case "features":
      return clean({ title: title2, items: items(get(c, "items"), featureItem) });
    case "quotes":
      return clean({ title: title2, items: items(get(c, "items"), quoteItem) });
    case "logos":
      return clean({ title: title2, items: items(get(c, "items"), logoItem) });
    case "faq":
      return clean({ title: title2, items: items(get(c, "items"), faqItem) });
    case "cta":
      return clean({ title: title2, subtitle: subtitle2, body: body2, buttons: buttonsField(c, 2, true) });
    case "contact": {
      const show = get(c, "show");
      const toggles = clean({
        address: bool(get(show, "address")),
        email: bool(get(show, "email")),
        website: bool(get(show, "website")),
        instagram: bool(get(show, "instagram"))
      });
      return clean({ title: title2, body: body2, show: Object.keys(toggles).length ? toggles : void 0 });
    }
  }
}
function normalizeSection(raw) {
  if (!isObj(raw)) return null;
  const rawType = get(raw, "type");
  if (typeof rawType !== "string") return null;
  const legacyType = own4(LEGACY_TYPES, rawType);
  const type = legacyType ? LEGACY_TYPES[rawType] : oneOf(rawType, SECTION_TYPES);
  if (!type) return null;
  const config = normalizeConfig(type, isObj(raw.config) ? raw.config : {}, raw, legacyType);
  const id = get(raw, "id");
  const order = get(raw, "order_index");
  const section = {
    id: typeof id === "string" ? id : typeof id === "number" ? String(id) : "",
    type,
    is_visible: get(raw, "is_visible") !== false,
    order_index: typeof order === "number" && Number.isFinite(order) ? order : 0,
    config
  };
  const resolved = normalizeResolved(type, get(raw, "resolved"));
  if (resolved) section.resolved = resolved;
  return section;
}

// src/model.ts
var has = (s) => typeof s === "string" && s.trim() !== "";
function resolveTarget(link, resolveHref) {
  if (!link || !resolveHref || link.available === false) return null;
  const href = safeHref(resolveHref(link));
  return href ? { href, external: link.kind === "external", link } : null;
}
function drawnButtons(buttons, resolveHref) {
  const list = (buttons ?? []).filter((b) => has(b.label));
  if (!resolveHref) return list.map((button) => ({ button, target: null }));
  return list.map((button) => ({ button, target: resolveTarget(button.link, resolveHref) })).filter((b) => b.target);
}
var mediaSrc = (m) => !!m && !!(safeImgSrc(m.file_url) || safeImgSrc(m.mobile_file_url));
var RENDER_MAX = {
  collections: 12,
  products: 8,
  facts: 4,
  features: 6,
  quotes: 6,
  logos: 12,
  faq: 12
};
var capped = (type, list) => (list ?? []).slice(0, RENDER_MAX[type] ?? Infinity);
function drawnItems(section) {
  const { type, config } = section;
  const items2 = config.items ?? [];
  switch (type) {
    case "gallery":
      return items2.filter((i) => mediaSrc(i.media));
    case "cards":
      return items2;
    case "facts":
      return capped(type, items2.filter((i) => has(i.value)));
    case "features":
      return capped(type, items2.filter((i) => has(i.title) || hasRichText(i.body)));
    case "quotes":
      return capped(type, items2.filter((i) => hasRichText(i.text) && has(i.author)));
    case "logos":
      return capped(type, items2.filter((i) => mediaSrc(i.media)));
    case "faq":
      return capped(type, items2.filter((i) => has(i.question)));
    default:
      return [];
  }
}
var drawnCollections = (s) => s.type === "collections" ? capped("collections", s.resolved?.collections) : [];
var drawnProducts = (s) => s.type === "products" ? capped("products", s.resolved?.products) : [];
var CONTACT_KEYS = ["address", "email", "website", "instagram"];
function contactRows(s) {
  const data = s.resolved?.contact;
  if (s.type !== "contact" || !data) return [];
  const show = s.config.show ?? {};
  const rows = [];
  for (const key of CONTACT_KEYS) {
    const value = data[key];
    if (!has(value) || show[key] === false) continue;
    const href = key === "email" ? safeHref(`mailto:${value.trim()}`) : key === "website" ? safeHref(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`) : key === "instagram" ? safeHref(`https://instagram.com/${value.trim().replace(/^@/, "")}`) : void 0;
    rows.push({ key, value, href, external: key === "website" || key === "instagram" });
  }
  return rows;
}
var headText = (s) => has(s.config.title) || has(s.config.subtitle) || hasRichText(s.config.body);
function hasContent(s, resolveHref) {
  const c = s.config;
  const buttons = drawnButtons(c.buttons, resolveHref).length > 0;
  switch (s.type) {
    case "hero":
      return has(c.eyebrow) || has(c.title) || hasRichText(c.body) || buttons || mediaSrc(c.media) || c.media?.media_type === "video" && !!safeImgSrc(c.media.file_url);
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
var sectionTitle = (s) => s.type !== "facts" && has(s.config.title) ? s.config.title : void 0;
var MISSING_FIELD = {
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
  contact: null
};
var SURFACE = {
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
  cta: "ink"
};
var surfaceOf = (s) => s.type === "hero" ? s.config.variant === "split" ? "bg" : "image" : SURFACE[s.type];
var ALWAYS_HEAD = /* @__PURE__ */ new Set(["hero", "cta", "story", "text_block", "contact", "video"]);
function hasHead(s) {
  if (ALWAYS_HEAD.has(s.type)) return true;
  if (s.type === "facts") return false;
  return headText(s);
}
var visibleSorted = (sections, includeHidden = false) => sections.map((s, i) => ({ s, i })).filter(({ s }) => includeHidden || s.is_visible).sort((a, b) => a.s.order_index - b.s.order_index || a.i - b.i).map(({ s }) => s);
function planPage(raw, resolveHref, includeHidden = false) {
  const sections = visibleSorted(
    (Array.isArray(raw) ? raw : []).map(normalizeSection).filter((s) => !!s),
    includeHidden
  );
  let prev = null;
  let h1Used = false;
  let firstUsed = false;
  return sections.map((section) => {
    const drawn = section.is_visible && hasContent(section, resolveHref);
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

// src/render.tsx
import { Fragment, createContext, useContext } from "react";
import { Fragment as Fragment2, jsx, jsxs } from "react/jsx-runtime";
var PageContext = createContext({
  forceMobile: false,
  transform: { fn: (url) => url, resizes: false },
  labels: DEFAULT_LABELS,
  editorMode: false,
  fileMode: false
});
var usePage = () => useContext(PageContext);
var SectionContext = createContext({
  id: "",
  type: "text_block",
  h1: false,
  first: false,
  joined: false
});
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
var SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;
function useField() {
  const { fileMode } = usePage();
  return (name) => fileMode ? { [FILE_ATTR.field]: name } : {};
}
function useItem() {
  const { fileMode } = usePage();
  return fileMode ? { [FILE_ATTR.item]: "" } : {};
}
function useIgnore() {
  const { fileMode } = usePage();
  return fileMode ? { [FILE_ATTR.ignore]: "" } : {};
}
function Frame({ className, children }) {
  const page = usePage();
  const s = useContext(SectionContext);
  const id = page.editorMode && SAFE_ID.test(s.id) ? s.id : void 0;
  return /* @__PURE__ */ jsx(
    "section",
    {
      className: cx(className, s.joined && "g4mp-section--joined"),
      "data-section-id": id,
      hidden: page.fileMode && s.hidden ? true : void 0,
      ...page.fileMode ? s.fileAttrs : void 0,
      onClick: id && page.onSectionClick ? () => page.onSectionClick?.(id) : void 0,
      children
    }
  );
}
function Title({ className, children, field = "title" }) {
  const { h1 } = useContext(SectionContext);
  const f2 = useField()(field);
  return h1 ? /* @__PURE__ */ jsx("h1", { className, ...f2, children }) : /* @__PURE__ */ jsx("h2", { className, ...f2, children });
}
var SLOTS = {
  HERO: { width: 960, srcset: [640, 960, 1440, 1920, 2560], sizes: "100vw" },
  WIDE: { width: 1120, srcset: [640, 1120, 1600, 2240], sizes: "(min-width: 768px) 1120px, 100vw" },
  SPLIT: { width: 460, srcset: [460, 690, 920], sizes: "(min-width: 768px) 460px, 100vw" },
  STORY: { width: 600, srcset: [400, 600, 900, 1200], sizes: "(min-width: 768px) 50vw, 100vw" },
  GRID: { width: 400, srcset: [300, 400, 600, 800], sizes: "(min-width: 768px) 25vw, 50vw" },
  FEATURE: { width: 360, srcset: [360, 540, 720], sizes: "(min-width: 768px) 33vw, 100vw" },
  LOGO: { width: 120, srcset: [120, 240], sizes: "120px" },
  AVATAR: { width: 44, srcset: [44, 88, 132], sizes: "44px" }
};
function Img({
  media,
  slot,
  alt: alt2,
  className,
  field = "media"
}) {
  const { forceMobile, transform, fileMode } = usePage();
  const { first } = useContext(SectionContext);
  const desktop = safeImgSrc(media?.file_url);
  const mobile = safeImgSrc(media?.mobile_file_url);
  const base = desktop || mobile;
  if (!base) return null;
  const src = (u) => transform.fn(u, slot.width);
  const srcSet = (u) => transform.resizes ? slot.srcset.map((w) => `${transform.fn(u, w)} ${w}w`).join(", ") : void 0;
  const props = {
    // File mode: the brand's own alt only — a fallback (title, caption) is not content of the image.
    alt: fileMode ? (media?.alt ?? "").trim() : alt2,
    className,
    width: safeDimension(media?.width),
    height: safeDimension(media?.height),
    loading: first ? void 0 : "lazy",
    decoding: "async",
    sizes: transform.resizes ? slot.sizes : void 0,
    ...fileMode ? mediaFileAttrs(media, field) : {}
  };
  if (forceMobile) {
    const u = mobile || base;
    return /* @__PURE__ */ jsx("img", { src: src(u), srcSet: srcSet(u), ...props });
  }
  return /* @__PURE__ */ jsxs("picture", { children: [
    mobile && /* @__PURE__ */ jsx("source", { media: "(max-width: 640px)", srcSet: srcSet(mobile) ?? src(mobile), sizes: props.sizes }),
    /* @__PURE__ */ jsx("img", { src: src(base), srcSet: srcSet(base), ...props })
  ] });
}
function mediaFileAttrs(media, field) {
  const out = { [FILE_ATTR.field]: field };
  if (media?.media_id) out[FILE_ATTR.mediaId] = media.media_id;
  if (media?.mobile_media_id) out[FILE_ATTR.mobileMediaId] = media.mobile_media_id;
  if (media?.source_media_id) out[FILE_ATTR.sourceMediaId] = media.source_media_id;
  return out;
}
var altOf = (m, fallback) => (m?.alt ?? fallback ?? "").trim();
function ExitMark() {
  const ignore = useIgnore();
  return /* @__PURE__ */ jsx("span", { className: "g4mp-ext", "aria-hidden": "true", ...ignore, children: "\u2197" });
}
function useAnchorProps() {
  const { onLinkClick, fileMode } = usePage();
  return (target) => ({
    href: target.href,
    ...target.external ? { rel: "noopener noreferrer nofollow", target: "_blank" } : {},
    ...fileMode ? linkFileAttrs(target.link) : {},
    onClick: onLinkClick ? (e) => onLinkClick(e, target.link) : void 0
  });
}
var BUTTON_CLASS = {
  plain: "g4mp-btn",
  primary: "g4mp-btn g4mp-btn--primary",
  outline: "g4mp-btn g4mp-btn--outline",
  "outline-dark": "g4mp-btn g4mp-btn--outline-dark"
};
function Buttons({ buttons, variants }) {
  const page = usePage();
  const anchor = useAnchorProps();
  const field = useField()("button");
  const list = (page.fileMode ? (buttons ?? []).filter((b) => b.label.trim()).map((button) => ({ button, target: resolveTarget(button.link, page.resolveHref) })) : drawnButtons(buttons, page.resolveHref)).slice(0, variants.length);
  if (!list.length) return null;
  return /* @__PURE__ */ jsx("div", { className: "g4mp-btns", children: list.map(({ button, target }, i) => {
    const className = BUTTON_CLASS[variants[i]];
    if (target) {
      return /* @__PURE__ */ jsxs("a", { className, ...anchor(target), ...field, children: [
        button.label,
        target.external && /* @__PURE__ */ jsx(ExitMark, {})
      ] }, i);
    }
    if (page.fileMode) {
      return /* @__PURE__ */ jsx("a", { className, ...field, children: button.label }, i);
    }
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className,
        onClick: () => page.onCtaClick?.(legacyCtaOf(button) ?? legacyCta(button)),
        children: button.label
      },
      i
    );
  }) });
}
function Lines({ text }) {
  const parts = text.split("\n");
  return /* @__PURE__ */ jsx(Fragment2, { children: parts.map((p, i) => /* @__PURE__ */ jsxs(Fragment, { children: [
    i > 0 && /* @__PURE__ */ jsx("br", {}),
    p
  ] }, i)) });
}
function RichTextView({ value, className, field = "body" }) {
  const { resolveHref, fileMode } = usePage();
  const anchor = useAnchorProps();
  const f2 = useField()(field);
  if (typeof value === "string" && !fileMode) {
    return value.trim() ? /* @__PURE__ */ jsx("p", { className, children: value }) : null;
  }
  const paras = richParagraphs(value);
  if (!paras.length) return null;
  return /* @__PURE__ */ jsx("div", { className: cx(className, "g4mp-rich"), ...f2, children: paras.map((p, i) => /* @__PURE__ */ jsx("p", { children: p.map((f3, j) => {
    let node = f3.text.includes("\n") ? /* @__PURE__ */ jsx(Lines, { text: f3.text }) : f3.text;
    if (f3.underline) node = /* @__PURE__ */ jsx("u", { children: node });
    if (f3.italic) node = /* @__PURE__ */ jsx("em", { children: node });
    if (f3.bold) node = /* @__PURE__ */ jsx("strong", { children: node });
    const target = resolveTarget(f3.link, resolveHref);
    if (target) {
      node = /* @__PURE__ */ jsxs("a", { className: "g4mp-link", ...anchor(target), children: [
        node,
        target.external && /* @__PURE__ */ jsx(ExitMark, {})
      ] });
    }
    return /* @__PURE__ */ jsx(Fragment, { children: node }, j);
  }) }, i)) });
}

// src/sections/Copy.tsx
import { Fragment as Fragment3, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var hasCopy = (c) => has(c.title) || has(c.subtitle) || hasRichText(c.body);
function Copy({
  title: title2,
  subtitle: subtitle2,
  body: body2,
  titleClass = "g4mp-title",
  subtitleClass = "g4mp-subtitle",
  bodyClass = "g4mp-body"
}) {
  const field = useField();
  return /* @__PURE__ */ jsxs2(Fragment3, { children: [
    has(title2) && /* @__PURE__ */ jsx2(Title, { className: titleClass, children: title2 }),
    has(subtitle2) && /* @__PURE__ */ jsx2("p", { className: subtitleClass, ...field("subtitle"), children: subtitle2 }),
    /* @__PURE__ */ jsx2(RichTextView, { value: body2, className: bodyClass })
  ] });
}

// src/sections/Tile.tsx
import { Fragment as Fragment4, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function Tile({
  media,
  alt: alt2,
  title: title2,
  lines,
  target,
  onLegacyClick,
  lineFields = []
}) {
  const anchor = useAnchorProps();
  const field = useField();
  const item = useItem();
  const legacy = !target && !!onLegacyClick;
  const TitleTag = legacy ? "span" : "h3";
  const hasImg = !!(media?.file_url || media?.mobile_file_url);
  const inner = /* @__PURE__ */ jsxs3(Fragment4, { children: [
    hasImg ? /* @__PURE__ */ jsx3(Img, { media, slot: SLOTS.GRID, alt: alt2, className: "g4mp-img g4mp-card__img" }) : /* @__PURE__ */ jsx3("span", { className: "g4mp-card__fallback" }),
    (title2 || lines.length > 0) && /* @__PURE__ */ jsxs3("span", { className: "g4mp-card__overlay", children: [
      title2 && /* @__PURE__ */ jsx3(TitleTag, { className: "g4mp-card__title", ...field("title"), children: title2 }),
      lines.map((l, i) => /* @__PURE__ */ jsx3("span", { className: "g4mp-card__sub", ...lineFields[i] ? field(lineFields[i]) : {}, children: l }, i))
    ] })
  ] });
  if (target) {
    return /* @__PURE__ */ jsxs3("a", { className: "g4mp-card g4mp-card--link", ...anchor(target), ...item, ...field("link"), children: [
      inner,
      target.external && /* @__PURE__ */ jsx3(ExitMark, {})
    ] });
  }
  if (legacy) {
    return /* @__PURE__ */ jsx3("button", { type: "button", className: "g4mp-card g4mp-card--link", onClick: onLegacyClick, children: inner });
  }
  return /* @__PURE__ */ jsx3("div", { className: "g4mp-card", ...item, children: inner });
}
var CARD_GRID_CLASS = {
  2: "g4mp-cards__grid--2",
  3: "g4mp-cards__grid--3",
  4: "g4mp-cards__grid--4"
};
var gridCount = (n) => Math.min(Math.max(n, 2), 4);

// src/sections/Cards.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function Cards({ section }) {
  const page = usePage();
  const c = section.config;
  const items2 = drawnItems(section);
  return /* @__PURE__ */ jsx4(Frame, { className: "g4mp-section g4mp-cards", children: /* @__PURE__ */ jsxs4("div", { className: "g4mp-inner", children: [
    hasCopy(c) && /* @__PURE__ */ jsx4("div", { className: "g4mp-cards__head", children: /* @__PURE__ */ jsx4(Copy, { title: c.title, subtitle: c.subtitle, body: c.body }) }),
    /* @__PURE__ */ jsx4("div", { className: cx("g4mp-cards__grid", CARD_GRID_CLASS[gridCount(items2.length)]), children: items2.map((item, i) => {
      const legacy = legacyCtaOf(item) ?? (item.link ? legacyCta({ label: item.title ?? "", link: item.link }) : void 0);
      return /* @__PURE__ */ jsx4(
        Tile,
        {
          media: item.media,
          alt: altOf(item.media, item.title),
          title: item.title,
          lines: typeof item.body === "string" && has(item.body) ? [item.body] : [],
          target: resolveTarget(item.link, page.resolveHref),
          onLegacyClick: !page.resolveHref && legacy ? () => page.onCtaClick?.(legacy) : void 0,
          lineFields: ["body"]
        },
        i
      );
    }) })
  ] }) });
}

// src/sections/Collections.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function Collections({ section }) {
  const { resolveHref, labels } = usePage();
  const c = section.config;
  const items2 = drawnCollections(section);
  const shipping = (s) => c.show_shipping && has(s) ? fill(labels.shipping, { date: s }) : void 0;
  const tall = items2.some((it) => shipping(it.shipping));
  return /* @__PURE__ */ jsx5(Frame, { className: "g4mp-section g4mp-cards g4mp-collections", children: /* @__PURE__ */ jsxs5("div", { className: "g4mp-inner", children: [
    has(c.title) && /* @__PURE__ */ jsx5("div", { className: "g4mp-cards__head", children: /* @__PURE__ */ jsx5(Title, { className: "g4mp-title", children: c.title }) }),
    /* @__PURE__ */ jsx5("div", { className: cx("g4mp-cards__grid", CARD_GRID_CLASS[gridCount(items2.length)], tall && "g4mp-cards__grid--tall"), children: items2.map((it) => {
      const styles = it.styles != null ? fill(it.styles === 1 ? labels.styles.one : labels.styles.other, { n: it.styles }) : void 0;
      const meta = [it.season, styles].filter(has).join(" \xB7 ");
      return /* @__PURE__ */ jsx5(
        Tile,
        {
          media: it.cover,
          alt: altOf(it.cover, it.name),
          title: it.name,
          lines: [meta, shipping(it.shipping)].filter(has),
          target: resolveTarget(it.link ?? { kind: "collection", id: it.id }, resolveHref)
        },
        it.id
      );
    }) })
  ] }) });
}

// src/sections/Contact.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function Contact({ section }) {
  const { labels, onLinkClick } = usePage();
  const c = section.config;
  const rows = contactRows(section);
  return /* @__PURE__ */ jsx6(Frame, { className: "g4mp-section g4mp-contact", children: /* @__PURE__ */ jsxs6("div", { className: "g4mp-inner g4mp-contact__grid", children: [
    hasCopy(c) && /* @__PURE__ */ jsx6("div", { className: "g4mp-contact__copy", children: /* @__PURE__ */ jsx6(Copy, { title: c.title, body: c.body }) }),
    rows.length > 0 && /* @__PURE__ */ jsx6("ul", { className: "g4mp-contact__list", children: rows.map((r) => /* @__PURE__ */ jsxs6("li", { className: "g4mp-contact__item", children: [
      /* @__PURE__ */ jsx6("span", { className: "g4mp-contact__label", children: labels.contact[r.key] }),
      r.href ? /* @__PURE__ */ jsxs6(
        "a",
        {
          className: "g4mp-contact__value",
          href: r.href,
          ...r.external ? { rel: "noopener noreferrer nofollow", target: "_blank" } : {},
          onClick: onLinkClick ? (e) => onLinkClick(e, { kind: "external", url: r.href }) : void 0,
          children: [
            r.value,
            r.external && /* @__PURE__ */ jsx6(ExitMark, {})
          ]
        }
      ) : /* @__PURE__ */ jsx6("span", { className: "g4mp-contact__value", children: r.value })
    ] }, r.key)) })
  ] }) });
}

// src/sections/Cta.tsx
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function Cta({ section }) {
  const c = section.config;
  return /* @__PURE__ */ jsx7(Frame, { className: "g4mp-section g4mp-cta", children: /* @__PURE__ */ jsxs7("div", { className: "g4mp-inner g4mp-cta__inner", children: [
    hasCopy(c) && /* @__PURE__ */ jsx7("div", { children: /* @__PURE__ */ jsx7(
      Copy,
      {
        title: c.title,
        subtitle: c.subtitle,
        body: c.body,
        titleClass: "g4mp-cta__title",
        subtitleClass: "g4mp-cta__sub",
        bodyClass: "g4mp-cta__body"
      }
    ) }),
    /* @__PURE__ */ jsx7(Buttons, { buttons: c.buttons, variants: ["plain", "outline"] })
  ] }) });
}

// src/sections/Facts.tsx
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
function Facts({ section }) {
  const field = useField();
  const item = useItem();
  return /* @__PURE__ */ jsx8(Frame, { className: "g4mp-section g4mp-facts", children: /* @__PURE__ */ jsx8("div", { className: "g4mp-inner", children: /* @__PURE__ */ jsx8("ul", { className: "g4mp-facts__list", children: drawnItems(section).map((it, i) => /* @__PURE__ */ jsxs8("li", { className: "g4mp-fact", ...item, children: [
    /* @__PURE__ */ jsx8("span", { className: "g4mp-fact__value", ...field("value"), children: it.value }),
    has(it.label) && /* @__PURE__ */ jsx8("span", { className: "g4mp-fact__label", ...field("label"), children: it.label })
  ] }, i)) }) }) });
}

// src/sections/Faq.tsx
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
function Faq({ section }) {
  const c = section.config;
  const field = useField();
  const item = useItem();
  const ignore = useIgnore();
  return /* @__PURE__ */ jsx9(Frame, { className: "g4mp-section g4mp-faq", children: /* @__PURE__ */ jsxs9("div", { className: "g4mp-faq__inner", children: [
    has(c.title) && /* @__PURE__ */ jsx9(Title, { className: "g4mp-title", children: c.title }),
    /* @__PURE__ */ jsx9("div", { className: "g4mp-faq__list", children: drawnItems(section).map((it, i) => /* @__PURE__ */ jsxs9("details", { className: "g4mp-faq__item", ...item, children: [
      /* @__PURE__ */ jsxs9("summary", { className: "g4mp-faq__q", children: [
        /* @__PURE__ */ jsx9("h3", { className: "g4mp-faq__qt", ...field("question"), children: it.question }),
        /* @__PURE__ */ jsx9("span", { className: "g4mp-faq__sign", "aria-hidden": "true", ...ignore })
      ] }),
      /* @__PURE__ */ jsx9(RichTextView, { value: it.answer, className: "g4mp-body g4mp-faq__a", field: "answer" })
    ] }, i)) })
  ] }) });
}

// src/sections/Features.tsx
import { jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
var pad2 = (n) => String(n).padStart(2, "0");
function Features({ section }) {
  const c = section.config;
  const items2 = drawnItems(section);
  const cols = items2.length === 2 || items2.length === 4 ? "g4mp-features__list--2" : "g4mp-features__list--3";
  const field = useField();
  const item = useItem();
  const ignore = useIgnore();
  return /* @__PURE__ */ jsx10(Frame, { className: "g4mp-section g4mp-features", children: /* @__PURE__ */ jsxs10("div", { className: "g4mp-inner", children: [
    has(c.title) && /* @__PURE__ */ jsx10("div", { className: "g4mp-head g4mp-head--left", children: /* @__PURE__ */ jsx10(Title, { className: "g4mp-title", children: c.title }) }),
    items2.length > 0 && /* @__PURE__ */ jsx10("ol", { className: cx("g4mp-features__list", cols), children: items2.map((it, i) => {
      const img = mediaSrc(it.media);
      return /* @__PURE__ */ jsxs10("li", { className: cx("g4mp-feature", img && "g4mp-feature--media"), ...item, children: [
        img && /* @__PURE__ */ jsx10(Img, { media: it.media, slot: SLOTS.FEATURE, alt: altOf(it.media, it.title), className: "g4mp-img g4mp-feature__img" }),
        /* @__PURE__ */ jsxs10("div", { className: "g4mp-feature__text", children: [
          /* @__PURE__ */ jsx10("span", { className: "g4mp-feature__no", ...ignore, children: pad2(i + 1) }),
          has(it.title) && /* @__PURE__ */ jsx10("h3", { className: "g4mp-feature__title", ...field("title"), children: it.title }),
          /* @__PURE__ */ jsx10(RichTextView, { value: it.body, className: "g4mp-feature__body" })
        ] })
      ] }, i);
    }) })
  ] }) });
}

// src/sections/Gallery.tsx
import { Fragment as Fragment5 } from "react";
import { jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
var COUNT_CLASS = {
  1: "g4mp-grid__items--1",
  2: "g4mp-grid__items--2",
  3: "g4mp-grid__items--3"
};
function Gallery({ section }) {
  const c = section.config;
  const items2 = drawnItems(section);
  const n = items2.length;
  const captions = items2.some((i) => has(i.caption) || has(i.subcaption));
  const field = useField();
  const item = useItem();
  return /* @__PURE__ */ jsx11(Frame, { className: "g4mp-section g4mp-grid", children: /* @__PURE__ */ jsxs11("div", { className: "g4mp-inner", children: [
    hasCopy(c) && /* @__PURE__ */ jsx11("div", { className: "g4mp-grid__head", children: /* @__PURE__ */ jsx11(Copy, { title: c.title, subtitle: c.subtitle, body: c.body }) }),
    n > 0 && /* @__PURE__ */ jsx11("div", { className: cx("g4mp-grid__items", COUNT_CLASS[n], captions && "g4mp-grid__items--captions"), children: items2.map((it, i) => {
      const plain = !has(it.caption) && !has(it.subcaption);
      const cell = /* @__PURE__ */ jsx11("div", { className: "g4mp-grid__cell", ...plain ? item : {}, children: /* @__PURE__ */ jsx11(Img, { media: it.media, slot: n === 1 ? SLOTS.WIDE : SLOTS.GRID, alt: altOf(it.media, it.caption), className: "g4mp-img" }) });
      if (plain) return /* @__PURE__ */ jsx11(Fragment5, { children: cell }, i);
      return /* @__PURE__ */ jsxs11("figure", { className: "g4mp-grid__fig", ...item, children: [
        cell,
        /* @__PURE__ */ jsxs11("figcaption", { className: "g4mp-grid__cap", ...field("caption"), children: [
          it.caption,
          has(it.subcaption) && /* @__PURE__ */ jsx11("span", { className: "g4mp-grid__subcap", ...field("subcaption"), children: it.subcaption })
        ] })
      ] }, i);
    }) })
  ] }) });
}

// src/sections/Hero.tsx
import { jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
function Hero({ section }) {
  return section.config.variant === "split" ? /* @__PURE__ */ jsx12(HeroSplit, { section }) : /* @__PURE__ */ jsx12(HeroCover, { section });
}
function HeroCover({ section }) {
  const { transform, fileMode } = usePage();
  const field = useField();
  const c = section.config;
  const m = c.media;
  const video = m?.media_type === "video" ? safeImgSrc(m.file_url) : void 0;
  const poster = video ? safeImgSrc(m?.poster_url) : void 0;
  return /* @__PURE__ */ jsxs12(Frame, { className: "g4mp-hero", children: [
    video ? (
      // Background video: muted, looped, no controls; the poster shows until it plays.
      /* @__PURE__ */ jsx12(
        "video",
        {
          className: "g4mp-img g4mp-hero__img",
          src: video,
          poster: poster ? transform.fn(poster, SLOTS.HERO.width) : void 0,
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
          preload: poster ? "none" : "metadata",
          width: safeDimension(m?.width),
          height: safeDimension(m?.height),
          "aria-hidden": "true",
          ...fileMode ? mediaFileAttrs(m, "media") : {}
        }
      )
    ) : mediaSrc(m) ? /* @__PURE__ */ jsx12(Img, { media: m, slot: SLOTS.HERO, alt: altOf(m, c.title), className: "g4mp-img g4mp-hero__img" }) : /* @__PURE__ */ jsx12("div", { className: "g4mp-hero__fallback" }),
    /* @__PURE__ */ jsx12("div", { className: "g4mp-hero__scrim" }),
    /* @__PURE__ */ jsx12("div", { className: "g4mp-hero__inner", children: /* @__PURE__ */ jsxs12("div", { className: "g4mp-hero__box", children: [
      has(c.eyebrow) && /* @__PURE__ */ jsx12("p", { className: "g4mp-eyebrow", ...field("eyebrow"), children: c.eyebrow }),
      has(c.title) && /* @__PURE__ */ jsx12(Title, { className: "g4mp-title", children: c.title }),
      /* @__PURE__ */ jsx12(RichTextView, { value: c.body, className: "g4mp-hero__body" }),
      /* @__PURE__ */ jsx12(Buttons, { buttons: c.buttons, variants: ["plain", "outline"] })
    ] }) })
  ] });
}
function HeroSplit({ section }) {
  const { resolveHref } = usePage();
  const field = useField();
  const c = section.config;
  const text = has(c.eyebrow) || has(c.title) || hasRichText(c.body) || drawnButtons(c.buttons, resolveHref).length > 0;
  return /* @__PURE__ */ jsx12(Frame, { className: "g4mp-section g4mp-hero-split", children: /* @__PURE__ */ jsxs12("div", { className: "g4mp-inner g4mp-hero-split__grid", children: [
    text && /* @__PURE__ */ jsxs12("div", { className: "g4mp-hero-split__copy", children: [
      has(c.eyebrow) && /* @__PURE__ */ jsx12("p", { className: "g4mp-eyebrow", ...field("eyebrow"), children: c.eyebrow }),
      has(c.title) && /* @__PURE__ */ jsx12(Title, { className: "g4mp-title g4mp-hero-split__title", children: c.title }),
      /* @__PURE__ */ jsx12(RichTextView, { value: c.body, className: "g4mp-hero-split__body" }),
      /* @__PURE__ */ jsx12(Buttons, { buttons: c.buttons, variants: ["primary", "outline-dark"] })
    ] }),
    mediaSrc(c.media) && /* @__PURE__ */ jsx12("div", { className: "g4mp-hero-split__media", children: /* @__PURE__ */ jsx12(Img, { media: c.media, slot: SLOTS.SPLIT, alt: altOf(c.media, c.title), className: "g4mp-img g4mp-hero-split__img" }) })
  ] }) });
}

// src/sections/Logos.tsx
import { jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
function Logos({ section }) {
  const { resolveHref, fileMode } = usePage();
  const anchor = useAnchorProps();
  const field = useField();
  const item = useItem();
  const c = section.config;
  return /* @__PURE__ */ jsx13(Frame, { className: "g4mp-section g4mp-logos", children: /* @__PURE__ */ jsxs13("div", { className: "g4mp-inner", children: [
    has(c.title) && /* @__PURE__ */ jsx13(Title, { className: "g4mp-eyebrow g4mp-logos__title", children: c.title }),
    /* @__PURE__ */ jsx13("ul", { className: "g4mp-logos__list", children: drawnItems(section).map((it, i) => {
      const img = /* @__PURE__ */ jsx13(Img, { media: it.media, slot: SLOTS.LOGO, alt: altOf(it.media, it.name), className: "g4mp-img g4mp-logo" });
      const target = resolveTarget(it.link, resolveHref);
      return /* @__PURE__ */ jsxs13("li", { ...item, children: [
        fileMode && has(it.name) && /* @__PURE__ */ jsx13("span", { hidden: true, ...field("name"), children: it.name }),
        target ? /* @__PURE__ */ jsxs13("a", { className: "g4mp-logos__link", ...anchor(target), ...field("link"), children: [
          img,
          target.external && /* @__PURE__ */ jsx13(ExitMark, {})
        ] }) : img
      ] }, i);
    }) })
  ] }) });
}

// src/sections/Products.tsx
import { Fragment as Fragment6, jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
function Products({ section }) {
  const c = section.config;
  return /* @__PURE__ */ jsx14(Frame, { className: "g4mp-section g4mp-products", children: /* @__PURE__ */ jsxs14("div", { className: "g4mp-inner", children: [
    (has(c.title) || has(c.subtitle)) && /* @__PURE__ */ jsxs14("div", { className: "g4mp-head", children: [
      has(c.title) && /* @__PURE__ */ jsx14(Title, { className: "g4mp-title", children: c.title }),
      has(c.subtitle) && /* @__PURE__ */ jsx14("p", { className: "g4mp-subtitle", children: c.subtitle })
    ] }),
    /* @__PURE__ */ jsx14("div", { className: "g4mp-products__grid", children: drawnProducts(section).map((p) => /* @__PURE__ */ jsx14(Product, { product: p }, p.id)) })
  ] }) });
}
function Product({ product: p }) {
  const { resolveHref } = usePage();
  const anchor = useAnchorProps();
  const target = resolveTarget(p.link ?? { kind: "product", id: p.id }, resolveHref);
  const inner = /* @__PURE__ */ jsxs14(Fragment6, { children: [
    /* @__PURE__ */ jsx14("span", { className: "g4mp-product__frame", children: /* @__PURE__ */ jsx14(Img, { media: p.image, slot: SLOTS.GRID, alt: altOf(p.image, p.name), className: "g4mp-img g4mp-product__img" }) }),
    has(p.name) && /* @__PURE__ */ jsx14("h3", { className: "g4mp-product__name", children: p.name }),
    has(p.category) && /* @__PURE__ */ jsx14("span", { className: "g4mp-product__cat", children: p.category })
  ] });
  return target ? /* @__PURE__ */ jsxs14("a", { className: "g4mp-product", ...anchor(target), children: [
    inner,
    target.external && /* @__PURE__ */ jsx14(ExitMark, {})
  ] }) : /* @__PURE__ */ jsx14("div", { className: "g4mp-product", children: inner });
}

// src/sections/Quotes.tsx
import { jsx as jsx15, jsxs as jsxs15 } from "react/jsx-runtime";
function Quotes({ section }) {
  const c = section.config;
  const items2 = drawnItems(section);
  const solo = items2.length === 1;
  const figs = items2.map((it, i) => /* @__PURE__ */ jsx15(Quote, { item: it, solo }, i));
  const cols = items2.length === 2 || items2.length === 4 ? "g4mp-quotes__grid--2" : "g4mp-quotes__grid--3";
  return /* @__PURE__ */ jsx15(Frame, { className: "g4mp-section g4mp-quotes", children: /* @__PURE__ */ jsxs15("div", { className: "g4mp-inner", children: [
    has(c.title) && /* @__PURE__ */ jsx15("div", { className: "g4mp-head", children: /* @__PURE__ */ jsx15(Title, { className: "g4mp-title", children: c.title }) }),
    solo ? figs : /* @__PURE__ */ jsx15("div", { className: cx("g4mp-quotes__grid", cols), children: figs })
  ] }) });
}
function Quote({ item, solo }) {
  const avatar = mediaSrc(item.avatar);
  const field = useField();
  return /* @__PURE__ */ jsxs15("figure", { className: cx("g4mp-quote", solo && "g4mp-quote--solo"), ...useItem(), children: [
    /* @__PURE__ */ jsx15("blockquote", { children: /* @__PURE__ */ jsx15(RichTextView, { value: item.text, className: "g4mp-quote__text", field: "text" }) }),
    /* @__PURE__ */ jsxs15("figcaption", { className: "g4mp-quote__by", children: [
      avatar && /* @__PURE__ */ jsx15(Img, { media: item.avatar, slot: SLOTS.AVATAR, alt: altOf(item.avatar, item.author), className: "g4mp-img g4mp-quote__avatar", field: "avatar" }),
      /* @__PURE__ */ jsxs15("span", { children: [
        has(item.author) && /* @__PURE__ */ jsx15("span", { className: "g4mp-quote__name", ...field("author"), children: item.author }),
        has(item.role) && /* @__PURE__ */ jsx15("span", { className: "g4mp-quote__role", ...field("role"), children: item.role })
      ] })
    ] })
  ] });
}

// src/sections/Story.tsx
import { jsx as jsx16, jsxs as jsxs16 } from "react/jsx-runtime";
var SIDE_CLASS = { left: "g4mp-story--left", right: void 0 };
function Story({ section }) {
  const { resolveHref } = usePage();
  const c = section.config;
  const text = hasCopy(c) || drawnButtons(c.buttons, resolveHref).length > 0;
  return /* @__PURE__ */ jsx16(Frame, { className: cx("g4mp-section g4mp-story", SIDE_CLASS[c.image_side ?? "right"]), children: /* @__PURE__ */ jsxs16("div", { className: "g4mp-inner g4mp-story__grid", children: [
    text && /* @__PURE__ */ jsxs16("div", { className: "g4mp-story__copy", children: [
      /* @__PURE__ */ jsx16(Copy, { title: c.title, subtitle: c.subtitle, body: c.body }),
      /* @__PURE__ */ jsx16(Buttons, { buttons: c.buttons, variants: ["primary"] })
    ] }),
    mediaSrc(c.media) && /* @__PURE__ */ jsx16("div", { className: "g4mp-story__media", children: /* @__PURE__ */ jsx16(Img, { media: c.media, slot: SLOTS.STORY, alt: altOf(c.media, c.title), className: "g4mp-img g4mp-story__img" }) })
  ] }) });
}

// src/sections/Text.tsx
import { jsx as jsx17, jsxs as jsxs17 } from "react/jsx-runtime";
function Text({ section }) {
  const c = section.config;
  return /* @__PURE__ */ jsx17(Frame, { className: "g4mp-section g4mp-text", children: /* @__PURE__ */ jsxs17("div", { className: "g4mp-text__inner", children: [
    /* @__PURE__ */ jsx17(Copy, { title: c.title, subtitle: c.subtitle, body: c.body }),
    /* @__PURE__ */ jsx17(Buttons, { buttons: c.buttons, variants: ["primary"] })
  ] }) });
}

// src/sections/Video.tsx
import { jsx as jsx18, jsxs as jsxs18 } from "react/jsx-runtime";
function Video({ section }) {
  const { transform, fileMode } = usePage();
  const field = useField();
  const c = section.config;
  const src = safeImgSrc(c.media?.file_url);
  if (!src && !fileMode) return null;
  const posterSrc = safeImgSrc(c.media?.poster_url);
  const poster = posterSrc ? transform.fn(posterSrc, 960) : void 0;
  return /* @__PURE__ */ jsx18(Frame, { className: "g4mp-section g4mp-video", children: /* @__PURE__ */ jsxs18("div", { className: "g4mp-inner g4mp-video__inner", children: [
    src && /* @__PURE__ */ jsx18("div", { className: "g4mp-video__frame", children: /* @__PURE__ */ jsx18(
      "video",
      {
        src,
        controls: true,
        playsInline: true,
        poster,
        preload: poster ? "none" : "metadata",
        width: safeDimension(c.media?.width),
        height: safeDimension(c.media?.height),
        ...fileMode ? mediaFileAttrs(c.media, "media") : {}
      }
    ) }),
    (has(c.title) || has(c.caption)) && /* @__PURE__ */ jsxs18("div", { className: "g4mp-video__caption", children: [
      has(c.title) && /* @__PURE__ */ jsx18(Title, { className: "g4mp-title", children: c.title }),
      has(c.caption) && /* @__PURE__ */ jsx18("p", { className: "g4mp-body", ...field("caption"), children: c.caption })
    ] })
  ] }) });
}

// src/sections/Empty.tsx
import { jsx as jsx19, jsxs as jsxs19 } from "react/jsx-runtime";
function Empty({ section }) {
  const { labels } = usePage();
  const field = MISSING_FIELD[section.type];
  return /* @__PURE__ */ jsx19(Frame, { className: "g4mp-section g4mp-empty", children: /* @__PURE__ */ jsxs19("div", { className: "g4mp-empty__box", children: [
    /* @__PURE__ */ jsx19("p", { className: "g4mp-empty__type", children: labels.sections[section.type] }),
    field && /* @__PURE__ */ jsx19("p", { className: "g4mp-empty__field", children: labels.fields[field] })
  ] }) });
}

// src/sections/FileData.tsx
import { jsx as jsx20 } from "react/jsx-runtime";
var CLASS = {
  collections: "g4mp-section g4mp-cards g4mp-collections",
  products: "g4mp-section g4mp-products",
  contact: "g4mp-section g4mp-contact"
};
function FileData({ section }) {
  const c = section.config;
  return /* @__PURE__ */ jsx20(Frame, { className: CLASS[section.type] ?? "g4mp-section", children: /* @__PURE__ */ jsx20("div", { className: "g4mp-inner", children: /* @__PURE__ */ jsx20(
    Copy,
    {
      title: c.title,
      subtitle: section.type === "products" ? c.subtitle : void 0,
      body: section.type === "contact" ? c.body : void 0
    }
  ) }) });
}
var FILE_DATA_TYPES = /* @__PURE__ */ new Set(["collections", "products", "contact"]);

// src/sections/index.ts
var SECTION_COMPONENTS = {
  hero: Hero,
  text_block: Text,
  story: Story,
  gallery: Gallery,
  video: Video,
  cards: Cards,
  collections: Collections,
  products: Products,
  facts: Facts,
  features: Features,
  quotes: Quotes,
  logos: Logos,
  faq: Faq,
  cta: Cta,
  contact: Contact
};

// src/styles.ts
var MARKETING_CSS = `
.g4mp {
  /* Host variables (all optional) \u2192 resolved values; defaults = the 0.4.1 look. */
  --g4mp-c-bg: var(--g4mp-bg, #fafafa);
  --g4mp-c-surface: var(--g4mp-surface, #ffffff);
  --g4mp-c-surface-2: var(--g4mp-surface-2, #f4f4f4);
  --g4mp-c-ink: var(--g4mp-ink, #0a0a0a);
  --g4mp-c-muted: var(--g4mp-muted, #737373);
  --g4mp-c-ondark: var(--g4mp-ondark, #ffffff);
  --g4mp-c-line: var(--g4mp-line, #e5e5e5);
  --g4mp-c-font-body: var(--g4mp-font-body, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
  --g4mp-c-font-heading: var(--g4mp-font-heading, var(--g4mp-c-font-body));
  --g4mp-c-radius: var(--g4mp-radius, 12px);
  --g4mp-c-radius-btn: var(--g4mp-radius, 8px);
  width: 100%;
  background: var(--g4mp-c-bg);
  color: var(--g4mp-c-ink);
  font-family: var(--g4mp-c-font-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.g4mp *, .g4mp *::before, .g4mp *::after { box-sizing: border-box; }
.g4mp img, .g4mp video { display: block; max-width: 100%; }
.g4mp h1, .g4mp h2, .g4mp h3, .g4mp p { margin: 0; }
.g4mp h1, .g4mp h2, .g4mp h3, .g4mp-fact__value { font-family: var(--g4mp-c-font-heading); }

.g4mp-section { padding: 48px 24px; }
.g4mp-inner { max-width: 1120px; margin: 0 auto; }
.g4mp-eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; }
.g4mp-title { font-size: 30px; line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
.g4mp-subtitle { font-size: 17px; font-weight: 700; color: var(--g4mp-c-ink); }
.g4mp-body { font-size: 15px; line-height: 1.6; color: var(--g4mp-c-ink); white-space: pre-line; }

/* Button */
.g4mp-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px; border-radius: var(--g4mp-c-radius-btn); border: 0; cursor: pointer;
  font-family: inherit; font-size: 14px; font-weight: 600; line-height: 1;
  background: var(--g4mp-c-ondark); color: var(--g4mp-c-ink);
  transition: opacity 0.15s ease;
}
a.g4mp-btn { text-decoration: none; }
.g4mp-btn:hover { opacity: 0.88; }
.g4mp-ext { font-size: 0.9em; line-height: 1; }
.g4mp-btn:focus-visible { outline: 2px solid var(--g4mp-c-ink); outline-offset: 2px; }
.g4mp-btn--primary { background: var(--g4mp-c-ink); color: var(--g4mp-c-ondark); }

/* Hero */
.g4mp-hero { position: relative; display: flex; align-items: flex-end; min-height: 56vh; overflow: hidden; }
.g4mp-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.g4mp-hero__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
.g4mp-hero__scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.15) 55%, transparent); }
.g4mp-hero__inner { position: relative; z-index: 1; width: 100%; padding: 24px; }
.g4mp-hero__box { max-width: 760px; }
.g4mp-hero .g4mp-eyebrow { color: rgba(255,255,255,0.8); margin-bottom: 8px; }
.g4mp-hero .g4mp-title { color: var(--g4mp-c-ondark); margin-bottom: 14px; }
.g4mp-hero__body { color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.55; max-width: 640px; margin-bottom: 22px; white-space: pre-line; }

/* Story (text + image) */
.g4mp-story { background: var(--g4mp-c-surface); }
.g4mp-story__grid { display: flex; flex-direction: column; gap: 28px; }
.g4mp-story__copy .g4mp-title { margin-bottom: 12px; }
.g4mp-story__copy .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-story__img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--g4mp-c-radius); }

/* Grid (team / materials) */
.g4mp-grid { background: var(--g4mp-c-surface-2); }
.g4mp-grid__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-grid__head .g4mp-title { margin-bottom: 12px; }
.g4mp-grid__head .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-grid__items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.g4mp-grid__cell { aspect-ratio: 1 / 1; overflow: hidden; border-radius: var(--g4mp-c-radius); }
.g4mp-grid__cell img { width: 100%; height: 100%; object-fit: cover; }

/* Text block */
.g4mp-text { background: var(--g4mp-c-surface); }
.g4mp-text__inner { max-width: 720px; margin: 0 auto; text-align: center; }
.g4mp-text__inner .g4mp-title { margin-bottom: 12px; }
.g4mp-text__inner .g4mp-subtitle { margin-bottom: 12px; }

/* Video */
.g4mp-video { background: var(--g4mp-c-surface); }
.g4mp-video__inner { max-width: 960px; margin: 0 auto; }
.g4mp-video__frame { width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: var(--g4mp-c-radius); overflow: hidden; }
.g4mp-video__frame video { width: 100%; height: 100%; object-fit: contain; }
.g4mp-video__caption { margin-top: 16px; text-align: center; }
.g4mp-video__caption .g4mp-title { font-size: 24px; margin-bottom: 6px; }

/* CTA bar */
.g4mp-cta { background: var(--g4mp-c-ink); color: var(--g4mp-c-ondark); }
.g4mp-cta__inner { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.g4mp-cta__title { font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
.g4mp-cta__sub { font-weight: 700; color: rgba(255,255,255,0.85); margin-bottom: 6px; }
.g4mp-cta__body { color: rgba(255,255,255,0.85); white-space: pre-line; }

/* Cards \u2014 the whole tile is the click target (image + overlaid title), no button. */
.g4mp-cards { background: var(--g4mp-c-surface); }
.g4mp-cards__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-cards__head .g4mp-title { margin-bottom: 12px; }
.g4mp-cards__head .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-cards__grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.g4mp-card { position: relative; display: block; width: 100%; aspect-ratio: 2 / 3; overflow: hidden; border-radius: var(--g4mp-c-radius); background: var(--g4mp-c-ink); }
.g4mp-card--link { appearance: none; -webkit-appearance: none; border: 0; padding: 0; margin: 0; font: inherit; text-align: left; color: inherit; text-decoration: none; cursor: pointer; }
.g4mp-card__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
.g4mp-card__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
.g4mp-card--link:hover .g4mp-card__img { transform: scale(1.04); }
.g4mp-card--link:focus-visible { outline: 2px solid var(--g4mp-c-ink); outline-offset: 2px; }
.g4mp-card__overlay { position: absolute; left: 0; right: 0; bottom: 0; height: 82px; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 16px 14px; background: rgba(0, 0, 0, 0.55); }
.g4mp-card__title { display: block; color: #fff; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.12; }
.g4mp-card__sub { display: block; color: rgba(255,255,255,0.82); font-size: 14px; line-height: 1.4; margin-top: 5px; }

/* \u2500\u2500 Desktop (real wide viewport, unless mobile preview is forced) \u2500\u2500 */
@media (min-width: 768px) {
  .g4mp:not(.g4mp--mobile) .g4mp-section { padding: 80px 48px; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero { min-height: 70vh; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero__inner { padding: 56px; }
  .g4mp:not(.g4mp--mobile) .g4mp-title { font-size: 48px; }
  .g4mp:not(.g4mp--mobile) .g4mp-story__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
  .g4mp:not(.g4mp--mobile) .g4mp-story__copy { order: 1; }
  .g4mp:not(.g4mp--mobile) .g4mp-story__media { order: 2; }
  .g4mp:not(.g4mp--mobile) .g4mp-grid__items { grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-cta__inner { flex-direction: row; justify-content: space-between; text-align: left; }
  .g4mp:not(.g4mp--mobile) .g4mp-cards__grid--2 { grid-template-columns: repeat(2, 1fr); max-width: 720px; margin-left: auto; margin-right: auto; }
  .g4mp:not(.g4mp--mobile) .g4mp-cards__grid--3 { grid-template-columns: repeat(3, 1fr); }
  .g4mp:not(.g4mp--mobile) .g4mp-cards__grid--4 { grid-template-columns: repeat(4, 1fr); }
  .g4mp:not(.g4mp--mobile) .g4mp-card__title { font-size: 24px; }
  .g4mp:not(.g4mp--mobile) .g4mp-card__overlay { height: 94px; padding: 0 20px 16px; }
}

/* \u2550\u2550 Catalog 0.5.0 \u2550\u2550 */
.g4mp ul, .g4mp ol { margin: 0; padding: 0; list-style: none; }
.g4mp blockquote, .g4mp figure { margin: 0; }
.g4mp-title { text-wrap: balance; }

/* One class for every image of the catalog. */
.g4mp-img { display: block; object-fit: cover; }

/* A section without a heading joins the previous one with the same background. */
.g4mp-section.g4mp-section--joined { padding-top: 0; }

/* Section heading: centred above grids, --left in text sections. */
.g4mp-head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-head .g4mp-title { margin-bottom: 12px; }
.g4mp-head .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-head > :last-child { margin-bottom: 0; }
.g4mp-head--left { margin-left: 0; text-align: left; }
.g4mp-grid__head > :last-child, .g4mp-cards__head > :last-child,
.g4mp-text__inner > :last-child, .g4mp-story__copy > :last-child { margin-bottom: 0; }

/* Button pair */
.g4mp-btn--outline { background: transparent; color: var(--g4mp-c-ondark); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.85); }
.g4mp-btn--outline-dark { background: transparent; color: var(--g4mp-c-ink); box-shadow: inset 0 0 0 1.5px var(--g4mp-c-ink); }
.g4mp-hero .g4mp-btn:focus-visible, .g4mp-cta .g4mp-btn:focus-visible { outline-color: var(--g4mp-c-ondark); }
.g4mp-btns { display: flex; flex-wrap: wrap; gap: 10px; }
.g4mp-text__inner .g4mp-btns { justify-content: center; margin-top: 24px; }
.g4mp-story__copy .g4mp-btns { margin-top: 24px; }

/* Hero cover height \u2014 an editor frame sets --g4mp-hero-h (vh counts the window). */
.g4mp-hero { min-height: var(--g4mp-hero-h, 56vh); }
/* 0.4.1 bug: these margins lost to the ".g4mp p { margin: 0 }" reset. */
.g4mp .g4mp-hero__body { margin-bottom: 22px; }
.g4mp .g4mp-hero__body:last-child, .g4mp-hero .g4mp-title:last-child { margin-bottom: 0; }

/* Hero split \u2014 text next to a portrait image */
.g4mp-hero-split { background: var(--g4mp-c-bg); }
.g4mp-hero-split__grid { display: flex; flex-direction: column; gap: 28px; }
.g4mp-hero-split__media { order: -1; }
.g4mp-hero-split__img { width: 100%; aspect-ratio: 4 / 5; border-radius: var(--g4mp-c-radius); }
.g4mp-hero-split__copy { min-width: 0; }
.g4mp-hero-split .g4mp-eyebrow { color: var(--g4mp-c-muted); margin-bottom: 12px; }
.g4mp-hero-split__title { font-size: 38px; line-height: 1.04; letter-spacing: -0.03em; }
.g4mp .g4mp-hero-split__body { font-size: 17px; line-height: 1.55; max-width: 460px; margin-top: 16px; white-space: pre-line; }
.g4mp-hero-split .g4mp-btns { margin-top: 26px; }

/* Story \u2014 image side; the 4:3 frame keeps the top of a portrait photo */
.g4mp-story__copy { min-width: 0; }
.g4mp-story__img { object-position: 50% 12%; }

/* Gallery (replaces team / materials): captions, one image = banner */
.g4mp-grid__cell { margin: 0; }
.g4mp-grid__cell .g4mp-img { width: 100%; height: 100%; }
.g4mp-grid__fig { margin: 0; min-width: 0; }
.g4mp-grid__cap { margin-top: 10px; font-size: 14px; font-weight: 600; line-height: 1.35; }
.g4mp-grid__subcap { display: block; font-size: 13px; font-weight: 400; color: var(--g4mp-c-muted); margin-top: 2px; }
.g4mp-grid__items--captions { row-gap: 28px; }
.g4mp-grid__items--1 { grid-template-columns: 1fr; }
.g4mp-grid__items--1 .g4mp-grid__cell { aspect-ratio: 16 / 9; }


/* Collections */
.g4mp-collections { background: var(--g4mp-c-surface); }
.g4mp-card__sub + .g4mp-card__sub { margin-top: 1px; }
/* Two lines (season + shipping): taller band, names aligned to its top. */
.g4mp-cards__grid--tall .g4mp-card__overlay { height: 104px; justify-content: flex-start; padding-top: 14px; }

/* Products \u2014 no prices */
.g4mp-products { background: var(--g4mp-c-bg); }
.g4mp-products__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 16px; }
.g4mp-product { display: block; text-decoration: none; color: inherit; min-width: 0; }
.g4mp-product__frame { display: block; aspect-ratio: 4 / 5; overflow: hidden; border-radius: var(--g4mp-c-radius); background: var(--g4mp-c-surface-2); }
/* The 4:5 frame of a 2:3 photo cuts more of the bottom than of the top. */
.g4mp-product__img { width: 100%; height: 100%; object-position: 50% 30%; transition: transform 0.45s ease; }
.g4mp-product:hover .g4mp-product__img { transform: scale(1.03); }
.g4mp-product:focus-visible { outline: 2px solid var(--g4mp-c-ink); outline-offset: 4px; border-radius: var(--g4mp-c-radius); }
.g4mp .g4mp-product__name { margin-top: 12px; font-size: 14px; font-weight: 600; line-height: 1.3; letter-spacing: -0.005em; }
.g4mp-product__cat { display: block; margin-top: 2px; font-size: 13px; line-height: 1.4; color: var(--g4mp-c-muted); }

/* Key facts */
.g4mp-facts { background: var(--g4mp-c-bg); }
.g4mp-facts__list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 16px; }
.g4mp-fact { border-top: 1px solid var(--g4mp-c-line); padding-top: 14px; min-width: 0; }
.g4mp-fact__value { display: block; font-size: 44px; line-height: 1; font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.g4mp-fact__label { display: block; margin-top: 8px; font-size: 14px; line-height: 1.4; color: var(--g4mp-c-muted); }

/* Features \u2014 numbered */
.g4mp-features { background: var(--g4mp-c-bg); }
.g4mp-features__list { display: grid; grid-template-columns: 1fr; gap: 28px; }
.g4mp-feature { min-width: 0; }
.g4mp-feature__img { width: 100%; aspect-ratio: 3 / 2; border-radius: var(--g4mp-c-radius); margin-bottom: 16px; }
.g4mp-feature__text { border-top: 1px solid var(--g4mp-c-line); padding-top: 16px; }
.g4mp-feature--media .g4mp-feature__text { border-top: 0; padding-top: 0; }
.g4mp-feature__no { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; color: var(--g4mp-c-muted); font-variant-numeric: tabular-nums; }
.g4mp .g4mp-feature__title { margin-top: 10px; font-size: 20px; line-height: 1.2; font-weight: 700; letter-spacing: -0.01em; }
.g4mp .g4mp-feature__body { margin-top: 8px; font-size: 15px; line-height: 1.6; white-space: pre-line; }

/* Quotes \u2014 one large quote or cards */
.g4mp-quotes { background: var(--g4mp-c-bg); }
.g4mp-quotes__grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.g4mp-quote { display: flex; flex-direction: column; gap: 24px; padding: 24px; border-radius: var(--g4mp-c-radius); background: var(--g4mp-c-surface); border: 1px solid var(--g4mp-c-line); min-width: 0; }
.g4mp-quote__text { font-size: 17px; line-height: 1.55; font-weight: 500; quotes: "\\201C" "\\201D"; }
.g4mp-quote__text::before { content: open-quote; }
.g4mp-quote__text::after { content: close-quote; }
.g4mp-quote__by { display: flex; align-items: center; gap: 12px; margin-top: auto; min-height: 44px; }
.g4mp-quote__avatar { width: 44px; height: 44px; border-radius: 50%; flex: none; }
.g4mp-quote__name { display: block; font-size: 14px; font-weight: 700; line-height: 1.3; }
.g4mp-quote__role { display: block; font-size: 13px; line-height: 1.4; color: var(--g4mp-c-muted); }
.g4mp .g4mp-quote--solo { max-width: 820px; margin: 0 auto; padding: 0; border: 0; background: none; align-items: center; text-align: center; gap: 28px; }
.g4mp-quote--solo .g4mp-quote__text { font-size: 24px; line-height: 1.25; font-weight: 600; letter-spacing: -0.02em; text-wrap: balance; }
.g4mp-quote--solo .g4mp-quote__by { flex-direction: column; gap: 10px; margin-top: 0; min-height: 0; }

/* Logos \u2014 one wrapping row, greyed */
.g4mp-logos { background: var(--g4mp-c-surface); }
.g4mp .g4mp-logos__title { margin-bottom: 28px; text-align: center; color: var(--g4mp-c-muted); }
.g4mp-logos__list { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 24px 36px; }
.g4mp-logo { height: 28px; width: auto; filter: grayscale(1); opacity: 0.6; }

/* FAQ \u2014 <details> with thin lines */
.g4mp-faq { background: var(--g4mp-c-surface); }
.g4mp-faq__inner { max-width: 760px; margin: 0 auto; }
.g4mp-faq__inner .g4mp-title { margin-bottom: 24px; }
.g4mp-faq__list { border-top: 1px solid var(--g4mp-c-line); }
.g4mp-faq__item { border-bottom: 1px solid var(--g4mp-c-line); }
.g4mp-faq__q { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 0; cursor: pointer; list-style: none; }
.g4mp-faq__q::-webkit-details-marker { display: none; }
.g4mp-faq__q:focus-visible { outline: 2px solid var(--g4mp-c-ink); outline-offset: 2px; }
.g4mp .g4mp-faq__qt { font-size: 17px; line-height: 1.35; font-weight: 600; letter-spacing: -0.005em; }
.g4mp-faq__sign { position: relative; flex: none; width: 14px; height: 14px; }
.g4mp-faq__sign::before, .g4mp-faq__sign::after { content: ""; position: absolute; background: var(--g4mp-c-ink); }
.g4mp-faq__sign::before { left: 0; right: 0; top: 6px; height: 2px; }
.g4mp-faq__sign::after { top: 0; bottom: 0; left: 6px; width: 2px; }
.g4mp-faq__item[open] .g4mp-faq__sign::after { display: none; }
.g4mp-faq__a { padding: 0 34px 20px 0; }

/* CTA \u2014 two buttons */
.g4mp .g4mp-cta__title { margin-bottom: 8px; }
.g4mp .g4mp-cta__sub { margin-bottom: 6px; }
.g4mp-cta__body { line-height: 1.5; }
.g4mp-cta__inner > div:first-child { min-width: 0; }
.g4mp-cta__inner > div:first-child > :last-child { margin-bottom: 0; }
.g4mp-cta .g4mp-btns { justify-content: center; flex: none; }

/* Contact */
.g4mp-contact { background: var(--g4mp-c-bg); }
.g4mp-contact__grid { display: flex; flex-direction: column; gap: 28px; }
.g4mp-contact__copy .g4mp-title { margin-bottom: 12px; }
.g4mp-contact__copy > :last-child { margin-bottom: 0; }
.g4mp-contact__list { display: grid; grid-template-columns: 1fr; gap: 20px; }
.g4mp-contact__item { border-top: 1px solid var(--g4mp-c-line); padding-top: 14px; min-width: 0; }
.g4mp-contact__label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--g4mp-c-muted); }
.g4mp-contact__value { display: block; margin-top: 8px; font-size: 16px; line-height: 1.5; white-space: pre-line; overflow-wrap: anywhere; }
a.g4mp-contact__value { color: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .g4mp-card__img, .g4mp-product__img, .g4mp-btn { transition: none; }
}

/* \u2500\u2500 Desktop (catalog) \u2500\u2500 */
@media (min-width: 768px) {
  .g4mp:not(.g4mp--mobile) .g4mp-section.g4mp-section--joined { padding-top: 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-head { margin-bottom: 40px; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero { min-height: var(--g4mp-hero-h, 70vh); }

  .g4mp:not(.g4mp--mobile) .g4mp-hero-split__grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 460px); gap: 72px; align-items: center; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero-split__media { order: 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero-split__title { font-size: 64px; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero-split__body { font-size: 18px; margin-top: 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero-split .g4mp-btns { margin-top: 32px; }

  .g4mp:not(.g4mp--mobile) .g4mp-story--left .g4mp-story__copy { order: 2; }
  .g4mp:not(.g4mp--mobile) .g4mp-story--left .g4mp-story__media { order: 1; }

  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--1 { grid-template-columns: 1fr; }
  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--1 .g4mp-grid__cell { aspect-ratio: 21 / 9; }
  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--2 { grid-template-columns: repeat(2, 1fr); }
  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--3 { grid-template-columns: repeat(3, 1fr); }

  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--captions { row-gap: 36px; }
  /* 0.4.1 bug: the 24px video caption title lost to the general 48px title. */
  .g4mp:not(.g4mp--mobile) .g4mp-video__caption .g4mp-title { font-size: 28px; }
  .g4mp:not(.g4mp--mobile) .g4mp-video__caption { margin-top: 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-cards__grid--tall .g4mp-card__overlay { height: 116px; padding-top: 18px; }

  .g4mp:not(.g4mp--mobile) .g4mp-products__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-product__name { font-size: 15px; }

  .g4mp:not(.g4mp--mobile) .g4mp-facts__list { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 0; border-top: 1px solid var(--g4mp-c-line); border-bottom: 1px solid var(--g4mp-c-line); }
  .g4mp:not(.g4mp--mobile) .g4mp-fact { border-top: 0; padding: 32px 0 32px 32px; border-left: 1px solid var(--g4mp-c-line); }
  .g4mp:not(.g4mp--mobile) .g4mp-fact:first-child { border-left: 0; padding-left: 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-fact__value { font-size: 64px; }
  .g4mp:not(.g4mp--mobile) .g4mp-fact__label { font-size: 15px; margin-top: 10px; }

  .g4mp:not(.g4mp--mobile) .g4mp-features__list { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 48px 32px; }
  .g4mp:not(.g4mp--mobile) .g4mp-features__list--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .g4mp:not(.g4mp--mobile) .g4mp-feature__text { padding-top: 20px; }

  .g4mp:not(.g4mp--mobile) .g4mp-quotes__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-quotes__grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .g4mp:not(.g4mp--mobile) .g4mp-quote { padding: 28px; }
  .g4mp:not(.g4mp--mobile) .g4mp-quote--solo { padding: 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-quote--solo .g4mp-quote__text { font-size: 34px; }

  .g4mp:not(.g4mp--mobile) .g4mp-logos__list { gap: 28px 56px; }
  .g4mp:not(.g4mp--mobile) .g4mp-logo { height: 32px; }

  .g4mp:not(.g4mp--mobile) .g4mp-faq__inner .g4mp-title { margin-bottom: 32px; }
  .g4mp:not(.g4mp--mobile) .g4mp-faq__q { padding: 22px 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-faq__qt { font-size: 18px; }
  .g4mp:not(.g4mp--mobile) .g4mp-faq__a { padding: 0 80px 24px 0; }

  .g4mp:not(.g4mp--mobile) .g4mp-cta .g4mp-btns { justify-content: flex-end; }

  .g4mp:not(.g4mp--mobile) .g4mp-contact__grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 56px; align-items: start; }
  .g4mp:not(.g4mp--mobile) .g4mp-contact__list { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
}

/* Formatted text (concept \xA711): paragraphs, inline links. */
.g4mp .g4mp-rich > p + p { margin-top: 0.75em; }
.g4mp-rich { white-space: normal; }
.g4mp-link { color: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.g4mp-link:hover { text-decoration-thickness: 2px; }
.g4mp-link:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
.g4mp-quote__text.g4mp-rich::before, .g4mp-quote__text.g4mp-rich::after { content: none; }
.g4mp-quote__text.g4mp-rich > p:first-child::before { content: open-quote; }
.g4mp-quote__text.g4mp-rich > p:last-child::after { content: close-quote; }
.g4mp-logos__link { display: inline-flex; align-items: center; gap: 4px; color: inherit; text-decoration: none; }

/* Editor: an empty section shows its name and the missing field. */
.g4mp-empty { background: var(--g4mp-c-surface); }
.g4mp-empty__box { max-width: 1120px; margin: 0 auto; padding: 28px 24px; border: 1.5px dashed var(--g4mp-c-line); border-radius: var(--g4mp-c-radius); text-align: center; color: var(--g4mp-c-muted); }
.g4mp .g4mp-empty__type { font-size: 15px; font-weight: 700; color: var(--g4mp-c-ink); }
.g4mp .g4mp-empty__field { margin-top: 4px; font-size: 13px; }
`;

// src/MarketingPage.tsx
import { jsx as jsx21, jsxs as jsxs20 } from "react/jsx-runtime";
function MarketingPage({
  sections,
  resolveHref,
  onLinkClick,
  onCtaClick,
  forceMobile = false,
  transformImageUrl,
  injectStyles = true,
  labels,
  editorMode = false,
  onSectionClick,
  renderInsertSlot,
  className,
  fileMode = false
}) {
  if (fileMode) editorMode = false;
  const plan = planPage(sections, resolveHref, fileMode);
  const host = {
    resolveHref,
    onLinkClick,
    onCtaClick,
    forceMobile,
    transform: transformImageUrl ? { fn: transformImageUrl, resizes: true } : { fn: (url) => url, resizes: false },
    labels: mergeLabels(labels),
    editorMode,
    onSectionClick,
    fileMode
  };
  const Root = fileMode ? "main" : "div";
  const rootAttrs = fileMode ? { [FILE_ATTR.page]: "", [FILE_ATTR.format]: String(CONTRACT_VERSION) } : {};
  return /* @__PURE__ */ jsx21(PageContext.Provider, { value: host, children: /* @__PURE__ */ jsxs20(Root, { className: cx("g4mp", forceMobile && "g4mp--mobile", className), ...rootAttrs, children: [
    injectStyles && /* @__PURE__ */ jsx21("style", { dangerouslySetInnerHTML: { __html: MARKETING_CSS } }),
    plan.map((p, i) => {
      const Component = fileMode && FILE_DATA_TYPES.has(p.section.type) ? FileData : SECTION_COMPONENTS[p.section.type];
      const body2 = p.drawn || fileMode ? /* @__PURE__ */ jsx21(Component, { section: p.section }) : editorMode ? /* @__PURE__ */ jsx21(Empty, { section: p.section }) : null;
      const hidden = !p.section.is_visible;
      return /* @__PURE__ */ jsxs20(Fragment7, { children: [
        renderInsertSlot?.(i),
        /* @__PURE__ */ jsx21(
          SectionContext.Provider,
          {
            value: {
              id: p.section.id,
              type: p.section.type,
              h1: p.h1,
              first: p.first,
              joined: p.joined,
              ...fileMode ? { fileAttrs: sectionFileAttrs(p.section, hidden), hidden } : {}
            },
            children: body2
          }
        )
      ] }, `${i}:${p.section.id}`);
    }),
    renderInsertSlot?.(plan.length)
  ] }) });
}

// src/structuredData.ts
function buildStructuredData(sections, opts = {}) {
  const out = [];
  const questions = [];
  for (const { section, drawn } of planPage(sections, opts.resolveHref)) {
    if (!drawn) continue;
    if (section.type === "faq") {
      for (const it of drawnItems(section)) {
        const answer = richTextPlain(it.answer).trim();
        if (!answer) continue;
        questions.push({
          "@type": "Question",
          name: it.question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        });
      }
    }
    if (section.type === "collections" || section.type === "products") {
      const list = section.type === "collections" ? drawnCollections(section).map((c) => ({ name: c.name, link: c.link ?? { kind: "collection", id: c.id } })) : drawnProducts(section).map((p) => ({ name: p.name, link: p.link ?? { kind: "product", id: p.id } }));
      const items2 = list.filter((x) => x.name).map((x, i) => {
        const target = resolveTarget(x.link, opts.resolveHref);
        return { "@type": "ListItem", position: i + 1, name: x.name, ...target ? { url: target.href } : {} };
      });
      if (items2.length) {
        out.push({
          "@context": "https://schema.org",
          "@type": "ItemList",
          ...section.config.title ? { name: section.config.title } : {},
          itemListElement: items2
        });
      }
    }
  }
  if (questions.length) out.unshift({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions });
  return out;
}
function jsonLdScriptContent(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

// src/markdown.ts
var mdInline = (s) => s.replace(/[\\`*_[\]<>&]/g, (c) => `\\${c}`);
var mdLineStarts = (s) => s.split("\n").map((line) => line.replace(/^(\s*)([#+-]|\d+\.)(?=\s|$)/, "$1\\$2")).join("\n");
var mdText = (s) => mdLineStarts(mdInline(s));
var mdLine = (s) => mdText(s.replace(/\s*\n\s*/g, " ").trim());
var mdHref = (href) => href.replace(/[()\s]/g, (c) => encodeURIComponent(c));
var mdLink = (text, href) => `[${text}](${mdHref(href)})`;
function richToMd(v, resolveHref) {
  return richParagraphs(v).map(
    (p) => p.map((f2) => {
      let t = mdInline(f2.text).split("\n").join("  \n");
      if (!t.trim()) return t;
      if (f2.italic) t = `_${t}_`;
      if (f2.bold) t = `**${t}**`;
      const target = resolveTarget(f2.link, resolveHref);
      return target ? mdLink(t, target.href) : t;
    }).join("")
  ).map(mdLineStarts);
}
function sectionsToMarkdown(sections, opts = {}) {
  const { resolveHref } = opts;
  const labels = mergeLabels(opts.labels);
  const blocks = [];
  const heading = (h1, title2) => {
    if (has(title2)) blocks.push(`${h1 ? "#" : "##"} ${mdLine(title2)}`);
  };
  const para = (s) => {
    if (has(s)) blocks.push(mdText(s.trim()));
  };
  const rich = (v) => blocks.push(...richToMd(v, resolveHref).filter((p) => p.trim()));
  const buttons = (s) => {
    const links = drawnButtons(s.config.buttons, resolveHref).filter((b) => b.target).map((b) => mdLink(mdLine(b.button.label), b.target.href));
    if (links.length) blocks.push(links.join(" \xB7 "));
  };
  const list = (lines) => {
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
          drawnItems(s).filter((i) => has(i.caption)).map((i) => [mdLine(i.caption), has(i.subcaption) ? mdLine(i.subcaption) : ""].filter(Boolean).join(" \u2014 "))
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
          drawnItems(s).map((i) => ({ i, sub: typeof i.body === "string" ? i.body : void 0 })).filter(({ i, sub }) => has(i.title) || has(sub)).map(({ i, sub }) => {
            const target = resolveTarget(i.link, resolveHref);
            const name = mdLine(i.title ?? sub ?? "");
            const title2 = target ? mdLink(name, target.href) : name;
            return has(i.title) && has(sub) ? `${title2} \u2014 ${mdLine(sub)}` : title2;
          })
        );
        break;
      case "collections":
        heading(h1, c.title);
        list(
          drawnCollections(s).filter((it) => has(it.name)).map((it) => {
            const target = resolveTarget(it.link ?? { kind: "collection", id: it.id }, resolveHref);
            const name = target ? mdLink(mdLine(it.name), target.href) : mdLine(it.name);
            const styles = it.styles != null ? fill(it.styles === 1 ? labels.styles.one : labels.styles.other, { n: it.styles }) : void 0;
            const shipping = c.show_shipping && has(it.shipping) ? fill(labels.shipping, { date: it.shipping }) : void 0;
            const meta = [it.season, styles, shipping].filter(has).map(mdLine).join(" \xB7 ");
            return meta ? `${name} \u2014 ${meta}` : name;
          })
        );
        break;
      case "products":
        heading(h1, c.title);
        para(c.subtitle);
        list(
          drawnProducts(s).filter((p) => has(p.name)).map((p) => {
            const target = resolveTarget(p.link ?? { kind: "product", id: p.id }, resolveHref);
            const name = target ? mdLink(mdLine(p.name), target.href) : mdLine(p.name);
            return has(p.category) ? `${name} \u2014 ${mdLine(p.category)}` : name;
          })
        );
        break;
      case "facts":
        list(drawnItems(s).map((i) => [`**${mdLine(i.value)}**`, has(i.label) ? mdLine(i.label) : ""].filter(Boolean).join(" ")));
        break;
      case "features":
        heading(h1, c.title);
        list(
          drawnItems(s).map((i) => {
            const body2 = richToMd(i.body, resolveHref).join(" ");
            return [has(i.title) ? `**${mdLine(i.title)}**` : "", body2].filter(Boolean).join(" \u2014 ");
          })
        );
        break;
      case "quotes":
        heading(h1, c.title);
        for (const q of drawnItems(s)) {
          const text = richToMd(q.text, resolveHref).map((p) => `> ${p}`).join("\n>\n");
          const by = [q.author, q.role].filter(has).map(mdLine).join(", ");
          blocks.push(`${text}
>
> \u2014 ${by}`);
        }
        break;
      case "logos":
        heading(h1, c.title);
        list(
          drawnItems(s).filter((i) => has(i.name) || has(i.media?.alt)).map((i) => {
            const name = mdLine(i.name ?? i.media.alt);
            const target = resolveTarget(i.link, resolveHref);
            return target ? mdLink(name, target.href) : name;
          })
        );
        break;
      case "faq":
        heading(h1, c.title);
        list(
          drawnItems(s).map((i) => {
            const answer = richToMd(i.answer, resolveHref).join("\n\n  ");
            return answer ? `**${mdLine(i.question)}**  
  ${answer}` : `**${mdLine(i.question)}**`;
          })
        );
        break;
      case "contact":
        heading(h1, c.title);
        rich(c.body);
        list(
          contactRows(s).map((r) => {
            const value = mdLine(r.value);
            return `${mdLine(labels.contact[r.key])}: ${r.href ? mdLink(value, r.href) : value}`;
          })
        );
        break;
    }
  }
  return blocks.length ? `${blocks.join("\n\n")}
` : "";
}

// src/cssHash.ts
var MARKETING_CSS_SHA256 = "sha256-hmt2+h9wJHcL9MuS5Ky1Qad3bpk5E266BOauvJ9BxVg=";
export {
  BUTTON_FIELD,
  CATALOG_GROUPS,
  CATALOG_VERSION,
  CONTRACT_ATTRIBUTES,
  CONTRACT_CLASSES,
  CONTRACT_VERSION,
  DEFAULT_LABELS,
  FILE_ATTR,
  LANDING_LINK_KINDS,
  MARKETING_CSS,
  MARKETING_CSS_SHA256,
  MarketingPage,
  SECTION_CATALOG,
  SECTION_TYPES,
  TEXT_LIMITS,
  buildStructuredData,
  catalogEntry,
  ctaLink,
  hasRichText,
  isUuid,
  itemListAttr,
  jsonLdScriptContent,
  normalizeLink,
  normalizeMedia,
  normalizeRichText,
  normalizeSection,
  optionAttr,
  optionFields,
  pageFileInstructions,
  richTextFromHtml,
  richTextPlain,
  richTextToHtml,
  safeExternalUrl,
  safeHref,
  safeImgSrc,
  sectionsToMarkdown
};
