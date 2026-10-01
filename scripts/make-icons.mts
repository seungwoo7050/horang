// 아이콘 PNG를 한 번 만들어 public/icons에 커밋한다(빌드마다 돌리지 않음). 실행: node scripts/make-icons.mts
import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { iconSvg } from "./icon.svg.mts";

const OUT = "public/icons";
const targets = [
  { file: "icon-192.png", size: 192, scale: 0.78 },
  { file: "icon-512.png", size: 512, scale: 0.78 },
  { file: "icon-maskable-512.png", size: 512, scale: 0.62 },
  { file: "apple-touch-icon.png", size: 180, scale: 0.78 },
];

writeFileSync(`${OUT}/icon.svg`, iconSvg(0.78));
const browser = await chromium.launch();
const page = await browser.newPage();
for (const t of targets) {
  await page.setViewportSize({ width: t.size, height: t.size });
  await page.setContent(
    `<body style="margin:0">${iconSvg(t.scale).replace("<svg ", `<svg width="${t.size}" height="${t.size}" `)}</body>`,
  );
  await page.locator("svg").screenshot({ path: `${OUT}/${t.file}` });
}
await browser.close();
console.log("icons:", targets.map((t) => t.file).join(", "));
