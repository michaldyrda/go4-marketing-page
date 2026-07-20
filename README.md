# @go4/marketing-page

Self-contained renderer for the collection **marketing page** (hero, story, team,
materials, text, video, CTA, **cards**). One source of truth shared by the admin
app (editor preview + in-app B2B) and the separate B2B portal, so a new section
type is added **once** and both surfaces get it.

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
  onCtaClick={(cta) => { /* order_form → go to catalogue; external_link → open cta.url */ }}
  transformImageUrl={(url, w) => `${url}?width=${w}`}   // optional CDN/Storage resizer; defaults to identity
  forceMobile={false}                 // set true for an editor "mobile" preview (forces mobile crop + layout)
/>
```

### Props

| Prop | Type | Notes |
|------|------|-------|
| `sections` | `MarketingSection[]` | Filtered to visible + sorted by `order_index` internally. |
| `onCtaClick` | `(cta) => void` | Host decides navigation. **Sanitize `cta.url` with `safeHref` before `window.open`.** |
| `transformImageUrl` | `(url, width) => string` | Optional. Defaults to identity. |
| `forceMobile` | `boolean` | Editor mobile preview only. |
| `className` | `string` | Extra class on the root. |

## Security

- No `dangerouslySetInnerHTML` anywhere — all text is escaped React children.
- Image/video `src` is filtered by `safeImgSrc` (http/https/same-origin/`data:image` only).
- `safeHref` (exported) filters CTA links to http/https/same-origin before `window.open`.

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
