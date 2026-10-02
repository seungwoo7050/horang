// 공유 미리보기 PNG(1200×630)를 한 번 만들어 public/og.png에 커밋한다(빌드마다 돌리지 않음).
// 실행: node scripts/make-og.mts <브랜드 원본 폴더>(make-brand.mts와 같은 폴더)
// 왼쪽에 손 흔드는 마스코트, 오른쪽에 워드마크(크림). 그 아래로 리본 한 줄이 정류점을 지나 목적지 고리로 이어진다.
// 워드마크는 그림이라 기기 글꼴과 어긋나지 않는다(글자를 직접 굽지 않는다). 색은 다크 토큰 값(bg, ribbon)과 브랜드 크림.
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

const SRC = brandSource();
const C = { bg: "#0b1020", ribbon: "#ffb547" };
const W = 1200;
const H = 630;
// 마스코트: 왼쪽, 높이 540(원본 1600 → 0.3375배), 아래 여백 30
const M = { x: 70, h: 540 };
// 워드마크: 높이 96(글자 영역), 리본은 그 아래
const WM = { x: 560, y: 214, h: 96 };
const RIBBON = { y: 392, x0: 260, x1: 1060, stops: [700, 880], width: 14 };

const { browser, page } = await openCanvas();
const report = await page.evaluate(
  async ({ files, fix, C, W, H, M, WM, RIBBON }) => {
    const w = window as unknown as Record<string, OffscreenCanvas> & { brand: BrandPixels };
    const b = w.brand;
    const m = await b.load(files.mascot);
    b.fixMascot(m, fix);
    const [x0, y0, x1, y1] = b.bbox(m);
    const mw = Math.round(((x1 - x0 + 1) * M.h) / (y1 - y0 + 1));
    const mascot = b.resized(m, [x0, y0, x1 - x0 + 1, y1 - y0 + 1], [mw, M.h]);

    const wm = await b.load(files.wordmark);
    const [wx0, wy0, wx1, wy1] = b.bbox(wm, 128);
    const ww = Math.round(((wx1 - wx0 + 1) * WM.h) / (wy1 - wy0 + 1));
    const word = b.resized(wm, [wx0, wy0, wx1 - wx0 + 1, wy1 - wy0 + 1], [ww, WM.h]);

    const c = new OffscreenCanvas(W, H);
    const x = c.getContext("2d")!;
    x.fillStyle = C.bg;
    x.fillRect(0, 0, W, H);
    // 리본(빛은 리본에만, 앱의 ribbon-glow와 같은 색): 마스코트 몸 뒤에서 나와 오른쪽 목적지 고리로
    x.save();
    x.shadowColor = "rgb(255 181 71 / 0.45)";
    x.shadowBlur = 24;
    x.strokeStyle = C.ribbon;
    x.lineWidth = RIBBON.width;
    x.lineCap = "round";
    x.beginPath();
    x.moveTo(RIBBON.x0, RIBBON.y);
    x.lineTo(RIBBON.x1 - 34, RIBBON.y);
    x.stroke();
    x.beginPath();
    x.arc(RIBBON.x1, RIBBON.y, 26, 0, Math.PI * 2);
    x.lineWidth = 10;
    x.stroke();
    x.restore();
    // 정류점: 리본 위 빈 점(앱 개념도와 같은 말투)
    x.fillStyle = C.bg;
    for (const sx of RIBBON.stops) {
      x.beginPath();
      x.arc(sx, RIBBON.y, 5, 0, Math.PI * 2);
      x.fill();
    }
    x.drawImage(mascot, M.x, H - M.h - 30);
    x.drawImage(word, WM.x, WM.y);
    w.og = c;
    return { mascot: [mw, M.h], wordmark: [ww, WM.h] };
  },
  {
    files: {
      mascot: dataUrl(join(SRC, FILES.mascot)),
      wordmark: dataUrl(join(SRC, FILES.wordmark)),
    },
    fix: MASCOT_FIX,
    C,
    W,
    H,
    M,
    WM,
    RIBBON,
  },
);
const bytes = await save(page, "og", "public/og.png", "image/png");
console.log(JSON.stringify(report), `public/og.png ${W}×${H} ${bytes}B`);
await browser.close();
