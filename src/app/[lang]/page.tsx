import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import { getMessages, isLocale } from "@/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getMessages(lang);
  const situations = Object.values(t.home.situations);
  return (
    <main>
      <LangSwitch current={lang} />
      <h1>{t.home.ask}</h1>
      <p>{t.home.sub}</p>
      <ul>
        {situations.map((s) => (
          <li key={s.title}>
            <strong>{s.title}</strong> <small>{s.hint}</small>
          </li>
        ))}
      </ul>
      <p>{t.home.staff}</p>
      <footer>{t.home.footer}</footer>
    </main>
  );
}
