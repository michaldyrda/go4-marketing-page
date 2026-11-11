import { has } from "../model";
import { Frame, Title, mediaFileAttrs, useField, usePage } from "../render";
import { safeDimension, safeImgSrc } from "../sanitizeUrl";
import type { LandingSection } from "../types";

/** Video — a library file with a poster; nothing is fetched until play when a poster exists. */
export function Video({ section }: { section: LandingSection }) {
  const { transform, fileMode } = usePage();
  const field = useField();
  const c = section.config;
  const src = safeImgSrc(c.media?.file_url);
  // File mode keeps a section without a file (title and caption stay in the file).
  if (!src && !fileMode) return null;
  const posterSrc = safeImgSrc(c.media?.poster_url);
  const poster = posterSrc ? transform.fn(posterSrc, 960) : undefined;
  return (
    <Frame className="g4mp-section g4mp-video">
      <div className="g4mp-inner g4mp-video__inner">
        {src && (
          <div className="g4mp-video__frame">
            <video
              src={src}
              controls
              playsInline
              poster={poster}
              preload={poster ? "none" : "metadata"}
              width={safeDimension(c.media?.width)}
              height={safeDimension(c.media?.height)}
              {...(fileMode ? mediaFileAttrs(c.media, "media") : {})}
            />
          </div>
        )}
        {(has(c.title) || has(c.caption)) && (
          <div className="g4mp-video__caption">
            {has(c.title) && <Title className="g4mp-title">{c.title}</Title>}
            {has(c.caption) && <p className="g4mp-body" {...field("caption")}>{c.caption}</p>}
          </div>
        )}
      </div>
    </Frame>
  );
}
