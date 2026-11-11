/**
 * Self-contained styles for the landing page. Scoped under `.g4mp`, prefixed
 * `g4mp-`, no design tokens imported from any host. The host may set a few CSS
 * variables (fonts, radius, background, ink — see README); without them the
 * page keeps its own neutral look (= 0.4.1).
 *
 * Responsive strategy: mobile-first base rules; desktop overrides live inside a
 * `min-width` media query AND are gated on `.g4mp:not(.g4mp--mobile)`. So the
 * editor's mobile preview (which only shrinks a 375px frame, invisible to media
 * queries) forces the mobile layout by adding `g4mp--mobile`.
 */
export const MARKETING_CSS = `
.g4mp {
  /* Host variables (all optional) → resolved values; defaults = the 0.4.1 look. */
  --g4mp-c-bg: var(--g4mp-bg, #fafafa);
  --g4mp-c-surface: var(--g4mp-surface, #ffffff);
  --g4mp-c-surface-2: var(--g4mp-surface-2, #f4f4f4);
  --g4mp-c-ink: var(--g4mp-ink, #0a0a0a);
  --g4mp-c-muted: var(--g4mp-muted, #737373);
  --g4mp-c-ondark: var(--g4mp-ondark, #ffffff);
  --g4mp-c-line: var(--g4mp-line, #e5e5e5);
  --g4mp-c-font-body: var(--g4mp-font-body, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
  --g4mp-c-font-heading: var(--g4mp-font-heading, var(--g4mp-c-font-body));
  --g4mp-c-radius: var(--g4mp-radius, 12px);
  --g4mp-c-radius-btn: var(--g4mp-radius, 8px);
  width: 100%;
  background: var(--g4mp-c-bg);
  color: var(--g4mp-c-ink);
  font-family: var(--g4mp-c-font-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.g4mp *, .g4mp *::before, .g4mp *::after { box-sizing: border-box; }
.g4mp img, .g4mp video { display: block; max-width: 100%; }
.g4mp h1, .g4mp h2, .g4mp h3, .g4mp p { margin: 0; }
.g4mp h1, .g4mp h2, .g4mp h3, .g4mp-fact__value { font-family: var(--g4mp-c-font-heading); }

.g4mp-section { padding: 48px 24px; }
.g4mp-inner { max-width: 1120px; margin: 0 auto; }
.g4mp-eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; }
.g4mp-title { font-size: 30px; line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
.g4mp-subtitle { font-size: 17px; font-weight: 700; color: var(--g4mp-c-ink); }
.g4mp-body { font-size: 15px; line-height: 1.6; color: var(--g4mp-c-ink); white-space: pre-line; }

/* Button */
.g4mp-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px; border-radius: var(--g4mp-c-radius-btn); border: 0; cursor: pointer;
  font-family: inherit; font-size: 14px; font-weight: 600; line-height: 1;
  background: var(--g4mp-c-ondark); color: var(--g4mp-c-ink);
  transition: opacity 0.15s ease;
}
a.g4mp-btn { text-decoration: none; }
.g4mp-btn:hover { opacity: 0.88; }
.g4mp-ext { font-size: 0.9em; line-height: 1; }
.g4mp-btn:focus-visible { outline: 2px solid var(--g4mp-c-ink); outline-offset: 2px; }
.g4mp-btn--primary { background: var(--g4mp-c-ink); color: var(--g4mp-c-ondark); }

/* Hero */
.g4mp-hero { position: relative; display: flex; align-items: flex-end; min-height: 56vh; overflow: hidden; }
.g4mp-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.g4mp-hero__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
.g4mp-hero__scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.15) 55%, transparent); }
.g4mp-hero__inner { position: relative; z-index: 1; width: 100%; padding: 24px; }
.g4mp-hero__box { max-width: 760px; }
.g4mp-hero .g4mp-eyebrow { color: rgba(255,255,255,0.8); margin-bottom: 8px; }
.g4mp-hero .g4mp-title { color: var(--g4mp-c-ondark); margin-bottom: 14px; }
.g4mp-hero__body { color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.55; max-width: 640px; margin-bottom: 22px; white-space: pre-line; }

/* Story (text + image) */
.g4mp-story { background: var(--g4mp-c-surface); }
.g4mp-story__grid { display: flex; flex-direction: column; gap: 28px; }
.g4mp-story__copy .g4mp-title { margin-bottom: 12px; }
.g4mp-story__copy .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-story__img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--g4mp-c-radius); }

/* Grid (team / materials) */
.g4mp-grid { background: var(--g4mp-c-surface-2); }
.g4mp-grid__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-grid__head .g4mp-title { margin-bottom: 12px; }
.g4mp-grid__head .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-grid__items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.g4mp-grid__cell { aspect-ratio: 1 / 1; overflow: hidden; border-radius: var(--g4mp-c-radius); }
.g4mp-grid__cell img { width: 100%; height: 100%; object-fit: cover; }

/* Text block */
.g4mp-text { background: var(--g4mp-c-surface); }
.g4mp-text__inner { max-width: 720px; margin: 0 auto; text-align: center; }
.g4mp-text__inner .g4mp-title { margin-bottom: 12px; }
.g4mp-text__inner .g4mp-subtitle { margin-bottom: 12px; }

/* Video */
.g4mp-video { background: var(--g4mp-c-surface); }
.g4mp-video__inner { max-width: 960px; margin: 0 auto; }
.g4mp-video__frame { width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: var(--g4mp-c-radius); overflow: hidden; }
.g4mp-video__frame video { width: 100%; height: 100%; object-fit: contain; }
.g4mp-video__caption { margin-top: 16px; text-align: center; }
.g4mp-video__caption .g4mp-title { font-size: 24px; margin-bottom: 6px; }

/* CTA bar */
.g4mp-cta { background: var(--g4mp-c-ink); color: var(--g4mp-c-ondark); }
.g4mp-cta__inner { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.g4mp-cta__title { font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
.g4mp-cta__sub { font-weight: 700; color: rgba(255,255,255,0.85); margin-bottom: 6px; }
.g4mp-cta__body { color: rgba(255,255,255,0.85); white-space: pre-line; }

/* Cards — the whole tile is the click target (image + overlaid title), no button. */
.g4mp-cards { background: var(--g4mp-c-surface); }
.g4mp-cards__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-cards__head .g4mp-title { margin-bottom: 12px; }
.g4mp-cards__head .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-cards__grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.g4mp-card { position: relative; display: block; width: 100%; aspect-ratio: 2 / 3; overflow: hidden; border-radius: var(--g4mp-c-radius); background: var(--g4mp-c-ink); }
.g4mp-card--link { appearance: none; -webkit-appearance: none; border: 0; padding: 0; margin: 0; font: inherit; text-align: left; color: inherit; text-decoration: none; cursor: pointer; }
.g4mp-card__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
.g4mp-card__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
.g4mp-card--link:hover .g4mp-card__img { transform: scale(1.04); }
.g4mp-card--link:focus-visible { outline: 2px solid var(--g4mp-c-ink); outline-offset: 2px; }
.g4mp-card__overlay { position: absolute; left: 0; right: 0; bottom: 0; height: 82px; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 16px 14px; background: rgba(0, 0, 0, 0.55); }
.g4mp-card__title { display: block; color: #fff; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.12; }
.g4mp-card__sub { display: block; color: rgba(255,255,255,0.82); font-size: 14px; line-height: 1.4; margin-top: 5px; }

/* ── Desktop (real wide viewport, unless mobile preview is forced) ── */
@media (min-width: 768px) {
  .g4mp:not(.g4mp--mobile) .g4mp-section { padding: 80px 48px; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero { min-height: 70vh; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero__inner { padding: 56px; }
  .g4mp:not(.g4mp--mobile) .g4mp-title { font-size: 48px; }
  .g4mp:not(.g4mp--mobile) .g4mp-story__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
  .g4mp:not(.g4mp--mobile) .g4mp-story__copy { order: 1; }
  .g4mp:not(.g4mp--mobile) .g4mp-story__media { order: 2; }
  .g4mp:not(.g4mp--mobile) .g4mp-grid__items { grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-cta__inner { flex-direction: row; justify-content: space-between; text-align: left; }
  .g4mp:not(.g4mp--mobile) .g4mp-cards__grid--2 { grid-template-columns: repeat(2, 1fr); max-width: 720px; margin-left: auto; margin-right: auto; }
  .g4mp:not(.g4mp--mobile) .g4mp-cards__grid--3 { grid-template-columns: repeat(3, 1fr); }
  .g4mp:not(.g4mp--mobile) .g4mp-cards__grid--4 { grid-template-columns: repeat(4, 1fr); }
  .g4mp:not(.g4mp--mobile) .g4mp-card__title { font-size: 24px; }
  .g4mp:not(.g4mp--mobile) .g4mp-card__overlay { height: 94px; padding: 0 20px 16px; }
}

/* ══ Catalog 0.5.0 ══ */
   ══════════════════════════════════════════════════════════════════════════ */
.g4mp ul, .g4mp ol { margin: 0; padding: 0; list-style: none; }
.g4mp blockquote, .g4mp figure { margin: 0; }
.g4mp-title { text-wrap: balance; }

/* One class for every image of the catalog. */
.g4mp-img { display: block; object-fit: cover; }

/* A section without a heading joins the previous one with the same background. */
.g4mp-section.g4mp-section--joined { padding-top: 0; }

/* Section heading: centred above grids, --left in text sections. */
.g4mp-head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-head .g4mp-title { margin-bottom: 12px; }
.g4mp-head .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-head > :last-child { margin-bottom: 0; }
.g4mp-head--left { margin-left: 0; text-align: left; }
.g4mp-grid__head > :last-child, .g4mp-cards__head > :last-child,
.g4mp-text__inner > :last-child, .g4mp-story__copy > :last-child { margin-bottom: 0; }

/* Button pair */
.g4mp-btn--outline { background: transparent; color: var(--g4mp-c-ondark); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.85); }
.g4mp-btn--outline-dark { background: transparent; color: var(--g4mp-c-ink); box-shadow: inset 0 0 0 1.5px var(--g4mp-c-ink); }
.g4mp-hero .g4mp-btn:focus-visible, .g4mp-cta .g4mp-btn:focus-visible { outline-color: var(--g4mp-c-ondark); }
.g4mp-btns { display: flex; flex-wrap: wrap; gap: 10px; }
.g4mp-text__inner .g4mp-btns { justify-content: center; margin-top: 24px; }
.g4mp-story__copy .g4mp-btns { margin-top: 24px; }

/* Hero cover height — an editor frame sets --g4mp-hero-h (vh counts the window). */
.g4mp-hero { min-height: var(--g4mp-hero-h, 56vh); }
/* 0.4.1 bug: these margins lost to the ".g4mp p { margin: 0 }" reset. */
.g4mp .g4mp-hero__body { margin-bottom: 22px; }
.g4mp .g4mp-hero__body:last-child, .g4mp-hero .g4mp-title:last-child { margin-bottom: 0; }

/* Hero split — text next to a portrait image */
.g4mp-hero-split { background: var(--g4mp-c-bg); }
.g4mp-hero-split__grid { display: flex; flex-direction: column; gap: 28px; }
.g4mp-hero-split__media { order: -1; }
.g4mp-hero-split__img { width: 100%; aspect-ratio: 4 / 5; border-radius: var(--g4mp-c-radius); }
.g4mp-hero-split__copy { min-width: 0; }
.g4mp-hero-split .g4mp-eyebrow { color: var(--g4mp-c-muted); margin-bottom: 12px; }
.g4mp-hero-split__title { font-size: 38px; line-height: 1.04; letter-spacing: -0.03em; }
.g4mp .g4mp-hero-split__body { font-size: 17px; line-height: 1.55; max-width: 460px; margin-top: 16px; white-space: pre-line; }
.g4mp-hero-split .g4mp-btns { margin-top: 26px; }

/* Story — image side; the 4:3 frame keeps the top of a portrait photo */
.g4mp-story__copy { min-width: 0; }
.g4mp-story__img { object-position: 50% 12%; }

/* Gallery (replaces team / materials): captions, one image = banner */
.g4mp-grid__cell { margin: 0; }
.g4mp-grid__cell .g4mp-img { width: 100%; height: 100%; }
.g4mp-grid__fig { margin: 0; min-width: 0; }
.g4mp-grid__cap { margin-top: 10px; font-size: 14px; font-weight: 600; line-height: 1.35; }
.g4mp-grid__subcap { display: block; font-size: 13px; font-weight: 400; color: var(--g4mp-c-muted); margin-top: 2px; }
.g4mp-grid__items--captions { row-gap: 28px; }
.g4mp-grid__items--1 { grid-template-columns: 1fr; }
.g4mp-grid__items--1 .g4mp-grid__cell { aspect-ratio: 16 / 9; }


/* Collections */
.g4mp-collections { background: var(--g4mp-c-surface); }
.g4mp-card__sub + .g4mp-card__sub { margin-top: 1px; }
/* Two lines (season + shipping): taller band, names aligned to its top. */
.g4mp-cards__grid--tall .g4mp-card__overlay { height: 104px; justify-content: flex-start; padding-top: 14px; }

/* Products — no prices */
.g4mp-products { background: var(--g4mp-c-bg); }
.g4mp-products__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 16px; }
.g4mp-product { display: block; text-decoration: none; color: inherit; min-width: 0; }
.g4mp-product__frame { display: block; aspect-ratio: 4 / 5; overflow: hidden; border-radius: var(--g4mp-c-radius); background: var(--g4mp-c-surface-2); }
/* The 4:5 frame of a 2:3 photo cuts more of the bottom than of the top. */
.g4mp-product__img { width: 100%; height: 100%; object-position: 50% 30%; transition: transform 0.45s ease; }
.g4mp-product:hover .g4mp-product__img { transform: scale(1.03); }
.g4mp-product:focus-visible { outline: 2px solid var(--g4mp-c-ink); outline-offset: 4px; border-radius: var(--g4mp-c-radius); }
.g4mp .g4mp-product__name { margin-top: 12px; font-size: 14px; font-weight: 600; line-height: 1.3; letter-spacing: -0.005em; }
.g4mp-product__cat { display: block; margin-top: 2px; font-size: 13px; line-height: 1.4; color: var(--g4mp-c-muted); }

/* Key facts */
.g4mp-facts { background: var(--g4mp-c-bg); }
.g4mp-facts__list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 16px; }
.g4mp-fact { border-top: 1px solid var(--g4mp-c-line); padding-top: 14px; min-width: 0; }
.g4mp-fact__value { display: block; font-size: 44px; line-height: 1; font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.g4mp-fact__label { display: block; margin-top: 8px; font-size: 14px; line-height: 1.4; color: var(--g4mp-c-muted); }

/* Features — numbered */
.g4mp-features { background: var(--g4mp-c-bg); }
.g4mp-features__list { display: grid; grid-template-columns: 1fr; gap: 28px; }
.g4mp-feature { min-width: 0; }
.g4mp-feature__img { width: 100%; aspect-ratio: 3 / 2; border-radius: var(--g4mp-c-radius); margin-bottom: 16px; }
.g4mp-feature__text { border-top: 1px solid var(--g4mp-c-line); padding-top: 16px; }
.g4mp-feature--media .g4mp-feature__text { border-top: 0; padding-top: 0; }
.g4mp-feature__no { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; color: var(--g4mp-c-muted); font-variant-numeric: tabular-nums; }
.g4mp .g4mp-feature__title { margin-top: 10px; font-size: 20px; line-height: 1.2; font-weight: 700; letter-spacing: -0.01em; }
.g4mp .g4mp-feature__body { margin-top: 8px; font-size: 15px; line-height: 1.6; white-space: pre-line; }

/* Quotes — one large quote or cards */
.g4mp-quotes { background: var(--g4mp-c-bg); }
.g4mp-quotes__grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.g4mp-quote { display: flex; flex-direction: column; gap: 24px; padding: 24px; border-radius: var(--g4mp-c-radius); background: var(--g4mp-c-surface); border: 1px solid var(--g4mp-c-line); min-width: 0; }
.g4mp-quote__text { font-size: 17px; line-height: 1.55; font-weight: 500; quotes: "\\201C" "\\201D"; }
.g4mp-quote__text::before { content: open-quote; }
.g4mp-quote__text::after { content: close-quote; }
.g4mp-quote__by { display: flex; align-items: center; gap: 12px; margin-top: auto; min-height: 44px; }
.g4mp-quote__avatar { width: 44px; height: 44px; border-radius: 50%; flex: none; }
.g4mp-quote__name { display: block; font-size: 14px; font-weight: 700; line-height: 1.3; }
.g4mp-quote__role { display: block; font-size: 13px; line-height: 1.4; color: var(--g4mp-c-muted); }
.g4mp .g4mp-quote--solo { max-width: 820px; margin: 0 auto; padding: 0; border: 0; background: none; align-items: center; text-align: center; gap: 28px; }
.g4mp-quote--solo .g4mp-quote__text { font-size: 24px; line-height: 1.25; font-weight: 600; letter-spacing: -0.02em; text-wrap: balance; }
.g4mp-quote--solo .g4mp-quote__by { flex-direction: column; gap: 10px; margin-top: 0; min-height: 0; }

/* Logos — one wrapping row, greyed */
.g4mp-logos { background: var(--g4mp-c-surface); }
.g4mp .g4mp-logos__title { margin-bottom: 28px; text-align: center; color: var(--g4mp-c-muted); }
.g4mp-logos__list { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 24px 36px; }
.g4mp-logo { height: 28px; width: auto; filter: grayscale(1); opacity: 0.6; }

/* FAQ — <details> with thin lines */
.g4mp-faq { background: var(--g4mp-c-surface); }
.g4mp-faq__inner { max-width: 760px; margin: 0 auto; }
.g4mp-faq__inner .g4mp-title { margin-bottom: 24px; }
.g4mp-faq__list { border-top: 1px solid var(--g4mp-c-line); }
.g4mp-faq__item { border-bottom: 1px solid var(--g4mp-c-line); }
.g4mp-faq__q { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 0; cursor: pointer; list-style: none; }
.g4mp-faq__q::-webkit-details-marker { display: none; }
.g4mp-faq__q:focus-visible { outline: 2px solid var(--g4mp-c-ink); outline-offset: 2px; }
.g4mp .g4mp-faq__qt { font-size: 17px; line-height: 1.35; font-weight: 600; letter-spacing: -0.005em; }
.g4mp-faq__sign { position: relative; flex: none; width: 14px; height: 14px; }
.g4mp-faq__sign::before, .g4mp-faq__sign::after { content: ""; position: absolute; background: var(--g4mp-c-ink); }
.g4mp-faq__sign::before { left: 0; right: 0; top: 6px; height: 2px; }
.g4mp-faq__sign::after { top: 0; bottom: 0; left: 6px; width: 2px; }
.g4mp-faq__item[open] .g4mp-faq__sign::after { display: none; }
.g4mp-faq__a { padding: 0 34px 20px 0; }

/* CTA — two buttons */
.g4mp .g4mp-cta__title { margin-bottom: 8px; }
.g4mp .g4mp-cta__sub { margin-bottom: 6px; }
.g4mp-cta__body { line-height: 1.5; }
.g4mp-cta__inner > div:first-child { min-width: 0; }
.g4mp-cta__inner > div:first-child > :last-child { margin-bottom: 0; }
.g4mp-cta .g4mp-btns { justify-content: center; flex: none; }

/* Contact */
.g4mp-contact { background: var(--g4mp-c-bg); }
.g4mp-contact__grid { display: flex; flex-direction: column; gap: 28px; }
.g4mp-contact__copy .g4mp-title { margin-bottom: 12px; }
.g4mp-contact__copy > :last-child { margin-bottom: 0; }
.g4mp-contact__list { display: grid; grid-template-columns: 1fr; gap: 20px; }
.g4mp-contact__item { border-top: 1px solid var(--g4mp-c-line); padding-top: 14px; min-width: 0; }
.g4mp-contact__label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--g4mp-c-muted); }
.g4mp-contact__value { display: block; margin-top: 8px; font-size: 16px; line-height: 1.5; white-space: pre-line; overflow-wrap: anywhere; }
a.g4mp-contact__value { color: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .g4mp-card__img, .g4mp-product__img, .g4mp-btn { transition: none; }
}

/* ── Desktop (catalog) ── */
@media (min-width: 768px) {
  .g4mp:not(.g4mp--mobile) .g4mp-section.g4mp-section--joined { padding-top: 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-head { margin-bottom: 40px; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero { min-height: var(--g4mp-hero-h, 70vh); }

  .g4mp:not(.g4mp--mobile) .g4mp-hero-split__grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 460px); gap: 72px; align-items: center; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero-split__media { order: 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero-split__title { font-size: 64px; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero-split__body { font-size: 18px; margin-top: 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-hero-split .g4mp-btns { margin-top: 32px; }

  .g4mp:not(.g4mp--mobile) .g4mp-story--left .g4mp-story__copy { order: 2; }
  .g4mp:not(.g4mp--mobile) .g4mp-story--left .g4mp-story__media { order: 1; }

  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--1 { grid-template-columns: 1fr; }
  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--1 .g4mp-grid__cell { aspect-ratio: 21 / 9; }
  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--2 { grid-template-columns: repeat(2, 1fr); }
  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--3 { grid-template-columns: repeat(3, 1fr); }

  .g4mp:not(.g4mp--mobile) .g4mp-grid__items--captions { row-gap: 36px; }
  /* 0.4.1 bug: the 24px video caption title lost to the general 48px title. */
  .g4mp:not(.g4mp--mobile) .g4mp-video__caption .g4mp-title { font-size: 28px; }
  .g4mp:not(.g4mp--mobile) .g4mp-video__caption { margin-top: 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-cards__grid--tall .g4mp-card__overlay { height: 116px; padding-top: 18px; }

  .g4mp:not(.g4mp--mobile) .g4mp-products__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-product__name { font-size: 15px; }

  .g4mp:not(.g4mp--mobile) .g4mp-facts__list { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 0; border-top: 1px solid var(--g4mp-c-line); border-bottom: 1px solid var(--g4mp-c-line); }
  .g4mp:not(.g4mp--mobile) .g4mp-fact { border-top: 0; padding: 32px 0 32px 32px; border-left: 1px solid var(--g4mp-c-line); }
  .g4mp:not(.g4mp--mobile) .g4mp-fact:first-child { border-left: 0; padding-left: 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-fact__value { font-size: 64px; }
  .g4mp:not(.g4mp--mobile) .g4mp-fact__label { font-size: 15px; margin-top: 10px; }

  .g4mp:not(.g4mp--mobile) .g4mp-features__list { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 48px 32px; }
  .g4mp:not(.g4mp--mobile) .g4mp-features__list--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .g4mp:not(.g4mp--mobile) .g4mp-feature__text { padding-top: 20px; }

  .g4mp:not(.g4mp--mobile) .g4mp-quotes__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
  .g4mp:not(.g4mp--mobile) .g4mp-quotes__grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .g4mp:not(.g4mp--mobile) .g4mp-quote { padding: 28px; }
  .g4mp:not(.g4mp--mobile) .g4mp-quote--solo { padding: 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-quote--solo .g4mp-quote__text { font-size: 34px; }

  .g4mp:not(.g4mp--mobile) .g4mp-logos__list { gap: 28px 56px; }
  .g4mp:not(.g4mp--mobile) .g4mp-logo { height: 32px; }

  .g4mp:not(.g4mp--mobile) .g4mp-faq__inner .g4mp-title { margin-bottom: 32px; }
  .g4mp:not(.g4mp--mobile) .g4mp-faq__q { padding: 22px 0; }
  .g4mp:not(.g4mp--mobile) .g4mp-faq__qt { font-size: 18px; }
  .g4mp:not(.g4mp--mobile) .g4mp-faq__a { padding: 0 80px 24px 0; }

  .g4mp:not(.g4mp--mobile) .g4mp-cta .g4mp-btns { justify-content: flex-end; }

  .g4mp:not(.g4mp--mobile) .g4mp-contact__grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 56px; align-items: start; }
  .g4mp:not(.g4mp--mobile) .g4mp-contact__list { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
}

/* Formatted text (concept §11): paragraphs, inline links. */
.g4mp .g4mp-rich > p + p { margin-top: 0.75em; }
.g4mp-rich { white-space: normal; }
.g4mp-link { color: inherit; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
.g4mp-link:hover { text-decoration-thickness: 2px; }
.g4mp-link:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
.g4mp-quote__text.g4mp-rich::before, .g4mp-quote__text.g4mp-rich::after { content: none; }
.g4mp-quote__text.g4mp-rich > p:first-child::before { content: open-quote; }
.g4mp-quote__text.g4mp-rich > p:last-child::after { content: close-quote; }
.g4mp-logos__link { display: inline-flex; align-items: center; gap: 4px; color: inherit; text-decoration: none; }

/* Editor: an empty section shows its name and the missing field. */
.g4mp-empty { background: var(--g4mp-c-surface); }
.g4mp-empty__box { max-width: 1120px; margin: 0 auto; padding: 28px 24px; border: 1.5px dashed var(--g4mp-c-line); border-radius: var(--g4mp-c-radius); text-align: center; color: var(--g4mp-c-muted); }
.g4mp .g4mp-empty__type { font-size: 15px; font-weight: 700; color: var(--g4mp-c-ink); }
.g4mp .g4mp-empty__field { margin-top: 4px; font-size: 13px; }
`;
