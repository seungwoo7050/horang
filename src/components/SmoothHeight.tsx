"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./SmoothHeight.module.css";

/**
 * 단계마다 내용 높이가 달라도 툭 바뀌지 않고 늘었다 줄었다 한다(Benji 트레이 높이, DESIGN.md §6-1).
 * 안쪽 높이를 재서 바깥 높이로 옮기고, 바뀌는 동안만 위아래를 잘라 아래 내용과 겹치지 않게 한다.
 * 동작 줄이기면 높이를 건드리지 않는다(그냥 바뀐다).
 */
export function SmoothHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(undefined as number | undefined);
  const [moving, setMoving] = useState(false);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ro = new ResizeObserver(() => {
      const next = el.offsetHeight;
      setHeight((prev) => {
        if (prev !== undefined && prev !== next) setMoving(true);
        return next;
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className={styles.outer}
      data-moving={moving || undefined}
      style={height === undefined ? undefined : { height }}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "height") setMoving(false);
      }}
    >
      <div ref={inner}>{children}</div>
    </div>
  );
}
