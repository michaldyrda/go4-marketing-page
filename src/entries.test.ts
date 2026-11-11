// @vitest-environment node
/**
 * Kontrakt wejść paczki dla trzech hostów (prep 0.7):
 * - arkusz to same reguły — tekst poza regułą łamał minifikator CSS w Next
 *   i unieważniał następną regułę w przeglądarce (zgłoszenie 2026-11-12);
 * - `./data` nie ciągnie Reacta: kod serwera Next (strona, trasa `.md`) i Deno
 *   importują `buildStructuredData` / `sectionsToMarkdown` bez `createContext`.
 */
import { describe, expect, it } from "vitest";
import { buildSync } from "esbuild";
import { MARKETING_CSS } from "./styles";

/** Sprawdza, że po usunięciu komentarzy arkusz składa się wyłącznie z reguł. */
function cssProblems(css: string): string[] {
  const problems: string[] = [];
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  if (noComments.includes("*/")) problems.push("zamknięcie komentarza poza komentarzem");
  if (noComments.includes("/*")) problems.push("niezamknięty komentarz");
  let depth = 0;
  let prelude = "";
  for (const ch of noComments) {
    if (ch === "{") {
      const p = prelude.trim();
      if (!p) problems.push("reguła bez selektora");
      else if (!/^[\x20-\x7e\s]+$/.test(p)) problems.push(`znaki spoza ASCII w selektorze: ${p.slice(0, 60)}`);
      else if (depth === 0 && /[;]/.test(p)) problems.push(`tekst przed regułą: ${p.slice(0, 60)}`);
      depth++;
      prelude = "";
    } else if (ch === "}") {
      depth--;
      if (depth < 0) problems.push("nadmiarowe }");
      prelude = "";
    } else if (ch === ";" && depth > 0) {
      prelude = "";
    } else {
      prelude += ch;
    }
  }
  if (depth !== 0) problems.push("niedomknięty blok");
  if (prelude.trim()) problems.push(`tekst po ostatniej regule: ${prelude.trim().slice(0, 60)}`);
  return problems;
}

describe("arkusz paczki", () => {
  it("same reguły — bez tekstu poza regułami i komentarzami", () => {
    expect(cssProblems(MARKETING_CSS)).toEqual([]);
  });

  it("strażnik łapie złamany komentarz (przypadek ze zgłoszenia)", () => {
    expect(cssProblems("/* a */\n   ═══ */\n.x ul { margin: 0; }")).not.toEqual([]);
  });
});

describe("wejście ./data", () => {
  const bundle = buildSync({
    entryPoints: [new URL("./data.ts", import.meta.url).pathname],
    bundle: true,
    format: "esm",
    write: false,
    packages: "external",
    platform: "neutral",
  }).outputFiles[0].text;

  it("nie importuje Reacta", () => {
    expect(bundle).not.toMatch(/from\s*["']react/);
    expect(bundle).not.toMatch(/createContext/);
  });

  it("działa samo, bez Reacta: Markdown i dane strukturalne", async () => {
    const mod = await import(/* @vite-ignore */ "data:text/javascript;base64," + Buffer.from(bundle).toString("base64"));
    const sections = [
      { id: "00000000-0000-4000-8000-000000000001", type: "hero", is_visible: true, order_index: 0, config: { title: "Spring 2027", body: "Ten looks." } },
      { id: "00000000-0000-4000-8000-000000000002", type: "faq", is_visible: true, order_index: 1, config: { title: "FAQ", items: [{ question: "When?", answer: "January." }] } },
    ];
    expect(mod.sectionsToMarkdown(sections)).toContain("# Spring 2027");
    const ld = mod.buildStructuredData(sections);
    expect(JSON.stringify(ld)).toContain("FAQPage");
    expect(typeof mod.normalizeSection).toBe("function");
    expect(typeof mod.jsonLdScriptContent).toBe("function");
    expect(mod.SECTION_CATALOG).toBeTruthy();
  });
});
