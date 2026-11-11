# @go4/marketing-page

Self-contained renderer for go4 **landing pages** (hero, story, team, materials,
text, video, CTA, cards). One source of truth shared by the admin app (editor
preview), the B2B portal and the public brand page, so a section type is added
**once** and every surface gets it.

## Why it's "thin"

- **Zero design-system dependency.** No Tailwind, no host tokens. It ships its own
  small scoped stylesheet (`.g4mp-*`, injected inline) with a neutral, light brand
  identity — so the page looks **identical** in the admin preview and the portal.
- **Framework-agnostic React.** Plain `<img>` / `<picture>` / `<video>` / `<button>`.
  Works in Vite (admin) and Next.js (portal).
- **No app coupling.** Image resizing is an injected prop, not an import.

## Usage

```tsx
import { MarketingPage } from "@go4/marketing-page";

<MarketingPage
  sections={sections}                 // MarketingSection[] (visible-only is fine; it filters + sorts anyway)
  resolveHref={(link) => hrefFor(link)}   // { kind, id?, url?, path?, available? } → href | null
  transformImageUrl={(url, w) => `${url}?width=${w}`}   // optional resizer; adds srcset when given
  forceMobile={false}                 // set true for an editor "mobile" preview (forces mobile crop + layout)
/>
```

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
| `sections` | `MarketingSection[]` | Filtered to visible + sorted by `order_index` internally. |
| `resolveHref` | `(link) => string \| null` | Turns a link target into an href for this host. |
| `onLinkClick` | `(event, link) => void` | Optional client-side routing hook on rendered links. |
| `onCtaClick` | `(cta) => void` | Legacy, only without `resolveHref`: CTAs are `<button>`s. |
| `transformImageUrl` | `(url, width) => string` | Optional. Defaults to identity. |
| `forceMobile` | `boolean` | Editor mobile preview only. |
| `injectStyles` | `boolean` | Default `true`; `false` for hosts loading `styles.css`. |
| `className` | `string` | Extra class on the root. |

## Security

- Content is always escaped React children. The only `dangerouslySetInnerHTML` is
  the package's own constant stylesheet (React escapes `<style>` text on the
  server, which would break the CSS and its hash).
- Image/video `src` is filtered by `safeImgSrc` (http/https/same-origin/`data:image` raster only).
- Every href goes through `safeHref`, whatever the host returns.
- Section type and variants come from closed lists — content never becomes a class
  or attribute name.

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

Because this package ships **TypeScript source** (not a prebuilt bundle), a Next.js
consumer must transpile it:

```js
// next.config.js
transpilePackages: ["@go4/marketing-page"],
```

The portal then swaps its bespoke `src/ds/marketing-page.tsx` for:

```tsx
import { MarketingPage } from "@go4/marketing-page";
// pass its own transformImageUrl + onCtaClick (goToOrder)
```

> Shared-surface note: adding a section type or config field here changes the contract
> both apps rely on. Log it in the media↔portal bridge before shipping.
