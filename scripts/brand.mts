// 브랜드 에셋(사용자 제공 PNG, 2026-10-02)에서 파생본을 만드는 공용 부분. 원본은 project-docs 브랜치
// docs/design/brand-assets-2026-10-02/에 그대로 두고, 저장소에는 줄이고 고친 파생본만 커밋한다.
// 픽셀 처리는 scripts/brand-pixels.js(브라우저 안 canvas). make-brand·make-icons·make-og가 같이 쓴다.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Page } from "@playwright/test";
import { BRAND_COLORS } from "../src/lib/brand-images.ts";

/** 원본 폴더(01-mascot/, 02-logo/가 있는 곳). 첫 인자 또는 HORANG_BRAND_SRC */
export function brandSource(): string {
  const dir = process.argv[2] ?? process.env.HORANG_BRAND_SRC;
  if (!dir || !existsSync(join(dir, "01-mascot/tiger-guide-mascot.png"))) {
    console.error(
      "원본 폴더를 주세요. 예: git -C .docs show ... 로 꺼낸 brand-assets-2026-10-02 폴더\n" +
        "  node scripts/make-brand.mts <원본 폴더>",
    );
    process.exit(1);
  }
  return dir;
}

export const FILES = {
  mascot: "01-mascot/tiger-guide-mascot.png",
  logo: "02-logo/horang-logo.png",
  wordmark: "02-logo/horang-wordmark.png",
} as const;

/** 브랜드 색(제공 안내문의 워드마크 색 = globals.css --brand-cream, --brand-navy)을 [r, g, b]로 */
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
export const CREAM = rgb(BRAND_COLORS.cream);
export const NAVY = rgb(BRAND_COLORS.navy);

/**
 * 마스코트 원본의 배경 제거 흠(원본 좌표, 1600×1600). 사람이 눈으로 확인해 고른 자리다.
 * - 눈: 검은 눈이 배경과 함께 투명하게 뚫렸다 → 바깥과 이어지지 않은 구멍을 코 색으로 채운다
 * - 홈: 테두리에 닿은 줄무늬가 깎였다(오른쪽 뺨, 오른쪽 몸통) → 윤곽을 이어 그린 모양을 줄무늬 색으로 아래에 덧댄다
 * 머리와 팔 사이, 꼬리와 배낭 사이 같은 원래 틈은 건드리지 않는다
 * - 손: 들어 올린 팔이 그림 틀(x≈1405)에서 평평하게 잘렸다 → x 1402 열의 색을 둥근 앞발 모양으로 늘린다
 *   (다른 쪽 앞발도 손가락 없는 둥근 끝이다)
 */
export const MASCOT_FIX = {
  eyeBox: [560, 340, 1060, 560] as const,
  // 코의 어두운 부분(800~860, 515~555)에서 가장 많은 색
  eye: [0x18, 0x1d, 0x2c] as const,
  // 뺨 줄무늬(1180,400)와 같은 색
  stripe: [0x32, 0x2b, 0x33] as const,
  // 덧댈 모양(SVG 경로, 원본 좌표). 바깥 선은 홈 위아래 윤곽을 이어 그린 것이다
  notches: [
    // 오른쪽 뺨: 줄무늬가 머리 오른쪽 아래 모서리를 지난다. 머리와 팔 사이 틈은 남긴다
    "M1170 494 C1205 488 1238 494 1250 500 C1254 535 1246 568 1222 600 L1196 580 C1180 560 1162 530 1160 512 Z",
    // 오른쪽 몸통
    "M1100 1252 L1158 1230 C1163 1262 1163 1292 1157 1322 L1098 1306 Z",
    // 오른쪽 몸통 아래(발 위)
    "M1096 1424 L1114 1412 C1118 1428 1117 1444 1111 1458 L1096 1446 Z",
  ],
  paw: { x: 1402, reach: 96 },
};

/** 로고 원본(2400×800) 호랑이 마크의 눈 구멍 상자 */
export const LOGO_EYE_BOX = [250, 330, 520, 450] as const;

/** scripts/brand-pixels.js가 페이지에 만드는 window.brand(브라우저 안에서만 부른다) */
export type BrandPixels = {
  load(src: string): Promise<ImageData>;
  fillHoles(img: ImageData, rgb: readonly number[], box?: readonly number[]): number;
  patchUnder(img: ImageData, paths: readonly string[], rgb: readonly number[]): number;
  roundCut(img: ImageData, x: number, reach: number): [number, number, number];
  fixMascot(
    img: ImageData,
    fix: typeof MASCOT_FIX,
  ): { eyes: number; notches: number; paw: [number, number, number] };
  iconCanvas(img: ImageData, crop: readonly number[], size: number, bg: string): OffscreenCanvas;
  swapColors(
    img: ImageData,
    pairs: readonly (readonly [readonly number[], readonly number[]])[],
    tol: number,
    minX?: number,
  ): number[];
  bbox(img: ImageData, threshold?: number): [number, number, number, number];
  resized(img: ImageData, crop: readonly number[], out: readonly number[]): OffscreenCanvas;
  encode(
    canvas: OffscreenCanvas,
    type: string,
    quality?: number,
  ): Promise<{ type: string; base64: string }>;
};

export async function openCanvas() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.addScriptTag({ path: "scripts/brand-pixels.js" });
  return { browser, page };
}

export const dataUrl = (file: string) =>
  `data:image/png;base64,${readFileSync(file).toString("base64")}`;

export async function save(page: Page, handle: string, out: string, type: string, quality = 0.9) {
  const r = await page.evaluate(
    ([h, t, q]) => {
      const w = window as unknown as Record<string, OffscreenCanvas> & { brand: BrandPixels };
      return w.brand.encode(w[h]!, t, q);
    },
    [handle, type, quality] as [string, string, number],
  );
  if (r.type !== type) throw new Error(`${out}: ${type}로 인코딩되지 않음(${r.type})`);
  const buf = Buffer.from(r.base64, "base64");
  writeFileSync(out, buf);
  return buf.length;
}
