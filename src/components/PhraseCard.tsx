import { phrases } from "@/content";
import { getMessages, type Locale } from "@/i18n";
import styles from "./PhraseCard.module.css";

/** 문장 ID에서 실물 패스 일련번호(예: #01 ~ #34) 생성 */
function passSerial(id: string) {
  const idx = phrases.findIndex((p) => p.id === id);
  return `#${String(idx >= 0 ? idx + 1 : 1).padStart(2, "0")}`;
}

/** 직원에게 보여 줄 한국어 문장(크게, lang="ko")과 현재 언어 번역 — 실물 커뮤니케이션 패스(Tactile Pass) */
export function PhraseCard({ id, lang }: { id: string; lang: Locale }) {
  const phrase = phrases.find((p) => p.id === id);
  if (!phrase) throw new Error(`phrase 없음: ${id}`);
  const t = getMessages(lang).phrase;
  const serial = passSerial(id);

  return (
    <figure className={styles.card}>
      <div className={styles.passBar} aria-hidden="true">
        <span className={styles.passDots}>
          <span className={styles.dotPrimary} />
          <span className={styles.dotMuted} />
        </span>
        <span className={styles.serial}>{serial}</span>
      </div>
      <blockquote lang="ko" className={styles.ko}>
        {phrase.ko}
      </blockquote>
      <figcaption className={styles.local}>
        <span className={styles.localText}>{phrase[lang]}</span>
        {phrase.reviewed ? null : <small className={styles.draft}>{t.draft}</small>}
      </figcaption>
    </figure>
  );
}
