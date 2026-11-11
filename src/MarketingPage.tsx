import { createContext, useContext } from "react";
import type { ComponentType, MouseEvent, ReactNode } from "react";
import { MARKETING_CSS } from "./styles";
import { safeDimension, safeHref, safeImgSrc } from "./sanitizeUrl";
import { ctaLink, isExternalLink } from "./links";
import type {
  LandingLink,
  MarketingCta,
  MarketingMediaItem,
  MarketingSection,
  MarketingSectionConfig,
  ResolveHref,
  TransformImageUrl,
} from "./types";

/** Intended CSS widths per slot — handed to the host's image transformer. */
const W = { HERO: 960, STORY: 600, GRID: 400 } as const;

/** Widths offered in `srcset` per slot (only when the host can resize). */
const SRCSET_WIDTHS: Record<keyof typeof W, number[]> = {
  HERO: [640, 960, 1440, 1920, 2560],
  STORY: [400, 600, 900, 1200],
  GRID: [300, 400, 600, 800],
};

/** `sizes` per slot — how wide the image is drawn on the page. */
const SIZES: Record<keyof typeof W, string> = {
  HERO: "100vw",
  STORY: "(min-width: 768px) 50vw, 100vw",
  GRID: "(min-width: 768px) 25vw, 50vw",
};

interface Transform {
  fn: TransformImageUrl;
  /** True only when the host passed a resizer — identity makes srcset pointless. */
  resizes: boolean;
}

interface LinkHost {
  resolveHref?: ResolveHref;
  onCtaClick?: (cta: MarketingCta) => void;
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, link: LandingLink) => void;
}

const ForceMobileContext = createContext(false);
const TransformContext = createContext<Transform>({ fn: (url) => url, resizes: false });
const LinkHostContext = createContext<LinkHost>({});
/** Heading level of the current section's title: 1 for the first title on the page, else 2. */
const HeadingLevelContext = createContext<1 | 2>(2);
/** First section on the page: its images load eagerly, all others lazily. */
const FirstSectionContext = createContext(false);

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** <img> that swaps to a mobile crop: forced in preview, else viewport-driven. */
function ResponsiveImg({
  desktopUrl,
  mobileUrl,
  slot,
  alt,
  width,
  height,
  className,
}: {
  desktopUrl?: string | null;
  mobileUrl?: string | null;
  slot: keyof typeof W;
  alt: string;
  width?: number | null;
  height?: number | null;
  className?: string;
}) {
  const forceMobile = useContext(ForceMobileContext);
  const transform = useContext(TransformContext);
  const first = useContext(FirstSectionContext);

  const desktop = safeImgSrc(desktopUrl);
  const mobile = safeImgSrc(mobileUrl);
  const base = desktop || mobile;
  if (!base) return null;

  const src = (u: string) => transform.fn(u, W[slot]);
  const srcSet = (u: string) =>
    transform.resizes
      ? SRCSET_WIDTHS[slot].map((w) => `${transform.fn(u, w)} ${w}w`).join(", ")
      : undefined;
  const imgProps = {
    alt,
    className,
    width: safeDimension(width),
    height: safeDimension(height),
    loading: first ? undefined : ("lazy" as const),
    decoding: "async" as const,
    sizes: transform.resizes ? SIZES[slot] : undefined,
  };

  // Mobile preview: media queries can't see the frame, so force the crop.
  if (forceMobile) {
    const u = mobile || base;
    return <img src={src(u)} srcSet={srcSet(u)} {...imgProps} />;
  }
  return (
    <picture>
      {mobile && (
        <source
          media="(max-width: 640px)"
          srcSet={srcSet(mobile) ?? src(mobile)}
          sizes={imgProps.sizes}
        />
      )}
      <img src={src(base)} srcSet={srcSet(base)} {...imgProps} />
    </picture>
  );
}

/** Section / page title at the level that follows from its position. */
function Title({ className, children }: { className: string; children: ReactNode }) {
  const level = useContext(HeadingLevelContext);
  return level === 1 ? (
    <h1 className={className}>{children}</h1>
  ) : (
    <h2 className={className}>{children}</h2>
  );
}

type LinkTarget =
  | { as: "a"; href: string; external: boolean; link: LandingLink }
  | { as: "button" }
  | null;

