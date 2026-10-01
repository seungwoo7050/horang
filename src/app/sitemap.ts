import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { PAGES, pathFor, SITE_URL } from "./seo";

export const dynamic = "force-static";

/** 언어별 화면 목록. SITE_URL이 없으면(도메인 미정) 빈 사이트맵 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return [];
  return PAGES.flatMap((page) =>
    locales.map((lang) => ({
      url: SITE_URL + pathFor(lang, page),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, SITE_URL + pathFor(l, page)])),
      },
    })),
  );
}
