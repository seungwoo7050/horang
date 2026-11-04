"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import styles from "./flow.module.css";
import { Screen } from "./Screen";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  lang: Locale;
  pharmacyFacts: ReactNode;
  pharmacyLinks: ReactNode;
  lostFacts: ReactNode;
  lostLinks: ReactNode;
  departFacts: ReactNode;
  staffPhrases: ReactNode;
};

export function EmergencyFlow({
  lang,
  pharmacyFacts,
  pharmacyLinks,
  lostFacts,
  lostLinks,
  departFacts,
  staffPhrases,
}: Props) {
  const t = getMessages(lang).emergency;
  const [mode, setMode] = useState<"pharmacy" | "lost" | "depart">("pharmacy");

  return (
    <Screen lang={lang} back={`/${lang}/`} title={t.title} morph="emergency">
      <div className="flex flex-col gap-4">
        <h1 className={styles.heading}>{t.ask}</h1>
        <div role="group" aria-label={t.modeLabel} className="grid grid-cols-3 gap-2">
          {(["pharmacy", "lost", "depart"] as const).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={active}
                onClick={() => setMode(m)}
                className={cn(
                  "min-h-11 cursor-pointer rounded-[var(--radius-md)] border border-solid px-2 py-2 text-[length:var(--text-sm)] font-semibold transition-colors",
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

        {mode === "pharmacy" ? (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.pharmacy.headline}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className={styles.body}>{t.pharmacy.summary}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.pharmacy.cards.signTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.pharmacy.cards.signBody}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.pharmacy.cards.callTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.pharmacy.cards.callBody}
                    </p>
                  </div>
                </div>
                {pharmacyLinks}
              </CardContent>
            </Card>
            <section className="flex flex-col gap-2">
              <h2 className={styles.section}>{t.pharmacy.factsHead}</h2>
              {pharmacyFacts}
            </section>
          </div>
        ) : mode === "lost" ? (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.lost.headline}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className={styles.body}>{t.lost.summary}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.lost.cards.subwayTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.lost.cards.subwayBody}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.lost.cards.taxiTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.lost.cards.taxiBody}
                    </p>
                  </div>
                </div>
                {lostLinks}
              </CardContent>
            </Card>
            <section className="flex flex-col gap-2">
              <h2 className={styles.section}>{t.lost.factsHead}</h2>
              {lostFacts}
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.depart.headline}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className={styles.body}>{t.depart.summary}</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.depart.cards.cityAirportTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.depart.cards.cityAirportBody}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-solid border-[var(--color-line)] p-3">
                    <strong className="block text-[length:var(--text-sm)]">
                      {t.depart.cards.taxRefundTitle}
                    </strong>
                    <p className="mt-1 m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {t.depart.cards.taxRefundBody}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <section className="flex flex-col gap-2">
              <h2 className={styles.section}>{t.depart.factsHead}</h2>
              {departFacts}
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
