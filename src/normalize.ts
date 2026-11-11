/**
 * `normalizeSection(raw)` — the ONE reader of stored sections (concept §4–§5, §8).
 *
 * Reads the legacy 0.4.x shape (`cta`, `media[]` with `role`, Hero `subtitle`,
 * types `team` / `materials`) and the new shape (`eyebrow`, `buttons[]` with
 * `link`, `media` object, `items[]`, `variant`, `image_side`, `mode`) and returns
 * the new shape with known keys only. Components draw only its output; the same
 * function rewrites stored data when the old shape is retired (E9).
 *
 * Validation on read (concept §12.3): unknown type → null; unknown keys, variants
 * and modes are dropped; ids must be UUIDs; URLs pass `safeHref` / `safeImgSrc`.
 */
import { ctaLink, normalizeLink } from "./links";
import { normalizeRichText } from "./richText";
import { isUuid, safeExternalUrl, safeHref, safeImgSrc } from "./sanitizeUrl";
import type {
  LandingButton,
  LandingContactToggles,
  LandingItem,
  LandingMedia,
  LandingResolved,
  LandingSection,
  LandingSectionConfig,
  LandingSectionType,
  MarketingCta,
  ResolvedCollection,
  ResolvedContact,
  ResolvedProduct,
} from "./types";

type Obj = Record<string, unknown>;

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
/** Own property only — never reads through a prototype (`__proto__` in content). */
const get = (o: unknown, k: string): unknown => (isObj(o) && own(o, k) ? o[k] : undefined);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Plain text field: string kept as written (empty → undefined); numbers become text. */
function str(v: unknown): string | undefined {
  if (typeof v === "string") return v.trim() ? v : undefined;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return undefined;
}
function bool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}
function int(v: unknown, min: number, max: number): number | undefined {
  return typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : undefined;
}
function dim(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) && v > 0 && v < 20000 ? Math.round(v) : undefined;
}
function oneOf<T extends string>(v: unknown, list: readonly T[]): T | undefined {
  return typeof v === "string" && (list as readonly string[]).includes(v) ? (v as T) : undefined;
}
/** Drops undefined keys so the output is a clean stored shape. */
function clean<T extends object>(o: T): T {
  for (const k of Object.keys(o) as (keyof T)[]) if (o[k] === undefined) delete o[k];
  return o;
}

/** Legacy CTA object behind a normalized button / card — only for hosts without `resolveHref`. */
const LEGACY_CTA = new WeakMap<object, MarketingCta>();
export const legacyCtaOf = (o: object): MarketingCta | undefined => LEGACY_CTA.get(o);

export const SECTION_TYPES: readonly LandingSectionType[] = [
  "hero", "text_block", "story", "gallery", "video", "cards", "collections", "products",
  "facts", "features", "quotes", "logos", "faq", "cta", "contact",
];
/** Retired 0.4.x types and their catalog component (concept §5). */
const LEGACY_TYPES: Record<string, LandingSectionType> = { team: "gallery", materials: "gallery" };

/* ── media ─────────────────────────────────────────────────────────────────── */

export function normalizeMedia(raw: unknown): LandingMedia | undefined {
  if (!isObj(raw)) return undefined;
  const type = oneOf(get(raw, "media_type"), ["image", "video"] as const);
  const poster = get(raw, "poster");
  const m: LandingMedia = clean({
    media_id: isUuid(get(raw, "media_id")) ? (get(raw, "media_id") as string) : undefined,
    source_media_id: isUuid(get(raw, "source_media_id")) ? (get(raw, "source_media_id") as string) : undefined,
    mobile_media_id: isUuid(get(raw, "mobile_media_id")) ? (get(raw, "mobile_media_id") as string) : undefined,
    media_type: type,
    file_url: safeImgSrc(str(get(raw, "file_url"))),
    mobile_file_url: safeImgSrc(str(get(raw, "mobile_file_url"))),
    alt: str(get(raw, "alt")),
    width: dim(get(raw, "width")),
    height: dim(get(raw, "height")),
    poster_url: safeImgSrc(str(get(raw, "poster_url")) ?? str(get(poster, "file_url"))),
  });
  return m.file_url || m.mobile_file_url || m.poster_url ? m : undefined;
}

