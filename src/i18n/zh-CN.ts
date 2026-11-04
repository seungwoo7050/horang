// 简体中文文案。与 en.ts 保持完全相同的键结构（由 i18n.test.ts 校验）。
import type { Messages } from "./en";

export const zhCN: Messages = {
  langName: "简体中文",
  meta: {
    title: "Horang",
    description: "从仁川机场到首尔站及首尔全境的非官方离线旅行助手。",
  },
  common: { back: "返回", close: "关闭", stepOf: "第 {n} 步（共 3 步）" },
  fact: {
    evidence: { A: "现场核实", B: "官方来源", C: "旅客反馈" },
    checked: "{date} 核实",
    stale: "需重新核实",
    notOnSite: "尚未现场核实。",
    sources: "来源（{n}）",
  },
  notFound: {
    title: "找不到此页面",
    body: "链接可能已过期。请从首页重新开始。",
    go: "前往首页",
  },
  home: {
    ask: "需要帮忙吗？",
    situations: {
      gate: { title: "卡在检票闸机了", hint: "进不去或出不来" },
      card: { title: "选哪种交通卡？", hint: "一次性交通卡、Tmoney、气候同行卡" },
      arex: { title: "机场铁路：直达还是普通？", hint: "仁川机场 ↔ 首尔站" },
      station: {
        title: "首尔及主要站点：出口与换乘",
        hint: "1·4号线、KTX、弘大、明洞、江南、圣水",
      },
      transit: {
        title: "市内公交与出租车指南",
        hint: "下车刷卡规则、30分钟换乘优惠、司机沟通卡",
      },
      dining: {
        title: "餐厅点餐机与饮食禁忌卡",
        hint: "010手机号跳过、海外卡刷不过、过敏与纯素食卡",
      },
      emergency: {
        title: "药店、失物招领与返程退税",
        hint: "症状购药卡、119/LOST112、寄存柜、都心机场、退税",
      },
    },
    staff: "拿给工作人员看",
    staffKo: "직원에게 보여 주기",
    footer: "非官方旅行助手，与任何铁路或公交公司无关。",
  },
  gate: {
    title: "卡在检票闸机了",
    ask: "在检票口遇到了什么情况？",
    causes: {
      lowBalance: { label: "余额不足", headline: "先充值，再刷卡出站" },
      cardError: { label: "发出警报音或显示错误", headline: "只拿一张卡，刷同一个感应器" },
      wrongDirection: {
        label: "进错方向了",
        headline: "尽快原站刷出再进，可免费一次",
      },
      expressTicket: { label: "持有直达列车车票", headline: "请刷二维码感应区" },
      other: { label: "其他问题", headline: "请找车站工作人员帮忙" },
    },
    ifStuck: "还是不行？点按“{still}”向工作人员出示韩语求助句。",
    worked: "顺利通过了",
    still: "还是出不去",
    staffHead: "请把此画面拿给车站工作人员看",
    moreSentences: "更多求助句",
    solved: "顺利过闸了！",
    home: "返回首页",
  },
  card: {
    title: "选哪种交通卡？",
    where: {
      ask: "您现在在哪里？",
      airport: { label: "在仁川机场", hint: "准备前往首尔市区" },
      seoul: { label: "已经在首尔市区", hint: "在市内乘坐地铁或公交" },
    },
    rides: {
      ask: "您大概会坐多少次车？",
      few: { label: "只坐一两次", hint: "单程或少量出行" },
      lots: { label: "连续几天经常乘坐", hint: "几乎每天坐地铁和公交" },
    },
    result: "最适合您的方案",
    later: "到达首尔市区后可加选",
    note: "实用提示",
    restart: "重新选择",
    cards: {
      single: {
        name: "一次性交通卡",
        why: "按次买票，无需注册或办卡。",
      },
      tmoney: { name: "Tmoney 交通卡", why: "可反复充值的地铁与公交交通卡。" },
      wowpass: { name: "WOWPASS", why: "集结账付款与 Tmoney 交通卡于一身。" },
      climate: {
        name: "气候同行卡（短期游览券）",
        why: "1至7天内可在首尔市区无限次乘坐地铁与公交。",
      },
    },
    figures: {
      deposit: "押金（出站后在退卡机退还）",
      arexExtra: "机场铁路单次卡附加费",
      tmoney: "Tmoney 卡费",
      tmoneyFrom: "约 ₩{n} 起",
      travelCard: "Tmoney Travel Card",
      wowpass: "卡费",
      wowpassOnline: "提前网上预约价",
      days: "{n}天券",
      day: "1天券",
      cardItself: "实体卡工本费",
      plus: "+₩{n}",
    },
  },
  arex: {
    title: "机场铁路 AREX",
    heading: "直达列车还是普通列车？",
    terminal: "航站楼",
    t1: "第1航站楼",
    t2: "第2航站楼",
    route: "首尔站 ↔ {t}（成人）",
    express: "直达列车",
    allstop: "普通列车",
    about: "约{n}",
    min: "分",
    won: "₩{n}",
    expressNote: "需购买专用车票，不能刷交通卡。",
    allstopNote: "直接刷交通卡进站（下方为交通卡票价）。",
    atSeoul: "在首尔站乘车（直达列车）",
    details: "乘车前须知",
    groups: {
      express: "直达列车车票",
      allstop: "普通列车与交通卡",
      allstopSub: "首尔站 → 机场（成人）",
    },
    figures: {
      t1Card: "第1航站楼 · 交通卡",
      t1Single: "第1航站楼 · 一次性交通卡",
      t2Card: "第2航站楼 · 交通卡",
      t2Single: "第2航站楼 · 一次性交通卡",
      deposit: "一次性交通卡押金",
    },
    hurry: "准备去机场吗？",
    hurryBack: "返回列车对比",
    departHeading: "从首尔站前往机场",
    next: {
      title: "下一班直达列车",
      seoul: "首尔站",
      route: "{from} → {to}",
      now: "韩国当前时间 {time}",
      in: "{m}分钟后",
      leaving: "即将发车",
      arrives: "{time} 到达",
      none: "今日直达列车已结束。明日首班车为 {time}。",
      first: "今日首班直达列车于 {time} 发车。",
      note: "基于官方时刻表，请至少提前 3 分钟到达站台。",
    },
  },
  station: {
    title: "首尔站与换乘站",
    stationSelect: "选择车站",
    stations: {
      "seoul-station": {
        name: "首尔站",
        ask: "从机场铁路站台出发，您要去哪里？",
      },
      "hongik-univ": {
        name: "弘大入口",
        ask: "在弘大入口站，您要去哪里？",
      },
      "myeong-dong": {
        name: "明洞",
        ask: "在明洞站，您要去哪里？",
      },
      gangnam: {
        name: "江南",
        ask: "在江南站，您要去哪里？",
      },
      seongsu: {
        name: "圣水",
        ask: "在圣水站，您要去哪里？",
      },
    },
    ask: "从机场铁路站台出发，您要去哪里？",
    schematic: "带大件行李适用的无障碍电梯路线（示意图，非按比例绘制）。",
    legend: { start: "起点", gate: "检票口" },
    stepOf: "第 {n} 步（共 {total} 步）",
    routes: {
      "arex-to-line-4": { label: "4号线", hint: "经 B3、B1 的电梯换乘路线", line: "4号线" },
      "arex-to-line-1": { label: "1号线", hint: "经 B3、B1 的电梯换乘路线", line: "1号线" },
      "arex-to-exit-15": {
        label: "15号出口（KTX方向）",
        hint: "乘电梯上至 1层",
        line: "15号出口",
      },
      "hongik-arex-to-line-2": {
        label: "机场铁路 → 2号线换乘",
        hint: "从 B4 经 B3 到 B2 的电梯路线",
        line: "2号线",
      },
      "hongik-line-2-to-exit-9": {
        label: "2号线 → 9号出口（地面电梯）",
        hint: "从 B2 经 B1 到 1层地面",
        line: "9号出口",
      },
      "myeongdong-to-exit-1": {
        label: "4号线 → 1号出口（地面电梯）",
        hint: "从 B3 经 B2 到 1层地面",
        line: "1号出口",
      },
      "gangnam-to-exit-1": {
        label: "2号线 → 1号出口（地面电梯）",
        hint: "从 B2 经 B1 到 1层地面",
        line: "1号出口",
      },
      "seongsu-to-exit-3": {
        label: "2号线 → 3号出口（地面电梯）",
        hint: "从地上 3层 经 2层 下至 1层地面",
        line: "3号出口",
      },
    },
    steps: {
      "up-to-b3": {
        title: "乘电梯上至地下3层（B3）",
        body: "从地下7层（B7）机场铁路站台乘电梯上至地下3层（B3）机场铁路大厅。",
      },
      "transfer-corridor": {
        title: "刷换乘闸机，再乘电梯上至地下1层（B1）",
        body: "请在换乘闸机刷卡（不要走出站闸机），通过换乘通道后乘电梯上至地下1层（B1）1·4号线大厅。",
      },
      "down-to-platform": {
        title: "乘电梯下至{line}站台",
        body: "乘电梯下至地下2层（B2）的{line}站台。",
      },
      "exit-gate": {
        title: "刷卡出检票口",
        body: "在地下3层（B3）检票闸机刷卡出站。",
      },
      "up-to-exit": {
        title: "乘电梯上至15号出口",
        body: "乘电梯上至1层15号出口（标有首尔站 KTX 及普通火车方向）。",
      },
      "hongik-up-b3": {
        title: "从 B4 乘电梯上至 B3",
        body: "从地下4层（B4）机场铁路站台乘电梯上至地下3层（B3）大厅。",
      },
      "hongik-transfer-b2": {
        title: "过换乘闸机前往 B2 的2号线站台",
        body: "在换乘闸机刷卡，乘电梯下至地下2层（B2），步行前往2号线站台。",
      },
      "hongik-up-b1": {
        title: "从 B2 乘电梯上至 B1",
        body: "从地下2层（B2）2号线站台乘电梯上至地下1层（B1）大厅。",
      },
      "hongik-out-gate": {
        title: "在 B1 检票口刷卡出站",
        body: "刷交通卡出闸，朝 8号、9号出口方向走。",
      },
      "hongik-up-exit-9": {
        title: "乘地面电梯上至 1层（9号出口）",
        body: "乘坐 8号与9号出口之间的无障碍电梯直达地面（1层）。",
      },
      "myeongdong-up-b2": {
        title: "从 B3 乘电梯上至 B2",
        body: "从地下3层（B3）4号线站台乘电梯上至地下2层（B2）大厅。",
      },
      "myeongdong-out-gate": {
        title: "在 B2 检票口刷卡出站",
        body: "在检票闸机刷卡出站，沿指示牌前往 1号出口。",
      },
      "myeongdong-up-1f": {
        title: "乘 1号出口旁的电梯上至 1层",
        body: "乘坐 1号出口附近的地面电梯直达 1层。",
      },
      "gangnam-up-b1": {
        title: "从 B2 乘电梯上至 B1",
        body: "从地下2层（B2）2号线站台乘电梯上至地下1层（B1）大厅。",
      },
      "gangnam-out-gate": {
        title: "在 B1 检票口刷卡出站",
        body: "在检票口刷交通卡出站，沿指示牌前往 1号出口。",
      },
      "gangnam-up-1f": {
        title: "乘 1号出口旁的地面电梯上至 1层",
        body: "乘坐 1号出口附近的电梯直达地面（1层）。",
      },
      "seongsu-down-2f": {
        title: "从地上 3层 乘电梯下至 2层",
        body: "从地上3层（3F）2号线高架站台乘电梯下至 2层（2F）大厅。",
      },
      "seongsu-out-gate": {
        title: "在 2层 检票口刷卡出站",
        body: "刷交通卡出闸，朝 3号出口方向前进。",
      },
      "seongsu-down-1f": {
        title: "乘电梯下至 1层（3号出口）",
        body: "乘坐 3号出口旁的电梯下至 1层地面。",
      },
    },
    places: {
      "arex-platform": "机场铁路站台",
      "arex-concourse": "机场铁路大厅",
      "lines-1-4-concourse": "1·4号线大厅",
      "line-4-platform": "4号线站台",
      "line-1-platform": "1号线站台",
      "exit-15": "15号出口",
      "hongik-arex-platform": "机场铁路站台",
      "hongik-arex-concourse": "机场铁路大厅",
      "hongik-line-2-platform": "2号线站台",
      "hongik-line-2-concourse": "2号线大厅",
      "hongik-exit-9": "9号出口（1层）",
      "myeongdong-platform": "4号线站台",
      "myeongdong-concourse": "B2 大厅",
      "myeongdong-exit-1": "1号出口（1层）",
      "gangnam-platform": "2号线站台",
      "gangnam-concourse": "B1 大厅",
      "gangnam-exit-1": "1号出口（1层）",
      "seongsu-platform": "2号线站台",
      "seongsu-concourse": "2层大厅",
      "seongsu-exit-3": "3号出口（1层）",
    },
    mapLabel: "从机场铁路站台前往{route}的路线示意图（非按比例）。",
    unconfirmed: {
      label: "尚未现场核实：",
      "transfer-gate":
        "换乘闸机的具体位置。请跟随 1·4号线换乘指示牌；若找不到，请点按“找不到路？”。",
      "line-1-elevator":
        "关于前往1号线站台的电梯位置，不同资料说法不一。如果现场没有，请点按“找不到路？”询问工作人员。",
    },
    next: "下一步",
    done: "我到了",
    cantFind: "找不到路？",
    arrived: "顺利到达！",
    home: "返回首页",
  },
  transit: {
    title: "市内公交与出租车指南",
    ask: "您在市内准备怎么出行？",
    modeLabel: "出行方式",
    modes: {
      bus: "市内公交与换乘",
      taxi: "出租车指南",
    },
    bus: {
      headline: "前门上车刷卡，后门下车前必须再刷一次",
      summary:
        "首尔绝大多数公交车为无现金车。下车前请务必在后门读卡器再刷一次卡，以保留30分钟换乘优惠并避免追加扣费。",
      cards: {
        tapBothTitle: "1. 前门上车、后门下车都要刷卡",
        tapBothBody: "从前门上车刷 Tmoney 或 WOWPASS；从后门下车前，请务必在后门读卡器再刷一次。",
        transferTitle: "2. 免费换乘时限：下车后 30 分钟内",
        transferBody:
          "地铁与公交之间在下车刷卡后 30 分钟内（21:00–07:00 为 60 分钟内）换乘可享优惠，最多可换乘 4 次。",
      },
      factsHead: "官方规则与票价",
    },
    taxi: {
      headline: "普通出租车 vs. 模范/大型出租车与付款",
      summary: "请向司机出示下方的韩语目的地卡片。首尔出租车支持 Tmoney、信用卡和现金付款。",
      cards: {
        standardTitle: "普通中型出租车（起步价 ₩4,800）",
        standardBody:
          "橙色、白色或银色轿车。起步价含 1.6 公里；22:00 至次日 04:00 加收 20%–40% 夜间附加费。",
        deluxeTitle: "模范 / 大型出租车（起步价 ₩7,000）",
        deluxeBody: "带金色条纹的黑色轿车或大型商务车。起步价含 3 公里，无夜间附加费。",
      },
      factsHead: "官方车费与付款须知",
    },
    driverHead: "请把此画面拿给司机看",
    driverSub: "点选句子后，点按“全屏放大显示”即可放大给司机看。",
  },
  dining: {
    title: "餐厅点餐机与饮食禁忌卡",
    ask: "需要点餐、结账或说明饮食禁忌的帮助吗？",
    modeLabel: "餐饮求助主题",
    modes: {
      kiosk: "点餐机与刷卡问题",
      dietary: "过敏、素食与用餐礼仪",
    },
    kiosk: {
      headline: "在自助点餐机（Kiosk）或平板上卡住了？",
      summary:
        "韩国点餐机经常要求输入 010 开头的韩国手机号，或拒绝海外非接触式刷卡。按下面两步即可立即解决。",
      cards: {
        phoneTitle: "1. 点餐机要求输入 010 手机号",
        phoneBody: "寻找“跳过（건너뛰기）”按钮，或直接输入 010-0000-0000 并留意取餐屏幕上的号码。",
        cardTitle: "2. 海外信用卡在点餐机刷不过",
        cardBody: "请将实体芯片卡插到底，或改用 WOWPASS / Tmoney，也可请店员在收银台 POS 机结账。",
      },
      factsHead: "官方点餐机、刷卡与退余额规则",
    },
    dietary: {
      headline: "食物过敏、纯素/清真与韩国餐厅常识",
      summary:
        "韩国许多蔬菜料理也会使用鳀鱼、牛肉或猪肉高汤。在下方选择您的饮食卡片并点按“全屏放大显示”给店员看。",
      cards: {
        brothTitle: "留意高汤与虾酱（육수 / 젓갈）",
        brothBody:
          "泡菜和汤锅常含有虾酱（새우젓）、鳀鱼汤或肉汤。点餐前请向店员出示下方韩语卡片确认。",
        etiquetteTitle: "饮用水、小菜自助与前台结账",
        etiquetteBody:
          "饮用水和续加小菜通常为自助。需要服务请按桌上的呼叫铃，用完餐后请到前台收银处结账。",
      },
      factsHead: "官方餐饮与礼仪说明",
    },
    staffHead: "请把此画面拿给餐厅或咖啡店店员看",
    staffSub: "选择您的饮食禁忌或结账句子，然后点按“全屏放大显示”。",
  },
  emergency: {
    title: "药店、失物招领与返程退税",
    ask: "需要买药、寻找遗失物品或办理返程手续吗？",
    modeLabel: "求助主题",
    modes: {
      pharmacy: "药店与 119 急救",
      lost: "失物招领",
      depart: "行李寄存与返程退税",
    },
    pharmacy: {
      headline: "在药店（“약”）买药或遇到紧急医疗情况",
      summary: "向药剂师出示下方韩语症状卡。如需全天候外语翻译急救，请拨打 119 或 1330。",
      cards: {
        signTitle: "1. 寻找写有“약”（药）字的招牌",
        signBody:
          "药店可购买止痛退烧药、感冒肠胃药、抗过敏药和创可贴。深夜可在 24 小时便利店买到常备止痛药和消化药。",
        callTitle: "2. 119 救护车与 1330 旅游翻译热线",
        callBody: "拨打 119 可接入三方外语翻译急救调度；非紧急的药店或诊所咨询可拨打 1330。",
      },
      factsHead: "官方急救与药店指南",
    },
    lost: {
      headline: "把东西落在地铁或出租车上了？",
      summary:
        "请立即行动：地铁请记下车站、时间和屏蔽门4位编号；出租车请保留刷卡小票或 Tmoney 记录。",
      cards: {
        subwayTitle: "1. 地铁遗失物（查看屏蔽门 4 位编号）",
        subwayBody:
          "记下路线、方向、时间和站台屏蔽门上的 4 位数字编号，前往站务室出示下方韩语句子。",
        taxiTitle: "2. 出租车遗失物（保留小票 / Tmoney 记录）",
        taxiBody:
          "纸质收据或 Tmoney/信用卡扣款记录上有车辆信息。请酒店前台或拨打 1330 帮忙联系司机。",
      },
      factsHead: "官方失物招领平台",
    },
    depart: {
      headline: "行李寄存柜、首尔站都心机场与退税",
      summary:
        "可在地铁 T-Locker 寄存行李，在首尔站 B2 提前值机托运，单笔满 ₩15,000 即可办理退税。",
      cards: {
        cityAirportTitle: "1. 首尔站 B2 都心机场航站楼",
        cityAirportBody:
          "购买当日机场铁路直达列车车票并乘坐指定航司，可在起飞前 3 小时（T2 为 3 小时 20 分）办完值机、托运和出境审查。",
        taxRefundTitle: "2. 退税（单笔消费满 ₩15,000）",
        taxRefundBody:
          "单笔未满 ₩1,000,000 出示护照可在店内即时退税；其余退税单请在机场安检前的自助退税机扫描。",
      },
      factsHead: "官方行李、都心值机与退税规则",
    },
    staffHead: "请把此画面拿给药剂师或车站人员看",
    staffSub: "选择症状、失物或值机句子，然后点按“全屏放大显示”。",
  },
  staff: {
    title: "拿给工作人员看",
    lead: "请将此画面出示给车站工作人员。",
    others: "其他求助句",
    show: "全屏放大显示",
    helpline: "需要会说中文的翻译人员帮忙吗？",
  },
  phrase: { draft: "暂定翻译，尚未经母语人士最终审校。" },
  langSwitch: { label: "语言" },
  theme: { toLight: "切换到浅色模式", toDark: "切换到深色模式" },
};
