import Link from "next/link";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MorphTitle, Screen } from "@/components/Screen";
import { Boop } from "@/components/Boop";
import { Mascot } from "@/components/Brand";
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
      aside={
        <span className={styles.tools}>
          <ThemeToggle lang={lang} />
          <LangSwitch current={lang} />
        </span>
      }
      actions={
        <>
          <Link href={`/${lang}/staff/`} className={styles.staff} transitionTypes={["nav-forward"]}>
            <MorphTitle name="staff">
              <span>{t.home.staff}</span>
            </MorphTitle>
            <span lang="ko" className={styles.staffKo}>
              {t.home.staffKo}
            </span>
          </Link>
          <p className={styles.footer}>{t.home.footer}</p>
        </>
      }
    >
      <div className={styles.hello}>
        <Boop>
          <Mascot className={styles.mascot} />
        </Boop>
        <h1 className={styles.ask}>{t.home.ask}</h1>
      </div>
      <ul className={styles.list}>
        {SITUATIONS.map((key) => {
          const s = t.home.situations[key];
          return (
            <li key={key}>
              <Link
                href={`/${lang}/${key}/`}
                className={styles.situation}
                transitionTypes={["nav-forward"]}
              >
                <span className={styles.text}>
                  <MorphTitle name={key}>
                    <strong>{s.title}</strong>
                  </MorphTitle>
                  <small>{s.hint}</small>
                </span>
                <svg className={styles.chev} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </Screen>
  );
}
