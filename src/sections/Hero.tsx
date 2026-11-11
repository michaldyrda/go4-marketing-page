import { drawnButtons, has, mediaSrc } from "../model";
import { hasRichText } from "../richText";
import { Buttons, Frame, Img, RichTextView, SLOTS, Title, altOf, mediaFileAttrs, useField, usePage } from "../render";
import { safeDimension, safeImgSrc } from "../sanitizeUrl";
import type { LandingSection } from "../types";

/** Hero — `cover` (full-width image or video with text on it) or `split` (text next to a portrait image). */
export function Hero({ section }: { section: LandingSection }) {
  return section.config.variant === "split" ? <HeroSplit section={section} /> : <HeroCover section={section} />;
}

function HeroCover({ section }: { section: LandingSection }) {
  const { transform, fileMode } = usePage();
  const field = useField();
  const c = section.config;
  const m = c.media;
  const video = m?.media_type === "video" ? safeImgSrc(m.file_url) : undefined;
  const poster = video ? safeImgSrc(m?.poster_url) : undefined;
  return (
    <Frame className="g4mp-hero">
      {video ? (
        // Background video: muted, looped, no controls; the poster shows until it plays.
        <video
          className="g4mp-img g4mp-hero__img"
          src={video}
          poster={poster ? transform.fn(poster, SLOTS.HERO.width) : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload={poster ? "none" : "metadata"}
          width={safeDimension(m?.width)}
          height={safeDimension(m?.height)}
          aria-hidden="true"
          {...(fileMode ? mediaFileAttrs(m, "media") : {})}
        />
      ) : mediaSrc(m) ? (
        <Img media={m} slot={SLOTS.HERO} alt={altOf(m, c.title)} className="g4mp-img g4mp-hero__img" />
      ) : (
        <div className="g4mp-hero__fallback" />
      )}
      <div className="g4mp-hero__scrim" />
      <div className="g4mp-hero__inner">
        <div className="g4mp-hero__box">
          {has(c.eyebrow) && <p className="g4mp-eyebrow" {...field("eyebrow")}>{c.eyebrow}</p>}
          {has(c.title) && <Title className="g4mp-title">{c.title}</Title>}
          <RichTextView value={c.body} className="g4mp-hero__body" />
          <Buttons buttons={c.buttons} variants={["plain", "outline"]} />
        </div>
      </div>
    </Frame>
  );
}

function HeroSplit({ section }: { section: LandingSection }) {
  const { resolveHref } = usePage();
  const field = useField();
  const c = section.config;
  const text = has(c.eyebrow) || has(c.title) || hasRichText(c.body) || drawnButtons(c.buttons, resolveHref).length > 0;
  return (
    <Frame className="g4mp-section g4mp-hero-split">
      <div className="g4mp-inner g4mp-hero-split__grid">
        {text && (
          <div className="g4mp-hero-split__copy">
            {has(c.eyebrow) && <p className="g4mp-eyebrow" {...field("eyebrow")}>{c.eyebrow}</p>}
            {has(c.title) && <Title className="g4mp-title g4mp-hero-split__title">{c.title}</Title>}
            <RichTextView value={c.body} className="g4mp-hero-split__body" />
            <Buttons buttons={c.buttons} variants={["primary", "outline-dark"]} />
          </div>
        )}
        {mediaSrc(c.media) && (
          <div className="g4mp-hero-split__media">
            <Img media={c.media} slot={SLOTS.SPLIT} alt={altOf(c.media, c.title)} className="g4mp-img g4mp-hero-split__img" />
          </div>
        )}
      </div>
    </Frame>
  );
}
