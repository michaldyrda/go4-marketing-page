import { fill } from "../labels";
import { drawnCollections, has, resolveTarget } from "../model";
import { Frame, Title, altOf, cx, usePage } from "../render";
import type { LandingSection } from "../types";
import { CARD_GRID_CLASS, Tile, gridCount } from "./Tile";

/**
 * Collections — covers from data the host resolved (`section.resolved.collections`).
 * Draws only what the host served: no shipping for guests, never prices.
 */
export function Collections({ section }: { section: LandingSection }) {
  const { resolveHref, labels } = usePage();
  const c = section.config;
  const items = drawnCollections(section);
  const shipping = (s?: string) => (c.show_shipping && has(s) ? fill(labels.shipping, { date: s }) : undefined);
  const tall = items.some((it) => shipping(it.shipping));
  return (
    <Frame className="g4mp-section g4mp-cards g4mp-collections">
      <div className="g4mp-inner">
        {has(c.title) && (
          <div className="g4mp-cards__head">
            <Title className="g4mp-title">{c.title}</Title>
          </div>
        )}
        <div className={cx("g4mp-cards__grid", CARD_GRID_CLASS[gridCount(items.length)], tall && "g4mp-cards__grid--tall")}>
          {items.map((it) => {
            const styles =
              it.styles != null ? fill(it.styles === 1 ? labels.styles.one : labels.styles.other, { n: it.styles }) : undefined;
            const meta = [it.season, styles].filter(has).join(" · ");
            return (
              <Tile
                key={it.id}
                media={it.cover}
                alt={altOf(it.cover, it.name)}
                title={it.name}
                lines={[meta, shipping(it.shipping)].filter(has)}
                target={resolveTarget(it.link ?? { kind: "collection", id: it.id }, resolveHref)}
              />
            );
          })}
        </div>
      </div>
    </Frame>
  );
}
