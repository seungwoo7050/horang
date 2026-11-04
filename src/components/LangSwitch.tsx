"use client";

import { useEffect, useRef, useState } from "react";
import { getMessages, LOCALE_STORAGE_KEY, locales, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import styles from "./LangSwitch.module.css";

/** 7개 지원 언어를 고르고 선택을 브라우저에만 저장하는 접근성 준수 드롭다운 선택기 */
export function LangSwitch({ current }: { current: Locale }) {
  const t = getMessages(current);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const remember = (lang: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, lang);
    } catch {
      // 저장이 막힌 브라우저에서는 이번 이동만 반영한다
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <nav ref={navRef} aria-label={t.langSwitch.label} className={styles.nav}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={t.langSwitch.label}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          styles.trigger,
          "border border-solid border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink)]",
        )}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.globe}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span lang={current}>{t.langName}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true" className={styles.chev}>
          <path d="M5 7.5L10 12.5L15 7.5" />
        </svg>
      </button>
      {open ? (
        <ul
          className={cn(
            styles.menu,
            "border border-solid border-[var(--color-line)] bg-[var(--color-surface)]",
          )}
        >
          {locales.map((lang) => {
            const active = lang === current;
            return (
              <li key={lang}>
                <a
                  href={`/${lang}/`}
                  hrefLang={lang}
                  lang={lang}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    remember(lang);
                    setOpen(false);
                  }}
                  className={cn(
                    styles.item,
                    active
                      ? "border border-solid border-[var(--color-ribbon)] bg-[var(--color-ribbon-fill)] font-bold text-[var(--color-on-ribbon)]"
                      : "border border-solid border-transparent text-[var(--color-ink)]",
                  )}
                >
                  <span>{getMessages(lang).langName}</span>
                  {active ? (
                    <svg viewBox="0 0 20 20" aria-hidden="true" className={styles.check}>
                      <path d="M4.5 10.5L8.2 14.2L15.5 6.8" />
                    </svg>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </nav>
  );
}