const isImage = (m: unknown) =>
  get(m, "media_type") === "image" || (!get(m, "media_type") && !!get(m, "file_url"));

/** Legacy `media[]`: the item with one of the roles, else the first image. */
function pickLegacyImage(list: unknown[], roles: string[] = []): LandingMedia | undefined {
  const byRole = list.find((m) => roles.includes(get(m, "role") as string));
  return normalizeMedia(byRole ?? list.find(isImage));
}

/** `media` of either shape: object (new) or `media[]` (legacy). */
function mediaField(v: unknown, roles?: string[]): LandingMedia | undefined {
  return Array.isArray(v) ? pickLegacyImage(v, roles) : normalizeMedia(v);
}

/* ── buttons ───────────────────────────────────────────────────────────────── */

function normalizeButton(raw: unknown): LandingButton | undefined {
  const label = str(get(raw, "label"));
  if (!label) return undefined;
  return { label, link: normalizeLink(get(raw, "link")) };
}

/** `buttons[]` (new) or the single legacy `cta` (only where 0.4.x drew it). */
function buttonsField(config: Obj, max: number, legacyCta: boolean): LandingButton[] | undefined {
  if (own(config, "buttons")) {
    const list = arr(config.buttons).map(normalizeButton).filter((b): b is LandingButton => !!b);
    return list.length ? list.slice(0, max) : undefined;
  }
  const cta = get(config, "cta");
  if (!legacyCta || !isObj(cta)) return undefined;
  const label = str(get(cta, "label"));
  if (!label) return undefined;
  const button: LandingButton = { label, link: normalizeLink(ctaLink(cta as MarketingCta)) };
  LEGACY_CTA.set(button, cta as MarketingCta);
  return [button];
}

/* ── items per type ────────────────────────────────────────────────────────── */

function items<T>(v: unknown, fn: (raw: unknown) => T | undefined): T[] | undefined {
  const out = arr(v).map(fn).filter((x): x is T => x !== undefined);
  return out.length ? out : undefined;
}

const galleryItem = (raw: unknown): LandingItem | undefined => {
  if (!isObj(raw)) return undefined;
  // New: { media: {…}, caption, subcaption } · template file / legacy: the media object itself.
  const media = own(raw, "media") ? normalizeMedia(raw.media) : isImage(raw) ? normalizeMedia(raw) : undefined;
  if (!media) return undefined;
  return clean({ media, caption: str(get(raw, "caption")), subcaption: str(get(raw, "subcaption")) });
};

const cardItem = (raw: unknown): LandingItem | undefined => {
  if (!isObj(raw)) return undefined;
  const legacy = get(raw, "cta");
  const media = own(raw, "media")
    ? normalizeMedia(raw.media)
    : normalizeMedia({ ...pick(raw, ["file_url", "mobile_file_url", "alt", "width", "height"]), media_type: "image" });
  const link = own(raw, "link")
    ? normalizeLink(raw.link)
    : isObj(legacy)
      ? normalizeLink(ctaLink(legacy as MarketingCta))
      : null;
  const item: LandingItem = clean({
    title: str(get(raw, "title")),
    body: str(get(raw, "body")),
    media,
    link: link ?? undefined,
  });
  if (!own(raw, "link") && isObj(legacy)) LEGACY_CTA.set(item, legacy as MarketingCta);
  return item.title || item.body || item.media || item.link || LEGACY_CTA.has(item) ? item : undefined;
};

function pick(o: Obj, keys: string[]): Obj {
  const out: Obj = {};
  for (const k of keys) if (own(o, k)) out[k] = o[k];
  return out;
}

const idItem = (key: "collection_id" | "product_id") => (raw: unknown): LandingItem | undefined => {
  const id = get(raw, key);
  return isUuid(id) ? { [key]: id.toLowerCase() } : undefined;
};

const factItem = (raw: unknown): LandingItem | undefined => {
  const value = str(get(raw, "value"));
  return value ? clean({ value, label: str(get(raw, "label")) }) : undefined;
};

