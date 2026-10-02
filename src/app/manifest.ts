import type { MetadataRoute } from "next";
import { en } from "@/i18n/en";

// 홈 화면에 추가했을 때의 모양. 정적 export라 빌드 때 manifest.webmanifest 파일로 나온다.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: en.meta.title,
    short_name: en.meta.title,
    description: en.meta.description,
    start_url: "/",
    display: "standalone",
    // globals.css 다크 bg 토큰과 같은 값
    background_color: "#0e1424",
    theme_color: "#0e1424",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
