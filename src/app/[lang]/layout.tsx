import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, THEME_STORAGE_KEY } from "@/i18n";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import { ThemeColorSync } from "@/components/ThemeColor";
import { appIcons, appViewport, THEME_BG } from "../app-head";
import { pageMetadata } from "../seo";
import "../globals.css";

export const viewport = appViewport;

// 손으로 고른 밝기를 첫 그림 전에 붙인다(깜빡임 방지). 주소창 색도 그 밝기로: 기기 밝기별 theme-color meta(Next가 관리)는
// 건드리지 않고 그보다 앞에 media 없는 meta를 하나 둔다(브라우저는 맞는 것 중 첫 meta를 쓴다). CSP 해시는 postbuild가 넣는다
const applyTheme = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;var m=document.createElement("meta");m.name="theme-color";m.content=${JSON.stringify(THEME_BG)}[t];m.setAttribute("data-chosen","");document.head.prepend(m)}}catch(e){}`;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { ...pageMetadata(lang, ""), icons: appIcons };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    // data-theme은 위 스크립트가 붙이므로 React가 모르는 속성이다
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: applyTheme }} />
      </head>
      <body>
        {children}
        <RegisterServiceWorker />
        <ThemeColorSync />
      </body>
    </html>
  );
}
