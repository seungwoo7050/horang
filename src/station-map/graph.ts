// 노드·엣지 그래프를 검사하고, 경로 하나를 SVG 좌표와 리본 단계 경계로 바꾼다.
// 빌드 때(서버 컴포넌트) 계산해 화면에는 숫자만 넘긴다(DESIGN.md §6-1 리본).
import {
  FLOOR_LEVEL,
  FLOORS,
  type FloorId,
  type Station,
  type StationNode,
  type StationRoute,
} from "./types";

const edgeKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

export function findEdge(station: Station, a: string, b: string) {
  return station.edges.find((e) => edgeKey(e.from, e.to) === edgeKey(a, b));
}

/** 그래프 규칙 위반 목록(비어 있으면 통과). knownClaims를 주면 claim id도 확인한다 */
export function validateStation(station: Station, knownClaims?: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  const nodes = new Map<string, StationNode>();
  for (const n of station.nodes) {
    if (nodes.has(n.id)) errors.push(`node 중복: ${n.id}`);
    if (!Number.isInteger(n.lane) || n.lane < 0) errors.push(`lane은 0 이상 정수: ${n.id}`);
    nodes.set(n.id, n);
  }

  const seen = new Set<string>();
  for (const e of station.edges) {
    const a = nodes.get(e.from);
    const b = nodes.get(e.to);
    const name = `${e.from}→${e.to}`;
    if (!a || !b) {
      errors.push(`없는 node를 잇는 edge: ${name}`);
      continue;
    }
    if (seen.has(edgeKey(e.from, e.to))) errors.push(`edge 중복: ${name}`);
    seen.add(edgeKey(e.from, e.to));
    if (e.kind === "elevator" && (a.lane !== b.lane || a.floor === b.floor)) {
      errors.push(`엘리베이터는 같은 lane, 다른 층이어야 한다: ${name}`);
    }
    if (e.kind !== "elevator" && (a.floor !== b.floor || a.lane === b.lane)) {
      errors.push(`걷기·게이트는 같은 층, 다른 lane이어야 한다: ${name}`);
    }
  }

  for (const r of station.routes) errors.push(...validateRoute(station, r, nodes, knownClaims));
  return errors;
}

function validateRoute(
  station: Station,
  route: StationRoute,
  nodes: Map<string, StationNode>,
  knownClaims?: ReadonlySet<string>,
): string[] {
  const errors: string[] = [];
  const at = `route ${route.id}`;
  const { path, steps } = route;
  if (path.length < 2) return [`${at}: 점이 2개 이상이어야 한다`];
  if (new Set(path).size !== path.length) errors.push(`${at}: 같은 점을 두 번 지난다`);
  for (const id of path) if (!nodes.has(id)) errors.push(`${at}: 없는 node ${id}`);
  for (const id of [path[0]!, path.at(-1)!]) {
    if (nodes.get(id) && !nodes.get(id)!.place)
      errors.push(`${at}: 시작·끝은 장소여야 한다(${id})`);
  }
  for (let i = 1; i < path.length; i++) {
    if (!findEdge(station, path[i - 1]!, path[i]!)) {
      errors.push(`${at}: ${path[i - 1]}와 ${path[i]} 사이에 edge가 없다`);
    }
  }

  if (steps.length === 0) errors.push(`${at}: 단계가 없다`);
  let last = 0;
  for (const s of steps) {
    const i = path.indexOf(s.to);
    if (i <= last) errors.push(`${at}: 단계 ${s.id}의 끝이 경로 앞쪽이거나 경로 밖이다`);
    last = Math.max(last, i);
  }
  if (steps.at(-1)?.to !== path.at(-1)) errors.push(`${at}: 마지막 단계는 경로 끝에서 끝나야 한다`);

  if (route.claims.length === 0) errors.push(`${at}: 근거 claim이 없다`);
  if (knownClaims) {
    for (const c of route.claims) if (!knownClaims.has(c)) errors.push(`${at}: 없는 claim ${c}`);
  }
  return errors;
}

