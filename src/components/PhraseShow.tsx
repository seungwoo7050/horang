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
  /** 크게 보기 아래에 늘 붙는 답하는 법(직원에게: 손가락으로 가리켜 달라)과 그 번역 */
  reply: { ko: string; label: string };
};

/** history.state 안에서 "크게 보여 주는 중"을 표시하는 키(시스템 뒤로 = 닫기) */
export const SHOWING = "horangPhraseShow";

export const showingIn = (state: unknown) =>
  typeof state === "object" && state !== null && SHOWING in state;

/** 닫기는 늘 기록 한 걸음 뒤로: 시스템 뒤로와 같은 길(popstate)로 닫힌다 */
function leave(setShowing: (v: boolean) => void, opened: { current: boolean }) {
  if (showingIn(window.history.state)) window.history.back();
  else {
    opened.current = false;
    startTransition(() => setShowing(false));
  }
}

/**
 * 직원 문장 카드와 "크게 보기": 카드를 누르면 같은 문장이 화면 가득 커진다(카드가 그대로 커지는 모핑,
 * DESIGN.md §6-1 연속성). 직원 문장 화면과 개찰구 3단계가 같이 쓴다.
 * 크게 보여 주는 동안은 화면이 꺼지지 않게 하고(지원 브라우저), 시스템 뒤로·Esc·×가 모두 닫기다
 */
export function PhraseShow({ card, ko, label, showLabel, closeLabel, reply }: Props) {
  const [showing, setShowing] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  /** 연 순간(누른 그 자리)부터 닫힐 때까지 참. 화면에 붙기 전(모핑 대기 중)에도 닫기 신호를 받으려고 상태와 따로 둔다 */
  const opened = useRef(false);

  // 크게 보던 중 새로고침하면 기록에 표시만 남는다: 지워 두어야 다음 뒤로가 빈 걸음이 되지 않는다
  useEffect(() => {
    if (!showingIn(window.history.state)) return;
    const rest = { ...(window.history.state as Record<string, unknown>) };
    delete rest[SHOWING];
    window.history.replaceState(rest, "");
  }, []);

  // 닫기 신호(시스템 뒤로, Esc, 브라우저 쪽 전체 화면 끝)는 늘 듣는다. 열린 크게 보기는 모핑(view transition)이 끝나야
  // 화면에 붙어서, 열 때만 들으면 그 사이(--dur-sheet)의 신호를 놓치고 크게 보기가 열린 채 남는다
  useEffect(() => {
    const onPop = () => {
      if (!opened.current || showingIn(window.history.state)) return;
      opened.current = false;
      startTransition(() => setShowing(false));
    };
    // Esc는 초점이 어디 있든 닫기
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (opened.current && e.key === "Escape") leave(setShowing, opened);
    };
    // 브라우저 쪽에서 전체 화면이 끝나면(Android 뒤로·Esc가 먼저 전체 화면을 끝낸다) 크게 보기도 닫는다: 한 번에 닫히게
    const onFullscreen = () => {
      if (opened.current && !document.fullscreenElement) leave(setShowing, opened);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onEsc);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onEsc);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, []);

  // 초점 옮기기와 화면 꺼짐 막기는 화면에 붙는 즉시 도는 useLayoutEffect에서 한다
  // (모핑 동안 React는 useEffect를 애니메이션 뒤로 미룬다)
  useLayoutEffect(() => {
    if (!showing) return;
    closer.current?.focus();
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
      // 크게 보기를 닫으면(×·시스템 뒤로) 연 전체 화면도 함께 끝낸다
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
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
    // 되는 브라우저(Android Chrome 등)에서는 주소창·상태 표시줄까지 숨긴다. 누른 그 순간(사용자 동작 안)에만 요청할 수 있다.
    // iPhone Safari는 요소 전체 화면이 없어(fullscreenEnabled 거짓) 앱 안에서만 덮는다
    if (document.fullscreenEnabled && !document.fullscreenElement)
      document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    window.history.pushState({ ...window.history.state, [SHOWING]: true }, "");
    opened.current = true;
    startTransition(() => setShowing(true));
  };
  const close = () => leave(setShowing, opened);
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
          {/* 직원이 길게 설명하면 여행자가 못 알아듣는다: 말 대신 가리켜 달라고 같이 보여 준다(보여 주는 문장보다 작게) */}
          <div className={show.reply}>
            <p lang="ko">{reply.ko}</p>
            <p>{reply.label}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
