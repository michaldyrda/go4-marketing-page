// src/MarketingPage.tsx
import { createContext, useContext } from "react";

// src/styles.ts
var MARKETING_CSS = `
.g4mp {
  --g4mp-bg: #fafafa;
  --g4mp-surface: #ffffff;
  --g4mp-surface-2: #f4f4f4;
  --g4mp-ink: #0a0a0a;
  --g4mp-muted: #737373;
  --g4mp-ondark: #ffffff;
  width: 100%;
  background: var(--g4mp-bg);
  color: var(--g4mp-ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.g4mp *, .g4mp *::before, .g4mp *::after { box-sizing: border-box; }
.g4mp img, .g4mp video { display: block; max-width: 100%; }
.g4mp h1, .g4mp h2, .g4mp h3, .g4mp p { margin: 0; }

.g4mp-section { padding: 48px 24px; }
.g4mp-inner { max-width: 1120px; margin: 0 auto; }
.g4mp-eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 500; }
.g4mp-title { font-size: 30px; line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
.g4mp-subtitle { font-size: 17px; color: var(--g4mp-muted); }
.g4mp-body { font-size: 15px; line-height: 1.6; color: var(--g4mp-muted); white-space: pre-line; }

/* Button */
.g4mp-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px; border-radius: 8px; border: 0; cursor: pointer;
  font-family: inherit; font-size: 14px; font-weight: 600; line-height: 1;
  background: var(--g4mp-ondark); color: var(--g4mp-ink);
  transition: opacity 0.15s ease;
}
.g4mp-btn:hover { opacity: 0.88; }
.g4mp-btn:focus-visible { outline: 2px solid var(--g4mp-ink); outline-offset: 2px; }
.g4mp-btn--primary { background: var(--g4mp-ink); color: var(--g4mp-ondark); }

/* Hero */
.g4mp-hero { position: relative; display: flex; align-items: flex-end; min-height: 56vh; overflow: hidden; }
.g4mp-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.g4mp-hero__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
.g4mp-hero__scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.15) 55%, transparent); }
.g4mp-hero__inner { position: relative; z-index: 1; width: 100%; padding: 24px; }
.g4mp-hero__box { max-width: 760px; }
.g4mp-hero .g4mp-eyebrow { color: rgba(255,255,255,0.8); margin-bottom: 8px; }
.g4mp-hero .g4mp-title { color: var(--g4mp-ondark); margin-bottom: 14px; }
.g4mp-hero__body { color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.55; max-width: 640px; margin-bottom: 22px; white-space: pre-line; }

/* Story (text + image) */
.g4mp-story { background: var(--g4mp-surface); }
.g4mp-story__grid { display: flex; flex-direction: column; gap: 28px; }
.g4mp-story__copy .g4mp-title { margin-bottom: 12px; }
.g4mp-story__copy .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-story__img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 12px; }

/* Grid (team / materials) */
.g4mp-grid { background: var(--g4mp-surface-2); }
.g4mp-grid__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-grid__head .g4mp-title { margin-bottom: 12px; }
.g4mp-grid__items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.g4mp-grid__cell { aspect-ratio: 1 / 1; overflow: hidden; border-radius: 12px; }
.g4mp-grid__cell img { width: 100%; height: 100%; object-fit: cover; }

/* Text block */
.g4mp-text { background: var(--g4mp-surface); }
.g4mp-text__inner { max-width: 720px; margin: 0 auto; text-align: center; }
.g4mp-text__inner .g4mp-title { margin-bottom: 12px; }
.g4mp-text__inner .g4mp-subtitle { margin-bottom: 12px; }

/* Video */
.g4mp-video { background: var(--g4mp-surface); }
.g4mp-video__inner { max-width: 960px; margin: 0 auto; }
.g4mp-video__frame { width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: 12px; overflow: hidden; }
.g4mp-video__frame video { width: 100%; height: 100%; object-fit: contain; }
.g4mp-video__caption { margin-top: 16px; text-align: center; }
.g4mp-video__caption .g4mp-title { font-size: 24px; margin-bottom: 6px; }

/* CTA bar */
.g4mp-cta { background: var(--g4mp-ink); color: var(--g4mp-ondark); }
.g4mp-cta__inner { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.g4mp-cta__title { font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
.g4mp-cta__body { color: rgba(255,255,255,0.85); white-space: pre-line; }

/* Cards \u2014 the whole tile is the click target (image + overlaid title), no button. */
.g4mp-cards { background: var(--g4mp-surface); }
.g4mp-cards__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-cards__head .g4mp-title { margin-bottom: 12px; }
.g4mp-cards__grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.g4mp-card { position: relative; display: block; width: 100%; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 12px; background: var(--g4mp-ink); }
button.g4mp-card { appearance: none; -webkit-appearance: none; border: 0; padding: 0; margin: 0; font: inherit; text-align: left; color: inherit; cursor: pointer; }
.g4mp-card__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
.g4mp-card__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
button.g4mp-card:hover .g4mp-card__img { transform: scale(1.04); }
button.g4mp-card:focus-visible { outline: 2px solid var(--g4mp-ink); outline-offset: 2px; }
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
`;

