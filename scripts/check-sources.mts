// 출처 감시(주 1회 CI, .github/workflows/sources.yml). 실행: node scripts/check-sources.mts [--update-baseline]
// 실패(종료 코드 1)하는 것: ① 공식 직통 시각표가 timetables.json과 다름 ② 잘 열린 출처 페이지에서
//   claim의 금액·시각·백분율이 사라짐(기준선에 없는 새 누락). 경고만: 열리지 않는 페이지(해외 CI에서 막히는 기관 사이트가 있다).
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import {
  baselineKey,
  claimNumbers,
  nextBaseline,
  pageHasNumber,
  type Baseline,
} from "./sources-lib.mts";
import { parseExpressTimetable } from "./timetable-lib.mts";

type Claim = { id: string; text: { en: string }; sources: { url: string }[] };
type Link = { id: string; url: string };

const BASELINE = "scripts/sources-baseline.json";
const update = process.argv.includes("--update-baseline");
const claims: Claim[] = JSON.parse(readFileSync("src/content/claims.json", "utf8"));
const links: Link[] = JSON.parse(readFileSync("src/content/links.json", "utf8"));
const timetables = JSON.parse(readFileSync("src/content/timetables.json", "utf8"));
const baseline: Baseline = JSON.parse(readFileSync(BASELINE, "utf8"));

async function get(url: string): Promise<{ ok: boolean; status: string; body: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (Horang source check; +https://github.com/seungwoo7050/horang)",
      },
      signal: AbortSignal.timeout(30_000),
    });
    const type = res.headers.get("content-type") ?? "";
    const body = type.includes("pdf") ? "" : await res.text();
    return { ok: res.ok, status: String(res.status) + (type.includes("pdf") ? " pdf" : ""), body };
  } catch (e) {
    return { ok: false, status: `error: ${(e as Error).message}`, body: "" };
  }
}

const failures: string[] = [];
const warnings: string[] = [];
const report: string[] = ["# 출처 감시", ""];

// ① 공식 직통 시각표
{
  const url = timetables["arex-express"].source.url as string;
  const page = await get(url);
  if (!page.ok) warnings.push(`직통 시각표 페이지를 열지 못함(${page.status}) ${url}`);
  else {
    try {
      const now = parseExpressTimetable(page.body);
      const ours = timetables["arex-express"];
      const same =
        JSON.stringify(now.toSeoul) === JSON.stringify(ours.toSeoul) &&
        JSON.stringify(now.toAirport) === JSON.stringify(ours.toAirport);
      if (same) report.push(`- ✓ 직통 시각표 ${now.toSeoul.length}회×2 그대로`);
      else
        failures.push(
          `직통 시각표가 바뀌었다 → node scripts/fetch-arex-timetable.mts 후 claim 문장 확인 (${url})`,
        );
    } catch (e) {
      failures.push(`직통 시각표를 읽지 못함: ${(e as Error).message} (${url})`);
    }
  }
}

// ② claim 숫자
const pages = new Map<string, Awaited<ReturnType<typeof get>>>();
for (const url of new Set(claims.flatMap((c) => c.sources.map((s) => s.url))))
  pages.set(url, await get(url));

const missing: string[] = [];
let checked = 0;
for (const c of claims) {
  const tokens = claimNumbers(c.text.en);
  if (tokens.length === 0) continue;
  for (const { url } of c.sources) {
    const page = pages.get(url)!;
    if (!page.ok || !page.body) continue;
    for (const token of tokens) {
      checked++;
      if (pageHasNumber(page.body, token)) continue;
      // claim 숫자가 출처 여러 곳 중 다른 곳에 있으면 정상(출처마다 다루는 사실이 다르다)
      const elsewhere = c.sources.some(
        (s) => s.url !== url && pageHasNumber(pages.get(s.url)?.body ?? "", token),
      );
      if (elsewhere) continue;
      const key = baselineKey(c.id, url, token);
      missing.push(key);
      if (!(key in baseline)) failures.push(`${c.id}: "${token}"이(가) 출처에 없다 — ${url}`);
    }
  }
}
report.push(
  `- claim 숫자 ${checked}건 확인, 기준선(자동 확인 불가) ${Object.keys(baseline).length}건`,
);
const unchecked = new Set([...pages].filter(([, p]) => !p.ok || !p.body).map(([url]) => url));
const { baseline: newBaseline, removable } = nextBaseline(baseline, missing, unchecked);
for (const key of removable) report.push(`- 기준선에서 지울 수 있음(숫자가 다시 보인다): ${key}`);

// ③ 열리는지(경고)
for (const [url, page] of pages)
  if (!page.ok) warnings.push(`출처를 열지 못함(${page.status}) ${url}`);
for (const l of links.filter((l) => l.url.startsWith("https://"))) {
  const page = await get(l.url);
  if (!page.ok) warnings.push(`링크 ${l.id}를 열지 못함(${page.status}) ${l.url}`);
}

if (update) {
  writeFileSync(BASELINE, JSON.stringify(newBaseline, null, 2) + "\n");
  console.log(
    `기준선 ${Object.keys(newBaseline).length}건을 썼다(열리지 않은 페이지 항목 유지) — 각 항목에 이유를 적는다`,
  );
}

report.push("", `## 실패 ${failures.length}`, ...failures.map((f) => `- ✗ ${f}`));
report.push("", `## 경고 ${warnings.length}`, ...warnings.map((w) => `- ! ${w}`));
const text = report.join("\n");
console.log(text);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + "\n");
process.exit(failures.length && !update ? 1 : 0);
