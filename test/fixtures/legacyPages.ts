import type { MarketingSection } from "../../src/types";

/**
 * Five pages in the legacy (0.4.1) shape, modelled on the five production pages
 * of 2026-11-11 (same section types, visibility mix, CTA kinds, media roles and
 * empty fields) with invented text and URLs — no production data in this repo.
 */
const img = (name: string, role = "gallery") => ({
  role,
  media_type: "image",
  file_url: `https://cdn.example/media/${name}.jpg`,
});

const s = (
  id: string,
  type: string,
  order_index: number,
  config: MarketingSection["config"],
  is_visible = true,
): MarketingSection => ({ id, type, order_index, is_visible, config });

export const LEGACY_PAGES: { name: string; sections: MarketingSection[] }[] = [
  {
    name: "published launch",
    sections: [
      s("p1-hero", "hero", 0, {
        title: "spring-summer 2027",
        subtitle: "Two collections and the essentials line",
        body: "",
        media: [img("hero-wide")],
        cta: { type: "external_link", url: "order?collection=all", label: "Explore All Collections" },
      }),
      s("p1-cards", "cards", 1, {
        title: "",
        body: "Flexible shipping: January or February.\n\nMade to mix and match.\n",
        cta: null,
        items: [
          { title: "Collection #1", body: "Shipping: from January", file_url: "https://cdn.example/media/c1.jpg", cta: { type: "collection", label: "Collection 1", collection_id: "11111111-1111-4111-8111-111111111111" } },
          { title: "Collection #2", body: "Shipping: from February", file_url: "https://cdn.example/media/c2.jpg", cta: { type: "collection", label: "Collection 2", collection_id: "22222222-2222-4222-8222-222222222222" } },
          { title: "Essentials", body: "Always available", file_url: "https://cdn.example/media/c3.jpg", cta: { type: "collection", label: "Essentials", collection_id: "33333333-3333-4333-8333-333333333333" } },
        ],
      }),
      s("p1-story", "story", 2, {
        title: "Essentials",
        subtitle: "",
        body: "A permanent line that grows every season.",
        media: [img("story")],
        cta: null,
      }),
      s("p1-team", "team", 3, { title: "Meet the Team", subtitle: "", body: "Hidden section.", media: [], cta: null }, false),
      s("p1-materials", "materials", 4, {
        title: "Materials",
        subtitle: "",
        body: "Soft cotton jerseys and lightweight poplins.",
        media: [img("m1", "hero_image"), img("m2"), img("m3"), img("m4")],
        cta: null,
      }),
      s("p1-text", "text_block", 5, { title: "Highlights", subtitle: "", body: "Hidden text.", media: [], cta: null }, false),
      s("p1-cta", "cta", 6, {
        title: "Ready to Order?",
        subtitle: "",
        body: "Start your order today.",
        media: [],
        cta: { url: "", type: "order_form", label: "Start Order" },
      }),
      s("p1-video", "video", 7, {
        title: "Behind the Collection",
        caption: "Short description of the film",
        media: [{ role: "video_main", media_id: null, media_type: "video" } as never],
      }, false),
    ],
  },
  {
    name: "draft with mobile crops",
    sections: [
      s("p2-hero", "hero", 0, {
        title: "Shadow",
        subtitle: "FW",
        body: "Body under the title.",
        media: [{ ...img("hero2", "hero_image"), mobile_file_url: "https://cdn.example/media/hero2-m.jpg" }],
        cta: { type: "order_form", label: "Order now" },
      }),
      s("p2-text", "text_block", 1, { title: "About", subtitle: "Sub", body: "Line one\nLine two", cta: null }),
      s("p2-story", "story", 2, { title: "", subtitle: "Only subtitle", body: "Story body", media: [{ ...img("st2"), mobile_file_url: "https://cdn.example/media/st2-m.jpg" }] }),
      s("p2-cards", "cards", 3, {
        title: "Shop the icons",
        subtitle: "Picked",
        items: [
          { title: "Hoodie", body: "Heavyweight.", file_url: "https://cdn.example/media/h.jpg", mobile_file_url: "https://cdn.example/media/h-m.jpg" },
          { title: "Pants", body: "Relaxed." },
        ],
      }),
      s("p2-video", "video", 4, { title: "Film", caption: "Caption", media: [{ role: "video_main", media_type: "video", file_url: "https://cdn.example/media/film.mp4" }] }),
      s("p2-cta", "cta", 5, { title: "Questions?", body: "Write to us.", cta: { type: "external_link", url: "https://brand.example/contact", label: "Contact" } }),
      s("p2-materials", "materials", 6, { title: "", subtitle: "", body: "", media: [] }),
    ],
  },
  {
    name: "draft without hero",
    sections: [
      s("p3-text", "text_block", 0, { title: "Capsule", subtitle: "", body: "Small drop.", cta: null }),
      s("p3-team", "team", 1, { title: "Team", subtitle: "Makers", body: "People.", media: [img("t1"), img("t2")] }),
      s("p3-cta", "cta", 2, { title: "Order", body: "", cta: { type: "collection", collection_id: "44444444-4444-4444-8444-444444444444", label: "See it" } }),
      s("p3-cards-empty", "cards", 3, { title: "Empty", items: [] }),
      s("p3-hero-hidden", "hero", 4, { title: "Hidden hero", media: [] }, false),
      s("p3-story", "story", 5, { title: "Story", body: "No image." }),
      s("p3-unknown", "legacy_banner", 6, { title: "Unknown type" }),
    ],
  },
  {
    name: "draft hero without image",
    sections: [
      s("p4-hero", "hero", 0, { title: "", subtitle: "Eyebrow only", body: "Body", media: [], cta: { type: "external_link", url: "", label: "Nowhere" } }),
      s("p4-video", "video", 1, { title: "Video without file", media: [{ media_type: "video" }] }),
      s("p4-text", "text_block", 2, { title: "First real title", body: "Text." }),
      s("p4-story", "story", 3, { title: "Second", media: [img("s4")] }),
      s("p4-materials", "materials", 4, { title: "Fabrics", media: [img("f1"), img("f2"), img("f3")] }),
      s("p4-cards", "cards", 5, { items: [{ title: "Solo", file_url: "https://cdn.example/media/solo.jpg", cta: { type: "order_form", label: "x" } }] }),
      s("p4-cta", "cta", 6, { title: "CTA", cta: { type: "order_form", label: "Go" } }),
      s("p4-team", "team", 7, { title: "Team", media: [] }, false),
    ],
  },
  {
    name: "draft with every type",
    sections: [
      s("p5-hero", "hero", 0, { title: "Everything", subtitle: "All", body: "Hero body", media: [img("bg", "background")], cta: { type: "collection", collection_id: "55555555-5555-4555-8555-555555555555", label: "Collection" } }),
      s("p5-story", "story", 1, { title: "S", subtitle: "Sub", body: "B", media: [img("s5")] }),
      s("p5-team", "team", 2, { title: "T", subtitle: "Sub", body: "B", media: [img("t5")] }),
      s("p5-materials", "materials", 3, { title: "M", subtitle: "Sub", body: "B", media: [img("m5")] }),
      s("p5-text", "text_block", 4, { title: "X", subtitle: "Sub", body: "B" }),
      s("p5-video", "video", 5, { title: "V", caption: "C", media: [{ media_type: "video", file_url: "https://cdn.example/media/v5.mp4" }] }),
      s("p5-cards", "cards", 6, { title: "C", subtitle: "Sub", body: "B", items: [{ title: "A" }, { title: "B" }, { title: "C" }, { title: "D" }, { title: "E" }] }),
      s("p5-cta", "cta", 7, { title: "Go", subtitle: "Sub", body: "B", cta: { type: "external_link", url: "javascript:alert(1)", label: "Bad" } }),
    ],
  },
];
