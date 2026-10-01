import Link from "next/link";
import type { ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./Screen.module.css";

type Props = {
  lang: Locale;
  /** 화면 제목(헤더 가운데). 없으면 앱 이름 */
  title?: string;
  /** 왼쪽 위 뒤로 가기 링크. 없으면 앱 이름을 보여 준다 */
  back?: string;
  /** 헤더 오른쪽(언어 전환 등) */
  aside?: ReactNode;
  /** 엄지 닿는 아래쪽 동작(DESIGN.md §6-1) */
  actions?: ReactNode;
  children: ReactNode;
};

/** 한 화면 한 상황: 위 헤더, 가운데 내용, 아래 동작 */
export function Screen({ lang, title, back, aside, actions, children }: Props) {
  const t = getMessages(lang);
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        {back ? (
          <Link href={back} className={styles.back} aria-label={t.common.back}>
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
        ) : (
          <span className={styles.brand}>{t.meta.title}</span>
        )}
        {back && title ? <span className={styles.title}>{title}</span> : null}
        <span className={styles.aside}>{aside}</span>
      </header>
      <main className={styles.main}>{children}</main>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
