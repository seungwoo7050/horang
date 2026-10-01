import { getClaim } from "@/content";
import { staleness, type Claim } from "@/content/schema";
import { getMessages, type Locale } from "@/i18n";
import styles from "./Fact.module.css";

// 화면의 모든 사실은 claim id로만 낸다(CLAUDE.md 정확성). 옆에 등급·검증일을 작게 붙인다.
// 최신성은 정적 빌드 시점 기준이다(빌드를 자주 돌린다는 전제, V0-3에서 다시 본다).

const today = () => new Date().toISOString().slice(0, 10);

export function formatDay(iso: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

/** 여러 claim의 근거를 한 줄로(가장 약한 등급, 가장 오래된 검증일) */
export function FactMeta({ ids, lang }: { ids: string[]; lang: Locale }) {
  const t = getMessages(lang).fact;
  const list = ids.map(getClaim);
  const weakest = list
    .map((c) => c.evidence)
    .sort()
    .at(-1) as Claim["evidence"];
  const oldest = list.map((c) => c.verifiedAt).sort()[0]!;
  const stale = list.some((c) => staleness(c, today()) === "stale");
  return (
    <span className={styles.meta} data-evidence={weakest}>
      <span className={styles.grade}>{weakest}</span>
      {t.evidence[weakest]} · {t.checked.replace("{date}", formatDay(oldest, lang))}
      {stale ? <strong className={styles.stale}> · {t.stale}</strong> : null}
    </span>
  );
}

/** claim 문장 하나와 근거 줄 */
export function Fact({ id, lang }: { id: string; lang: Locale }) {
  return (
    <p className={styles.fact}>
      {getClaim(id).text[lang]} <FactMeta ids={[id]} lang={lang} />
    </p>
  );
}

/** 현장(A등급)에서 확인하지 않은 경로·위치 표시 */
export function NotOnSite({ ids, lang }: { ids: string[]; lang: Locale }) {
  if (ids.every((id) => getClaim(id).evidence === "A")) return null;
  return <p className={styles.notOnSite}>{getMessages(lang).fact.notOnSite}</p>;
}
