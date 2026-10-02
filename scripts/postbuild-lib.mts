// next build 뒤 out/를 읽어 서비스 워커(미리 캐시할 목록)를 만든다. 순수 함수만 두고 테스트한다.
import { createHash } from "node:crypto";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * 배포에 들어가지만 서비스 워커가 미리 캐시하지 않는 파일: 빌드 후 생성물·호스트 설정, 그리고 404 화면
 * (Cloudflare가 /404.html을 /404로 307 보내서 미리 캐시가 통째로 실패한 적이 있다. 오프라인 대체 화면은 언어 첫 화면)
 */
const SKIP = new Set([
  "sw.js",
  "_headers",
  "_redirects",
  "404.html",
  "404/index.html",
  "_not-found/index.html",
]);

/**
 * Cloudflare가 서빙하는 정식 경로: 경로 조각마다 퍼센트 인코딩("$" → "%24").
 * 그대로 두면 Cloudflare가 307로 보내 미리 캐시(cache.addAll)가 실패한다. sw.template.js의 canonical()과 같아야 한다
 */
export const canonicalPath = (path: string) =>
  path
    .split("/")
    .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
    .join("/");

/** 미리 캐시·버전 계산 대상 파일 */
export const isAppFile = (f: string) => !SKIP.has(f) && !f.endsWith(".map");

export function listFiles(root: string, dir = root): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listFiles(root, path);
    return [relative(root, path).split(sep).join("/")];
  });
}

/** 파일 경로 → 요청 URL. 폴더의 index.html은 "/en/gate/"처럼 슬래시 URL로 캐시한다(trailingSlash) */
export function precacheUrls(files: string[]): string[] {
  return files
    .filter(isAppFile)
    .map((f) => {
      if (f === "index.html") return "/";
      if (f.endsWith("/index.html")) return canonicalPath(`/${f.slice(0, -"index.html".length)}`);
      return canonicalPath(`/${f}`);
    })
    .sort();
}

/** 내용이 바뀌면 바뀌는 버전(캐시 이름) */
export function buildVersion(entries: { path: string; content: Buffer | string }[]): string {
  const h = createHash("sha256");
  for (const e of [...entries].sort((a, b) => a.path.localeCompare(b.path))) {
    h.update(e.path).update("\0").update(e.content).update("\0");
  }
  return h.digest("hex").slice(0, 12);
}

export function renderServiceWorker(template: string, version: string, urls: string[]): string {
  for (const mark of ["__VERSION__", "__PRECACHE__"]) {
    if (template.split(mark).length !== 2)
      throw new Error(`템플릿에 ${mark}가 정확히 한 번 있어야 한다`);
  }
  return template
    .replace("__VERSION__", version)
    .replace("__PRECACHE__", JSON.stringify(urls, null, 2));
}

// ---- 보안 헤더(_headers, Cloudflare 정적 자산) ----
// 정적 export에는 nonce를 쓸 수 없어서(Next CSP 가이드: nonce는 동적 렌더링 필요)
// 페이지마다 인라인 스크립트의 sha256을 CSP에 넣는다.

/** Cloudflare _headers 한도(workers/static-assets/headers, 2026-10-02 확인) */
export const HEADERS_LIMITS = { rules: 100, lineChars: 2000 } as const;

export function inlineScriptHashes(html: string): string[] {
  const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1] ?? "")
    .filter((body) => body.length > 0)
    .map((body) => `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  return [...new Set(hashes)];
}

export function contentSecurityPolicy(scriptHashes: string[]): string {
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(" ")}`.trim(),
    // CSS는 파일로만. SVG 리본의 style 속성(dashoffset)만 인라인 허용
    "style-src 'self'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/** HTML 파일 경로 → 요청 경로("en/gate/index.html" → "/en/gate/"). index가 아닌 HTML은 그대로 */
export const htmlRoute = (file: string) =>
  file === "index.html"
    ? "/"
    : file.endsWith("/index.html")
      ? `/${file.slice(0, -10)}`
      : `/${file}`;

export function headersFile(pages: { route: string; html: string }[]): string {
  const blocks = [
    // 모든 응답 공통(같은 헤더를 여러 규칙에 두면 쉼표로 합쳐지므로 CSP는 페이지 규칙에만 둔다)
    [
      "/*",
      "X-Content-Type-Options: nosniff",
      "Referrer-Policy: strict-origin-when-cross-origin",
      "Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      "X-Frame-Options: DENY",
    ],
    ["/_next/static/*", "Cache-Control: public, max-age=31536000, immutable"],
    // 서비스 워커는 늘 새로 확인해야 새 버전이 퍼진다
    ["/sw.js", "Cache-Control: no-cache"],
    ...pages.map((p) => [
      p.route,
      `Content-Security-Policy: ${contentSecurityPolicy(inlineScriptHashes(p.html))}`,
    ]),
  ];
  if (blocks.length > HEADERS_LIMITS.rules) {
    throw new Error(`_headers 규칙 ${blocks.length}개 > ${HEADERS_LIMITS.rules}`);
  }
  const text = blocks.map(([route, ...lines]) => [route, ...lines.map((l) => `  ${l}`)].join("\n"));
  for (const line of text.join("\n").split("\n")) {
    if (line.length > HEADERS_LIMITS.lineChars) {
      throw new Error(
        `_headers 줄이 ${HEADERS_LIMITS.lineChars}자를 넘는다: ${line.slice(0, 60)}…`,
      );
    }
  }
  return text.join("\n\n") + "\n";
}
