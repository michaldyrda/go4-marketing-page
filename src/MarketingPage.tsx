import { Fragment } from "react";
import { CONTRACT_VERSION, FILE_ATTR, sectionFileAttrs } from "./contract";
import type { MouseEvent, ReactNode } from "react";
import { mergeLabels } from "./labels";
import type { MarketingLabelsInput } from "./labels";
import { planPage } from "./model";
import { PageContext, SectionContext, cx } from "./render";
import type { PageHost } from "./render";
import { Empty, FILE_DATA_TYPES, FileData, SECTION_COMPONENTS } from "./sections";
import { MARKETING_CSS } from "./styles";
import type { LandingLink, MarketingCta, MarketingSection, ResolveHref, TransformImageUrl } from "./types";

export interface MarketingPageProps {
  /** Stored sections, legacy or new shape — normalized, filtered to visible and sorted here. */
  sections: MarketingSection[];
  /**
   * Turns a link target into an href for this host (e.g. the portal prefixes
   * the boutique path). When given, buttons and tiles are `<a href>`; a target
   * that is unavailable or resolves to null is drawn without a link.
   */
  resolveHref?: ResolveHref;
  /** Optional click hook on rendered links (client-side routing in an SPA host). */
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, link: LandingLink) => void;
  /** Legacy: without `resolveHref`, CTAs are `<button>`s and the host navigates here. */
  onCtaClick?: (cta: MarketingCta) => void;
  /** Render mobile crops + mobile layout regardless of viewport (editor preview). */
  forceMobile?: boolean;
  /** Optional CDN/Storage resizer. Defaults to identity. */
  transformImageUrl?: TransformImageUrl;
  /**
   * Inject the stylesheet as an inline `<style>` (default). Hosts with a strict
   * Content-Security-Policy set `false` and load `@go4/marketing-page/styles.css`
   * as a file instead (or allow `MARKETING_CSS_SHA256`).
   */
  injectStyles?: boolean;
  /** Texts the package shows (shipping line, styles count, contact labels, empty states). */
  labels?: MarketingLabelsInput;
  /**
   * Editor preview: every section carries `data-section-id`, an empty section
   * shows its name and the missing field instead of disappearing.
   */
  editorMode?: boolean;
  /** Editor: click on a section. */
  onSectionClick?: (id: string) => void;
  /**
   * Editor: slot between sections ("+"). Called with 0…n — the position among the
   * visible sections in display order (0 = before the first, n = after the last).
   */
  renderInsertSlot?: (index: number) => ReactNode;
  className?: string;
  /**
   * Page file — use `renderPageFile`. Every section (hidden ones with `hidden`)
   * carries the contract attributes; sections from go4 data carry only their
   * title, text and options.
   */
  fileMode?: boolean;
}

/**
 * Full landing page — all visible sections in order. Zero dependency on any
 * host design system, so the admin preview, the B2B portal and the public brand
 * page render the same content. No `window` access: safe for server rendering.
 */
export function MarketingPage({
  sections,
  resolveHref,
  onLinkClick,
  onCtaClick,
  forceMobile = false,
  transformImageUrl,
  injectStyles = true,
  labels,
  editorMode = false,
  onSectionClick,
  renderInsertSlot,
  className,
  fileMode = false,
}: MarketingPageProps) {
  if (fileMode) editorMode = false;
  const plan = planPage(sections, resolveHref, fileMode);
  const host: PageHost = {
    resolveHref,
    onLinkClick,
    onCtaClick,
    forceMobile,
    transform: transformImageUrl ? { fn: transformImageUrl, resizes: true } : { fn: (url) => url, resizes: false },
    labels: mergeLabels(labels),
    editorMode,
    onSectionClick,
    fileMode,
  };
  const Root = fileMode ? "main" : "div";
  const rootAttrs = fileMode ? { [FILE_ATTR.page]: "", [FILE_ATTR.format]: String(CONTRACT_VERSION) } : {};

  return (
    <PageContext.Provider value={host}>
      <Root className={cx("g4mp", forceMobile && "g4mp--mobile", className)} {...rootAttrs}>
        {/* Raw text: React escapes <style> children on the server ("…" → &quot;),
            which breaks the CSS. The string is the package's own constant, never content. */}
        {injectStyles && <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS }} />}
        {plan.map((p, i) => {
          const Component = fileMode && FILE_DATA_TYPES.has(p.section.type) ? FileData : SECTION_COMPONENTS[p.section.type];
          // File mode draws every section, also an empty or hidden one: the file is the whole page.
          const body =
            p.drawn || fileMode ? <Component section={p.section} /> : editorMode ? <Empty section={p.section} /> : null;
          const hidden = !p.section.is_visible;
          return (
            <Fragment key={`${i}:${p.section.id}`}>
              {renderInsertSlot?.(i)}
              <SectionContext.Provider
                value={{
                  id: p.section.id,
                  type: p.section.type,
                  h1: p.h1,
                  first: p.first,
                  joined: p.joined,
                  ...(fileMode ? { fileAttrs: sectionFileAttrs(p.section, hidden), hidden } : {}),
                }}
              >
                {body}
              </SectionContext.Provider>
            </Fragment>
          );
        })}
        {renderInsertSlot?.(plan.length)}
      </Root>
    </PageContext.Provider>
  );
}
