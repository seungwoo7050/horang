import type { Locale } from "@/i18n";
import { FactGroup } from "./Fact";
import { Figures, type Figure } from "./Figures";
import styles from "./FactSheet.module.css";

/**
 * 사실 한 묶음 = 한 장: 이름 → 요점 숫자 → 문장(구분선) → 근거 한 줄과 접힌 출처.
 * 상자를 사실마다 두지 않는다(DESIGN.md §6-1, Benji 점진적 드러냄·Rauno 위계).
 */
export function FactSheet({
  title,
  sub,
  rows,
  ids,
  folded,
  level = 2,
  lang,
}: {
  title?: string;
  /** 제목 단계(위 섹션 제목이 h2면 3) */
  level?: 2 | 3;
  sub?: string;
  rows?: Figure[];
  ids: readonly string[];
  /** 표가 문장을 다 보여 주는 claim. 문장은 접힌 출처 안에만 둔다 */
  folded?: readonly string[];
  lang: Locale;
}) {
  return (
    <section className={styles.sheet}>
      {title ? (
        <header>
          {level === 2 ? <h2>{title}</h2> : <h3>{title}</h3>}
          {sub ? <p>{sub}</p> : null}
        </header>
      ) : null}
      {rows?.length ? <Figures rows={rows} lang={lang} /> : null}
      <FactGroup ids={ids} folded={folded} lang={lang} />
    </section>
  );
}
