"use client";

import {
  startTransition,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import show from "./PhraseShow.module.css";

type Props = {
  /** 직원 문장 카드(서버에서 그림, PhraseCard) */
  card: ReactNode;
  /** 크게 보여 줄 한국어와 현재 언어 번역 */
  ko: string;
  label: string;
  /** 카드를 화면 가득 키우는 버튼 이름 */
  showLabel: string;
  closeLabel: string;
};

/** history.state 안에서 "크게 보여 주는 중"을 표시하는 키(시스템 뒤로 = 닫기) */
export const SHOWING = "horangPhraseShow";

export const showingIn = (state: unknown) =>
  typeof state === "object" && state !== null && SHOWING in state;

/** 닫기는 늘 기록 한 걸음 뒤로: 시스템 뒤로와 같은 길(popstate)로 닫힌다 */
function leave(setShowing: (v: boolean) => void) {
  if (showingIn(window.history.state)) window.history.back();
  else startTransition(() => setShowing(false));
}

/**
 * 직원 문장 카드와 "크게 보기": 카드를 누르면 같은 문장이 화면 가득 커진다(카드가 그대로 커지는 모핑,
 * DESIGN.md §6-1 연속성). 직원 문장 화면과 개찰구 3단계가 같이 쓴다.
 * 크게 보여 주는 동안은 화면이 꺼지지 않게 하고(지원 브라우저), 시스템 뒤로·Esc·×가 모두 닫기다
 */
export function PhraseShow({ card, ko, label, showLabel, closeLabel }: Props) {
  const [showing, setShowing] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  // 크게 보던 중 새로고침하면 기록에 표시만 남는다: 지워 두어야 다음 뒤로가 빈 걸음이 되지 않는다
  useEffect(() => {
    if (!showingIn(window.history.state)) return;
    const rest = { ...(window.history.state as Record<string, unknown>) };
    delete rest[SHOWING];
    window.history.replaceState(rest, "");
  }, []);

  // 모핑(view transition) 동안 React는 useEffect를 애니메이션 뒤로 미룬다. 여는 순간부터 Esc·뒤로가 듣도록
  // 듣기와 초점 옮기기는 화면에 붙는 즉시 도는 useLayoutEffect에서 한다
  useLayoutEffect(() => {
    if (!showing) return;
    closer.current?.focus();
    const onPop = () => {
      if (!showingIn(window.history.state)) startTransition(() => setShowing(false));
    };
    // Esc는 초점이 어디 있든 닫기(모핑이 끝나기 전에 눌러도)
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") leave(setShowing);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onEsc);
    // 직원이 읽는 동안 화면이 어두워지지 않게. 못 받으면(지원 안 함·배터리 절약) 그냥 둔다.
    // 브라우저는 탭이 가려지면 잠금을 스스로 푼다: 다시 보이면 새로 받는다
    let lock: WakeLockSentinel | undefined;
    let alive = true;
    const acquire = () =>
      navigator.wakeLock
        ?.request("screen")
        .then((l) => {
          if (alive) lock = l;
          else void l.release();
        })
        .catch(() => {});
    const onVisible = () => {
      if (document.visibilityState === "visible") void acquire();
    };
    void acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onEsc);
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => {});
      returnFocus.current = true;
    };
  }, [showing]);

  // 닫히면 초점을 "크게 보기" 버튼으로 돌린다(버튼은 자리 지킴 안에 그대로 있다, 닫힌 뒤 inert가 풀린 다음에 옮긴다)
  useLayoutEffect(() => {
    if (showing || !returnFocus.current) return;
    returnFocus.current = false;
    opener.current?.focus({ preventScroll: true });
  }, [showing]);

  const open = () => {
    window.history.pushState({ ...window.history.state, [SHOWING]: true }, "");
    startTransition(() => setShowing(true));
  };
  const close = () => leave(setShowing);
  // 크게 보는 동안 키보드 초점은 닫기 버튼 하나에 머문다(뒤 화면으로 나가지 않게)
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Tab") e.preventDefault();
  };

  return (
    <>
      {/* 크게 보는 동안에도 카드 묶음은 자리를 지킨다(보이지 않게): 닫았을 때 같은 자리로 돌아오고 아래가 밀리지 않는다 */}
      <div
        className={showing ? `${show.cardWrap} ${show.placeholder}` : show.cardWrap}
        aria-hidden={showing || undefined}
        inert={showing}
      >
        {showing ? (
          <div>{card}</div>
        ) : (
          <ViewTransition name="staff-phrase" share="morph" default="none">
            <div>{card}</div>
          </ViewTransition>
        )}
        <button ref={opener} type="button" className={show.open} onClick={open}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" />
          </svg>
          {showLabel}
        </button>
      </div>
      {showing ? (
        <div
          className={show.sheet}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onKeyDown={onKey}
        >
          <button ref={closer} type="button" className={show.close} onClick={close}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <span className={show.hidden}>{closeLabel}</span>
          </button>
          <ViewTransition name="staff-phrase" share="morph" default="none">
            <figure className={show.big}>
              <blockquote lang="ko">{ko}</blockquote>
              <figcaption>{label}</figcaption>
            </figure>
          </ViewTransition>
        </div>
      ) : null}
    </>
  );
}
