import type { Metadata } from "next";
import site from "@/content/site.json";
import { getMessages, locales, type Locale } from "@/i18n";

// 공개 주소: src/content/site.json(첫 배포 주소). 빌드 환경변수 SITE_URL이 덮는다(.env.example).
// 화면 코드에 URL을 쓰지 않는 규칙(links.test) 때문에 값은 JSON에 둔다.
export const SITE_URL = (process.env.SITE_URL || site.url).replace(/\/$/, "");

/** 앱의 화면 경로(언어 뒤). "" = 첫 화면 */
export const PAGES = ["", "gate/", "card/", "arex/", "station/", "staff/"] as const;
export type PagePath = (typeof PAGES)[number];

export const pathFor = (lang: Locale, page: PagePath) => `/${lang}/${page}`;

/** 화면마다: 제목, 정규 주소, 언어별 대체 주소(hreflang), 공유 미리보기 기본값 */
export function pageMetadata(lang: Locale, page: PagePath, rawTitle?: string): Metadata {
  const t = getMessages(lang);
  // 화면 문구의 구 경계(U+200B, ja.ts)는 문서 제목·미리보기에 남기지 않는다
  const title = rawTitle?.replaceAll("\u200b", "");
  return {
    metadataBase: new URL(SITE_URL),
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
      // 마스코트·워드마크 그림 하나를 두 언어가 같이 쓴다(scripts/make-og.mts). 제목은 og:title이 보여 준다
      images: [{ url: "/og.png", width: 1200, height: 630, alt: t.meta.description }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/**
 * "/"(언어 선택): 모든 첫 화면의 hreflang x-default가 가리키는 곳이라 되돌아가는 대체 링크와 정규 주소를 둔다.
 * 스크립트가 꺼져 그대로 남아도 제목이 보이게 앱 이름만 쓴다
 */
export function rootMetadata(): Metadata {
  const t = getMessages("en");
  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: "/",
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, pathFor(l, "")])),
        "x-default": "/",
      },
    },
  };
}
