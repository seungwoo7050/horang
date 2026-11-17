import { describe, expect, it } from "vitest";
import {
  depthOf,
  isRepeatedTap,
  parseFlowState,
  SETTLE_MS,
  TAP_SLOP,
  type FlowCodec,
  type Tap,
} from "./useFlowHistory";

type SimpleState = { step: number };

const simpleCodec: FlowCodec<SimpleState> = {
  initial: { step: 0 },
  encode: (s) => (s.step === 0 ? "" : `step=${s.step}`),
  decode: (q) => {
    const s = q.get("step");
    if (!s) return { step: 0 };
    const n = Number(s);
    return Number.isInteger(n) && n >= 0 ? { step: n } : null;
  },
  order: (s) => s.step,
  parent: (s) => (s.step > 0 ? { step: s.step - 1 } : null),
};

describe("useFlowHistory helpers", () => {
  describe("parseFlowState (?step= 동기화)", () => {
    it("returns initial state on null (SSR / initial hydration)", () => {
      expect(parseFlowState(simpleCodec, null)).toEqual({ step: 0 });
    });

    it("parses valid ?step= URL search string", () => {
      expect(parseFlowState(simpleCodec, "?step=2")).toEqual({ step: 2 });
      expect(parseFlowState(simpleCodec, "step=3")).toEqual({ step: 3 });
    });

    it("falls back to initial state for unknown or malformed query", () => {
      expect(parseFlowState(simpleCodec, "?step=invalid")).toEqual({ step: 0 });
      expect(parseFlowState(simpleCodec, "")).toEqual({ step: 0 });
    });
  });

  describe("depthOf", () => {
    it("returns clamped depth from history state", () => {
      expect(depthOf(null)).toBe(0);
      expect(depthOf({})).toBe(0);
      expect(depthOf({ horangFlowDepth: 3 })).toBe(3);
      expect(depthOf({ horangFlowDepth: -5 })).toBe(0);
    });
  });

  describe("isRepeatedTap (더블탭 무시 방지)", () => {
    const click = (x: number, y: number, detail = 1): Tap =>
      ({ clientX: x, clientY: y, detail }) as unknown as Tap;

    it("allows single clicks or keyboard presses", () => {
      const keyboardTap = click(0, 0, 0);
      expect(isRepeatedTap(keyboardTap, { t: performance.now(), x: 0, y: 0 })).toBe(false);
    });

    it("blocks browser multi-clicks (detail > 1)", () => {
      const doubleClick = click(100, 100, 2);
      expect(isRepeatedTap(doubleClick, { t: -Infinity, x: 0, y: 0 })).toBe(true);
    });

    it("blocks repeated clicks at same spot within SETTLE_MS", () => {
      const now = 1000;
      const last = { t: now - 100, x: 100, y: 100 };
      const tap = click(105, 105, 1); // within TAP_SLOP (24px)
      expect(isRepeatedTap(tap, last, now)).toBe(true);
    });

    it("allows clicks after SETTLE_MS has elapsed", () => {
      const now = 1000;
      const last = { t: now - (SETTLE_MS + 50), x: 100, y: 100 };
      const tap = click(105, 105, 1);
      expect(isRepeatedTap(tap, last, now)).toBe(false);
    });

    it("allows clicks that are far away (> TAP_SLOP)", () => {
      const now = 1000;
      const last = { t: now - 50, x: 100, y: 100 };
      const tap = click(100 + TAP_SLOP + 10, 100, 1);
      expect(isRepeatedTap(tap, last, now)).toBe(false);
    });
  });
});
