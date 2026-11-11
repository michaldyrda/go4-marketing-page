/**
 * URL guards. Page content is authored data and can be written to the database
 * without passing through the editor, so every URL is checked again here before
 * it reaches an href or <img src> — defence in depth against `javascript:`,
 * `data:text`, protocol-relative and credential-carrying URLs.
 */
/**
 * Allowed: http(s) without credentials, same-origin path, `mailto:` (address
 * only, no parameters), `tel:` (optional + and digits — the server normalizes). Undefined otherwise.
 */
export declare function safeHref(url?: string | null): string | undefined;
/**
 * http(s) without credentials, same-origin path, or a raster data:image URI.
 * Returns undefined otherwise.
 */
export declare function safeImgSrc(url?: string | null): string | undefined;
/** Positive integer pixel size, or undefined. */
export declare function safeDimension(n?: number | null): number | undefined;
/** Library / collection / product identifiers are UUIDs — anything else is dropped. */
export declare function isUuid(v: unknown): v is string;
/**
 * Address of an `external` link target: absolute http(s) without credentials,
 * strict `mailto:` or `tel:` (same rules as `safeHref`). Relative paths are not
 * external. Undefined otherwise.
 */
export declare function safeExternalUrl(url?: string | null): string | undefined;
