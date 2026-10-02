"use client";

import { useState, type ReactNode } from "react";
import styles from "./Boop.module.css";

/**
 * 호랑이를 누르면 짧게 갸웃(Josh boop, DESIGN.md §6-1 호랑이 규칙). 장식이라 키보드 초점은 받지 않는다 —
 * 누르지 않아도 잃는 정보가 없다. 다시 누르면 처음부터. 동작 줄이기면 dur-boop이 0이라 아무 일도 없다
 */
export function Boop({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  return (
    <span
      key={count}
      className={count ? `${styles.boop} ${styles.go}` : styles.boop}
      onPointerDown={() => setCount((c) => c + 1)}
    >
      {children}
    </span>
  );
}
