import Link from "next/link";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MorphTitle, Screen } from "@/components/Screen";
import { Boop } from "@/components/Boop";
import { Mascot } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { getMessages, isLocale } from "@/i18n";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

const SITUATIONS = ["gate", "card", "arex", "station", "transit", "dining"] as const;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  return (
    <Screen
      lang={lang}
      aside={
        <span className={cn(styles.tools, "flex items-center gap-1")}>
          <ThemeToggle lang={lang} />
          <LangSwitch current={lang} />
        </span>
      }
      actions={
        <>
          <Button asChild className={cn(styles.staff, "flex-wrap gap-x-2")}>
            <Link href={`/${lang}/staff/`} transitionTypes={["nav-forward"]}>
              <MorphTitle name="staff">
                <span>{t.home.staff}</span>
              </MorphTitle>
              <span lang="ko" className={styles.staffKo}>
                {t.home.staffKo}
              </span>
            </Link>
          </Button>
          <p
            className={cn(
              styles.footer,
              "text-center text-[length:var(--text-xs)] text-[var(--color-muted)]",
            )}
          >
            {t.home.footer}
          </p>
        </>
      }
    >
      <div className={cn(styles.hello, "flex items-center gap-3 pt-2")}>
        <Boop>
          <Mascot className={styles.mascot} />
        </Boop>
        <h1 className={styles.ask}>{t.home.ask}</h1>
      </div>
      <ul
        className={cn(
          styles.list,
          "m-0 list-none p-0 border-b border-solid border-[var(--color-line)]",
        )}
      >
        {SITUATIONS.map((key) => {
          const s = t.home.situations[key];
          return (
            <li key={key} className="border-t border-solid border-[var(--color-line)]">
              <Link
                href={`/${lang}/${key}/`}
                className={cn(
                  styles.situation,
                  "flex items-center gap-3 py-3 no-underline text-inherit",
                )}
                transitionTypes={["nav-forward"]}
              >
                <span className={cn(styles.text, "flex flex-1 flex-col gap-1")}>
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
