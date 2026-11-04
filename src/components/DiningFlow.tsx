"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./DiningFlow.module.css";
import flow from "./flow.module.css";
import { Screen } from "./Screen";

type Props = {
  lang: Locale;
  kioskFacts: ReactNode;
  dietaryFacts: ReactNode;
  staffPhrases: ReactNode;
};

export function DiningFlow({ lang, kioskFacts, dietaryFacts, staffPhrases }: Props) {
  const m = getMessages(lang);
  const t = m.dining;
  const [mode, setMode] = useState<"kiosk" | "dietary">("kiosk");

  return (
    <Screen lang={lang} back={`/${lang}/`} title={t.title} morph="dining">
      <div className={flow.stage}>
        <h1 className={flow.heading}>{t.ask}</h1>
        <div role="group" aria-label={t.modeLabel} className={styles.seg}>
          {(["kiosk", "dietary"] as const).map((id) => (
            <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>
              {t.modes[id]}
            </button>
          ))}
        </div>

        {mode === "kiosk" ? (
          <div key="kiosk" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.kiosk.summary}</p>

            {/* 키오스크 010 번호 입력 터치스크린 모사 UI */}
            <div className={styles.kioskDisplay}>
              <div className={styles.kioskBezel} aria-hidden="true">
                <span className={styles.bezelDots}>
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.bezelStep}>01</span>
              </div>
              <div className={styles.kioskScreen}>
                <p className={styles.kioskNumber}>010 - 0000 - 0000</p>
                <span className={styles.kioskEnter} aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <path d="M4 10.5l4 4L16 6.5" />
                  </svg>
                </span>
              </div>
              <p className={styles.kioskTitle}>{t.kiosk.cards.phoneTitle}</p>
              <p className={styles.kioskBody}>{t.kiosk.cards.phoneBody}</p>
            </div>

            <div className={styles.editorialList}>
              <div className={styles.editorialItem}>
                <span className={styles.editorialIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2.5" />
                    <path d="M3 10h18M7 14h3" />
                  </svg>
                  <small>02</small>
                </span>
                <div className={styles.editorialContent}>
                  <div className={styles.editorialHead}>
                    <strong>{t.kiosk.cards.cardTitle}</strong>
                  </div>
                  <p>{t.kiosk.cards.cardBody}</p>
                </div>
              </div>
            </div>

            {kioskFacts}
          </div>
        ) : (
          <div key="dietary" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.dietary.summary}</p>

            <div className={styles.editorialList}>
              <div className={styles.editorialItem}>
                <span className={styles.editorialIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 11h16a8 8 0 0 1-16 0zM8 19h8M9 7c0-1.5 1-2 1-3M15 7c0-1.5 1-2 1-3" />
                  </svg>
                  <small>01</small>
                </span>
                <div className={styles.editorialContent}>
                  <div className={styles.editorialHead}>
                    <strong>{t.dietary.cards.brothTitle}</strong>
                  </div>
                  <p>{t.dietary.cards.brothBody}</p>
                </div>
              </div>
              <div className={styles.editorialItem}>
                <span className={styles.editorialIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 16H6a6 6 0 0 1 12 0zM4 16h16M12 7v3M10 7h4" />
                  </svg>
                  <small>02</small>
                </span>
                <div className={styles.editorialContent}>
                  <div className={styles.editorialHead}>
                    <strong>{t.dietary.cards.etiquetteTitle}</strong>
                  </div>
                  <p>{t.dietary.cards.etiquetteBody}</p>
                </div>
              </div>
            </div>

            {dietaryFacts}
          </div>
        )}

        <section className={styles.divider}>
          <h2 className={flow.section}>{t.staffHead}</h2>
          <p className={flow.note}>{t.staffSub}</p>
          {staffPhrases}
        </section>
      </div>
    </Screen>
  );
}
