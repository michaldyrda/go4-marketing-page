/** Drawing primitives shared by the section components. */
import { Fragment, createContext, useContext } from "react";
import type { MouseEvent, ReactNode } from "react";
import { DEFAULT_LABELS } from "./labels";
import type { MarketingLabels } from "./labels";
import { legacyCta } from "./links";
import { drawnButtons, legacyCtaOf, resolveTarget } from "./model";
import type { ResolvedTarget } from "./model";
import { richParagraphs } from "./richText";
import { safeDimension, safeImgSrc } from "./sanitizeUrl";
import type {
  LandingButton,
  LandingLink,
  LandingMedia,
  LandingSectionType,
  MarketingCta,
  ResolveHref,
  RichText,
  TransformImageUrl,
} from "./types";

/* ── page-wide context ─────────────────────────────────────────────────────── */

export interface PageHost {
  resolveHref?: ResolveHref;
  onCtaClick?: (cta: MarketingCta) => void;
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, link: LandingLink) => void;
  forceMobile: boolean;
  transform: { fn: TransformImageUrl; resizes: boolean };
  labels: MarketingLabels;
  editorMode: boolean;
  onSectionClick?: (id: string) => void;
}

export const PageContext = createContext<PageHost>({
  forceMobile: false,
  transform: { fn: (url) => url, resizes: false },
  labels: DEFAULT_LABELS,
  editorMode: false,
});
export const usePage = () => useContext(PageContext);

/* ── per-section context ───────────────────────────────────────────────────── */

export interface SectionCtx {
  id: string;
  type: LandingSectionType;
  h1: boolean;
  first: boolean;
  joined: boolean;
}
export const SectionContext = createContext<SectionCtx>({
  id: "",
  type: "text_block",
  h1: false,
  first: false,
  joined: false,
});

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Section ids reach the DOM only in the editor, and only in a plain form. */
const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;

/**
 * The `<section>` of every component: adjacency class, and in the editor the
 * `data-section-id` + click hook.
 */
export function Frame({ className, children }: { className: string; children: ReactNode }) {
  const page = usePage();
  const s = useContext(SectionContext);
  const id = page.editorMode && SAFE_ID.test(s.id) ? s.id : undefined;
  return (
    <section
      className={cx(className, s.joined && "g4mp-section--joined")}
      data-section-id={id}
      onClick={id && page.onSectionClick ? () => page.onSectionClick?.(id) : undefined}
    >
      {children}
    </section>
  );
}

/** Section title at the level that follows from its position (h1 once per page, else h2). */
export function Title({ className, children }: { className: string; children: ReactNode }) {
  const { h1 } = useContext(SectionContext);
  return h1 ? <h1 className={className}>{children}</h1> : <h2 className={className}>{children}</h2>;
}

/* ── images ────────────────────────────────────────────────────────────────── */

export interface Slot {
  /** Intended CSS width handed to the resizer. */
  width: number;
  /** Widths offered in srcset (only with a resizer). */
  srcset: number[];
  /** `sizes` attribute (only with a resizer). */
  sizes: string;
}

export const SLOTS = {
  HERO: { width: 960, srcset: [640, 960, 1440, 1920, 2560], sizes: "100vw" },
  WIDE: { width: 1120, srcset: [640, 1120, 1600, 2240], sizes: "(min-width: 768px) 1120px, 100vw" },
  SPLIT: { width: 460, srcset: [460, 690, 920], sizes: "(min-width: 768px) 460px, 100vw" },
  STORY: { width: 600, srcset: [400, 600, 900, 1200], sizes: "(min-width: 768px) 50vw, 100vw" },
  GRID: { width: 400, srcset: [300, 400, 600, 800], sizes: "(min-width: 768px) 25vw, 50vw" },
  FEATURE: { width: 360, srcset: [360, 540, 720], sizes: "(min-width: 768px) 33vw, 100vw" },
  LOGO: { width: 120, srcset: [120, 240], sizes: "120px" },
  AVATAR: { width: 44, srcset: [44, 88, 132], sizes: "44px" },
} satisfies Record<string, Slot>;

