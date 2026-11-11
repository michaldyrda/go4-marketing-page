/**
 * The component catalog (concept §5) — one source for the editor (palette,
 * fields, limits, crops), the HTML import and the server. Limits count text only.
 */
import type { LandingSectionType } from "./types";

/** Character limits from concept §5. */
export const TEXT_LIMITS = {
  eyebrow: 80,
  title: 80,
  subtitle: 120,
  body: 600,
  heroBody: 300,
  buttonLabel: 30,
  alt: 125,
} as const;

export type CatalogGroup = "Opening" | "Content" | "Media" | "From go4" | "Trust";
export const CATALOG_GROUPS: readonly CatalogGroup[] = ["Opening", "Content", "Media", "From go4", "Trust"];

export type CatalogFieldKind =
  | "text" // plain text, one line
  | "richtext" // formatted text (concept §11)
  | "image"
  | "media" // image or video
  | "video"
  | "link"
  | "choice"
  | "toggle"
  | "number"
  | "collection" // collection id
  | "product"; // product id

export interface CatalogField {
  key: string;
  kind: CatalogFieldKind;
  /** Character limit (text only). Absent = the concept sets none. */
  maxChars?: number;
  /** Closed list for `choice`. */
  options?: readonly string[];
}

/** Image frame, desktop / mobile, as `width:height`. */
export interface CatalogCrop {
  desktop: string;
  mobile: string;
}

export interface CatalogEntry {
  type: LandingSectionType;
  group: CatalogGroup;
  /** Layouts (closed list); the first is the default. */
  variants?: readonly string[];
  fields: readonly CatalogField[];
  /** Number of buttons. */
  buttons?: { min: number; max: number };
  /** Number and fields of `items[]`. */
  items?: { min: number; max: number; fields: readonly CatalogField[] };
  /** Image frames by slot (variant name, `image`, `one` / `many`, `cover`, `avatar`…). */
  crops?: Readonly<Record<string, CatalogCrop>>;
  /** Content drawn from data the host resolves (`section.resolved`). */
  resolved?: "collections" | "products" | "contact";
  /** Retired 0.4.x types read as this component. */
  legacyTypes?: readonly string[];
}

const L = TEXT_LIMITS;
const f = (key: string, kind: CatalogFieldKind, maxChars?: number, options?: readonly string[]): CatalogField =>
  ({ key, kind, ...(maxChars ? { maxChars } : {}), ...(options ? { options } : {}) });
const title = f("title", "text", L.title);
const subtitle = f("subtitle", "text", L.subtitle);
const body = f("body", "richtext", L.body);
const alt = f("alt", "text", L.alt);
const buttonLabel = f("label", "text", L.buttonLabel);

/** Version of the catalog contract (types, fields, classes). */
export const CATALOG_VERSION = 1;

export const SECTION_CATALOG: readonly CatalogEntry[] = [
  {
    type: "hero",
    group: "Opening",
    variants: ["cover", "split"],
    fields: [f("eyebrow", "text", L.eyebrow), title, f("body", "richtext", L.heroBody), f("media", "media"), alt, buttonLabel, f("link", "link")],
    buttons: { min: 0, max: 2 },
    crops: { cover: { desktop: "21:9", mobile: "4:5" }, split: { desktop: "4:5", mobile: "4:5" } },
  },
  {
    type: "cta",
    group: "Opening",
    fields: [title, body, buttonLabel, f("link", "link")],
    buttons: { min: 1, max: 2 },
  },
  {
    type: "text_block",
    group: "Content",
    fields: [title, subtitle, body, buttonLabel, f("link", "link")],
    buttons: { min: 0, max: 1 },
  },
  {
    type: "story",
    group: "Content",
    fields: [title, subtitle, body, f("media", "image"), alt, f("image_side", "choice", undefined, ["right", "left"]), buttonLabel, f("link", "link")],
    buttons: { min: 0, max: 1 },
    crops: { image: { desktop: "4:3", mobile: "4:3" } },
  },
  {
    type: "cards",
    group: "Content",
    fields: [title, subtitle, body],
    items: { min: 2, max: 4, fields: [f("media", "image"), alt, title, f("body", "text"), f("link", "link")] },
    crops: { image: { desktop: "2:3", mobile: "2:3" } },
  },
  {
    type: "faq",
    group: "Content",
    fields: [title],
    items: { min: 2, max: 12, fields: [f("question", "text"), f("answer", "richtext", L.body)] },
  },
  {
    type: "gallery",
    group: "Media",
    fields: [title, body],
    items: { min: 1, max: 12, fields: [f("media", "image"), alt, f("caption", "text"), f("subcaption", "text")] },
    crops: { one: { desktop: "21:9", mobile: "16:9" }, many: { desktop: "1:1", mobile: "1:1" } },
    legacyTypes: ["team", "materials"],
  },
  {
    type: "video",
    group: "Media",
    fields: [f("media", "video"), title, f("caption", "text")],
    crops: { poster: { desktop: "16:9", mobile: "16:9" } },
  },
  {
    type: "collections",
    group: "From go4",
    fields: [title, f("mode", "choice", undefined, ["all", "selected"]), f("limit", "number"), f("show_shipping", "toggle")],
    items: { min: 1, max: 12, fields: [f("collection_id", "collection")] },
    crops: { cover: { desktop: "2:3", mobile: "2:3" } },
    resolved: "collections",
  },
  {
    type: "products",
    group: "From go4",
    fields: [title, subtitle, f("mode", "choice", undefined, ["selected", "collection"]), f("collection_id", "collection"), f("limit", "number")],
    items: { min: 2, max: 8, fields: [f("product_id", "product")] },
    crops: { image: { desktop: "4:5", mobile: "4:5" } },
    resolved: "products",
  },
  {
    type: "contact",
    group: "From go4",
    fields: [title, body, f("show.address", "toggle"), f("show.email", "toggle"), f("show.website", "toggle"), f("show.instagram", "toggle")],
    resolved: "contact",
  },
  {
    type: "facts",
    group: "Trust",
    fields: [],
    items: { min: 2, max: 4, fields: [f("value", "text"), f("label", "text")] },
  },
  {
    type: "features",
    group: "Trust",
    fields: [title],
    items: { min: 2, max: 6, fields: [title, f("body", "richtext", L.body), f("media", "image"), alt] },
    crops: { image: { desktop: "3:2", mobile: "3:2" } },
  },
  {
    type: "quotes",
    group: "Trust",
    fields: [title],
    items: { min: 1, max: 6, fields: [f("text", "richtext", L.body), f("author", "text"), f("role", "text"), f("avatar", "image"), alt] },
    crops: { avatar: { desktop: "1:1", mobile: "1:1" } },
  },
  {
    type: "logos",
    group: "Trust",
    fields: [title],
    items: { min: 3, max: 12, fields: [f("media", "image"), f("name", "text", L.alt), f("link", "link")] },
  },
];

/** Catalog entry by type (own keys only). */
export const catalogEntry = (type: string): CatalogEntry | undefined =>
  SECTION_CATALOG.find((e) => e.type === type);
