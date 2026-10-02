"use client";

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
  }
  // 맞는 것 중 첫 meta가 쓰이므로 theme-color 가운데 맨 앞에 있어야 한다(이미 맨 앞이면 옮기지 않는다)
  if (document.querySelector('meta[name="theme-color"]') !== meta) document.head.prepend(meta);
  if (meta.content !== THEME_BG[chosen]) meta.content = THEME_BG[chosen];
}

/**
 * 앱 안에서 화면을 옮기면 Next가 머리(head)를 다시 그리며 위 meta를 뺀다. 화면이 바뀐 뒤(effect)에 다시 넣으면
 * 그 사이 프레임들(수 ms~수백 ms)은 주소창이 기기 밝기 색이 된다. 머리가 바뀌는 즉시(그리기 전, 마이크로태스크) 다시 맞춘다
 */
export function ThemeColorSync() {
  useEffect(() => {
    const sync = () => {
      const t = document.documentElement.dataset.theme;
      syncThemeColor(t === "light" || t === "dark" ? t : null);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
