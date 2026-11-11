import { drawnItems, has } from "../model";
import { Frame, useField, useItem } from "../render";
import type { LandingSection } from "../types";

/** Key facts — 2–4 large values, each with a label. */
export function Facts({ section }: { section: LandingSection }) {
  const field = useField();
  const item = useItem();
  return (
    <Frame className="g4mp-section g4mp-facts">
      <div className="g4mp-inner">
        <ul className="g4mp-facts__list">
          {drawnItems(section).map((it, i) => (
            <li key={i} className="g4mp-fact" {...item}>
              <span className="g4mp-fact__value" {...field("value")}>{it.value}</span>
              {has(it.label) && <span className="g4mp-fact__label" {...field("label")}>{it.label}</span>}
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}
