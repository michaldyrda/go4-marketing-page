/**
 * Self-contained styles for the marketing page. Scoped under `.g4mp`, prefixed
 * `g4mp-`, no design tokens from any host — the page carries its own neutral,
 * light brand identity so it looks identical in the admin preview and the portal.
 *
 * Responsive strategy: mobile-first base rules; desktop overrides live inside a
 * `min-width` media query AND are gated on `.g4mp:not(.g4mp--mobile)`. So the
 * editor's mobile preview (which only shrinks a 375px frame, invisible to media
 * queries) forces the mobile layout by adding `g4mp--mobile`.
 */
export const MARKETING_CSS = `
.g4mp {
  --g4mp-bg: #fafafa;
  --g4mp-surface: #ffffff;
  --g4mp-surface-2: #f4f4f4;
  --g4mp-ink: #0a0a0a;
  --g4mp-muted: #737373;
  --g4mp-ondark: #ffffff;
  width: 100%;
  background: var(--g4mp-bg);
  color: var(--g4mp-ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.g4mp *, .g4mp *::before, .g4mp *::after { box-sizing: border-box; }
.g4mp img, .g4mp video { display: block; max-width: 100%; }
.g4mp h1, .g4mp h2, .g4mp h3, .g4mp p { margin: 0; }

.g4mp-section { padding: 48px 24px; }
.g4mp-inner { max-width: 1120px; margin: 0 auto; }
.g4mp-eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 500; }
.g4mp-title { font-size: 30px; line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; }
.g4mp-subtitle { font-size: 17px; color: var(--g4mp-muted); }
.g4mp-body { font-size: 15px; line-height: 1.6; color: var(--g4mp-muted); white-space: pre-line; }

/* Button */
.g4mp-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px; border-radius: 8px; border: 0; cursor: pointer;
  font-family: inherit; font-size: 14px; font-weight: 600; line-height: 1;
  background: var(--g4mp-ondark); color: var(--g4mp-ink);
  transition: opacity 0.15s ease;
}
.g4mp-btn:hover { opacity: 0.88; }
.g4mp-btn:focus-visible { outline: 2px solid var(--g4mp-ink); outline-offset: 2px; }
.g4mp-btn--primary { background: var(--g4mp-ink); color: var(--g4mp-ondark); }

/* Hero */
.g4mp-hero { position: relative; display: flex; align-items: flex-end; min-height: 56vh; overflow: hidden; }
.g4mp-hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.g4mp-hero__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
.g4mp-hero__scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.15) 55%, transparent); }
.g4mp-hero__inner { position: relative; z-index: 1; width: 100%; padding: 24px; }
.g4mp-hero__box { max-width: 760px; }
.g4mp-hero .g4mp-eyebrow { color: rgba(255,255,255,0.8); margin-bottom: 8px; }
.g4mp-hero .g4mp-title { color: var(--g4mp-ondark); margin-bottom: 14px; }
.g4mp-hero__body { color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1.55; max-width: 640px; margin-bottom: 22px; white-space: pre-line; }

/* Story (text + image) */
.g4mp-story { background: var(--g4mp-surface); }
.g4mp-story__grid { display: flex; flex-direction: column; gap: 28px; }
.g4mp-story__copy .g4mp-title { margin-bottom: 12px; }
.g4mp-story__copy .g4mp-subtitle { margin-bottom: 12px; }
.g4mp-story__img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 12px; }

/* Grid (team / materials) */
.g4mp-grid { background: var(--g4mp-surface-2); }
.g4mp-grid__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-grid__head .g4mp-title { margin-bottom: 12px; }
.g4mp-grid__items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.g4mp-grid__cell { aspect-ratio: 1 / 1; overflow: hidden; border-radius: 12px; }
.g4mp-grid__cell img { width: 100%; height: 100%; object-fit: cover; }

/* Text block */
.g4mp-text { background: var(--g4mp-surface); }
.g4mp-text__inner { max-width: 720px; margin: 0 auto; text-align: center; }
.g4mp-text__inner .g4mp-title { margin-bottom: 12px; }
.g4mp-text__inner .g4mp-subtitle { margin-bottom: 12px; }

/* Video */
.g4mp-video { background: var(--g4mp-surface); }
.g4mp-video__inner { max-width: 960px; margin: 0 auto; }
.g4mp-video__frame { width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: 12px; overflow: hidden; }
.g4mp-video__frame video { width: 100%; height: 100%; object-fit: contain; }
.g4mp-video__caption { margin-top: 16px; text-align: center; }
.g4mp-video__caption .g4mp-title { font-size: 24px; margin-bottom: 6px; }

/* CTA bar */
.g4mp-cta { background: var(--g4mp-ink); color: var(--g4mp-ondark); }
.g4mp-cta__inner { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.g4mp-cta__title { font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
.g4mp-cta__body { color: rgba(255,255,255,0.85); white-space: pre-line; }

/* Cards — the whole tile is the click target (image + overlaid title), no button. */
.g4mp-cards { background: var(--g4mp-surface); }
.g4mp-cards__head { max-width: 620px; margin: 0 auto 32px; text-align: center; }
.g4mp-cards__head .g4mp-title { margin-bottom: 12px; }
.g4mp-cards__grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.g4mp-card { position: relative; display: block; width: 100%; aspect-ratio: 4 / 5; overflow: hidden; border-radius: 12px; background: var(--g4mp-ink); }
button.g4mp-card { appearance: none; -webkit-appearance: none; border: 0; padding: 0; margin: 0; font: inherit; text-align: left; color: inherit; cursor: pointer; }
.g4mp-card__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; }
.g4mp-card__fallback { position: absolute; inset: 0; background: linear-gradient(160deg, #2a2e36, #0a0a0a); }
button.g4mp-card:hover .g4mp-card__img { transform: scale(1.04); }
button.g4mp-card:focus-visible { outline: 2px solid var(--g4mp-ink); outline-offset: 2px; }
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
`;
