import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { EmergencyFlow, type EmergencyNumbers } from "@/components/EmergencyFlow";
import { FactSheet } from "@/components/FactSheet";
import styles from "@/components/flow.module.css";
import { OutLink } from "@/components/OutLink";
import { PhraseCard } from "@/components/PhraseCard";
import { StaffPhrases } from "@/components/StaffPhrases";
import { POINT_PHRASE, getClaim, getPhrase, phrases } from "@/content";
import { getMessages, isLocale, type Locale } from "@/i18n";

function num(id: string, key: string) {
  const n = getClaim(id).data?.[key];
  if (n === undefined) throw new Error(`claim ${id}에 data.${key} 없음`);
  return n;
}

function numbers(lang: Locale): EmergencyNumbers {
  const won = (n: number) => getMessages(lang).arex.won.replace("{n}", n.toLocaleString("en-US"));
  return {
    cutoffHours: String(num("depart.city-airport.seoul-station", "t1CutoffHours")),
    cutoffT2Minutes: String(num("depart.city-airport.seoul-station", "t2CutoffMinutes")),
    taxMinSpend: won(num("depart.tax-refund.minimum", "minSpend")),
    taxInstantMax: won(num("depart.tax-refund.minimum", "instantMax")),
  };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/emergency">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "emergency/", getMessages(lang).emergency.title) : {};
}

export default async function EmergencyPage({ params }: PageProps<"/[lang]/emergency">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const m = getMessages(lang);
  const choices = phrases.filter((p) => p.id.startsWith("emergency."));
  const point = getPhrase(POINT_PHRASE);

  return (
    <EmergencyFlow
      lang={lang}
      numbers={numbers(lang)}
      pharmacyFacts={
        <FactSheet
          title={m.emergency.pharmacy.factsHead}
          ids={["emergency.119.interpreting", "emergency.pharmacy.otc", "helpline.1330"]}
          lang={lang}
        />
      }
      pharmacyLinks={
        <div className={styles.row}>
          <OutLink
            id="emergency-119-call"
            lang={lang}
            className={`${styles.primary} ${styles.fromContent}`}
          />
          <OutLink
            id="helpline-1330-call"
            lang={lang}
            className={`${styles.secondary} ${styles.fromContent}`}
          />
        </div>
      }
      lostFacts={
        <FactSheet
          title={m.emergency.lost.factsHead}
          ids={["emergency.lost.subway-taxi"]}
          lang={lang}
        />
      }
      lostLinks={
        <div className={styles.row}>
          <OutLink
            id="lost112-portal"
            lang={lang}
            className={`${styles.secondary} ${styles.fromContent}`}
          />
          <OutLink
            id="helpline-1330-chat"
            lang={lang}
            className={`${styles.primary} ${styles.fromContent}`}
          />
        </div>
      }
      departFacts={
        <FactSheet
          title={m.emergency.depart.factsHead}
          ids={[
            "depart.luggage.tlocker",
            "depart.city-airport.seoul-station",
            "depart.tax-refund.minimum",
          ]}
          lang={lang}
        />
      }
      staffPhrases={
        <StaffPhrases
          cards={Object.fromEntries(
            choices.map((p) => [p.id, <PhraseCard key={p.id} id={p.id} lang={lang} />]),
          )}
          options={choices.map((p) => ({ id: p.id, label: p[lang], ko: p.ko }))}
          initial="emergency.pain-fever"
          othersLabel={m.staff.others}
          showLabel={m.staff.show}
          closeLabel={m.common.close}
          reply={{ ko: point.ko, label: point[lang] }}
        />
      }
    />
  );
}
