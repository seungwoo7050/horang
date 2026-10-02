// 화면에 쓰는 브랜드 이미지(public/brand, scripts/make-brand.mts가 만든다)의 경로와 픽셀 크기.
// 크기는 화면에 보이는 가장 큰 크기의 약 2배다. <img width/height>와 파생본 스크립트가 같은 값을 쓴다.
export const BRAND_IMAGES = {
  // 첫 화면 히어로(136px 높이)·404(168px 높이). 몸 전체, 원본 눈 구멍·깎인 줄무늬를 보수했다
  mascot: { src: "/brand/mascot.webp", width: 258, height: 336 },
  // 도움 맥락 패널의 머리·어깨(72px)
  "mascot-bust": { src: "/brand/mascot-bust.webp", width: 144, height: 144 },
  // 첫 화면 머리의 워드마크(18px 높이). cream = 어두운 화면, navy = 밝은 화면
  "wordmark-cream": { src: "/brand/wordmark-cream.webp", width: 208, height: 36 },
  "wordmark-navy": { src: "/brand/wordmark-navy.webp", width: 208, height: 36 },
  // 언어 고르기 첫 주소(/)의 로고(44px 높이). 호랑이 마크의 뚫린 눈을 채웠다
  "logo-cream": { src: "/brand/logo-cream.webp", width: 456, height: 88 },
  "logo-navy": { src: "/brand/logo-navy.webp", width: 456, height: 88 },
} as const;

export type BrandImage = keyof typeof BRAND_IMAGES;

/** 오프라인 미리 캐시에 더해지는 브랜드 이미지 전체 상한(바이트). 넘으면 테스트가 알린다 */
export const BRAND_BUDGET_BYTES = 100 * 1024;
