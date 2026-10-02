// 화면용 브랜드 이미지를 한 번 만들어 public/brand에 커밋한다(빌드마다 돌리지 않음).
// 실행: node scripts/make-brand.mts <원본 폴더>
// 원본: project-docs 브랜치 docs/design/brand-assets-2026-10-02/(01-mascot/, 02-logo/)
// 크기는 화면에 보이는 가장 큰 크기의 2배. 오프라인 미리 캐시에 들어가므로 WebP로 작게 둔다.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { BRAND_IMAGES, type BrandImage } from "../src/lib/brand-images.ts";
import {
  CREAM,
  FILES,
  LOGO_EYE_BOX,
  MASCOT_FIX,
  NAVY,
  brandSource,
  type BrandPixels,
  dataUrl,
  openCanvas,
  save,
} from "./brand.mts";

const SRC = brandSource();
const OUT = "public/brand";
mkdirSync(OUT, { recursive: true });

/** 파일 이름 → [너비, 높이]. 화면의 <img width/height>와 같은 값(src/lib/brand-images.ts) */
const SIZES = Object.fromEntries(
  Object.entries(BRAND_IMAGES).map(([k, v]) => [k, [v.width, v.height]]),
) as Record<BrandImage, [number, number]>;

const { browser, page } = await openCanvas();
const report = await page.evaluate(
  async ({ files, fix, logoEyeBox, cream, navy, sizes }) => {
    type Img = ImageData;
    const b = (window as unknown as { brand: BrandPixels }).brand;
    const w = window as unknown as Record<string, OffscreenCanvas>;
    const out: Record<string, unknown> = {};

    // 마스코트: 눈 구멍 → 깎인 홈 순서로 고친다
    const m = await b.load(files.mascot);
    out.mascotEyes = b.fillHoles(m, fix.eye, fix.eyeBox);
    out.mascotNotches = b.patchUnder(m, fix.notches, fix.stripe);
    const mb = b.bbox(m);
    out.mascotBox = mb;
    const [x0, y0, x1, y1] = mb;
    const bw = x1 - x0 + 1;
    const bh = y1 - y0 + 1;
    // 히어로: 몸 전체. 비율을 지키며 높이에 맞추고 가로 가운데
    const [hw, hh] = sizes.mascot;
    const cw = (bh * hw) / hh;
    w.mascot = b.resized(m, [x0 + bw / 2 - cw / 2, y0, cw, bh], [hw, hh]);
    // 머리와 어깨: 귀 위에 조금 여백을 두고 정사각형(아래는 패널 가장자리가 가린다)
    const side = Math.round(bw * 0.86);
    w["mascot-bust"] = b.resized(m, [x0 + bw * 0.03, y0 - 24, side, side], sizes["mascot-bust"]);

    // 워드마크·로고: 크림 원본 그대로 / 라이트용은 글자 크림→네이비, 비행기 네이비→크림(서로 바꿔 모양을 지킨다).
    // 위아래 여백 6px, 가로는 출력 비율에 맞춰 양쪽으로 같게 늘린다(늘어나 보이지 않게)
    const lettering = (img: Img, name: string, minX: number) => {
      const [lx0, ly0, lx1, ly1] = b.bbox(img, 128);
      const [ow, oh] = sizes[`${name}-cream` as keyof typeof sizes];
      const ch = ly1 - ly0 + 1 + 12;
      const cw = (ch * ow) / oh;
      const crop = [(lx0 + lx1) / 2 - cw / 2, ly0 - 6, cw, ch];
      out[`${name}Crop`] = crop.map(Math.round);
      w[`${name}-cream`] = b.resized(img, crop, [ow, oh]);
      out[`${name}Swap`] = b.swapColors(
        img,
        [
          [cream, navy],
          [navy, cream],
        ],
        24,
        minX,
      );
      w[`${name}-navy`] = b.resized(img, crop, [ow, oh]);
    };
    lettering(await b.load(files.wordmark), "wordmark", 0);
    // 로고: 호랑이 마크의 뚫린 눈을 먼저 채운다(두 밝기 모두)
    const lg = await b.load(files.logo);
    out.logoEyes = b.fillHoles(lg, fix.eye, logoEyeBox);
    // 글자는 x 680부터(호랑이 마크 오른쪽 끝 약 650)
    lettering(lg, "logo", 680);
    return out;
  },
  {
    files: {
      mascot: dataUrl(join(SRC, FILES.mascot)),
      logo: dataUrl(join(SRC, FILES.logo)),
      wordmark: dataUrl(join(SRC, FILES.wordmark)),
    },
    fix: MASCOT_FIX,
    logoEyeBox: LOGO_EYE_BOX,
    cream: CREAM,
    navy: NAVY,
    sizes: SIZES,
  },
);
console.log(JSON.stringify(report));

for (const name of Object.keys(SIZES)) {
  const bytes = await save(
    page,
    name,
    `public${BRAND_IMAGES[name as BrandImage].src}`,
    "image/webp",
    0.88,
  );
  console.log(`${name}.webp ${SIZES[name as BrandImage].join("×")} ${bytes}B`);
}
await browser.close();
