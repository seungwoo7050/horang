import type { Metadata } from "next";
import { getMessages, locales, type Locale } from "@/i18n";

// 공개 주소. 도메인은 사용자 결정 전이라(Q-DOMAIN) 빌드 환경변수로만 받는다(.env.example).
// 없으면 절대 주소가 필요한 사이트맵은 비우고, 언어 대체 링크는 상대 주소로 둔다.
export const SITE_URL = process.env.SITE_URL?.replace(/\/$/, "") || undefined;

/** 앱의 화면 경로(언어 뒤). "" = 첫 화면 */
export const PAGES = ["", "gate/", "card/", "arex/", "station/", "staff/"] as const;
export type PagePath = (typeof PAGES)[number];

export const pathFor = (lang: Locale, page: PagePath) => `/${lang}/${page}`;

/** 화면마다: 제목, 정규 주소, 언어별 대체 주소(hreflang), 공유 미리보기 기본값 */
export function pageMetadata(lang: Locale, page: PagePath, title?: string): Metadata {
  const t = getMessages(lang);
  return {
    ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
    title: title ? `${title} · ${t.meta.title}` : t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: pathFor(lang, page),
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, pathFor(l, page)])),
        "x-default": page === "" ? "/" : pathFor("en", page),
      },
    },
    openGraph: {
      type: "website",
      siteName: t.meta.title,
      title: title ?? t.meta.title,
      description: t.meta.description,
      locale: lang === "ja" ? "ja_JP" : "en_US",
    },
  };
}
