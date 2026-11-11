import { Buttons, Frame } from "../render";
import type { LandingSection } from "../types";
import { Copy, hasCopy } from "./Copy";

/** Call to action — black band with a title, text and 1–2 buttons. */
export function Cta({ section }: { section: LandingSection }) {
  const c = section.config;
  return (
    <Frame className="g4mp-section g4mp-cta">
      <div className="g4mp-inner g4mp-cta__inner">
        {hasCopy(c) && (
          <div>
            <Copy
              title={c.title}
              subtitle={c.subtitle}
              body={c.body}
              titleClass="g4mp-cta__title"
              subtitleClass="g4mp-cta__sub"
              bodyClass="g4mp-cta__body"
            />
          </div>
        )}
        <Buttons buttons={c.buttons} variants={["plain", "outline"]} />
      </div>
    </Frame>
  );
}
