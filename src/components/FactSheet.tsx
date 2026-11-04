import type { ReactNode } from "react";
import type { Locale } from "@/i18n";
import { FactGroup } from "./Fact";
import { Figures, type Figure } from "./Figures";
import styles from "./FactSheet.module.css";

/**
 * 사실 한 묶음 = 에디토리얼 시트:
 * 헤더(선택적 배지/아이콘 + 제목 + 부제) → 티켓 요금 매트릭스(Figures) → 구조화된 규칙(FactGroup) → 검증 스탬프.
 */
export function FactSheet({
  title,
  sub,
  badge,
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
  /** 카드·도메인 시각 배지(선택) */
  badge?: ReactNode;
  rows?: Figure[];
  ids: readonly string[];
  /** 표가 문장을 다 보여 주는 claim. 문장은 접힌 출처 안에만 둔다 */
  folded?: readonly string[];
  lang: Locale;
}) {
  return (
    <section className={styles.sheet}>
      {title ? (
        <header className={styles.header}>
          <div className={styles.titleRow}>
            {level === 2 ? <h2>{title}</h2> : <h3>{title}</h3>}
            {badge ? <span className={styles.badgeWrap}>{badge}</span> : null}
          </div>
          {sub ? <p>{sub}</p> : null}
        </header>
      ) : null}
      {rows?.length ? <Figures rows={rows} lang={lang} /> : null}
      <FactGroup ids={ids} folded={folded} lang={lang} />
    </section>
  );
}
