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
                <span className={styles.editorialIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <small>119</small>
                </span>
                <div className={styles.editorialContent}>
                  <strong>{t.pharmacy.cards.callTitle}</strong>
                  <p>{t.pharmacy.cards.callBody}</p>
                </div>
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
                <span className={styles.editorialIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6" />
                  </svg>
                  <small>02</small>
                </span>
                <div className={styles.editorialContent}>
                  <strong>{t.lost.cards.taxiTitle}</strong>
                  <p>{t.lost.cards.taxiBody}</p>
                </div>
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

            {/* 서울역 B2 도심공항터미널 3단계(탑승수속 1 → 수하물 2 → 출국심사 3) 타임라인 도해 */}
            <svg className={styles.departDiagram} viewBox="0 0 320 68" aria-hidden="true">
              <rect className={styles.departBox} x="8" y="8" width="304" height="52" rx="14" />
              <path className={styles.departLine} d="M 56 28 H 264" />
              <g className={styles.departNode}>
                <circle cx="56" cy="28" r="10" />
                <text x="56" y="28">
                  1
                </text>
              </g>
              <g className={styles.departNode}>
                <circle cx="160" cy="28" r="10" />
                <text x="160" y="28">
                  2
                </text>
              </g>
              <g className={styles.departNode}>
                <circle cx="264" cy="28" r="10" />
                <text x="264" y="28">
                  3
                </text>
              </g>
              <text className={styles.departTag} x="56" y="50">
                -{n.cutoffHours}:{n.cutoffT2Minutes}
              </text>
              <text className={styles.departTag} x="160" y="50">
                -{n.cutoffHours}:00
              </text>
              <text className={styles.departTag} x="264" y="50">
                {n.taxMinSpend}+
              </text>
            </svg>

            <div className={styles.compare}>
              <section className={`${styles.col} ${styles.colPrimary}`}>
                <span className={styles.badgeFill}>
                  -{n.cutoffHours}:{n.cutoffT2Minutes}
                </span>
                <p className={styles.big}>-{n.cutoffHours}:00</p>
                <p className={styles.sub}>{t.depart.cards.cityAirportTitle}</p>
                <p className={styles.note}>{t.depart.cards.cityAirportBody}</p>
              </section>
              <section className={`${styles.col} ${styles.colSecondary}`}>
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
