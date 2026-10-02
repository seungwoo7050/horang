import { BRAND_IMAGES, type BrandImage } from "@/lib/brand-images";
import styles from "./Brand.module.css";

// 사용자 제공 브랜드 에셋의 파생본(public/brand, scripts/make-brand.mts). 크기를 미리 줄인 WebP라
// 정적 export에서 next/image 최적화 서버 없이 그대로 쓴다. width/height로 자리를 먼저 잡아 레이아웃이 밀리지 않게 한다.

function BrandImg({ name, alt, className }: { name: BrandImage; alt: string; className?: string }) {
  const { src, width, height } = BRAND_IMAGES[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 정적 export, 이미 2배 크기로 줄인 파생본
    <img
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}

/**
 * 워드마크·로고 글자: 밝은 화면은 네이비, 어두운 화면은 크림 한 장만 보인다(globals.css와 같은 밝기 규칙).
 * 숨긴 쪽은 display:none이라 스크린리더에도 한 번만 읽힌다. alt는 앱 이름
 */
export function BrandLettering({
  kind,
  alt,
  className,
}: {
  kind: "wordmark" | "logo";
  alt: string;
  className?: string;
}) {
  return (
    <span className={className ? `${styles.lettering} ${className}` : styles.lettering}>
      <BrandImg name={`${kind}-navy`} alt={alt} className={styles.onLight} />
      <BrandImg name={`${kind}-cream`} alt={alt} className={styles.onDark} />
    </span>
  );
}

/**
 * 마스코트 Horang(3D 질감 PNG의 파생본). full = 몸 전체(첫 화면·404), bust = 머리와 어깨(도움 패널).
 * 옆의 말·제목이 뜻을 전하므로 장식(alt="")
 */
export function Mascot({
  variant = "full",
  className,
}: {
  variant?: "full" | "bust";
  className?: string;
}) {
  return (
    <BrandImg
      name={variant === "bust" ? "mascot-bust" : "mascot"}
      alt=""
      className={className ? `${styles.mascot} ${className}` : styles.mascot}
    />
  );
}
