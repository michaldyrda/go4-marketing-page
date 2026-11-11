import { drawnItems, has, mediaSrc } from "../model";
import { Frame, Img, RichTextView, SLOTS, Title, altOf, cx, useField, useItem } from "../render";
import type { LandingItem, LandingSection } from "../types";

/** Quotes — one large quote, or 2–6 as cards; a quote without an author is not drawn. */
export function Quotes({ section }: { section: LandingSection }) {
  const c = section.config;
  const items = drawnItems(section);
  const solo = items.length === 1;
  const figs = items.map((it, i) => <Quote key={i} item={it} solo={solo} />);
  const cols = items.length === 2 || items.length === 4 ? "g4mp-quotes__grid--2" : "g4mp-quotes__grid--3";
  return (
    <Frame className="g4mp-section g4mp-quotes">
      <div className="g4mp-inner">
        {has(c.title) && (
          <div className="g4mp-head">
            <Title className="g4mp-title">{c.title}</Title>
          </div>
        )}
        {solo ? figs : <div className={cx("g4mp-quotes__grid", cols)}>{figs}</div>}
      </div>
    </Frame>
  );
}

function Quote({ item, solo }: { item: LandingItem; solo: boolean }) {
  const avatar = mediaSrc(item.avatar);
  const field = useField();
  return (
    <figure className={cx("g4mp-quote", solo && "g4mp-quote--solo")} {...useItem()}>
      <blockquote>
        <RichTextView value={item.text} className="g4mp-quote__text" field="text" />
      </blockquote>
      <figcaption className="g4mp-quote__by">
        {avatar && <Img media={item.avatar} slot={SLOTS.AVATAR} alt={altOf(item.avatar, item.author)} className="g4mp-img g4mp-quote__avatar" field="avatar" />}
        <span>
          {has(item.author) && <span className="g4mp-quote__name" {...field("author")}>{item.author}</span>}
          {has(item.role) && <span className="g4mp-quote__role" {...field("role")}>{item.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
