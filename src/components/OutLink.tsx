import type { ReactNode } from "react";
import { getLink } from "@/content";

type Lang = "en" | "ja";

// 제휴 고지 문구. ja는 원어민 검수 전 초안이다.
const PAID_LABEL: Record<Lang, string> = { en: "Paid link", ja: "広告" };

type Props = {
  /** src/content/links.json의 id */
  id: string;
  lang?: Lang;
  /** 생략하면 레지스트리의 label을 쓴다 */
  children?: ReactNode;
  className?: string;
};

/** 모든 외부 링크는 이 컴포넌트로만 낸다(ARCHITECTURE.md §4). */
export function OutLink({ id, lang = "en", children, className }: Props) {
  const link = getLink(id);
  return (
    <a
      href={link.url}
      target="_blank"
      rel={link.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      className={className}
    >
      {children ?? link.label[lang]}
      {link.affiliate ? <span data-paid-link> · {PAID_LABEL[lang]}</span> : null}
    </a>
  );
}
