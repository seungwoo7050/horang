"use client";

import { useState, type ReactNode } from "react";
import { PHARMACY_SIGN } from "@/content";
import { getMessages, type Locale } from "@/i18n";
import { Scene } from "./Brand";
import styles from "./EmergencyFlow.module.css";
import flow from "./flow.module.css";
import { Screen } from "./Screen";

export type EmergencyNumbers = {
  cutoffHours: string;
  cutoffT2Minutes: string;
  taxMinSpend: string;
  taxInstantMax: string;
};

type Props = {
  lang: Locale;
  numbers: EmergencyNumbers;
  pharmacyFacts: ReactNode;
  pharmacyLinks: ReactNode;
  lostFacts: ReactNode;
  lostLinks: ReactNode;
  departFacts: ReactNode;
  staffPhrases: ReactNode;
};

export function EmergencyFlow({
  lang,
  numbers: n,
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
      <div className={flow.stage}>
        <h1 className={flow.heading}>{t.ask}</h1>
        <div role="group" aria-label={t.modeLabel} className={styles.seg}>
          {(["pharmacy", "lost", "depart"] as const).map((id) => (
            <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>
              {t.modes[id]}
            </button>
          ))}
        </div>

        {mode === "pharmacy" ? (
          <div key="pharmacy" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.pharmacy.summary}</p>

            {/* 한국 약국 간판('약') 상징 배지 콜아웃 */}
            <div className={styles.signCallout}>
              <span lang="ko" className={styles.yakSeal} aria-hidden="true">
                {PHARMACY_SIGN}
              </span>
              <div className={styles.calloutText}>
                <strong>{t.pharmacy.cards.signTitle}</strong>
                <p>{t.pharmacy.cards.signBody}</p>
              </div>
            </div>

            {pharmacyLinks}

            <div className={styles.editorialList}>
              <div className={styles.editorialItem}>
                <strong>{t.pharmacy.cards.callTitle}</strong>
                <p>{t.pharmacy.cards.callBody}</p>
              </div>
            </div>

            {pharmacyFacts}
          </div>
        ) : mode === "lost" ? (
          <div key="lost" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.lost.summary}</p>

            {/* 지하철 승강장 스크린도어 4자리 번호 도해 */}
            <div className={styles.signCallout}>
              <div className={styles.doorBadge} aria-hidden="true">
                <span className={styles.doorTop}>3 - 4</span>
                <span className={styles.doorNum}>2391</span>
              </div>
              <div className={styles.calloutText}>
                <strong>{t.lost.cards.subwayTitle}</strong>
                <p>{t.lost.cards.subwayBody}</p>
              </div>
            </div>

            <div className={styles.editorialList}>
              <div className={styles.editorialItem}>
                <strong>{t.lost.cards.taxiTitle}</strong>
                <p>{t.lost.cards.taxiBody}</p>
              </div>
            </div>

            {lostLinks}
            {lostFacts}
          </div>
        ) : (
          <div key="depart" className={`${flow.stage} ${flow.forward}`}>
            <div className={flow.sceneHead}>
              <p className={flow.body}>{t.depart.summary}</p>
              <Scene name="travel" />
            </div>

            <div className={styles.compare}>
              <section className={styles.col}>
                <span className={styles.badgeFill}>
                  -{n.cutoffHours}:{n.cutoffT2Minutes}
                </span>
                <p className={styles.big}>-{n.cutoffHours}:00</p>
                <p className={styles.sub}>{t.depart.cards.cityAirportTitle}</p>
                <p className={styles.note}>{t.depart.cards.cityAirportBody}</p>
              </section>
              <section className={styles.col}>
                <span className={styles.badgeLine}>
                  {"< "}
                  {n.taxInstantMax}
                </span>
                <p className={styles.big}>{n.taxMinSpend}+</p>
                <p className={styles.sub}>{t.depart.cards.taxRefundTitle}</p>
                <p className={styles.note}>{t.depart.cards.taxRefundBody}</p>
              </section>
            </div>

            {departFacts}
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
