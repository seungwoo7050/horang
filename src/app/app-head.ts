import type { Metadata, Viewport } from "next";

// 두 루트 레이아웃(/와 /[lang]/)이 같이 쓰는 머리 정보: 아이콘과 주소창 색(globals.css bg 토큰 값)
export const appIcons: Metadata["icons"] = {
  icon: "/icons/icon.svg",
  apple: "/icons/apple-touch-icon.png",
};

export const appViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e1424" },
    { media: "(prefers-color-scheme: light)", color: "#f6f4ee" },
  ],
};
