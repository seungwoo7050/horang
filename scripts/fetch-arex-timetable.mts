// AREX 공식 직통 시각표 페이지를 읽어 src/content/timetables.json의 arex-express 항목을 만든다.
// 실행: node scripts/fetch-arex-timetable.mts  (값을 손으로 옮기지 않는다 — 출처 감시에도 쓴다)
import { readFileSync, writeFileSync } from "node:fs";
import { parseExpressTimetable } from "./timetable-lib.mts";

const URL_ = "https://www.airportrailroad.com/train/express/info";
const OUT = "src/content/timetables.json";

const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
const res = await fetch(URL_, {
  headers: { "user-agent": "Mozilla/5.0 (Horang timetable check)" },
});
if (!res.ok) throw new Error(`시각표 페이지 응답 ${res.status}`);
const parsed = parseExpressTimetable(await res.text());

const file = JSON.parse(readFileSync(OUT, "utf8"));
file["arex-express"] = {
  ...parsed,
  source: { url: URL_, title: "AREX Express timetable (official, weekday and holiday)" },
  evidence: "B",
  verifiedAt: today,
  verifiedBy: "scripts/fetch-arex-timetable.mts (official page)",
};
writeFileSync(OUT, JSON.stringify(file, null, 2) + "\n");
console.log(
  `✓ 직통 ${parsed.toSeoul.length}회(공항→서울역), ${parsed.toAirport.length}회(서울역→공항), 평일=휴일 ${parsed.sameOnHolidays}`,
);
