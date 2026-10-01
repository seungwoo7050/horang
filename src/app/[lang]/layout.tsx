import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale, locales } from "@/i18n";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import { appIcons, appViewport } from "../app-head";
import "../globals.css";

export const viewport = appViewport;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getMessages(lang);
  return { title: t.meta.title, description: t.meta.description, icons: appIcons };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang}>
      <body>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
