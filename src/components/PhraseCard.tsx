import { phrases } from "@/content";
import { getMessages, type Locale } from "@/i18n";
import styles from "./PhraseCard.module.css";

/** 직원에게 보여 줄 한국어 문장(크게, lang="ko")과 현재 언어 번역 */
export function PhraseCard({ id, lang }: { id: string; lang: Locale }) {
  const phrase = phrases.find((p) => p.id === id);
  if (!phrase) throw new Error(`phrase 없음: ${id}`);
  const t = getMessages(lang).phrase;
  return (
    <figure className={styles.card}>
      <blockquote lang="ko" className={styles.ko}>
        {phrase.ko}
      </blockquote>
      <figcaption className={styles.local}>
        {phrase[lang]}
        {phrase.reviewed ? null : <small className={styles.draft}>{t.draft}</small>}
      </figcaption>
    </figure>
  );
}
