// 2차 브랜드 에셋(2026-10-04)의 상황별 호랑이 파생본을 한 번 만들어 public/brand에 커밋한다(빌드마다 돌리지 않음).
// 실행: node scripts/make-scenes.mts <원본 폴더>
// 원본: project-docs 브랜치 docs/design/brand-assets-2026-10-04/(character-*.png, expression-*.png)
// 그림마다 경계 상자(+여백)를 잘라 높이에 맞춰 줄인다. 너비는 비율로 정해지며 src/lib/brand-images.ts의 값과 같아야 한다
// (다르면 실패하고 맞는 값을 알려 준다: 화면의 <img width/height>가 자리를 먼저 잡는 값이다).
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { BRAND_IMAGES, type BrandImage } from "../src/lib/brand-images.ts";
import { NAVY, type BrandPixels, dataUrl, openCanvas, save } from "./brand.mts";

const SRC = process.argv[2] ?? process.env.HORANG_SCENES_SRC;
if (!SRC || !existsSync(join(SRC, "character-help.png"))) {
  console.error("원본 폴더를 주세요: node scripts/make-scenes.mts <brand-assets-2026-10-04 폴더>");
  process.exit(1);
}
mkdirSync("public/brand", { recursive: true });

/**
 * 파생본 이름 → 원본과 처리. ink: 밝은 화면용으로 흰 기호(물음표·음표)를 네이비로 칠한 짝을 같이 만든다.
 * cutFrom: 이 열부터 오른쪽을 지운다(지도 호랑이 원본 오른쪽 끝에 옆 그림의 조각이 붙어 잘렸다)
 */
const SCENES: { name: BrandImage; file: string; ink?: BrandImage; cutFrom?: number }[] = [
  { name: "scene-help", file: "character-help.png", ink: "scene-help-ink" },
  { name: "scene-explore", file: "character-explore.png", cutFrom: 199 },
  { name: "scene-travel", file: "character-travel.png", ink: "scene-travel-ink" },
  { name: "scene-welcome", file: "character-welcome.png" },
  { name: "face-calm", file: "expression-06.png" },
];
/** 경계 상자 둘레 여백(원본 px). 그림자·기호 끝이 잘리지 않게 */
const PAD = 3;
/** 이보다 옅은 픽셀은 지운다(불투명도 0~255) */
const FAINT = 8;

const { browser, page } = await openCanvas();
const report = await page.evaluate(
  async ({ scenes, files, navy, pad, faint, heights }) => {
    const b = (window as unknown as { brand: BrandPixels }).brand;
    const w = window as unknown as Record<string, OffscreenCanvas>;
    const out: Record<string, unknown> = {};
    for (const s of scenes) {
      const img = await b.load(files[s.name]!);
      const cleared = b.clearFaint(img, faint, s.cutFrom);
      const [x0, y0, x1, y1] = b.bbox(img, faint);
      const crop = [x0 - pad, y0 - pad, x1 - x0 + 1 + pad * 2, y1 - y0 + 1 + pad * 2];
      const oh = heights[s.name]!;
      const ow = Math.round((oh * crop[2]!) / crop[3]! / 2) * 2;
      w[s.name] = b.resized(img, crop, [ow, oh]);
      let ink = null;
      if (s.ink) {
        ink = b.inkGlyphs(img, navy);
        w[s.ink] = b.resized(img, crop, [ow, oh]);
      }
      out[s.name] = { cleared, crop, size: [ow, oh], ink };
    }
    return out;
  },
  {
    scenes: SCENES,
    files: Object.fromEntries(SCENES.map((s) => [s.name, dataUrl(join(SRC, s.file))])),
    navy: NAVY,
    pad: PAD,
    faint: FAINT,
    heights: Object.fromEntries(SCENES.map((s) => [s.name, BRAND_IMAGES[s.name].height])),
  },
);
console.log(JSON.stringify(report));

const wrong = SCENES.filter(
  (s) => (report[s.name] as { size: number[] }).size[0] !== BRAND_IMAGES[s.name].width,
);
if (wrong.length) {
  for (const s of wrong)
    console.error(
      `${s.name}: brand-images.ts width를 ${(report[s.name] as { size: number[] }).size[0]}로`,
    );
  await browser.close();
  process.exit(1);
}

for (const s of SCENES) {
  for (const name of [s.name, s.ink].filter(Boolean) as BrandImage[]) {
    const { src, width, height } = BRAND_IMAGES[name];
    const bytes = await save(page, name, `public${src}`, "image/webp", 0.88);
    console.log(`${name}.webp ${width}×${height} ${bytes}B`);
  }
}
await browser.close();
