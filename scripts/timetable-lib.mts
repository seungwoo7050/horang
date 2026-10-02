// AREX 직통 시각표 HTML 파싱(순수 함수, 테스트 대상).
// 표 구조(2026-10-02 확인): 평일·휴일 표 2개, 각 행 = [T2 출발, T1 출발, 서울역 도착, 서울역 출발, T1 도착, T2 도착]

export type ToSeoul = { t2: string; t1: string; seoul: string };
export type ToAirport = { seoul: string; t1: string; t2: string };
export type ExpressTimetable = {
  toSeoul: ToSeoul[];
  toAirport: ToAirport[];
  sameOnHolidays: boolean;
};

const TIME = /^\d\d:\d\d$/;
const text = (cell: string) =>
  cell
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

function tableRows(table: string): string[][] {
  return [...table.matchAll(/<tr[\s\S]*?<\/tr>/g)]
    .map((tr) =>
      [...tr[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((m) => text(m[1] ?? "")),
    )
    .filter((cells) => cells.length === 6 && cells.every((c) => TIME.test(c)));
}

function split(rows: string[][]): Pick<ExpressTimetable, "toSeoul" | "toAirport"> {
  return {
    toSeoul: rows.map(([t2, t1, seoul]) => ({ t2: t2!, t1: t1!, seoul: seoul! })),
    toAirport: rows.map((r) => ({ seoul: r[3]!, t1: r[4]!, t2: r[5]! })),
  };
}

export function parseExpressTimetable(html: string): ExpressTimetable {
  const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map((m) => tableRows(m[0]));
  const [weekday, holiday] = tables.filter((rows) => rows.length > 0);
  if (!weekday || !holiday)
    throw new Error("평일·휴일 시각표 표를 찾지 못했다(페이지 구조가 바뀌었을 수 있다)");
  const sameOnHolidays = JSON.stringify(weekday) === JSON.stringify(holiday);
  // 휴일 표가 다르면 지금 앱은 그 차이를 다루지 않으므로 멈춘다(조용히 틀리지 않게)
  if (!sameOnHolidays) throw new Error("평일·휴일 시각표가 다르다 — 앱에 휴일 처리 추가 필요");
  return { ...split(weekday), sameOnHolidays };
}

/** "HH:MM" → 자정부터 분 */
export const minutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
