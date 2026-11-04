import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { DiningFlow } from "@/components/DiningFlow";
import { FactSheet } from "@/components/FactSheet";
import { POINT_PHRASE, getPhrase, phrases } from "@/content";
import { getMessages, isLocale } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/dining">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "dining/", getMessages(lang).dining.title) : {};
}

export default async function DiningPage({ params }: PageProps<"/[lang]/dining">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const m = getMessages(lang);
  const choices = phrases.filter((p) => p.id.startsWith("dining."));
  const point = getPhrase(POINT_PHRASE);

  return (
    <DiningFlow
      lang={lang}
      kioskFacts={
        <FactSheet
          title={m.dining.kiosk.factsHead}
          ids={[
            "dining.kiosk.phone-number",
            "dining.payment.foreign-card-fallback",
            "dining.tmoney.refund-rule",
            "tmoney.topup.cash",
          ]}
          lang={lang}
        />
      }
      dietaryFacts={
        <FactSheet
          title={m.dining.dietary.factsHead}
          ids={["dining.etiquette.self-service"]}
          lang={lang}
        />
      }
      options={choices.map((p) => ({
        id: p.id,
        label: p[lang],
        ko: p.ko,
        reviewed: p.reviewed,
      }))}
      reply={{ ko: point.ko, label: point[lang] }}
    />
  );
}
