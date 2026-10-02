import styles from "./StepRibbon.module.css";

/** 단계 진행 리본: 지난 단계까지 리본이 칠해지고, 번호를 함께 적는다(색만으로 구분하지 않음) */
export function StepRibbon({
  total,
  current,
  label,
}: {
  total: number;
  current: number;
  label: string;
}) {
  const W = 300;
  const pad = 12;
  const x = (i: number) => pad + ((W - pad * 2) * i) / Math.max(total - 1, 1);
  const reach = total > 1 ? current / (total - 1) : 1;
  return (
    <svg className={styles.ribbon} viewBox={`0 0 ${W} 24`} role="img" aria-label={label}>
      <path className={styles.track} d={`M${x(0)} 12H${x(total - 1)}`} />
      <path
        className={styles.fill}
        d={`M${x(0)} 12H${x(total - 1)}`}
        pathLength={1}
        strokeDasharray="1 1"
        style={{ strokeDashoffset: 1 - reach }}
      />
      {Array.from({ length: total }, (_, i) => (
        <g key={i} className={i <= current ? styles.done : styles.todo}>
          <circle cx={x(i)} cy={12} r={9} />
          <text x={x(i)} y={12}>
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
