import Link from "next/link";
import type { ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./Screen.module.css";

const Chevron = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

/** 왼쪽 위 뒤로 가기(링크) */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={styles.back} aria-label={label}>
      <Chevron />
    </Link>
  );
}

/** 왼쪽 위 뒤로 가기(같은 화면 안 이전 단계) */
export function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className={styles.back} aria-label={label}>
      <Chevron />
    </button>
  );
}

export function ScreenHeader({
  left,
  title,
  aside,
}: {
  left: ReactNode;
  title?: string;
  aside?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      {left}
      {title ? <span className={styles.title}>{title}</span> : null}
      <span className={styles.aside}>{aside}</span>
    </header>
  );
}

/** 엄지 닿는 아래쪽 동작(DESIGN.md §6-1) */
export function Actions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}

type Props = {
  lang: Locale;
  title?: string;
  /** 뒤로 가기 링크. 없으면 앱 이름 */
  back?: string;
  aside?: ReactNode;
  /** 기본 헤더 대신(흐름 화면이 단계에 따라 뒤로 가기를 바꿀 때) */
  header?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

/** 한 화면 한 상황: 위 헤더, 가운데 내용, 아래 동작 */
export function Screen({ lang, title, back, aside, header, actions, children }: Props) {
  const t = getMessages(lang);
  const left = back ? (
    <BackLink href={back} label={t.common.back} />
  ) : (
    <span className={styles.brand}>{t.meta.title}</span>
  );
  return (
    <div className={styles.screen}>
      {header ?? <ScreenHeader left={left} title={back ? title : undefined} aside={aside} />}
      <main className={styles.main}>{children}</main>
      {actions ? <Actions>{actions}</Actions> : null}
    </div>
  );
}
