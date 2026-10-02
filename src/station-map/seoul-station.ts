import type { Station } from "./types";

// 서울역 공항철도 구역 경로(research/PHASE_R_SEOUL_STATION.md §2-1·§4, KRIC 이동경로).
// 모두 공식 자료(B)이고 현장 확인 전이다. 환승게이트 위치(B3 환승통로 입구인지)는 미확인이라
// 경로 위의 "gate" 구간으로만 두고 정확한 자리를 그리지 않는다.
export const seoulStation: Station = {
  id: "seoul-station",
  nodes: [
    { id: "arex-platform", floor: "B7", lane: 0, place: true },
    { id: "arex-elevator-b7", floor: "B7", lane: 1 },
    { id: "arex-concourse", floor: "B3", lane: 1, place: true },
    { id: "corridor-elevator-b3", floor: "B3", lane: 2 },
    { id: "corridor-elevator-b1", floor: "B1", lane: 2 },
    { id: "lines-1-4-concourse", floor: "B1", lane: 1, place: true },
    { id: "line-4-elevator-b2", floor: "B2", lane: 1 },
    { id: "line-4-platform", floor: "B2", lane: 0, place: true },
    { id: "line-1-elevator-b2", floor: "B2", lane: 1 },
    { id: "line-1-platform", floor: "B2", lane: 0, place: true },
    { id: "exit-elevator-b3", floor: "B3", lane: 2 },
    { id: "exit-elevator-1f", floor: "1F", lane: 2 },
    { id: "exit-15", floor: "1F", lane: 0, place: true },
  ],
  edges: [
    { from: "arex-platform", to: "arex-elevator-b7", kind: "walk" },
    // 엘리베이터가 B6에 서지 않고 B3로 바로 간다(AREX 블로그, 오래됨)
    { from: "arex-elevator-b7", to: "arex-concourse", kind: "elevator" },
    // 환승게이트 → 1·4호선 방향 환승통로
    { from: "arex-concourse", to: "corridor-elevator-b3", kind: "gate" },
    { from: "corridor-elevator-b3", to: "corridor-elevator-b1", kind: "elevator" },
    { from: "corridor-elevator-b1", to: "lines-1-4-concourse", kind: "walk" },
    { from: "lines-1-4-concourse", to: "line-4-elevator-b2", kind: "elevator" },
    { from: "line-4-elevator-b2", to: "line-4-platform", kind: "walk" },
    { from: "lines-1-4-concourse", to: "line-1-elevator-b2", kind: "elevator" },
    { from: "line-1-elevator-b2", to: "line-1-platform", kind: "walk" },
    // 표 내는 곳(개찰구) → 15번 출구 엘리베이터
    { from: "arex-concourse", to: "exit-elevator-b3", kind: "gate" },
    { from: "exit-elevator-b3", to: "exit-elevator-1f", kind: "elevator" },
    { from: "exit-elevator-1f", to: "exit-15", kind: "walk" },
  ],
  routes: [
    {
      id: "arex-to-line-4",
      path: [
        "arex-platform",
        "arex-elevator-b7",
        "arex-concourse",
        "corridor-elevator-b3",
        "corridor-elevator-b1",
        "lines-1-4-concourse",
        "line-4-elevator-b2",
        "line-4-platform",
      ],
      steps: [
        { id: "up-to-b3", to: "arex-concourse" },
        {
          id: "transfer-corridor",
          to: "lines-1-4-concourse",
          unconfirmed: "transfer-gate",
          phrase: "station.where-transfer",
        },
        { id: "down-to-platform", to: "line-4-platform" },
      ],
      claims: [
        "seoul-station.route.arex-to-lines-1-4",
        "arex.transfer-gate",
        "seoul-station.arex.floors",
        "seoul-station.lines-1-4.floors",
      ],
    },
    {
      id: "arex-to-line-1",
      path: [
        "arex-platform",
        "arex-elevator-b7",
        "arex-concourse",
        "corridor-elevator-b3",
        "corridor-elevator-b1",
        "lines-1-4-concourse",
        "line-1-elevator-b2",
        "line-1-platform",
      ],
      steps: [
        { id: "up-to-b3", to: "arex-concourse" },
        {
          id: "transfer-corridor",
          to: "lines-1-4-concourse",
          unconfirmed: "transfer-gate",
          phrase: "station.where-transfer",
        },
        // 1호선 쪽 KRIC 자료는 지상 2층 KTX 맞이방을 거친다고 적는다(§2-1, 현장 확인 대상)
        { id: "down-to-platform", to: "line-1-platform", unconfirmed: "line-1-elevator" },
      ],
      claims: [
        "seoul-station.route.arex-to-lines-1-4",
        "arex.transfer-gate",
        "seoul-station.arex.floors",
        "seoul-station.lines-1-4.floors",
      ],
    },
    {
      id: "arex-to-exit-15",
      path: [
        "arex-platform",
        "arex-elevator-b7",
        "arex-concourse",
        "exit-elevator-b3",
        "exit-elevator-1f",
        "exit-15",
      ],
      steps: [
        { id: "up-to-b3", to: "arex-concourse" },
        { id: "exit-gate", to: "exit-elevator-b3" },
        { id: "up-to-exit", to: "exit-15" },
      ],
      claims: ["seoul-station.route.arex-to-exit-15", "seoul-station.arex.floors"],
    },
  ],
};
