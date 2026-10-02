import styles from "./Tiger.module.css";

// 호랑이 Horang(DESIGN.md §3-2 캐릭터 확정). 그림은 design/character-2026-10-01/tiger.mjs 시안을 옮겼다.
// T2(앉은 호랑이, 꼬리가 리본)는 큰 자리, T1 얼굴은 48px 이하 작은 자리에 쓴다. 장식이라 스크린리더에서 숨긴다.

export type Mood = "hi" | "calm" | "think" | "solved";

/**
 * 눈·코·입(새 마스코트 생김새: 검은 둥근 눈, 작은 둥근 코, w 입). (cx, cy)는 눈높이 가운데, s배
 */
function Face({ mood, cx, cy, s }: { mood: Mood; cx: number; cy: number; s: number }) {
  const x = (dx: number) => cx + dx * s;
  const y = (dy: number) => cy + dy * s;
  const eyes = {
    hi: (
      <>
        <circle cx={x(-11)} cy={y(0)} r={3.2 * s} />
        <circle cx={x(11)} cy={y(0)} r={3.2 * s} />
      </>
    ),
    calm: (
      <path
        className={styles.stroke}
        strokeWidth={2.4 * s}
        d={`M${x(-14)} ${y(0)}q${3 * s} ${3 * s} ${6 * s} 0M${x(8)} ${y(0)}q${3 * s} ${3 * s} ${6 * s} 0`}
      />
    ),
    think: (
      <>
        <circle cx={x(-11)} cy={y(0)} r={3 * s} />
        <circle cx={x(11)} cy={y(-1)} r={3 * s} />
        <path
          className={styles.stroke}
          strokeWidth={2 * s}
          d={`M${x(6)} ${y(-7)}l${9 * s} ${-2 * s}`}
        />
      </>
    ),
    solved: (
      <path
        className={styles.stroke}
        strokeWidth={2.6 * s}
        d={`M${x(-14)} ${y(1)}q${3 * s} ${-4.5 * s} ${6 * s} 0M${x(8)} ${y(1)}q${3 * s} ${-4.5 * s} ${6 * s} 0`}
      />
    ),
  }[mood];
  // w 입: 코 아래에서 양쪽으로 작은 호 두 개
  const w = `M${x(-6)} ${y(11)}q${3 * s} ${3.4 * s} ${6 * s} 0q${3 * s} ${3.4 * s} ${6 * s} 0`;
  const mouth = {
    hi: w,
    calm: w,
    think: `M${x(-3)} ${y(12.5)}h${6 * s}`,
    solved: "",
  }[mood];
  return (
    <g className={styles.ink}>
      {eyes}
      <path
        d={`M${x(-3.4)} ${y(6.4)}q${3.4 * s} ${-1.4 * s} ${6.8 * s} 0q${-0.6 * s} ${3.4 * s} ${-3.4 * s} ${4 * s}q${-2.8 * s} ${-0.6 * s} ${-3.4 * s} ${-4 * s}z`}
      />
      {mood === "solved" ? (
        <path d={`M${x(-6)} ${y(11.5)}q${6 * s} ${8 * s} ${12 * s} 0z`} />
      ) : (
        <path className={styles.stroke} strokeWidth={1.9 * s} d={mouth} />
      )}
    </g>
  );
}

