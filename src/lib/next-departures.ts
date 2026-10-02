// "다음 열차": 시각표와 지금 한국 시각으로 다음 출발 몇 개를 고른다. 기기 시간대와 상관없이 한국 시각(KST)을 쓴다.

export const minutesOf = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** 지금 한국 시각(자정부터 분). 여행자 폰이 아직 고향 시간대여도 맞게 계산한다 */
export function koreaMinutes(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

export type Departure<T> = { row: T; time: string; inMinutes: number };

/**
 * 지금 이후(지금 분 포함) 출발 count개. 오늘 남은 열차가 없으면 빈 배열(첫차는 rows[0]).
 * 시각표는 자정을 넘기지 않는다(직통 마지막 출발 23:00, 2026-10-02 확인).
 */
export function nextDepartures<T>(
  rows: readonly T[],
  timeOf: (row: T) => string,
  nowMinutes: number,
  count = 3,
): Departure<T>[] {
  return rows
    .map((row) => ({ row, time: timeOf(row), inMinutes: minutesOf(timeOf(row)) - nowMinutes }))
    .filter((d) => d.inMinutes >= 0)
    .slice(0, count);
}
