import type { LandingSectionType } from "./types";

/**
 * Every text the package itself shows (wording from the accepted mockup,
 * 2026-11-11). A host passes `labels` to translate or adjust them; anything it
 * leaves out falls back to these.
 */
export const DEFAULT_LABELS = {
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
    contact: "Contact",
  } as Record<LandingSectionType, string>,
  /** Field names — the missing field in the empty state. */
  fields: {
    eyebrow: "Eyebrow",
    title: "Title",
    subtitle: "Subtitle",
    body: "Text",
    media: "Image",
    button: "Button",
    alt: "Alt text",
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
    instagram: "Instagram",
  },
};

export type MarketingLabels = typeof DEFAULT_LABELS;

/** Partial labels from the host, any depth. */
export type MarketingLabelsInput = {
  [K in keyof MarketingLabels]?: MarketingLabels[K] extends string ? string : Partial<MarketingLabels[K]>;
};

/** Host labels over the defaults; non-string values are ignored. */
export function mergeLabels(input?: MarketingLabelsInput | null): MarketingLabels {
  if (!input) return DEFAULT_LABELS;
  const pickStr = (v: unknown, d: string) => (typeof v === "string" ? v : d);
  const group = <T extends Record<string, string>>(d: T, v: unknown): T => {
    const out = { ...d };
    if (v && typeof v === "object") {
      for (const k of Object.keys(d) as (keyof T)[]) {
        if (Object.prototype.hasOwnProperty.call(v, k)) out[k] = pickStr((v as T)[k], d[k]) as T[keyof T];
      }
    }
    return out;
  };
  return {
    sections: group(DEFAULT_LABELS.sections, input.sections),
    fields: group(DEFAULT_LABELS.fields, input.fields),
    shipping: pickStr(input.shipping, DEFAULT_LABELS.shipping),
    styles: group(DEFAULT_LABELS.styles, input.styles),
    contact: group(DEFAULT_LABELS.contact, input.contact),
  };
}

/** `{name}` placeholders → values (plain text; React escapes the result). */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );
