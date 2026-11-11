# @go4/marketing-page

Self-contained renderer for go4 **landing pages** — the 15-component catalog
(Hero cover / split, Text, Image and text, Gallery, Video, Cards, Collections,
Products, Key facts, Features, Quotes, Logos, FAQ, Call to action, Contact).
One source of truth shared by the admin app (editor preview), the B2B portal and
the public brand page (`go4-comunication`), so a section type is added **once**
and every surface gets it.

## Why it's "thin"

- **Zero design-system dependency.** No Tailwind, no host tokens. It ships its own
  small scoped stylesheet (`.g4mp-*`) with a neutral, light look. A host may set a
  few CSS variables (below); without them the page looks the same everywhere.
- **Framework-agnostic React ≥ 18.** One ESM file, no runtime dependency, no
  `window` access — renders on the server (Next 15/16, React 19 checked) and in Vite.
- **No app coupling.** Image resizing is an injected prop, not an import.

## Usage

```tsx
import { MarketingPage } from "@go4/marketing-page";

<MarketingPage
  sections={sections}                 // stored sections, legacy or new shape (normalized, filtered, sorted inside)
  resolveHref={(link) => hrefFor(link)}   // { kind, id?, url?, path?, available? } → href | null
  transformImageUrl={(url, w) => `${url}?width=${w}`}   // optional resizer; adds srcset when given
  forceMobile={false}                 // editor "mobile" preview (forces mobile crop + layout)
/>
```

### Section shape — `normalizeSection(raw)`

Every stored section goes through `normalizeSection` — the one reader of both
shapes; components draw only its output. Exported, so the same function rewrites
stored data when the old shape is retired.

| Legacy 0.4.x | New shape |
|---|---|
| `hero` `subtitle` | `eyebrow` |
| `media[]` with `role` (`hero_image` / `background`, else first image) | `media` object: `file_url`, `mobile_file_url`, `alt`, `width`, `height`, `media_id`, `source_media_id`, `mobile_media_id` (ids = UUID), `media_type`, `poster_url` |
| `cta` (hero and cta only — 0.4.x drew no other) | `buttons[]`: `{ label, link }` |
| `team`, `materials` | `gallery` with `items[]` of `{ media, caption?, subcaption? }` |
| cards item `file_url…` + `cta` | `{ title, body, media, link }` |
| — | `variant` (`cover` / `split`), `image_side` (`left` / `right`), `mode` |

Unknown types return `null`; unknown keys, variants and modes are dropped; ids
must be UUIDs; URLs pass `safeHref` / `safeImgSrc`. Data is validated on every
render, because content can reach the database without the editor.

### Data from go4 — `section.resolved`

Collections, Products and Contact draw only what the host resolved; the package
fetches nothing and draws no prices.

```ts
resolved: {
  collections?: { id, name?, season?, styles?, shipping?, cover?: LandingMedia, link? }[];
  products?: { id, name?, category?, image?: LandingMedia, link? }[];
  contact?: { address?, email?, website?, instagram? };
}
```

A field the host leaves out is not drawn — for a guest the public host sends no
`shipping` (no wholesale information in public). `link` lets the server pass
`path` / `available`; default is `{ kind: "collection" | "product", id }`.

### Formatted text

"Text" fields (Hero, Text, Image and text, Gallery, Cards section, Features item,
Quotes, FAQ answer, Call to action, Contact) hold plain text or paragraphs of
fragments `{ text, bold?, italic?, underline?, link? }`. They are drawn as
`<p>`, `<strong>`, `<em>`, `<u>`, `<a href>`, `<br>` elements — never parsed as HTML.
A link whose target is unavailable leaves the text only.

