"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./flow.module.css";
import { MorphLabel } from "./MorphLabel";
import { FlowNav } from "./FlowNav";
import { Screen, ScreenHeader } from "./Screen";
import { StepRibbon } from "./StepRibbon";
import { HelpPanel } from "./HelpPanel";
import { PhraseShow } from "./PhraseShow";
import { TigerFace, TigerSitting } from "./Tiger";
import { useFlowHistory, type FlowCodec } from "./useFlowHistory";

export type GateCause = {
  id: string;
  label: string;
  headline: string;
  /** 해결 방법(claim 문장들, 서버에서 그림) */
  help: ReactNode;
  /** 직원에게 보여 줄 문장 카드(서버에서 그림)와 화면 가득 보기에 쓸 한국어·번역 */
  phrase: ReactNode;
  phraseKo: string;
  phraseLabel: string;
};

type Step = 0 | 1 | 2 | "solved";
type State = { step: Step; cause: string | null };

const STEPS: Record<string, Step> = { "1": 1, "2": 2, solved: "solved" };
const order = (s: State) => (s.step === "solved" ? 3 : s.step);

/** 주소 검색어: ?cause=<원인>&step=1|2|solved (처음 단계는 고른 원인만 남길 수 있다) */
const codecFor = (causes: GateCause[]): FlowCodec<State> => ({
  initial: { step: 0, cause: null },
  encode: (s) =>
    s.cause === null
      ? ""
      : s.step === 0
        ? `cause=${s.cause}`
        : `cause=${s.cause}&step=${String(s.step)}`,
  decode: (q) => {
    const cause = q.get("cause");
    if (!cause || !causes.some((c) => c.id === cause)) return null;
    const step = q.get("step");
    if (step === null) return { step: 0, cause };
    return step in STEPS ? { step: STEPS[step]!, cause } : null;
  },
  order,
  parent: (s) => (s.step === 2 ? { ...s, step: 1 } : s.step === 1 ? { ...s, step: 0 } : null),
});

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

/** 개찰구 막힘: 원인 고르기 → 해결 → 직원에게 보여 주기(3단계). 급한 화면이라 SponsorSlot 없음 */
export function GateFlow({ lang, causes }: { lang: Locale; causes: GateCause[] }) {
  const t = getMessages(lang);
  const g = t.gate;
  const { state, dir, push, back, holdLink } = useFlowHistory(codecFor(causes));
  const { step, cause: causeId } = state;
  const cause = causes.find((c) => c.id === causeId);

  const go = (next: Step) => (e: MouseEvent) => {
    if (push({ step: next, cause: causeId }, e)) window.scrollTo({ top: 0 });
  };

  const home = `/${lang}/`;
  const leaving = step === 0 || step === "solved";
  const left = (
    <FlowNav
      mode={leaving ? "close" : "back"}
      home={home}
      onBack={back}
      label={leaving ? t.common.close : t.common.back}
    />
  );
  const n = step === "solved" ? 2 : step;

  let body: ReactNode;
  let actions: ReactNode = null;
  if (step === "solved") {
    body = (
      <div className={styles.center}>
        <TigerSitting mood="solved" size={120} celebrate />
        <h1 className={styles.heading}>{g.solved}</h1>
      </div>
    );
    actions = (
      <Link href={home} className={styles.primary} onClick={holdLink}>
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
                onClick={(e) => {
                  if (push({ step: 1, cause: c.id }, e, { step: 0, cause: c.id }))
                    window.scrollTo({ top: 0 });
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
    // 원인을 고르기 전에도 바로 직원에게: 고르기 어려운 사람이 막힌 채 남지 않게(첫 화면 아래 버튼과 같은 이름)
    actions = (
      <Link
        href={`/${lang}/staff/`}
        className={`${styles.secondary} ${styles.staffLink}`}
        onClick={holdLink}
      >
        <span>{t.home.staff}</span>
        <span lang="ko" className={styles.staffKo}>
          {t.home.staffKo}
        </span>
      </Link>
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
        <button type="button" className={styles.secondary} onClick={go(2)}>
          <MorphLabel>{g.still}</MorphLabel>
        </button>
        <button type="button" className={styles.primary} onClick={go("solved")}>
          <MorphLabel>{g.worked}</MorphLabel>
        </button>
      </div>
    );
  } else {
    body = (
      <>
        <HelpPanel>{g.staffHead}</HelpPanel>
        <PhraseShow
          card={cause.phrase}
          ko={cause.phraseKo}
          label={cause.phraseLabel}
          showLabel={t.staff.show}
          closeLabel={t.common.close}
        />
      </>
    );
    actions = (
      <div className={styles.row}>
        <Link href={`/${lang}/staff/`} className={styles.secondary} onClick={holdLink}>
          <MorphLabel>{g.moreSentences}</MorphLabel>
        </Link>
        <button type="button" className={styles.primary} onClick={go("solved")}>
          <MorphLabel>{g.worked}</MorphLabel>
        </button>
      </div>
    );
  }

  return (
    <Screen
      lang={lang}
      header={<ScreenHeader left={left} title={g.title} morph="gate" />}
      actions={actions}
    >
      <StepRibbon total={3} current={n} label={t.common.stepOf.replace("{n}", String(n + 1))} />
      <div key={`${step}-${causeId}`} className={`${styles.stage} ${styles[dir]}`}>
        {body}
      </div>
    </Screen>
  );
}
