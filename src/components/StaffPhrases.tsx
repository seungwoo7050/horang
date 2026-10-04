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
import styles from "./flow.module.css";
import show from "./StaffPhrases.module.css";

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
};

/** history.state 안에서 "크게 보여 주는 중"을 표시하는 키(시스템 뒤로 = 닫기) */
const SHOWING = "horangPhraseShow";

const showingIn = (state: unknown) =>
  typeof state === "object" && state !== null && SHOWING in state;

/** 닫기는 늘 기록 한 걸음 뒤로: 시스템 뒤로와 같은 길(popstate)로 닫힌다 */
function leave(setShowing: (v: boolean) => void) {
  if (showingIn(window.history.state)) window.history.back();
  else startTransition(() => setShowing(false));
}

/**
 * 직원에게 보여 줄 문장: 위에 크게 한 장, 아래에서 다른 문장 고르기. 급한 화면이라 SponsorSlot 없음.
 * 카드를 누르면 같은 문장이 화면 가득 커진다(카드가 그대로 커지는 모핑, DESIGN.md §6-1 연속성).
 * 크게 보여 주는 동안은 화면이 꺼지지 않게 하고(지원 브라우저), 시스템 뒤로·Esc·×가 모두 닫기다
 */
export function StaffPhrases({
  cards,
  options,
  initial,
  othersLabel,
  showLabel,
  closeLabel,
}: Props) {
  const [current, setCurrent] = useState(initial);
  const [showing, setShowing] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const phrase = options.find((o) => o.id === current)!;

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

  // 닫히면 초점을 "크게 보기" 버튼으로 돌린다. 버튼은 닫힌 뒤 새로 그려지므로 그 다음 effect에서 옮긴다
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
      {showing ? (
        // 자리 지킴: 뒤 화면 높이가 그대로라 닫았을 때 카드가 같은 자리로 돌아온다
        <div className={`${styles.stage} ${show.placeholder}`} aria-hidden="true" inert>
          {cards[current]}
        </div>
      ) : (
        <div key={current} className={`${styles.stage} ${styles.forward} ${show.cardWrap}`}>
          <ViewTransition name="staff-phrase" share="morph" default="none">
            <div>{cards[current]}</div>
          </ViewTransition>
          <button ref={opener} type="button" className={show.open} onClick={open}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" />
            </svg>
            {showLabel}
          </button>
        </div>
      )}
      {showing ? (
        <div
          className={show.sheet}
          role="dialog"
          aria-modal="true"
          aria-label={phrase.label}
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
              <blockquote lang="ko">{phrase.ko}</blockquote>
              <figcaption>{phrase.label}</figcaption>
            </figure>
          </ViewTransition>
        </div>
      ) : null}
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
