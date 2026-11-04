"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import flow from "./flow.module.css";
import { Screen } from "./Screen";
import styles from "./TransitFlow.module.css";

export type TransitNumbers = {
  busBase: string;
  penaltyMax: string;
  transferMin: string;
  nightMin: string;
  maxTransfers: string;
  taxiStandard: string;
  taxiDeluxe: string;
};

type Props = {
  lang: Locale;
  numbers: TransitNumbers;
  busFacts: ReactNode;
  taxiFacts: ReactNode;
  driverPhrases: ReactNode;
  helpline: ReactNode;
};

export function TransitFlow({
  lang,
  numbers: n,
  busFacts,
  taxiFacts,
  driverPhrases,
  helpline,
}: Props) {
  const m = getMessages(lang);
  const t = m.transit;
  const [mode, setMode] = useState<"bus" | "taxi">("bus");

  return (
    <Screen lang={lang} back={`/${lang}/`} title={t.title} morph="transit">
      <div className={flow.stage}>
        <h1 className={flow.heading}>{t.ask}</h1>
        <div role="group" aria-label={t.modeLabel} className={styles.seg}>
          {(["bus", "taxi"] as const).map((id) => (
            <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>
              {t.modes[id]}
            </button>
          ))}
        </div>

        {mode === "bus" ? (
          <div key="bus" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.bus.summary}</p>

            {/* 서울 버스 측면 단면 + 앞문 승차(1) → 환승 유지 리본 → 뒷문 하차(2) 도해 */}
            <svg className={styles.diagram} viewBox="0 0 320 92" aria-hidden="true">
              <rect className={styles.busBody} x="8" y="8" width="304" height="68" rx="16" />
              <path className={styles.busStripeBlue} d="M 24 14 H 156" />
              <path className={styles.busStripeGreen} d="M 164 14 H 296" />
              <rect className={styles.busDoor} x="44" y="20" width="40" height="48" rx="6" />
              <rect className={styles.busDoor} x="236" y="20" width="40" height="48" rx="6" />
              <circle className={styles.busWheel} cx="88" cy="76" r="7" />
              <circle className={styles.busWheel} cx="232" cy="76" r="7" />
              <path className={styles.ribbonTrack} d="M 64 42 H 256" />
              <path className={styles.ribbonLine} d="M 64 42 H 256" />
              <g className={styles.nodeDone}>
                <circle cx="64" cy="42" r="12" />
                <text x="64" y="42">
                  1
                </text>
              </g>
              <g className={styles.nodeDone}>
                <circle cx="256" cy="42" r="12" />
                <text x="256" y="42">
                  2
                </text>
              </g>
              <text className={styles.diagramTag} x="64" y="65">
                {n.busBase}
              </text>
              <text className={styles.diagramSub} x="160" y="31">
                {n.transferMin} {m.arex.min} · ×{n.maxTransfers}
              </text>
              <text className={styles.diagramTag} x="256" y="65">
                +{n.penaltyMax}
              </text>
            </svg>

            <div className={styles.compare}>
              <section className={`${styles.col} ${styles.colPrimary}`}>
                <span className={styles.badgeFill}>1 → 2</span>
                <p className={styles.big}>{n.busBase}</p>
                <p className={styles.sub}>{t.bus.cards.tapBothTitle}</p>
                <p className={styles.note}>{t.bus.cards.tapBothBody}</p>
              </section>
              <section className={`${styles.col} ${styles.colSecondary}`}>
                <span className={styles.badgeLine}>×{n.maxTransfers}</span>
                <p className={styles.big}>
                  {n.transferMin}
                  <small>{m.arex.min}</small>
                </p>
                <p className={styles.sub}>{t.bus.cards.transferTitle}</p>
                <p className={styles.note}>{t.bus.cards.transferBody}</p>
              </section>
            </div>

            {busFacts}
          </div>
        ) : (
          <div key="taxi" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.taxi.summary}</p>

            <div className={styles.compare}>
              <section className={`${styles.col} ${styles.colPrimary}`}>
                <div className={styles.taxiHead}>
                  <span className={styles.badgeFill}>22:00–04:00 +20~40%</span>
                  <svg className={styles.taxiIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 11l2-5h10l2 5M3 11h18v6H3zM6 17v2M18 17v2M9 6V4h6v2" />
                  </svg>
                </div>
                <p className={styles.big}>{n.taxiStandard}</p>
                <p className={styles.sub}>{t.taxi.cards.standardTitle}</p>
                <p className={styles.note}>{t.taxi.cards.standardBody}</p>
              </section>
              <section className={`${styles.col} ${styles.colSecondary}`}>
                <div className={styles.taxiHead}>
                  <span className={styles.badgeLine}>22:00–04:00 +0%</span>
                  <svg className={styles.taxiIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 11l2-5h12l2 5M2 11h20v6H2zM6 17v2M18 17v2M9 6V4h6v2" />
                  </svg>
                </div>
                <p className={styles.big}>{n.taxiDeluxe}</p>
                <p className={styles.sub}>{t.taxi.cards.deluxeTitle}</p>
                <p className={styles.note}>{t.taxi.cards.deluxeBody}</p>
              </section>
            </div>

            {taxiFacts}
          </div>
        )}

        <section className={styles.divider}>
          <h2 className={flow.section}>{t.driverHead}</h2>
          <p className={flow.note}>{t.driverSub}</p>
          {driverPhrases}
        </section>

        {helpline}
      </div>
    </Screen>
  );
}
