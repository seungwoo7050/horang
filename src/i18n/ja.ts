// 日本語の文言。원어민 검수 전 초안(V0-4에서 검수).
import type { Messages } from "./en";

/**
 * 구 경계(ゼロ幅スペース). 제목·버튼 같은 짧은 줄은 :lang(ja)에서 keep-all이라 여기서만 줄이 바뀐다
 * (iPhone Safari에 word-break: auto-phrase가 없어서, DESIGN.md §7). 원어민 검수 때 경계도 함께 본다
 */
const B = "\u200b";

export const ja: Messages = {
  langName: "日本語",
  meta: {
    title: "Horang",
    description: "仁川空港からソウル駅までの初日を助ける、非公式のお助けアプリです。",
  },
  common: { back: "戻る", close: "閉じる", stepOf: "ステップ {n}／3" },
  fact: {
    evidence: { A: "現地で確認", B: "公式情報", C: "旅行者の報告" },
    checked: "{date}確認",
    stale: "要再確認",
    notOnSite: "現地ではまだ確認していません。",
    sources: "出典（{n}）",
  },
  notFound: {
    title: `このページは${B}見つかりません`,
    body: `リンクが${B}古いのかもしれません。${B}最初の画面から${B}もう一度どうぞ。`,
    go: "最初の画面へ",
  },
  home: {
    ask: `お困り${B}ですか？`,
    situations: {
      gate: { title: "改札から出られない", hint: "入れない・出られない" },
      card: { title: "どのカードを使う？", hint: "1回用・Tmoney・Climate Card" },
      arex: { title: `AREX：${B}直通列車と${B}一般列車`, hint: "空港 ↔ ソウル駅" },
      station: { title: `ソウル駅：${B}出口と${B}乗り換え`, hint: "1号線・4号線・KTX・15番出口" },
      transit: {
        title: `市内バス・${B}タクシー案内`,
        hint: "降車タッチ・30分乗り換え・運転手さんへの文",
      },
      dining: {
        title: `食堂・${B}キオスク・${B}食事制限カード`,
        hint: "010電話番号・カードエラー・アレルギー・菜食",
      },
    },
    staff: "スタッフに見せる",
    staffKo: "직원에게 보여 주기",
    footer: `非公式の${B}お助けアプリです。${B}鉄道会社の${B}運営では${B}ありません。`,
  },
  gate: {
    title: "改札から出られない",
    ask: `改札で${B}何が${B}起きましたか？`,
    causes: {
      lowBalance: { label: "残高が足りない", headline: `チャージしてから${B}出ましょう` },
      cardError: {
        label: `エラー音・${B}エラー表示が${B}出た`,
        headline: `カード1枚で、${B}同じ${B}読み取り機に`,
      },
      wrongDirection: {
        label: `反対方向の${B}改札に${B}入った`,
        headline: `すぐ出れば${B}1回は${B}無料です`,
      },
      expressTicket: {
        label: `直通列車の${B}乗車券を${B}持っている`,
        headline: `QR読み取り機を${B}使います`,
      },
      other: { label: "その他", headline: `駅員が${B}助けてくれます` },
    },
    ifStuck: `だめなら${B}「{still}」を${B}押すと、${B}駅員さんに${B}見せる文が${B}出ます。`,
    worked: "解決した",
    still: "まだ出られない",
    staffHead: `この画面を${B}駅員さんに${B}見せてください`,
    moreSentences: "ほかの文",
    solved: `通れました。${B}よかった！`,
    home: "最初に戻る",
  },
  card: {
    title: "どのカードを使う？",
    where: {
      ask: `いま${B}どこに${B}いますか？`,
      airport: { label: "仁川空港にいる", hint: `これから${B}ソウルへ${B}向かう` },
      seoul: { label: "もうソウルにいる", hint: "市内を移動する" },
    },
    rides: {
      ask: `どのくらい${B}乗りますか？`,
      few: { label: "数回だけ", hint: "1〜2回の移動" },
      lots: { label: `何日も${B}たくさん${B}乗る`, hint: "ほぼ毎日、地下鉄やバス" },
    },
    result: `あなたに${B}合う${B}カード`,
    later: "あとでソウルで",
    note: "知っておくと安心",
    restart: "最初から",
    cards: {
      single: { name: "1回用交通カード", why: "1回ずつ払います。登録はいりません。" },
      tmoney: { name: "Tmoney", why: "電車・バスにくり返し使える交通カードです。" },
      wowpass: { name: "WOWPASS", why: "交通カードと支払いカードが1枚に。" },
      climate: { name: "Climate Card 短期券", why: "ソウル市内を1〜7日間移動するためのパスです。" },
    },
    figures: {
      deposit: `保証金${B}（降りたあと${B}戻る）`,
      arexExtra: `空港鉄道は${B}運賃に${B}加えて`,
      tmoney: `Tmoney${B}カード`,
      tmoneyFrom: "約{n}ウォンから",
      travelCard: "Tmoney Travel Card",
      wowpass: "カード",
      wowpassOnline: `オンライン${B}事前予約`,
      days: "{n}日",
      day: "1日",
      cardItself: "カード本体",
      plus: "+{n}ウォン",
    },
  },
  arex: {
    title: "AREX",
    heading: `直通列車と${B}一般列車、${B}どっち？`,
    terminal: "ターミナル",
    t1: "第1ターミナル",
    t2: "第2ターミナル",
    route: "ソウル駅と{t}、大人",
    express: "直通列車",
    allstop: "一般列車",
    about: "約{n}",
    min: "分",
    won: `{n}${B}ウォン`,
    expressNote: `乗車券を${B}買います。${B}交通カードは${B}使えません。`,
    allstopNote: `交通カードで${B}タッチ。${B}表示は${B}交通カードの${B}運賃です。`,
    atSeoul: `ソウル駅に${B}着いたら${B}（直通列車）`,
    details: "乗る前に",
    groups: {
      express: `直通列車の${B}乗車券`,
      allstop: `一般列車と${B}交通カード`,
      allstopSub: "ソウル駅→空港、大人",
    },
    figures: {
      t1Card: `第1ターミナル・${B}交通カード`,
      t1Single: `第1ターミナル・${B}1回用カード`,
      t2Card: `第2ターミナル・${B}交通カード`,
      t2Single: `第2ターミナル・${B}1回用カード`,
      deposit: `1回用カードの${B}保証金`,
    },
    hurry: `空港へ${B}向かいますか？`,
    hurryBack: "比較に戻る",
    departHeading: "ソウル駅から出発",
    next: {
      title: "次の直通列車",
      seoul: "ソウル駅",
      route: "{from} → {to}",
      now: "韓国時間 {time}",
      in: "{m}分後",
      leaving: "まもなく発車",
      arrives: "{time}着",
      none: "今日の直通列車は終わりました。明日の始発は{time}です。",
      first: "今日の直通列車の始発は{time}です。",
      note: "公式時刻表より。発車の3分前までにホームに着いてください。",
    },
  },
  station: {
    title: "ソウル駅",
    stationSelect: "駅",
    stations: {
      "seoul-station": {
        name: "ソウル駅",
        ask: `空港鉄道の${B}ホームから、${B}どこへ${B}行きますか？`,
      },
      "hongik-univ": {
        name: "弘大入口駅",
        ask: `弘大入口駅で、${B}どこへ${B}行きますか？`,
      },
      "myeong-dong": {
        name: "明洞駅",
        ask: `明洞駅で、${B}どこへ${B}行きますか？`,
      },
      gangnam: {
        name: "江南駅",
        ask: `江南駅で、${B}どこへ${B}行きますか？`,
      },
      seongsu: {
        name: "聖水駅",
        ask: `聖水駅で、${B}どこへ${B}行きますか？`,
      },
    },
    ask: `空港鉄道の${B}ホームから、${B}どこへ${B}行きますか？`,
    schematic: "荷物があっても通れるエレベーター経路です。図は略図で、縮尺は正確ではありません。",
    legend: { start: "出発", gate: "改札" },
    stepOf: "ステップ {n}／{total}",
    routes: {
      "arex-to-line-4": {
        label: "4号線",
        hint: `地下3階・${B}地下1階を${B}通る${B}エレベーター経路`,
        line: "4号線",
      },
      "arex-to-line-1": {
        label: "1号線",
        hint: `地下3階・${B}地下1階を${B}通る${B}エレベーター経路`,
        line: "1号線",
      },
      "arex-to-exit-15": {
        label: "15番出口（KTX側）",
        hint: `1階への${B}エレベーター経路`,
        line: "15番出口",
      },
      "hongik-arex-to-line-2": {
        label: "空港鉄道 → 2号線乗り換え",
        hint: `地下4階から${B}地下3階を${B}通って${B}地下2階へ`,
        line: "2号線",
      },
      "hongik-line-2-to-exit-9": {
        label: "2号線 → 9番出口（エレベーター）",
        hint: `地下2階から${B}地下1階を${B}通って${B}1階へ`,
        line: "9番出口",
      },
      "myeongdong-to-exit-1": {
        label: "4号線 → 1番出口（エレベーター）",
        hint: `地下3階から${B}地下2階を${B}通って${B}1階へ`,
        line: "1番出口",
      },
      "gangnam-to-exit-1": {
        label: "2号線 → 1番出口（エレベーター）",
        hint: `地下2階から${B}地下1階を${B}通って${B}1階へ`,
        line: "1番出口",
      },
      "seongsu-to-exit-3": {
        label: "2号線 → 3番出口（エレベーター）",
        hint: `地上3階から${B}2階を${B}通って${B}1階へ`,
        line: "3番出口",
      },
    },
    steps: {
      "up-to-b3": {
        title: `エレベーターで${B}地下3階へ`,
        body: "地下7階の空港鉄道ホームから、エレベーターで地下3階の空港鉄道コンコースへ上がります。",
      },
      "transfer-corridor": {
        title: `乗り換え改札を${B}通って${B}地下1階へ`,
        body: "出口の改札ではなく、乗り換え改札でカードをタッチします。乗り換え通路を進み、エレベーターで地下1階の1・4号線コンコースへ上がります。",
      },
      "down-to-platform": {
        title: `{line}の${B}ホームへ${B}下りる`,
        body: "エレベーターで地下2階の{line}ホームへ下ります。",
      },
      "exit-gate": {
        title: "改札を出る",
        body: "地下3階で改札にカードをタッチして出ます。",
      },
      "up-to-exit": {
        title: `15番出口へ${B}上がる`,
        body: "エレベーターで1階の15番出口へ上がります。15番出口はソウル駅（KTX・一般列車）の案内です。",
      },
      "hongik-up-b3": {
        title: `エレベーターで${B}地下4階から${B}地下3階へ`,
        body: "地下4階の空港鉄道ホームから、エレベーターで地下3階コンコースへ上がります。",
      },
      "hongik-transfer-b2": {
        title: `乗り換え改札を${B}通って${B}地下2階の${B}2号線ホームへ`,
        body: "乗り換え改札にカードをタッチし、エレベーターで地下2階へ下りて2号線ホームへ進みます。",
      },
      "hongik-up-b1": {
        title: `エレベーターで${B}地下2階から${B}地下1階へ`,
        body: "地下2階の2号線ホームから、エレベーターで地下1階コンコースへ上がります。",
      },
      "hongik-out-gate": {
        title: `地下1階の${B}改札を${B}出る`,
        body: "改札に交通カードをタッチして出て、8番・9番出口方面へ進みます。",
      },
      "hongik-up-exit-9": {
        title: `地上エレベーターで${B}1階（9番出口）へ`,
        body: "8番・9番出口のあいだにあるエレベーターで地上1階へ上がります。",
      },
      "myeongdong-up-b2": {
        title: `エレベーターで${B}地下3階から${B}地下2階へ`,
        body: "地下3階の4号線ホームから、エレベーターで地下2階コンコースへ上がります。",
      },
      "myeongdong-out-gate": {
        title: `地下2階の${B}改札を${B}出る`,
        body: "改札にカードをタッチして出て、1番出口の案内に沿って進みます。",
      },
      "myeongdong-up-1f": {
        title: `1番出口近くの${B}エレベーターで${B}1階へ`,
        body: "1番出口近くの地上エレベーターで1階へ上がります。",
      },
      "gangnam-up-b1": {
        title: `エレベーターで${B}地下2階から${B}地下1階へ`,
        body: "地下2階の2号線ホームから、エレベーターで地下1階コンコースへ上がります。",
      },
      "gangnam-out-gate": {
        title: `地下1階の${B}改札を${B}出る`,
        body: "改札に交通カードをタッチして出て、1番出口方面へ進みます。",
      },
      "gangnam-up-1f": {
        title: `1番出口近くの${B}エレベーターで${B}1階へ`,
        body: "1番出口近くの地上エレベーターで1階へ上がります。",
      },
      "seongsu-down-2f": {
        title: `エレベーターで${B}地上3階から${B}2階へ`,
        body: "地上3階の2号線ホームから、エレベーターで2階コンコースへ下ります。",
      },
      "seongsu-out-gate": {
        title: `2階の${B}改札を${B}出る`,
        body: "改札に交通カードをタッチして出て、3番出口方面へ進みます。",
      },
      "seongsu-down-1f": {
        title: `エレベーターで${B}1階（3番出口）へ`,
        body: "3番出口近くのエレベーターで地上1階へ下ります。",
      },
    },
    places: {
      "arex-platform": "空港鉄道ホーム",
      "arex-concourse": "空港鉄道コンコース",
      "lines-1-4-concourse": "1・4号線コンコース",
      "line-4-platform": "4号線ホーム",
      "line-1-platform": "1号線ホーム",
      "exit-15": "15番出口",
      "hongik-arex-platform": "空港鉄道ホーム",
      "hongik-arex-concourse": "空港鉄道コンコース",
      "hongik-line-2-platform": "2号線ホーム",
      "hongik-line-2-concourse": "2号線コンコース",
      "hongik-exit-9": "9番出口（1階）",
      "myeongdong-platform": "4号線ホーム",
      "myeongdong-concourse": "地下2階コンコース",
      "myeongdong-exit-1": "1番出口（1階）",
      "gangnam-platform": "2号線ホーム",
      "gangnam-concourse": "地下1階コンコース",
      "gangnam-exit-1": "1番出口（1階）",
      "seongsu-platform": "2号線ホーム",
      "seongsu-concourse": "2階コンコース",
      "seongsu-exit-3": "3番出口（1階）",
    },
    mapLabel: "{route}への経路図（空港鉄道ホームから）。略図で、縮尺は正確ではありません。",
    unconfirmed: {
      label: "現地では未確認：",
      "transfer-gate":
        "乗り換え改札の正確な場所。1・4号線の乗り換え案内に沿って進み、見つからないときは「見つからない」を押してください。",
      "line-1-elevator":
        "1号線ホームへのエレベーターは資料によって違います。ここになければ「見つからない」を押して駅員に見せてください。",
    },
    next: "次へ",
    done: "着いた",
    cantFind: "見つからない",
    arrived: "着きました！",
    home: "最初に戻る",
  },
  transit: {
    title: "市内バス・タクシー案内",
    ask: `市内を${B}どう${B}移動しますか？`,
    modeLabel: "移動手段",
    modes: {
      bus: "市内バス・乗り換え",
      taxi: "タクシー案内",
    },
    bus: {
      headline: `前扉から乗って${B}タッチ、${B}後ろ扉から降りるときも${B}タッチ`,
      summary:
        "ソウルのほとんどのバスは現金が使えません。降りる前にもう一度タッチすると、30分以内の乗り換え割引が適用され、追加運賃を防げます。",
      cards: {
        tapBothTitle: "1. 前扉で乗車タッチ、後ろ扉で降車タッチ",
        tapBothBody:
          "前扉から乗ってTmoneyやWOWPASSをタッチし、後ろ扉から降りる前にもう一度タッチします。",
        transferTitle: "2. 乗り換え割引は30分以内",
        transferBody:
          "降りてタッチしてから30分以内（21時〜翌7時は60分以内）なら、地下鉄とバスの乗り換えが最大4回まで割引されます。",
      },
      factsHead: "公式ルールと運賃",
    },
    taxi: {
      headline: `一般タクシーと${B}模範・大型タクシー、${B}支払い方法`,
      summary:
        "下の韓国語カードを運転手さんに見せてください。Tmoney交通カード、クレジットカード、現金が使えます。",
      cards: {
        standardTitle: "一般中型タクシー（基本4,800ウォン）",
        standardBody:
          "オレンジ・白・銀色の車体。最初の1.6kmまで基本料金で、22時〜翌4時は20%〜40%の深夜割増があります。",
        deluxeTitle: "模範（黒）・大型タクシー（基本7,000ウォン）",
        deluxeBody:
          "金色の帯が入った黒い車体や大型バン。最初の3kmまで基本料金で、深夜割増はありません。",
      },
      factsHead: "公式運賃と支払いルール",
    },
    driverHead: "運転手さん・乗務員に見せる",
    driverSub: "文を選んで「大きく見せる」を押すと画面いっぱいに表示されます。",
  },
  dining: {
    title: "食堂・キオスク・食事制限カード",
    ask: `注文・${B}支払い・${B}食事制限の${B}どれでお困りですか？`,
    modeLabel: "食堂・決済の案内項目",
    modes: {
      kiosk: "キオスク・カード解決",
      dietary: "食事制限・お店のルール",
    },
    kiosk: {
      headline: `キオスクや${B}テーブル注文端末で${B}止まったときは`,
      summary: "韓国の番号（010）入力画面や海外カードのエラーが出たときの解決法です。",
      cards: {
        phoneTitle: "1. 韓国の電話番号（010）を求められたとき",
        phoneBody:
          "スキップボタンを探すか、010-0000-0000と入力して番号表示画面で自分の注文番号を確認します。",
        cardTitle: "2. 海外カードがキオスクで通らないとき",
        cardBody:
          "ICチップを奥まで差し込むか、WOWPASS・Tmoneyを使い、だめならレジの店員さんに直接注文します。",
      },
      factsHead: "キオスク・カード・払い戻しの公式ルール",
    },
    dietary: {
      headline: `アレルギー・${B}菜食・${B}韓国の食堂の基本マナー`,
      summary:
        "野菜料理でも煮干し・牛肉・豚骨のだしやアミの塩辛が使われることがあります。下の韓国語カードを大きく表示して店員さんに見せてください。",
      cards: {
        brothTitle: "スープのだし（육수）・塩辛（젓갈）に注意",
        brothBody:
          "キムチやチゲにはエビの塩辛や魚介・肉のだしが入っていることが多いので、注文前に下のカードで確認してください。",
        etiquetteTitle: "お水・おかずのお代わりとレジ会計",
        etiquetteBody:
          "お水や追加のおかずはセルフサービスのことが多く、食後はテーブルではなく入口のレジで会計します。",
      },
      factsHead: "食事と会計の公式案内",
    },
    staffHead: "食堂・カフェの店員さんに見せる",
    staffSub: "伝えたい文を選んで「大きく見せる」を押してください。",
  },
  staff: {
    title: "スタッフに見せる",
    lead: `この画面を${B}駅員さんに${B}見せてください。`,
    others: "ほかの文",
    show: "大きく見せる",
    helpline: `日本語で${B}話せる人が${B}必要なら`,
  },
  phrase: { draft: "翻訳はネイティブ確認前の下書きです。" },
  langSwitch: { label: "言語" },
  theme: { toLight: "ライトモードにする", toDark: "ダークモードにする" },
};
