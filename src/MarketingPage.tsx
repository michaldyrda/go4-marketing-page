import { createContext, useContext } from "react";
import { MARKETING_CSS } from "./styles";
import { safeImgSrc } from "./sanitizeUrl";
import type {
  MarketingCta,
  MarketingSection,
  MarketingSectionConfig,
  TransformImageUrl,
} from "./types";

/** Intended CSS widths per slot — handed to the host's image transformer. */
const W = { HERO: 960, STORY: 600, GRID: 400 } as const;

const ForceMobileContext = createContext(false);
const TransformContext = createContext<TransformImageUrl>((url) => url);

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** <img> that swaps to a mobile crop: forced in preview, else viewport-driven. */
function ResponsiveImg({
  desktopUrl,
  mobileUrl,
  width,
  alt,
  className,
}: {
  desktopUrl?: string | null;
  mobileUrl?: string | null;
  width: number;
  alt: string;
  className?: string;
}) {
  const forceMobile = useContext(ForceMobileContext);
  const transform = useContext(TransformContext);

  const desktop = safeImgSrc(desktopUrl);
  const mobile = safeImgSrc(mobileUrl);
  const base = desktop || mobile;
  if (!base) return null;

  const src = (u: string) => transform(u, width);

  // Mobile preview: media queries can't see the frame, so force the crop.
  if (forceMobile) {
    return <img src={src(mobile || base)} alt={alt} className={className} />;
  }
  return (
    <picture>
      {mobile && <source media="(max-width: 640px)" srcSet={src(mobile)} />}
      <img src={src(base)} alt={alt} className={className} />
    </picture>
  );
}

function CtaButton({
  cta,
  onCtaClick,
  variant,
}: {
  cta: MarketingCta;
  onCtaClick?: (cta: MarketingCta) => void;
  variant?: "primary";
}) {
  if (!cta.label) return null;
  return (
    <button
      type="button"
      className={cx("g4mp-btn", variant === "primary" && "g4mp-btn--primary")}
      onClick={() => onCtaClick?.(cta)}
    >
      {cta.label}
    </button>
  );
}

const isImage = (m: { media_type?: string | null; file_url?: string | null }) =>
  m.media_type === "image" || (!m.media_type && !!m.file_url);

function HeroSection({
  config,
  onCtaClick,
}: {
  config: MarketingSectionConfig;
  onCtaClick?: (cta: MarketingCta) => void;
}) {
  const hero = (config.media ?? []).find(
    (m) => m.role === "hero_image" || m.role === "background",
  ) ?? (config.media ?? []).find(isImage);
  return (
    <section className="g4mp-hero">
      {hero?.file_url ? (
        <ResponsiveImg
          desktopUrl={hero.file_url}
          mobileUrl={hero.mobile_file_url}
          width={W.HERO}
          alt={config.title ?? "Hero"}
          className="g4mp-hero__img"
        />
      ) : (
        <div className="g4mp-hero__fallback" />
      )}
      <div className="g4mp-hero__scrim" />
      <div className="g4mp-hero__inner">
        <div className="g4mp-hero__box">
          {config.subtitle && <p className="g4mp-eyebrow">{config.subtitle}</p>}
          {config.title && <h1 className="g4mp-title">{config.title}</h1>}
          {config.body && <p className="g4mp-hero__body">{config.body}</p>}
          {config.cta && <CtaButton cta={config.cta} onCtaClick={onCtaClick} />}
        </div>
      </div>
    </section>
  );
}

