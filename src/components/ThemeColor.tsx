"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { THEME_BG } from "@/app/app-head";

type Theme = keyof typeof THEME_BG;

/**
 * 주소창 색(theme-color). 기기 밝기별 meta 둘(Next가 관리)은 그대로 두고, 고른 밝기가 있으면
 * 그보다 앞에 media 없는 meta 하나를 둔다(브라우저는 맞는 것 중 첫 meta를 쓴다. 첫 그림 스크립트와 같은 방식).
 * 기기 설정을 따르면 지운다
 */
export function syncThemeColor(chosen: Theme | null) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-chosen]');
  if (chosen === null) return meta?.remove();
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.setAttribute("data-chosen", "");
    document.head.prepend(meta);
  }
  meta.content = THEME_BG[chosen];
}

/** 앱 안에서 화면을 옮기면 Next가 머리(head)를 다시 그리며 위 meta가 빠진다: 화면마다 다시 맞춘다 */
export function ThemeColorSync() {
  const pathname = usePathname();
  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    syncThemeColor(t === "light" || t === "dark" ? t : null);
  }, [pathname]);
  return null;
}
