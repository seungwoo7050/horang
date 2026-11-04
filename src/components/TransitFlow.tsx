"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import styles from "./flow.module.css";
import { Screen } from "./Screen";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  lang: Locale;
  busFacts: ReactNode;
  taxiFacts: ReactNode;
  driverPhrases: ReactNode;
  helpline: ReactNode;
};

export function TransitFlow({ lang, busFacts, taxiFacts, driverPhrases, helpline }: Props) {
  const t = getMessages(lang).transit;
  const [mode, setMode] = useState<"bus" | "taxi">("bus");

  return (
    <Screen lang={lang} back={`/${lang}/`} title={t.title} morph="transit">
      <div className="flex flex-col gap-4">
        <h1 className={styles.heading}>{t.ask}</h1>
        <div role="group" aria-label={t.modeLabel} className="grid grid-cols-2 gap-2">
          {(["bus", "taxi"] as const).map((m) => {
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

        {mode === "bus" ? (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.bus.headline}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className={styles.body}>{t.bus.summary}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.bus.cards.tapBothTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.bus.cards.tapBothBody}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.bus.cards.transferTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.bus.cards.transferBody}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <section className="flex flex-col gap-2">
              <h2 className={styles.section}>{t.bus.factsHead}</h2>
              {busFacts}
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.taxi.headline}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className={styles.body}>{t.taxi.summary}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.taxi.cards.standardTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.taxi.cards.standardBody}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.taxi.cards.deluxeTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.taxi.cards.deluxeBody}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <section className="flex flex-col gap-2">
              <h2 className={styles.section}>{t.taxi.factsHead}</h2>
              {taxiFacts}
            </section>
          </div>
        )}

        <section className="flex flex-col gap-3 border-t border-solid border-[var(--color-line)] pt-4">
          <h2 className={styles.section}>{t.driverHead}</h2>
          <p className={styles.note}>{t.driverSub}</p>
          {driverPhrases}
        </section>

        {helpline}
      </div>
    </Screen>
  );
}
