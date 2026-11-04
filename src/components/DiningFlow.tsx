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

            {/* 키오스크 010 번호 입력 화면 콜아웃(중첩 상자 없이 왼쪽 호박색 리본 강조) */}
            <div className={styles.kioskDisplay}>
              <p className={styles.kioskNumber}>010 - 0000 - 0000</p>
              <p className={styles.kioskTitle}>{t.kiosk.cards.phoneTitle}</p>
              <p className={styles.kioskBody}>{t.kiosk.cards.phoneBody}</p>
            </div>

            <div className={styles.editorialList}>
              <div className={styles.editorialItem}>
                <div className={styles.editorialHead}>
                  <strong>{t.kiosk.cards.cardTitle}</strong>
                </div>
                <p>{t.kiosk.cards.cardBody}</p>
              </div>
            </div>

            {kioskFacts}
          </div>
        ) : (
          <div key="dietary" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.dietary.summary}</p>

            <div className={styles.editorialList}>
              <div className={styles.editorialItem}>
                <div className={styles.editorialHead}>
                  <strong>{t.dietary.cards.brothTitle}</strong>
                </div>
                <p>{t.dietary.cards.brothBody}</p>
              </div>
              <div className={styles.editorialItem}>
                <div className={styles.editorialHead}>
                  <strong>{t.dietary.cards.etiquetteTitle}</strong>
                </div>
                <p>{t.dietary.cards.etiquetteBody}</p>
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
