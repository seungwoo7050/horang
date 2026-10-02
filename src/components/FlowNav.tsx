"use client";

import { useRouter } from "next/navigation";
import { useEffect, type MouseEvent } from "react";
import { NavIcon, type NavMode } from "./NavIcon";
import styles from "./Screen.module.css";

/**
 * 흐름 화면의 왼쪽 위 버튼. 단계가 바뀌어도 같은 버튼이 남아 아이콘만 ×↔‹로 바뀐다.
 * close면 첫 화면으로(뒤로 가는 방향 전환), back이면 같은 화면의 이전 단계로.
 */
export function FlowNav({
  mode,
  home,
  onBack,
  label,
}: {
  mode: NavMode;
  home: string;
  onBack: (e: MouseEvent) => void;
  label: string;
}) {
  const router = useRouter();
  useEffect(() => router.prefetch(home), [router, home]);
  return (
    <button
      type="button"
      className={styles.back}
      aria-label={label}
      onClick={(e) =>
        mode === "close" ? router.push(home, { transitionTypes: ["nav-back"] }) : onBack(e)
      }
    >
      <NavIcon mode={mode} />
    </button>
  );
}
