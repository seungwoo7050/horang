// 영어 문구. 화면 코드에는 문구를 직접 쓰지 않고 이 키를 쓴다(test(i18n)이 검사).
export const en = {
  langName: "English",
  meta: {
    title: "Horang",
    description: "Unofficial helper for your first trip from Incheon Airport to Seoul Station.",
  },
  common: { back: "Back" },
  fact: {
    evidence: { A: "Checked on site", B: "Official source", C: "Traveler report" },
    checked: "checked {date}",
    stale: "Needs recheck",
    notOnSite: "Not yet checked on site.",
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
    staffKo: "직원에게 보여 주기",
    footer: "Unofficial helper. Not run by any rail company.",
  },
  gate: {
    title: "Stuck at the gate",
    stepOf: "Step {n} of 3",
    ask: "What happened at the gate?",
    causes: {
      lowBalance: { label: "Not enough balance", headline: "Top up, then tap out" },
      cardError: { label: "It beeped or showed an error", headline: "One card, same reader" },
      wrongDirection: {
        label: "I went in the wrong direction",
        headline: "Going back out is free once, if you're quick",
      },
      expressTicket: { label: "I have an Express train ticket", headline: "Use the QR reader" },
      other: { label: "Something else", headline: "Station staff can help" },
    },
    calm: "It's okay. This happens a lot, and nobody will rush you.",
    worked: "That worked",
    still: "Still stuck",
    staffHead: "Show this to station staff",
    moreSentences: "More sentences",
    solved: "You're through. Nice!",
    home: "Back to start",
  },
  phrase: { draft: "Draft translation, not yet checked by a native speaker." },
  langSwitch: { label: "Language" },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
/** 모든 언어가 같은 키를 갖도록 en의 모양을 기준으로 삼는다 */
export type Messages = Widen<typeof en>;
