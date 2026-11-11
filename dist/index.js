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
.g4mp-eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; }
.g4mp-title { font-size: 30px; line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
.g4mp-subtitle { font-size: 17px; font-weight: 700; color: var(--g4mp-ink); }
.g4mp-body { font-size: 15px; line-height: 1.6; color: var(--g4mp-ink); white-space: pre-line; }

/* Button */
.g4mp-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px; border-radius: 8px; border: 0; cursor: pointer;
  font-family: inherit; font-size: 14px; font-weight: 600; line-height: 1;
  background: var(--g4mp-ondark); color: var(--g4mp-ink);
  transition: opacity 0.15s ease;
}
a.g4mp-btn { text-decoration: none; }
.g4mp-btn:hover { opacity: 0.88; }
.g4mp-ext { font-size: 0.9em; line-height: 1; }
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
.g4mp-grid__head .g4mp-subtitle { margin-bottom: 12px; }
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
.g4mp-cta__sub { font-weight: 700; color: rgba(255,255,255,0.85); margin-bottom: 6px; }
.g4mp-cta__body { color: rgba(255,255,255,0.85); white-space: pre-line; }

/* Cards \u2014 the whole tile is the click target (image + overlaid title), no button. */
.g4mp-cards { background: var(--g4mp-surface); }
.g4mp-cards__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-cards__head .g4mp-title { margin-bottom: 12px; }
.g4mp-cards__head .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-cards__grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.g4mp-card { position: relative; display: block; width: 100%; aspect-ratio: 2 / 3; overflow: hidden; border-radius: 12px; background: var(--g4mp-ink); }
.g4mp-card--link { appearance: none; -webkit-appearance: none; border: 0; padding: 0; margin: 0; font: inherit; text-align: left; color: inherit; text-decoration: none; cursor: pointer; }
.g4mp-card__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
.g4mp-card__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
.g4mp-card--link:hover .g4mp-card__img { transform: scale(1.04); }
.g4mp-card--link:focus-visible { outline: 2px solid var(--g4mp-ink); outline-offset: 2px; }
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
  if (/^https?:\/\//i.test(t)) return t;
  if (/^data:image\/(png|jpe?g|gif|webp|avif);/i.test(t)) return t;
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  return void 0;
}
function safeDimension(n) {
  return typeof n === "number" && Number.isFinite(n) && n > 0 && n < 2e4 ? Math.round(n) : void 0;
}

