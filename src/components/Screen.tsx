import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import { BrandLettering } from "./Brand";
import { NavIcon } from "./NavIcon";
import styles from "./Screen.module.css";

/** 왼쪽 위 닫기(첫 화면으로). 단계 없는 화면용 — 흐름 화면은 FlowNav */
export function CloseLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(styles.back, "grid place-items-center rounded-[var(--radius-pill)]")}
      aria-label={label}
      transitionTypes={["nav-back"]}
    >
      <NavIcon mode="close" />
    </Link>
  );
}

/** 첫 화면에서 누른 카드 제목이 이 화면 제목으로 이어진다(같은 이름끼리 모핑, DESIGN.md §6-1 연속성) */
export function MorphTitle({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={`title-${name}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

export function ScreenHeader({
  left,
  title,
  morph,
  aside,
}: {
  left: ReactNode;
  title?: string;
  /** 첫 화면 카드와 이어질 이름(gate·card·arex·station·staff) */
  morph?: string;
  aside?: ReactNode;
}) {
  const titleEl = title ? (
    <span className={cn(styles.title, "text-center font-bold text-[length:var(--text-base)]")}>
      {title}
    </span>
  ) : null;
  return (
    // 화면 전환 때 헤더는 제자리(globals.css의 screen-header). CSS Modules가 이름을 바꾸지 않게 인라인으로 둔다
    <header
      className={cn(styles.header, "items-center")}
      style={{ viewTransitionName: "screen-header" }}
    >
      {left}
      {titleEl && morph ? <MorphTitle name={morph}>{titleEl}</MorphTitle> : titleEl}
      <span className={cn(styles.aside, "justify-self-end whitespace-nowrap")}>{aside}</span>
    </header>
  );
}

/** 엄지 닿는 아래쪽 동작(DESIGN.md §6-1) */
export function Actions({ children, flow = false }: { children: ReactNode; flow?: boolean }) {
  return (
    <div
      className={cn(
        styles.actions,
        "flex flex-col gap-3 pt-3 bg-[var(--color-bg)]",
        flow && styles.flow,
      )}
    >
      {children}
    </div>
  );
}

const SLIDE = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

type Props = {
  lang: Locale;
  title?: string;
  /** 첫 화면 카드와 이어질 이름 */
  morph?: string;
  /** 닫기(첫 화면으로) 링크. 없으면 앱 이름(워드마크) */
  back?: string;
  aside?: ReactNode;
  /** 기본 헤더 대신(흐름 화면이 단계에 따라 뒤로 가기를 바꿀 때) */
  header?: ReactNode;
  actions?: ReactNode;
  /** 긴 읽을거리(결과) 아래에서는 동작 줄을 고정하지 않고 글 끝에 둔다 */
  actionsFlow?: boolean;
  children: ReactNode;
};

/** 한 화면 한 상황: 위 헤더, 가운데 내용, 아래 동작 (모바일·태블릿·데스크톱 중심 정렬 컨테이너) */
export function Screen({
  lang,
  title,
  morph,
  back,
  aside,
  header,
  actions,
  actionsFlow,
  children,
}: Props) {
  const t = getMessages(lang);
  const left = back ? (
    <CloseLink href={back} label={t.common.close} />
  ) : (
    <BrandLettering kind="wordmark" alt={t.meta.title} className={styles.brand} />
  );
  // 앞으로 가면 화면이 오른쪽에서, 뒤로 가면 왼쪽에서 들어온다. 헤더는 이름이 따로 있어 제자리(DESIGN.md §6-1)
  return (
    <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
      <div className={cn(styles.screen, "mx-auto flex w-full max-w-[480px] flex-col gap-5")}>
        {header ?? (
          <ScreenHeader left={left} title={back ? title : undefined} morph={morph} aside={aside} />
        )}
        <main className={cn(styles.main, "flex flex-1 flex-col gap-4")}>{children}</main>
        {actions ? <Actions flow={actionsFlow}>{actions}</Actions> : null}
      </div>
    </ViewTransition>
  );
}
