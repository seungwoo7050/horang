import Link from "next/link";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { Screen } from "@/components/Screen";
import { TigerSitting } from "@/components/Tiger";
import { getMessages, isLocale } from "@/i18n";
import styles from "./home.module.css";

const SITUATIONS = ["gate", "card", "arex", "station"] as const;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  return (
    <Screen
      lang={lang}
      aside={<LangSwitch current={lang} />}
      actions={
        <>
          <Link href={`/${lang}/staff/`} className={styles.staff}>
            {t.home.staff}
            <span lang="ko" className={styles.staffKo}>
              {t.home.staffKo}
            </span>
          </Link>
          <p className={styles.footer}>{t.home.footer}</p>
        </>
      }
    >
      <div className={styles.hello}>
        <TigerSitting mood="hi" size={104} />
        <h1 className={styles.ask}>{t.home.ask}</h1>
      </div>
      <p className={styles.sub}>{t.home.sub}</p>
      <ol className={styles.list}>
        {SITUATIONS.map((key, i) => {
          const s = t.home.situations[key];
          return (
            <li key={key}>
              <Link href={`/${lang}/${key}/`} className={styles.situation}>
                <span className={styles.num} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={styles.text}>
                  <strong>{s.title}</strong>
                  <small>{s.hint}</small>
                </span>
                <svg className={styles.chev} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ol>
    </Screen>
  );
}
