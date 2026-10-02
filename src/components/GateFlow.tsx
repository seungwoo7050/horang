"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./flow.module.css";
import { BackButton, BackLink, Screen, ScreenHeader } from "./Screen";
import { StepRibbon } from "./StepRibbon";
import { TigerFace, TigerSitting } from "./Tiger";

export type GateCause = {
  id: string;
  label: string;
  headline: string;
  /** 해결 방법(claim 문장들, 서버에서 그림) */
  help: ReactNode;
  /** 직원에게 보여 줄 문장 카드(서버에서 그림) */
  phrase: ReactNode;
};

type Step = 0 | 1 | 2 | "solved";
type Dir = "forward" | "backward";

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

/** 개찰구 막힘: 원인 고르기 → 해결 → 직원에게 보여 주기(3단계). 급한 화면이라 SponsorSlot 없음 */
export function GateFlow({ lang, causes }: { lang: Locale; causes: GateCause[] }) {
  const t = getMessages(lang);
  const g = t.gate;
  const [step, setStep] = useState(0 as Step);
  const [dir, setDir] = useState("forward" as Dir);
  const [causeId, setCauseId] = useState(null as string | null);
  const cause = causes.find((c) => c.id === causeId);

  const go = (next: Step) => {
    const order = (s: Step) => (s === "solved" ? 3 : s);
    setDir(order(next) >= order(step) ? "forward" : "backward");
    setStep(next);
    window.scrollTo({ top: 0 });
  };

  const home = `/${lang}/`;
  const left =
    step === 0 || step === "solved" ? (
      <BackLink href={home} label={t.common.back} />
    ) : (
      <BackButton onClick={() => go(step === 2 ? 1 : 0)} label={t.common.back} />
    );
  const n = step === "solved" ? 2 : step;

  let body: ReactNode;
  let actions: ReactNode = null;
  if (step === "solved") {
    body = (
      <div className={styles.center}>
        <TigerSitting mood="solved" size={120} />
        <h1 className={styles.heading}>{g.solved}</h1>
      </div>
    );
    actions = (
      <Link href={home} className={styles.primary}>
        {g.home}
      </Link>
    );
  } else if (step === 0 || !cause) {
    body = (
      <>
        <h1 className={styles.heading}>{g.ask}</h1>
        <ul className={styles.options}>
          {causes.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={styles.option}
                aria-pressed={c.id === causeId}
                onClick={() => {
                  setCauseId(c.id);
                  go(1);
                }}
              >
                {c.label}
                <Chevron />
              </button>
            </li>
          ))}
        </ul>
      </>
    );
  } else if (step === 1) {
    body = (
      <>
        <h1 className={styles.heading}>{cause.headline}</h1>
        {cause.help}
        <p className={styles.hint}>
          <TigerFace mood="calm" size={32} />
          {g.calm}
        </p>
      </>
    );
    actions = (
      <div className={styles.row}>
        <button type="button" className={styles.secondary} onClick={() => go(2)}>
          {g.still}
        </button>
        <button type="button" className={styles.primary} onClick={() => go("solved")}>
          {g.worked}
        </button>
      </div>
    );
  } else {
    body = (
      <>
        <h1 className={styles.heading}>{g.staffHead}</h1>
        {cause.phrase}
      </>
    );
    actions = (
      <div className={styles.row}>
        <Link href={`/${lang}/staff/`} className={styles.secondary}>
          {g.moreSentences}
        </Link>
        <button type="button" className={styles.primary} onClick={() => go("solved")}>
          {g.worked}
        </button>
      </div>
    );
  }

  return (
    <Screen lang={lang} header={<ScreenHeader left={left} title={g.title} />} actions={actions}>
      <StepRibbon total={3} current={n} label={t.common.stepOf.replace("{n}", String(n + 1))} />
      <div key={`${step}-${causeId}`} className={`${styles.stage} ${styles[dir]}`}>
        {step === "solved" ? null : (
          <p className={styles.kicker}>{t.common.stepOf.replace("{n}", String(n + 1))}</p>
        )}
        {body}
      </div>
    </Screen>
  );
}
