// Texte în limba română. Aceeași structură de chei ca în en.ts (verificat de i18n.test.ts).
import type { Messages } from "./en";

export const ro: Messages = {
  langName: "Română",
  meta: {
    title: "Horang",
    description: "Ghid offline neoficial pentru călătoria ta de la Aeroportul Incheon prin Seul.",
  },
  common: { back: "Înapoi", close: "Închide", stepOf: "Pasul {n} din 3" },
  fact: {
    evidence: {
      A: "Verificat la fața locului",
      B: "Sursă oficială",
      C: "Raportat de călători",
    },
    checked: "verificat {date}",
    stale: "Necesită reverificare",
    notOnSite: "Încă neverificat la fața locului.",
    sources: "Surse ({n})",
  },
  notFound: {
    title: "Această pagină nu există",
    body: "Linkul poate fi vechi. Începe din nou din primul ecran.",
    go: "Mergi la primul ecran",
  },
  home: {
    ask: "Ai nevoie de ajutor?",
    situations: {
      gate: { title: "Blocat la turnichet", hint: "Nu pot intra sau ieși" },
      card: {
        title: "Ce card să aleg?",
        hint: "Cartelă 1 călătorie, Tmoney, Climate Card",
      },
      arex: {
        title: "AREX: Expres sau Personal?",
        hint: "Aeroportul Incheon ↔ Gara Seul",
      },
      station: {
        title: "Gara Seul: ieșiri și transferuri",
        hint: "Liniile 1 · 4, KTX, Hongik, Myeong-dong, Gangnam",
      },
      transit: {
        title: "Ghid autobuz urban și taxi",
        hint: "Validare la coborâre, transfer 30 min, carduri pentru șofer",
      },
      dining: {
        title: "Restaurante, chioșcuri și alergii",
        hint: "Număr 010 la chioșc, card refuzat, carduri alergii și vegan",
      },
      emergency: {
        title: "Farmacie, obiecte pierdute și plecare",
        hint: "Carduri simptome, 119/LOST112, dulapuri, City Airport, Tax Free",
      },
    },
    staff: "Arată personalului",
    staffKo: "직원에게 보여 주기",
    footer: "Ghid neoficial. Nu este operat de nicio companie feroviară.",
  },
  gate: {
    title: "Blocat la turnichet",
    ask: "Ce s-a întâmplat la turnichet?",
    causes: {
      lowBalance: {
        label: "Sold insuficient",
        headline: "Reîncarcă, apoi validează pentru a ieși",
      },
      cardError: {
        label: "A piuit sau a afișat o eroare",
        headline: "Un singur card, pe același cititor",
      },
      wrongDirection: {
        label: "Am intrat în direcția greșită",
        headline: "Ieșirea imediată înapoi este gratuită o dată",
      },
      expressTicket: {
        label: "Am bilet la trenul Expres",
        headline: "Folosește cititorul QR",
      },
      other: {
        label: "Altă problemă",
        headline: "Personalul stației te poate ajuta",
      },
    },
    ifStuck:
      "Tot nu merge? Apasă pe „{still}” pentru o propoziție în coreeană de arătat personalului.",
    worked: "A mers",
    still: "Tot blocat",
    staffHead: "Arată acest ecran personalului din stație",
    moreSentences: "Mai multe propoziții",
    solved: "Ai trecut! Super!",
    home: "Înapoi la început",
  },
  card: {
    title: "Ce card să aleg?",
    where: {
      ask: "Unde ești acum?",
      airport: { label: "La Aeroportul Incheon", hint: "Urmează să merg în Seul" },
      seoul: { label: "Deja în Seul", hint: "Mă deplasez prin oraș" },
    },
    rides: {
      ask: "Cât de mult vei călători?",
      few: { label: "Doar câteva călătorii", hint: "Un drum sau două" },
      lots: {
        label: "Mult, timp de mai multe zile",
        hint: "Metrou și autobuz aproape zilnic",
      },
    },
    result: "Acestea ți se potrivesc cel mai bine",
    later: "Mai târziu, în Seul",
    note: "Bine de știut",
    restart: "Ia-o de la capăt",
    cards: {
      single: {
        name: "Cartelă pentru o călătorie (Single-journey)",
        why: "Plătești câte o călătorie pe rând. Fără înregistrare.",
      },
      tmoney: {
        name: "Tmoney",
        why: "Card de transport reîncărcabil pentru metrou și autobuz.",
      },
      wowpass: {
        name: "WOWPASS",
        why: "Card de plată preplătit și card Tmoney într-unul singur.",
      },
      climate: {
        name: "Climate Card Tourist Pass",
        why: "Abonament de 1 până la 7 zile pentru transportul în Seul.",
      },
    },
    figures: {
      deposit: "Garanție, returnată la aparat după ieșire",
      arexExtra: "Pe AREX, peste tariful călătoriei",
      tmoney: "Card Tmoney",
      tmoneyFrom: "de la aprox. ₩{n}",
      travelCard: "Tmoney Travel Card",
      wowpass: "Card",
      wowpassOnline: "Rezervat online în avans",
      days: "{n} zile",
      day: "1 zi",
      cardItself: "Cardul fizic",
      plus: "+₩{n}",
    },
  },
  arex: {
    title: "AREX",
    heading: "Expres sau Personal (All-stop)?",
    terminal: "Terminal",
    t1: "Terminalul 1",
    t2: "Terminalul 2",
    route: "Gara Seul ↔ {t}, adult",
    express: "Expres",
    allstop: "Personal",
    about: "~{n}",
    min: "min",
    won: "₩{n}",
    expressNote: "Cumpără bilet dedicat. Cardurile de transport nu funcționează.",
    allstopNote: "Validează un card de transport (tariful afișat este cu card).",
    atSeoul: "La Gara Seul (Expres)",
    details: "Înainte de îmbarcare",
    groups: {
      express: "Bilet Expres",
      allstop: "Tren Personal și carduri de transport",
      allstopSub: "Gara Seul → aeroport, adult",
    },
    figures: {
      t1Card: "Terminalul 1 · card de transport",
      t1Single: "Terminalul 1 · cartelă 1 călătorie",
      t2Card: "Terminalul 2 · card de transport",
      t2Single: "Terminalul 2 · cartelă 1 călătorie",
      deposit: "Garanție cartelă 1 călătorie",
    },
    hurry: "Mergi spre aeroport?",
    hurryBack: "Înapoi la comparație",
    departHeading: "Plecare din Gara Seul",
    next: {
      title: "Următorul Expres",
      seoul: "Gara Seul",
      route: "{from} → {to}",
      now: "Acum este {time} în Coreea",
      in: "în {m} min",
      leaving: "pleacă acum",
      arrives: "sosește la {time}",
      none: "Nu mai sunt trenuri Expres azi. Primul de mâine pleacă la {time}.",
      first: "Primul Expres de azi pleacă la {time}.",
      note: "Conform orarului oficial. Fii pe peron cu cel puțin 3 minute înainte.",
    },
  },
  station: {
    title: "Gara Seul",
    stationSelect: "Stație",
    stations: {
      "seoul-station": {
        name: "Gara Seul",
        ask: "De pe peronul AREX, încotro mergi?",
      },
      "hongik-univ": {
        name: "Hongik Univ.",
        ask: "În stația Hongik Univ., încotro mergi?",
      },
      "myeong-dong": {
        name: "Myeong-dong",
        ask: "În stația Myeong-dong, încotro mergi?",
      },
      gangnam: {
        name: "Gangnam",
        ask: "În stația Gangnam, încotro mergi?",
      },
      seongsu: {
        name: "Seongsu",
        ask: "În stația Seongsu, încotro mergi?",
      },
    },
    ask: "De pe peronul AREX, încotro mergi?",
    schematic: "Trasee cu liftul pentru bagaje (schiță fără scară).",
    legend: { start: "Start", gate: "Turnichet" },
    stepOf: "Pasul {n} din {total}",
    routes: {
      "arex-to-line-4": {
        label: "Linia 4",
        hint: "Traseu cu liftul prin B3 și B1",
        line: "Linia 4",
      },
      "arex-to-line-1": {
        label: "Linia 1",
        hint: "Traseu cu liftul prin B3 și B1",
        line: "Linia 1",
      },
      "arex-to-exit-15": {
        label: "Ieșirea 15 (partea KTX)",
        hint: "Lift până la 1F",
        line: "Ieșirea 15",
      },
      "hongik-arex-to-line-2": {
        label: "AREX → transfer Linia 2",
        hint: "Lift de la B4 prin B3 la B2",
        line: "Linia 2",
      },
      "hongik-line-2-to-exit-9": {
        label: "Linia 2 → Ieșirea 9 (lift stradal)",
        hint: "Lift de la B2 prin B1 la 1F",
        line: "Ieșirea 9",
      },
      "myeongdong-to-exit-1": {
        label: "Linia 4 → Ieșirea 1 (lift stradal)",
        hint: "Lift de la B3 prin B2 la 1F",
        line: "Ieșirea 1",
      },
      "gangnam-to-exit-1": {
        label: "Linia 2 → Ieșirea 1 (lift stradal)",
        hint: "Lift de la B2 prin B1 la 1F",
        line: "Ieșirea 1",
      },
      "seongsu-to-exit-3": {
        label: "Linia 2 → Ieșirea 3 (lift stradal)",
        hint: "Lift de la 3F prin 2F la 1F",
        line: "Ieșirea 3",
      },
    },
    steps: {
      "up-to-b3": {
        title: "Urcă cu liftul la B3",
        body: "De pe peronul AREX (B7), ia liftul până în holul AREX la B3.",
      },
      "transfer-corridor": {
        title: "Turnichetul de transfer, apoi urcă la B1",
        body: "Validează cardul la turnichetul de transfer (nu cel de ieșire). Mergi pe culoarul de transfer și ia liftul până în holul Liniilor 1·4 la B1.",
      },
      "down-to-platform": {
        title: "Coboară la peronul {line}",
        body: "Ia liftul până la peronul {line} la nivelul B2.",
      },
      "exit-gate": {
        title: "Ieși prin turnichet",
        body: "La nivelul B3, validează cardul la turnichetul de ieșire.",
      },
      "up-to-exit": {
        title: "Urcă la Ieșirea 15",
        body: "Ia liftul până la Ieșirea 15 la 1F (semnalizată pentru Gara Seul / KTX).",
      },
      "hongik-up-b3": {
        title: "Ia liftul de la B4 până la B3",
        body: "De pe peronul AREX (B4), urcă cu liftul în holul de la B3.",
      },
      "hongik-transfer-b2": {
        title: "Treci de turnichetul de transfer spre peronul Liniei 2 (B2)",
        body: "Validează la turnichetul de transfer, coboară cu liftul la B2 și mergi spre peronul Liniei 2.",
      },
      "hongik-up-b1": {
        title: "Ia liftul de la B2 până la B1",
        body: "De pe peronul Liniei 2 (B2), urcă cu liftul în holul de la B1.",
      },
      "hongik-out-gate": {
        title: "Validează ieșirea la turnichetul de la B1",
        body: "Validează cardul la turnichet și îndreaptă-te spre ieșirile 8 și 9.",
      },
      "hongik-up-exit-9": {
        title: "Ia liftul stradal până la 1F (Ieșirea 9)",
        body: "Ia liftul situat între ieșirile 8 și 9 până la nivelul străzii (1F).",
      },
      "myeongdong-up-b2": {
        title: "Ia liftul de la B3 până la B2",
        body: "De pe peronul Liniei 4 (B3), urcă cu liftul în holul de la B2.",
      },
      "myeongdong-out-gate": {
        title: "Validează ieșirea la turnichetul de la B2",
        body: "Validează la turnichet și urmează indicatoarele spre Ieșirea 1.",
      },
      "myeongdong-up-1f": {
        title: "Ia liftul de lângă Ieșirea 1 până la 1F",
        body: "Ia liftul stradal de lângă Ieșirea 1 până la 1F.",
      },
      "gangnam-up-b1": {
        title: "Ia liftul de la B2 până la B1",
        body: "De pe peronul Liniei 2 (B2), urcă cu liftul în holul de la B1.",
      },
      "gangnam-out-gate": {
        title: "Validează ieșirea la turnichetul de la B1",
        body: "Validează cardul la turnichet și urmează indicatoarele spre Ieșirea 1.",
      },
      "gangnam-up-1f": {
        title: "Ia liftul stradal de lângă Ieșirea 1 până la 1F",
        body: "Ia liftul de lângă Ieșirea 1 până la nivelul străzii (1F).",
      },
      "seongsu-down-2f": {
        title: "Ia liftul de la 3F până la 2F",
        body: "De pe peronul suspendat al Liniei 2 (3F), coboară cu liftul în holul de la 2F.",
      },
      "seongsu-out-gate": {
        title: "Validează ieșirea la turnichetul de la 2F",
        body: "Validează cardul la turnichet și mergi spre Ieșirea 3.",
      },
      "seongsu-down-1f": {
        title: "Ia liftul până la 1F (Ieșirea 3)",
        body: "Ia liftul de lângă Ieșirea 3 până la nivelul străzii (1F).",
      },
    },
    places: {
      "arex-platform": "Peron AREX",
      "arex-concourse": "Hol AREX",
      "lines-1-4-concourse": "Hol Liniile 1·4",
      "line-4-platform": "Peron Linia 4",
      "line-1-platform": "Peron Linia 1",
      "exit-15": "Ieșirea 15",
      "hongik-arex-platform": "Peron AREX",
      "hongik-arex-concourse": "Hol AREX",
      "hongik-line-2-platform": "Peron Linia 2",
      "hongik-line-2-concourse": "Hol Linia 2",
      "hongik-exit-9": "Ieșirea 9 (1F)",
      "myeongdong-platform": "Peron Linia 4",
      "myeongdong-concourse": "Hol B2",
      "myeongdong-exit-1": "Ieșirea 1 (1F)",
      "gangnam-platform": "Peron Linia 2",
      "gangnam-concourse": "Hol B1",
      "gangnam-exit-1": "Ieșirea 1 (1F)",
      "seongsu-platform": "Peron Linia 2",
      "seongsu-concourse": "Hol 2F",
      "seongsu-exit-3": "Ieșirea 3 (1F)",
    },
    mapLabel: "Harta traseului pentru {route} de pe peronul AREX (schiță).",
    unconfirmed: {
      label: "Încă neverificat la fața locului:",
      "transfer-gate":
        "unde se află exact turnichetul de transfer. Urmează indicatoarele Liniile 1 și 4 sau apasă pe „Nu găsești?”.",
      "line-1-elevator":
        "sursele diferă privind liftul spre peronul Liniei 1. Dacă nu este aici, apasă pe „Nu găsești?”.",
    },
    next: "Următorul",
    done: "Am ajuns",
    cantFind: "Nu găsești?",
    arrived: "Ai ajuns!",
    home: "Înapoi la început",
  },
  transit: {
    title: "Ghid Autobuz și Taxi",
    ask: "Cum te deplasezi prin oraș?",
    modeLabel: "Mod de transport",
    modes: {
      bus: "Autobuz urban și transferuri",
      taxi: "Ghid Taxi",
    },
    bus: {
      headline: "Validează la urcare pe ușa din față ȘI la coborâre pe ușa din spate",
      summary:
        "Majoritatea autobuzelor din Seul nu acceptă numerar. Validează întotdeauna cardul înainte de a coborî pentru a păstra reducerea de transfer de 30 de minute.",
      cards: {
        tapBothTitle: "1. Urcare prin față, coborâre prin spate (validează de 2 ori!)",
        tapBothBody:
          "Urcă prin față și validează cardul Tmoney sau WOWPASS. Înainte de a coborî pe ușa din spate, atinge din nou cititorul din spate.",
        transferTitle: "2. Fereastră de transfer gratuit: 30 de minute",
        transferBody:
          "Transferurile metrou ↔ autobuz sunt reduse în 30 de minute de la validarea ieșirii (60 de minute între 21:00 și 07:00), până la 4 transferuri.",
      },
      factsHead: "Reguli și tarife oficiale",
    },
    taxi: {
      headline: "Taxi standard vs. Deluxe și plată",
      summary:
        "Arată șoferului cardul cu destinația în coreeană de mai jos. Taxiurile acceptă Tmoney, carduri bancare și numerar.",
      cards: {
        standardTitle: "Taxi mediu standard (bază ₩4,800)",
        standardBody:
          "Mașini portocalii, albe sau argintii. Tariful de bază acoperă 1,6 km; suprataxă de noapte 20%–40% între 22:00 și 04:00.",
        deluxeTitle: "Taxi Deluxe / Van mare (bază ₩7,000)",
        deluxeBody:
          "Mașini negre cu dungi aurii sau dube mari. Tariful de bază acoperă 3 km fără suprataxă de noapte.",
      },
      factsHead: "Tarife și reguli oficiale de plată",
    },
    driverHead: "Arată acest ecran șoferului",
    driverSub: "Alege o propoziție și apasă pe „Afișează mare”.",
  },
  dining: {
    title: "Restaurante, Chioșcuri și Alergii",
    ask: "Ai nevoie de ajutor pentru a comanda, a plăti sau a explica restricțiile alimentare?",
    modeLabel: "Subiect ajutor restaurant",
    modes: {
      kiosk: "Chioșcuri și Carduri",
      dietary: "Alergii, Vegan și Reguli",
    },
    kiosk: {
      headline: "Blocat la un chioșc de comandă sau o tabletă la masă?",
      summary:
        "Chioșcurile cer adesea un număr coreean cu 010 sau resping plata contactless cu carduri străine. Iată cum rezolvi imediat ambele situații.",
      cards: {
        phoneTitle: "1. Chioșcul cere un număr de telefon 010",
        phoneBody:
          "Caută butonul Omite (건너뛰기) sau tastează 010-0000-0000 și urmărește numărul comenzii pe ecran.",
        cardTitle: "2. Card străin respins la chioșc",
        cardBody:
          "Introdu cardul fizic cu cip IC până la capăt, folosește WOWPASS sau Tmoney, ori roagă personalul să încaseze la casa POS.",
      },
      factsHead: "Reguli oficiale chioșcuri, carduri și rambursări",
    },
    dietary: {
      headline: "Alergii, vegan/halal și obiceiuri în restaurantele coreene",
      summary:
        "Chiar și mâncărurile cu legume folosesc adesea supă de bază din anșoa, vită sau porc. Alege cardul de mai jos și apasă pe „Afișează mare”.",
      cards: {
        brothTitle: "Verifică supa de bază (육수 / 젓갈)",
        brothBody:
          "Kimchi și tocănițele conțin adesea creveți sărați (새우젓), supă de anșoa sau de carne. Arată cardurile în coreeană înainte de a comanda.",
        etiquetteTitle: "Apă, garnituri și plata la tejghea",
        etiquetteBody:
          "Apa și garniturile suplimentare (banchan) sunt adesea cu autoservire. Apasă butonul de pe masă pentru personal și plătește la casă la plecare.",
      },
      factsHead: "Note oficiale despre restaurante și etichetă",
    },
    staffHead: "Arată acest ecran personalului din restaurant",
    staffSub: "Alege propoziția despre dietă sau plată și apasă pe „Afișează mare”.",
  },
  emergency: {
    title: "Farmacie, Obiecte Pierdute și Plecare",
    ask: "Ai nevoie de medicamente, ajutor pentru un obiect pierdut sau informații de plecare?",
    modeLabel: "Subiect de ajutor",
    modes: {
      pharmacy: "Farmacie și 119",
      lost: "Obiecte pierdute",
      depart: "Bagaje și Plecare",
    },
    pharmacy: {
      headline: "La farmacie („약”) sau urgență medicală",
      summary:
        "Arată farmacistului cardurile cu simptome în coreeană. Pentru urgențe medicale cu traducere 24/7, sună la 119 sau 1330.",
      cards: {
        signTitle: "1. Caută semnul „약” (Yak)",
        signBody:
          "Farmaciile eliberează analgezice, medicamente de răceală sau stomac, antihistaminice și plasturi. Noaptea, magazinele non-stop vând medicamente de bază.",
        callTitle: "2. Ambulanța 119 și Interpretare 1330",
        callBody:
          "119 face legătura cu dispeceratul de urgență cu interpretare în trei. 1330 ajută la întrebări non-urgente.",
      },
      factsHead: "Ghid oficial de urgență și farmacii",
    },
    lost: {
      headline: "Ai uitat ceva în metrou sau în taxi?",
      summary:
        "Acționează imediat: notează stația, ora și numărul ușii din 4 cifre la metrou, sau păstrează chitanța cardului/Tmoney pentru taxi.",
      cards: {
        subwayTitle: "1. Obiect pierdut în metrou (numărul din 4 cifre)",
        subwayBody:
          "Notează linia, direcția, ora și numărul din 4 cifre de pe ușa de peron, apoi arată propoziția în coreeană la biroul stației.",
        taxiTitle: "2. Obiect pierdut în taxi (păstrează chitanța / istoricul Tmoney)",
        taxiBody:
          "Chitanța pe hârtie sau înregistrarea plății Tmoney/card conține datele mașinii. Roagă recepția hotelului sau 1330 să sune șoferul.",
      },
      factsHead: "Portaluri oficiale pentru obiecte pierdute",
    },
    depart: {
      headline: "Dulapuri de bagaje, City Airport Terminal și Tax Refund",
      summary:
        "Depozitează bagajele la T-Locker în metrou, fă check-in devreme în Gara Seul B2 și cere rambursarea taxelor pentru cumpărături de minimum ₩15,000.",
      cards: {
        cityAirportTitle: "1. Gara Seul B2 City Airport Terminal",
        cityAirportBody:
          "Cu un bilet AREX Expres din aceeași zi la companiile aeriene participante, finalizează check-in-ul, predarea bagajelor și imigrarea cu 3 h înainte de zbor (3 h 20 min pentru T2).",
        taxRefundTitle: "2. Tax Refund (cumpărături de minimum ₩15,000)",
        taxRefundBody:
          "Arată pașaportul pentru rambursare pe loc în magazin sub ₩1,000,000, sau scanează bonurile Tax Free la chioșcul din aeroport înainte de controlul de securitate.",
      },
      factsHead: "Reguli oficiale pentru bagaje, check-in și Tax Refund",
    },
    staffHead: "Arată acest ecran farmacistului sau personalului din stație",
    staffSub:
      "Selectează o propoziție despre simptome, obiecte pierdute sau check-in și apasă pe „Afișează mare”.",
  },
  staff: {
    title: "Arată personalului",
    lead: "Arată acest ecran personalului din stație.",
    others: "Alte propoziții",
    show: "Afișează mare",
    helpline: "Ai nevoie de cineva care vorbește limba ta?",
  },
  phrase: {
    draft: "Traducere provizorie, încă neverificată de un vorbitor nativ.",
  },
  langSwitch: { label: "Limbă" },
  theme: { toLight: "Treci la modul luminos", toDark: "Treci la modul întunecat" },
};
