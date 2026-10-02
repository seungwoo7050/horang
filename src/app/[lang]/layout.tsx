import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, THEME_STORAGE_KEY } from "@/i18n";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import { appIcons, appViewport } from "../app-head";
import { pageMetadata } from "../seo";
import "../globals.css";

export const viewport = appViewport;

// 손으로 고른 밝기를 첫 그림 전에 붙인다(깜빡임 방지). CSP 해시는 postbuild가 넣는다
const applyTheme = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

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
      </body>
    </html>
  );
}
