// 영어 문구. 화면 코드에는 문구를 직접 쓰지 않고 이 키를 쓴다(test(i18n)이 검사).
export const en = {
  langName: "English",
  meta: {
    title: "Horang",
    description: "Unofficial helper for your first trip from Incheon Airport to Seoul Station.",
  },
  common: { back: "Back", close: "Close", stepOf: "Step {n} of 3" },
  fact: {
    evidence: { A: "Checked on site", B: "Official source", C: "Traveler report" },
    checked: "checked {date}",
    stale: "Needs recheck",
    notOnSite: "Not yet checked on site.",
    sources: "Sources ({n})",
  },
  notFound: {
    title: "This page isn't here",
    body: "The link may be old. Start again from the first screen.",
    go: "Go to the first screen",
  },
  home: {
    ask: "Do you need help?",
    situations: {
      gate: { title: "I'm stuck at the gate", hint: "Can't get in or out" },
      card: { title: "Which card?", hint: "Single-journey, Tmoney, Climate Card" },
      arex: { title: "AREX: Express or All-stop?", hint: "Airport ↔ Seoul Station" },
      station: { title: "Seoul Station: exits & transfers", hint: "Lines 1 · 4, KTX, Exit 15" },
      transit: {
        title: "City bus & taxi guide",
        hint: "Tap-out rule, 30-min transfers, driver cards",
      },
      dining: {
        title: "Dining, kiosks & dietary cards",
        hint: "010 phone prompt, card errors, allergy & vegan cards",
      },
      emergency: {
        title: "Pharmacy, lost item & departure",
        hint: "Symptom cards, 119/LOST112, lockers, City Airport, tax refund",
      },
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
    ifStuck: "Didn't work? Tap “{still}” for a sentence to show station staff.",
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
    figures: {
      deposit: "Deposit, returned after you exit",
      arexExtra: "On AREX, on top of the fare",
      tmoney: "Tmoney card",
      tmoneyFrom: "from about ₩{n}",
      travelCard: "Tmoney Travel Card",
      wowpass: "Card",
      wowpassOnline: "Booked online in advance",
      days: "{n} days",
      day: "1 day",
      cardItself: "Card itself",
      plus: "+₩{n}",
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
    atSeoul: "At Seoul Station (Express)",
    details: "Before you board",
    groups: {
      express: "Express ticket",
      allstop: "All-stop and transit cards",
      allstopSub: "Seoul Station → airport, adult",
    },
    figures: {
      t1Card: "Terminal 1 · transit card",
      t1Single: "Terminal 1 · single-journey card",
      t2Card: "Terminal 2 · transit card",
      t2Single: "Terminal 2 · single-journey card",
      deposit: "Single-journey card deposit",
    },
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
      first: "Today's first Express leaves at {time}.",
      note: "From the official timetable. Be on the platform at least 3 minutes early.",
    },
  },
  station: {
    title: "Seoul Station",
    stationSelect: "Station",
    stations: {
      "seoul-station": {
        name: "Seoul Station",
        ask: "From the AREX platform, where are you going?",
      },
      "hongik-univ": {
        name: "Hongik Univ.",
        ask: "At Hongik Univ. Station, where are you going?",
      },
      "myeong-dong": {
        name: "Myeong-dong",
        ask: "At Myeong-dong Station, where are you going?",
      },
      gangnam: {
        name: "Gangnam",
        ask: "At Gangnam Station, where are you going?",
      },
      seongsu: {
        name: "Seongsu",
        ask: "At Seongsu Station, where are you going?",
      },
    },
    ask: "From the AREX platform, where are you going?",
    schematic: "Elevator routes for luggage. Maps are schematic, not to scale.",
    legend: { start: "Start", gate: "Ticket gate" },
    stepOf: "Step {n} of {total}",
    routes: {
      "arex-to-line-4": { label: "Line 4", hint: "Elevator route via B3 and B1", line: "Line 4" },
      "arex-to-line-1": { label: "Line 1", hint: "Elevator route via B3 and B1", line: "Line 1" },
      "arex-to-exit-15": {
        label: "Exit 15 (KTX side)",
        hint: "Elevator route to 1F",
        line: "Exit 15",
      },
      "hongik-arex-to-line-2": {
        label: "AREX → Line 2 transfer",
        hint: "Elevator route from B4 via B3 to B2",
        line: "Line 2",
      },
      "hongik-line-2-to-exit-9": {
        label: "Line 2 → Exit 9 (street elevator)",
        hint: "Elevator from B2 via B1 to 1F",
        line: "Exit 9",
      },
      "myeongdong-to-exit-1": {
        label: "Line 4 → Exit 1 (street elevator)",
        hint: "Elevator from B3 via B2 to 1F",
        line: "Exit 1",
      },
      "gangnam-to-exit-1": {
        label: "Line 2 → Exit 1 (street elevator)",
        hint: "Elevator from B2 via B1 to 1F",
        line: "Exit 1",
      },
      "seongsu-to-exit-3": {
        label: "Line 2 → Exit 3 (street elevator)",
        hint: "Elevator from 3F via 2F to 1F",
        line: "Exit 3",
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
      "hongik-up-b3": {
        title: "Take the elevator from B4 up to B3",
        body: "From the AREX platform on B4, take the elevator up to the B3 concourse.",
      },
      "hongik-transfer-b2": {
        title: "Pass the transfer gate to the B2 Line 2 platform",
        body: "Tap your card at the transfer gate, take the elevator down to B2, and walk to the Line 2 platform.",
      },
      "hongik-up-b1": {
        title: "Take the elevator from B2 up to B1",
        body: "From the Line 2 platform on B2, take the elevator up to the B1 concourse.",
      },
      "hongik-out-gate": {
        title: "Tap out at the B1 ticket gate",
        body: "Tap your transit card at the gate and head toward Exits 8 and 9.",
      },
      "hongik-up-exit-9": {
        title: "Take the street elevator up to 1F (Exit 9)",
        body: "Take the elevator between Exits 8 and 9 up to street level (1F).",
      },
      "myeongdong-up-b2": {
        title: "Take the elevator from B3 up to B2",
        body: "From the Line 4 platform on B3, take the elevator up to the B2 concourse.",
      },
      "myeongdong-out-gate": {
        title: "Tap out at the B2 ticket gate",
        body: "Tap out at the ticket gate and follow signs toward Exit 1.",
      },
      "myeongdong-up-1f": {
        title: "Take the elevator near Exit 1 up to 1F",
        body: "Take the street elevator near Exit 1 up to 1F.",
      },
      "gangnam-up-b1": {
        title: "Take the elevator from B2 up to B1",
        body: "From the Line 2 platform on B2, take the elevator up to the B1 concourse.",
      },
      "gangnam-out-gate": {
        title: "Tap out at the B1 ticket gate",
        body: "Tap your transit card at the gate and follow signs toward Exit 1.",
      },
      "gangnam-up-1f": {
        title: "Take the street elevator near Exit 1 up to 1F",
        body: "Take the elevator near Exit 1 up to street level (1F).",
      },
      "seongsu-down-2f": {
        title: "Take the elevator from 3F down to 2F",
        body: "From the elevated Line 2 platform on 3F, take the elevator down to the 2F concourse.",
      },
      "seongsu-out-gate": {
        title: "Tap out at the 2F ticket gate",
        body: "Tap your transit card at the gate and head toward Exit 3.",
      },
      "seongsu-down-1f": {
        title: "Take the elevator down to 1F (Exit 3)",
        body: "Take the elevator near Exit 3 down to street level (1F).",
      },
    },
    places: {
      "arex-platform": "AREX platform",
      "arex-concourse": "AREX concourse",
      "lines-1-4-concourse": "Lines 1·4 concourse",
      "line-4-platform": "Line 4 platform",
      "line-1-platform": "Line 1 platform",
      "exit-15": "Exit 15",
      "hongik-arex-platform": "AREX platform",
      "hongik-arex-concourse": "AREX concourse",
      "hongik-line-2-platform": "Line 2 platform",
      "hongik-line-2-concourse": "Line 2 concourse",
      "hongik-exit-9": "Exit 9 (1F)",
      "myeongdong-platform": "Line 4 platform",
      "myeongdong-concourse": "B2 concourse",
      "myeongdong-exit-1": "Exit 1 (1F)",
      "gangnam-platform": "Line 2 platform",
      "gangnam-concourse": "B1 concourse",
      "gangnam-exit-1": "Exit 1 (1F)",
      "seongsu-platform": "Line 2 platform",
      "seongsu-concourse": "2F concourse",
      "seongsu-exit-3": "Exit 3 (1F)",
    },
    mapLabel: "Route map for {route}, from the AREX platform. Schematic, not to scale.",
    unconfirmed: {
      label: "Not checked on site yet:",
      "transfer-gate":
        "where exactly the transfer gate is. Follow the Lines 1 and 4 transfer signs. If you can't find it, tap \"Can't find it?\".",
      "line-1-elevator":
        "sources disagree about the elevator to the Line 1 platform. If it isn't here, tap \"Can't find it?\" and show staff.",
    },
    next: "Next",
    done: "I'm there",
    cantFind: "Can't find it?",
    arrived: "You made it!",
    home: "Back to start",
  },
  transit: {
    title: "Bus & Taxi Guide",
    ask: "How are you getting around the city?",
    modeLabel: "Transit mode",
    modes: {
      bus: "City Bus & Transfers",
      taxi: "Taxi Guide",
    },
    bus: {
      headline: "Tap on at the front door, tap off at the rear door",
      summary:
        "Most Seoul buses are cashless. Always tap your card again before stepping off so you keep your 30-minute transfer discount and avoid penalty fares.",
      cards: {
        tapBothTitle: "1. Front door on, rear door off (tap both!)",
        tapBothBody:
          "Board at the front and tap your Tmoney or WOWPASS. Before getting off at the rear door, tap the rear reader.",
        transferTitle: "2. Free transfer window: 30 minutes",
        transferBody:
          "Subway ↔ bus transfers are discounted within 30 minutes of tapping out (60 minutes from 21:00 to 07:00), up to 4 transfers.",
      },
      factsHead: "Official rules & fares",
    },
    taxi: {
      headline: "Standard vs. Deluxe taxis & payment",
      summary:
        "Show the Korean destination card below to your driver. Taxis take Tmoney, credit cards, or cash.",
      cards: {
        standardTitle: "Standard medium taxi (₩4,800 base)",
        standardBody:
          "Orange, white, or silver cars. Base fare covers 1.6 km; 20%–40% late-night surcharge from 22:00 to 04:00.",
        deluxeTitle: "Deluxe / Large van taxi (₩7,000 base)",
        deluxeBody:
          "Black cars with gold stripes or large vans. Base fare covers 3 km with no late-night surcharge.",
      },
      factsHead: "Official fares & payment rules",
    },
    driverHead: "Show this to the driver",
    driverSub: "Tap a sentence, then tap “Show big” to fill the screen.",
  },
  dining: {
    title: "Dining, Kiosks & Dietary Cards",
    ask: "Need help ordering, paying, or explaining dietary needs?",
    modeLabel: "Dining help topic",
    modes: {
      kiosk: "Kiosk & Card Fixes",
      dietary: "Dietary & Table Rules",
    },
    kiosk: {
      headline: "Stuck at a kiosk or table-order tablet?",
      summary:
        "Self-order kiosks often ask for a Korean 010 phone number or reject overseas tap-to-pay cards. Here is how to get around both immediately.",
      cards: {
        phoneTitle: "1. Kiosk asks for a 010 phone number",
        phoneBody:
          "Look for a Skip button, or type 010-0000-0000 and watch the pickup screen for your order number.",
        cardTitle: "2. Overseas card declined at kiosk",
        cardBody:
          "Insert the physical IC chip card all the way in, use WOWPASS or Tmoney, or ask staff to ring you up at the counter POS.",
      },
      factsHead: "Official kiosk, card & refund rules",
    },
    dietary: {
      headline: "Allergies, vegan/halal & Korean restaurant basics",
      summary:
        "Even vegetable dishes in Korea often use anchovy, beef, or pork broth. Select your dietary card below and tap “Show big” so kitchen staff can read it clearly.",
      cards: {
        brothTitle: "Check the soup stock (육수 / 젓갈)",
        brothBody:
          "Kimchi and stews often contain salted shrimp (새우젓), anchovy stock, or meat broth. Use the Korean cards below to ask before ordering.",
        etiquetteTitle: "Water, side dishes & paying at the counter",
        etiquetteBody:
          "Water and extra side dishes are often self-serve. Press the table call bell for staff, and pay at the front counter when leaving.",
      },
      factsHead: "Official dining & etiquette notes",
    },
    staffHead: "Show this to restaurant or cafe staff",
    staffSub: "Pick your dietary or payment sentence and tap “Show big”.",
  },
  emergency: {
    title: "Pharmacy, Lost Item & Departure",
    ask: "Do you need medicine, lost-item help, or departure info?",
    modeLabel: "Help topic",
    modes: {
      pharmacy: "Pharmacy & 119",
      lost: "Lost & Found",
      depart: "Luggage & Departure",
    },
    pharmacy: {
      headline: "At a pharmacy ('약') or medical emergency",
      summary:
        "Show the Korean symptom cards below to a pharmacist. For urgent medical help with 24-hour interpretation, call 119 or 1330.",
      cards: {
        signTitle: "1. Look for the '약' (Yak) sign",
        signBody:
          "Pharmacists provide pain relievers, cold/stomach medicine, antihistamines, and bandages. Late at night, 24-hour convenience stores carry basic pain and digestive medicine.",
        callTitle: "2. 119 Ambulance & 1330 Interpreting",
        callBody:
          "119 connects to emergency dispatch with 3-way foreign-language interpretation. 1330 helps with non-urgent pharmacy and clinic questions.",
      },
      factsHead: "Official emergency & pharmacy guide",
    },
    lost: {
      headline: "Left something on the subway or in a taxi?",
      summary:
        "Act right away: note the station, time, and door number for the subway, or check your card/Tmoney receipt for a taxi.",
      cards: {
        subwayTitle: "1. Subway lost item (check the 4-digit door number)",
        subwayBody:
          "Write down the line, direction, time, and platform screen door number, then show the Korean sentence below at the station office.",
        taxiTitle: "2. Taxi lost item (keep your receipt / Tmoney log)",
        taxiBody:
          "A paper receipt or Tmoney/card payment record has the vehicle ID. Ask hotel staff or 1330 to call the driver.",
      },
      factsHead: "Official lost & found portals",
    },
    depart: {
      headline: "Luggage lockers, City Airport Terminal & Tax Refund",
      summary:
        "Store your bags at subway T-Lockers, check in early at Seoul Station B2, and claim tax refunds on purchases of ₩15,000+.",
      cards: {
        cityAirportTitle: "1. Seoul Station B2 City Airport Terminal",
        cityAirportBody:
          "With a same-day AREX Express ticket on participating airlines, finish check-in, bag drop, and immigration 3h before departure (3h 20m for T2).",
        taxRefundTitle: "2. Tax Refund (₩15,000+ minimum purchase)",
        taxRefundBody:
          "Show your passport for instant refund under ₩1,000,000 in stores, or scan your Tax Free receipts at the airport kiosk before security.",
      },
      factsHead: "Official luggage, check-in & tax refund rules",
    },
    staffHead: "Show this to a pharmacist or station staff",
    staffSub: "Select a symptom, lost-item, or check-in sentence and tap “Show big”.",
  },
  staff: {
    title: "Show this to staff",
    lead: "Show this screen to station staff.",
    others: "Other sentences",
    show: "Show big",
    helpline: "Need a person who speaks your language?",
  },
  phrase: { draft: "Draft translation, not yet checked by a native speaker." },
  langSwitch: { label: "Language" },
  theme: { toLight: "Switch to light mode", toDark: "Switch to dark mode" },
} as const;

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
/** 모든 언어가 같은 키를 갖도록 en의 모양을 기준으로 삼는다 */
export type Messages = Widen<typeof en>;
