import type { RouteLayout } from "@/station-map/graph";
import { MAP } from "@/station-map/graph";
import styles from "./RouteMap.module.css";

type Props = {
  layout: RouteLayout;
  /** 장소 id → 이름(현재 언어) */
  places: Record<string, string>;
  /** 스크린리더용 경로 설명 */
  label: string;
  /** 지금 보여 주는 단계(0부터). 리본은 이 단계의 끝까지 그려진다 */
  step: number;
  /** 기호 설명(현재 언어) */
  legend: { start: string; gate: string };
};

/** 층 줄 위에 경로를 그리고, 리본을 현재 단계까지 칠한다. 축척 없는 개념도다 */
export function RouteMap({ layout, places, label, step, legend }: Props) {
  const reach = layout.stepEnds[Math.min(step, layout.stepEnds.length - 1)] ?? 0;
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.map}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label={label}
      >
        {layout.floors.map((f) => (
          <g key={f.floor} className={styles.floor}>
            {f.skipBefore ? (
              <path
                className={styles.skip}
                d={`M${MAP.pad + 22} ${f.y - MAP.rowH / 2 - MAP.skipGap + 10}v${MAP.skipGap - 20}`}
              />
            ) : null}
            {/* 층 바닥(단면도처럼 한 줄). 상자는 누르는 버튼처럼 보여서 쓰지 않는다 */}
            <path
              className={styles.slab}
              d={`M${MAP.pad} ${f.y + MAP.rowH / 2}H${layout.width - MAP.pad}`}
            />
            <text className={styles.level} x={MAP.pad + 12} y={f.y}>
              {f.floor}
            </text>
            {f.place ? (
              <text className={styles.place} x={MAP.pad + 46} y={f.y}>
                {places[f.place]}
              </text>
            ) : null}
          </g>
        ))}
        <path className={styles.track} d={layout.d} />
        <path
          className={styles.ribbon}
          d={layout.d}
          pathLength={1}
          strokeDasharray="1 1"
          style={{ strokeDashoffset: 1 - reach }}
        />
        {layout.gates.map(([x, y]) => (
          <path key={`${x},${y}`} className={styles.gate} d={`M${x} ${y - 9}v18`} />
        ))}
        {layout.stops.map((s) => {
          const done = s.step <= step;
          return (
            <g key={s.node} className={done ? styles.stopDone : styles.stop}>
              <circle cx={s.x} cy={s.y} r={s.step < 0 ? 6 : 9} />
              {s.step >= 0 ? (
                <text x={s.x} y={s.y}>
                  {s.step + 1}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <figcaption className={styles.legend} aria-hidden="true">
        <span>
          <svg viewBox="0 0 16 16" className={styles.key}>
            <circle className={styles.keyStart} cx="8" cy="8" r="5" />
          </svg>
          {legend.start}
        </span>
        {layout.gates.length ? (
          <span>
            <svg viewBox="0 0 16 16" className={styles.key}>
              <path className={styles.keyTrack} d="M2 8h12" />
              <path className={styles.gate} d="M8 2v12" />
            </svg>
            {legend.gate}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
