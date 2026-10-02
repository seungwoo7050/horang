// next build 뒤에 돈다(package.json postbuild): out/sw.js와 out/_headers(CSP 등) 생성.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildVersion,
  headersFile,
  htmlRoute,
  injectMetaCsp,
  isAppFile,
  listFiles,
  precacheUrls,
  renderServiceWorker,
} from "./postbuild-lib.mts";

const OUT = "out";
const files = listFiles(OUT).filter(isAppFile);
const urls = precacheUrls(files);
const version = buildVersion(files.map((f) => ({ path: f, content: readFileSync(join(OUT, f)) })));
const template = readFileSync("scripts/sw.template.js", "utf8");
writeFileSync(join(OUT, "sw.js"), renderServiceWorker(template, version, urls));
console.log(`✓ sw.js: ${urls.length}개 미리 캐시, 버전 ${version}`);

// 404 화면은 없는 주소 전체에 쓰여 경로 규칙을 붙일 수 없다: _headers 대신 HTML 안의 meta CSP로
const NOT_FOUND = ["404.html", "404/index.html", "_not-found/index.html"];
for (const f of NOT_FOUND.filter((f) => existsSync(join(OUT, f)))) {
  writeFileSync(join(OUT, f), injectMetaCsp(readFileSync(join(OUT, f), "utf8")));
}
console.log(`✓ 404 화면 CSP(meta) ${NOT_FOUND.filter((f) => existsSync(join(OUT, f))).length}개`);
const pages = files
  .filter((f) => f.endsWith(".html") && !NOT_FOUND.includes(f))
  .map((f) => ({ route: htmlRoute(f), html: readFileSync(join(OUT, f), "utf8") }));
writeFileSync(join(OUT, "_headers"), headersFile(pages));
console.log(`✓ _headers: 페이지 CSP ${pages.length}개`);
