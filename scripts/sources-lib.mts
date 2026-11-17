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
  // 앞이 숫자나 소수점이면 더 큰 수의 일부(13.7% 안의 3.7%)
  if (token.endsWith("%")) {
    const n = token.slice(0, -1).replace(".", "\\.");
    return new RegExp(`(?<![\\d.])${n}\\s?%`).test(html);
  }
  const plain = digits(token);
  // 뒤에 "쉼표+숫자"가 오면 더 큰 수(13,000,000). 문장 부호 쉼표("₩5,000, ₩8,000")는 괜찮다
  return new RegExp(`(?<![\\d,])(${token}|${plain})(?!\\d|,\\d)`).test(html);
}

export type Baseline = Record<string, string>;
/** 기준선 키: "claimId @ url : 숫자" */
export const baselineKey = (claimId: string, url: string, token: string) =>
  `${claimId} @ ${url} : ${token}`;

const urlOfKey = (key: string) => key.slice(key.indexOf(" @ ") + 3, key.lastIndexOf(" : "));

/**
 * --update-baseline이 쓸 기준선. 이번에 열리지 않은 페이지의 항목은 손으로 쓴 이유와 함께 그대로 옮긴다
 * (열리지 않은 날 돌려도 기준선이 지워지지 않게). 다시 찾은 누락은 이유를 이어받고 새 누락은 TODO.
 * removable: 열린 페이지인데 숫자가 다시 보여 기준선에서 지워도 되는 항목
 */
export function nextBaseline(
  prev: Baseline,
  missing: string[],
  unchecked: Set<string>,
): { baseline: Baseline; removable: string[] } {
  const baseline: Baseline = {};
  for (const [key, reason] of Object.entries(prev))
    if (unchecked.has(urlOfKey(key))) baseline[key] = reason;
  for (const key of missing) baseline[key] = prev[key] ?? "TODO: 왜 자동 확인이 안 되는지 적는다";
  const removable = Object.keys(prev).filter((k) => !(k in baseline));
  return { baseline, removable };
}

export interface CiteguardClaimAuditResult {
  claimId: string;
  grounded: boolean;
  faithfulnessScore: number;
  unverifiedNumbers: string[];
}

/**
 * 선택적 로컬 citeguard(Qdrant + Ollama Hybrid RRF & Faithfulness Gate) 연동:
 * 정규식(pageHasNumber)만으로는 잡지 못하는 표 행 뒤바뀜(예: T1/T2 운임 행 교차)이나 문맥 변조를
 * 빌드/CI 출처 감시 단계에서 검증한다. 브라우저 런타임(정적 export PWA)에는 일절 의존성을 추가하지 않는다.
 */
export async function verifyClaimWithCiteguard(
  citeguardUrl: string,
  claim: { id: string; claim: string },
  minFaithfulness = 0.6,
  fetchFn: typeof fetch = fetch,
): Promise<CiteguardClaimAuditResult> {
  const res = await fetchFn(`${citeguardUrl.replace(/\/$/, "")}/v1/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: claim.claim,
      top_k: 3,
      min_faithfulness: minFaithfulness,
    }),
  });
  if (!res.ok) {
    throw new Error(`citeguard ask failed (${res.status}) for claim ${claim.id}`);
  }
  const body = (await res.json()) as {
    status: "answered" | "insufficient_evidence";
    faithfulness_score: number;
    unverified_numbers?: string[];
  };
  return {
    claimId: claim.id,
    grounded: body.status === "answered" && body.faithfulness_score >= minFaithfulness,
    faithfulnessScore: body.faithfulness_score,
    unverifiedNumbers: body.unverified_numbers ?? [],
  };
}
