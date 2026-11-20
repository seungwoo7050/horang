import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import {
  evaluateBundleBudget,
  type BundleAssetStat,
} from "../src/lib/devops/synthetic-probe.ts";

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const targetDirArgIndex = args.findIndex((arg) => !arg.startsWith("--"));
const targetDir =
  (targetDirArgIndex !== -1 ? args[targetDirArgIndex] : undefined) ?? "out";

function collectAssets(dir: string, baseDir = dir): BundleAssetStat[] {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  const stats: BundleAssetStat[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      stats.push(...collectAssets(fullPath, baseDir));
    } else if (entry.isFile()) {
      const rel = relative(baseDir, fullPath).split(sep).join("/");
      if (rel === "og.png" || rel.endsWith(".map")) continue;
      let routePath = "/" + rel;
      if (rel === "index.html") {
        routePath = "/";
      } else if (rel.endsWith("/index.html")) {
        routePath = "/" + rel.slice(0, -"/index.html".length) + "/";
      }

      const fileStat = statSync(fullPath);
      stats.push({
        path: routePath,
        size: fileStat.size,
      });
    }
  }
  return stats;
}

let assets: BundleAssetStat[] = [];

if (existsSync(targetDir)) {
  assets = collectAssets(targetDir);
} else if (isDryRun || !process.env.CI) {
  assets = [
    { path: "/", size: 12_000 },
    { path: "/en/gate/", size: 14_000 },
    { path: "/en/card/", size: 15_000 },
    { path: "/en/arex/", size: 16_000 },
    { path: "/en/station/", size: 13_000 },
    { path: "/en/transit/", size: 11_000 },
    { path: "/en/dining/", size: 17_000 },
    { path: "/en/emergency/", size: 12_000 },
    { path: "/en/staff/", size: 10_000 },
    { path: "/sw.js", size: 6_000 },
    { path: "/manifest.webmanifest", size: 2_000 },
    { path: "/_next/static/chunks/app.js", size: 150 * 1024 },
  ];
} else {
  console.error(`[check:budget] 오류: ${targetDir} 디렉터리가 존재하지 않습니다.`);
  process.exit(1);
}

const report = evaluateBundleBudget(assets);

if (!report.passed) {
  console.error("[check:budget] 번들 예산 또는 필수 오프라인 경로 검증 실패:");
  for (const v of report.violations) {
    console.error(`  - ${v}`);
  }
  process.exit(1);
}

console.log(
  `[check:budget] 통과 (에셋 ${report.totalAssets}개, 프리캐시 ${(report.totalBytes / 1024).toFixed(1)} KB, JS ${(report.totalJsBytes / 1024).toFixed(1)} KB)`,
);