/** <img> that swaps to a mobile crop: forced in preview, else viewport-driven. */
export function Img({
  media,
  slot,
  alt,
  className,
}: {
  media?: LandingMedia;
  slot: Slot;
  alt: string;
  className?: string;
}) {
  const { forceMobile, transform } = usePage();
  const { first } = useContext(SectionContext);
  const desktop = safeImgSrc(media?.file_url);
  const mobile = safeImgSrc(media?.mobile_file_url);
  const base = desktop || mobile;
  if (!base) return null;

  const src = (u: string) => transform.fn(u, slot.width);
  const srcSet = (u: string) =>
    transform.resizes ? slot.srcset.map((w) => `${transform.fn(u, w)} ${w}w`).join(", ") : undefined;
  const props = {
    alt,
    className,
    width: safeDimension(media?.width),
    height: safeDimension(media?.height),
    loading: first ? undefined : ("lazy" as const),
    decoding: "async" as const,
    sizes: transform.resizes ? slot.sizes : undefined,
  };
  // Mobile preview: media queries can't see the frame, so force the crop.
  if (forceMobile) {
    const u = mobile || base;
    return <img src={src(u)} srcSet={srcSet(u)} {...props} />;
  }
  return (
    <picture>
      {mobile && <source media="(max-width: 640px)" srcSet={srcSet(mobile) ?? src(mobile)} sizes={props.sizes} />}
      <img src={src(base)} srcSet={srcSet(base)} {...props} />
    </picture>
  );
}

/** Alt text: the brand's own, else the given fallback, else decorative. */
export const altOf = (m: { alt?: string } | undefined, fallback?: string) => (m?.alt ?? fallback ?? "").trim();

/* ── links ─────────────────────────────────────────────────────────────────── */

export const ExitMark = () => (
  <span className="g4mp-ext" aria-hidden="true">
    ↗
  </span>
);

/** Props of an `<a>` for a resolved target (rel/target for external links). */
export function useAnchorProps() {
  const { onLinkClick } = usePage();
  return (target: ResolvedTarget) => ({
    href: target.href,
    ...(target.external ? { rel: "noopener noreferrer nofollow", target: "_blank" as const } : {}),
    onClick: onLinkClick ? (e: MouseEvent<HTMLAnchorElement>) => onLinkClick(e, target.link) : undefined,
  });
}

export function useTarget(link?: LandingLink | null): ResolvedTarget | null {
  const { resolveHref } = usePage();
  return resolveTarget(link, resolveHref);
}

/** Variant of a button in a pair (closed list → class). */
export type ButtonVariant = "plain" | "primary" | "outline" | "outline-dark";
const BUTTON_CLASS: Record<ButtonVariant, string> = {
  plain: "g4mp-btn",
  primary: "g4mp-btn g4mp-btn--primary",
  outline: "g4mp-btn g4mp-btn--outline",
  "outline-dark": "g4mp-btn g4mp-btn--outline-dark",
};

/** 0–2 buttons; variants by position. Nothing when no button is drawn. */
export function Buttons({ buttons, variants }: { buttons?: LandingButton[]; variants: ButtonVariant[] }) {
  const page = usePage();
  const anchor = useAnchorProps();
  const list = drawnButtons(buttons, page.resolveHref).slice(0, variants.length);
  if (!list.length) return null;
  return (
    <div className="g4mp-btns">
      {list.map(({ button, target }, i) => {
        const className = BUTTON_CLASS[variants[i]];
        if (target) {
          return (
            <a key={i} className={className} {...anchor(target)}>
              {button.label}
              {target.external && <ExitMark />}
            </a>
          );
        }
        // Legacy host without resolveHref: a button handled by onCtaClick.
        return (
          <button
            key={i}
            type="button"
            className={className}
            onClick={() => page.onCtaClick?.(legacyCtaOf(button) ?? legacyCta(button))}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── formatted text (concept §11) ──────────────────────────────────────────── */

function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {p}
        </Fragment>
      ))}
    </>
  );
}

/**
 * Text field. A plain string is one element with `white-space: pre-line`
 * (unchanged from 0.4.x). Paragraphs are `<p>` with `<strong>`, `<em>`, `<u>`,
 * `<a href>` and `<br>` built as elements — content is never parsed as HTML.
 */
export function RichTextView({ value, className }: { value?: RichText; className: string }) {
  const { resolveHref } = usePage();
  const anchor = useAnchorProps();
  if (typeof value === "string") {
    return value.trim() ? <p className={className}>{value}</p> : null;
  }
  const paras = richParagraphs(value);
  if (!paras.length) return null;
  return (
    <div className={cx(className, "g4mp-rich")}>
      {paras.map((p, i) => (
        <p key={i}>
          {p.map((f, j) => {
            let node: ReactNode = f.text.includes("\n") ? <Lines text={f.text} /> : f.text;
            if (f.underline) node = <u>{node}</u>;
            if (f.italic) node = <em>{node}</em>;
            if (f.bold) node = <strong>{node}</strong>;
            const target = resolveTarget(f.link, resolveHref);
            if (target) {
              node = (
                <a className="g4mp-link" {...anchor(target)}>
                  {node}
                  {target.external && <ExitMark />}
                </a>
              );
            }
            return <Fragment key={j}>{node}</Fragment>;
          })}
        </p>
      ))}
    </div>
  );
}
