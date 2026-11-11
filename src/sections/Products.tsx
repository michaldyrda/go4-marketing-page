import { drawnProducts, has, resolveTarget } from "../model";
import { ExitMark, Frame, Img, SLOTS, Title, altOf, useAnchorProps, usePage } from "../render";
import type { LandingSection, ResolvedProduct } from "../types";

/** Products — product photos from data the host resolved (`section.resolved.products`); no prices. */
export function Products({ section }: { section: LandingSection }) {
  const c = section.config;
  return (
    <Frame className="g4mp-section g4mp-products">
      <div className="g4mp-inner">
        {(has(c.title) || has(c.subtitle)) && (
          <div className="g4mp-head">
            {has(c.title) && <Title className="g4mp-title">{c.title}</Title>}
            {has(c.subtitle) && <p className="g4mp-subtitle">{c.subtitle}</p>}
          </div>
        )}
        <div className="g4mp-products__grid">
          {drawnProducts(section).map((p) => (
            <Product key={p.id} product={p} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Product({ product: p }: { product: ResolvedProduct }) {
  const { resolveHref } = usePage();
  const anchor = useAnchorProps();
  const target = resolveTarget(p.link ?? { kind: "product", id: p.id }, resolveHref);
  const inner = (
    <>
      <span className="g4mp-product__frame">
        <Img media={p.image} slot={SLOTS.GRID} alt={altOf(p.image, p.name)} className="g4mp-img g4mp-product__img" />
      </span>
      {has(p.name) && <h3 className="g4mp-product__name">{p.name}</h3>}
      {has(p.category) && <span className="g4mp-product__cat">{p.category}</span>}
    </>
  );
  return target ? (
    <a className="g4mp-product" {...anchor(target)}>
      {inner}
      {target.external && <ExitMark />}
    </a>
  ) : (
    <div className="g4mp-product">{inner}</div>
  );
}
