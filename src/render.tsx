/** Drawing primitives shared by the section components. */
import { Fragment, createContext, useContext } from "react";
import type { MouseEvent, ReactNode } from "react";
import { DEFAULT_LABELS } from "./labels";
import type { MarketingLabels } from "./labels";
import { FILE_ATTR, linkFileAttrs } from "./contract";
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
  /** Page file (`renderPageFile`): contract attributes on sections, fields, items, media and links. */
  fileMode: boolean;
}

export const PageContext = createContext<PageHost>({
  forceMobile: false,
  transform: { fn: (url) => url, resizes: false },
  labels: DEFAULT_LABELS,
  editorMode: false,
  fileMode: false,
});
export const usePage = () => useContext(PageContext);

/* ── per-section context ───────────────────────────────────────────────────── */

export interface SectionCtx {
  id: string;
  type: LandingSectionType;
  h1: boolean;
  first: boolean;
  joined: boolean;
  /** File mode: `<section>` attributes (`data-go4-section`, options, hidden). */
  fileAttrs?: Record<string, string>;
  /** File mode: section saved as hidden — drawn with `hidden`. */
  hidden?: boolean;
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

/** File mode: `data-go4-field` on the element of a field (nothing outside file mode). */
export function useField() {
  const { fileMode } = usePage();
  return (name: string) => (fileMode ? { [FILE_ATTR.field]: name } : {});
}

/** File mode: `data-go4-item` on the element of an item. */
export function useItem() {
  const { fileMode } = usePage();
  return fileMode ? { [FILE_ATTR.item]: "" } : {};
}

/** File mode: decoration the import skips (exit mark, numbering). */
export function useIgnore() {
  const { fileMode } = usePage();
  return fileMode ? { [FILE_ATTR.ignore]: "" } : {};
}

/**
 * The `<section>` of every component: adjacency class, in the editor the
 * `data-section-id` + click hook, in the page file the contract attributes.
 */
export function Frame({ className, children }: { className: string; children: ReactNode }) {
  const page = usePage();
  const s = useContext(SectionContext);
  const id = page.editorMode && SAFE_ID.test(s.id) ? s.id : undefined;
  return (
    <section
      className={cx(className, s.joined && "g4mp-section--joined")}
      data-section-id={id}
      hidden={page.fileMode && s.hidden ? true : undefined}
      {...(page.fileMode ? s.fileAttrs : undefined)}
      onClick={id && page.onSectionClick ? () => page.onSectionClick?.(id) : undefined}
    >
      {children}
    </section>
  );
}

/** Section title at the level that follows from its position (h1 once per page, else h2). */
export function Title({ className, children, field = "title" }: { className: string; children: ReactNode; field?: string }) {
  const { h1 } = useContext(SectionContext);
  const f = useField()(field);
  return h1 ? <h1 className={className} {...f}>{children}</h1> : <h2 className={className} {...f}>{children}</h2>;
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
  field = "media",
}: {
  media?: LandingMedia;
  slot: Slot;
  alt: string;
  className?: string;
  /** File mode: field name of the image (`media`, `avatar`). */
  field?: string;
}) {
  const { forceMobile, transform, fileMode } = usePage();
  const { first } = useContext(SectionContext);
  const desktop = safeImgSrc(media?.file_url);
  const mobile = safeImgSrc(media?.mobile_file_url);
  const base = desktop || mobile;
  if (!base) return null;

  const src = (u: string) => transform.fn(u, slot.width);
  const srcSet = (u: string) =>
    transform.resizes ? slot.srcset.map((w) => `${transform.fn(u, w)} ${w}w`).join(", ") : undefined;
  const props = {
    // File mode: the brand's own alt only — a fallback (title, caption) is not content of the image.
    alt: fileMode ? (media?.alt ?? "").trim() : alt,
    className,
    width: safeDimension(media?.width),
    height: safeDimension(media?.height),
    loading: first ? undefined : ("lazy" as const),
    decoding: "async" as const,
    sizes: transform.resizes ? slot.sizes : undefined,
    ...(fileMode ? mediaFileAttrs(media, field) : {}),
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

/** File mode: field and library ids of an image or video. */
export function mediaFileAttrs(media: LandingMedia | undefined, field: string): Record<string, string> {
  const out: Record<string, string> = { [FILE_ATTR.field]: field };
  if (media?.media_id) out[FILE_ATTR.mediaId] = media.media_id;
  if (media?.mobile_media_id) out[FILE_ATTR.mobileMediaId] = media.mobile_media_id;
  if (media?.source_media_id) out[FILE_ATTR.sourceMediaId] = media.source_media_id;
  return out;
}

/** Alt text: the brand's own, else the given fallback, else decorative. */
export const altOf = (m: { alt?: string } | undefined, fallback?: string) => (m?.alt ?? fallback ?? "").trim();

/* ── links ─────────────────────────────────────────────────────────────────── */

export function ExitMark() {
  const ignore = useIgnore();
  return (
    <span className="g4mp-ext" aria-hidden="true" {...ignore}>
      ↗
    </span>
  );
}

/** Props of an `<a>` for a resolved target (rel/target for external links). */
export function useAnchorProps() {
  const { onLinkClick, fileMode } = usePage();
  return (target: ResolvedTarget) => ({
    href: target.href,
    ...(target.external ? { rel: "noopener noreferrer nofollow", target: "_blank" as const } : {}),
    ...(fileMode ? linkFileAttrs(target.link) : {}),
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
  const field = useField()("button");
  // File mode: every labelled button, also one without a target yet (no href).
  const list = (
    page.fileMode
      ? (buttons ?? []).filter((b) => b.label.trim()).map((button) => ({ button, target: resolveTarget(button.link, page.resolveHref) }))
      : drawnButtons(buttons, page.resolveHref)
  ).slice(0, variants.length);
  if (!list.length) return null;
  return (
    <div className="g4mp-btns">
      {list.map(({ button, target }, i) => {
        const className = BUTTON_CLASS[variants[i]];
        if (target) {
          return (
            <a key={i} className={className} {...anchor(target)} {...field}>
              {button.label}
              {target.external && <ExitMark />}
            </a>
          );
        }
        if (page.fileMode) {
          return (
            <a key={i} className={className} {...field}>
              {button.label}
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
export function RichTextView({ value, className, field = "body" }: { value?: RichText; className: string; field?: string }) {
  const { resolveHref, fileMode } = usePage();
  const anchor = useAnchorProps();
  const f = useField()(field);
  // File mode: always paragraphs — the file carries the text as the import reads it back.
  if (typeof value === "string" && !fileMode) {
    return value.trim() ? <p className={className}>{value}</p> : null;
  }
  const paras = richParagraphs(value);
  if (!paras.length) return null;
  return (
    <div className={cx(className, "g4mp-rich")} {...f}>
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
