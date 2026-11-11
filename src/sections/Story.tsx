import { drawnButtons, mediaSrc } from "../model";
import { Buttons, Frame, Img, SLOTS, altOf, cx, usePage } from "../render";
import type { LandingSection } from "../types";
import { Copy, hasCopy } from "./Copy";

/** Closed list → class (content never becomes a class name). */
const SIDE_CLASS = { left: "g4mp-story--left", right: undefined } as const;

/** Image and text — one image next to a title and text; image on the left or right. */
export function Story({ section }: { section: LandingSection }) {
  const { resolveHref } = usePage();
  const c = section.config;
  const text = hasCopy(c) || drawnButtons(c.buttons, resolveHref).length > 0;
  return (
    <Frame className={cx("g4mp-section g4mp-story", SIDE_CLASS[c.image_side ?? "right"])}>
      <div className="g4mp-inner g4mp-story__grid">
        {text && (
          <div className="g4mp-story__copy">
            <Copy title={c.title} subtitle={c.subtitle} body={c.body} />
            <Buttons buttons={c.buttons} variants={["primary"]} />
          </div>
        )}
        {mediaSrc(c.media) && (
          <div className="g4mp-story__media">
            <Img media={c.media} slot={SLOTS.STORY} alt={altOf(c.media, c.title)} className="g4mp-img g4mp-story__img" />
          </div>
        )}
      </div>
    </Frame>
  );
}
