import { seoulStation } from "./seoul-station";
import type { Station } from "./types";

// 외국인 여행자가 자주 찾는 주요 거점역 엘리베이터·환승 경로(B등급 공식 자료 기반, 현장 확인 전).
export const hongikStation: Station = {
  id: "hongik-univ",
  nodes: [
    { id: "hongik-arex-platform", floor: "B4", lane: 0, place: true },
    { id: "hongik-arex-el-b4", floor: "B4", lane: 1 },
    { id: "hongik-arex-concourse", floor: "B3", lane: 1, place: true },
    { id: "hongik-transfer-gate-b3", floor: "B3", lane: 2 },
    { id: "hongik-transfer-b2", floor: "B2", lane: 2 },
    { id: "hongik-line-2-platform", floor: "B2", lane: 0, place: true },
    { id: "hongik-line-2-el-b2", floor: "B2", lane: 1 },
    { id: "hongik-line-2-concourse", floor: "B1", lane: 1, place: true },
    { id: "hongik-exit-el-b1", floor: "B1", lane: 2 },
    { id: "hongik-exit-el-1f", floor: "1F", lane: 2 },
    { id: "hongik-exit-9", floor: "1F", lane: 0, place: true },
  ],
  edges: [
    { from: "hongik-arex-platform", to: "hongik-arex-el-b4", kind: "walk" },
    { from: "hongik-arex-el-b4", to: "hongik-arex-concourse", kind: "elevator" },
    { from: "hongik-arex-concourse", to: "hongik-transfer-gate-b3", kind: "gate" },
    { from: "hongik-transfer-gate-b3", to: "hongik-transfer-b2", kind: "elevator" },
    { from: "hongik-transfer-b2", to: "hongik-line-2-platform", kind: "walk" },
    { from: "hongik-line-2-platform", to: "hongik-line-2-el-b2", kind: "walk" },
    { from: "hongik-line-2-el-b2", to: "hongik-line-2-concourse", kind: "elevator" },
    { from: "hongik-line-2-concourse", to: "hongik-exit-el-b1", kind: "gate" },
    { from: "hongik-exit-el-b1", to: "hongik-exit-el-1f", kind: "elevator" },
    { from: "hongik-exit-el-1f", to: "hongik-exit-9", kind: "walk" },
  ],
  routes: [
    {
      id: "hongik-arex-to-line-2",
      path: [
        "hongik-arex-platform",
        "hongik-arex-el-b4",
        "hongik-arex-concourse",
        "hongik-transfer-gate-b3",
        "hongik-transfer-b2",
        "hongik-line-2-platform",
      ],
      steps: [
        { id: "hongik-up-b3", to: "hongik-arex-concourse" },
        {
          id: "hongik-transfer-b2",
          to: "hongik-line-2-platform",
          phrase: "station.where-transfer",
        },
      ],
      claims: ["station.hongik.arex-to-line-2"],
    },
    {
      id: "hongik-line-2-to-exit-9",
      path: [
        "hongik-line-2-platform",
        "hongik-line-2-el-b2",
        "hongik-line-2-concourse",
        "hongik-exit-el-b1",
        "hongik-exit-el-1f",
        "hongik-exit-9",
      ],
      steps: [
        { id: "hongik-up-b1", to: "hongik-line-2-concourse" },
        { id: "hongik-out-gate", to: "hongik-exit-el-b1" },
        { id: "hongik-up-exit-9", to: "hongik-exit-9" },
      ],
      claims: ["station.hongik.line-2-to-exit"],
    },
  ],
};

export const myeongdongStation: Station = {
  id: "myeong-dong",
  nodes: [
    { id: "myeongdong-platform", floor: "B3", lane: 0, place: true },
    { id: "myeongdong-el-b3", floor: "B3", lane: 1 },
    { id: "myeongdong-concourse", floor: "B2", lane: 1, place: true },
    { id: "myeongdong-exit-el-b2", floor: "B2", lane: 2 },
    { id: "myeongdong-exit-el-1f", floor: "1F", lane: 2 },
    { id: "myeongdong-exit-1", floor: "1F", lane: 0, place: true },
  ],
  edges: [
    { from: "myeongdong-platform", to: "myeongdong-el-b3", kind: "walk" },
    { from: "myeongdong-el-b3", to: "myeongdong-concourse", kind: "elevator" },
    { from: "myeongdong-concourse", to: "myeongdong-exit-el-b2", kind: "gate" },
    { from: "myeongdong-exit-el-b2", to: "myeongdong-exit-el-1f", kind: "elevator" },
    { from: "myeongdong-exit-el-1f", to: "myeongdong-exit-1", kind: "walk" },
  ],
  routes: [
    {
      id: "myeongdong-to-exit-1",
      path: [
        "myeongdong-platform",
        "myeongdong-el-b3",
        "myeongdong-concourse",
        "myeongdong-exit-el-b2",
        "myeongdong-exit-el-1f",
        "myeongdong-exit-1",
      ],
      steps: [
        { id: "myeongdong-up-b2", to: "myeongdong-concourse" },
        { id: "myeongdong-out-gate", to: "myeongdong-exit-el-b2" },
        { id: "myeongdong-up-1f", to: "myeongdong-exit-1" },
      ],
      claims: ["station.myeongdong.platform-to-exit"],
    },
  ],
};

