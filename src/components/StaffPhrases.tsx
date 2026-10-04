"use client";

import { useState, type ReactNode } from "react";
import styles from "./flow.module.css";
import { PhraseShow } from "./PhraseShow";

type Props = {
  /** 문장 id → 카드(서버에서 그림) */
  cards: Record<string, ReactNode>;
  /** 고를 문장 목록(현재 언어 번역을 이름으로, ko는 크게 보여 줄 한국어) */
  options: { id: string; label: string; ko: string }[];
  initial: string;
  othersLabel: string;
  /** 카드를 화면 가득 키우는 버튼 이름 */
  showLabel: string;
  closeLabel: string;
  /** 크게 보기 아래에 붙는 "가리켜 주세요"(한국어와 현재 언어 번역) */
  reply: { ko: string; label: string };
};

/**
 * 직원에게 보여 줄 문장: 위에 크게 한 장(누르면 화면 가득, PhraseShow), 아래에서 다른 문장 고르기.
 * 급한 화면이라 SponsorSlot 없음
 */
export function StaffPhrases({
  cards,
  options,
  initial,
  othersLabel,
  showLabel,
  closeLabel,
  reply,
}: Props) {
  const [current, setCurrent] = useState(initial);
  const phrase = options.find((o) => o.id === current)!;
  return (
    <>
      <div key={current} className={`${styles.stage} ${styles.forward}`}>
        <PhraseShow
          card={cards[current]}
          ko={phrase.ko}
          label={phrase.label}
          showLabel={showLabel}
          closeLabel={closeLabel}
          reply={reply}
        />
      </div>
      <h2 className={styles.section}>{othersLabel}</h2>
      <ul className={styles.options}>
        {options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              className={`${styles.option} ${styles.fromContent}`}
              aria-pressed={o.id === current}
              onClick={() => {
                setCurrent(o.id);
                window.scrollTo({ top: 0 });
              }}
            >
              {o.label}
              {o.id === current ? (
                <svg className={styles.check} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
