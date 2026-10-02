import styles from "./MorphLabel.module.css";

/**
 * 버튼은 제자리에 두고 글자만 바꾼다(Benji "Continue → Confirm", DESIGN.md §6-1 연속성).
 * 글자가 바뀌면 key가 바뀌어 새 글자가 살짝 떠오르며 또렷해진다. 같은 글자면 아무 일도 없다.
 */
export function MorphLabel({ children }: { children: string }) {
  return (
    <span key={children} className={styles.label}>
      {children}
    </span>
  );
}
