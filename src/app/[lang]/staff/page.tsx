import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { Fact } from "@/components/Fact";
import { HelpPanel } from "@/components/HelpPanel";
import styles from "@/components/flow.module.css";
import { OutLink } from "@/components/OutLink";
import { PhraseCard } from "@/components/PhraseCard";
import { Screen } from "@/components/Screen";
import { StaffPhrases } from "@/components/StaffPhrases";
import { phrases } from "@/content";
import { getMessages, isLocale } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/staff">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "staff/", getMessages(lang).staff.title) : {};
}

export default async function StaffPage({ params }: PageProps<"/[lang]/staff">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang).staff;
  return (
    <Screen lang={lang} back={`/${lang}/`} title={t.title} morph="staff">
      <HelpPanel>{t.lead}</HelpPanel>
      <StaffPhrases
        cards={Object.fromEntries(
          phrases.map((p) => [p.id, <PhraseCard key={p.id} id={p.id} lang={lang} />]),
        )}
        options={phrases.map((p) => ({ id: p.id, label: p[lang], ko: p.ko }))}
        initial="gate.cant-exit"
        othersLabel={t.others}
        showLabel={t.show}
        closeLabel={getMessages(lang).common.close}
      />
      <h2 className={styles.section}>{t.helpline}</h2>
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
    </Screen>
  );
}
