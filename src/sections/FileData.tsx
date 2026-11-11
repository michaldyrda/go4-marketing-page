import { Frame } from "../render";
import type { LandingSection } from "../types";
import { Copy } from "./Copy";

const CLASS: Partial<Record<LandingSection["type"], string>> = {
  collections: "g4mp-section g4mp-cards g4mp-collections",
  products: "g4mp-section g4mp-products",
  contact: "g4mp-section g4mp-contact",
};

/**
 * Page file only: a section drawn from go4 data (Collections, Products, Contact)
 * carries its title, text and options (`data-go4-*` on the section) — never the
 * data itself, which go4 resolves when the page is shown.
 */
export function FileData({ section }: { section: LandingSection }) {
  const c = section.config;
  return (
    <Frame className={CLASS[section.type] ?? "g4mp-section"}>
      <div className="g4mp-inner">
        <Copy
          title={c.title}
          subtitle={section.type === "products" ? c.subtitle : undefined}
          body={section.type === "contact" ? c.body : undefined}
        />
      </div>
    </Frame>
  );
}

/** Section types whose content comes from go4 data. */
export const FILE_DATA_TYPES: ReadonlySet<LandingSection["type"]> = new Set(["collections", "products", "contact"]);
