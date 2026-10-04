"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./ArexCompare.module.css";
import flow from "./flow.module.css";
import { Scene } from "./Brand";
import { NextTrain, type TrainRow } from "./NextTrain";

export type Terminal = "t1" | "t2";
type Numbers = { expressMin: string; expressFare: string; allstopMin: string; allstopFare: string };

type Props = {
  lang: Locale;
  numbers: Record<Terminal, Numbers>;
  /** 터미널별 근거 줄(서버에서 그림) */
  meta: Record<Terminal, ReactNode>;
  arrive: ReactNode;
  /** 직통으로 서울역에 내린 뒤(서버에서 그림) */
  atSeoul: ReactNode;
  depart: ReactNode;
  /** 공식 직통 시각표: 공항→서울역(터미널별 출발), 서울역→공항(터미널별 도착) */
  trains: { toSeoul: Record<Terminal, TrainRow[]>; toAirport: Record<Terminal, TrainRow[]> };
  /** 다음 열차 근거 줄(서버에서 그림) */
  trainMeta: { toSeoul: ReactNode; toAirport: ReactNode };
};

/** 직통/일반 비교. 숫자는 claim의 data에서만 온다. 출국일 모드는 서울역 출발 정보 */
export function ArexCompare({
  lang,
  numbers,
  meta,
  arrive,
  atSeoul,
  depart,
  trains,
  trainMeta,
}: Props) {
  const t = getMessages(lang).arex;
  const [terminal, setTerminal] = useState("t1" as Terminal);
  const [leaving, setLeaving] = useState(false);
  const n = numbers[terminal];
  // 비교 ↔ 서울역 출발은 다른 화면이다: 누른 버튼(맨 아래) 자리에 머물지 않고 새 화면 처음부터 보인다
  const switchTo = (next: boolean) => {
    setLeaving(next);
    window.scrollTo({ top: 0 });
  };

  if (leaving) {
    return (
      <div className={`${flow.stage} ${flow.forward}`}>
        <div className={flow.sceneHead}>
          <h1 className={flow.heading}>{t.departHeading}</h1>
          <Scene name="travel" />
        </div>
        <NextTrain
          lang={lang}
          rows={trains.toAirport[terminal]}
          from={t.next.seoul}
          to={t[terminal]}
          meta={trainMeta.toAirport}
        />
        {depart}
        <button type="button" className={flow.secondary} onClick={() => switchTo(false)}>
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
      <NextTrain
        lang={lang}
        rows={trains.toSeoul[terminal]}
        from={t[terminal]}
        to={t.next.seoul}
        meta={trainMeta.toSeoul}
      />
      <h2 className={flow.section}>{t.details}</h2>
      {arrive}
      <h2 className={flow.section}>{t.atSeoul}</h2>
      {atSeoul}
      <button type="button" className={flow.primary} onClick={() => switchTo(true)}>
        {t.hurry}
      </button>
    </div>
  );
}
