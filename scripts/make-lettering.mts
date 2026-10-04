// 워드마크·로고 파생본(2차 에셋, 2026-10-04)을 한 번 만들어 public/brand에 커밋한다(빌드마다 돌리지 않음).
// 실행: node scripts/make-lettering.mts <원본 폴더>
// 원본: project-docs 브랜치 docs/design/brand-assets-2026-10-04/(logo-horang.png = 둥근 HORANG 글자와 A 안의 비행기,
// logo-tiger.png = 호랑이 얼굴 마크). 1차 워드마크·로고(각진 글자, 2026-10-02)를 대신한다.
// 색은 밝기를 따라 브랜드 두 색으로 다시 칠한다: cream = 어두운 화면(글자 크림, 비행기 네이비), navy = 밝은 화면(서로 바꿈).
// 로고는 얼굴과 글자를 한 줄로 붙인다. 크기는 src/lib/brand-images.ts와 같아야 한다(다르면 실패하고 맞는 값을 알려 준다).
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { BRAND_IMAGES, type BrandImage } from "../src/lib/brand-images.ts";
import { CREAM, NAVY, type BrandPixels, dataUrl, openCanvas, save } from "./brand.mts";

const SRC = process.argv[2] ?? process.env.HORANG_LETTERING_SRC;
if (!SRC || !existsSync(join(SRC, "logo-horang.png"))) {
  console.error(
    "원본 폴더를 주세요: node scripts/make-lettering.mts <brand-assets-2026-10-04 폴더>",
  );
  process.exit(1);
}
mkdirSync("public/brand", { recursive: true });

/** 이보다 옅은 픽셀은 지운다(불투명도 0~255, make-scenes.mts와 같은 기준) */
const FAINT = 8;
/** 워드마크 위아래 여백(글자 높이에 대한 비율) */
const PAD = 0.06;
/** 로고: 글자 높이 = 얼굴 높이 × LETTERS, 얼굴과 글자 사이 = 얼굴 높이 × GAP */
const LOGO = { LETTERS: 0.5, GAP: 0.12 };

const NAMES = ["wordmark-cream", "wordmark-navy", "logo-cream", "logo-navy"] as const;

const { browser, page } = await openCanvas();
const report = await page.evaluate(
  async ({ files, cream, navy, faint, pad, logo, sizes }) => {
    const b = (window as unknown as { brand: BrandPixels }).brand;
    const w = window as unknown as Record<string, OffscreenCanvas>;
    const out: Record<string, unknown> = {};

    // 글자: 밝기별로 다시 칠한 두 장(원본을 매번 새로 읽어 칠한다)
    const letters = async (dark: number[], light: number[]) => {
      const img = await b.load(files.wordmark);
      b.clearFaint(img, faint);
      const tone = b.twoTone(img, dark, light);
      return { img, tone, box: b.bbox(img, 128) };
    };
    const tones = {
      cream: await letters(navy, cream),
      navy: await letters(cream, navy),
    };
    out.tone = tones.cream.tone;
    const [x0, y0, x1, y1] = tones.cream.box;
    const lw = x1 - x0 + 1;
    const lh = y1 - y0 + 1;
    out.letters = [x0, y0, lw, lh];

    // 워드마크: 글자 둘레에 여백, 높이에 맞춰 줄인다
    const p = Math.round(lh * pad);
    const crop = [x0 - p, y0 - p, lw + p * 2, lh + p * 2];
    const [, wh] = sizes["wordmark-cream"];
    const ww = Math.round((wh * crop[2]!) / crop[3]! / 2) * 2;
    for (const k of ["cream", "navy"] as const)
      w[`wordmark-${k}`] = b.resized(tones[k].img, crop, [ww, wh]);
    out.wordmark = [ww, wh];

    // 로고: 얼굴(높이 전체) + 사이 + 글자(가운데 맞춤)
    const face = await b.load(files.face);
    b.clearFaint(face, faint);
    const [fx0, fy0, fx1, fy1] = b.bbox(face, faint);
    const [, h] = sizes["logo-cream"];
    const fw = Math.round(((fx1 - fx0 + 1) * h) / (fy1 - fy0 + 1));
    const faceCanvas = b.resized(face, [fx0, fy0, fx1 - fx0 + 1, fy1 - fy0 + 1], [fw, h]);
    const th = Math.round(h * logo.LETTERS);
    const tw = Math.round((lw * th) / lh);
    const gap = Math.round(h * logo.GAP);
    const width = Math.round((fw + gap + tw) / 2) * 2;
    for (const k of ["cream", "navy"] as const) {
      const text = b.resized(tones[k].img, [x0, y0, lw, lh], [tw, th]);
      w[`logo-${k}`] = b.compose(
        [
          { canvas: faceCanvas, x: 0, y: 0 },
          { canvas: text, x: fw + gap, y: Math.round((h - th) / 2) },
        ],
        [width, h],
      );
    }
    out.logo = [width, h];
    out.logoParts = { face: [fw, h], gap, letters: [tw, th] };
    return out;
  },
  {
    files: {
      wordmark: dataUrl(join(SRC, "logo-horang.png")),
      face: dataUrl(join(SRC, "logo-tiger.png")),
    },
    cream: CREAM,
    navy: NAVY,
    faint: FAINT,
    pad: PAD,
    logo: LOGO,
    sizes: Object.fromEntries(
      NAMES.map((n) => [n, [BRAND_IMAGES[n].width, BRAND_IMAGES[n].height]]),
    ) as Record<(typeof NAMES)[number], [number, number]>,
  },
);
console.log(JSON.stringify(report));

const made = { wordmark: report.wordmark as number[], logo: report.logo as number[] };
const wrong = NAMES.filter(
  (n) => made[n.split("-")[0] as "wordmark" | "logo"][0] !== BRAND_IMAGES[n].width,
);
if (wrong.length) {
  for (const n of wrong)
    console.error(
      `${n}: brand-images.ts width를 ${made[n.split("-")[0] as "wordmark" | "logo"][0]}로`,
    );
  await browser.close();
  process.exit(1);
}

for (const name of NAMES as readonly BrandImage[]) {
  const { src, width, height } = BRAND_IMAGES[name];
  const bytes = await save(page, name, `public${src}`, "image/webp", 0.9);
  console.log(`${name}.webp ${width}×${height} ${bytes}B`);
}
await browser.close();
