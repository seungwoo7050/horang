"use client";

import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import styles from "./DiningFlow.module.css";
import flow from "./flow.module.css";
import phraseStyles from "./PhraseCard.module.css";
import { PhraseShow } from "./PhraseShow";
import { Screen } from "./Screen";

export type DiningPhraseOption = {
  id: string;
  label: string;
  ko: string;
  reviewed: boolean;
};

type Props = {
  lang: Locale;
  kioskFacts: ReactNode;
  dietaryFacts: ReactNode;
  options: DiningPhraseOption[];
  reply: { ko: string; label: string };
};

export function DiningFlow({ lang, kioskFacts, dietaryFacts, options, reply }: Props) {
  const m = getMessages(lang);
  const t = m.dining;
  const [mode, setMode] = useState<"kiosk" | "dietary">("kiosk");
  const [selectedIds, setSelectedIds] = useState<string[]>([
    options[0]?.id ?? "dining.kiosk-stuck",
  ]);

  const activeList = options.filter((o) => selectedIds.includes(o.id));
  const currentList = activeList.length > 0 ? activeList : [options[0]!];
  const combinedKo = currentList.map((o) => o.ko).join(" ");
  const combinedLabel = currentList.map((o) => o.label).join(" / ");
  const allReviewed = currentList.every((o) => o.reviewed);

  const toggleChip = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter((x) => x !== id) : prev;
      }
      // 키오스크 문장이 단독 선택된 상태에서 식이제한 칩을 누르면 식이제한 조합으로 전환
      const withoutKiosk = prev.filter(
        (x) => x !== "dining.kiosk-stuck" && x !== "dining.no-korean-phone",
      );
      return [...withoutKiosk, id];
    });
  };

  const selectSingle = (id: string) => {
    setSelectedIds([id]);
  };

  const dietaryChips = options.filter(
    (o) => o.id !== "dining.kiosk-stuck" && o.id !== "dining.no-korean-phone",
  );

  return (
    <Screen lang={lang} back={`/${lang}/`} title={t.title} morph="dining">
      <div className={flow.stage}>
        <h1 className={flow.heading}>{t.ask}</h1>
        <div role="group" aria-label={t.modeLabel} className={styles.seg}>
          {(["kiosk", "dietary"] as const).map((id) => (
            <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>
              {t.modes[id]}
            </button>
          ))}
        </div>

        {mode === "kiosk" ? (
          <div key="kiosk" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.kiosk.summary}</p>

            {/* 키오스크 010 번호 입력 화면 콜아웃(중첩 상자 없이 왼쪽 호박색 리본 강조) */}
            <div className={styles.kioskDisplay}>
              <p className={styles.kioskNumber}>010 - 0000 - 0000</p>
              <p className={styles.kioskTitle}>{t.kiosk.cards.phoneTitle}</p>
              <p className={styles.kioskBody}>{t.kiosk.cards.phoneBody}</p>
            </div>

            <div className={styles.editorialList}>
              <div className={styles.editorialItem}>
                <div className={styles.editorialHead}>
                  <strong>{t.kiosk.cards.cardTitle}</strong>
                </div>
                <p>{t.kiosk.cards.cardBody}</p>
              </div>
            </div>

            {kioskFacts}
          </div>
        ) : (
          <div key="dietary" className={`${flow.stage} ${flow.forward}`}>
            <p className={flow.body}>{t.dietary.summary}</p>

            <div className={styles.editorialList}>
              <div className={styles.editorialItem}>
                <div className={styles.editorialHead}>
                  <strong>{t.dietary.cards.brothTitle}</strong>
                </div>
                <p>{t.dietary.cards.brothBody}</p>
              </div>
              <div className={styles.editorialItem}>
                <div className={styles.editorialHead}>
                  <strong>{t.dietary.cards.etiquetteTitle}</strong>
                </div>
                <p>{t.dietary.cards.etiquetteBody}</p>
              </div>
            </div>

            {dietaryFacts}
          </div>
        )}

        <section className={styles.divider}>
          <h2 className={flow.section}>{t.staffHead}</h2>
          <p className={flow.note}>{t.staffSub}</p>

          {/* 복수 알레르기·식이제한 칩 조합기: 여러 조건을 함께 켜면 한 장의 한국어 카드로 합쳐진다 */}
          <div className={styles.chips}>
            {dietaryChips.map((chip) => {
              const active = selectedIds.includes(chip.id);
              const shortKo = chip.ko.split(/[.]/)[0]!;
              return (
                <button
                  key={chip.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={active}
                  onClick={() => toggleChip(chip.id)}
                >
                  <span>{active ? "✓" : "+"}</span>
                  <span lang="ko">{shortKo}</span>
                </button>
              );
            })}
          </div>

          <div key={selectedIds.join("+")} className={`${flow.stage} ${flow.forward}`}>
            <PhraseShow
              card={
                <figure className={phraseStyles.card}>
                  <blockquote lang="ko" className={phraseStyles.ko}>
                    {combinedKo}
                  </blockquote>
                  <figcaption className={phraseStyles.local}>
                    {combinedLabel}
                    {allReviewed ? null : (
                      <small className={phraseStyles.draft}>{m.phrase.draft}</small>
                    )}
                  </figcaption>
                </figure>
              }
              ko={combinedKo}
              label={combinedLabel}
              showLabel={m.staff.show}
              closeLabel={m.common.close}
              reply={reply}
            />
          </div>

          <h2 className={flow.section}>{m.staff.others}</h2>
          <ul className={flow.lines}>
            {options.map((o) => {
              const isSelected = selectedIds.length === 1 && selectedIds[0] === o.id;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    className={`${flow.line} ${flow.fromContent}`}
                    aria-pressed={isSelected}
                    onClick={() => selectSingle(o.id)}
                  >
                    {o.label}
                    {isSelected ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </Screen>
  );
}
