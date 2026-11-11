import { Fragment } from "react";
import { drawnItems, has } from "../model";
import { Frame, Img, SLOTS, altOf, cx } from "../render";
import type { LandingSection } from "../types";
import { Copy, hasCopy } from "./Copy";

const COUNT_CLASS: Record<number, string> = {
  1: "g4mp-grid__items--1",
  2: "g4mp-grid__items--2",
  3: "g4mp-grid__items--3",
};

/** Gallery — 1–12 images with captions (replaces Team and Materials). One image = a wide banner. */
export function Gallery({ section }: { section: LandingSection }) {
  const c = section.config;
  const items = drawnItems(section);
  const n = items.length;
  const captions = items.some((i) => has(i.caption) || has(i.subcaption));
  return (
    <Frame className="g4mp-section g4mp-grid">
      <div className="g4mp-inner">
        {hasCopy(c) && (
          <div className="g4mp-grid__head">
            <Copy title={c.title} subtitle={c.subtitle} body={c.body} />
          </div>
        )}
        {n > 0 && (
          <div className={cx("g4mp-grid__items", COUNT_CLASS[n], captions && "g4mp-grid__items--captions")}>
            {items.map((item, i) => {
              const cell = (
                <div className="g4mp-grid__cell">
                  <Img media={item.media} slot={n === 1 ? SLOTS.WIDE : SLOTS.GRID} alt={altOf(item.media, item.caption)} className="g4mp-img" />
                </div>
              );
              if (!has(item.caption) && !has(item.subcaption)) return <Fragment key={i}>{cell}</Fragment>;
              return (
                <figure key={i} className="g4mp-grid__fig">
                  {cell}
                  <figcaption className="g4mp-grid__cap">
                    {item.caption}
                    {has(item.subcaption) && <span className="g4mp-grid__subcap">{item.subcaption}</span>}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </Frame>
  );
}
