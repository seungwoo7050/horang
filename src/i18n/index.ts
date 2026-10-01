import { en, type Messages } from "./en";
import { ja } from "./ja";

export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const messages: Record<Locale, Messages> = { en, ja };

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const getMessages = (locale: Locale): Messages => messages[locale];

/** 언어 선택을 브라우저에만 저장할 때 쓰는 키(CLAUDE.md: 설정은 브라우저에만) */
export const LOCALE_STORAGE_KEY = "horang.lang";

export type { Messages };
