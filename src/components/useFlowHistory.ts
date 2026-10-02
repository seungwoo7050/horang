"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * 단계 흐름(개찰구·카드·서울역)의 단계를 주소 검색어(?step=…)와 브라우저 기록에 둔다.
 * - 시스템 뒤로(Android 뒤로·iOS 스와이프·브라우저 뒤로) = 이전 단계. 앞으로도 된다
 * - 새로고침해도 단계가 남는다(정적 export라 서버 대신 검색어로)
 * - 헤더 ‹는 시스템 뒤로와 같은 결과: 이 흐름에서 쌓은 기록이 있으면 history.back(),
 *   공유받은 주소로 바로 들어와 이전 기록이 없으면 이전 단계 주소로 바꿔 쓴다
 * - 단계가 바뀌면 새 제목으로 포커스를 옮긴다(스크린 리더가 새 단계를 읽는다)
 */

export type Dir = "forward" | "backward";

export type FlowCodec<S> = {
  initial: S;
  /** 검색어(앞의 ? 없이). 처음 단계는 "" */
  encode: (s: S) => string;
  /** 검색어 → 단계. 모르는 값이면 null(처음 단계로) */
  decode: (q: URLSearchParams) => S | null;
  /** 진행 순서(방향 계산) */
  order: (s: S) => number;
  /** 헤더 ‹의 이전 단계. 없으면 null */
  parent: (s: S) => S | null;
};

/** history.state 안에 이 흐름이 쌓은 기록 깊이 */
const DEPTH = "horangFlowDepth";

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}
const clientSearch = () => window.location.search;
// 정적 HTML(서버)과 첫 하이드레이션은 처음 단계로 그린다
const serverSearch = () => null;

const depthOf = (state: unknown) =>
  typeof state === "object" && state !== null && DEPTH in state
    ? Number((state as Record<string, unknown>)[DEPTH]) || 0
    : 0;

export function useFlowHistory<S>(codec: FlowCodec<S>) {
  const search = useSyncExternalStore(subscribe, clientSearch, serverSearch);
  const state =
    search === null ? codec.initial : (codec.decode(new URLSearchParams(search)) ?? codec.initial);

  const [dir, setDir] = useState<Dir>("forward");
  const [moves, setMoves] = useState(0);
  const codecRef = useRef(codec);
  /** 마지막으로 그린 단계의 검색어(시스템 뒤로 때 방향 계산). 이벤트 처리에서만 바꾼다 */
  const shown = useRef(null as string | null);

  useEffect(() => {
    codecRef.current = codec;
    shown.current ??= window.location.search;
  });

  const urlFor = (s: S) => {
    const q = codec.encode(s);
    return window.location.pathname + (q ? `?${q}` : "");
  };

  const moved = (to: Dir) => {
    setDir(to);
    setMoves((n) => n + 1);
  };

  // 시스템 뒤로·앞으로: 방향은 단계 순서로 정한다
  useEffect(() => {
    const onPop = () => {
      const c = codecRef.current;
      const read = (q: string | null) => c.decode(new URLSearchParams(q ?? "")) ?? c.initial;
      const before = read(shown.current);
      const after = read(window.location.search);
      shown.current = window.location.search;
      setDir(c.order(after) < c.order(before) ? "backward" : "forward");
      setMoves((n) => n + 1);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // 단계가 바뀌면(첫 그림은 빼고) 새 단계 제목으로 포커스
  useEffect(() => {
    if (moves === 0) return;
    const heading = document.querySelector<HTMLElement>("main h1");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }, [moves]);

  /** 다음 단계로. replaceCurrent를 주면 지금 기록을 먼저 그 단계로 바꿔 둔다(돌아왔을 때 고른 표시 유지) */
  const push = (next: S, replaceCurrent?: S) => {
    const depth = depthOf(window.history.state);
    if (replaceCurrent !== undefined) {
      window.history.replaceState(window.history.state, "", urlFor(replaceCurrent));
    }
    window.history.pushState({ ...window.history.state, [DEPTH]: depth + 1 }, "", urlFor(next));
    shown.current = window.location.search;
    notify();
    moved(codec.order(next) < codec.order(state) ? "backward" : "forward");
    return true;
  };

  /** 헤더 ‹: 시스템 뒤로와 같은 결과 */
  const back = () => {
    if (depthOf(window.history.state) > 0) {
      window.history.back();
      return;
    }
    const parent = codec.parent(state);
    if (parent === null) return;
    window.history.replaceState(window.history.state, "", urlFor(parent));
    shown.current = window.location.search;
    notify();
    moved("backward");
  };

  return { state, dir, push, back };
}
