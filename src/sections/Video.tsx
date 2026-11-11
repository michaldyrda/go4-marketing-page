import { has } from "../model";
import { Frame, Title, usePage } from "../render";
import { safeDimension, safeImgSrc } from "../sanitizeUrl";
import type { LandingSection } from "../types";

/** Video — a library file with a poster; nothing is fetched until play when a poster exists. */
export function Video({ section }: { section: LandingSection }) {
  const { transform } = usePage();
  const c = section.config;
  const src = safeImgSrc(c.media?.file_url);
  if (!src) return null;
  const posterSrc = safeImgSrc(c.media?.poster_url);
  const poster = posterSrc ? transform.fn(posterSrc, 960) : undefined;
  return (
    <Frame className="g4mp-section g4mp-video">
      <div className="g4mp-inner g4mp-video__inner">
        <div className="g4mp-video__frame">
          <video
            src={src}
            controls
            playsInline
            poster={poster}
            preload={poster ? "none" : "metadata"}
            width={safeDimension(c.media?.width)}
            height={safeDimension(c.media?.height)}
          />
        </div>
        {(has(c.title) || has(c.caption)) && (
          <div className="g4mp-video__caption">
            {has(c.title) && <Title className="g4mp-title">{c.title}</Title>}
            {has(c.caption) && <p className="g4mp-body">{c.caption}</p>}
          </div>
        )}
      </div>
    </Frame>
  );
}
