import type { Metadata, Viewport } from "next";

// 두 루트 레이아웃(/와 /[lang]/)이 같이 쓰는 머리 정보: 아이콘과 주소창 색(globals.css bg 토큰 값)
export const appIcons: Metadata["icons"] = {
  icon: "/icons/icon.svg",
  apple: "/icons/apple-touch-icon.png",
};

/** 밝기별 화면 배경(globals.css --color-bg와 같은 값). 주소창 색 */
export const THEME_BG = { dark: "#0b1020", light: "#f5f3ee" } as const;

export const appViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: THEME_BG.dark },
    { media: "(prefers-color-scheme: light)", color: THEME_BG.light },
  ],
};
