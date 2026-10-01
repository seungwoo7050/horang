import { defaultLocale, getMessages, LOCALE_STORAGE_KEY, locales } from "@/i18n";

// 저장된 선택 → 브라우저 언어(ja면 일본어) → 기본(en) 순서로 언어 페이지로 보낸다.
const pickLocale = `(function(){var l;try{l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}
if(${JSON.stringify(locales)}.indexOf(l)<0){var n=(navigator.languages||[navigator.language||""]);
l=n.some(function(x){return /^ja\\b/i.test(x)})?"ja":${JSON.stringify(defaultLocale)}}
location.replace("/"+l+"/")})()`;

export default function Root() {
  return (
    <main>
      <script dangerouslySetInnerHTML={{ __html: pickLocale }} />
      <nav>
        {locales.map((lang) => (
          <a key={lang} href={`/${lang}/`} hrefLang={lang} lang={lang}>
            {getMessages(lang).langName}
          </a>
        ))}
      </nav>
    </main>
  );
}
