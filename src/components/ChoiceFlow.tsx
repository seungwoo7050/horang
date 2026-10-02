"use client";

import type { MouseEvent, ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./flow.module.css";
import { FlowNav } from "./FlowNav";
import { Screen, ScreenHeader } from "./Screen";
import { StepRibbon } from "./StepRibbon";
import { useFlowHistory, type FlowCodec } from "./useFlowHistory";

export type Question = {
  id: string;
  ask: string;
  options: { id: string; label: string; hint?: string }[];
};

type Props = {
  lang: Locale;
  title: string;
  /** 첫 화면 카드와 이어질 이름 */
  morph?: string;
  /** 질문 순서대로. 마지막 단계는 결과 */
  questions: Question[];
  /** 답 id를 "-"로 이은 키 → 결과(서버에서 그림) */
  results: Record<string, ReactNode>;
  resultHeading: string;
  restart: string;
};

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

/** 주소 검색어: ?a=<답1>.<답2> (처음 단계는 "") */
const codecFor = (questions: Question[]): FlowCodec<string[]> => ({
  initial: [],
  encode: (answers) => (answers.length ? `a=${answers.join(".")}` : ""),
  decode: (q) => {
    const answers = (q.get("a") ?? "").split(".").filter(Boolean);
    const valid =
      answers.length <= questions.length &&
      answers.every((id, i) => questions[i]!.options.some((o) => o.id === id));
    return valid ? answers : null;
  },
  order: (answers) => answers.length,
  parent: (answers) => (answers.length ? answers.slice(0, -1) : null),
});

/** 질문 몇 개에 답하면 맞는 결과를 보여 주는 흐름(교통카드 고르기 등) */
export function ChoiceFlow({
  lang,
  title,
  morph,
  questions,
  results,
  resultHeading,
  restart,
}: Props) {
  const t = getMessages(lang);
  const { state: answers, dir, push, back } = useFlowHistory(codecFor(questions));
  const step = answers.length;
  const total = questions.length + 1;
  const done = step >= questions.length;

  const choose = (id: string, e: MouseEvent) => {
    if (push([...answers, id], e)) window.scrollTo({ top: 0 });
  };

  const left = (
    <FlowNav
      mode={step === 0 ? "close" : "back"}
      home={`/${lang}/`}
      onBack={back}
      label={step === 0 ? t.common.close : t.common.back}
    />
  );
  const stepLabel = t.common.stepOf.replace("{n}", String(step + 1));
  const q = questions[step];

  return (
    <Screen
      lang={lang}
      header={<ScreenHeader left={left} title={title} morph={morph} />}
      actionsFlow={done}
      actions={
        done ? (
          <button type="button" className={styles.secondary} onClick={(e) => push([], e)}>
            {restart}
          </button>
        ) : null
      }
    >
      <StepRibbon total={total} current={step} label={stepLabel} />
      <div key={answers.join("-")} className={`${styles.stage} ${styles[dir]}`}>
        <p className={styles.kicker}>{stepLabel}</p>
        {done || !q ? (
          <>
            <h1 className={styles.heading}>{resultHeading}</h1>
            {results[answers.join("-")]}
          </>
        ) : (
          <>
            <h1 className={styles.heading}>{q.ask}</h1>
            <ul className={styles.options}>
              {q.options.map((o) => (
                <li key={o.id}>
                  <button type="button" className={styles.option} onClick={(e) => choose(o.id, e)}>
                    <span className={styles.optionText}>
                      {o.label}
                      {o.hint ? <small>{o.hint}</small> : null}
                    </span>
                    <Chevron />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Screen>
  );
}
