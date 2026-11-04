// 繁體中文文案。與 en.ts 保持完全相同的鍵結構（由 i18n.test.ts 校驗）。
import type { Messages } from "./en";

export const zhTW: Messages = {
  langName: "繁體中文",
  meta: {
    title: "Horang",
    description: "從仁川機場到首爾站及首爾全境的非官方離線旅遊助手。",
  },
  common: { back: "返回", close: "關閉", stepOf: "第 {n} 步（共 3 步）" },
  fact: {
    evidence: { A: "現場確認", B: "官方來源", C: "旅客回報" },
    checked: "{date} 確認",
    stale: "需重新確認",
    notOnSite: "尚未現場確認。",
    sources: "來源（{n}）",
  },
  notFound: {
    title: "找不到此頁面",
    body: "連結可能已過期。請從首頁重新開始。",
    go: "前往首頁",
  },
  home: {
    ask: "需要幫忙嗎？",
    situations: {
      gate: { title: "卡在驗票閘門了", hint: "進不去或出不來" },
      card: { title: "選哪種交通卡？", hint: "一次性交通卡、Tmoney、氣候同行卡" },
      arex: { title: "機場鐵路：直達還是普通？", hint: "仁川機場 ↔ 首爾站" },
      station: {
        title: "首爾及主要站點：出口與轉乘",
        hint: "1·4號線、KTX、弘大、明洞、江南、聖水",
      },
      transit: {
        title: "市區公車與計程車指南",
        hint: "下車刷卡規則、30分鐘轉乘優惠、司機溝通卡",
      },
      dining: {
        title: "餐廳點餐機與飲食禁忌卡",
        hint: "010手機號碼略過、海外卡刷不過、過敏與全素食卡",
      },
      emergency: {
        title: "藥局、遺失物與返程退稅",
        hint: "症狀買藥卡、119/LOST112、寄物櫃、都心機場、退稅",
      },
    },
    staff: "拿給工作人員看",
    staffKo: "직원에게 보여 주기",
    footer: "非官方旅遊助手，與任何鐵路或公車公司無關。",
  },
  gate: {
    title: "卡在驗票閘門了",
    ask: "在驗票口遇到了什麼情況？",
    causes: {
      lowBalance: { label: "餘額不足", headline: "先儲值，再刷卡出站" },
      cardError: { label: "發出警報音或顯示錯誤", headline: "只拿一張卡，刷同一個感應器" },
      wrongDirection: {
        label: "進錯方向了",
        headline: "盡快原站刷出再進，可免費一次",
      },
      expressTicket: { label: "持有直達列車車票", headline: "請刷 QR 碼感應區" },
      other: { label: "其他問題", headline: "請找車站工作人員幫忙" },
    },
    ifStuck: "還是不行？點按「{still}」向工作人員出示韓語求助句。",
    worked: "順利通過了",
    still: "還是出不去",
    staffHead: "請把此畫面拿給車站工作人員看",
    moreSentences: "更多求助句",
    solved: "順利過閘了！",
    home: "返回首頁",
  },
  card: {
    title: "選哪種交通卡？",
    where: {
      ask: "您現在在哪裡？",
      airport: { label: "在仁川機場", hint: "準備前往首爾市區" },
      seoul: { label: "已經在首爾市區", hint: "在市內搭乘地鐵或公車" },
    },
    rides: {
      ask: "您大概會搭多少次車？",
      few: { label: "只搭一兩次", hint: "單程或少量移動" },
      lots: { label: "連續幾天經常搭乘", hint: "幾乎每天搭地鐵和公車" },
    },
    result: "最適合您的方案",
    later: "抵達首爾市區後可加選",
    note: "實用提示",
    restart: "重新選擇",
    cards: {
      single: {
        name: "一次性交通卡",
        why: "按次買票，無需註冊或辦卡。",
      },
      tmoney: { name: "Tmoney 交通卡", why: "可反覆儲值的地鐵與公車交通卡。" },
      wowpass: { name: "WOWPASS", why: "結合消費付款與 Tmoney 交通卡於一身。" },
      climate: {
        name: "氣候同行卡（短期觀光券）",
        why: "1至7天內可在首爾市區無限次搭乘地鐵與公車。",
      },
    },
    figures: {
      deposit: "押金（出站後在退卡機退還）",
      arexExtra: "機場鐵路單次卡附加費",
      tmoney: "Tmoney 卡費",
      tmoneyFrom: "約 ₩{n} 起",
      travelCard: "Tmoney Travel Card",
      wowpass: "卡費",
      wowpassOnline: "提前線上預約價",
      days: "{n}日券",
      day: "1日券",
      cardItself: "實體卡工本費",
      plus: "+₩{n}",
    },
  },
  arex: {
    title: "機場鐵路 AREX",
    heading: "直達列車還是普通列車？",
    terminal: "航廈",
    t1: "第1航廈",
    t2: "第2航廈",
    route: "首爾站 ↔ {t}（成人）",
    express: "直達列車",
    allstop: "普通列車",
    about: "約{n}",
    min: "分",
    won: "₩{n}",
    expressNote: "需購買專用車票，不能刷交通卡。",
    allstopNote: "直接刷交通卡進站（下方為交通卡票價）。",
    atSeoul: "在首爾站搭車（直達列車）",
    details: "搭車前須知",
    groups: {
      express: "直達列車車票",
      allstop: "普通列車與交通卡",
      allstopSub: "首爾站 → 機場（成人）",
    },
    figures: {
      t1Card: "第1航廈 · 交通卡",
      t1Single: "第1航廈 · 一次性交通卡",
      t2Card: "第2航廈 · 交通卡",
      t2Single: "第2航廈 · 一次性交通卡",
      deposit: "一次性交通卡押金",
    },
    hurry: "準備去機場嗎？",
    hurryBack: "返回列車比較",
    departHeading: "從首爾站前往機場",
    next: {
      title: "下一班直達列車",
      seoul: "首爾站",
      route: "{from} → {to}",
      now: "韓國目前時間 {time}",
      in: "{m}分鐘後",
      leaving: "即將發車",
      arrives: "{time} 抵達",
      none: "今日直達列車已結束。明日首班車為 {time}。",
      first: "今日首班直達列車於 {time} 發車。",
      note: "依據官方時刻表，請至少提前 3 分鐘抵達月台。",
    },
  },
  station: {
    title: "首爾站與轉乘站",
    stationSelect: "選擇車站",
    stations: {
      "seoul-station": {
        name: "首爾站",
        ask: "從機場鐵路月台出發，您要去哪裡？",
      },
      "hongik-univ": {
        name: "弘大入口",
        ask: "在弘大入口站，您要去哪裡？",
      },
      "myeong-dong": {
        name: "明洞",
        ask: "在明洞站，您要去哪裡？",
      },
      gangnam: {
        name: "江南",
        ask: "在江南站，您要去哪裡？",
      },
      seongsu: {
        name: "聖水",
        ask: "在聖水站，您要去哪裡？",
      },
    },
    ask: "從機場鐵路月台出發，您要去哪裡？",
    schematic: "攜帶大件行李適用的電梯路線（示意圖，非依比例繪製）。",
    legend: { start: "起點", gate: "驗票口" },
    stepOf: "第 {n} 步（共 {total} 步）",
    routes: {
      "arex-to-line-4": { label: "4號線", hint: "經 B3、B1 的電梯轉乘路線", line: "4號線" },
      "arex-to-line-1": { label: "1號線", hint: "經 B3、B1 的電梯轉乘路線", line: "1號線" },
      "arex-to-exit-15": {
        label: "15號出口（KTX方向）",
        hint: "搭電梯上至 1樓",
        line: "15號出口",
      },
      "hongik-arex-to-line-2": {
        label: "機場鐵路 → 2號線轉乘",
        hint: "從 B4 經 B3 到 B2 的電梯路線",
        line: "2號線",
      },
      "hongik-line-2-to-exit-9": {
        label: "2號線 → 9號出口（地面電梯）",
        hint: "從 B2 經 B1 到 1樓地面",
        line: "9號出口",
      },
      "myeongdong-to-exit-1": {
        label: "4號線 → 1號出口（地面電梯）",
        hint: "從 B3 經 B2 到 1樓地面",
        line: "1號出口",
      },
      "gangnam-to-exit-1": {
        label: "2號線 → 1號出口（地面電梯）",
        hint: "從 B2 經 B1 到 1樓地面",
        line: "1號出口",
      },
      "seongsu-to-exit-3": {
        label: "2號線 → 3號出口（地面電梯）",
        hint: "從地上 3樓 經 2樓 下至 1樓地面",
        line: "3號出口",
      },
    },
    steps: {
      "up-to-b3": {
        title: "搭電梯上至地下3樓（B3）",
        body: "從地下7樓（B7）機場鐵路月台搭電梯上至地下3樓（B3）機場鐵路大廳。",
      },
      "transfer-corridor": {
        title: "刷轉乘閘門，再搭電梯上至地下1樓（B1）",
        body: "請在轉乘閘門刷卡（不要走出站閘門），通過轉乘通道後搭電梯上至地下1樓（B1）1·4號線大廳。",
      },
      "down-to-platform": {
        title: "搭電梯下至{line}月台",
        body: "搭電梯下至地下2樓（B2）的{line}月台。",
      },
      "exit-gate": {
        title: "刷卡出驗票口",
        body: "在地下3樓（B3）驗票閘門刷卡出站。",
      },
      "up-to-exit": {
        title: "搭電梯上至15號出口",
        body: "搭電梯上至1樓15號出口（標有首爾站 KTX 及一般火車方向）。",
      },
      "hongik-up-b3": {
        title: "從 B4 搭電梯上至 B3",
        body: "從地下4樓（B4）機場鐵路月台搭電梯上至地下3樓（B3）大廳。",
      },
      "hongik-transfer-b2": {
        title: "過轉乘閘門前往 B2 的2號線月台",
        body: "在轉乘閘門刷卡，搭電梯下至地下2樓（B2），步行前往2號線月台。",
      },
      "hongik-up-b1": {
        title: "從 B2 搭電梯上至 B1",
        body: "從地下2樓（B2）2號線月台搭電梯上至地下1樓（B1）大廳。",
      },
      "hongik-out-gate": {
        title: "在 B1 驗票口刷卡出站",
        body: "刷交通卡出閘，朝 8號、9號出口方向走。",
      },
      "hongik-up-exit-9": {
        title: "搭地面電梯上至 1樓（9號出口）",
        body: "搭乘 8號與9號出口之間的無障礙電梯直達地面（1樓）。",
      },
      "myeongdong-up-b2": {
        title: "從 B3 搭電梯上至 B2",
        body: "從地下3樓（B3）4號線月台搭電梯上至地下2樓（B2）大廳。",
      },
      "myeongdong-out-gate": {
        title: "在 B2 驗票口刷卡出站",
        body: "在驗票閘門刷卡出站，沿指示牌前往 1號出口。",
      },
      "myeongdong-up-1f": {
        title: "搭 1號出口旁的電梯上至 1樓",
        body: "搭乘 1號出口附近的地面電梯直達 1樓。",
      },
      "gangnam-up-b1": {
        title: "從 B2 搭電梯上至 B1",
        body: "從地下2樓（B2）2號線月台搭電梯上至地下1樓（B1）大廳。",
      },
      "gangnam-out-gate": {
        title: "在 B1 驗票口刷卡出站",
        body: "在驗票口刷交通卡出站，沿指示牌前往 1號出口。",
      },
      "gangnam-up-1f": {
        title: "搭 1號出口旁的地面電梯上至 1樓",
        body: "搭乘 1號出口附近的電梯直達地面（1樓）。",
      },
      "seongsu-down-2f": {
        title: "從地上 3樓 搭電梯下至 2樓",
        body: "從地上3樓（3F）2號線高架月台搭電梯下至 2樓（2F）大廳。",
      },
      "seongsu-out-gate": {
        title: "在 2樓 驗票口刷卡出站",
        body: "刷交通卡出閘，朝 3號出口方向前進。",
      },
      "seongsu-down-1f": {
        title: "搭電梯下至 1樓（3號出口）",
        body: "搭乘 3號出口旁的電梯下至 1樓地面。",
      },
    },
    places: {
      "arex-platform": "機場鐵路月台",
      "arex-concourse": "機場鐵路大廳",
      "lines-1-4-concourse": "1·4號線大廳",
      "line-4-platform": "4號線月台",
      "line-1-platform": "1號線月台",
      "exit-15": "15號出口",
      "hongik-arex-platform": "機場鐵路月台",
      "hongik-arex-concourse": "機場鐵路大廳",
      "hongik-line-2-platform": "2號線月台",
      "hongik-line-2-concourse": "2號線大廳",
      "hongik-exit-9": "9號出口（1樓）",
      "myeongdong-platform": "4號線月台",
      "myeongdong-concourse": "B2 大廳",
      "myeongdong-exit-1": "1號出口（1樓）",
      "gangnam-platform": "2號線月台",
      "gangnam-concourse": "B1 大廳",
      "gangnam-exit-1": "1號出口（1樓）",
      "seongsu-platform": "2號線月台",
      "seongsu-concourse": "2樓大廳",
      "seongsu-exit-3": "3號出口（1樓）",
    },
    mapLabel: "從機場鐵路月台前往{route}的路線示意圖（非依比例）。",
    unconfirmed: {
      label: "尚未現場確認：",
      "transfer-gate":
        "轉乘閘門的確切位置。請跟隨 1·4號線轉乘指示牌；若找不到，請點按「找不到路？」。",
      "line-1-elevator":
        "關於前往1號線月台的電梯位置，不同資料說法不一。如果現場沒有，請點按「找不到路？」詢問工作人員。",
    },
    next: "下一步",
    done: "我到了",
    cantFind: "找不到路？",
    arrived: "順利抵達！",
    home: "返回首頁",
  },
  transit: {
    title: "市區公車與計程車指南",
    ask: "您在市區準備怎麼移動？",
    modeLabel: "移動方式",
    modes: {
      bus: "市區公車與轉乘",
      taxi: "計程車指南",
    },
    bus: {
      headline: "前門上車刷卡，後門下車前必須再刷一次",
      summary:
        "首爾絕大多數公車為無現金公車。下車前請務必在後門感應器再刷一次卡，以保留30分鐘轉乘優惠並避免追加扣款。",
      cards: {
        tapBothTitle: "1. 前門上車、後門下車都要刷卡",
        tapBothBody: "從前門上車刷 Tmoney 或 WOWPASS；從後門下車前，請務必在後門感應器再刷一次。",
        transferTitle: "2. 免費轉乘時限：下車後 30 分鐘內",
        transferBody:
          "地鐵與公車之間在下車刷卡後 30 分鐘內（21:00–07:00 為 60 分鐘內）轉乘可享優惠，最多可轉乘 4 次。",
      },
      factsHead: "官方規則與票價",
    },
    taxi: {
      headline: "一般計程車 vs. 模範/大型計程車與付款",
      summary: "請向司機出示下方的韓語目的地卡片。首爾計程車支援 Tmoney、信用卡和現金付款。",
      cards: {
        standardTitle: "一般中型計程車（起跳價 ₩4,800）",
        standardBody:
          "橘色、白色或銀色轎車。起跳價含 1.6 公里；22:00 至隔日 04:00 加收 20%–40% 夜間加成。",
        deluxeTitle: "模範 / 大型計程車（起跳價 ₩7,000）",
        deluxeBody: "帶金色條紋的黑色轎車或大型休旅車。起跳價含 3 公里，無夜間加成。",
      },
      factsHead: "官方車資與付款須知",
    },
    driverHead: "請把此畫面拿給司機看",
    driverSub: "點選句子後，點按「全螢幕放大顯示」即可放大給司機看。",
  },
  dining: {
    title: "餐廳點餐機與飲食禁忌卡",
    ask: "需要點餐、結帳或說明飲食禁忌的協助嗎？",
    modeLabel: "餐飲求助主題",
    modes: {
      kiosk: "點餐機與刷卡問題",
      dietary: "過敏、素食與用餐禮儀",
    },
    kiosk: {
      headline: "在自助點餐機（Kiosk）或平板上卡住了？",
      summary:
        "韓國點餐機經常要求輸入 010 開頭的韓國手機號碼，或拒絕海外感應刷卡。按下面兩步即可立即解決。",
      cards: {
        phoneTitle: "1. 點餐機要求輸入 010 手機號碼",
        phoneBody:
          "尋找「略過（건너뛰기）」按鈕，或直接輸入 010-0000-0000 並留意取餐螢幕上的號碼。",
        cardTitle: "2. 海外信用卡在點餐機刷不過",
        cardBody: "請將實體晶片卡插到底，或改用 WOWPASS / Tmoney，也可請店員在櫃檯 POS 機結帳。",
      },
      factsHead: "官方點餐機、刷卡與退餘額規則",
    },
    dietary: {
      headline: "食物過敏、全素/清真與韓國餐廳常識",
      summary:
        "韓國許多蔬菜料理也會使用鯷魚、牛肉或豬肉高湯。在下方選擇您的飲食卡片並點按「全螢幕放大顯示」給店員看。",
      cards: {
        brothTitle: "留意高湯與蝦醬（육수 / 젓갈）",
        brothBody:
          "泡菜和湯鍋常含有蝦醬（새우젓）、鯷魚湯或肉湯。點餐前請向店員出示下方韓語卡片確認。",
        etiquetteTitle: "飲用水、小菜自助與櫃檯結帳",
        etiquetteBody:
          "飲用水和續加小菜通常為自助。需要服務請按桌上的服務鈴，用完餐後請到櫃檯收銀處結帳。",
      },
      factsHead: "官方餐飲與禮儀說明",
    },
    staffHead: "請把此畫面拿給餐廳或咖啡廳店員看",
    staffSub: "選擇您的飲食禁忌或結帳句子，然後點按「全螢幕放大顯示」。",
  },
  emergency: {
    title: "藥局、遺失物與返程退稅",
    ask: "需要買藥、尋找遺失物品或辦理返程手續嗎？",
    modeLabel: "求助主題",
    modes: {
      pharmacy: "藥局與 119 急救",
      lost: "遺失物協尋",
      depart: "行李寄放與返程退稅",
    },
    pharmacy: {
      headline: "在藥局（「약」）買藥或遇到緊急醫療情況",
      summary: "向藥師出示下方韓語症狀卡。如需全天候外語口譯急救，請撥打 119 或 1330。",
      cards: {
        signTitle: "1. 尋找寫有「약」（藥）字的招牌",
        signBody:
          "藥局可購買止痛退燒藥、感冒腸胃藥、抗過敏藥和OK繃。深夜可在 24 小時便利商店買到常備止痛藥和消化藥。",
        callTitle: "2. 119 救護車與 1330 旅遊口譯專線",
        callBody: "撥打 119 可接入三方外語口譯急救調度；非緊急的藥局或診所諮詢可撥打 1330。",
      },
      factsHead: "官方急救與藥局指南",
    },
    lost: {
      headline: "把東西落在地下鐵或計程車上了？",
      summary:
        "請立即行動：地鐵請記下車站、時間和月台門4位編號；計程車請保留刷卡收據或 Tmoney 紀錄。",
      cards: {
        subwayTitle: "1. 地鐵遺失物（查看月台門 4 位編號）",
        subwayBody: "記下路線、方向、時間和月台門上的 4 位數字編號，前往站務室出示下方韓語句子。",
        taxiTitle: "2. 計程車遺失物（保留收據 / Tmoney 紀錄）",
        taxiBody:
          "紙本收據或 Tmoney/信用卡扣款紀錄上有車輛資訊。請飯店櫃檯或撥打 1330 幫忙聯繫司機。",
      },
      factsHead: "官方遺失物協尋平台",
    },
    depart: {
      headline: "行李寄物櫃、首爾站都心機場與退稅",
      summary:
        "可在地鐵 T-Locker 寄放行李，在首爾站 B2 提前報到託運，單筆滿 ₩15,000 即可辦理退稅。",
      cards: {
        cityAirportTitle: "1. 首爾站 B2 都心機場航廈",
        cityAirportBody:
          "購買當日機場鐵路直達列車車票並搭乘指定航空，可在起飛前 3 小時（T2 為 3 小時 20 分）辦完報到、託運和出境審查。",
        taxRefundTitle: "2. 退稅（單筆消費滿 ₩15,000）",
        taxRefundBody:
          "單筆未滿 ₩1,000,000 出示護照可在店內即時退稅；其餘退稅單請在機場安檢前的自助退稅機掃描。",
      },
      factsHead: "官方行李、都心報到與退稅規則",
    },
    staffHead: "請把此畫面拿給藥師或車站人員看",
    staffSub: "選擇症狀、遺失物或報到句子，然後點按「全螢幕放大顯示」。",
  },
  staff: {
    title: "拿給工作人員看",
    lead: "請將此畫面出示給車站工作人員。",
    others: "其他求助句",
    show: "全螢幕放大顯示",
    helpline: "需要會說中文的口譯人員幫忙嗎？",
  },
  phrase: { draft: "暫定翻譯，尚未經母語人士最終審校。" },
  langSwitch: { label: "語言" },
  theme: { toLight: "切換至淺色模式", toDark: "切換至深色模式" },
};
