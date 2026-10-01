import { notFound } from "next/navigation";
import { FactList } from "@/components/Fact";
import { GateFlow, type GateCause } from "@/components/GateFlow";
import { PhraseCard } from "@/components/PhraseCard";
import { getMessages, isLocale, type Locale } from "@/i18n";

// 원인 → 해결 claim → 직원 문장. 사실은 claim으로만 낸다(research/PHASE_R_AIRPORT_GATE.md B-1).
const CAUSES = [
  { id: "lowBalance", claims: ["gate.low-balance.exit"], phrase: "card.low-balance" },
  {
    id: "cardError",
    claims: ["gate.card-clash", "gate.tap-again"],
    phrase: "gate.card-not-working",
  },
  {
    id: "wrongDirection",
    claims: ["gate.reentry.arex", "gate.reentry.seoul-metro"],
    phrase: "gate.wrong-direction",
  },
  { id: "expressTicket", claims: ["arex.express.qr-gate"], phrase: "arex.express-ticket-gate" },
  { id: "other", claims: ["gate.staff-help"], phrase: "gate.cant-exit" },
] as const;

function causes(lang: Locale): GateCause[] {
  const t = getMessages(lang).gate.causes;
  return CAUSES.map((c) => ({
    id: c.id,
    label: t[c.id].label,
    headline: t[c.id].headline,
    help: <FactList ids={c.claims} lang={lang} />,
    phrase: <PhraseCard id={c.phrase} lang={lang} />,
  }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/gate">) {
  const { lang } = await params;
  return isLocale(lang) ? { title: getMessages(lang).gate.title } : {};
}

export default async function GatePage({ params }: PageProps<"/[lang]/gate">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <GateFlow lang={lang} causes={causes(lang)} />;
}
