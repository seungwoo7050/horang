import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { ChoiceFlow } from "@/components/ChoiceFlow";
import { FactGroup, FactList } from "@/components/Fact";
import { Figures, type Figure } from "@/components/Figures";
import styles from "@/components/flow.module.css";
import { SponsorSlot } from "@/components/SponsorSlot";
import { getMessages, isLocale, type Locale } from "@/i18n";

// 카드별 근거 claim(research/PHASE_R_CARDS.md + 2026-10-02 사용자·공식 페이지 확인)
const CARDS = {
  single: [
    "arex.single-journey.deposit",
    "seoul-metro.single-journey.deposit",
    "seoul-metro.machines.foreign-card",
  ],
  tmoney: ["tmoney.card.price", "tmoney.travel-card", "tmoney.topup.cash"],
  wowpass: ["wowpass.card", "wowpass.transit-balance", "wowpass.airport"],
  climate: ["climate-card.tourist.prices", "climate-card.where-to-buy", "climate-card.arex-range"],
} as const;
type CardId = keyof typeof CARDS;

/** 상황별 추천(안내 판단이며 사실은 각 카드의 claim이 맡는다) */
const RESULTS: Record<string, { now: CardId[]; later?: CardId[]; note?: string[] }> = {
  // 공항에서는 Climate Card로 탈 수 없고, 직통열차는 교통카드로 탈 수 없다
  "airport-few": {
    now: ["tmoney", "single", "wowpass"],
    note: ["climate-card.no-airport-boarding", "arex.express.no-transit-card"],
  },
  "airport-lots": {
    now: ["wowpass", "tmoney"],
    later: ["climate"],
    // Climate Card 공항 승차 불가는 climate-card.arex-range에 이미 있다
    note: ["arex.express.no-transit-card"],
  },
  "seoul-few": { now: ["single", "tmoney"] },
  "seoul-lots": { now: ["climate", "tmoney"] },
};

/** 카드마다 요점 숫자(claim data). 표가 문장을 다 보여 주는 claim은 접는다 */
function figures(id: CardId, lang: Locale): { rows: Figure[]; folded: string[] } {
  const f = getMessages(lang).card.figures;
  switch (id) {
    case "climate": {
      const c = "climate-card.tourist.prices";
      return {
        rows: [
          { label: f.day, claim: c, key: "d1" },
          ...[2, 3, 5, 7].map((d) => ({
            label: f.days.replace("{n}", String(d)),
            claim: c,
            key: `d${d}`,
          })),
          { label: f.cardItself, claim: c, key: "card" },
        ],
        folded: [c],
      };
    }
    case "wowpass":
      return {
        rows: [
          { label: f.wowpass, claim: "wowpass.card", key: "card" },
          { label: f.wowpassOnline, claim: "wowpass.card", key: "online" },
        ],
        folded: [],
      };
    case "tmoney":
      return {
        rows: [
          { label: f.tmoney, claim: "tmoney.card.price", key: "from", format: f.tmoneyFrom },
          { label: f.travelCard, claim: "tmoney.travel-card", key: "card" },
        ],
        folded: [],
      };
    case "single":
      return {
        rows: [
          { label: f.deposit, claim: "seoul-metro.single-journey.deposit", key: "deposit" },
          {
            label: f.arexExtra,
            claim: "arex.single-journey.deposit",
            key: "extra",
            format: f.plus,
          },
        ],
        folded: [],
      };
  }
}

function Pick({ id, lang }: { id: CardId; lang: Locale }) {
  const c = getMessages(lang).card.cards[id];
  const { rows, folded } = figures(id, lang);
  return (
    <section className={styles.pick}>
      <header>
        <h2>{c.name}</h2>
        <p>{c.why}</p>
      </header>
      <Figures rows={rows} lang={lang} />
      <FactGroup ids={CARDS[id]} folded={folded} lang={lang} />
    </section>
  );
}

function results(lang: Locale) {
  const t = getMessages(lang).card;
  return Object.fromEntries(
    Object.entries(RESULTS).map(([key, r]) => [
      key,
      <>
        {r.now.map((id) => (
          <Pick key={id} id={id} lang={lang} />
        ))}
        {r.later ? (
          <>
            <h2 className={styles.section}>{t.later}</h2>
            {r.later.map((id) => (
              <Pick key={id} id={id} lang={lang} />
            ))}
          </>
        ) : null}
        {r.note ? (
          <>
            <h2 className={styles.section}>{t.note}</h2>
            <FactList ids={r.note} lang={lang} />
          </>
        ) : null}
        <SponsorSlot name="after-card-pick" />
      </>,
    ]),
  );
}

export async function generateMetadata({ params }: PageProps<"/[lang]/card">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "card/", getMessages(lang).card.title) : {};
}

export default async function CardPage({ params }: PageProps<"/[lang]/card">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang).card;
  return (
    <ChoiceFlow
      lang={lang}
      title={t.title}
      morph="card"
      questions={[
        {
          id: "where",
          ask: t.where.ask,
          options: [
            { id: "airport", ...t.where.airport },
            { id: "seoul", ...t.where.seoul },
          ],
        },
        {
          id: "rides",
          ask: t.rides.ask,
          options: [
            { id: "few", ...t.rides.few },
            { id: "lots", ...t.rides.lots },
          ],
        },
      ]}
      results={results(lang)}
      resultHeading={t.result}
      restart={t.restart}
    />
  );
}
