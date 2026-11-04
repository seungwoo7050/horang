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

const SITUATIONS = [
  { key: "gate", code: "!", tier: "urgent" },
  { key: "arex", code: "01", tier: "bento" },
  { key: "card", code: "02", tier: "bento" },
  { key: "station", code: "03", tier: "wide" },
  { key: "transit", code: "04", tier: "wide" },
  { key: "dining", code: "05", tier: "bento" },
  { key: "emergency", code: "06", tier: "bento" },
] as const;

type SituationKey = (typeof SITUATIONS)[number]["key"];

function SituationIcon({ name }: { name: SituationKey }) {
  switch (name) {
    case "gate":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5v14M20 5v14M4 9h5l3 3-3 3H4M20 9h-5l-3 3 3 3h5" />
        </svg>
      );
    case "arex":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="3" width="14" height="15" rx="3" />
          <path d="M5 11h14M9 15h.01M15 15h.01M8 18l-2 3M16 18l2 3" />
        </svg>
      );
    case "card":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M3 10h18M7 14h3" />
        </svg>
      );
    case "station":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2.5" />
          <path d="M9 14l3-3 3 3M12 11v6M8 8h8" />
        </svg>
      );
    case "transit":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="13" rx="2.5" />
          <path d="M4 11h16M8 17v3M16 17v3M8 14h.01M16 14h.01" />
        </svg>
      );
    case "dining":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="3" width="14" height="18" rx="2.5" />
          <path d="M9 7h6M9 11h6M9 15h3" />
        </svg>
      );
    case "emergency":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
  }
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  return (
    <Screen
      lang={lang}
      actionsFlow
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
              <span className={styles.staffIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2M8 12h8" />
                </svg>
              </span>
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
      <div className={styles.hello}>
        <Boop>
          <Mascot className={styles.mascot} />
        </Boop>
        <h1 className={styles.ask}>{t.home.ask}</h1>
      </div>
      <ul className={styles.list}>
        {SITUATIONS.map(({ key, code, tier }) => {
          const s = t.home.situations[key];
          return (
            <li
              key={key}
              className={
                tier === "urgent"
                  ? styles.itemUrgent
                  : tier === "bento"
                    ? styles.itemBento
                    : styles.itemWide
              }
            >
              <Link
                href={`/${lang}/${key}/`}
                className={styles.situation}
                transitionTypes={["nav-forward"]}
              >
                <span className={styles.cardTop}>
                  <span className={styles.iconBox}>
                    <SituationIcon name={key} />
                  </span>
                  <span className={styles.codeBadge} aria-hidden="true">
                    {code}
                  </span>
                </span>
                <span className={styles.text}>
                  <MorphTitle name={key}>
                    <strong>{s.title}</strong>
                  </MorphTitle>
                  <small>{s.hint}</small>
                </span>
                <span className={styles.chevWrap} aria-hidden="true">
                  <svg className={styles.chev} viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Screen>
  );
}
