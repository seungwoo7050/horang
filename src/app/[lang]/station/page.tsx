import { notFound } from "next/navigation";
import { FactMeta, NotOnSite } from "@/components/Fact";
import { PhraseCard } from "@/components/PhraseCard";
import { RouteFlow, type RouteChoice } from "@/components/RouteFlow";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { layoutRoute } from "@/station-map/graph";
import { seoulStation } from "@/station-map/seoul-station";

// 경로 배치는 빌드 때 계산한다. 경로·단계 문구의 사실은 route.claims가 뒷받침한다.
function choices(lang: Locale): RouteChoice[] {
  const s = getMessages(lang).station;
  return seoulStation.routes.map((r) => {
    const m = s.routes[r.id as keyof typeof s.routes];
    return {
      id: r.id,
      label: m.label,
      hint: m.hint,
      layout: layoutRoute(seoulStation, r.id),
      steps: r.steps.map((step) => {
        const text = s.steps[step.id as keyof typeof s.steps];
        return {
          title: text.title.replace("{line}", m.line),
          body: text.body.replace("{line}", m.line),
        };
      }),
      evidence: (
        <>
          <NotOnSite ids={r.claims} lang={lang} />
          <FactMeta ids={r.claims} lang={lang} />
        </>
      ),
      sourcesDisagree: !!r.sourcesDisagree,
    };
  });
}

export async function generateMetadata({ params }: PageProps<"/[lang]/station">) {
  const { lang } = await params;
  return isLocale(lang) ? { title: getMessages(lang).station.title } : {};
}

export default async function StationPage({ params }: PageProps<"/[lang]/station">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <RouteFlow
      lang={lang}
      routes={choices(lang)}
      places={getMessages(lang).station.places}
      phrase={<PhraseCard id="station.where-elevator" lang={lang} />}
    />
  );
}
