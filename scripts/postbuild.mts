// next build 뒤에 돈다(package.json postbuild): out/sw.js 생성.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildVersion,
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