function StorySection({ config }: { config: MarketingSectionConfig }) {
  const img = (config.media ?? []).find(isImage);
  return (
    <section className="g4mp-section g4mp-story">
      <div className="g4mp-inner g4mp-story__grid">
        <div className="g4mp-story__copy">
          {config.title && <h2 className="g4mp-title">{config.title}</h2>}
          {config.subtitle && <p className="g4mp-subtitle">{config.subtitle}</p>}
          {config.body && <p className="g4mp-body">{config.body}</p>}
        </div>
        {img?.file_url && (
          <div className="g4mp-story__media">
            <ResponsiveImg
              desktopUrl={img.file_url}
              mobileUrl={img.mobile_file_url}
              width={W.STORY}
              alt={config.title ?? "Story"}
              className="g4mp-story__img"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function GridSection({ config }: { config: MarketingSectionConfig }) {
  const imgs = (config.media ?? []).filter(isImage);
  return (
    <section className="g4mp-section g4mp-grid">
      <div className="g4mp-inner">
        {(config.title || config.body) && (
          <div className="g4mp-grid__head">
            {config.title && <h2 className="g4mp-title">{config.title}</h2>}
            {config.body && <p className="g4mp-body">{config.body}</p>}
          </div>
        )}
        {imgs.length > 0 && (
          <div className="g4mp-grid__items">
            {imgs.map((img, i) => (
              <div key={i} className="g4mp-grid__cell">
                <ResponsiveImg
                  desktopUrl={img.file_url}
                  mobileUrl={img.mobile_file_url}
                  width={W.GRID}
                  alt=""
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TextSection({ config }: { config: MarketingSectionConfig }) {
  return (
    <section className="g4mp-section g4mp-text">
      <div className="g4mp-text__inner">
        {config.title && <h2 className="g4mp-title">{config.title}</h2>}
        {config.subtitle && <p className="g4mp-subtitle">{config.subtitle}</p>}
        {config.body && <p className="g4mp-body">{config.body}</p>}
      </div>
    </section>
  );
}

function VideoSection({ config }: { config: MarketingSectionConfig }) {
  const video = (config.media ?? []).find(
    (m) => m.media_type === "video" && m.file_url,
  );
  const src = safeImgSrc(video?.file_url);
  if (!src) return null;
  return (
    <section className="g4mp-section g4mp-video">
      <div className="g4mp-inner g4mp-video__inner">
        <div className="g4mp-video__frame">
          <video src={src} controls preload="metadata" />
        </div>
        {(config.title || config.caption) && (
          <div className="g4mp-video__caption">
            {config.title && <h2 className="g4mp-title">{config.title}</h2>}
            {config.caption && <p className="g4mp-body">{config.caption}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

function CtaSection({
  config,
  onCtaClick,
}: {
  config: MarketingSectionConfig;
  onCtaClick?: (cta: MarketingCta) => void;
}) {
  return (
    <section className="g4mp-section g4mp-cta">
      <div className="g4mp-inner g4mp-cta__inner">
        <div>
          {config.title && <h2 className="g4mp-cta__title">{config.title}</h2>}
          {config.body && <p className="g4mp-cta__body">{config.body}</p>}
        </div>
        {config.cta && <CtaButton cta={config.cta} onCtaClick={onCtaClick} />}
      </div>
    </section>
  );
}

function CardsSection({
  config,
  onCtaClick,
}: {
  config: MarketingSectionConfig;
  onCtaClick?: (cta: MarketingCta) => void;
}) {
  const items = config.items ?? [];
  if (items.length === 0) return null;
  const count = Math.min(Math.max(items.length, 2), 4);
  return (
    <section className="g4mp-section g4mp-cards">
      <div className="g4mp-inner">
        {(config.title || config.body) && (
          <div className="g4mp-cards__head">
            {config.title && <h2 className="g4mp-title">{config.title}</h2>}
            {config.body && <p className="g4mp-body">{config.body}</p>}
          </div>
        )}
        <div className={cx("g4mp-cards__grid", `g4mp-cards__grid--${count}`)}>
          {items.map((item, i) => {
            const hasImg = !!(item.file_url || item.mobile_file_url);
            const clickable = !!item.cta;
            const inner = (
              <>
                {hasImg ? (
                  <ResponsiveImg
                    desktopUrl={item.file_url}
                    mobileUrl={item.mobile_file_url}
                    width={W.GRID}
                    alt={item.title ?? `Card ${i + 1}`}
                    className="g4mp-card__img"
                  />
                ) : (
                  <span className="g4mp-card__fallback" />
                )}
                {(item.title || item.body) && (
                  <span className="g4mp-card__overlay">
                    {item.title && <span className="g4mp-card__title">{item.title}</span>}
                    {item.body && <span className="g4mp-card__sub">{item.body}</span>}
                  </span>
                )}
              </>
            );
            // The whole tile is the click target — no separate button.
            return clickable ? (
              <button key={i} type="button" className="g4mp-card" onClick={() => onCtaClick?.(item.cta!)}>
                {inner}
              </button>
            ) : (
              <div key={i} className="g4mp-card">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Section({
  section,
  onCtaClick,
}: {
  section: MarketingSection;
  onCtaClick?: (cta: MarketingCta) => void;
}) {
  switch (section.type) {
    case "hero":
      return <HeroSection config={section.config} onCtaClick={onCtaClick} />;
    case "story":
      return <StorySection config={section.config} />;
    case "team":
    case "materials":
      return <GridSection config={section.config} />;
    case "text_block":
      return <TextSection config={section.config} />;
    case "video":
      return <VideoSection config={section.config} />;
    case "cta":
      return <CtaSection config={section.config} onCtaClick={onCtaClick} />;
    case "cards":
      return <CardsSection config={section.config} onCtaClick={onCtaClick} />;
    default:
      return null; // Unknown type → skip, never crash the page.
  }
}

export interface MarketingPageProps {
  sections: MarketingSection[];
  /** CTA click (e.g. "Start order" → go to catalogue). External links are host-handled. */
  onCtaClick?: (cta: MarketingCta) => void;
  /** Render mobile crops + mobile layout regardless of viewport (editor preview). */
  forceMobile?: boolean;
  /** Optional CDN/Storage resizer. Defaults to identity. */
  transformImageUrl?: TransformImageUrl;
  className?: string;
}

/**
 * Full collection marketing page — all visible sections in order, with its own
 * self-contained styles injected inline. Zero dependency on any host design
 * system, so the admin preview and the B2B portal render it identically.
 */
export function MarketingPage({
  sections,
  onCtaClick,
  forceMobile = false,
  transformImageUrl = (url) => url,
  className,
}: MarketingPageProps) {
  const visible = sections
    .filter((s) => s.is_visible)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <ForceMobileContext.Provider value={forceMobile}>
      <TransformContext.Provider value={transformImageUrl}>
        <div className={cx("g4mp", forceMobile && "g4mp--mobile", className)}>
          <style>{MARKETING_CSS}</style>
          {visible.map((section) => (
            <Section key={section.id} section={section} onCtaClick={onCtaClick} />
          ))}
        </div>
      </TransformContext.Provider>
    </ForceMobileContext.Provider>
  );
}
