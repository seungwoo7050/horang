"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./ArexCompare.module.css";
import flow from "./flow.module.css";

export type Terminal = "t1" | "t2";
type Numbers = { expressMin: string; expressFare: string; allstopMin: string; allstopFare: string };

type Props = {
  lang: Locale;
  numbers: Record<Terminal, Numbers>;
  /** 터미널별 근거 줄(서버에서 그림) */
  meta: Record<Terminal, ReactNode>;
  arrive: ReactNode;
  depart: ReactNode;
};

/** 직통/일반 비교. 숫자는 claim의 data에서만 온다. 출국일 모드는 서울역 출발 정보 */
export function ArexCompare({ lang, numbers, meta, arrive, depart }: Props) {
  const t = getMessages(lang).arex;
  const [terminal, setTerminal] = useState("t1" as Terminal);
  const [leaving, setLeaving] = useState(false);
  const n = numbers[terminal];

  if (leaving) {
    return (
      <div className={`${flow.stage} ${flow.forward}`}>
        <h1 className={flow.heading}>{t.departHeading}</h1>
        {depart}
        <button type="button" className={flow.secondary} onClick={() => setLeaving(false)}>
          {t.hurryBack}
        </button>
      </div>
    );
  }

  return (
    <div className={flow.stage}>
      <h1 className={flow.heading}>{t.heading}</h1>
      <div className={styles.seg} role="group" aria-label={t.terminal}>
        {(["t1", "t2"] as const).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={terminal === id}
            onClick={() => setTerminal(id)}
          >
            {t[id]}
          </button>
        ))}
      </div>
      <p className={styles.route}>{t.route.replace("{t}", t[terminal])}</p>
      <div className={styles.compare}>
        <section className={styles.col}>
          <span className={styles.badgeFill}>{t.express}</span>
          <p className={styles.big}>
            {n.expressMin}
            <small>{t.min}</small>
          </p>
          <p className={styles.fare}>{n.expressFare}</p>
          <p className={styles.note}>{t.expressNote}</p>
        </section>
        <section className={styles.col}>
          <span className={styles.badgeLine}>{t.allstop}</span>
          <p className={styles.big}>
            {n.allstopMin}
            <small>{t.min}</small>
          </p>
          <p className={styles.fare}>{n.allstopFare}</p>
          <p className={styles.note}>{t.allstopNote}</p>
        </section>
      </div>
      {meta[terminal]}
      <h2 className={flow.section}>{t.details}</h2>
      {arrive}
      <button type="button" className={flow.primary} onClick={() => setLeaving(true)}>
        {t.hurry}
      </button>
    </div>
  );
}
