import styles from "./Tiger.module.css";

// 호랑이 Horang(DESIGN.md §3-2 캐릭터 확정). 그림은 design/character-2026-10-01/tiger.mjs 시안을 옮겼다.
// T2(앉은 호랑이, 꼬리가 리본)는 큰 자리, T1 얼굴은 48px 이하 작은 자리에 쓴다. 장식이라 스크린리더에서 숨긴다.

export type Mood = "hi" | "calm" | "think" | "solved";

/** 눈·코·입. (cx, cy)를 가운데로 s배 */
function Face({ mood, cx, cy, s }: { mood: Mood; cx: number; cy: number; s: number }) {
  const x = (dx: number) => cx + dx * s;
  const y = cy;
  const eyes = {
    hi: (
      <>
        <circle cx={x(-9)} cy={y} r={2.6 * s} />
        <circle cx={x(9)} cy={y} r={2.6 * s} />
      </>
    ),
    calm: (
      <path
        className={styles.stroke}
        strokeWidth={2.2 * s}
        d={`M${x(-12)} ${y}q${3 * s} ${3 * s} ${6 * s} 0M${x(6)} ${y}q${3 * s} ${3 * s} ${6 * s} 0`}
      />
    ),
    think: (
      <>
        <circle cx={x(-9)} cy={y} r={2.4 * s} />
        <circle cx={x(9)} cy={y - s} r={2.4 * s} />
        <path
          className={styles.stroke}
          strokeWidth={2 * s}
          d={`M${x(4)} ${y - 7 * s}l${9 * s} ${-2 * s}`}
        />
      </>
    ),
    solved: (
      <path
        className={styles.stroke}
        strokeWidth={2.4 * s}
        d={`M${x(-12)} ${y + s}q${3 * s} ${-4 * s} ${6 * s} 0M${x(6)} ${y + s}q${3 * s} ${-4 * s} ${6 * s} 0`}
      />
    ),
  }[mood];
  const mouth = {
    hi: `M${x(-4)} ${y + 12 * s}q${4 * s} ${3.5 * s} ${8 * s} 0`,
    calm: `M${x(-3)} ${y + 12 * s}q${3 * s} ${2 * s} ${6 * s} 0`,
    think: `M${x(-3)} ${y + 13 * s}h${6 * s}`,
    solved: "",
  }[mood];
  return (
    <g className={styles.ink}>
      {eyes}
      <path d={`M${x(-2.5)} ${y + 7 * s}h${5 * s}l${-2.5 * s} ${2.6 * s}z`} />
      {mood === "solved" ? (
        <path d={`M${x(-5)} ${y + 11 * s}q${5 * s} ${7 * s} ${10 * s} 0z`} />
      ) : (
        <path className={styles.stroke} strokeWidth={1.9 * s} d={mouth} />
      )}
    </g>
  );
}

/** T2 · Ribbon tail — 첫 화면, 해결 화면, 오류 안내처럼 크게 보이는 자리 */
export function TigerSitting({ mood = "hi", size = 96 }: { mood?: Mood; size?: number }) {
  return (
    <svg
      className={styles.tiger}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.tail} d="M78 98 C100 100 108 84 98 74 S112 50 116 44" />
      <g className={styles.body}>
        <path d="M34 100 Q30 64 60 62 Q90 64 86 100 Z" />
        <ellipse cx="48" cy="100" rx="9" ry="5" />
        <ellipse cx="72" cy="100" rx="9" ry="5" />
        <circle cx="40" cy="24" r="8" />
        <circle cx="80" cy="24" r="8" />
        <rect x="32" y="20" width="56" height="46" rx="22" />
      </g>
      <path
        className={`${styles.ink} ${styles.stroke}`}
        strokeWidth={2.6}
        d="M46 78l8 3M44 88l9 2M74 78l-8 3M76 88l-9 2M55 22v6M60 21v8M65 22v6"
      />
      <g className={styles.face}>
        <ellipse cx="60" cy="90" rx="11" ry="11" />
        <circle cx="40" cy="24" r="3.5" />
        <circle cx="80" cy="24" r="3.5" />
        <ellipse cx="60" cy="52" rx="15" ry="11" />
      </g>
      <Face mood={mood} cx={60} cy={40} s={0.9} />
      {mood === "hi" ? <path className={styles.arm} d="M86 70q12-6 12-20" /> : null}
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
      <g className={styles.body}>
        <circle cx="30" cy="34" r="13" />
        <circle cx="90" cy="34" r="13" />
        <ellipse cx="60" cy="66" rx="44" ry="38" />
      </g>
      <g className={styles.face}>
        <circle cx="30" cy="34" r="6" />
        <circle cx="90" cy="34" r="6" />
        <ellipse cx="60" cy="80" rx="22" ry="17" />
      </g>
      <path
        className={`${styles.ink} ${styles.stroke}`}
        strokeWidth={3.2}
        d="M52 30v9M60 28v12M68 30v9M18 60h9M17 70h9M93 60h9M94 70h9"
      />
      <Face mood={mood} cx={60} cy={60} s={1.25} />
    </svg>
  );
}