// src/links.ts
var ALL_COLLECTIONS_URL = /^\/?(?:[^?#]*\/)?order\?collection=all$/i;
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
var isExternalLink = (link) => link.kind === "external";

// src/MarketingPage.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var W = { HERO: 960, STORY: 600, GRID: 400 };
var SRCSET_WIDTHS = {
  HERO: [640, 960, 1440, 1920, 2560],
  STORY: [400, 600, 900, 1200],
  GRID: [300, 400, 600, 800]
};
var SIZES = {
  HERO: "100vw",
  STORY: "(min-width: 768px) 50vw, 100vw",
  GRID: "(min-width: 768px) 25vw, 50vw"
};
var ForceMobileContext = createContext(false);
var TransformContext = createContext({ fn: (url) => url, resizes: false });
var LinkHostContext = createContext({});
var HeadingLevelContext = createContext(2);
var FirstSectionContext = createContext(false);
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
function ResponsiveImg({
  desktopUrl,
  mobileUrl,
  slot,
  alt,
  width,
  height,
  className
}) {
  const forceMobile = useContext(ForceMobileContext);
  const transform = useContext(TransformContext);
  const first = useContext(FirstSectionContext);
  const desktop = safeImgSrc(desktopUrl);
  const mobile = safeImgSrc(mobileUrl);
  const base = desktop || mobile;
  if (!base) return null;
  const src = (u) => transform.fn(u, W[slot]);
  const srcSet = (u) => transform.resizes ? SRCSET_WIDTHS[slot].map((w) => `${transform.fn(u, w)} ${w}w`).join(", ") : void 0;
  const imgProps = {
    alt,
    className,
    width: safeDimension(width),
    height: safeDimension(height),
    loading: first ? void 0 : "lazy",
    decoding: "async",
    sizes: transform.resizes ? SIZES[slot] : void 0
  };
  if (forceMobile) {
    const u = mobile || base;
    return /* @__PURE__ */ jsx("img", { src: src(u), srcSet: srcSet(u), ...imgProps });
  }
  return /* @__PURE__ */ jsxs("picture", { children: [
    mobile && /* @__PURE__ */ jsx(
      "source",
      {
        media: "(max-width: 640px)",
        srcSet: srcSet(mobile) ?? src(mobile),
        sizes: imgProps.sizes
      }
    ),
    /* @__PURE__ */ jsx("img", { src: src(base), srcSet: srcSet(base), ...imgProps })
  ] });
}
function Title({ className, children }) {
  const level = useContext(HeadingLevelContext);
  return level === 1 ? /* @__PURE__ */ jsx("h1", { className, children }) : /* @__PURE__ */ jsx("h2", { className, children });
}
function useLinkTarget(cta) {
  const host = useContext(LinkHostContext);
  if (!cta) return null;
  if (host.resolveHref) {
    const link = ctaLink(cta);
    if (!link || link.available === false) return null;
    const href = safeHref(host.resolveHref(link));
    if (!href) return null;
    return { as: "a", href, external: isExternalLink(link), link };
  }
  return { as: "button" };
}
function anchorProps(target, host) {
  return {
    href: target.href,
    ...target.external ? { rel: "noopener noreferrer nofollow", target: "_blank" } : {},
    onClick: host.onLinkClick ? (e) => host.onLinkClick?.(e, target.link) : void 0
  };
}
var ExitMark = () => /* @__PURE__ */ jsx("span", { className: "g4mp-ext", "aria-hidden": "true", children: "\u2197" });
function CtaButton({ cta, variant }) {
  const host = useContext(LinkHostContext);
  const target = useLinkTarget(cta);
  if (!cta.label || !target) return null;
  const className = cx("g4mp-btn", variant === "primary" && "g4mp-btn--primary");
  if (target.as === "a") {
    return /* @__PURE__ */ jsxs("a", { className, ...anchorProps(target, host), children: [
      cta.label,
      target.external && /* @__PURE__ */ jsx(ExitMark, {})
    ] });
  }
  return /* @__PURE__ */ jsx("button", { type: "button", className, onClick: () => host.onCtaClick?.(cta), children: cta.label });
}
var isImage = (m) => m.media_type === "image" || !m.media_type && !!m.file_url;
var findVideo = (config) => (config.media ?? []).find((m) => m.media_type === "video" && m.file_url);
var altOf = (m, fallback) => (m.alt ?? fallback ?? "").trim();
function MediaImg({
  media,
  slot,
  fallbackAlt,
  className
}) {
  return /* @__PURE__ */ jsx(
    ResponsiveImg,
    {
      desktopUrl: media.file_url,
      mobileUrl: media.mobile_file_url,
      slot,
      alt: altOf(media, fallbackAlt),
      width: media.width,
      height: media.height,
      className
    }
  );
}
function HeroSection({ config }) {
  const hero = (config.media ?? []).find(
    (m) => m.role === "hero_image" || m.role === "background"
  ) ?? (config.media ?? []).find(isImage);
  return /* @__PURE__ */ jsxs("section", { className: "g4mp-hero", children: [
    hero?.file_url ? /* @__PURE__ */ jsx(MediaImg, { media: hero, slot: "HERO", fallbackAlt: config.title, className: "g4mp-hero__img" }) : /* @__PURE__ */ jsx("div", { className: "g4mp-hero__fallback" }),
    /* @__PURE__ */ jsx("div", { className: "g4mp-hero__scrim" }),
    /* @__PURE__ */ jsx("div", { className: "g4mp-hero__inner", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-hero__box", children: [
      config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-eyebrow", children: config.subtitle }),
      config.title && /* @__PURE__ */ jsx(Title, { className: "g4mp-title", children: config.title }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-hero__body", children: config.body }),
      config.cta && /* @__PURE__ */ jsx(CtaButton, { cta: config.cta })
    ] }) })
  ] });
}
function StorySection({ config }) {
  const img = (config.media ?? []).find(isImage);
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-story", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner g4mp-story__grid", children: [
    /* @__PURE__ */ jsxs("div", { className: "g4mp-story__copy", children: [
      config.title && /* @__PURE__ */ jsx(Title, { className: "g4mp-title", children: config.title }),
      config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-subtitle", children: config.subtitle }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.body })
    ] }),
    img?.file_url && /* @__PURE__ */ jsx("div", { className: "g4mp-story__media", children: /* @__PURE__ */ jsx(MediaImg, { media: img, slot: "STORY", fallbackAlt: config.title, className: "g4mp-story__img" }) })
  ] }) });
}
function GridSection({ config }) {
  const imgs = (config.media ?? []).filter(isImage);
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-grid", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner", children: [
    (config.title || config.subtitle || config.body) && /* @__PURE__ */ jsxs("div", { className: "g4mp-grid__head", children: [
      config.title && /* @__PURE__ */ jsx(Title, { className: "g4mp-title", children: config.title }),
      config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-subtitle", children: config.subtitle }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.body })
    ] }),
    imgs.length > 0 && /* @__PURE__ */ jsx("div", { className: "g4mp-grid__items", children: imgs.map((img, i) => /* @__PURE__ */ jsx("div", { className: "g4mp-grid__cell", children: /* @__PURE__ */ jsx(MediaImg, { media: img, slot: "GRID" }) }, i)) })
  ] }) });
}
function TextSection({ config }) {
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-text", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-text__inner", children: [
    config.title && /* @__PURE__ */ jsx(Title, { className: "g4mp-title", children: config.title }),
    config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-subtitle", children: config.subtitle }),
    config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.body })
  ] }) });
}
function VideoSection({ config }) {
  const transform = useContext(TransformContext);
  const video = findVideo(config);
  const src = safeImgSrc(video?.file_url);
  if (!src) return null;
  const posterSrc = safeImgSrc(video?.poster_url);
  const poster = posterSrc ? transform.fn(posterSrc, 960) : void 0;
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-video", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner g4mp-video__inner", children: [
    /* @__PURE__ */ jsx("div", { className: "g4mp-video__frame", children: /* @__PURE__ */ jsx(
      "video",
      {
        src,
        controls: true,
        playsInline: true,
        poster,
        preload: poster ? "none" : "metadata",
        width: safeDimension(video?.width),
        height: safeDimension(video?.height)
      }
    ) }),
    (config.title || config.caption) && /* @__PURE__ */ jsxs("div", { className: "g4mp-video__caption", children: [
      config.title && /* @__PURE__ */ jsx(Title, { className: "g4mp-title", children: config.title }),
      config.caption && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.caption })
    ] })
  ] }) });
}
function CtaSection({ config }) {
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-cta", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner g4mp-cta__inner", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      config.title && /* @__PURE__ */ jsx(Title, { className: "g4mp-cta__title", children: config.title }),
      config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-cta__sub", children: config.subtitle }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-cta__body", children: config.body })
    ] }),
    config.cta && /* @__PURE__ */ jsx(CtaButton, { cta: config.cta })
  ] }) });
}
function Card({ item }) {
  const host = useContext(LinkHostContext);
  const target = useLinkTarget(item.cta);
  const hasImg = !!(item.file_url || item.mobile_file_url);
  const TitleTag = target?.as === "button" ? "span" : "h3";
  const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
    hasImg ? /* @__PURE__ */ jsx(
      ResponsiveImg,
      {
        desktopUrl: item.file_url,
        mobileUrl: item.mobile_file_url,
        slot: "GRID",
        alt: altOf(item, item.title),
        width: item.width,
        height: item.height,
        className: "g4mp-card__img"
      }
    ) : /* @__PURE__ */ jsx("span", { className: "g4mp-card__fallback" }),
    (item.title || item.body) && /* @__PURE__ */ jsxs("span", { className: "g4mp-card__overlay", children: [
      item.title && /* @__PURE__ */ jsx(TitleTag, { className: "g4mp-card__title", children: item.title }),
      item.body && /* @__PURE__ */ jsx("span", { className: "g4mp-card__sub", children: item.body })
    ] })
  ] });
  if (target?.as === "a") {
    return /* @__PURE__ */ jsx("a", { className: "g4mp-card g4mp-card--link", ...anchorProps(target, host), children: inner });
  }
  if (target?.as === "button") {
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "g4mp-card g4mp-card--link",
        onClick: () => host.onCtaClick?.(item.cta),
        children: inner
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: "g4mp-card", children: inner });
}
function CardsSection({ config }) {
  const items = config.items ?? [];
  if (items.length === 0) return null;
  const count = Math.min(Math.max(items.length, 2), 4);
  return /* @__PURE__ */ jsx("section", { className: "g4mp-section g4mp-cards", children: /* @__PURE__ */ jsxs("div", { className: "g4mp-inner", children: [
    (config.title || config.subtitle || config.body) && /* @__PURE__ */ jsxs("div", { className: "g4mp-cards__head", children: [
      config.title && /* @__PURE__ */ jsx(Title, { className: "g4mp-title", children: config.title }),
      config.subtitle && /* @__PURE__ */ jsx("p", { className: "g4mp-subtitle", children: config.subtitle }),
      config.body && /* @__PURE__ */ jsx("p", { className: "g4mp-body", children: config.body })
    ] }),
    /* @__PURE__ */ jsx("div", { className: cx("g4mp-cards__grid", CARD_GRID_CLASS[count]), children: items.map((item, i) => /* @__PURE__ */ jsx(Card, { item }, i)) })
  ] }) });
}
var CARD_GRID_CLASS = {
  2: "g4mp-cards__grid--2",
  3: "g4mp-cards__grid--3",
  4: "g4mp-cards__grid--4"
};
var SECTION_COMPONENTS = {
  hero: HeroSection,
  story: StorySection,
  team: GridSection,
  materials: GridSection,
  text_block: TextSection,
  video: VideoSection,
  cta: CtaSection,
  cards: CardsSection
};
function rendersTitle(section) {
  const config = section.config ?? {};
  if (!Object.prototype.hasOwnProperty.call(SECTION_COMPONENTS, section.type)) return false;
  if (!config.title) return false;
  if (section.type === "video") return !!safeImgSrc(findVideo(config)?.file_url);
  if (section.type === "cards") return (config.items ?? []).length > 0;
  return true;
}
function Section({ section }) {
  const Component = Object.prototype.hasOwnProperty.call(SECTION_COMPONENTS, section.type) ? SECTION_COMPONENTS[section.type] : void 0;
  if (!Component) return null;
  return /* @__PURE__ */ jsx(Component, { config: section.config ?? {} });
}
function MarketingPage({
  sections,
  resolveHref,
  onLinkClick,
  onCtaClick,
  forceMobile = false,
  transformImageUrl,
  injectStyles = true,
  className
}) {
  const visible = sections.filter((s) => s.is_visible).sort((a, b) => a.order_index - b.order_index);
  const firstTitledId = visible.find(rendersTitle)?.id;
  const transform = transformImageUrl ? { fn: transformImageUrl, resizes: true } : { fn: (url) => url, resizes: false };
  return /* @__PURE__ */ jsx(ForceMobileContext.Provider, { value: forceMobile, children: /* @__PURE__ */ jsx(TransformContext.Provider, { value: transform, children: /* @__PURE__ */ jsx(LinkHostContext.Provider, { value: { resolveHref, onLinkClick, onCtaClick }, children: /* @__PURE__ */ jsxs("div", { className: cx("g4mp", forceMobile && "g4mp--mobile", className), children: [
    injectStyles && /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: MARKETING_CSS } }),
    visible.map((section, i) => /* @__PURE__ */ jsx(FirstSectionContext.Provider, { value: i === 0, children: /* @__PURE__ */ jsx(HeadingLevelContext.Provider, { value: section.id === firstTitledId ? 1 : 2, children: /* @__PURE__ */ jsx(Section, { section }) }) }, section.id))
  ] }) }) }) });
}

// src/cssHash.ts
var MARKETING_CSS_SHA256 = "sha256-5iUJrzDZE1PjBxSpuJN0HTdAZ/gkUxrg52PWvqQbvFw=";
export {
  MARKETING_CSS,
  MARKETING_CSS_SHA256,
  MarketingPage,
  ctaLink,
  safeHref,
  safeImgSrc
};
