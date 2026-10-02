// 영어 문구. 화면 코드에는 문구를 직접 쓰지 않고 이 키를 쓴다(test(i18n)이 검사).
export const en = {
  langName: "English",
  meta: {
    title: "Horang",
    description: "Unofficial helper for your first trip from Incheon Airport to Seoul Station.",
  },
  common: { back: "Back", stepOf: "Step {n} of 3" },
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
  card: {
    title: "Which card?",
    where: {
      ask: "Where are you now?",
      airport: { label: "At Incheon Airport", hint: "About to head into Seoul" },
      seoul: { label: "Already in Seoul", hint: "Getting around the city" },
    },
    rides: {
      ask: "How much will you ride?",
      few: { label: "Just a few rides", hint: "A trip or two" },
      lots: { label: "A lot, over several days", hint: "Subway and bus most days" },
    },
    result: "These fit you best",
    later: "Later, in Seoul",
    note: "Good to know",
    restart: "Start over",
    cards: {
      single: {
        name: "Single-journey card",
        why: "Pay for one ride at a time. Nothing to sign up for.",
      },
      tmoney: { name: "Tmoney", why: "A reusable transit card for trains and buses." },
      wowpass: { name: "WOWPASS", why: "A transit card and a payment card in one." },
      climate: {
        name: "Climate Card Tourist Pass",
        why: "A 1 to 7 day pass for getting around Seoul.",
      },
    },
  },
  arex: {
    title: "AREX",
    heading: "Express or All-stop?",
    terminal: "Terminal",
    t1: "Terminal 1",
    t2: "Terminal 2",
    route: "Seoul Station and {t}, adult",
    express: "Express",
    allstop: "All-stop",
    about: "~{n}",
    min: "min",
    won: "₩{n}",
    expressNote: "Buy a ticket. Transit cards don't work.",
    allstopNote: "Tap a transit card. Shown fare is with a transit card.",
    details: "Before you board",
    hurry: "Going to the airport?",
    hurryBack: "Back to the comparison",
    departHeading: "Leaving from Seoul Station",
    next: {
      title: "Next Express",
      seoul: "Seoul Station",
      route: "{from} → {to}",
      now: "Now {time} in Korea",
      in: "in {m} min",
      leaving: "leaving now",
      arrives: "arrives {time}",
      none: "No more Express trains today. Tomorrow's first one leaves at {time}.",
      note: "From the official timetable. Be on the platform at least 3 minutes early.",
    },
  },
  station: {
    title: "Seoul Station",
    ask: "From the AREX platform, where are you going?",
    schematic: "Elevator routes for luggage. Maps are schematic, not to scale.",
    stepOf: "Step {n} of {total}",
    routes: {
      "arex-to-line-4": { label: "Line 4", hint: "Elevator route via B3 and B1", line: "Line 4" },
      "arex-to-line-1": { label: "Line 1", hint: "Elevator route via B3 and B1", line: "Line 1" },
      "arex-to-exit-15": {
        label: "Exit 15 (KTX side)",
        hint: "Elevator route to 1F",
        line: "Exit 15",
      },
    },
    steps: {
      "up-to-b3": {
        title: "Take the elevator up to B3",
        body: "From the AREX platform on B7, take the elevator up to the AREX concourse on B3.",
      },
      "transfer-corridor": {
        title: "Transfer gate, then up to B1",
        body: "Tap your card at the transfer gate, not an exit gate. Walk the transfer corridor and take the elevator up to the Lines 1·4 concourse on B1.",
      },
      "down-to-platform": {
        title: "Down to the {line} platform",
        body: "Take the elevator down to the {line} platform on B2.",
      },
      "exit-gate": {
        title: "Out through the ticket gate",
        body: "On B3, tap out at the ticket gate.",
      },
      "up-to-exit": {
        title: "Up to Exit 15",
        body: "Take the elevator up to Exit 15 on 1F. It's signed for Seoul Station (KTX and regular trains).",
      },
    },
    places: {
      "arex-platform": "AREX platform",
      "arex-concourse": "AREX concourse",
      "lines-1-4-concourse": "Lines 1·4 concourse",
      "line-4-platform": "Line 4 platform",
      "line-1-platform": "Line 1 platform",
      "exit-15": "Exit 15",
    },
    mapLabel: "Route map for {route}, from the AREX platform. Schematic, not to scale.",
    disagree:
      "Sources disagree about the elevator route to Line 1. If the elevator isn't where this says, ask staff.",
    next: "Next",
    done: "I'm there",
    cantFind: "Can't find it?",
    arrived: "You made it!",
    home: "Back to start",
  },
  staff: {
    title: "Show this to staff",
    lead: "Show this screen to station staff.",
    others: "Other sentences",
    helpline: "Need a person who speaks your language?",
  },
  phrase: { draft: "Draft translation, not yet checked by a native speaker." },
  langSwitch: { label: "Language" },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
/** 모든 언어가 같은 키를 갖도록 en의 모양을 기준으로 삼는다 */
export type Messages = Widen<typeof en>;
