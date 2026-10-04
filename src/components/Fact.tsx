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

/**
 * 여러 claim의 근거를 한 줄로(가장 약한 등급, 가장 오래된 검증일).
 * compact: 펼치면 사실마다 전체 근거가 나오는 접힌 출처(FactGroup)의 머리 줄. 등급 글자와 날짜만 보이고
 * 등급 이름("Official source")은 스크린 리더에만 준다 — 한 화면에 같은 말이 카드 수만큼 되풀이되지 않게
 */
export function FactMeta({
  ids,
  lang,
  compact = false,
}: {
  ids: string[];
  lang: Locale;
  compact?: boolean;
}) {
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
      {compact ? (
        <span className={styles.hidden}>{t.evidence[weakest]} · </span>
      ) : (
        <>{t.evidence[weakest]} · </>
      )}
      {t.checked.replace("{date}", formatDay(oldest, lang))}
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

/** claim 여러 개를 카드 목록으로 */
export function FactList({ ids, lang }: { ids: readonly string[]; lang: Locale }) {
  return (
    <ul className={styles.list}>
      {ids.map((id) => (
        <li key={id}>
          <Fact id={id} lang={lang} />
        </li>
      ))}
    </ul>
  );
}

/**
 * 한 묶음(카드 하나 등)의 사실을 한 장에: 문장은 구분선으로만 나누고, 근거는 한 줄로 모은다.
 * 숫자 표가 이미 다 보여 준 claim(folded)은 문장을 접어 둔다. 접힌 곳에서 모든 원문과 출처를 볼 수 있다.
 */
export function FactGroup({
  ids,
  folded = [],
  lang,
}: {
  ids: readonly string[];
  folded?: readonly string[];
  lang: Locale;
}) {
  const t = getMessages(lang).fact;
  const shown = ids.filter((id) => !folded.includes(id));
  return (
    <>
      {shown.length ? (
        <ul className={styles.group}>
          {shown.map((id) => (
            <li key={id}>{getClaim(id).text[lang]}</li>
          ))}
        </ul>
      ) : null}
      <details className={styles.sources}>
        <summary>
          <FactMeta ids={[...ids]} lang={lang} compact />
          <span className={styles.open}>
            <span className={styles.hidden}>{t.sources.replace("{n}", String(ids.length))}</span>
          </span>
        </summary>
        <ul className={styles.full}>
          {ids.map((id) => (
            <li key={id}>
              <Fact id={id} lang={lang} />
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
