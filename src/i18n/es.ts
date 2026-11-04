// Textos en español. Misma estructura exacta que en.ts (verificado por i18n.test.ts).
import type { Messages } from "./en";

export const es: Messages = {
  langName: "Español",
  meta: {
    title: "Horang",
    description:
      "Guía sin conexión no oficial para tu viaje desde el Aeropuerto de Incheon por Seúl.",
  },
  common: { back: "Atrás", close: "Cerrar", stepOf: "Paso {n} de 3" },
  fact: {
    evidence: {
      A: "Verificado en el lugar",
      B: "Fuente oficial",
      C: "Reporte de viajeros",
    },
    checked: "verificado {date}",
    stale: "Requiere revisión",
    notOnSite: "Aún no verificado en el lugar.",
    sources: "Fuentes ({n})",
  },
  notFound: {
    title: "Esta página no está aquí",
    body: "Puede que el enlace sea antiguo. Empieza de nuevo desde la pantalla inicial.",
    go: "Ir a la pantalla inicial",
  },
  home: {
    ask: "¿Necesitas ayuda?",
    situations: {
      gate: { title: "Atascado en el torno", hint: "No puedo entrar ni salir" },
      card: {
        title: "¿Qué tarjeta elegir?",
        hint: "Billete de 1 viaje, Tmoney, Climate Card",
      },
      arex: {
        title: "AREX: ¿Expreso o Parada en todas?",
        hint: "Aeropuerto de Incheon ↔ Estación de Seúl",
      },
      station: {
        title: "Estación de Seúl: salidas y transbordos",
        hint: "Líneas 1 · 4, KTX, Hongik, Myeong-dong, Gangnam",
      },
      transit: {
        title: "Guía de autobús urbano y taxi",
        hint: "Validar al bajar, transbordo de 30 min, tarjetas para el conductor",
      },
      dining: {
        title: "Restaurantes, quioscos y alergias",
        hint: "Número 010 en quioscos, errores de tarjeta, alergias y vegano",
      },
      emergency: {
        title: "Farmacia, objetos perdidos y salida",
        hint: "Tarjetas de síntomas, 119/LOST112, consignas, City Airport, Tax Free",
      },
    },
    staff: "Mostrar al personal",
    staffKo: "직원에게 보여 주기",
    footer: "Ayuda no oficial. No gestionada por ninguna compañía ferroviaria.",
  },
  gate: {
    title: "Atascado en el torno",
    ask: "¿Qué pasó en el torno?",
    causes: {
      lowBalance: {
        label: "Saldo insuficiente",
        headline: "Recarga y vuelve a pasar la tarjeta para salir",
      },
      cardError: {
        label: "Pitó o mostró un error",
        headline: "Una sola tarjeta, en el mismo lector",
      },
      wrongDirection: {
        label: "Entré en la dirección equivocada",
        headline: "Salir y volver a entrar rápido es gratis una vez",
      },
      expressTicket: {
        label: "Tengo un billete del tren Expreso",
        headline: "Usa el lector de código QR",
      },
      other: {
        label: "Otro problema",
        headline: "El personal de la estación puede ayudarte",
      },
    },
    ifStuck: "¿No funcionó? Toca “{still}” para ver una frase en coreano y mostrarla al personal.",
    worked: "Funcionó",
    still: "Sigo sin poder salir",
    staffHead: "Muestra esta pantalla al personal de la estación",
    moreSentences: "Más frases",
    solved: "¡Ya saliste! ¡Genial!",
    home: "Volver al inicio",
  },
  card: {
    title: "¿Qué tarjeta elegir?",
    where: {
      ask: "¿Dónde estás ahora?",
      airport: { label: "En el Aeropuerto de Incheon", hint: "A punto de ir hacia Seúl" },
      seoul: { label: "Ya en Seúl", hint: "Moviéndome por la ciudad" },
    },
    rides: {
      ask: "¿Cuánto vas a viajar?",
      few: { label: "Solo unos pocos viajes", hint: "Uno o dos trayectos" },
      lots: {
        label: "Mucho, durante varios días",
        hint: "Metro y autobús casi todos los días",
      },
    },
    result: "Estas son tus mejores opciones",
    later: "Más adelante, en Seúl",
    note: "Bueno saberlo",
    restart: "Empezar de nuevo",
    cards: {
      single: {
        name: "Tarjeta de 1 viaje (Single-journey)",
        why: "Paga un viaje a la vez. Sin registros.",
      },
      tmoney: {
        name: "Tmoney",
        why: "Tarjeta de transporte recargable para metro y autobús.",
      },
      wowpass: {
        name: "WOWPASS",
        why: "Tarjeta de pago prepago y tarjeta Tmoney en una sola.",
      },
      climate: {
        name: "Climate Card Tourist Pass",
        why: "Pase ilimitado de 1 a 7 días para moverte por Seúl.",
      },
    },
    figures: {
      deposit: "Depósito, devuelto en la máquina al salir",
      arexExtra: "En AREX, además de la tarifa",
      tmoney: "Tarjeta Tmoney",
      tmoneyFrom: "desde aprox. ₩{n}",
      travelCard: "Tmoney Travel Card",
      wowpass: "Tarjeta",
      wowpassOnline: "Reservada en línea por adelantado",
      days: "{n} días",
      day: "1 día",
      cardItself: "Tarjeta física",
      plus: "+₩{n}",
    },
  },
  arex: {
    title: "AREX",
    heading: "¿Expreso o Parada en todas?",
    terminal: "Terminal",
    t1: "Terminal 1",
    t2: "Terminal 2",
    route: "Estación de Seúl ↔ {t}, adulto",
    express: "Expreso",
    allstop: "Parada en todas",
    about: "~{n}",
    min: "min",
    won: "₩{n}",
    expressNote: "Compra un billete. Las tarjetas de transporte no sirven.",
    allstopNote: "Usa tarjeta de transporte (se muestra tarifa con tarjeta).",
    atSeoul: "En la Estación de Seúl (Expreso)",
    details: "Antes de subir",
    groups: {
      express: "Billete Expreso",
      allstop: "Tren de parada en todas y tarjetas",
      allstopSub: "Estación de Seúl → aeropuerto, adulto",
    },
    figures: {
      t1Card: "Terminal 1 · tarjeta de transporte",
      t1Single: "Terminal 1 · tarjeta de 1 viaje",
      t2Card: "Terminal 2 · tarjeta de transporte",
      t2Single: "Terminal 2 · tarjeta de 1 viaje",
      deposit: "Depósito tarjeta de 1 viaje",
    },
    hurry: "¿Vas hacia el aeropuerto?",
    hurryBack: "Volver a la comparación",
    departHeading: "Salidas desde la Estación de Seúl",
    next: {
      title: "Próximo Expreso",
      seoul: "Estación de Seúl",
      route: "{from} → {to}",
      now: "Ahora son las {time} en Corea",
      in: "en {m} min",
      leaving: "saliendo ahora",
      arrives: "llega {time}",
      none: "No hay más trenes Expreso hoy. El primero de mañana sale a las {time}.",
      first: "El primer Expreso de hoy sale a las {time}.",
      note: "Según el horario oficial. Llega al andén al menos 3 minutos antes.",
    },
  },
  station: {
    title: "Estación de Seúl",
    stationSelect: "Estación",
    stations: {
      "seoul-station": {
        name: "Estación de Seúl",
        ask: "Desde el andén de AREX, ¿a dónde vas?",
      },
      "hongik-univ": {
        name: "Hongik Univ.",
        ask: "En la estación Hongik Univ., ¿a dónde vas?",
      },
      "myeong-dong": {
        name: "Myeong-dong",
        ask: "En la estación Myeong-dong, ¿a dónde vas?",
      },
      gangnam: {
        name: "Gangnam",
        ask: "En la estación Gangnam, ¿a dónde vas?",
      },
      seongsu: {
        name: "Seongsu",
        ask: "En la estación Seongsu, ¿a dónde vas?",
      },
    },
    ask: "Desde el andén de AREX, ¿a dónde vas?",
    schematic: "Rutas en ascensor para equipaje (esquema sin escala).",
    legend: { start: "Inicio", gate: "Torno" },
    stepOf: "Paso {n} de {total}",
    routes: {
      "arex-to-line-4": {
        label: "Línea 4",
        hint: "Ruta en ascensor por B3 y B1",
        line: "Línea 4",
      },
      "arex-to-line-1": {
        label: "Línea 1",
        hint: "Ruta en ascensor por B3 y B1",
        line: "Línea 1",
      },
      "arex-to-exit-15": {
        label: "Salida 15 (lado KTX)",
        hint: "Ascensor hasta 1F",
        line: "Salida 15",
      },
      "hongik-arex-to-line-2": {
        label: "AREX → transbordo Línea 2",
        hint: "Ascensor de B4 por B3 a B2",
        line: "Línea 2",
      },
      "hongik-line-2-to-exit-9": {
        label: "Línea 2 → Salida 9 (ascensor a la calle)",
        hint: "Ascensor de B2 por B1 a 1F",
        line: "Salida 9",
      },
      "myeongdong-to-exit-1": {
        label: "Línea 4 → Salida 1 (ascensor a la calle)",
        hint: "Ascensor de B3 por B2 a 1F",
        line: "Salida 1",
      },
      "gangnam-to-exit-1": {
        label: "Línea 2 → Salida 1 (ascensor a la calle)",
        hint: "Ascensor de B2 por B1 a 1F",
        line: "Salida 1",
      },
      "seongsu-to-exit-3": {
        label: "Línea 2 → Salida 3 (ascensor a la calle)",
        hint: "Ascensor de 3F por 2F a 1F",
        line: "Salida 3",
      },
    },
    steps: {
      "up-to-b3": {
        title: "Sube en ascensor hasta B3",
        body: "Desde el andén de AREX en B7, toma el ascensor hasta el vestíbulo de AREX en B3.",
      },
      "transfer-corridor": {
        title: "Torno de transbordo y sube a B1",
        body: "Pasa tu tarjeta por el torno de transbordo (no el de salida). Cruza el pasillo y toma el ascensor al vestíbulo de las líneas 1·4 en B1.",
      },
      "down-to-platform": {
        title: "Baja al andén de la {line}",
        body: "Toma el ascensor hasta el andén de la {line} en B2.",
      },
      "exit-gate": {
        title: "Sal por el torno",
        body: "En B3, pasa tu tarjeta por el torno de salida.",
      },
      "up-to-exit": {
        title: "Sube a la Salida 15",
        body: "Toma el ascensor hasta la Salida 15 en 1F (señalizada hacia Seoul Station / KTX).",
      },
      "hongik-up-b3": {
        title: "Toma el ascensor de B4 a B3",
        body: "Desde el andén de AREX en B4, sube en ascensor al vestíbulo en B3.",
      },
      "hongik-transfer-b2": {
        title: "Cruza el torno de transbordo hacia el andén de Línea 2 (B2)",
        body: "Valida en el torno de transbordo, baja en ascensor a B2 y camina al andén de la Línea 2.",
      },
      "hongik-up-b1": {
        title: "Toma el ascensor de B2 a B1",
        body: "Desde el andén de la Línea 2 en B2, sube en ascensor al vestíbulo en B1.",
      },
      "hongik-out-gate": {
        title: "Sal por el torno en B1",
        body: "Valida tu tarjeta en el torno y dirígete hacia las salidas 8 y 9.",
      },
      "hongik-up-exit-9": {
        title: "Toma el ascensor a la calle hasta 1F (Salida 9)",
        body: "Toma el ascensor entre las salidas 8 y 9 hasta el nivel de la calle (1F).",
      },
      "myeongdong-up-b2": {
        title: "Toma el ascensor de B3 a B2",
        body: "Desde el andén de la Línea 4 en B3, sube en ascensor al vestíbulo en B2.",
      },
      "myeongdong-out-gate": {
        title: "Sal por el torno en B2",
        body: "Valida en el torno de salida y sigue las señales hacia la Salida 1.",
      },
      "myeongdong-up-1f": {
        title: "Toma el ascensor junto a la Salida 1 hasta 1F",
        body: "Toma el ascensor hacia la calle junto a la Salida 1 hasta 1F.",
      },
      "gangnam-up-b1": {
        title: "Toma el ascensor de B2 a B1",
        body: "Desde el andén de la Línea 2 en B2, sube en ascensor al vestíbulo en B1.",
      },
      "gangnam-out-gate": {
        title: "Sal por el torno en B1",
        body: "Valida tu tarjeta en el torno y sigue las señales hacia la Salida 1.",
      },
      "gangnam-up-1f": {
        title: "Toma el ascensor junto a la Salida 1 hasta 1F",
        body: "Toma el ascensor cerca de la Salida 1 hasta el nivel de la calle (1F).",
      },
      "seongsu-down-2f": {
        title: "Toma el ascensor de 3F a 2F",
        body: "Desde el andén elevado de la Línea 2 en 3F, baja en ascensor al vestíbulo en 2F.",
      },
      "seongsu-out-gate": {
        title: "Sal por el torno en 2F",
        body: "Valida tu tarjeta en el torno y dirígete hacia la Salida 3.",
      },
      "seongsu-down-1f": {
        title: "Toma el ascensor hasta 1F (Salida 3)",
        body: "Toma el ascensor cerca de la Salida 3 hasta el nivel de la calle (1F).",
      },
    },
    places: {
      "arex-platform": "Andén AREX",
      "arex-concourse": "Vestíbulo AREX",
      "lines-1-4-concourse": "Vestíbulo Líneas 1·4",
      "line-4-platform": "Andén Línea 4",
      "line-1-platform": "Andén Línea 1",
      "exit-15": "Salida 15",
      "hongik-arex-platform": "Andén AREX",
      "hongik-arex-concourse": "Vestíbulo AREX",
      "hongik-line-2-platform": "Andén Línea 2",
      "hongik-line-2-concourse": "Vestíbulo Línea 2",
      "hongik-exit-9": "Salida 9 (1F)",
      "myeongdong-platform": "Andén Línea 4",
      "myeongdong-concourse": "Vestíbulo B2",
      "myeongdong-exit-1": "Salida 1 (1F)",
      "gangnam-platform": "Andén Línea 2",
      "gangnam-concourse": "Vestíbulo B1",
      "gangnam-exit-1": "Salida 1 (1F)",
      "seongsu-platform": "Andén Línea 2",
      "seongsu-concourse": "Vestíbulo 2F",
      "seongsu-exit-3": "Salida 3 (1F)",
    },
    mapLabel: "Mapa de ruta para {route} desde el andén de AREX (esquema).",
    unconfirmed: {
      label: "Aún no verificado en el lugar:",
      "transfer-gate":
        "dónde está exactamente el torno de transbordo. Sigue las señales de Líneas 1 y 4 o toca «¿No lo encuentras?».",
      "line-1-elevator":
        "las fuentes difieren sobre el ascensor al andén de la Línea 1. Si no está, toca «¿No lo encuentras?».",
    },
    next: "Siguiente",
    done: "Ya llegué",
    cantFind: "¿No lo encuentras?",
    arrived: "¡Llegaste!",
    home: "Volver al inicio",
  },
  transit: {
    title: "Guía de Autobús y Taxi",
    ask: "¿Cómo te vas a mover por la ciudad?",
    modeLabel: "Modo de transporte",
    modes: {
      bus: "Autobús urbano y transbordos",
      taxi: "Guía de Taxi",
    },
    bus: {
      headline: "Valida al subir por delante Y antes de bajar por detrás",
      summary:
        "La mayoría de los autobuses de Seúl no aceptan efectivo. Valida siempre tu tarjeta antes de bajar para conservar el descuento de transbordo de 30 minutos.",
      cards: {
        tapBothTitle: "1. Sube por delante, baja por detrás (¡valida ambas veces!)",
        tapBothBody:
          "Sube por la puerta delantera validando tu Tmoney o WOWPASS. Antes de bajar por la puerta trasera, vuelve a pasar la tarjeta en el lector trasero.",
        transferTitle: "2. Ventana de transbordo gratuito: 30 minutos",
        transferBody:
          "Los transbordos metro ↔ autobús tienen descuento dentro de los 30 minutos tras validar al bajar (60 minutos de 21:00 a 07:00), hasta 4 transbordos.",
      },
      factsHead: "Reglas y tarifas oficiales",
    },
    taxi: {
      headline: "Taxi estándar vs. Deluxe y pago",
      summary:
        "Muestra la tarjeta de destino en coreano de abajo al conductor. Los taxis aceptan Tmoney, tarjetas de crédito y efectivo.",
      cards: {
        standardTitle: "Taxi mediano estándar (base ₩4,800)",
        standardBody:
          "Coches naranjas, blancos o plateados. La tarifa base cubre 1,6 km; recargo nocturno del 20%–40% de 22:00 a 04:00.",
        deluxeTitle: "Taxi Deluxe / Furgoneta grande (base ₩7,000)",
        deluxeBody:
          "Coches negros con franjas doradas o furgonetas grandes. La tarifa base cubre 3 km sin recargo nocturno.",
      },
      factsHead: "Tarifas y reglas de pago oficiales",
    },
    driverHead: "Muestra esto al conductor",
    driverSub: "Elige una frase y toca «Mostrar en grande».",
  },
  dining: {
    title: "Restaurantes, Quioscos y Alergias",
    ask: "¿Necesitas ayuda para pedir, pagar o explicar tu dieta?",
    modeLabel: "Tema de ayuda en restaurantes",
    modes: {
      kiosk: "Quioscos y Tarjetas",
      dietary: "Alergias, Vegano y Reglas",
    },
    kiosk: {
      headline: "¿Atascado en un quiosco o tableta de pedido en mesa?",
      summary:
        "Los quioscos suelen pedir un número coreano 010 o rechazar pagos sin contacto de tarjetas extranjeras. Así puedes solucionarlo al instante.",
      cards: {
        phoneTitle: "1. El quiosco pide un número de teléfono 010",
        phoneBody:
          "Busca el botón Omitir (건너뛰기) o escribe 010-0000-0000 y mira la pantalla para ver tu número de pedido.",
        cardTitle: "2. Tarjeta extranjera rechazada en el quiosco",
        cardBody:
          "Inserta la tarjeta física con chip IC hasta el fondo, usa WOWPASS o Tmoney, o pide pagar en el mostrador.",
      },
      factsHead: "Reglas oficiales de quioscos, tarjetas y reembolsos",
    },
    dietary: {
      headline: "Alergias, vegano/halal y costumbres en restaurantes",
      summary:
        "Incluso los platos de verduras en Corea suelen usar caldo de anchoa, res o cerdo. Elige tu tarjeta abajo y toca «Mostrar en grande».",
      cards: {
        brothTitle: "Comprueba el caldo (육수 / 젓갈)",
        brothBody:
          "El kimchi y los guisos suelen llevar camarones salados (새우젓), caldo de anchoa o de carne. Muestra las tarjetas de abajo antes de pedir.",
        etiquetteTitle: "Agua, guarniciones y pago en el mostrador",
        etiquetteBody:
          "El agua y las guarniciones extra suelen ser de autoservicio. Pulsa el timbre de la mesa para llamar al personal y paga en el mostrador al salir.",
      },
      factsHead: "Notas oficiales sobre comida y etiqueta",
    },
    staffHead: "Muestra esto al personal del restaurante o cafetería",
    staffSub: "Elige tu frase dietética o de pago y toca «Mostrar en grande».",
  },
  emergency: {
    title: "Farmacia, Objetos Perdidos y Salida",
    ask: "¿Necesitas medicinas, ayuda con un objeto perdido o información de salida?",
    modeLabel: "Tema de ayuda",
    modes: {
      pharmacy: "Farmacia y 119",
      lost: "Objetos perdidos",
      depart: "Equipaje y Salida",
    },
    pharmacy: {
      headline: "En una farmacia («약») o emergencia médica",
      summary:
        "Muestra las tarjetas de síntomas en coreano al farmacéutico. Para emergencias con interpretación 24 h, llama al 119 o al 1330.",
      cards: {
        signTitle: "1. Busca el letrero «약» (Yak)",
        signBody:
          "Las farmacias dispensan analgésicos, medicinas para el resfriado o estómago, antihistamínicos y vendas. Por la noche, las tiendas 24 horas venden medicinas básicas.",
        callTitle: "2. Ambulancia 119 e Interpretación 1330",
        callBody:
          "El 119 conecta con emergencias con interpretación a tres bandas. El 1330 ayuda en consultas no urgentes.",
      },
      factsHead: "Guía oficial de emergencias y farmacias",
    },
    lost: {
      headline: "¿Olvidaste algo en el metro o en un taxi?",
      summary:
        "Actúa rápido: anota la estación, hora y número de puerta de 4 dígitos en el metro, o guarda el recibo de tarjeta/Tmoney del taxi.",
      cards: {
        subwayTitle: "1. Objeto perdido en el metro (número de 4 dígitos)",
        subwayBody:
          "Anota la línea, dirección, hora y el número de 4 dígitos de la puerta del andén, y muestra la frase en coreano en la oficina de la estación.",
        taxiTitle: "2. Objeto perdido en taxi (guarda el recibo / historial Tmoney)",
        taxiBody:
          "El recibo en papel o el registro de Tmoney/tarjeta identifica el vehículo. Pide en tu hotel o al 1330 que llamen al conductor.",
      },
      factsHead: "Portales oficiales de objetos perdidos",
    },
    depart: {
      headline: "Consignas, City Airport Terminal y Tax Refund",
      summary:
        "Guarda tus maletas en las consignas T-Locker, factura temprano en el B2 de la Estación de Seúl y solicita devolución de impuestos desde ₩15,000.",
      cards: {
        cityAirportTitle: "1. Estación de Seúl B2 City Airport Terminal",
        cityAirportBody:
          "Con un billete del AREX Expreso para el mismo día en aerolíneas participantes, completa facturación, equipaje e inmigración 3 h antes del vuelo (3 h 20 min para T2).",
        taxRefundTitle: "2. Tax Refund (compra mínima de ₩15,000)",
        taxRefundBody:
          "Muestra tu pasaporte para reembolso inmediato en tienda bajo ₩1,000,000, o escanea tus recibos Tax Free en el quiosco del aeropuerto antes del control de seguridad.",
      },
      factsHead: "Reglas oficiales de equipaje, facturación y Tax Refund",
    },
    staffHead: "Muestra esto al farmacéutico o personal de la estación",
    staffSub:
      "Selecciona una frase de síntoma, objeto perdido o facturación y toca «Mostrar en grande».",
  },
  staff: {
    title: "Mostrar al personal",
    lead: "Muestra esta pantalla al personal de la estación.",
    others: "Otras frases",
    show: "Mostrar en grande",
    helpline: "¿Necesitas hablar con alguien en tu idioma?",
  },
  phrase: {
    draft: "Borrador de traducción, aún no revisado por un hablante nativo.",
  },
  langSwitch: { label: "Idioma" },
  theme: { toLight: "Cambiar a modo claro", toDark: "Cambiar a modo oscuro" },
};
