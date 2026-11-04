import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/seo";
import { FactMeta, NotOnSite } from "@/components/Fact";
import { PhraseCard } from "@/components/PhraseCard";
import { RouteFlow, type RouteChoice, type StationGroup } from "@/components/RouteFlow";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { layoutRoute } from "@/station-map/graph";
import { hubStations } from "@/station-map/hub-stations";
import type { Station } from "@/station-map/types";

// 경로 배치는 빌드 때 계산한다. 경로·단계 문구의 사실은 route.claims가 뒷받침한다.
function choicesForStation(station: Station, lang: Locale): RouteChoice[] {
  const s = getMessages(lang).station;
  return station.routes.map((r) => {
    const m = s.routes[r.id as keyof typeof s.routes];
    return {
      id: r.id,
      label: m.label,
      hint: m.hint,
      layout: layoutRoute(station, r.id),
      steps: r.steps.map((step) => {
        const text = s.steps[step.id as keyof typeof s.steps];
        return {
          title: text.title.replace("{line}", m.line),
          body: text.body.replace("{line}", m.line),
          unconfirmed: step.unconfirmed ? s.unconfirmed[step.unconfirmed] : undefined,
          phrase: <PhraseCard id={step.phrase ?? "station.where-elevator"} lang={lang} />,
        };
      }),
      evidence: (
        <>
          <NotOnSite ids={r.claims} lang={lang} />
          <FactMeta ids={r.claims} lang={lang} />
        </>
      ),
    };
  });
}

function stationGroups(lang: Locale): StationGroup[] {
  const s = getMessages(lang).station;
  return hubStations.map((st) => {
    const meta = s.stations[st.id as keyof typeof s.stations];
    return {
      id: st.id,
      name: meta.name,
      ask: meta.ask,
      routes: choicesForStation(st, lang),
    };
  });
}

export async function generateMetadata({ params }: PageProps<"/[lang]/station">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "station/", getMessages(lang).station.title) : {};
}

export default async function StationPage({ params }: PageProps<"/[lang]/station">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const groups = stationGroups(lang);
  return (
    <RouteFlow
      lang={lang}
      routes={groups.flatMap((g) => g.routes)}
      stations={groups}
      places={getMessages(lang).station.places}
    />
  );
}
