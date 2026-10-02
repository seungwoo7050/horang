import { describe, expect, it } from "vitest";
import { claims } from "@/content";
import { layoutRoute, MAP, validateStation } from "./graph";
import { seoulStation } from "./seoul-station";
import type { Station } from "./types";

const claimIds = new Set(claims.map((c) => c.id));

const tiny: Station = {
  id: "tiny",
  nodes: [
    { id: "a", floor: "B7", lane: 0, place: true },
    { id: "a-el", floor: "B7", lane: 1 },
    { id: "b-el", floor: "B3", lane: 1 },
    { id: "b", floor: "B3", lane: 0, place: true },
  ],
  edges: [
    { from: "a", to: "a-el", kind: "walk" },
    { from: "a-el", to: "b-el", kind: "elevator" },
    { from: "b-el", to: "b", kind: "gate" },
  ],
  routes: [
    {
      id: "a-to-b",
      path: ["a", "a-el", "b-el", "b"],
      steps: [
        { id: "up", to: "b-el" },
        { id: "out", to: "b" },
      ],
      claims: ["seoul-station.arex.floors"],
    },
  ],
};

const withRoute = (patch: Partial<Station["routes"][number]>): Station => ({
  ...tiny,
  routes: [{ ...tiny.routes[0]!, ...patch }],
});

describe("Seoul Station graph", () => {
  it("passes every graph rule and cites existing claims", () => {
    expect(validateStation(seoulStation, claimIds)).toEqual([]);
  });

  it("every route lays out with increasing step ends that finish at 1", () => {
    for (const r of seoulStation.routes) {
      const { stepEnds, stops } = layoutRoute(seoulStation, r.id);
      expect(stepEnds).toHaveLength(r.steps.length);
      stepEnds.forEach((v, i) => expect(v).toBeGreaterThan(stepEnds[i - 1] ?? 0));
      expect(stepEnds.at(-1)).toBe(1);
      expect(stops).toHaveLength(r.steps.length + 1);
    }
  });

  it("AREX → Line 4 climbs from B7 to B1 and ends on the B2 platform", () => {
    const l = layoutRoute(seoulStation, "arex-to-line-4");
    expect(l.floors.map((f) => f.floor)).toEqual(["B1", "B2", "B3", "B7"]);
    expect(l.floors.find((f) => f.floor === "B7")?.skipBefore).toBe(true);
    expect(l.floors.find((f) => f.floor === "B2")?.place).toBe("line-4-platform");
    expect(l.gates).toHaveLength(1);
  });
});

describe("validateStation", () => {
  it("accepts a well-formed graph", () => {
    expect(validateStation(tiny, claimIds)).toEqual([]);
  });

  it("rejects an elevator that changes lane", () => {
    const bad: Station = {
      ...tiny,
      nodes: tiny.nodes.map((n) => (n.id === "b-el" ? { ...n, lane: 2 } : n)),
    };
    expect(validateStation(bad).join()).toContain("엘리베이터는 같은 lane");
  });

  it("rejects a walk between floors", () => {
    const bad: Station = { ...tiny, edges: [...tiny.edges, { from: "a", to: "b", kind: "walk" }] };
    expect(validateStation(bad).join()).toContain("걷기·게이트는 같은 층");
  });

  it("rejects a route that jumps between unconnected points", () => {
    const errors = validateStation(withRoute({ path: ["a", "b-el", "b"] }));
    expect(errors.join()).toContain("edge가 없다");
  });

  it("rejects steps out of order or not ending at the destination", () => {
    const backwards = withRoute({
      steps: [
        { id: "out", to: "b" },
        { id: "up", to: "b-el" },
      ],
    });
    expect(validateStation(backwards).join()).toContain("단계 up의 끝");
    const short = withRoute({ steps: [{ id: "up", to: "b-el" }] });
    expect(validateStation(short).join()).toContain("마지막 단계");
  });

  it("rejects a route that starts at a non-place", () => {
    const errors = validateStation(
      withRoute({ path: ["a-el", "b-el", "b"], steps: [{ id: "x", to: "b" }] }),
    );
    expect(errors.join()).toContain("시작·끝은 장소");
  });

  it("rejects a route without evidence or with an unknown claim", () => {
    expect(validateStation(withRoute({ claims: [] })).join()).toContain("근거 claim이 없다");
    expect(validateStation(withRoute({ claims: ["nope"] }), claimIds).join()).toContain(
      "없는 claim",
    );
  });
});

describe("layoutRoute", () => {
  it("turns the path into orthogonal segments", () => {
    const { points, d } = layoutRoute(tiny, "a-to-b");
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1]!;
      const [x1, y1] = points[i]!;
      expect(x0 === x1 || y0 === y1).toBe(true);
    }
    expect(d.startsWith("M")).toBe(true);
  });

  it("splits the ribbon by length at each step end", () => {
    // a(0) → a-el(오른쪽 한 칸) → b-el(위로) → b(왼쪽 한 칸): 첫 단계는 한 칸 + 세로 길이까지
    const l = layoutRoute(tiny, "a-to-b");
    const vertical = l.points[1]![1] - l.points[2]![1];
    const lane = MAP.laneGap;
    expect(l.stepEnds[0]).toBeCloseTo((lane + vertical) / (lane * 2 + vertical), 3);
  });

  it("throws for an unknown route", () => {
    expect(() => layoutRoute(tiny, "nope")).toThrow("route 없음");
  });
});