/**
 * How a CTA is drawn. With `resolveHref` → `<a href>` (or nothing when the
 * target is unavailable or the href is unsafe). Legacy hosts that pass only
 * `onCtaClick` keep a `<button>`. Never a dead link.
 */
function useLinkTarget(cta?: MarketingCta | null): LinkTarget {
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

/** Props of an `<a>` for a resolved target (rel/target for external links). */
function anchorProps(target: Extract<LinkTarget, { as: "a" }>, host: LinkHost) {
  return {
    href: target.href,
    ...(target.external
      ? { rel: "noopener noreferrer nofollow", target: "_blank" as const }
      : {}),
    onClick: host.onLinkClick
      ? (e: MouseEvent<HTMLAnchorElement>) => host.onLinkClick?.(e, target.link)
      : undefined,
  };
}

const ExitMark = () => (
  <span className="g4mp-ext" aria-hidden="true">
    ↗
  </span>
);

function CtaButton({ cta, variant }: { cta: MarketingCta; variant?: "primary" }) {
  const host = useContext(LinkHostContext);
  const target = useLinkTarget(cta);
  if (!cta.label || !target) return null;
  const className = cx("g4mp-btn", variant === "primary" && "g4mp-btn--primary");
  if (target.as === "a") {
    return (
      <a className={className} {...anchorProps(target, host)}>
        {cta.label}
        {target.external && <ExitMark />}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={() => host.onCtaClick?.(cta)}>
      {cta.label}
    </button>
  );
}

const isImage = (m: { media_type?: string | null; file_url?: string | null }) =>
  m.media_type === "image" || (!m.media_type && !!m.file_url);

const findVideo = (config: MarketingSectionConfig) =>
  (config.media ?? []).find((m) => m.media_type === "video" && m.file_url);

/** Alt text: the brand's own, else the given fallback (section title), else decorative. */
const altOf = (m: { alt?: string | null }, fallback?: string | null) =>
  (m.alt ?? fallback ?? "").trim();

function MediaImg({
  media,
  slot,
  fallbackAlt,
  className,
}: {
  media: MarketingMediaItem;
  slot: keyof typeof W;
  fallbackAlt?: string | null;
  className?: string;
}) {
  return (
    <ResponsiveImg
      desktopUrl={media.file_url}
      mobileUrl={media.mobile_file_url}
      slot={slot}
      alt={altOf(media, fallbackAlt)}
      width={media.width}
      height={media.height}
      className={className}
    />
  );
}

function HeroSection({ config }: { config: MarketingSectionConfig }) {
  const hero = (config.media ?? []).find(
    (m) => m.role === "hero_image" || m.role === "background",
  ) ?? (config.media ?? []).find(isImage);
  return (
    <section className="g4mp-hero">
      {hero?.file_url ? (
        <MediaImg media={hero} slot="HERO" fallbackAlt={config.title} className="g4mp-hero__img" />
      ) : (
        <div className="g4mp-hero__fallback" />
      )}
      <div className="g4mp-hero__scrim" />
      <div className="g4mp-hero__inner">
        <div className="g4mp-hero__box">
          {config.subtitle && <p className="g4mp-eyebrow">{config.subtitle}</p>}
          {config.title && <Title className="g4mp-title">{config.title}</Title>}
          {config.body && <p className="g4mp-hero__body">{config.body}</p>}
          {config.cta && <CtaButton cta={config.cta} />}
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
          {config.title && <Title className="g4mp-title">{config.title}</Title>}
          {config.subtitle && <p className="g4mp-subtitle">{config.subtitle}</p>}
          {config.body && <p className="g4mp-body">{config.body}</p>}
        </div>
        {img?.file_url && (
          <div className="g4mp-story__media">
            <MediaImg media={img} slot="STORY" fallbackAlt={config.title} className="g4mp-story__img" />
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
        {(config.title || config.subtitle || config.body) && (
          <div className="g4mp-grid__head">
            {config.title && <Title className="g4mp-title">{config.title}</Title>}
            {config.subtitle && <p className="g4mp-subtitle">{config.subtitle}</p>}
            {config.body && <p className="g4mp-body">{config.body}</p>}
          </div>
        )}
        {imgs.length > 0 && (
          <div className="g4mp-grid__items">
            {imgs.map((img, i) => (
              <div key={i} className="g4mp-grid__cell">
                <MediaImg media={img} slot="GRID" />
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
        {config.title && <Title className="g4mp-title">{config.title}</Title>}
        {config.subtitle && <p className="g4mp-subtitle">{config.subtitle}</p>}
        {config.body && <p className="g4mp-body">{config.body}</p>}
      </div>
    </section>
  );
}

function VideoSection({ config }: { config: MarketingSectionConfig }) {
  const transform = useContext(TransformContext);
  const video = findVideo(config);
  const src = safeImgSrc(video?.file_url);
  if (!src) return null;
  const posterSrc = safeImgSrc(video?.poster_url);
  const poster = posterSrc ? transform.fn(posterSrc, 960) : undefined;
  return (
    <section className="g4mp-section g4mp-video">
      <div className="g4mp-inner g4mp-video__inner">
        <div className="g4mp-video__frame">
          {/* With a poster nothing is fetched until play; without one the first frame is the poster. */}
          <video
            src={src}
            controls
            playsInline
            poster={poster}
            preload={poster ? "none" : "metadata"}
            width={safeDimension(video?.width)}
            height={safeDimension(video?.height)}
          />
        </div>
        {(config.title || config.caption) && (
          <div className="g4mp-video__caption">
            {config.title && <Title className="g4mp-title">{config.title}</Title>}
            {config.caption && <p className="g4mp-body">{config.caption}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

function CtaSection({ config }: { config: MarketingSectionConfig }) {
  return (
    <section className="g4mp-section g4mp-cta">
      <div className="g4mp-inner g4mp-cta__inner">
        <div>
          {config.title && <Title className="g4mp-cta__title">{config.title}</Title>}
          {config.subtitle && <p className="g4mp-cta__sub">{config.subtitle}</p>}
          {config.body && <p className="g4mp-cta__body">{config.body}</p>}
        </div>
        {config.cta && <CtaButton cta={config.cta} />}
      </div>
    </section>
  );
}

function Card({ item }: { item: NonNullable<MarketingSectionConfig["items"]>[number] }) {
  const host = useContext(LinkHostContext);
  const target = useLinkTarget(item.cta);
  const hasImg = !!(item.file_url || item.mobile_file_url);
  // Headings are not allowed inside <button> (legacy hosts) — a span there.
  const TitleTag = target?.as === "button" ? "span" : "h3";
  const inner = (
    <>
      {hasImg ? (
        <ResponsiveImg
          desktopUrl={item.file_url}
          mobileUrl={item.mobile_file_url}
          slot="GRID"
          alt={altOf(item, item.title)}
          width={item.width}
          height={item.height}
          className="g4mp-card__img"
        />
      ) : (
        <span className="g4mp-card__fallback" />
      )}
      {(item.title || item.body) && (
        <span className="g4mp-card__overlay">
          {item.title && <TitleTag className="g4mp-card__title">{item.title}</TitleTag>}
          {item.body && <span className="g4mp-card__sub">{item.body}</span>}
        </span>
      )}
    </>
  );
  // The whole tile is the click target — no separate button.
  if (target?.as === "a") {
    return (
      <a className="g4mp-card g4mp-card--link" {...anchorProps(target, host)}>
        {inner}
      </a>
    );
  }
  if (target?.as === "button") {
    return (
      <button
        type="button"
        className="g4mp-card g4mp-card--link"
        onClick={() => host.onCtaClick?.(item.cta!)}
      >
        {inner}
      </button>
    );
  }
  return <div className="g4mp-card">{inner}</div>;
}

function CardsSection({ config }: { config: MarketingSectionConfig }) {
  const items = config.items ?? [];
  if (items.length === 0) return null;
  const count = Math.min(Math.max(items.length, 2), 4);
  return (
    <section className="g4mp-section g4mp-cards">
      <div className="g4mp-inner">
        {(config.title || config.subtitle || config.body) && (
          <div className="g4mp-cards__head">
            {config.title && <Title className="g4mp-title">{config.title}</Title>}
            {config.subtitle && <p className="g4mp-subtitle">{config.subtitle}</p>}
            {config.body && <p className="g4mp-body">{config.body}</p>}
          </div>
        )}
        <div className={cx("g4mp-cards__grid", CARD_GRID_CLASS[count])}>
          {items.map((item, i) => (
            <Card key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Closed list — content never reaches a class name directly. */
const CARD_GRID_CLASS: Record<number, string> = {
  2: "g4mp-cards__grid--2",
  3: "g4mp-cards__grid--3",
  4: "g4mp-cards__grid--4",
};

const SECTION_COMPONENTS: Record<string, ComponentType<{ config: MarketingSectionConfig }>> = {
  hero: HeroSection,
  story: StorySection,
  team: GridSection,
  materials: GridSection,
  text_block: TextSection,
  video: VideoSection,
  cta: CtaSection,
  cards: CardsSection,
};

/** Whether a section will draw a visible title — decides who gets the page's single <h1>. */
function rendersTitle(section: MarketingSection): boolean {
  const config = section.config ?? {};
  if (!Object.prototype.hasOwnProperty.call(SECTION_COMPONENTS, section.type)) return false;
  if (!config.title) return false;
  if (section.type === "video") return !!safeImgSrc(findVideo(config)?.file_url);
  if (section.type === "cards") return (config.items ?? []).length > 0;
  return true;
}

function Section({ section }: { section: MarketingSection }) {
  const Component = Object.prototype.hasOwnProperty.call(SECTION_COMPONENTS, section.type)
    ? SECTION_COMPONENTS[section.type]
    : undefined;
  if (!Component) return null; // Unknown type → skip, never crash the page.
  return <Component config={section.config ?? {}} />;
}

export interface MarketingPageProps {
  sections: MarketingSection[];
  /**
   * Turns a link target into an href for this host (e.g. the portal prefixes
   * the boutique path). When given, buttons and tiles are `<a href>`; a target
   * that is unavailable or resolves to null is drawn without a link.
   */
  resolveHref?: ResolveHref;
  /** Optional click hook on rendered links (client-side routing in an SPA host). */
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, link: LandingLink) => void;
  /** Legacy: without `resolveHref`, CTAs are `<button>`s and the host navigates here. */
  onCtaClick?: (cta: MarketingCta) => void;
  /** Render mobile crops + mobile layout regardless of viewport (editor preview). */
  forceMobile?: boolean;
  /** Optional CDN/Storage resizer. Defaults to identity. */
  transformImageUrl?: TransformImageUrl;
  /**
   * Inject the stylesheet as an inline `<style>` (default). Hosts with a strict
   * Content-Security-Policy set `false` and load `@go4/marketing-page/styles.css`
   * as a file instead (or allow `MARKETING_CSS_SHA256`).
   */
  injectStyles?: boolean;
  className?: string;
}

/**
 * Full marketing page — all visible sections in order. Zero dependency on any
 * host design system, so the admin preview, the B2B portal and the public brand
 * page render the same content.
 */
export function MarketingPage({
  sections,
  resolveHref,
  onLinkClick,
  onCtaClick,
  forceMobile = false,
  transformImageUrl,
  injectStyles = true,
  className,
}: MarketingPageProps) {
  const visible = sections
    .filter((s) => s.is_visible)
    .sort((a, b) => a.order_index - b.order_index);
  const firstTitledId = visible.find(rendersTitle)?.id;
  const transform: Transform = transformImageUrl
    ? { fn: transformImageUrl, resizes: true }
    : { fn: (url) => url, resizes: false };

  return (
    <ForceMobileContext.Provider value={forceMobile}>
      <TransformContext.Provider value={transform}>
        <LinkHostContext.Provider value={{ resolveHref, onLinkClick, onCtaClick }}>
          <div className={cx("g4mp", forceMobile && "g4mp--mobile", className)}>
            {/* Raw text: React escapes <style> children on the server ("…" → &quot;),
                which breaks the CSS. The string is the package's own constant, never content. */}
            {injectStyles && <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS }} />}
            {visible.map((section, i) => (
              <FirstSectionContext.Provider key={section.id} value={i === 0}>
                <HeadingLevelContext.Provider value={section.id === firstTitledId ? 1 : 2}>
                  <Section section={section} />
                </HeadingLevelContext.Provider>
              </FirstSectionContext.Provider>
            ))}
          </div>
        </LinkHostContext.Provider>
      </TransformContext.Provider>
    </ForceMobileContext.Provider>
  );
}
