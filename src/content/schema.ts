// 콘텐츠 스키마(CONTENT_OPS.md §1~§3). 이 파일은 node가 직접 실행하는 검사 스크립트에서도
// 불러오므로 상대 경로 import를 두지 않는다.
import { z } from "zod";

/** A 현장 확인 / B 공식 출처 / C 여행자 보고 */
export const Evidence = z.enum(["A", "B", "C"]);
export type Evidence = z.infer<typeof Evidence>;

/** 최신성 정책이 갈리는 묶음 */
export const ClaimKind = z.enum(["fare", "schedule", "route", "card-rule", "service"]);
export type ClaimKind = z.infer<typeof ClaimKind>;

const IsoDate = z.iso.date();
const Id = z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, "id는 소문자·숫자·점·하이픈만");

export const Source = z.object({
  url: z.url({ protocol: /^https?$/ }),
  title: z.string().min(1),
});

export const Claim = z
  .object({
    id: Id,
    kind: ClaimKind,
    text: z.object({ en: z.string().min(1), ja: z.string().min(1) }),
    evidence: Evidence,
    sources: z.array(Source).min(1, "출처 없는 claim은 넣을 수 없다"),
    verifiedAt: IsoDate,
    verifiedBy: z.string().min(1),
    /**
     * 화면에 크게 쓰는 숫자(요금·분). 문장과 어긋나지 않게 en·ja 문장에 같은 숫자가 있어야 한다
     * (천 단위 쉼표 포함, 예: 13000 → "13,000")
     */
    data: z.record(z.string(), z.number()).optional(),
  })
  .superRefine((claim, ctx) => {
    for (const [key, n] of Object.entries(claim.data ?? {})) {
      const shown = n.toLocaleString("en-US");
      for (const lang of ["en", "ja"] as const) {
        if (!claim.text[lang].includes(shown)) {
          ctx.addIssue({
            code: "custom",
            message: `data.${key}(${shown})가 ${lang} 문장에 없다`,
            path: ["data", key],
          });
        }
      }
    }
  });
export type Claim = z.infer<typeof Claim>;

/** 직원에게 보여 줄 문장. reviewed가 false면 화면에 "초안" 표시를 한다. */
export const Phrase = z.object({
  id: Id,
  ko: z.string().min(1),
  en: z.string().min(1),
  ja: z.string().min(1),
  reviewed: z.boolean(),
});
export type Phrase = z.infer<typeof Phrase>;

/**
 * 외부 링크 레지스트리 항목(ARCHITECTURE.md §4). 화면은 id로만 링크한다.
 * affiliate가 true면 OutLink가 유료 링크 고지를 붙인다.
 */
export const Link = z.object({
  id: Id,
  /** https 페이지, 또는 국가번호부터 쓴 전화(tel:+82…). 누르면 바로 걸린다 */
  url: z.union([z.url({ protocol: /^https$/ }), z.string().regex(/^tel:\+[1-9]\d{5,14}$/)]),
  label: z.object({ en: z.string().min(1), ja: z.string().min(1) }),
  affiliate: z.boolean(),
  checkedAt: IsoDate,
});
export type Link = z.infer<typeof Link>;

const uniqueIds = <T extends { id: string }>(items: T[], ctx: z.RefinementCtx) => {
  const seen = new Set<string>();
  items.forEach((item, i) => {
    if (seen.has(item.id)) {
      ctx.addIssue({ code: "custom", message: `id 중복: ${item.id}`, path: [i, "id"] });
    }
    seen.add(item.id);
  });
};

export const ClaimsFile = z.array(Claim).superRefine(uniqueIds);
export const PhrasesFile = z.array(Phrase).superRefine(uniqueIds);
export const LinksFile = z.array(Link).superRefine(uniqueIds);

/** CONTENT_OPS.md §3: 재검증 주기와 경고 기준(일) */
export const STALENESS_POLICY: Record<ClaimKind, { recheck: number; warn: number }> = {
  fare: { recheck: 30, warn: 60 },
  schedule: { recheck: 30, warn: 60 },
  "card-rule": { recheck: 30, warn: 60 },
  route: { recheck: 90, warn: 180 },
  // 안내 전화·채팅 같은 서비스 정보
  service: { recheck: 30, warn: 60 },
};

export type Staleness = "fresh" | "due" | "stale";

const DAY_MS = 24 * 60 * 60 * 1000;

/** fresh: 주기 안 / due: 재검증할 때(운영 리포트) / stale: 화면에 "Needs recheck" 표시 */
export function staleness(claim: Pick<Claim, "kind" | "verifiedAt">, today: string): Staleness {
  const age = Math.floor((Date.parse(today) - Date.parse(claim.verifiedAt)) / DAY_MS);
  const policy = STALENESS_POLICY[claim.kind];
  if (age > policy.warn) return "stale";
  if (age > policy.recheck) return "due";
  return "fresh";
}