// ---- 배치 ----

/** SVG 좌표 상수(viewBox 단위). 층 줄은 왼쪽 상자, 리본은 그 오른쪽 세로 통로를 지난다 */
export const MAP = {
  pad: 8,
  boxRight: 214,
  laneGap: 42,
  rowH: 40,
  rowGap: 22,
  /** 사이 층을 건너뛸 때(B3 → B7) 더 띄운다 */
  skipGap: 44,
} as const;

export type Point = readonly [x: number, y: number];

export type RouteLayout = {
  routeId: string;
  width: number;
  height: number;
  /** 경로가 지나는 층(위에서 아래), 줄 가운데 y와 그 층에서 처음 만나는 장소 */
  floors: { floor: FloorId; y: number; place?: string; skipBefore: boolean }[];
  points: Point[];
  /** SVG path d (pathLength="1"로 그린다) */
  d: string;
  /** 단계 i가 끝나는 지점의 길이 비율(0~1]. 리본 dashoffset = 1 - stepEnds[i] */
  stepEnds: number[];
  /** 출발점(step -1)과 각 단계 끝점 */
  stops: { node: string; x: number; y: number; step: number }[];
  /** 게이트 구간의 가운데 */
  gates: Point[];
};

export function layoutRoute(station: Station, routeId: string): RouteLayout {
  const route = station.routes.find((r) => r.id === routeId);
  if (!route) throw new Error(`route 없음: ${routeId}`);
  const node = (id: string) => {
    const n = station.nodes.find((x) => x.id === id);
    if (!n) throw new Error(`node 없음: ${id}`);
    return n;
  };
  const path = route.path.map(node);

  const used = FLOORS.filter((f) => path.some((n) => n.floor === f));
  const floors: RouteLayout["floors"] = [];
  let y = MAP.pad + MAP.rowH / 2;
  used.forEach((floor, i) => {
    const prev = used[i - 1];
    const skipBefore = !!prev && FLOOR_LEVEL[prev] - FLOOR_LEVEL[floor] > 1;
    if (i > 0) y += MAP.rowH + (skipBefore ? MAP.skipGap : MAP.rowGap);
    floors.push({
      floor,
      y,
      place: path.find((n) => n.floor === floor && n.place)?.id,
      skipBefore,
    });
  });
  const floorY = new Map(floors.map((f) => [f.floor, f.y]));

  const points: Point[] = path.map((n) => [
    MAP.boxRight + n.lane * MAP.laneGap,
    floorY.get(n.floor)!,
  ]);
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]!;
    const [x1, y1] = points[i]!;
    cum.push(cum[i - 1]! + Math.hypot(x1 - x0, y1 - y0));
  }
  const total = cum.at(-1)!;
  const round = (v: number) => Math.round(v * 1e4) / 1e4;

  const stepIdx = route.steps.map((s) => route.path.indexOf(s.to));
  const stops = [0, ...stepIdx].map((i, k) => ({
    node: route.path[i]!,
    x: points[i]![0],
    y: points[i]![1],
    step: k - 1,
  }));

  const gates: Point[] = [];
  for (let i = 1; i < path.length; i++) {
    if (findEdge(station, path[i - 1]!.id, path[i]!.id)?.kind === "gate") {
      const [x0, y0] = points[i - 1]!;
      const [x1, y1] = points[i]!;
      gates.push([(x0 + x1) / 2, (y0 + y1) / 2]);
    }
  }

  const maxLane = Math.max(...path.map((n) => n.lane));
  return {
    routeId,
    width: MAP.boxRight + maxLane * MAP.laneGap + MAP.pad * 2,
    height: y + MAP.rowH / 2 + MAP.pad,
    floors,
    points,
    d: "M" + points.map(([x, py]) => `${x} ${py}`).join(" L"),
    stepEnds: stepIdx.map((i) => round(cum[i]! / total)),
    stops,
    gates,
  };
}
