// 공유 미리보기 PNG를 한 번 만들어 public/og.png에 커밋한다(빌드마다 돌리지 않음). 실행: node scripts/make-og.mts
import { chromium } from "@playwright/test";
import { ogSvg } from "./og.svg.mts";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(`<body style="margin:0">${ogSvg()}</body>`);
await page.locator("svg").screenshot({ path: "public/og.png" });
await browser.close();
console.log("og: public/og.png");
