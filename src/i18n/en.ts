// 영어 문구. 화면 코드에는 문구를 직접 쓰지 않고 이 키를 쓴다(test(i18n)이 검사).
export const en = {
  langName: "English",
  meta: {
    title: "Horang",
    description: "Unofficial helper for your first trip from Incheon Airport to Seoul Station.",
  },
  home: {
    ask: "Do you need help?",
    sub: "Tap where you're stuck. I'll walk you through it.",
    situations: {
      gate: { title: "I'm stuck at the gate", hint: "Can't get in or out" },
      card: { title: "Which card?", hint: "Single-journey, Tmoney, Climate Card" },
      arex: { title: "AREX: Express or All-stop?", hint: "Airport ↔ Seoul Station" },
      station: { title: "Seoul Station: exits & transfers", hint: "Lines 1 · 4, KTX, Exit 15" },
    },
    staff: "Show this to staff",
    footer: "Unofficial helper · works offline",
  },
  langSwitch: { label: "Language" },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
/** 모든 언어가 같은 키를 갖도록 en의 모양을 기준으로 삼는다 */
export type Messages = Widen<typeof en>;
