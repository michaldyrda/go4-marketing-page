import { drawnItems, has, resolveTarget } from "../model";
import { ExitMark, Frame, Img, SLOTS, Title, altOf, useAnchorProps, useField, useItem, usePage } from "../render";
import type { LandingSection } from "../types";

/** Logos — 3–12 logos in one wrapping row; the name is the alt text; optional link. */
export function Logos({ section }: { section: LandingSection }) {
  const { resolveHref, fileMode } = usePage();
  const anchor = useAnchorProps();
  const field = useField();
  const item = useItem();
  const c = section.config;
  return (
    <Frame className="g4mp-section g4mp-logos">
      <div className="g4mp-inner">
        {has(c.title) && <Title className="g4mp-eyebrow g4mp-logos__title">{c.title}</Title>}
        <ul className="g4mp-logos__list">
          {drawnItems(section).map((it, i) => {
            const img = <Img media={it.media} slot={SLOTS.LOGO} alt={altOf(it.media, it.name)} className="g4mp-img g4mp-logo" />;
            const target = resolveTarget(it.link, resolveHref);
            return (
              <li key={i} {...item}>
                {/* File mode: the name is its own field (on the page it is the image's alt). */}
                {fileMode && has(it.name) && (
                  <span hidden {...field("name")}>
                    {it.name}
                  </span>
                )}
                {target ? (
                  <a className="g4mp-logos__link" {...anchor(target)} {...field("link")}>
                    {img}
                    {target.external && <ExitMark />}
                  </a>
                ) : (
                  img
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Frame>
  );
}