/** 귀(둥근 바깥 + 크림 안쪽)·머리·이마 줄무늬 세 개·뺨 줄무늬·크림 입 주변. 두 형태가 같은 얼굴을 쓴다 */
function Head({
  cx,
  cy,
  rx,
  ry,
  ear,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** 귀 반지름 */
  ear: number;
}) {
  const ex = rx * 0.66;
  const ey = cy - ry * 0.78;
  const k = ry / 28;
  return (
    <>
      <g className={styles.body}>
        <circle cx={cx - ex} cy={ey} r={ear} />
        <circle cx={cx + ex} cy={ey} r={ear} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </g>
      <g className={styles.face}>
        <circle cx={cx - ex + ear * 0.1} cy={ey + ear * 0.1} r={ear * 0.55} />
        <circle cx={cx + ex - ear * 0.1} cy={ey + ear * 0.1} r={ear * 0.55} />
        <ellipse cx={cx} cy={cy + ry * 0.42} rx={rx * 0.54} ry={ry * 0.46} />
      </g>
      <path
        className={`${styles.ink} ${styles.stroke}`}
        strokeWidth={3.4 * k}
        d={[
          // 이마 세 줄(가운데가 길다)
          `M${cx - 8 * k} ${cy - ry + 3 * k}q${1 * k} ${5 * k} ${2.5 * k} ${9 * k}`,
          `M${cx} ${cy - ry + 1.5 * k}v${11 * k}`,
          `M${cx + 8 * k} ${cy - ry + 3 * k}q${-1 * k} ${5 * k} ${-2.5 * k} ${9 * k}`,
          // 뺨 줄무늬: 얼굴 가장자리 안쪽에서 눈 쪽으로 조금 기울어 두 개씩(윤곽 밖으로 나가지 않게)
          `M${cx - rx + 3 * k} ${cy - 5 * k}l${6.5 * k} ${1.6 * k}`,
          `M${cx - rx + 4 * k} ${cy + 4.5 * k}l${5.5 * k} ${0.4 * k}`,
          `M${cx + rx - 3 * k} ${cy - 5 * k}l${-6.5 * k} ${1.6 * k}`,
          `M${cx + rx - 4 * k} ${cy + 4.5 * k}l${-5.5 * k} ${0.4 * k}`,
        ].join("")}
      />
    </>
  );
}

/**
 * T2 · Ribbon tail — 해결 화면처럼 크게 보이는 자리(첫 화면·404·도움 패널은 마스코트 PNG).
 * 사용자 제공 마스코트(둥근 귀와 크림 귀 안, 이마 세 줄, 뺨 줄무늬, 크림 입 주변, 검은 둥근 눈, w 입)를 작은 SVG로 옮겼다.
 * celebrate: 해결·도착처럼 드문 순간에만 한 번 깡충 뛰고, 꼬리 리본이 그려진다(Benji 즐거움-영향 곡선)
 */
export function TigerSitting({
  mood = "hi",
  size = 96,
  celebrate = false,
}: {
  mood?: Mood;
  size?: number;
  celebrate?: boolean;
}) {
  return (
    <svg
      className={celebrate ? `${styles.tiger} ${styles.celebrate}` : styles.tiger}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.tail}
        d="M78 98 C100 100 108 84 98 74 S112 50 116 44"
        pathLength={1}
        strokeDasharray="1 1"
      />
      <g className={styles.body}>
        <path d="M38 103 Q33 70 60 66 Q87 70 82 103 Z" />
        <ellipse cx="49" cy="103" rx="9" ry="5" />
        <ellipse cx="71" cy="103" rx="9" ry="5" />
      </g>
      <g className={styles.face}>
        <ellipse cx="60" cy="88" rx="12" ry="13" />
        <ellipse cx="49" cy="105" rx="5" ry="2.6" />
        <ellipse cx="71" cy="105" rx="5" ry="2.6" />
      </g>
      <path
        className={`${styles.ink} ${styles.stroke}`}
        strokeWidth={2.8}
        d="M39 82l7 2M40 92l6 1M81 82l-7 2M80 92l-6 1"
      />
      <Head cx={60} cy={42} rx={33} ry={28} ear={11} />
      <Face mood={mood} cx={60} cy={40} s={1} />
      {mood === "hi" ? <path className={styles.arm} d="M82 78q12-6 14-22" /> : null}
    </svg>
  );
}

/** T1 얼굴 — 48px 이하(힌트 칩·헤더). 손은 빼고 얼굴만 */
export function TigerFace({ mood = "calm", size = 32 }: { mood?: Mood; size?: number }) {
  return (
    <svg
      className={styles.tiger}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <Head cx={60} cy={66} rx={48} ry={40} ear={16} />
      <Face mood={mood} cx={60} cy={62} s={1.45} />
    </svg>
  );
}
