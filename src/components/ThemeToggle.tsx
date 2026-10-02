"use client";

import { useEffect, useState } from "react";
import { getMessages, THEME_STORAGE_KEY, type Locale } from "@/i18n";
import { syncThemeColor } from "./ThemeColor";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

const systemTheme = (): Theme =>
  matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

/**
 * 해/달 버튼: 기본은 기기 설정을 따르고, 누르면 반대 밝기로 바꿔 브라우저에만 저장한다.
 * 고른 값이 기기 설정과 같아지면 저장을 지워 다시 기기 설정을 따른다. 해와 달은 같은 원이 모양을 바꿔 이어진다
 */
export function ThemeToggle({ lang }: { lang: Locale }) {
  const t = getMessages(lang).theme;
  const [theme, setTheme] = useState(null as Theme | null);

  useEffect(() => {
    const read = () => {
      const chosen = document.documentElement.dataset.theme;
      setTheme(chosen === "light" || chosen === "dark" ? chosen : systemTheme());
    };
    read();
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const follow = next === systemTheme();
    try {
      if (follow) {
        delete root.dataset.theme;
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        root.dataset.theme = next;
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch {
      // 저장이 막힌 브라우저에서는 이번 화면에만 반영한다
      root.dataset.theme = next;
    }
    setTheme(next);
    syncThemeColor(root.dataset.theme === next ? next : null);
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={theme === "dark" ? t.toLight : t.toDark}
      data-theme-icon={theme ?? undefined}
      // 밝기를 알기 전(첫 그림)에는 자리만 차지하고 숨긴다
      style={theme === null ? { visibility: "hidden" } : undefined}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <mask id="theme-moon">
          <rect width="24" height="24" fill="white" />
          <circle className={styles.bite} cx="12" cy="12" r="7" fill="black" />
        </mask>
        <circle className={styles.disc} cx="12" cy="12" r="5" mask="url(#theme-moon)" />
        <g className={styles.rays}>
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
