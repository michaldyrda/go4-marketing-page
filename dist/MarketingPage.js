import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { MARKETING_CSS } from "./styles";
import { safeImgSrc } from "./sanitizeUrl";
/** Intended CSS widths per slot — handed to the host's image transformer. */
const W = { HERO: 960, STORY: 600, GRID: 400 };
const ForceMobileContext = createContext(false);
const TransformContext = createContext((url) => url);
function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}
/** <img> that swaps to a mobile crop: forced in preview, else viewport-driven. */
function ResponsiveImg({ desktopUrl, mobileUrl, width, alt, className, }) {
    const forceMobile = useContext(ForceMobileContext);
    const transform = useContext(TransformContext);
    const desktop = safeImgSrc(desktopUrl);
    const mobile = safeImgSrc(mobileUrl);
    const base = desktop || mobile;
    if (!base)
        return null;
    const src = (u) => transform(u, width);
    // Mobile preview: media queries can't see the frame, so force the crop.
    if (forceMobile) {
        return _jsx("img", { src: src(mobile || base), alt: alt, className: className });
    }
    return (_jsxs("picture", { children: [mobile && _jsx("source", { media: "(max-width: 640px)", srcSet: src(mobile) }), _jsx("img", { src: src(base), alt: alt, className: className })] }));
}
function CtaButton({ cta, onCtaClick, variant, }) {
    if (!cta.label)
        return null;
    return (_jsx("button", { type: "button", className: cx("g4mp-btn", variant === "primary" && "g4mp-btn--primary"), onClick: () => onCtaClick?.(cta), children: cta.label }));
}
const isImage = (m) => m.media_type === "image" || (!m.media_type && !!m.file_url);
function HeroSection({ config, onCtaClick, }) {
    const hero = (config.media ?? []).find((m) => m.role === "hero_image" || m.role === "background") ?? (config.media ?? []).find(isImage);
    return (_jsxs("section", { className: "g4mp-hero", children: [hero?.file_url ? (_jsx(ResponsiveImg, { desktopUrl: hero.file_url, mobileUrl: hero.mobile_file_url, width: W.HERO, alt: config.title ?? "Hero", className: "g4mp-hero__img" })) : (_jsx("div", { className: "g4mp-hero__fallback" })), _jsx("div", { className: "g4mp-hero__scrim" }), _jsx("div", { className: "g4mp-hero__inner", children: _jsxs("div", { className: "g4mp-hero__box", children: [config.subtitle && _jsx("p", { className: "g4mp-eyebrow", children: config.subtitle }), config.title && _jsx("h1", { className: "g4mp-title", children: config.title }), config.body && _jsx("p", { className: "g4mp-hero__body", children: config.body }), config.cta && _jsx(CtaButton, { cta: config.cta, onCtaClick: onCtaClick })] }) })] }));
}
function StorySection({ config }) {
    const img = (config.media ?? []).find(isImage);
    return (_jsx("section", { className: "g4mp-section g4mp-story", children: _jsxs("div", { className: "g4mp-inner g4mp-story__grid", children: [_jsxs("div", { className: "g4mp-story__copy", children: [config.title && _jsx("h2", { className: "g4mp-title", children: config.title }), config.subtitle && _jsx("p", { className: "g4mp-subtitle", children: config.subtitle }), config.body && _jsx("p", { className: "g4mp-body", children: config.body })] }), img?.file_url && (_jsx("div", { className: "g4mp-story__media", children: _jsx(ResponsiveImg, { desktopUrl: img.file_url, mobileUrl: img.mobile_file_url, width: W.STORY, alt: config.title ?? "Story", className: "g4mp-story__img" }) }))] }) }));
}
function GridSection({ config }) {
    const imgs = (config.media ?? []).filter(isImage);
    return (_jsx("section", { className: "g4mp-section g4mp-grid", children: _jsxs("div", { className: "g4mp-inner", children: [(config.title || config.body) && (_jsxs("div", { className: "g4mp-grid__head", children: [config.title && _jsx("h2", { className: "g4mp-title", children: config.title }), config.body && _jsx("p", { className: "g4mp-body", children: config.body })] })), imgs.length > 0 && (_jsx("div", { className: "g4mp-grid__items", children: imgs.map((img, i) => (_jsx("div", { className: "g4mp-grid__cell", children: _jsx(ResponsiveImg, { desktopUrl: img.file_url, mobileUrl: img.mobile_file_url, width: W.GRID, alt: "" }) }, i))) }))] }) }));
}
function TextSection({ config }) {
    return (_jsx("section", { className: "g4mp-section g4mp-text", children: _jsxs("div", { className: "g4mp-text__inner", children: [config.title && _jsx("h2", { className: "g4mp-title", children: config.title }), config.subtitle && _jsx("p", { className: "g4mp-subtitle", children: config.subtitle }), config.body && _jsx("p", { className: "g4mp-body", children: config.body })] }) }));
}
function VideoSection({ config }) {
    const video = (config.media ?? []).find((m) => m.media_type === "video" && m.file_url);
    const src = safeImgSrc(video?.file_url);
    if (!src)
        return null;
    return (_jsx("section", { className: "g4mp-section g4mp-video", children: _jsxs("div", { className: "g4mp-inner g4mp-video__inner", children: [_jsx("div", { className: "g4mp-video__frame", children: _jsx("video", { src: src, controls: true, preload: "metadata" }) }), (config.title || config.caption) && (_jsxs("div", { className: "g4mp-video__caption", children: [config.title && _jsx("h2", { className: "g4mp-title", children: config.title }), config.caption && _jsx("p", { className: "g4mp-body", children: config.caption })] }))] }) }));
}
function CtaSection({ config, onCtaClick, }) {
    return (_jsx("section", { className: "g4mp-section g4mp-cta", children: _jsxs("div", { className: "g4mp-inner g4mp-cta__inner", children: [_jsxs("div", { children: [config.title && _jsx("h2", { className: "g4mp-cta__title", children: config.title }), config.body && _jsx("p", { className: "g4mp-cta__body", children: config.body })] }), config.cta && _jsx(CtaButton, { cta: config.cta, onCtaClick: onCtaClick })] }) }));
}
function CardsSection({ config, onCtaClick, }) {
    const items = config.items ?? [];
    if (items.length === 0)
        return null;
    const count = Math.min(Math.max(items.length, 2), 4);
    return (_jsx("section", { className: "g4mp-section g4mp-cards", children: _jsxs("div", { className: "g4mp-inner", children: [(config.title || config.body) && (_jsxs("div", { className: "g4mp-cards__head", children: [config.title && _jsx("h2", { className: "g4mp-title", children: config.title }), config.body && _jsx("p", { className: "g4mp-body", children: config.body })] })), _jsx("div", { className: cx("g4mp-cards__grid", `g4mp-cards__grid--${count}`), children: items.map((item, i) => (_jsxs("div", { className: "g4mp-card", children: [(item.file_url || item.mobile_file_url) && (_jsx(ResponsiveImg, { desktopUrl: item.file_url, mobileUrl: item.mobile_file_url, width: W.GRID, alt: item.title ?? `Card ${i + 1}`, className: "g4mp-card__img" })), item.title && _jsx("h3", { className: "g4mp-card__title", children: item.title }), item.body && _jsx("p", { className: "g4mp-card__body", children: item.body }), item.cta && (_jsx("div", { className: "g4mp-card__cta", children: _jsx(CtaButton, { cta: item.cta, onCtaClick: onCtaClick, variant: "primary" }) }))] }, i))) })] }) }));
}
function Section({ section, onCtaClick, }) {
    switch (section.type) {
        case "hero":
            return _jsx(HeroSection, { config: section.config, onCtaClick: onCtaClick });
        case "story":
            return _jsx(StorySection, { config: section.config });
        case "team":
        case "materials":
            return _jsx(GridSection, { config: section.config });
        case "text_block":
            return _jsx(TextSection, { config: section.config });
        case "video":
            return _jsx(VideoSection, { config: section.config });
        case "cta":
            return _jsx(CtaSection, { config: section.config, onCtaClick: onCtaClick });
        case "cards":
            return _jsx(CardsSection, { config: section.config, onCtaClick: onCtaClick });
        default:
            return null; // Unknown type → skip, never crash the page.
    }
}
/**
 * Full collection marketing page — all visible sections in order, with its own
 * self-contained styles injected inline. Zero dependency on any host design
 * system, so the admin preview and the B2B portal render it identically.
 */
export function MarketingPage({ sections, onCtaClick, forceMobile = false, transformImageUrl = (url) => url, className, }) {
    const visible = sections
        .filter((s) => s.is_visible)
        .sort((a, b) => a.order_index - b.order_index);
    return (_jsx(ForceMobileContext.Provider, { value: forceMobile, children: _jsx(TransformContext.Provider, { value: transformImageUrl, children: _jsxs("div", { className: cx("g4mp", forceMobile && "g4mp--mobile", className), children: [_jsx("style", { children: MARKETING_CSS }), visible.map((section) => (_jsx(Section, { section: section, onCtaClick: onCtaClick }, section.id)))] }) }) }));
}
