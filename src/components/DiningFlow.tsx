"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import styles from "./flow.module.css";
import { Screen } from "./Screen";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  lang: Locale;
  kioskFacts: ReactNode;
  dietaryFacts: ReactNode;
  staffPhrases: ReactNode;
};

export function DiningFlow({ lang, kioskFacts, dietaryFacts, staffPhrases }: Props) {
  const t = getMessages(lang).dining;
  const [mode, setMode] = useState<"kiosk" | "dietary">("kiosk");

  return (
    <Screen lang={lang} back={`/${lang}/`} title={t.title} morph="dining">
      <div className="flex flex-col gap-4">
        <h1 className={styles.heading}>{t.ask}</h1>
        <div role="group" aria-label={t.modeLabel} className="grid grid-cols-2 gap-2">
          {(["kiosk", "dietary"] as const).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={active}
                onClick={() => setMode(m)}
                className={cn(
                  "min-h-11 cursor-pointer rounded-[var(--radius-md)] border border-solid px-3 py-2 text-[length:var(--text-sm)] font-semibold transition-colors",
                  active
                    ? "border-[var(--color-ribbon)] bg-[var(--color-ribbon-fill)] text-[var(--color-on-ribbon)]"
                    : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                )}
              >
                {t.modes[m]}
              </button>
            );
          })}
        </div>

        {mode === "kiosk" ? (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.kiosk.headline}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className={styles.body}>{t.kiosk.summary}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.kiosk.cards.phoneTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.kiosk.cards.phoneBody}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.kiosk.cards.cardTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.kiosk.cards.cardBody}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <section className="flex flex-col gap-2">
              <h2 className={styles.section}>{t.kiosk.factsHead}</h2>
              {kioskFacts}
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.dietary.headline}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className={styles.body}>{t.dietary.summary}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.dietary.cards.brothTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.dietary.cards.brothBody}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.dietary.cards.etiquetteTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.dietary.cards.etiquetteBody}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <section className="flex flex-col gap-2">
              <h2 className={styles.section}>{t.dietary.factsHead}</h2>
              {dietaryFacts}
            </section>
          </div>
        )}

        <section className="flex flex-col gap-3 border-t border-solid border-[var(--color-line)] pt-4">
          <h2 className={styles.section}>{t.staffHead}</h2>
          <p className={styles.note}>{t.staffSub}</p>
          {staffPhrases}
        </section>
      </div>
    </Screen>
  );
}
