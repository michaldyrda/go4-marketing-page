/**
 * URL guards. The marketing config is authored data (org-scoped, from the DB),
 * but we still refuse dangerous schemes before a URL reaches an href, window.open
 * target, or <img src> — defence in depth against a `javascript:`/`data:text`
 * payload slipping into content.
 */
/** http(s) or same-origin path only. Returns undefined for anything else. */
export declare function safeHref(url?: string | null): string | undefined;
/** http(s), same-origin path, or a data:image/* URI. Returns undefined otherwise. */
export declare function safeImgSrc(url?: string | null): string | undefined;
