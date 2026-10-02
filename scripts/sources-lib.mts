// 출처 감시(scripts/check-sources.mts)의 순수 함수. claim 문장 속 "눈에 띄는 숫자"가 출처 페이지에 아직 있는지 본다.

/** 금액(1,000 이상, 쉼표)·시각(HH:MM)·백분율. 작은 정수는 흔해서 감시하지 않는다 */
export function claimNumbers(text: string): string[] {
  const found = [
    ...text.matchAll(/\b\d{1,3}(?:,\d{3})+\b/g), // 13,000
    ...text.matchAll(/\b\d{1,2}:\d{2}\b/g), // 06:00, 5:16
    ...text.matchAll(/\b\d+(?:\.\d+)?%/g), // 3.7%
  ].map((m) => m[0]);
  return [...new Set(found)];
}

const digits = (s: string) => s.replace(/[^\d.]/g, "");

/** 페이지(HTML 원문, 스크립트 안의 데이터 포함)에서 숫자를 찾는다. 13,000 = 13000, 06:00 = 6:00 */
export function pageHasNumber(html: string, token: string): boolean {
  if (/^\d{1,2}:\d{2}$/.test(token)) {
    const [h, m] = token.split(":") as [string, string];
    const hour = String(Number(h));
    return new RegExp(`(?<!\\d)0?${hour}:${m}(?!\\d)`).test(html);
  }
  if (token.endsWith("%")) return html.includes(token) || html.includes(token.replace("%", " %"));
  const plain = digits(token);
  return new RegExp(`(?<![\\d,])(${token.replace(/,/g, ",")}|${plain})(?![\\d,])`).test(html);
}

export type Baseline = Record<string, string>;
/** 기준선 키: "claimId @ url : 숫자" */
export const baselineKey = (claimId: string, url: string, token: string) =>
  `${claimId} @ ${url} : ${token}`;
