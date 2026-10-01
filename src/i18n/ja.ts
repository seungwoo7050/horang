// 日本語の文言。원어민 검수 전 초안(V0-4에서 검수).
import type { Messages } from "./en";

export const ja: Messages = {
  langName: "日本語",
  meta: {
    title: "Horang",
    description: "仁川空港からソウル駅までの初日を助ける、非公式のお助けアプリです。",
  },
  common: { back: "戻る" },
  fact: {
    evidence: { A: "現地で確認", B: "公式情報", C: "旅行者の報告" },
    checked: "{date}確認",
    stale: "要再確認",
    notOnSite: "現地ではまだ確認していません。",
  },
  home: {
    ask: "お困りですか？",
    sub: "困っている場面をタップしてください。一緒に解決します。",
    situations: {
      gate: { title: "改札から出られない", hint: "入れない・出られない" },
      card: { title: "どのカードを使う？", hint: "1回用・Tmoney・Climate Card" },
      arex: { title: "AREX：直通列車と一般列車", hint: "空港 ↔ ソウル駅" },
      station: { title: "ソウル駅：出口と乗り換え", hint: "1号線・4号線・KTX・15番出口" },
    },
    staff: "スタッフに見せる",
    staffKo: "직원에게 보여 주기",
    footer: "非公式のお助けアプリです。鉄道会社の運営ではありません。",
  },
  gate: {
    title: "改札から出られない",
    stepOf: "ステップ {n}／3",
    ask: "改札で何が起きましたか？",
    causes: {
      lowBalance: { label: "残高が足りない", headline: "チャージしてから出ましょう" },
      cardError: { label: "エラー音・エラー表示が出た", headline: "カード1枚で、同じ読み取り機に" },
      wrongDirection: {
        label: "反対方向の改札に入った",
        headline: "すぐ出れば1回は無料です",
      },
      expressTicket: { label: "直通列車の乗車券を持っている", headline: "QR読み取り機を使います" },
      other: { label: "その他", headline: "駅員が助けてくれます" },
    },
    calm: "大丈夫。よくあることです。急がなくていいですよ。",
    worked: "解決した",
    still: "まだ出られない",
    staffHead: "この画面を駅員さんに見せてください",
    moreSentences: "ほかの文",
    solved: "通れました。よかった！",
    home: "最初に戻る",
  },
  phrase: { draft: "翻訳はネイティブ確認前の下書きです。" },
  langSwitch: { label: "言語" },
};
