import { drawnItems, has, mediaSrc } from "../model";
import { Frame, Img, RichTextView, SLOTS, Title, altOf, cx } from "../render";
import type { LandingSection } from "../types";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Features — 2–6 numbered points with a title, text and optional image. */
export function Features({ section }: { section: LandingSection }) {
  const c = section.config;
  const items = drawnItems(section);
  const cols = items.length === 2 || items.length === 4 ? "g4mp-features__list--2" : "g4mp-features__list--3";
  return (
    <Frame className="g4mp-section g4mp-features">
      <div className="g4mp-inner">
        {has(c.title) && (
          <div className="g4mp-head g4mp-head--left">
            <Title className="g4mp-title">{c.title}</Title>
          </div>
        )}
        {items.length > 0 && (
          <ol className={cx("g4mp-features__list", cols)}>
            {items.map((it, i) => {
              const img = mediaSrc(it.media);
              return (
                <li key={i} className={cx("g4mp-feature", img && "g4mp-feature--media")}>
                  {img && <Img media={it.media} slot={SLOTS.FEATURE} alt={altOf(it.media, it.title)} className="g4mp-img g4mp-feature__img" />}
                  <div className="g4mp-feature__text">
                    <span className="g4mp-feature__no">{pad2(i + 1)}</span>
                    {has(it.title) && <h3 className="g4mp-feature__title">{it.title}</h3>}
                    <RichTextView value={it.body} className="g4mp-feature__body" />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </Frame>
  );
}
