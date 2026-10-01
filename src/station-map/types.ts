// 역 안내도 그래프(ARCHITECTURE.md §5). 문구는 담지 않는다 — 이름은 i18n의 map.places에서 id로 찾는다.

/** 이 앱이 그리는 층. 위에서 아래 순서 */
export const FLOORS = ["1F", "B1", "B2", "B3", "B7"] as const;
export type FloorId = (typeof FLOORS)[number];

/** 층 높이(1F = 0, Bn = -n). 차이가 1보다 크면 사이 층을 건너뛴다 */
export const FLOOR_LEVEL: Record<FloorId, number> = { "1F": 0, B1: -1, B2: -2, B3: -3, B7: -7 };

/** 그래프의 점. lane 0은 층 상자의 오른쪽 가장자리(장소), 1 이상은 그 오른쪽의 세로 통로 */
export type StationNode = {
  id: string;
  floor: FloorId;
  lane: number;
  /** 사람이 찾아가는 장소(승강장·대합실·출구). 이름이 있고, 층 줄에 이름을 쓴다 */
  place?: boolean;
};

/** elevator는 층을 오가고(같은 lane), walk·gate는 한 층 안에서 움직인다(같은 floor) */
export type EdgeKind = "elevator" | "walk" | "gate";

export type StationEdge = { from: string; to: string; kind: EdgeKind };

/** 단계 하나 = 경로 위의 한 점(to)까지 */
export type RouteStep = { id: string; to: string };

export type StationRoute = {
  id: string;
  /** 지나는 점 순서(첫 점과 끝 점은 장소) */
  path: string[];
  steps: RouteStep[];
  /** 이 경로를 뒷받침하는 claim id. 하나라도 A등급이 아니면 현장 미확인으로 표시한다 */
  claims: string[];
  /** 출처끼리 어긋나는 경로(화면에 주의 문구) */
  sourcesDisagree?: boolean;
};

export type Station = {
  id: string;
  nodes: StationNode[];
  edges: StationEdge[];
  routes: StationRoute[];
};
