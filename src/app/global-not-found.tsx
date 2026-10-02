import type { Metadata } from "next";
import { Mascot } from "@/components/Brand";
import { getMessages, locales } from "@/i18n";
import { appIcons, appViewport } from "./app-head";
import styles from "./not-found.module.css";
import "./globals.css";

// 없는 주소 전체에 쓰는 404(정적 export의 404.html). 주소로 언어를 알 수 없어 두 언어를 함께 쓰고,
// 원인보다 다음 행동(첫 화면으로)을 먼저 둔다(DESIGN.md §6-1). 스크립트 없이 기기 밝기를 따른다.
export const metadata: Metadata = {
  title: `${getMessages("en").notFound.title} · Horang`,
  robots: { index: false },
  icons: appIcons,
};
export const viewport = appViewport;

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className={styles.page}>
          <Mascot className={styles.mascot} />
          {locales.map((lang) => {
            const t = getMessages(lang).notFound;
            return (
              <section key={lang} lang={lang} className={styles.block}>
                {lang === "en" ? <h1>{t.title}</h1> : <h2>{t.title}</h2>}
                <p>{t.body}</p>
                <a href={`/${lang}/`} className={styles.go}>
                  {t.go}
                </a>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
}
