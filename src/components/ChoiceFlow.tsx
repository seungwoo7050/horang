"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./flow.module.css";
import { FlowNav } from "./FlowNav";
import { Screen, ScreenHeader } from "./Screen";
import { StepRibbon } from "./StepRibbon";

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
  const [answers, setAnswers] = useState([] as string[]);
  const [dir, setDir] = useState("forward" as "forward" | "backward");
  const step = answers.length;
  const total = questions.length + 1;
  const done = step >= questions.length;

  const choose = (id: string) => {
    setDir("forward");
    setAnswers([...answers, id]);
    window.scrollTo({ top: 0 });
  };
  const back = () => {
    setDir("backward");
    setAnswers(answers.slice(0, -1));
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
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              setDir("backward");
              setAnswers([]);
            }}
          >
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
                  <button type="button" className={styles.option} onClick={() => choose(o.id)}>
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
