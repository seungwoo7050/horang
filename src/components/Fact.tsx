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

/** claim 종류별 도메인 픽토그램 */
function KindIcon({ kind }: { kind: Claim["kind"] }) {
  switch (kind) {
    case "fare":
      return (
        <svg className={styles.kindSvg} viewBox="0 0 20 20" aria-hidden="true">
          <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
          <path d="M2.5 8.5h15M6 12.5h3" />
        </svg>
      );
    case "schedule":
      return (
        <svg className={styles.kindSvg} viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="7" />
          <path d="M10 6v4l2.8 1.8" />
        </svg>
      );
    case "card-rule":
      return (
        <svg className={styles.kindSvg} viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3" y="4" width="14" height="12" rx="2" />
          <path d="M6.5 8.5h3v3h-3zM12 10h2.5" />
        </svg>
      );
    case "route":
      return (
        <svg className={styles.kindSvg} viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="5" cy="14" r="2" />
          <circle cx="15" cy="6" r="2" />
          <path d="M6.8 12.6L13.2 7.4" />
        </svg>
      );
    case "service":
      return (
        <svg className={styles.kindSvg} viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 3l2.1 4.3 4.7.7-3.4 3.3.8 4.7L10 13.8 5.8 16l.8-4.7L3.2 8l4.7-.7L10 3z" />
        </svg>
      );
  }
}

/**
 * claim 본문에서 시각적으로 먼저 스캔할 핵심 수치·시각·층수·전화를 최대 3개까지 추출해 배지로 보여 준다.
 * 원문 문장은 그대로 두고 위에 요약 칩만 얹어 위키 줄글 인상을 걷어낸다.
 */
function extractChips(text: string): string[] {
  const matches =
    text.match(
      /010-\d{4}-\d{4}|₩\d+(?:,\d{3})*|\b\d{1,2}:\d{2}\b|\b(?:B[1-7]|[1-3]F)\b|\b(?:119|1330|QR)\b|\b\d+(?:\.\d+)?%/g,
    ) ?? [];
  const unique: string[] = [];
  for (const m of matches) {
    if (!unique.includes(m)) unique.push(m);
    if (unique.length >= 3) break;
  }
  return unique;
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
  const claim = getClaim(id);
  return (
    <p className={styles.fact}>
      {claim.text[lang]} <FactMeta ids={[id]} lang={lang} />
    </p>
  );
}

/** 현장(A등급)에서 확인하지 않은 경로·위치 표시 */
export function NotOnSite({ ids, lang }: { ids: string[]; lang: Locale }) {
  if (ids.every((id) => getClaim(id).evidence === "A")) return null;
  return <p className={styles.notOnSite}>{getMessages(lang).fact.notOnSite}</p>;
}

/** claim 여러 개를 에디토리얼 스텝 목록으로 */
export function FactList({ ids, lang }: { ids: readonly string[]; lang: Locale }) {
  return (
    <ul className={styles.list}>
      {ids.map((id, idx) => {
        const claim = getClaim(id);
        const text = claim.text[lang];
        const chips = extractChips(text);
        return (
          <li key={id} className={styles.itemRow}>
            <span className={styles.stepBadge} aria-hidden="true">
              <KindIcon kind={claim.kind} />
              <small>{String(idx + 1).padStart(2, "0")}</small>
            </span>
            <div className={styles.itemBody}>
              {chips.length ? (
                <div className={styles.chipRow} aria-hidden="true">
                  {chips.map((chip) => (
                    <span key={chip} className={styles.specChip}>
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
              <Fact id={id} lang={lang} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * 한 묶음(카드 하나 등)의 사실을 에디토리얼 보드에:
 * 각 사실은 도메인 아이콘·번호 배지·핵심 수치 칩과 함께 구조화해 줄글 설명서 느낌을 없애고,
 * 근거는 하단 스탬프 바(details.sources)에 모은다.
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
          {shown.map((id, idx) => {
            const claim = getClaim(id);
            const text = claim.text[lang];
            const chips = extractChips(text);
            return (
              <li key={id} className={styles.itemRow}>
                <span className={styles.stepBadge} aria-hidden="true">
                  <KindIcon kind={claim.kind} />
                  <small>{String(idx + 1).padStart(2, "0")}</small>
                </span>
                <div className={styles.itemBody}>
                  {chips.length ? (
                    <div className={styles.chipRow} aria-hidden="true">
                      {chips.map((chip) => (
                        <span key={chip} className={styles.specChip}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className={styles.claimText}>{text}</p>
                </div>
              </li>
            );
          })}
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