const featureItem = (raw: unknown): LandingItem | undefined => {
  const item: LandingItem = clean({
    title: str(get(raw, "title")),
    body: normalizeRichText(get(raw, "body")),
    media: normalizeMedia(get(raw, "media")),
  });
  return item.title || item.body ? item : undefined;
};

const quoteItem = (raw: unknown): LandingItem | undefined => {
  const item: LandingItem = clean({
    text: normalizeRichText(get(raw, "text")),
    author: str(get(raw, "author")),
    role: str(get(raw, "role")),
    avatar: normalizeMedia(get(raw, "avatar")),
  });
  return item.text ? item : undefined;
};

const logoItem = (raw: unknown): LandingItem | undefined => {
  const media = normalizeMedia(get(raw, "media"));
  if (!media) return undefined;
  const link = normalizeLink(get(raw, "link"));
  return clean({ name: str(get(raw, "name")), media, link: link ?? undefined });
};

const faqItem = (raw: unknown): LandingItem | undefined => {
  const question = str(get(raw, "question"));
  return question ? clean({ question, answer: normalizeRichText(get(raw, "answer")) }) : undefined;
};

/* ── data resolved by the host ─────────────────────────────────────────────── */

function resolvedCollection(raw: unknown): ResolvedCollection | undefined {
  const id = get(raw, "id");
  if (!isUuid(id)) return undefined;
  const link = normalizeLink(get(raw, "link"));
  return clean({
    id: id.toLowerCase(),
    name: str(get(raw, "name")),
    season: str(get(raw, "season")),
    styles: int(get(raw, "styles"), 0, 1_000_000),
    shipping: str(get(raw, "shipping")),
    cover: normalizeMedia(get(raw, "cover")),
    link: link ?? undefined,
  });
}

function resolvedProduct(raw: unknown): ResolvedProduct | undefined {
  const id = get(raw, "id");
  if (!isUuid(id)) return undefined;
  const link = normalizeLink(get(raw, "link"));
  return clean({
    id: id.toLowerCase(),
    name: str(get(raw, "name")),
    category: str(get(raw, "category")),
    image: normalizeMedia(get(raw, "image")),
    link: link ?? undefined,
  });
}

const INSTAGRAM_HANDLE = /^@?[A-Za-z0-9._]{1,30}$/;

