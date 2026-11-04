import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { Fact, FactList } from "@/components/Fact";
import styles from "@/components/flow.module.css";
import { OutLink } from "@/components/OutLink";
import { PhraseCard } from "@/components/PhraseCard";
import { StaffPhrases } from "@/components/StaffPhrases";
import { TransitFlow } from "@/components/TransitFlow";
import { POINT_PHRASE, getPhrase, phrases } from "@/content";
import { getMessages, isLocale } from "@/i18n";

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
      busFacts={
        <FactList
          ids={["transit.bus.tap-both", "transit.transfer.30min-rule", "transit.bus.cashless"]}
          lang={lang}
        />
      }
      taxiFacts={<FactList ids={["transit.taxi.base-fare", "transit.taxi.payment"]} lang={lang} />}
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
        <section className="flex flex-col gap-3 border-t border-solid border-[var(--color-line)] pt-4">
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
