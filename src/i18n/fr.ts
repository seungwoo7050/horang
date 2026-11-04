// Textes en français. Même structure exacte que en.ts (vérifié par i18n.test.ts).
import type { Messages } from "./en";

export const fr: Messages = {
  langName: "Français",
  meta: {
    title: "Horang",
    description: "Guide hors ligne non officiel pour votre voyage de l'aéroport d'Incheon à Séoul.",
  },
  common: { back: "Retour", close: "Fermer", stepOf: "Étape {n} sur 3" },
  fact: {
    evidence: {
      A: "Vérifié sur place",
      B: "Source officielle",
      C: "Signalement voyageur",
    },
    checked: "vérifié {date}",
    stale: "À revérifier",
    notOnSite: "Pas encore vérifié sur place.",
    sources: "Sources ({n})",
  },
  notFound: {
    title: "Page introuvable",
    body: "Ce lien est peut-être ancien. Repartez de l'écran d'accueil.",
    go: "Aller à l'accueil",
  },
  home: {
    ask: "Besoin d'aide ?",
    situations: {
      gate: { title: "Bloqué au portillon", hint: "Impossible d'entrer ou de sortir" },
      card: {
        title: "Quelle carte choisir ?",
        hint: "Ticket 1 trajet, Tmoney, Climate Card",
      },
      arex: {
        title: "AREX : Express ou Omnibus ?",
        hint: "Aéroport d'Incheon ↔ Gare de Séoul",
      },
      station: {
        title: "Gare de Séoul : sorties et correspondances",
        hint: "Lignes 1 · 4, KTX, Hongik, Myeong-dong, Gangnam",
      },
      transit: {
        title: "Guide bus et taxi en ville",
        hint: "Validation à la descente, correspondance 30 min, cartes chauffeur",
      },
      dining: {
        title: "Restaurants, bornes et allergies",
        hint: "Numéro 010 sur borne, cartes refusées, cartes allergie et végan",
      },
      emergency: {
        title: "Pharmacie, objets trouvés et départ",
        hint: "Cartes symptômes, 119/LOST112, consignes, City Airport, détaxe",
      },
    },
    staff: "Montrer au personnel",
    staffKo: "직원에게 보여 주기",
    footer: "Aide non officielle, indépendante des compagnies ferroviaires.",
  },
  gate: {
    title: "Bloqué au portillon",
    ask: "Que s'est-il passé au portillon ?",
    causes: {
      lowBalance: {
        label: "Solde insuffisant",
        headline: "Rechargez, puis validez pour sortir",
      },
      cardError: {
        label: "Il a bipé ou affiché une erreur",
        headline: "Une seule carte, sur le même lecteur",
      },
      wrongDirection: {
        label: "Je suis entré dans le mauvais sens",
        headline: "Ressortir tout de suite est gratuit une fois",
      },
      expressTicket: {
        label: "J'ai un billet de train Express",
        headline: "Utilisez le lecteur QR",
      },
      other: {
        label: "Autre problème",
        headline: "Le personnel de la gare peut vous aider",
      },
    },
    ifStuck:
      "Ça ne marche toujours pas ? Appuyez sur « {still} » pour afficher une phrase en coréen.",
    worked: "Ça a marché",
    still: "Toujours bloqué",
    staffHead: "Montrez cet écran au personnel de la gare",
    moreSentences: "Plus de phrases",
    solved: "Vous êtes passé. Bravo !",
    home: "Retour à l'accueil",
  },
  card: {
    title: "Quelle carte choisir ?",
    where: {
      ask: "Où êtes-vous maintenant ?",
      airport: { label: "À l'aéroport d'Incheon", hint: "En route vers Séoul" },
      seoul: { label: "Déjà dans Séoul", hint: "Pour circuler en ville" },
    },
    rides: {
      ask: "Combien de trajets ferez-vous ?",
      few: { label: "Seulement quelques trajets", hint: "Un ou deux déplacements" },
      lots: {
        label: "Beaucoup, sur plusieurs jours",
        hint: "Métro et bus presque tous les jours",
      },
    },
    result: "Les meilleures options pour vous",
    later: "Plus tard, dans Séoul",
    note: "Bon à savoir",
    restart: "Recommencer",
    cards: {
      single: {
        name: "Carte 1 trajet (Single-journey)",
        why: "Payez un trajet à la fois, sans inscription.",
      },
      tmoney: {
        name: "Tmoney",
        why: "Carte de transport rechargeable pour métro et bus.",
      },
      wowpass: {
        name: "WOWPASS",
        why: "Carte de paiement prépayée et carte Tmoney réunies.",
      },
      climate: {
        name: "Climate Card Tourist Pass",
        why: "Forfait illimité de 1 à 7 jours dans Séoul.",
      },
    },
    figures: {
      deposit: "Caution, remboursée à la machine après la sortie",
      arexExtra: "Sur AREX, en plus du tarif",
      tmoney: "Carte Tmoney",
      tmoneyFrom: "à partir d'environ ₩{n}",
      travelCard: "Tmoney Travel Card",
      wowpass: "Carte",
      wowpassOnline: "Réservée en ligne à l'avance",
      days: "{n} jours",
      day: "1 jour",
      cardItself: "Support carte",
      plus: "+₩{n}",
    },
  },
  arex: {
    title: "AREX",
    heading: "Express ou Omnibus ?",
    terminal: "Terminal",
    t1: "Terminal 1",
    t2: "Terminal 2",
    route: "Gare de Séoul ↔ {t}, adulte",
    express: "Express",
    allstop: "Omnibus",
    about: "~{n}",
    min: "min",
    won: "₩{n}",
    expressNote: "Achetez un billet dédié. Les cartes de transport ne marchent pas.",
    allstopNote: "Validez une carte de transport (tarif carte affiché).",
    atSeoul: "À la gare de Séoul (Express)",
    details: "Avant d'embarquer",
    groups: {
      express: "Billet Express",
      allstop: "Omnibus et cartes de transport",
      allstopSub: "Gare de Séoul → aéroport, adulte",
    },
    figures: {
      t1Card: "Terminal 1 · carte de transport",
      t1Single: "Terminal 1 · carte 1 trajet",
      t2Card: "Terminal 2 · carte de transport",
      t2Single: "Terminal 2 · carte 1 trajet",
      deposit: "Caution carte 1 trajet",
    },
    hurry: "En route vers l'aéroport ?",
    hurryBack: "Retour au comparatif",
    departHeading: "Départ de la gare de Séoul",
    next: {
      title: "Prochain Express",
      seoul: "Gare de Séoul",
      route: "{from} → {to}",
      now: "Il est {time} en Corée",
      in: "dans {m} min",
      leaving: "départ imminent",
      arrives: "arrivée {time}",
      none: "Plus de train Express aujourd'hui. Premier départ demain à {time}.",
      first: "Le premier Express d'aujourd'hui part à {time}.",
      note: "D'après l'horaire officiel. Soyez sur le quai au moins 3 minutes à l'avance.",
    },
  },
  station: {
    title: "Gare de Séoul",
    stationSelect: "Gare / Station",
    stations: {
      "seoul-station": {
        name: "Gare de Séoul",
        ask: "Depuis le quai AREX, où allez-vous ?",
      },
      "hongik-univ": {
        name: "Hongik Univ.",
        ask: "À la station Hongik Univ., où allez-vous ?",
      },
      "myeong-dong": {
        name: "Myeong-dong",
        ask: "À la station Myeong-dong, où allez-vous ?",
      },
      gangnam: {
        name: "Gangnam",
        ask: "À la station Gangnam, où allez-vous ?",
      },
      seongsu: {
        name: "Seongsu",
        ask: "À la station Seongsu, où allez-vous ?",
      },
    },
    ask: "Depuis le quai AREX, où allez-vous ?",
    schematic: "Itinéraires par ascenseur avec bagages (schéma non à l'échelle).",
    legend: { start: "Départ", gate: "Portillon" },
    stepOf: "Étape {n} sur {total}",
    routes: {
      "arex-to-line-4": {
        label: "Ligne 4",
        hint: "Ascenseur via B3 et B1",
        line: "Ligne 4",
      },
      "arex-to-line-1": {
        label: "Ligne 1",
        hint: "Ascenseur via B3 et B1",
        line: "Ligne 1",
      },
      "arex-to-exit-15": {
        label: "Sortie 15 (côté KTX)",
        hint: "Ascenseur jusqu'au 1F",
        line: "Sortie 15",
      },
      "hongik-arex-to-line-2": {
        label: "AREX → correspondance Ligne 2",
        hint: "Ascenseur de B4 via B3 vers B2",
        line: "Ligne 2",
      },
      "hongik-line-2-to-exit-9": {
        label: "Ligne 2 → Sortie 9 (ascenseur rue)",
        hint: "Ascenseur de B2 via B1 vers 1F",
        line: "Sortie 9",
      },
      "myeongdong-to-exit-1": {
        label: "Ligne 4 → Sortie 1 (ascenseur rue)",
        hint: "Ascenseur de B3 via B2 vers 1F",
        line: "Sortie 1",
      },
      "gangnam-to-exit-1": {
        label: "Ligne 2 → Sortie 1 (ascenseur rue)",
        hint: "Ascenseur de B2 via B1 vers 1F",
        line: "Sortie 1",
      },
      "seongsu-to-exit-3": {
        label: "Ligne 2 → Sortie 3 (ascenseur rue)",
        hint: "Ascenseur du 3F via 2F vers 1F",
        line: "Sortie 3",
      },
    },
    steps: {
      "up-to-b3": {
        title: "Montez en ascenseur au B3",
        body: "Depuis le quai AREX au B7, prenez l'ascenseur jusqu'au hall AREX au B3.",
      },
      "transfer-corridor": {
        title: "Portillon de correspondance, puis montez au B1",
        body: "Validez au portillon de correspondance (pas de sortie). Suivez le couloir et prenez l'ascenseur jusqu'au hall des lignes 1·4 au B1.",
      },
      "down-to-platform": {
        title: "Descendez au quai de la {line}",
        body: "Prenez l'ascenseur jusqu'au quai de la {line} au B2.",
      },
      "exit-gate": {
        title: "Sortez par le portillon",
        body: "Au B3, validez votre carte au portillon de sortie.",
      },
      "up-to-exit": {
        title: "Montez vers la Sortie 15",
        body: "Prenez l'ascenseur jusqu'à la Sortie 15 au 1F (indiquée pour Seoul Station / KTX).",
      },
      "hongik-up-b3": {
        title: "Prenez l'ascenseur du B4 au B3",
        body: "Depuis le quai AREX au B4, montez en ascenseur jusqu'au hall B3.",
      },
      "hongik-transfer-b2": {
        title: "Passez le portillon de correspondance vers le quai Ligne 2 (B2)",
        body: "Validez au portillon de correspondance, descendez en ascenseur au B2 et rejoignez le quai de la Ligne 2.",
      },
      "hongik-up-b1": {
        title: "Prenez l'ascenseur du B2 au B1",
        body: "Depuis le quai de la Ligne 2 au B2, montez en ascenseur jusqu'au hall B1.",
      },
      "hongik-out-gate": {
        title: "Validez pour sortir au portillon du B1",
        body: "Validez votre carte au portillon et dirigez-vous vers les sorties 8 et 9.",
      },
      "hongik-up-exit-9": {
        title: "Prenez l'ascenseur de rue jusqu'au 1F (Sortie 9)",
        body: "Prenez l'ascenseur situé entre les sorties 8 et 9 jusqu'au niveau de la rue (1F).",
      },
      "myeongdong-up-b2": {
        title: "Prenez l'ascenseur du B3 au B2",
        body: "Depuis le quai de la Ligne 4 au B3, montez en ascenseur jusqu'au hall B2.",
      },
      "myeongdong-out-gate": {
        title: "Validez pour sortir au portillon du B2",
        body: "Validez au portillon de sortie et suivez les panneaux vers la Sortie 1.",
      },
      "myeongdong-up-1f": {
        title: "Prenez l'ascenseur près de la Sortie 1 jusqu'au 1F",
        body: "Prenez l'ascenseur de rue près de la Sortie 1 jusqu'au 1F.",
      },
      "gangnam-up-b1": {
        title: "Prenez l'ascenseur du B2 au B1",
        body: "Depuis le quai de la Ligne 2 au B2, montez en ascenseur jusqu'au hall B1.",
      },
      "gangnam-out-gate": {
        title: "Validez pour sortir au portillon du B1",
        body: "Validez votre carte au portillon et suivez les panneaux vers la Sortie 1.",
      },
      "gangnam-up-1f": {
        title: "Prenez l'ascenseur de rue près de la Sortie 1 jusqu'au 1F",
        body: "Prenez l'ascenseur près de la Sortie 1 jusqu'au niveau de la rue (1F).",
      },
      "seongsu-down-2f": {
        title: "Prenez l'ascenseur du 3F au 2F",
        body: "Depuis le quai aérien de la Ligne 2 au 3F, descendez en ascenseur au hall du 2F.",
      },
      "seongsu-out-gate": {
        title: "Validez pour sortir au portillon du 2F",
        body: "Validez votre carte au portillon et dirigez-vous vers la Sortie 3.",
      },
      "seongsu-down-1f": {
        title: "Prenez l'ascenseur jusqu'au 1F (Sortie 3)",
        body: "Prenez l'ascenseur près de la Sortie 3 jusqu'au niveau de la rue (1F).",
      },
    },
    places: {
      "arex-platform": "Quai AREX",
      "arex-concourse": "Hall AREX",
      "lines-1-4-concourse": "Hall Lignes 1·4",
      "line-4-platform": "Quai Ligne 4",
      "line-1-platform": "Quai Ligne 1",
      "exit-15": "Sortie 15",
      "hongik-arex-platform": "Quai AREX",
      "hongik-arex-concourse": "Hall AREX",
      "hongik-line-2-platform": "Quai Ligne 2",
      "hongik-line-2-concourse": "Hall Ligne 2",
      "hongik-exit-9": "Sortie 9 (1F)",
      "myeongdong-platform": "Quai Ligne 4",
      "myeongdong-concourse": "Hall B2",
      "myeongdong-exit-1": "Sortie 1 (1F)",
      "gangnam-platform": "Quai Ligne 2",
      "gangnam-concourse": "Hall B1",
      "gangnam-exit-1": "Sortie 1 (1F)",
      "seongsu-platform": "Quai Ligne 2",
      "seongsu-concourse": "Hall 2F",
      "seongsu-exit-3": "Sortie 3 (1F)",
    },
    mapLabel: "Plan d'itinéraire pour {route} depuis le quai AREX (schéma).",
    unconfirmed: {
      label: "Pas encore vérifié sur place :",
      "transfer-gate":
        "l'emplacement exact du portillon de correspondance. Suivez les panneaux Lignes 1 et 4, ou appuyez sur « Introuvable ? ».",
      "line-1-elevator":
        "les sources divergent sur l'ascenseur vers le quai de la Ligne 1. S'il n'est pas là, appuyez sur « Introuvable ? ».",
    },
    next: "Suivant",
    done: "Je suis arrivé",
    cantFind: "Introuvable ?",
    arrived: "Vous y êtes !",
    home: "Retour à l'accueil",
  },
  transit: {
    title: "Guide Bus et Taxi",
    ask: "Comment vous déplacez-vous en ville ?",
    modeLabel: "Mode de transport",
    modes: {
      bus: "Bus urbains et correspondances",
      taxi: "Guide Taxi",
    },
    bus: {
      headline: "Validez en montant à l'avant ET avant de descendre à l'arrière",
      summary:
        "La plupart des bus de Séoul n'acceptent pas les espèces. Validez toujours votre carte avant de descendre pour garder la correspondance gratuite de 30 minutes.",
      cards: {
        tapBothTitle: "1. Montée à l'avant, descente à l'arrière (validez 2 fois !)",
        tapBothBody:
          "Montez à l'avant en validant votre carte Tmoney ou WOWPASS. Avant de descendre par l'arrière, validez à nouveau sur le lecteur arrière.",
        transferTitle: "2. Correspondance gratuite : 30 minutes",
        transferBody:
          "Les correspondances métro ↔ bus sont réduites dans les 30 minutes suivant la validation de sortie (60 minutes de 21:00 à 07:00), jusqu'à 4 correspondances.",
      },
      factsHead: "Règles et tarifs officiels",
    },
    taxi: {
      headline: "Taxis standard vs. Deluxe et paiement",
      summary:
        "Montrez la carte de destination en coréen ci-dessous au chauffeur. Les taxis acceptent Tmoney, les cartes bancaires et les espèces.",
      cards: {
        standardTitle: "Taxi standard moyen (base ₩4,800)",
        standardBody:
          "Voitures orange, blanches ou argentées. Tarif de base pour 1,6 km ; majoration de nuit de 20 % à 40 % entre 22:00 et 04:00.",
        deluxeTitle: "Taxi Deluxe / Grand van (base ₩7,000)",
        deluxeBody:
          "Berlines noires à bandes dorées ou grands vans. Tarif de base pour 3 km, sans majoration de nuit.",
      },
      factsHead: "Tarifs et règles de paiement officiels",
    },
    driverHead: "Montrez ceci au chauffeur",
    driverSub: "Choisissez une phrase puis appuyez sur « Afficher en grand ».",
  },
  dining: {
    title: "Restaurants, Bornes et Allergies",
    ask: "Besoin d'aide pour commander, payer ou expliquer vos restrictions alimentaires ?",
    modeLabel: "Sujet d'aide au restaurant",
    modes: {
      kiosk: "Bornes et Cartes",
      dietary: "Allergies, Végan et Règles",
    },
    kiosk: {
      headline: "Bloqué devant une borne (kiosk) ou une tablette de table ?",
      summary:
        "Les bornes demandent souvent un numéro coréen en 010 ou refusent le sans-contact étranger. Voici comment contourner les deux immédiatement.",
      cards: {
        phoneTitle: "1. La borne demande un numéro 010",
        phoneBody:
          "Cherchez un bouton Passer (건너뛰기), ou tapez 010-0000-0000 et surveillez votre numéro de commande à l'écran.",
        cardTitle: "2. Carte étrangère refusée à la borne",
        cardBody:
          "Insérez la carte à puce IC jusqu'au fond, utilisez WOWPASS ou Tmoney, ou demandez à payer au comptoir.",
      },
      factsHead: "Règles officielles bornes, cartes et remboursement",
    },
    dietary: {
      headline: "Allergies, végan/halal et coutumes à table",
      summary:
        "Même les plats de légumes utilisent souvent du bouillon d'anchois, de bœuf ou de porc. Choisissez votre carte ci-dessous et appuyez sur « Afficher en grand ».",
      cards: {
        brothTitle: "Vérifiez le bouillon (육수 / 젓갈)",
        brothBody:
          "Le kimchi et les ragoûts contiennent souvent des crevettes salées (새우젓), du bouillon d'anchois ou de viande. Montrez les cartes ci-dessous avant de commander.",
        etiquetteTitle: "Eau, accompagnements et paiement au comptoir",
        etiquetteBody:
          "L'eau et les accompagnements (banchan) sont souvent en libre-service. Sonnez la cloche de table pour appeler le serveur, et payez au comptoir en partant.",
      },
      factsHead: "Notes officielles sur la restauration",
    },
    staffHead: "Montrez ceci au personnel du restaurant",
    staffSub:
      "Choisissez votre phrase alimentaire ou de paiement et appuyez sur « Afficher en grand ».",
  },
  emergency: {
    title: "Pharmacie, Objets Trouvés et Départ",
    ask: "Besoin de médicaments, d'aide pour un objet perdu ou d'infos de départ ?",
    modeLabel: "Sujet d'aide",
    modes: {
      pharmacy: "Pharmacie et 119",
      lost: "Objets trouvés",
      depart: "Bagages et Départ",
    },
    pharmacy: {
      headline: "En pharmacie (« 약 ») ou urgence médicale",
      summary:
        "Montrez les cartes de symptômes ci-dessous au pharmacien. Pour une urgence médicale avec interprète 24h/24, appelez le 119 ou le 1330.",
      cards: {
        signTitle: "1. Cherchez l'enseigne « 약 » (Yak)",
        signBody:
          "Les pharmaciens délivrent antalgiques, médicaments contre le rhume ou l'estomac, antihistaminiques et pansements. La nuit, les supérettes 24h/24 vendent des médicaments de base.",
        callTitle: "2. Ambulance 119 et Interprétation 1330",
        callBody:
          "Le 119 joint les secours avec interprétation à trois. Le 1330 aide pour les questions non urgentes.",
      },
      factsHead: "Guide officiel urgences et pharmacies",
    },
    lost: {
      headline: "Objet oublié dans le métro ou un taxi ?",
      summary:
        "Agissez vite : notez la station, l'heure et le numéro de porte à 4 chiffres pour le métro, ou gardez votre reçu de carte/Tmoney pour un taxi.",
      cards: {
        subwayTitle: "1. Objet perdu dans le métro (numéro à 4 chiffres)",
        subwayBody:
          "Notez la ligne, la direction, l'heure et le numéro à 4 chiffres sur la porte palière, puis montrez la phrase en coréen au bureau de la station.",
        taxiTitle: "2. Objet perdu en taxi (gardez le reçu / historique Tmoney)",
        taxiBody:
          "Le reçu papier ou l'historique Tmoney/carte indique le véhicule. Demandez à votre hôtel ou au 1330 d'appeler le chauffeur.",
      },
      factsHead: "Portails officiels des objets trouvés",
    },
    depart: {
      headline: "Consignes, City Airport Terminal et Détaxe",
      summary:
        "Déposez vos sacs aux consignes T-Locker, enregistrez-vous tôt au niveau B2 de la gare de Séoul, et demandez la détaxe dès ₩15,000 d'achat.",
      cards: {
        cityAirportTitle: "1. Gare de Séoul B2 City Airport Terminal",
        cityAirportBody:
          "Avec un billet AREX Express du jour sur une compagnie participante, effectuez l'enregistrement, le dépôt bagages et l'immigration 3 h avant le vol (3 h 20 pour T2).",
        taxRefundTitle: "2. Détaxe (achat minimum de ₩15,000)",
        taxRefundBody:
          "Présentez votre passeport pour une détaxe immédiate en magasin sous ₩1,000,000, ou scannez vos reçus Tax Free aux bornes de l'aéroport avant la sécurité.",
      },
      factsHead: "Règles officielles bagages, enregistrement et détaxe",
    },
    staffHead: "Montrez ceci au pharmacien ou au personnel",
    staffSub:
      "Choisissez une phrase de symptôme, d'objet perdu ou d'enregistrement et appuyez sur « Afficher en grand ».",
  },
  staff: {
    title: "Montrer au personnel",
    lead: "Montrez cet écran au personnel de la gare.",
    others: "Autres phrases",
    show: "Afficher en grand",
    helpline: "Besoin de parler à quelqu'un dans votre langue ?",
  },
  phrase: {
    draft: "Traduction provisoire, pas encore relue par un locuteur natif.",
  },
  langSwitch: { label: "Langue" },
  theme: { toLight: "Passer en mode clair", toDark: "Passer en mode sombre" },
};
