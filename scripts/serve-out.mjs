// e2e·오프라인 확인용 정적 서버. Cloudflare 정적 자산처럼 폴더는 "/경로/"로 열고, 슬래시 없는 폴더 주소는 308로 보낸다.
// out/_headers도 Cloudflare처럼 적용한다(정확한 경로와 끝이 *인 규칙만 — 우리가 만드는 형태).
// 실행: node scripts/serve-out.mjs [port]
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const ROOT = "out";
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};

function parseHeaders() {
  const file = join(ROOT, "_headers");
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const [pattern, ...lines] = block.split("\n");
      const headers = Object.fromEntries(
        lines
          .map((l) => l.trim())
          .map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 1).trim()]),
      );
      return { pattern: pattern.trim(), headers };
    });
}
const RULES = parseHeaders();

function headersFor(pathname) {
  const out = {};
  for (const { pattern, headers } of RULES) {
    const hit = pattern.endsWith("*")
      ? pathname.startsWith(pattern.slice(0, -1))
      : pathname === pattern;
    if (hit) Object.assign(out, headers);
  }
  return out;
}

function send(res, status, file, pathname = "") {
  res.writeHead(status, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    ...headersFor(pathname),
  });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(ROOT, path);
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.pathname.endsWith("/")) {
      res.writeHead(308, { location: `${url.pathname}/${url.search}` });
      return res.end();
    }
    file = join(file, "index.html");
  }
  if (existsSync(file) && statSync(file).isFile()) return send(res, 200, file, url.pathname);
  send(res, 404, join(ROOT, "404.html"), url.pathname);
}).listen(PORT, () => console.log(`out/ → http://localhost:${PORT}`));
