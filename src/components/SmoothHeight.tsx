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
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const ro = new ResizeObserver(() => {
      const next = el.offsetHeight;
      setHeight((prev) => {
        if (prev !== undefined && prev !== next) setMoving(true);
        return next;
      });
    });
    // 쓰는 도중에 동작 줄이기를 켜면 transition이 없어져 transitionend가 오지 않는다:
    // 그때는 높이 맞추기를 멈추고 잘림(data-moving)도 바로 푼다. 다시 끄면 이어서 맞춘다
    const follow = () => {
      if (reduce.matches) {
        ro.disconnect();
        setHeight(undefined);
        setMoving(false);
      } else {
        ro.observe(el);
      }
    };
    follow();
    reduce.addEventListener("change", follow);
    return () => {
      reduce.removeEventListener("change", follow);
      ro.disconnect();
    };
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
