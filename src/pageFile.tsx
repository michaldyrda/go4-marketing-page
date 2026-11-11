/**
 * `renderPageFile(sections)` — the page as a file for Download / Copy HTML
 * (concept §12.1, §12.7). The file is the package's own drawing
 * (`renderToStaticMarkup`) in file mode, never strings glued together, with the
 * package stylesheet and a fixed instruction for the AI generated from the
 * catalog (no brand name, no page content).
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { pageFileInstructions } from "./contract";
import type { MarketingLabelsInput } from "./labels";
import { MarketingPage } from "./MarketingPage";
import { safeHref } from "./sanitizeUrl";
import { MARKETING_CSS } from "./styles";
import type { LandingLink, ResolveHref, TransformImageUrl } from "./types";

export interface PageFileOptions {
  /**
   * Href of a link target, so the file can be clicked. Optional: without it (or
   * when it gives nothing) an external target links to its address and any
   * other target to "/". Import never reads the href of a registry target.
   */
  resolveHref?: ResolveHref;
  /** Optional image resizer (same as the page). */
  transformImageUrl?: TransformImageUrl;
  labels?: MarketingLabelsInput;
  /** Language of the document (BCP 47, e.g. "en"). */
  lang?: string;
}

const LANG = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
/** Link state a server adds for one context — the file records the target, not its availability. */
const LINK_STATE = new Set(["available", "path", "reason"]);

/** JSON copy of stored sections without link state (every target is written to the file). */
function withoutLinkState(sections: readonly unknown[]): unknown[] {
  try {
    const out = JSON.parse(JSON.stringify(Array.isArray(sections) ? sections : []), function (this: unknown, key, value) {
      const holder = this as Record<string, unknown> | null;
      if (LINK_STATE.has(key) && holder && typeof holder === "object" && typeof holder.kind === "string") return undefined;
      return value;
    });
    return Array.isArray(out) ? out : [];
  } catch {
    return [];
  }
}

/** Stored sections (draft or published, legacy or new shape) → the page file (HTML document). */
export function renderPageFile(sections: readonly unknown[], opts: PageFileOptions = {}): string {
  const host = opts.resolveHref;
  const resolveHref = (link: LandingLink) =>
    safeHref(host?.(link) ?? undefined) ?? (link.kind === "external" ? link.url ?? null : "/");
  const markup = renderToStaticMarkup(
    createElement(MarketingPage, {
      sections: withoutLinkState(sections) as never,
      resolveHref,
      transformImageUrl: opts.transformImageUrl,
      labels: opts.labels,
      injectStyles: false,
      fileMode: true,
    }),
  );
  const lang = opts.lang && LANG.test(opts.lang) ? opts.lang : "en";
  return [
    `<!--\n${pageFileInstructions()}\n-->`,
    "<!doctype html>",
    `<html lang="${lang}">`,
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>Landing page</title>",
    // The package's own constant, never content.
    `<style>${MARKETING_CSS}</style>`,
    "</head>",
    "<body>",
    markup,
    "</body>",
    "</html>",
    "",
  ].join("\n");
}
