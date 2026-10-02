import styles from "./NavIcon.module.css";

export type NavMode = "close" | "back";

/**
 * 왼쪽 위 아이콘 하나: 화면을 떠날 때는 ×(닫기), 화면 안 이전 단계로 갈 때는 ←(뒤로).
 * 두 선이 같은 각도를 유지한 채 자리와 길이만 바뀌어 ×와 ‹ 사이를 오간다(Benji "dual purpose", DESIGN.md §6-1).
 */
export function NavIcon({ mode }: { mode: NavMode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      className={`${styles.icon} ${styles[mode]}`}
    >
      <line className={styles.a} x1="-8.5" y1="0" x2="8.5" y2="0" />
      <line className={styles.b} x1="-8.5" y1="0" x2="8.5" y2="0" />
    </svg>
  );
}