export const gangnamStation: Station = {
  id: "gangnam",
  nodes: [
    { id: "gangnam-platform", floor: "B2", lane: 0, place: true },
    { id: "gangnam-el-b2", floor: "B2", lane: 1 },
    { id: "gangnam-concourse", floor: "B1", lane: 1, place: true },
    { id: "gangnam-exit-el-b1", floor: "B1", lane: 2 },
    { id: "gangnam-exit-el-1f", floor: "1F", lane: 2 },
    { id: "gangnam-exit-1", floor: "1F", lane: 0, place: true },
  ],
  edges: [
    { from: "gangnam-platform", to: "gangnam-el-b2", kind: "walk" },
    { from: "gangnam-el-b2", to: "gangnam-concourse", kind: "elevator" },
    { from: "gangnam-concourse", to: "gangnam-exit-el-b1", kind: "gate" },
    { from: "gangnam-exit-el-b1", to: "gangnam-exit-el-1f", kind: "elevator" },
    { from: "gangnam-exit-el-1f", to: "gangnam-exit-1", kind: "walk" },
  ],
  routes: [
    {
      id: "gangnam-to-exit-1",
      path: [
        "gangnam-platform",
        "gangnam-el-b2",
        "gangnam-concourse",
        "gangnam-exit-el-b1",
        "gangnam-exit-el-1f",
        "gangnam-exit-1",
      ],
      steps: [
        { id: "gangnam-up-b1", to: "gangnam-concourse" },
        { id: "gangnam-out-gate", to: "gangnam-exit-el-b1" },
        { id: "gangnam-up-1f", to: "gangnam-exit-1" },
      ],
      claims: ["station.gangnam.line-2-to-exit"],
    },
  ],
};

export const seongsuStation: Station = {
  id: "seongsu",
  nodes: [
    { id: "seongsu-platform", floor: "3F", lane: 0, place: true },
    { id: "seongsu-el-3f", floor: "3F", lane: 1 },
    { id: "seongsu-concourse", floor: "2F", lane: 1, place: true },
    { id: "seongsu-exit-el-2f", floor: "2F", lane: 2 },
    { id: "seongsu-exit-el-1f", floor: "1F", lane: 2 },
    { id: "seongsu-exit-3", floor: "1F", lane: 0, place: true },
  ],
  edges: [
    { from: "seongsu-platform", to: "seongsu-el-3f", kind: "walk" },
    { from: "seongsu-el-3f", to: "seongsu-concourse", kind: "elevator" },
    { from: "seongsu-concourse", to: "seongsu-exit-el-2f", kind: "gate" },
    { from: "seongsu-exit-el-2f", to: "seongsu-exit-el-1f", kind: "elevator" },
    { from: "seongsu-exit-el-1f", to: "seongsu-exit-3", kind: "walk" },
  ],
  routes: [
    {
      id: "seongsu-to-exit-3",
      path: [
        "seongsu-platform",
        "seongsu-el-3f",
        "seongsu-concourse",
        "seongsu-exit-el-2f",
        "seongsu-exit-el-1f",
        "seongsu-exit-3",
      ],
      steps: [
        { id: "seongsu-down-2f", to: "seongsu-concourse" },
        { id: "seongsu-out-gate", to: "seongsu-exit-el-2f" },
        { id: "seongsu-down-1f", to: "seongsu-exit-3" },
      ],
      claims: ["station.seongsu.platform-to-exit"],
    },
  ],
};

export const hubStations = [
  seoulStation,
  hongikStation,
  myeongdongStation,
  gangnamStation,
  seongsuStation,
] as const;
