import type { ReactNode } from "react";
import { Mascot } from "./Brand";
import styles from "./HelpPanel.module.css";

/**
 * 도움 맥락(직원에게 보여 줄 문장)의 제목: 마스코트 Horang이 가는 선 위로 고개를 내밀고 옆에서 말한다.
 * 제목은 그대로 화면의 h1이다
 */
export function HelpPanel({ children }: { children: ReactNode }) {
  return (
    <div className={styles.panel}>
      <Mascot variant="bust" className={styles.bust} />
      <h1 className={styles.text}>{children}</h1>
    </div>
  );
}
