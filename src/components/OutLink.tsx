import type { ReactNode } from "react";
import { getLink } from "@/content";
import type { Locale } from "@/i18n";

// 제휴 고지 문구.
const PAID_LABEL: Record<Locale, string> = {
  en: "Paid link",
  ja: "広告",
  "zh-CN": "赞助链接",
  "zh-TW": "贊助連結",
  fr: "Lien sponsorisé",
  es: "Enlace patrocinado",
  ro: "Link sponsorizat",
};

type Props = {
  /** src/content/links.json의 id */
  id: string;
  lang?: Locale;
  /** 생략하면 레지스트리의 label을 쓴다 */
  children?: ReactNode;
  className?: string;
};

/** 모든 외부 링크는 이 컴포넌트로만 낸다(ARCHITECTURE.md §4). */
export function OutLink({ id, lang = "en", children, className }: Props) {
  const link = getLink(id);
  // 전화는 새 탭 없이 바로 건다
  const isTel = link.url.startsWith("tel:");
  return (
    <a
      href={link.url}
      target={isTel ? undefined : "_blank"}
      rel={link.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      className={className}
    >
      {children ?? link.label[lang]}
      {link.affiliate ? <span data-paid-link> · {PAID_LABEL[lang]}</span> : null}
    </a>
  );
}
