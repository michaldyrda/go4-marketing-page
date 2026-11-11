import { contactRows } from "../model";
import { ExitMark, Frame, usePage } from "../render";
import type { LandingSection } from "../types";
import { Copy, hasCopy } from "./Copy";

/** Contact — brand details from Settings (served by the host in `section.resolved.contact`). */
export function Contact({ section }: { section: LandingSection }) {
  const { labels, onLinkClick } = usePage();
  const c = section.config;
  const rows = contactRows(section);
  return (
    <Frame className="g4mp-section g4mp-contact">
      <div className="g4mp-inner g4mp-contact__grid">
        {hasCopy(c) && (
          <div className="g4mp-contact__copy">
            <Copy title={c.title} body={c.body} />
          </div>
        )}
        {rows.length > 0 && (
          <ul className="g4mp-contact__list">
            {rows.map((r) => (
              <li key={r.key} className="g4mp-contact__item">
                <span className="g4mp-contact__label">{labels.contact[r.key]}</span>
                {r.href ? (
                  <a
                    className="g4mp-contact__value"
                    href={r.href}
                    {...(r.external ? { rel: "noopener noreferrer nofollow", target: "_blank" } : {})}
                    onClick={onLinkClick ? (e) => onLinkClick(e, { kind: "external", url: r.href }) : undefined}
                  >
                    {r.value}
                    {r.external && <ExitMark />}
                  </a>
                ) : (
                  <span className="g4mp-contact__value">{r.value}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Frame>
  );
}
