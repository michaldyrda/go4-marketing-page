import { Fragment } from "react";
import { drawnItems, has } from "../model";
import { Frame, Img, SLOTS, altOf, cx, useField, useItem } from "../render";
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
  const field = useField();
  const item = useItem();
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
            {items.map((it, i) => {
              const plain = !has(it.caption) && !has(it.subcaption);
              const cell = (
                <div className="g4mp-grid__cell" {...(plain ? item : {})}>
                  <Img media={it.media} slot={n === 1 ? SLOTS.WIDE : SLOTS.GRID} alt={altOf(it.media, it.caption)} className="g4mp-img" />
                </div>
              );
              if (plain) return <Fragment key={i}>{cell}</Fragment>;
              return (
                <figure key={i} className="g4mp-grid__fig" {...item}>
                  {cell}
                  <figcaption className="g4mp-grid__cap" {...field("caption")}>
                    {it.caption}
                    {has(it.subcaption) && <span className="g4mp-grid__subcap" {...field("subcaption")}>{it.subcaption}</span>}
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
