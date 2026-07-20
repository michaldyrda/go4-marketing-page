/**
 * URL guards. The marketing config is authored data (org-scoped, from the DB),
 * but we still refuse dangerous schemes before a URL reaches an href, window.open
 * target, or <img src> — defence in depth against a `javascript:`/`data:text`
 * payload slipping into content.
 */
/** http(s) or same-origin path only. Returns undefined for anything else. */
export function safeHref(url) {
    if (!url)
        return undefined;
    const t = url.trim();
    if (/^https?:\/\//i.test(t))
        return t;
    if (t.startsWith("/") && !t.startsWith("//"))
        return t; // same-origin path, not protocol-relative
    return undefined;
}
/** http(s), same-origin path, or a data:image/* URI. Returns undefined otherwise. */
export function safeImgSrc(url) {
    if (!url)
        return undefined;
    const t = url.trim();
    if (/^https?:\/\//i.test(t))
        return t;
    if (/^data:image\//i.test(t))
        return t;
    if (t.startsWith("/") && !t.startsWith("//"))
        return t;
    return undefined;
}
