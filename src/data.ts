/**
 * `@go4/marketing-page/data` — wszystko, co NIE rysuje: odczyt i normalizacja
 * treści, katalog komponentów, formatowanie tekstu, wersja tekstowa `.md`,
 * dane strukturalne, strażnicy adresów, arkusz jako ciąg. Bez Reacta —
 * importowalne w kodzie serwera (Next: strona serwerowa, trasa `.md`),
 * w Deno (funkcje brzegowe) i w czystym Node.
 */
export { safeHref, safeImgSrc, safeExternalUrl, isUuid } from "./sanitizeUrl";
export { ctaLink, normalizeLink, LANDING_LINK_KINDS } from "./links";
export { normalizeSection, normalizeMedia, SECTION_TYPES } from "./normalize";
export {
  richTextFromHtml,
  richTextToHtml,
  richTextPlain,
  normalizeRichText,
  hasRichText,
} from "./richText";
export { SECTION_CATALOG, CATALOG_GROUPS, CATALOG_VERSION, TEXT_LIMITS, catalogEntry } from "./catalog";
export type { CatalogEntry, CatalogField, CatalogFieldKind, CatalogCrop, CatalogGroup } from "./catalog";
export {
  CONTRACT_VERSION,
  CONTRACT_ATTRIBUTES,
  CONTRACT_CLASSES,
  FILE_ATTR,
  BUTTON_FIELD,
  optionAttr,
  optionFields,
  itemListAttr,
  pageFileInstructions,
} from "./contract";
export { DEFAULT_LABELS } from "./labels";
export type { MarketingLabels, MarketingLabelsInput } from "./labels";
export { buildStructuredData, jsonLdScriptContent } from "./structuredData";
export type { JsonLd, StructuredDataOptions } from "./structuredData";
export { sectionsToMarkdown } from "./markdown";
export type { MarkdownOptions } from "./markdown";
export { MARKETING_CSS } from "./styles";
export { MARKETING_CSS_SHA256 } from "./cssHash";
export type * from "./types";
