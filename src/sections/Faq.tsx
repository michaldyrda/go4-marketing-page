import { drawnItems, has } from "../model";
import { Frame, RichTextView, Title } from "../render";
import type { LandingSection } from "../types";

/** FAQ — questions in `<details>` that open to show the answer. */
export function Faq({ section }: { section: LandingSection }) {
  const c = section.config;
  return (
    <Frame className="g4mp-section g4mp-faq">
      <div className="g4mp-faq__inner">
        {has(c.title) && <Title className="g4mp-title">{c.title}</Title>}
        <div className="g4mp-faq__list">
          {drawnItems(section).map((it, i) => (
            <details key={i} className="g4mp-faq__item">
              <summary className="g4mp-faq__q">
                <h3 className="g4mp-faq__qt">{it.question}</h3>
                <span className="g4mp-faq__sign" aria-hidden="true" />
              </summary>
              <RichTextView value={it.answer} className="g4mp-body g4mp-faq__a" />
            </details>
          ))}
        </div>
      </div>
    </Frame>
  );
}
