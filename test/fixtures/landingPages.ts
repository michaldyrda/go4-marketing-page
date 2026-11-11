import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { MarketingSection } from "../../src/types";

/**
 * Pages in the new shape from the mockup of 2026-11-11 (concept §7).
 * - component gallery: all 15 types with neutral sample content — committed here.
 * - studio b3 / Måke: brand pages; not committed (no brand data in this repo).
 *   Read from G4MP_PAGES_DIR, else from the mockup folder of the main repo when
 *   present on this machine; tests skip without them.
 *
 * `_`-prefixed fields are mockup data that in production come from the host
 * in `section.resolved`; `toHostSections` moves them there.
 */
type Json = Record<string, any>;

const MOCKUP_PAGES = [
  process.env.G4MP_PAGES_DIR,
  join(process.env.HOME ?? "", "MyApps/100m-fashion/docs/mockups/2026-11-11-kreator-landing-page/pages"),
  join(process.env.HOME ?? "", "MyApps/100m-fashion/.claude/worktrees/kreator-landing-page-wdrozenie-cdd7a2/docs/mockups/2026-11-11-kreator-landing-page/pages"),
].filter((p): p is string => !!p && existsSync(join(p, "studio-b3.page.json")));

export const PAGES_DIR = MOCKUP_PAGES[0];

const read = (path: string): Json => JSON.parse(readFileSync(path, "utf8"));

export const GALLERY_PAGE = read(join(process.cwd(), "test/fixtures/pages/component-gallery.json"));
export const BRAND_PAGES: { name: string; page: Json }[] = PAGES_DIR
  ? ["studio-b3", "make-fashion"].map((name) => ({ name, page: read(join(PAGES_DIR, `${name}.page.json`)) }))
  : [];

/** Stable UUID for a sample id ("sample-1") — real pages already carry UUIDs. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const uuidFor = (id: string) =>
  UUID.test(id) ? id : `00000000-0000-4000-8000-${Buffer.from(id).toString("hex").padStart(12, "0").slice(-12)}`;

/** Mockup grey placeholder → an ordinary image URL. */
function placeholders(v: any): any {
  if (Array.isArray(v)) return v.map(placeholders);
  if (v && typeof v === "object") {
    if (v._placeholder === true) return { file_url: "https://cdn.example/sample.jpg", alt: v.alt, width: 800, height: 800 };
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, placeholders(x)]));
  }
  return v;
}

/** What the host does: section ids, and `_` fields of From-go4 sections → `resolved`. */
export function toHostSections(page: Json): MarketingSection[] {
  return (page.sections as Json[]).map((raw, i) => {
    const s = placeholders(raw);
    const c = s.config ?? {};
    // The gallery's video has no file in the mockup (poster only).
    if (s.type === "video" && c.media && !c.media.file_url) c.media = { ...c.media, file_url: "https://cdn.example/sample.mp4" };
    const section: MarketingSection = {
      id: `s${i}`,
      type: s.type,
      variant: s.variant,
      is_visible: true,
      order_index: i,
      config: c,
    };
    if (s.type === "collections") {
      section.resolved = {
        collections: (c._resolved ?? c.items ?? []).map((it: Json) => ({
          id: uuidFor(it.collection_id),
          name: it._name,
          season: it._season,
          styles: it._styles,
          shipping: it._shipping ?? undefined,
          cover: it._cover_url || it._cover_fallback ? { file_url: it._cover_url ?? it._cover_fallback } : undefined,
        })),
      };
    }
    if (s.type === "products") {
      section.resolved = {
        products: (c.items ?? []).map((it: Json) => ({
          id: uuidFor(it.product_id),
          name: it._name,
          category: it._category,
          image: it._image,
        })),
      };
    }
    if (s.type === "contact") section.resolved = { contact: c._brand };
    return section;
  });
}

/** Host resolver as in the portal: relative paths, external URL as is. */
export const resolveHref = (link: { kind: string; id?: string | null; url?: string | null }) =>
  link.kind === "catalog"
    ? "/b/order?collection=all"
    : link.kind === "collection"
      ? `/b/order?collection=${link.id}`
      : link.kind === "product"
        ? `/b/product/${link.id}`
        : link.kind === "external"
          ? link.url ?? null
          : null;
