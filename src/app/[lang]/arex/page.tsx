import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { ArexCompare, type Terminal } from "@/components/ArexCompare";
import { FactList, FactMeta } from "@/components/Fact";
import { PhraseCard } from "@/components/PhraseCard";
import { Screen } from "@/components/Screen";
import { SponsorSlot } from "@/components/SponsorSlot";
import { getClaim } from "@/content";
import { getMessages, isLocale, type Locale } from "@/i18n";

/** claim의 화면용 숫자(data). 없으면 빌드 실패 */
function num(id: string, key: string) {
  const n = getClaim(id).data?.[key];
  if (n === undefined) throw new Error(`claim ${id}에 data.${key} 없음`);
  return n;
}

const ALLSTOP_FARE: Record<Terminal, string> = {
  t1: "arex.allstop.fare-seoul-t1",
  t2: "arex.allstop.fare-seoul-t2",
};

function numbers(lang: Locale) {
  const t = getMessages(lang).arex;
  const won = (n: number) => t.won.replace("{n}", n.toLocaleString("en-US"));
  const make = (tm: Terminal) => ({
    expressMin: String(num("arex.express.time", tm)),
    expressFare: won(num("arex.express.fare-adult", "adult")),
    // 일반열차 시간은 claim이 "about"(약)이라고 쓴다
    allstopMin: t.about.replace("{n}", String(num("arex.allstop.time", tm))),
    allstopFare: won(num(ALLSTOP_FARE[tm], "card")),
  });
  return { t1: make("t1"), t2: make("t2") };
}

const metaIds = (tm: Terminal) => [
  "arex.express.time",
  "arex.express.fare-adult",
  "arex.allstop.time",
  ALLSTOP_FARE[tm],
  // 카드 아래 짧은 문구(교통카드 불가)의 근거
  "arex.express.no-transit-card",
];

export async function generateMetadata({ params }: PageProps<"/[lang]/arex">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "arex/", getMessages(lang).arex.heading) : {};
}

export default async function ArexPage({ params }: PageProps<"/[lang]/arex">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang).arex;
  return (
    <Screen lang={lang} back={`/${lang}/`} title={t.title}>
      <ArexCompare
        lang={lang}
        numbers={numbers(lang)}
        meta={{
          t1: <FactMeta ids={metaIds("t1")} lang={lang} />,
          t2: <FactMeta ids={metaIds("t2")} lang={lang} />,
        }}
        arrive={
          <FactList
            ids={[
              "arex.express.no-transit-card",
              "arex.express.qr-gate",
              "arex.allstop.fare-seoul-t1",
              "arex.allstop.fare-seoul-t2",
              "arex.single-journey.deposit",
              "climate-card.no-airport-boarding",
            ]}
            lang={lang}
          />
        }
        depart={
          <>
            <FactList
              ids={[
                "arex.express.seoul-departures",
                "seoul-station.arex.express-gate",
                "arex.express.qr-gate",
                "arex.express.no-transit-card",
              ]}
              lang={lang}
            />
            <PhraseCard id="arex.where-express" lang={lang} />
          </>
        }
      />
      <SponsorSlot name="after-arex-pick" />
    </Screen>
  );
}
