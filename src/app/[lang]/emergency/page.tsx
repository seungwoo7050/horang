import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { EmergencyFlow } from "@/components/EmergencyFlow";
import { FactList } from "@/components/Fact";
import styles from "@/components/flow.module.css";
import { OutLink } from "@/components/OutLink";
import { PhraseCard } from "@/components/PhraseCard";
import { StaffPhrases } from "@/components/StaffPhrases";
import { POINT_PHRASE, getPhrase, phrases } from "@/content";
import { getMessages, isLocale } from "@/i18n";

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
      pharmacyFacts={
        <FactList
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
      lostFacts={<FactList ids={["emergency.lost.subway-taxi"]} lang={lang} />}
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
        <FactList
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
