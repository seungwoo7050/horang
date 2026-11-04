import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { Fact } from "@/components/Fact";
import { FactSheet } from "@/components/FactSheet";
import styles from "@/components/flow.module.css";
import { OutLink } from "@/components/OutLink";
import { PhraseCard } from "@/components/PhraseCard";
import { StaffPhrases } from "@/components/StaffPhrases";
import { TransitFlow, type TransitNumbers } from "@/components/TransitFlow";
import { POINT_PHRASE, getClaim, getPhrase, phrases } from "@/content";
import { getMessages, isLocale, type Locale } from "@/i18n";

function num(id: string, key: string) {
  const n = getClaim(id).data?.[key];
  if (n === undefined) throw new Error(`claim ${id}에 data.${key} 없음`);
  return n;
}

function numbers(lang: Locale): TransitNumbers {
  const won = (n: number) => getMessages(lang).arex.won.replace("{n}", n.toLocaleString("en-US"));
  return {
    busBase: won(num("transit.bus.cashless", "baseFare")),
    penaltyMax: won(num("transit.bus.tap-both", "penaltyMax")),
    transferMin: String(num("transit.transfer.30min-rule", "minutes")),
    nightMin: String(num("transit.transfer.30min-rule", "nightMinutes")),
    maxTransfers: String(num("transit.transfer.30min-rule", "maxTransfers")),
    taxiStandard: won(num("transit.taxi.base-fare", "standardBase")),
    taxiDeluxe: won(num("transit.taxi.base-fare", "deluxeBase")),
  };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/transit">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "transit/", getMessages(lang).transit.title) : {};
}

export default async function TransitPage({ params }: PageProps<"/[lang]/transit">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const m = getMessages(lang);
  const choices = phrases.filter((p) => p.id.startsWith("transit."));
  const point = getPhrase(POINT_PHRASE);

  return (
    <TransitFlow
      lang={lang}
      numbers={numbers(lang)}
      busFacts={
        <FactSheet
          title={m.transit.bus.factsHead}
          ids={["transit.bus.tap-both", "transit.transfer.30min-rule", "transit.bus.cashless"]}
          lang={lang}
        />
      }
      taxiFacts={
        <FactSheet
          title={m.transit.taxi.factsHead}
          ids={["transit.taxi.base-fare", "transit.taxi.payment"]}
          lang={lang}
        />
      }
      driverPhrases={
        <StaffPhrases
          cards={Object.fromEntries(
            choices.map((p) => [p.id, <PhraseCard key={p.id} id={p.id} lang={lang} />]),
          )}
          options={choices.map((p) => ({ id: p.id, label: p[lang], ko: p.ko }))}
          initial="transit.taxi-destination"
          othersLabel={m.staff.others}
          showLabel={m.staff.show}
          closeLabel={m.common.close}
          reply={{ ko: point.ko, label: point[lang] }}
        />
      }
      helpline={
        <section className={styles.stage}>
          <h2 className={styles.section}>{m.staff.helpline}</h2>
          <Fact id="helpline.1330" lang={lang} />
          <div className={styles.row}>
            <OutLink
              id="helpline-1330-chat"
              lang={lang}
              className={`${styles.secondary} ${styles.fromContent}`}
            />
            <OutLink
              id="helpline-1330-call"
              lang={lang}
              className={`${styles.primary} ${styles.fromContent}`}
            />
          </div>
        </section>
      }
    />
  );
}