function resolvedContact(raw: unknown): ResolvedContact | undefined {
  if (!isObj(raw)) return undefined;
  const email = str(get(raw, "email"))?.trim();
  const website = str(get(raw, "website"))?.trim();
  const instagram = str(get(raw, "instagram"))?.trim();
  const c: ResolvedContact = clean({
    address: str(get(raw, "address")),
    email: email && safeHref(`mailto:${email}`) ? email : undefined,
    website: website && safeExternalUrl(/^https?:\/\//i.test(website) ? website : `https://${website}`) ? website : undefined,
    instagram: instagram && INSTAGRAM_HANDLE.test(instagram) ? instagram : undefined,
  });
  return Object.keys(c).length ? c : undefined;
}

function normalizeResolved(type: LandingSectionType, raw: unknown): LandingResolved | undefined {
  if (!isObj(raw)) return undefined;
  if (type === "collections") {
    const list = items(get(raw, "collections"), resolvedCollection);
    return list ? { collections: list } : undefined;
  }
  if (type === "products") {
    const list = items(get(raw, "products"), resolvedProduct);
    return list ? { products: list } : undefined;
  }
  if (type === "contact") {
    const contact = resolvedContact(get(raw, "contact"));
    return contact ? { contact } : undefined;
  }
  return undefined;
}

/* ── config per type ───────────────────────────────────────────────────────── */

function normalizeConfig(type: LandingSectionType, c: Obj, raw: Obj, legacyType: boolean): LandingSectionConfig {
  const title = str(get(c, "title"));
  const subtitle = str(get(c, "subtitle"));
  const body = normalizeRichText(get(c, "body"));
  switch (type) {
    case "hero":
      return clean({
        variant: oneOf(get(c, "variant") ?? get(raw, "variant"), ["cover", "split"] as const) ?? "cover",
        // Legacy Hero: subtitle above the title → eyebrow.
        eyebrow: str(get(c, "eyebrow")) ?? subtitle,
        title,
        body,
        media: mediaField(get(c, "media"), ["hero_image", "background"]),
        buttons: buttonsField(c, 2, true),
      });
    case "text_block":
      return clean({ title, subtitle, body, buttons: buttonsField(c, 1, false) });
    case "story":
      return clean({
        title,
        subtitle,
        body,
        media: mediaField(get(c, "media")),
        buttons: buttonsField(c, 1, false),
        image_side: oneOf(get(c, "image_side"), ["left", "right"] as const),
      });
    case "gallery":
      return clean({
        title,
        subtitle,
        body,
        // Legacy team / materials: every image of `media[]`, in order.
        items: legacyType
          ? items(arr(get(c, "media")).filter(isImage), galleryItem)
          : items(get(c, "items"), galleryItem),
      });
    case "video": {
      const media = get(c, "media");
      const video = Array.isArray(media)
        ? normalizeMedia(media.find((m) => get(m, "media_type") === "video" && get(m, "file_url")))
        : normalizeMedia(media);
      return clean({ title, caption: str(get(c, "caption")), media: video?.file_url ? { ...video, media_type: "video" } : undefined });
    }
    case "cards":
      return clean({ title, subtitle, body, items: items(get(c, "items"), cardItem) });
    case "collections":
      return clean({
        title,
        mode: oneOf(get(c, "mode"), ["all", "selected"] as const),
        items: items(get(c, "items"), idItem("collection_id")),
        limit: int(get(c, "limit"), 1, 100),
        show_shipping: bool(get(c, "show_shipping")),
      });
    case "products":
      return clean({
        title,
        subtitle,
        mode: oneOf(get(c, "mode"), ["selected", "collection"] as const),
        items: items(get(c, "items"), idItem("product_id")),
        collection_id: isUuid(get(c, "collection_id")) ? (get(c, "collection_id") as string).toLowerCase() : undefined,
        limit: int(get(c, "limit"), 1, 100),
      });
    case "facts":
      return clean({ items: items(get(c, "items"), factItem) });
    case "features":
      return clean({ title, items: items(get(c, "items"), featureItem) });
    case "quotes":
      return clean({ title, items: items(get(c, "items"), quoteItem) });
    case "logos":
      return clean({ title, items: items(get(c, "items"), logoItem) });
    case "faq":
      return clean({ title, items: items(get(c, "items"), faqItem) });
    case "cta":
      return clean({ title, subtitle, body, buttons: buttonsField(c, 2, true) });
    case "contact": {
      const show = get(c, "show");
      const toggles: LandingContactToggles = clean({
        address: bool(get(show, "address")),
        email: bool(get(show, "email")),
        website: bool(get(show, "website")),
        instagram: bool(get(show, "instagram")),
      });
      return clean({ title, body, show: Object.keys(toggles).length ? toggles : undefined });
    }
  }
}

/**
 * Stored section (legacy or new shape) → normalized section, or null for an
 * unknown type. Pure; keeps only known keys; never throws on bad content.
 */
export function normalizeSection(raw: unknown): LandingSection | null {
  if (!isObj(raw)) return null;
  const rawType = get(raw, "type");
  if (typeof rawType !== "string") return null;
  const legacyType = own(LEGACY_TYPES, rawType);
  const type = legacyType ? LEGACY_TYPES[rawType] : oneOf(rawType, SECTION_TYPES);
  if (!type) return null;
  const config = normalizeConfig(type, isObj(raw.config) ? raw.config : {}, raw, legacyType);
  const id = get(raw, "id");
  const order = get(raw, "order_index");
  const section: LandingSection = {
    id: typeof id === "string" ? id : typeof id === "number" ? String(id) : "",
    type,
    is_visible: get(raw, "is_visible") !== false,
    order_index: typeof order === "number" && Number.isFinite(order) ? order : 0,
    config,
  };
  const resolved = normalizeResolved(type, get(raw, "resolved"));
  if (resolved) section.resolved = resolved;
  return section;
}
