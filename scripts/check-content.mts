// 빌드 전에 콘텐츠를 검사한다(`npm run content:check`, `prebuild`에서 실행).
// 스키마 위반이면 실패하고, 최신성은 실패시키지 않고 보고만 한다(CONTENT_OPS.md §3).
import { readFileSync } from "node:fs";
import {
  ClaimsFile,
  LinksFile,
  PhrasesFile,
  staleness,
  TimetablesFile,
} from "../src/content/schema.ts";

const read = (path: string): unknown => JSON.parse(readFileSync(path, "utf8"));

const results = [
  ["src/content/claims.json", ClaimsFile.safeParse(read("src/content/claims.json"))],
  ["src/content/phrases.json", PhrasesFile.safeParse(read("src/content/phrases.json"))],
  ["src/content/links.json", LinksFile.safeParse(read("src/content/links.json"))],
  ["src/content/timetables.json", TimetablesFile.safeParse(read("src/content/timetables.json"))],
] as const;

let failed = false;
for (const [path, result] of results) {
  if (!result.success) {
    failed = true;
    console.error(`✗ ${path}`);
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
  }
}
if (failed) process.exit(1);

const claims = ClaimsFile.parse(read("src/content/claims.json"));
const phrases = PhrasesFile.parse(read("src/content/phrases.json"));
const today = new Date().toISOString().slice(0, 10);
const old = claims
  .map((c) => ({ id: c.id, state: staleness(c, today) }))
  .filter((c) => c.state !== "fresh");

const links = LinksFile.parse(read("src/content/links.json"));
console.log(`✓ claims ${claims.length}, phrases ${phrases.length}, links ${links.length}`);
for (const c of old) console.log(`  ${c.state === "stale" ? "! stale" : "· due  "} ${c.id}`);
const drafts = phrases.filter((p) => !p.reviewed).length;
if (drafts) console.log(`  · phrases not yet reviewed: ${drafts}`);
