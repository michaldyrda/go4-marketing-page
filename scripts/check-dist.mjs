// Bramka builda: `dist/data.js` bez Reacta (kod serwera), `dist/index.js` zaczyna się od "use client".
import { readFileSync } from "node:fs";
const data = readFileSync(new URL("../dist/data.js", import.meta.url), "utf8");
if (/from\s*["']react/.test(data) || /require\(["']react/.test(data)) {
  console.error("dist/data.js importuje Reacta — wejście ./data musi działać bez niego");
  process.exit(1);
}
const index = readFileSync(new URL("../dist/index.js", import.meta.url), "utf8");
if (!/^"use client";/.test(index)) {
  console.error('dist/index.js musi zaczynać się od "use client";');
  process.exit(1);
}
console.log("dist: data.js bez Reacta, index.js z \"use client\"");
