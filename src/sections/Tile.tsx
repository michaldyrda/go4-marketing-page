import type { ReactNode } from "react";
import type { ResolvedTarget } from "../model";
import { ExitMark, Img, SLOTS, useAnchorProps } from "../render";
import type { LandingMedia } from "../types";

/**
 * 2:3 image tile with a title band (Cards, Collections). The whole tile is the
 * link; without a target it is a plain tile. `onLegacyClick` = legacy host.
 */
export function Tile({
  media,
  alt,
  title,
  lines,
  target,
  onLegacyClick,
}: {
  media?: LandingMedia;
  alt: string;
  title?: string;
  lines: string[];
  target: ResolvedTarget | null;
  onLegacyClick?: () => void;
}) {
  const anchor = useAnchorProps();
  const legacy = !target && !!onLegacyClick;
  // Headings are not allowed inside <button> (legacy hosts) — a span there.
  const TitleTag = legacy ? "span" : "h3";
  const hasImg = !!(media?.file_url || media?.mobile_file_url);
  const inner: ReactNode = (
    <>
      {hasImg ? (
        <Img media={media} slot={SLOTS.GRID} alt={alt} className="g4mp-img g4mp-card__img" />
      ) : (
        <span className="g4mp-card__fallback" />
      )}
      {(title || lines.length > 0) && (
        <span className="g4mp-card__overlay">
          {title && <TitleTag className="g4mp-card__title">{title}</TitleTag>}
          {lines.map((l, i) => (
            <span key={i} className="g4mp-card__sub">
              {l}
            </span>
          ))}
        </span>
      )}
    </>
  );
  if (target) {
    return (
      <a className="g4mp-card g4mp-card--link" {...anchor(target)}>
        {inner}
        {target.external && <ExitMark />}
      </a>
    );
  }
  if (legacy) {
    return (
      <button type="button" className="g4mp-card g4mp-card--link" onClick={onLegacyClick}>
        {inner}
      </button>
    );
  }
  return <div className="g4mp-card">{inner}</div>;
}

/** Closed list — content never reaches a class name directly. */
export const CARD_GRID_CLASS: Record<number, string> = {
  2: "g4mp-cards__grid--2",
  3: "g4mp-cards__grid--3",
  4: "g4mp-cards__grid--4",
};
export const gridCount = (n: number) => Math.min(Math.max(n, 2), 4);
