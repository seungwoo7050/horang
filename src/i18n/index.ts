import { en, type Messages } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { ja } from "./ja";
import { ro } from "./ro";
import { zhCN } from "./zh-CN";
import { zhTW } from "./zh-TW";

export const locales = ["en", "ja", "zh-CN", "zh-TW", "fr", "es", "ro"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const messages: Record<Locale, Messages> = {
  en,
  ja,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  fr,
  es,
  ro,
};

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const getMessages = (locale: Locale): Messages => messages[locale];

/** 언어 선택을 브라우저에만 저장할 때 쓰는 키(CLAUDE.md: 설정은 브라우저에만) */
export const LOCALE_STORAGE_KEY = "horang.lang";
/** 손으로 고른 화면 밝기(light·dark). 없으면 기기 설정을 따른다 */
export const THEME_STORAGE_KEY = "horang.theme";

export type { Messages };

/**
 * 첫 진입 언어(브라우저에서 그대로 실행하는 함수 원문, "/" 인라인 스크립트에 들어간다).
 * navigator.languages는 우선순위 목록이라 앞에서부터 보고 지원 언어와 처음 맞는 것을 고른다.
 * 하나도 없으면 기본 언어. 인자: (languages, 지원 언어 목록, 기본 언어)
 */
export const pickLocaleSource = `function(n,s,d){for(var i=0;i<n.length;i++){var t=String(n[i]||"").toLowerCase();if(/^zh\\b/.test(t)){var z=/^zh[-_](tw|hk|mo|hant)\\b/.test(t)?"zh-TW":"zh-CN";if(s.indexOf(z)>=0)return z}var m=/^([a-z]+)\\b/.exec(t);if(m&&s.indexOf(m[1])>=0)return m[1]}return d}`;
