import { randomBytes } from "node:crypto";

export interface BundleAssetStat {
  path: string;
  size: number;
  gzipSize?: number;
}

export interface BundleBudgetConfig {
  maxSingleJsBytes: number;
  maxTotalPrecacheBytes: number;
  requiredOfflineRoutes: string[];
}

export interface BundleBudgetReport {
  passed: boolean;
  totalBytes: number;
  totalJsBytes: number;
  totalAssets: number;
  violations: string[];
  stats: BundleAssetStat[];
}

export const DEFAULT_BUDGET_CONFIG: BundleBudgetConfig = {
  maxSingleJsBytes: 550 * 1024, // 550KB per JS chunk (guards React 19 + Next 16 runtime ceiling)
  maxTotalPrecacheBytes: 14 * 1024 * 1024, // 14MB across all 7 languages + SVG station maps
  requiredOfflineRoutes: [
    "/",
    "/en/gate/",
    "/en/card/",
    "/en/arex/",
    "/en/station/",
    "/en/transit/",
    "/en/dining/",
    "/en/emergency/",
    "/en/staff/",
    "/sw.js",
    "/manifest.webmanifest",
  ],
};

export const SUPPORTED_LANGUAGES = [
  "en",
  "ja",
  "zh-CN",
  "zh-TW",
  "fr",
  "es",
  "ro",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export interface SyntheticProbeResult {
  offlineReady: boolean;
  traceparent: string;
  verifiedRoutes: string[];
  missingRoutes: string[];
  checkedAt: string;
}

function isJsChunk(filePath: string): boolean {
  const clean = (filePath.split("?")[0] ?? "").toLowerCase();
  return clean.endsWith(".js") || clean.endsWith(".mjs");
}

function normalizeRouteVariants(rawPath: string): string[] {
  const variants = new Set<string>();
  const clean = rawPath.replace(/\\/g, "/").replace(/^\.?\/?(out\/)?/, "");

  variants.add(rawPath);
  variants.add("/" + clean);
  variants.add(clean);

  if (clean === "" || clean === "index.html") {
    variants.add("/");
    variants.add("/index.html");
  } else if (clean.endsWith("/index.html")) {
    const route = "/" + clean.slice(0, -"/index.html".length) + "/";
    variants.add(route);
    variants.add(route.slice(0, -1));
  } else if (!clean.includes(".")) {
    const withTrailing = "/" + clean.replace(/\/+$/, "") + "/";
    const withoutTrailing = "/" + clean.replace(/\/+$/, "");
    variants.add(withTrailing);
    variants.add(withoutTrailing);
  }

  return Array.from(variants);
}

export function evaluateBundleBudget(
  assets: BundleAssetStat[],
  config?: Partial<BundleBudgetConfig>,
): BundleBudgetReport {
  const mergedConfig: BundleBudgetConfig = {
    ...DEFAULT_BUDGET_CONFIG,
    ...config,
    requiredOfflineRoutes:
      config?.requiredOfflineRoutes ??
      DEFAULT_BUDGET_CONFIG.requiredOfflineRoutes,
  };

  const violations: string[] = [];
  let totalBytes = 0;
  let totalJsBytes = 0;

  const normalizedRoutes = new Set<string>();

  for (const asset of assets) {
    totalBytes += asset.size;

    if (isJsChunk(asset.path)) {
      totalJsBytes += asset.size;
      if (asset.size > mergedConfig.maxSingleJsBytes) {
        violations.push(
          `JS 청크 크기 상한 초과: ${asset.path} (${asset.size} bytes > ${mergedConfig.maxSingleJsBytes} bytes)`,
        );
      }
    }

    for (const v of normalizeRouteVariants(asset.path)) {
      normalizedRoutes.add(v);
    }
  }

  if (totalBytes > mergedConfig.maxTotalPrecacheBytes) {
    violations.push(
      `전체 프리캐시 용량 상한 초과: ${totalBytes} bytes > ${mergedConfig.maxTotalPrecacheBytes} bytes`,
    );
  }

  for (const requiredRoute of mergedConfig.requiredOfflineRoutes) {
    const matches =
      normalizedRoutes.has(requiredRoute) ||
      (requiredRoute.endsWith("/") &&
        normalizedRoutes.has(requiredRoute.slice(0, -1))) ||
      (!requiredRoute.endsWith("/") &&
        normalizedRoutes.has(requiredRoute + "/"));

    if (!matches) {
      violations.push(`필수 오프라인 경로 누락: ${requiredRoute}`);
    }
  }

  return {
    passed: violations.length === 0,
    totalBytes,
    totalJsBytes,
    totalAssets: assets.length,
    violations,
    stats: assets,
  };
}

export function buildTraceParent(traceId?: string, spanId?: string): string {
  const validTraceId =
    traceId && /^[0-9a-f]{32}$/i.test(traceId) && !/^0+$/.test(traceId)
      ? traceId.toLowerCase()
      : randomBytes(16).toString("hex").toLowerCase();

  const validSpanId =
    spanId && /^[0-9a-f]{16}$/i.test(spanId) && !/^0+$/.test(spanId)
      ? spanId.toLowerCase()
      : randomBytes(8).toString("hex").toLowerCase();

  return `00-${validTraceId}-${validSpanId}-01`;
}

export function verifyOfflineReadinessManifest(
  cachedUrlsOrPaths: string[],
  traceId?: string,
): SyntheticProbeResult {
  const availableRoutes = new Set<string>();

  for (const item of cachedUrlsOrPaths) {
    for (const variant of normalizeRouteVariants(item)) {
      availableRoutes.add(variant);
    }
  }

  const requiredRoutes: string[] = [
    "/",
    "/sw.js",
    "/manifest.webmanifest",
    ...SUPPORTED_LANGUAGES.map((lang) => `/${lang}/`),
  ];

  const verifiedRoutes: string[] = [];
  const missingRoutes: string[] = [];

  for (const route of requiredRoutes) {
    const exists =
      availableRoutes.has(route) ||
      (route.endsWith("/") && availableRoutes.has(route.slice(0, -1))) ||
      (!route.endsWith("/") && availableRoutes.has(route + "/"));

    if (exists) {
      verifiedRoutes.push(route);
    } else {
      missingRoutes.push(route);
    }
  }

  const traceparent = buildTraceParent(traceId);

  return {
    offlineReady: missingRoutes.length === 0,
    traceparent,
    verifiedRoutes,
    missingRoutes,
    checkedAt: new Date().toISOString(),
  };
}
