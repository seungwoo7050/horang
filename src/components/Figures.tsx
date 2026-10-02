import { getClaim } from "@/content";
import type { Locale } from "@/i18n";
import { getMessages } from "@/i18n";
import styles from "./Figures.module.css";

export type Figure = {
  /** 줄 이름(i18n 문구) */
  label: string;
  /** 숫자를 가져올 claim과 data 키. 숫자는 claim 밖에서 만들지 않는다 */
  claim: string;
  key: string;
  /** 숫자 모양(i18n, {n} 자리). 없으면 원화 기본 모양 */
  format?: string;
};

/** claim의 data 숫자를 이름-값 표로(요점 먼저, DESIGN.md §6-1 점진적 드러냄) */
export function Figures({ rows, lang }: { rows: Figure[]; lang: Locale }) {
  const won = getMessages(lang).arex.won;
  return (
    <dl className={styles.figures}>
      {rows.map((r) => {
        const n = getClaim(r.claim).data?.[r.key];
        if (n === undefined) throw new Error(`data 없음: ${r.claim}.${r.key}`);
        return (
          <div key={`${r.claim}.${r.key}`} className={styles.row}>
            <dt>{r.label}</dt>
            <dd>{(r.format ?? won).replace("{n}", n.toLocaleString("en-US"))}</dd>
          </div>
        );
      })}
    </dl>
  );
}