`richTextFromHtml(html)` / `richTextToHtml(value)` convert between the editor's
(or the page file's) HTML and the stored value. Pure, no DOM (Node, Deno). Allow
list `p, br, b, strong, i, em, u, a`; other tags leave their text, `script`,
`style` and similar disappear with their content. Internal targets are
`<a data-go4-link-kind data-go4-link-id>`, external ones `<a href>` (https,
mailto, tel only).

### Drawing rules

- A section with nothing to draw and a button without a drawable link are not drawn.
- A section without a heading joins the previous drawn section with the same
  background (`g4mp-section--joined`, no top padding).
- Variants, modes and types come from closed lists (map → class); content never
  becomes a class or an attribute name.

### Editor

`editorMode` puts `data-section-id` on every section and draws an empty section
as its component name + the missing field. `onSectionClick(id)`;
`renderInsertSlot(index)` draws what the host returns between sections
(0 = before the first, n = after the last visible section).

### Texts — `DEFAULT_LABELS`

Every text the package shows (component and field names for empty states,
`Shipping: from {date}`, `{n} styles`, Contact labels) is in `DEFAULT_LABELS`; a
host passes `labels` (any part) to replace them.

### Catalog, text version, structured data

- `SECTION_CATALOG` — type, palette group, fields with character limits, variants,
  crops desktop / mobile, item min / max (`TEXT_LIMITS`, `CATALOG_VERSION`).
- `sectionsToMarkdown(sections, { resolveHref })` — text version of the page.
- `buildStructuredData(sections, { resolveHref })` — schema.org `FAQPage` and
  `ItemList` objects; embed with `jsonLdScriptContent(data)` (escapes `<`, `>`, `&`).

### Host variables

Set on `.g4mp` or any ancestor; defaults = 0.4.1 values.

| Variable | Default | Used for |
|---|---|---|
| `--g4mp-font-body` | system UI stack | all text |
| `--g4mp-font-heading` | `--g4mp-font-body` | `h1`–`h3`, fact values |
| `--g4mp-radius` | `12px` media, `8px` buttons | every rounded corner (one value for both when set) |
| `--g4mp-bg` | `#fafafa` | page and light sections |
| `--g4mp-ink` | `#0a0a0a` | text, dark band, primary button |
| `--g4mp-surface` | `#ffffff` | white sections, quote cards |
| `--g4mp-surface-2` | `#f4f4f4` | gallery |
| `--g4mp-muted` | `#737373` | secondary text |
| `--g4mp-ondark` | `#ffffff` | text on images and the dark band |
| `--g4mp-line` | `#e5e5e5` | thin lines |
| `--g4mp-hero-h` | `56vh` / `70vh` | hero cover height (editor frame) |

### Links

With `resolveHref`, every button and tile is an `<a href>`. A link with
`available: false`, a `null` result or an unsafe href (checked by `safeHref`:
http(s) without credentials, same-origin path, strict `mailto:` / `tel:`) is drawn
**without** a link — the button disappears, a tile stays as a plain tile. Never a
dead link. External links get `rel="noopener noreferrer nofollow"`, open in a new
tab and carry an exit mark (`.g4mp-ext`). `onLinkClick(event, link)` lets an SPA
host route on the client.

Legacy hosts that pass only `onCtaClick` keep `<button>`s (0.4.1 behaviour).
Legacy CTAs (`type` + `url` / `collection_id`) map to links via `ctaLink`:
`order_form` and `…order?collection=all` → `catalog`, `collection` → `collection`,
other URLs → `external`.

### Headings, images, video

- The first title drawn on the page is the only `<h1>`; other section titles are
  `<h2>`, tile titles `<h3>` (position decides, not type).
- `alt` = the brand's alt text, else the section title, else empty (decorative).
- `width` / `height` from content; `loading="lazy"` outside the first section.
- Video: `poster` + `preload="none"` when a poster exists, else `preload="metadata"`.

### Styles and Content-Security-Policy

By default the stylesheet is injected inline. For a strict CSP, either allow
`MARKETING_CSS_SHA256` in `style-src`, or render with `injectStyles={false}` and
load the file `@go4/marketing-page/styles.css`. `npm run build` regenerates both;
`npm test` fails if the hash is stale.

### Props

| Prop | Type | Notes |
|------|------|-------|
| `sections` | `MarketingSection[]` | Legacy or new shape; normalized, filtered to visible, sorted by `order_index`. |
| `resolveHref` | `(link) => string \| null` | Turns a link target into an href for this host. |
| `onLinkClick` | `(event, link) => void` | Optional client-side routing hook on rendered links. |
| `onCtaClick` | `(cta) => void` | Legacy, only without `resolveHref`: CTAs are `<button>`s. |
| `transformImageUrl` | `(url, width) => string` | Optional. Defaults to identity. |
| `forceMobile` | `boolean` | Editor mobile preview only. |
| `injectStyles` | `boolean` | Default `true`; `false` for hosts loading `styles.css`. |
| `labels` | partial `DEFAULT_LABELS` | Texts the package shows. |
| `editorMode` | `boolean` | Empty states + `data-section-id`. |
| `onSectionClick` | `(id) => void` | Editor. |
| `renderInsertSlot` | `(index) => ReactNode` | Editor "+" between sections. |
| `className` | `string` | Extra class on the root. |

## Security

- Content is always escaped React children. The only `dangerouslySetInnerHTML` is
  the package's own constant stylesheet (React escapes `<style>` text on the
  server, which would break the CSS and its hash).
- Image/video `src` is filtered by `safeImgSrc` (http/https without credentials,
  same-origin path, base64 raster `data:image` only).
- Every href goes through `safeHref`, whatever the host returns.
- Section type and variants come from closed lists — content never becomes a class
  or attribute name. Section ids reach the DOM only in `editorMode`, in a plain form.
- Tests feed a corpus of hostile content straight into every field of every type
  (`src/security.test.tsx`): no `script` / `iframe` / `object` / `style` beyond the
  package stylesheet, no `on*` attribute, no `javascript:`, classes only `g4mp-*`.

## Mobile crops

Each image may carry a `mobile_file_url` (a different crop). On the real portal the
swap is viewport-driven (`<picture>` + `max-width: 640px`). In the editor's mobile
preview, `forceMobile` renders the mobile crop directly (media queries can't see the
375px frame).

## Consuming from the B2B portal (separate repo)

The renderer's logic + styles live here; the portal should **import** this package
instead of re-implementing sections. Distribution options (pick one — infra decision):

1. **Private npm package** (recommended if you already have a registry): publish, then
   `npm i @go4/marketing-page` in both repos. Vercel installs it like any dep.
2. **Git dependency**: `"@go4/marketing-page": "github:<org>/<repo>#<ref>"` — no registry,
   but the package must sit at a repo root (or use a git-subdir tool).
3. **Git submodule**: include this folder as a submodule in the portal; Vercel supports it.

The package ships a prebuilt ESM bundle (`dist/index.js`, React as the only
peer) plus its TypeScript source; no `transpilePackages` needed.

> Shared-surface note: adding a section type or config field here changes the contract
> both apps rely on. Log it in the media↔portal bridge before shipping.
