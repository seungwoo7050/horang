// 화면에 쓰는 브랜드 이미지(public/brand, scripts/make-brand.mts가 만든다)의 경로와 픽셀 크기.
// 크기는 화면에 보이는 가장 큰 크기의 약 2배다. <img width/height>와 파생본 스크립트가 같은 값을 쓴다.
export const BRAND_IMAGES = {
  // 첫 화면 히어로(136px 높이)·404(168px 높이). 몸 전체. 원본 눈 구멍·깎인 줄무늬·잘린 앞발을 보수했다
  mascot: { src: "/brand/mascot.webp", width: 276, height: 336 },
  // 도움 맥락 패널의 머리·어깨(72px)
  "mascot-bust": { src: "/brand/mascot-bust.webp", width: 144, height: 144 },
  // 첫 화면 머리의 워드마크(18px 높이). cream = 어두운 화면, navy = 밝은 화면
  "wordmark-cream": { src: "/brand/wordmark-cream.webp", width: 208, height: 36 },
  "wordmark-navy": { src: "/brand/wordmark-navy.webp", width: 208, height: 36 },
  // 언어 고르기 첫 주소(/)의 로고(44px 높이). 호랑이 마크의 뚫린 눈을 채웠다
  "logo-cream": { src: "/brand/logo-cream.webp", width: 456, height: 88 },
  "logo-navy": { src: "/brand/logo-navy.webp", width: 456, height: 88 },
  // 2차 에셋(2026-10-04, scripts/make-scenes.mts): 상황마다 다른 호랑이. 화면 하나에 하나만 쓴다.
  // -ink = 밝은 화면용(흰 물음표·음표를 네이비로). 짝은 크기가 같다
  // 404(120px 높이): 물음표를 띄우고 생각하는 호랑이
  "scene-help": { src: "/brand/scene-help.webp", width: 162, height: 240 },
  "scene-help-ink": { src: "/brand/scene-help-ink.webp", width: 162, height: 240 },
  // 서울역 경로 고르기(104px 높이): 지도를 펼친 호랑이
  "scene-explore": { src: "/brand/scene-explore.webp", width: 174, height: 208 },
  // 공항철도 서울역 출발(104px 높이): 캐리어를 끄는 호랑이
  "scene-travel": { src: "/brand/scene-travel.webp", width: 182, height: 208 },
  "scene-travel-ink": { src: "/brand/scene-travel-ink.webp", width: 182, height: 208 },
  // 해결·도착(120px 높이): 손 흔드는 호랑이
  "scene-welcome": { src: "/brand/scene-welcome.webp", width: 206, height: 240 },
  // 안심 칩(32px): 눈 감고 웃는 얼굴
  "face-calm": { src: "/brand/face-calm.webp", width: 70, height: 64 },
} as const;

export type BrandImage = keyof typeof BRAND_IMAGES;

/** 브랜드 색(globals.css --brand-cream·--brand-navy). 파생본 스크립트가 워드마크 글자를 이 두 색으로 바꾼다 */
export const BRAND_COLORS = { cream: "#f7f1e8", navy: "#0f172a" } as const;

/**
 * 오프라인 미리 캐시에 더해지는 브랜드 이미지 전체 상한(바이트). 넘으면 테스트가 알린다.
 * 2026-10-04 상황별 호랑이 7장(약 91KB)을 더하며 100KB에서 올렸다(미리 캐시 전체 약 2.1MB의 4%대)
 */
export const BRAND_BUDGET_BYTES = 160 * 1024;
