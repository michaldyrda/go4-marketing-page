import { Buttons, Frame } from "../render";
import type { LandingSection } from "../types";
import { Copy } from "./Copy";

/** Text — title, subtitle, paragraphs, optional button. */
export function Text({ section }: { section: LandingSection }) {
  const c = section.config;
  return (
    <Frame className="g4mp-section g4mp-text">
      <div className="g4mp-text__inner">
        <Copy title={c.title} subtitle={c.subtitle} body={c.body} />
        <Buttons buttons={c.buttons} variants={["primary"]} />
      </div>
    </Frame>
  );
}