// src/sanitizeUrl.ts
function safeHref(url) {
  if (!url) return void 0;
  const t = url.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  return void 0;
}
function safeImgSrc(url) {
  if (!url) return void 0;
  const t = url.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (/^data:image\//i.test(t)) return t;
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  return void 0;
}

// src/MarketingPage.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var W = { HERO: 960, STORY: 600, GRID: 400 };
var ForceMobileContext = createContext(false);
var TransformContext = createContext((url) => url);
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
function ResponsiveImg({
  desktopUrl,
  mobileUrl,
  width,
  alt,
  className
}) {
  const forceMobile = useContext(ForceMobileContext);
  const transform = useContext(TransformContext);
  const desktop = safeImgSrc(desktopUrl);
  const mobile = safeImgSrc(mobileUrl);
  const base = desktop || mobile;
  if (!base) return null;
  const src = (u) => transform(u, width);
  if (forceMobile) {
    return /* @__PURE__ */ jsx("img", { src: src(mobile || base), alt, className });
  }
  return /* @__PURE__ */ jsxs("picture", { children: [
    mobile && /* @__PURE__ */ jsx("source", { media: "(max-width: 640px)", srcSet: src(mobile) }),
    /* @__PURE__ */ jsx("img", { src: src(base), alt, className })
  ] });
}
function CtaButton({
  cta,
  onCtaClick,
  variant
}) {
  if (!cta.label) return null;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      className: cx("g4mp-btn", variant === "primary" && "g4mp-btn--primary"),
      onClick: () => onCtaClick?.(cta),
      children: cta.label
    }
  );
}
var isImage = (m) => m.media_type === "image" || !m.media_type && !!m.file_url;
function HeroSection({
  config,
  onCtaClick
}) {
  const hero = (config.media ?? []).find(
    (m) => m.role === "hero_image" || m.role === "background"
  ) ?? (config.media ?? []).find(isImage);
  return /* @__PURE__ */ jsxs("section", { className: "g4mp-hero", children: [
    hero?.file_url ? /* @__PURE__ */ jsx(
      ResponsiveImg,
      {
        desktopUrl: hero.file_url,
        mobileUrl: hero.mobile_file_url,
        width: W.HERO,
        alt: config.title ?? "Hero",
        className: "g4mp-hero__img"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "g4mp-hero__fallback" }),
    /* @__PURE__ */ jsx("div", { className: "g4mp-hero__scrim" }),
    /* @__PURE__ */ jsx("div", { className: "g4mp-hero__inner", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-hero__box", children: [
      config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-eyebrow", children: config.subtitle }),
      config.title && /* @__PURE__ */ jsx("h1", { className: "g4mp-title", children: config.title }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-hero__body", children: config.body }),
      config.cta && /* @__PURE__ */ jsx(CtaButton, { cta: config.cta, onCtaClick })
    ] }) })
  ] });
}
function StorySection({ config }) {
  const img = (config.media ?? []).find(isImage);
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-story", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner g4mp-story__grid", children: [
    /* @__PURE__ */ jsxs("div", { className: "g4mp-story__copy", children: [
      config.title && /* @__PURE__ */ jsx("h2", { className: "g4mp-title", children: config.title }),
      config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-subtitle", children: config.subtitle }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.body })
    ] }),
    img?.file_url && /* @__PURE__ */ jsx("div", { className: "g4mp-story__media", children: /* @__PURE__ */ jsx(
      ResponsiveImg,
      {
        desktopUrl: img.file_url,
        mobileUrl: img.mobile_file_url,
        width: W.STORY,
        alt: config.title ?? "Story",
        className: "g4mp-story__img"
      }
    ) })
  ] }) });
}
function GridSection({ config }) {
  const imgs = (config.media ?? []).filter(isImage);
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-grid", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner", children: [
    (config.title || config.body) && /* @__PURE__ */ jsxs("div", { className: "g4mp-grid__head", children: [
      config.title && /* @__PURE__ */ jsx("h2", { className: "g4mp-title", children: config.title }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.body })
    ] }),
    imgs.length > 0 && /* @__PURE__ */ jsx("div", { className: "g4mp-grid__items", children: imgs.map((img, i) => /* @__PURE__ */ jsx("div", { className: "g4mp-grid__cell", children: /* @__PURE__ */ jsx(
      ResponsiveImg,
      {
        desktopUrl: img.file_url,
        mobileUrl: img.mobile_file_url,
        width: W.GRID,
        alt: ""
      }
    ) }, i)) })
  ] }) });
}
function TextSection({ config }) {
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-text", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-text__inner", children: [
    config.title && /* @__PURE__ */ jsx("h2", { className: "g4mp-title", children: config.title }),
    config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-subtitle", children: config.subtitle }),
    config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.body })
  ] }) });
}
function VideoSection({ config }) {
  const video = (config.media ?? []).find(
    (m) => m.media_type === "video" && m.file_url
  );
  const src = safeImgSrc(video?.file_url);
  if (!src) return null;
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-video", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner g4mp-video__inner", children: [
    /* @__PURE__ */ jsx("div", { className: "g4mp-video__frame", children: /* @__PURE__ */ jsx("video", { src, controls: true, preload: "metadata" }) }),
    (config.title || config.caption) && /* @__PURE__ */ jsxs("div", { className: "g4mp-video__caption", children: [
      config.title && /* @__PURE__ */ jsx("h2", { className: "g4mp-title", children: config.title }),
      config.caption && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.caption })
    ] })
  ] }) });
}
function CtaSection({
  config,
  onCtaClick
}) {
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-cta", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner g4mp-cta__inner", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      config.title && /* @__PURE__ */ jsx("h2", { className: "g4mp-cta__title", children: config.title }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-cta__body", children: config.body })
    ] }),
    config.cta && /* @__PURE__ */ jsx(CtaButton, { cta: config.cta, onCtaClick })
  ] }) });
}
function CardsSection({
  config,
  onCtaClick
}) {
  const items = config.items ?? [];
  if (items.length === 0) return null;
  const count = Math.min(Math.max(items.length, 2), 4);
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-cards", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner", children: [
    (config.title || config.body) && /* @__PURE__ */ jsxs("div", { className: "g4mp-cards__head", children: [
      config.title && /* @__PURE__ */ jsx("h2", { className: "g4mp-title", children: config.title }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.body })
    ] }),
    /* @__PURE__ */ jsx("div", { className: cx("g4mp-cards__grid", `g4mp-cards__grid--${count}`), children: items.map((item, i) => {
      const hasImg = !!(item.file_url || item.mobile_file_url);
      const clickable = !!item.cta;
      const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
        hasImg ? /* @__PURE__ */ jsx(
          ResponsiveImg,
          {
            desktopUrl: item.file_url,
            mobileUrl: item.mobile_file_url,
            width: W.GRID,
            alt: item.title ?? `Card ${i + 1}`,
            className: "g4mp-card__img"
          }
        ) : /* @__PURE__ */ jsx("span", { className: "g4mp-card__fallback" }),
        (item.title || item.body) && /* @__PURE__ */ jsxs("span", { className: "g4mp-card__overlay", children: [
          item.title && /* @__PURE__ */ jsx("span", { className: "g4mp-card__title", children: item.title }),
          item.body && /* @__PURE__ */ jsx("span", { className: "g4mp-card__sub", children: item.body })
        ] })
      ] });
      return clickable ? /* @__PURE__ */ jsx("button", { type: "button", className: "g4mp-card", onClick: () => onCtaClick?.(item.cta), children: inner }, i) : /* @__PURE__ */ jsx("div", { className: "g4mp-card", children: inner }, i);
    }) })
  ] }) });
}
function Section({
  section,
  onCtaClick
}) {
  switch (section.type) {
    case "hero":
      return /* @__PURE__ */ jsx(HeroSection, { config: section.config, onCtaClick });
    case "story":
      return /* @__PURE__ */ jsx(StorySection, { config: section.config });
    case "team":
    case "materials":
      return /* @__PURE__ */ jsx(GridSection, { config: section.config });
    case "text_block":
      return /* @__PURE__ */ jsx(TextSection, { config: section.config });
    case "video":
      return /* @__PURE__ */ jsx(VideoSection, { config: section.config });
    case "cta":
      return /* @__PURE__ */ jsx(CtaSection, { config: section.config, onCtaClick });
    case "cards":
      return /* @__PURE__ */ jsx(CardsSection, { config: section.config, onCtaClick });
    default:
      return null;
  }
}
function MarketingPage({
  sections,
  onCtaClick,
  forceMobile = false,
  transformImageUrl = (url) => url,
  className
}) {
  const visible = sections.filter((s) => s.is_visible).sort((a, b) => a.order_index - b.order_index);
  return /* @__PURE__ */ jsx(ForceMobileContext.Provider, { value: forceMobile, children: /* @__PURE__ */ jsx(TransformContext.Provider, { value: transformImageUrl, children: /* @__PURE__ */ jsxs("div", { className: cx("g4mp", forceMobile && "g4mp--mobile", className), children: [
    /* @__PURE__ */ jsx("style", { children: MARKETING_CSS }),
    visible.map((section) => /* @__PURE__ */ jsx(Section, { section, onCtaClick }, section.id))
  ] }) }) });
}
export {
  MARKETING_CSS,
  MarketingPage,
  safeHref,
  safeImgSrc
};
