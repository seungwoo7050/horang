"use client";

import { getMessages, LOCALE_STORAGE_KEY, locales, type Locale } from "@/i18n";

/** 언어를 바꾸고 선택을 브라우저에만 저장한다 */
export function LangSwitch({ current }: { current: Locale }) {
  const t = getMessages(current);
  const remember = (lang: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, lang);
    } catch {
      // 저장이 막힌 브라우저에서는 이번 이동만 반영한다
    }
  };
  return (
    <nav aria-label={t.langSwitch.label}>
      {locales.map((lang) => (
        <a
          key={lang}
          href={`/${lang}/`}
          hrefLang={lang}
          lang={lang}
          aria-current={lang === current ? "page" : undefined}
          onClick={() => remember(lang)}
        >
          {getMessages(lang).langName}
        </a>
      ))}
    </nav>
  );
}
