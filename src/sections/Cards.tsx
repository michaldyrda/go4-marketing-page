import { legacyCta } from "../links";
import { drawnItems, has, legacyCtaOf, resolveTarget } from "../model";
import { Frame, altOf, cx, usePage } from "../render";
import type { LandingSection } from "../types";
import { Copy, hasCopy } from "./Copy";
import { CARD_GRID_CLASS, Tile, gridCount } from "./Tile";

/** Cards — 2–4 image tiles, each its own link; a tile without a link is not clickable. */
export function Cards({ section }: { section: LandingSection }) {
  const page = usePage();
  const c = section.config;
  const items = drawnItems(section);
  return (
    <Frame className="g4mp-section g4mp-cards">
      <div className="g4mp-inner">
        {hasCopy(c) && (
          <div className="g4mp-cards__head">
            <Copy title={c.title} subtitle={c.subtitle} body={c.body} />
          </div>
        )}
        <div className={cx("g4mp-cards__grid", CARD_GRID_CLASS[gridCount(items.length)])}>
          {items.map((item, i) => {
            const legacy = legacyCtaOf(item) ?? (item.link ? legacyCta({ label: item.title ?? "", link: item.link }) : undefined);
            return (
              <Tile
                key={i}
                media={item.media}
                alt={altOf(item.media, item.title)}
                title={item.title}
                lines={typeof item.body === "string" && has(item.body) ? [item.body] : []}
                target={resolveTarget(item.link, page.resolveHref)}
                onLegacyClick={!page.resolveHref && legacy ? () => page.onCtaClick?.(legacy) : undefined}
                lineFields={["body"]}
              />
            );
          })}
        </div>
      </div>
    </Frame>
  );
}
