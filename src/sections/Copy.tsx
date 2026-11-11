import { has } from "../model";
import { hasRichText } from "../richText";
import { RichTextView, Title } from "../render";
import type { RichText } from "../types";

/** True when the title / subtitle / text block draws anything. */
export const hasCopy = (c: { title?: string; subtitle?: string; body?: RichText }) =>
  has(c.title) || has(c.subtitle) || hasRichText(c.body);

/** Title + subtitle + text — the shared heading block of most sections. */
export function Copy({
  title,
  subtitle,
  body,
  titleClass = "g4mp-title",
  subtitleClass = "g4mp-subtitle",
  bodyClass = "g4mp-body",
}: {
  title?: string;
  subtitle?: string;
  body?: RichText;
  titleClass?: string;
  subtitleClass?: string;
  bodyClass?: string;
}) {
  return (
    <>
      {has(title) && <Title className={titleClass}>{title}</Title>}
      {has(subtitle) && <p className={subtitleClass}>{subtitle}</p>}
      <RichTextView value={body} className={bodyClass} />
    </>
  );
}
