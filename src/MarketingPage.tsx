import { Fragment } from "react";
import type { MouseEvent, ReactNode } from "react";
import { mergeLabels } from "./labels";
import type { MarketingLabelsInput } from "./labels";
import { planPage } from "./model";
import { PageContext, SectionContext, cx } from "./render";
import type { PageHost } from "./render";
import { Empty, SECTION_COMPONENTS } from "./sections";
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
}: MarketingPageProps) {
  const plan = planPage(sections, resolveHref);
  const host: PageHost = {
    resolveHref,
    onLinkClick,
    onCtaClick,
    forceMobile,
    transform: transformImageUrl ? { fn: transformImageUrl, resizes: true } : { fn: (url) => url, resizes: false },
    labels: mergeLabels(labels),
    editorMode,
    onSectionClick,
  };

  return (
    <PageContext.Provider value={host}>
      <div className={cx("g4mp", forceMobile && "g4mp--mobile", className)}>
        {/* Raw text: React escapes <style> children on the server ("…" → &quot;),
            which breaks the CSS. The string is the package's own constant, never content. */}
        {injectStyles && <style dangerouslySetInnerHTML={{ __html: MARKETING_CSS }} />}
        {plan.map((p, i) => {
          const Component = SECTION_COMPONENTS[p.section.type];
          const body = p.drawn ? <Component section={p.section} /> : editorMode ? <Empty section={p.section} /> : null;
          return (
            <Fragment key={`${i}:${p.section.id}`}>
              {renderInsertSlot?.(i)}
              <SectionContext.Provider
                value={{ id: p.section.id, type: p.section.type, h1: p.h1, first: p.first, joined: p.joined }}
              >
                {body}
              </SectionContext.Provider>
            </Fragment>
          );
        })}
        {renderInsertSlot?.(plan.length)}
      </div>
    </PageContext.Provider>
  );
}
