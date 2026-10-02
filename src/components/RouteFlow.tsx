"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { getMessages, type Locale } from "@/i18n";
import type { RouteLayout } from "@/station-map/graph";
import styles from "./flow.module.css";
import { RouteMap } from "./RouteMap";
import { MorphLabel } from "./MorphLabel";
import { SmoothHeight } from "./SmoothHeight";
import { FlowNav } from "./FlowNav";
import { Screen, ScreenHeader } from "./Screen";
import { TigerSitting } from "./Tiger";
import { useFlowHistory, type FlowCodec } from "./useFlowHistory";

export type RouteChoice = {
  id: string;
  label: string;
  hint: string;
  layout: RouteLayout;
  steps: {
    title: string;
    body: string;
    /** 이 단계에서 현장 확인되지 않은 것(문장) */
    unconfirmed?: string;
    /** 길을 못 찾을 때 보여 줄 직원 문장 카드(서버에서 그림) */
    phrase: ReactNode;
  }[];
  /** 근거 줄과 현장 미확인 표시(서버에서 그림) */
  evidence: ReactNode;
};

type Props = {
  lang: Locale;
  routes: RouteChoice[];
  places: Record<string, string>;
};

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

type State = { route: string | null; step: number; arrived: boolean };

/** 주소 검색어: ?route=<경로>&step=1…n|done (처음 단계는 "") */
const codecFor = (routes: RouteChoice[]): FlowCodec<State> => {
  const stepsOf = (id: string | null) => routes.find((r) => r.id === id)?.steps.length ?? 0;
  return {
    initial: { route: null, step: 0, arrived: false },
    encode: (s) =>
      s.route === null ? "" : `route=${s.route}&step=${s.arrived ? "done" : String(s.step + 1)}`,
    decode: (q) => {
      const route = q.get("route");
      const n = stepsOf(route);
      if (!route || n === 0) return null;
      const step = q.get("step");
      if (step === "done") return { route, step: n - 1, arrived: true };
      const i = Number(step) - 1;
      return Number.isInteger(i) && i >= 0 && i < n ? { route, step: i, arrived: false } : null;
    },
    order: (s) => (s.route === null ? 0 : 1 + s.step + (s.arrived ? 1 : 0)),
    parent: (s) =>
      s.route === null
        ? null
        : s.arrived
          ? { ...s, arrived: false }
          : s.step > 0
            ? { ...s, step: s.step - 1 }
            : { route: null, step: 0, arrived: false },
  };
};

/** 서울역 경로: 목적지 고르기 → 리본을 따라 한 단계씩 */
export function RouteFlow({ lang, routes, places }: Props) {
  const t = getMessages(lang);
  const s = t.station;
  const { state, dir, push, back, holdLink } = useFlowHistory(codecFor(routes));
  const { route: routeId, step, arrived } = state;
  // "못 찾겠어요" 문장 카드는 단계를 바꾸지 않는다(기록에 넣지 않음). 펼친 단계가 지금 단계일 때만 보인다
  const here = `${routeId}-${step}-${arrived}`;
  const [helpAt, setHelpAt] = useState(null as string | null);
  const help = helpAt === here;
  const route = routes.find((r) => r.id === routeId);

  const left = (
    <FlowNav
      mode={route ? "back" : "close"}
      home={`/${lang}/`}
      onBack={back}
      label={route ? t.common.back : t.common.close}
    />
  );

  if (!route) {
    return (
      <Screen lang={lang} header={<ScreenHeader left={left} title={s.title} morph="station" />}>
        <div className={`${styles.stage} ${styles[dir]}`}>
          <h1 className={styles.heading}>{s.ask}</h1>
          <ul className={styles.options}>
            {routes.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className={styles.option}
                  onClick={(e) => push({ route: r.id, step: 0, arrived: false }, e)}
                >
                  <span className={styles.optionText}>
                    {r.label}
                    <small>{r.hint}</small>
                  </span>
                  <Chevron />
                </button>
              </li>
            ))}
          </ul>
          <p className={styles.note}>{s.schematic}</p>
        </div>
      </Screen>
    );
  }

  const last = step === route.steps.length - 1;
  const current = route.steps[step]!;
  const stepLabel = s.stepOf
    .replace("{n}", String(step + 1))
    .replace("{total}", String(route.steps.length));

  return (
    <Screen
      lang={lang}
      header={<ScreenHeader left={left} title={route.label} />}
      actions={
        arrived ? (
          <Link href={`/${lang}/`} className={styles.primary} onClick={holdLink}>
            {s.home}
          </Link>
        ) : (
          <div className={styles.row}>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => setHelpAt(help ? null : here)}
            >
              {s.cantFind}
            </button>
            <button
              type="button"
              className={styles.primary}
              onClick={(e) =>
                push(last ? { ...state, arrived: true } : { ...state, step: step + 1 }, e)
              }
            >
              <MorphLabel>{last ? s.done : s.next}</MorphLabel>
            </button>
          </div>
        )
      }
    >
      <RouteMap
        layout={route.layout}
        places={places}
        label={s.mapLabel.replace("{route}", route.label)}
        step={arrived ? route.steps.length - 1 : step}
        legend={s.legend}
      />
      <SmoothHeight>
        {arrived ? (
          <div className={styles.center}>
            <TigerSitting mood="solved" size={112} celebrate />
            <h1 className={styles.heading}>{s.arrived}</h1>
          </div>
        ) : (
          <div key={`${route.id}-${step}`} className={`${styles.stage} ${styles[dir]}`}>
            <p className={styles.kicker}>{stepLabel}</p>
            <h1 className={styles.heading}>{current.title}</h1>
            <p className={styles.body}>{current.body}</p>
            {current.unconfirmed ? (
              <p className={styles.caution}>
                <strong>{s.unconfirmed.label}</strong> {current.unconfirmed}
              </p>
            ) : null}
            {help ? current.phrase : null}
          </div>
        )}
      </SmoothHeight>
      {route.evidence}
    </Screen>
  );
}
