import { describe, expect, it } from "vitest";
import {
  SUPPORTED_LANGUAGES,
  buildTraceParent,
  evaluateBundleBudget,
  verifyOfflineReadinessManifest,
} from "../synthetic-probe";

describe("evaluateBundleBudget", () => {
  it("필수 오프라인 경로 및 /sw.js가 모두 존재하고 청크 크기가 예산 이내일 때 passed: true를 반환한다", () => {
    const validAssets = [
      { path: "/", size: 10_000 },
      { path: "/en/gate/", size: 15_000 },
      { path: "/en/card/", size: 12_000 },
      { path: "/en/arex/", size: 14_000 },
      { path: "/en/station/", size: 13_000 },
      { path: "/en/transit/", size: 11_000 },
      { path: "/en/dining/", size: 16_000 },
      { path: "/en/emergency/", size: 12_000 },
      { path: "/en/staff/", size: 10_000 },
      { path: "/sw.js", size: 8_000 },
      { path: "/manifest.webmanifest", size: 2_000 },
      { path: "/_next/static/chunks/main-abc.js", size: 180 * 1024 },
      { path: "/_next/static/chunks/framework-xyz.js", size: 220 * 1024 },
    ];

    const report = evaluateBundleBudget(validAssets);
    expect(report.passed).toBe(true);
    expect(report.violations).toHaveLength(0);
    expect(report.totalBytes).toBeGreaterThan(0);
    expect(report.totalJsBytes).toBe((180 + 220) * 1024 + 8_000);
  });

  it("특정 JS 청크가 상한(550KB)을 초과하거나 필수 경로(/en/staff/ 등)가 누락되었을 때 정확한 위반 사유를 검출한다", () => {
    const oversizedJsAssets = [
      { path: "/", size: 10_000 },
      { path: "/en/gate/", size: 15_000 },
      { path: "/en/card/", size: 12_000 },
      { path: "/en/arex/", size: 14_000 },
      { path: "/en/station/", size: 13_000 },
      { path: "/en/transit/", size: 11_000 },
      { path: "/en/dining/", size: 16_000 },
      { path: "/en/emergency/", size: 12_000 },
      { path: "/en/staff/", size: 10_000 },
      { path: "/sw.js", size: 8_000 },
      { path: "/manifest.webmanifest", size: 2_000 },
      { path: "/_next/static/chunks/huge-chunk.js", size: 580 * 1024 },
    ];

    const reportOversized = evaluateBundleBudget(oversizedJsAssets);
    expect(reportOversized.passed).toBe(false);
    expect(
      reportOversized.violations.some((v) => v.includes("huge-chunk.js")),
    ).toBe(true);

    const missingRouteAssets = [
      { path: "/", size: 10_000 },
      { path: "/en/gate/", size: 15_000 },
      { path: "/en/card/", size: 12_000 },
      { path: "/en/arex/", size: 14_000 },
      { path: "/en/station/", size: 13_000 },
      { path: "/en/transit/", size: 11_000 },
      { path: "/en/dining/", size: 16_000 },
      { path: "/en/emergency/", size: 12_000 },
      { path: "/sw.js", size: 8_000 },
      { path: "/manifest.webmanifest", size: 2_000 },
    ];

    const reportMissing = evaluateBundleBudget(missingRouteAssets);
    expect(reportMissing.passed).toBe(false);
    expect(
      reportMissing.violations.some((v) => v.includes("/en/staff/")),
    ).toBe(true);
  });
});

describe("Synthetic Probe and W3C TraceContext", () => {
  it("W3C traceparent 포맷(^00-[0-9a-f]{32}-[0-9a-f]{16}-01$)을 준수한다", () => {
    const traceparent = buildTraceParent();
    const w3cRegex = /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/;
    expect(traceparent).toMatch(w3cRegex);

    const fixedTraceId = "4bf92f3577b34da6a3ce929d0e0e4736";
    const fixedSpanId = "00f067aa0ba902b7";
    const fixedHeader = buildTraceParent(fixedTraceId, fixedSpanId);
    expect(fixedHeader).toBe(`00-${fixedTraceId}-${fixedSpanId}-01`);
  });

  it("7개 국어 오프라인 준비도를 검증한다", () => {
    const completeCache = [
      "/",
      "/sw.js",
      "/manifest.webmanifest",
      ...SUPPORTED_LANGUAGES.map((lang) => `/${lang}/`),
    ];

    const successResult = verifyOfflineReadinessManifest(completeCache);
    expect(successResult.offlineReady).toBe(true);
    expect(successResult.missingRoutes).toHaveLength(0);
    expect(successResult.traceparent).toMatch(
      /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/,
    );

    const incompleteCache = [
      "/",
      "/sw.js",
      "/manifest.webmanifest",
      "/en/",
      "/ja/",
    ];
    const failResult = verifyOfflineReadinessManifest(incompleteCache);
    expect(failResult.offlineReady).toBe(false);
    expect(failResult.missingRoutes).toContain("/zh-CN/");
  });
});
