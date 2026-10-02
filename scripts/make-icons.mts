// 앱 아이콘을 한 번 만들어 public/icons에 커밋한다(빌드마다 돌리지 않음).
// 실행: node scripts/make-icons.mts <브랜드 원본 폴더>(make-brand.mts와 같은 폴더)
// 홈 화면 아이콘(manifest·apple-touch·maskable)은 마스코트 PNG의 머리와 어깨, 파비콘(icon.svg)은 작은 SVG 얼굴.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  FILES,
  MASCOT_FIX,
  brandSource,
  dataUrl,
  openCanvas,
  save,
  type BrandPixels,
} from "./brand.mts";
import { iconSvg } from "./icon.svg.mts";

const SRC = brandSource();
const OUT = "public/icons";
// 다크 bg 토큰(globals.css), 앱을 연 첫 화면·스플래시와 같은 색
const BG = "#0b1020";
// 원본 좌표 [x, y, 한 변]. any: 귀까지 머리가 폭의 약 74%, 아래는 가장자리에서 잘린다(손 흔드는 앞발 포함).
// maskable: 안전 영역(가운데 지름 80% 원) 안에 귀까지 들어가게 더 넓게(머리 폭 약 60%)
const CROP = { any: [130, -150, 1300], maskable: [-30, -250, 1600] } as const;
const targets = [
  { file: "icon-192.png", size: 192, crop: CROP.any },
  { file: "icon-512.png", size: 512, crop: CROP.any },
  { file: "icon-maskable-512.png", size: 512, crop: CROP.maskable },
  { file: "apple-touch-icon.png", size: 180, crop: CROP.any },
];

writeFileSync(`${OUT}/icon.svg`, iconSvg());
const { browser, page } = await openCanvas();
await page.evaluate(
  async ({ src, fix, targets, bg }) => {
    const w = window as unknown as Record<string, OffscreenCanvas> & { brand: BrandPixels };
    const m = await w.brand.load(src);
    w.brand.fixMascot(m, fix);
    for (const t of targets) w[t.file] = w.brand.iconCanvas(m, t.crop, t.size, bg);
  },
  { src: dataUrl(join(SRC, FILES.mascot)), fix: MASCOT_FIX, targets, bg: BG },
);
for (const t of targets) {
  const bytes = await save(page, t.file, `${OUT}/${t.file}`, "image/png");
  console.log(`${t.file} ${t.size}×${t.size} ${bytes}B`);
}
await browser.close();
