// next build 뒤 out/를 읽어 서비스 워커(미리 캐시할 목록)를 만든다. 순수 함수만 두고 테스트한다.
import { createHash } from "node:crypto";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/** 배포에 들어가지만 서비스 워커가 미리 캐시하지 않는 파일(빌드 후 생성물·호스트 설정) */
const SKIP = new Set(["sw.js", "_headers", "_redirects"]);

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
      if (f.endsWith("/index.html")) return `/${f.slice(0, -"index.html".length)}`;
      return `/${f}`;
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
