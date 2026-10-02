import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { ChoiceFlow } from "@/components/ChoiceFlow";
import { FactList } from "@/components/Fact";
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

function Pick({ id, lang }: { id: CardId; lang: Locale }) {
  const c = getMessages(lang).card.cards[id];
  return (
    <section className={styles.pick}>
      <h2>{c.name}</h2>
      <p>{c.why}</p>
      <FactList ids={CARDS[id]} lang={lang} />
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
