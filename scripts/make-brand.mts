// 화면용 브랜드 이미지를 한 번 만들어 public/brand에 커밋한다(빌드마다 돌리지 않음).
// 실행: node scripts/make-brand.mts <원본 폴더>
// 원본: project-docs 브랜치 docs/design/brand-assets-2026-10-02/(01-mascot/). 마스코트 몸 전체와 머리·어깨만 만든다
// 크기는 화면에 보이는 가장 큰 크기의 2배. 오프라인 미리 캐시에 들어가므로 WebP로 작게 둔다.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { BRAND_IMAGES, type BrandImage } from "../src/lib/brand-images.ts";
import {
  FILES,
  MASCOT_FIX,
  brandSource,
  type BrandPixels,
  dataUrl,
  openCanvas,
  save,
} from "./brand.mts";

const SRC = brandSource();
const OUT = "public/brand";
mkdirSync(OUT, { recursive: true });

/**
 * 이 스크립트가 만드는 파일 → [너비, 높이]. 화면의 <img width/height>와 같은 값(src/lib/brand-images.ts).
 * 워드마크·로고는 2차 에셋으로 바뀌어 make-lettering.mts가, 상황별 호랑이는 make-scenes.mts가 만든다
 */
const MINE = ["mascot", "mascot-bust"] as const satisfies readonly BrandImage[];
const SIZES = Object.fromEntries(
  MINE.map((k) => [k, [BRAND_IMAGES[k].width, BRAND_IMAGES[k].height]]),
) as Record<(typeof MINE)[number], [number, number]>;

const { browser, page } = await openCanvas();
const report = await page.evaluate(
  async ({ files, fix, sizes }) => {
    const b = (window as unknown as { brand: BrandPixels }).brand;
    const w = window as unknown as Record<string, OffscreenCanvas>;
    const out: Record<string, unknown> = {};

    // 마스코트: 눈 구멍 → 깎인 홈 → 잘린 앞발 순서로 고친다
    const m = await b.load(files.mascot);
    out.mascotFix = b.fixMascot(m, fix);
    const mb = b.bbox(m);
    out.mascotBox = mb;
    const [x0, y0, x1, y1] = mb;
    const bw = x1 - x0 + 1;
    const bh = y1 - y0 + 1;
    // 히어로: 몸 전체. 비율을 지키며 높이에 맞추고 가로 가운데
    const [hw, hh] = sizes.mascot;
    const cw = (bh * hw) / hh;
    w.mascot = b.resized(m, [x0 + bw / 2 - cw / 2, y0, cw, bh], [hw, hh]);
    // 머리와 어깨: 귀 위에 조금 여백을 두고 정사각형(아래는 패널 가장자리가 가린다). 원본 좌표
    w["mascot-bust"] = b.resized(m, [221, -24, 1058, 1058], sizes["mascot-bust"]);

    return out;
  },
  {
    files: {
      mascot: dataUrl(join(SRC, FILES.mascot)),
    },
    fix: MASCOT_FIX,
    sizes: SIZES,
  },
);
console.log(JSON.stringify(report));

for (const name of MINE) {
  const bytes = await save(page, name, `public${BRAND_IMAGES[name].src}`, "image/webp", 0.88);
  console.log(`${name}.webp ${SIZES[name].join("×")} ${bytes}B`);
}
await browser.close();
