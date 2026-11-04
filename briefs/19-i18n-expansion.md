상태: 확정(사람)
브랜치: feature/i18n-expansion (devlog: 19-i18n-expansion, 앞 기준: main)
문제: 현재 앱은 영어(`en`)와 일본어(`ja`) 두 언어만 지원한다. 한국을 찾는 방한 외국인 중 큰 비중을 차지하는 중화권(중국 본토·대만·홍콩·싱가포르)과 유럽·미주(프랑스어·스페인어·루마니아어) 여행자도 모국어로 막힘 없이 읽고 한국어 소통 카드를 띄울 수 있어야 한다.
결정:
  - 지원 로케일(`locales`)을 `["en", "ja", "zh-CN", "zh-TW", "fr", "es", "ro"] as const` 총 7개 언어로 확장한다:
    - `en` (English), `ja` (日本語), `zh-CN` (简体中文), `zh-TW` (繁體中文), `fr` (Français), `es` (Español), `ro` (Română)
  - 대안: 브라우저 자동 번역에 맡기기. 오프라인 상태에서는 브라우저 번역이 동작하지 않고, 교통카드·개찰구·환승 고유 용어("Single-journey card", "All-stop", "Transfer gate")가 오역되면 여행자가 더 길을 잃는다 / 바꿀 신호: 특정 언어의 유지보수 비용이 사용 비중보다 과도해지면 핵심 언어만 정적 빌드하고 나머지는 분리한다
  - `src/content/schema.ts`의 `Claim.text`와 `Link.label`, `Phrase` 스키마를 7개 언어 필수 키(`en`, `ja`, `zh-CN`, `zh-TW`, `fr`, `es`, `ro`)로 확장한다. `hasNumber` 숫자 일치 검증은 언어별 숫자 표기(예: `13,000` 뿐 아니라 유럽어권의 `13 000` / `13.000` / `13000` 또는 통일된 원화 표기 `₩13,000`)를 일관되게 검사하도록 고도화한다
  - `LangSwitch` 컴포넌트를 기존 2개 언어 토글에서 7개 언어를 고를 수 있는 접근성 준수 선택기(`shadcn/ui` 드롭다운 메뉴 또는 모달 시트)로 개편하고, 각 언어 이름을 자기 언어 원어 표기(`English`, `日本語`, `简体中文`, `繁體中文`, `Français`, `Español`, `Română`)로 보여 준다
  - `globals.css`에 `:lang(zh-CN)`, `:lang(zh-TW)` CJK 타이포그래피·줄바꿈 규칙과 `:lang(fr)`, `:lang(es)`, `:lang(ro)` 유럽어 긴 단어·발음 구별 부호(`ș, ț, ă, â, î`) 줄바꿈 규칙을 추가해 320px/390px 좁은 화면에서도 가로 넘침이 없게 한다
  - 루트 언어 감지(`src/app/(root)/page.tsx`)에서 `zh-TW`/`zh-HK`/`zh-MO`/`zh-Hant`는 `zh-TW`로, 그 외 `zh*`는 `zh-CN`으로, `fr*`→`fr`, `es*`→`es`, `ro*`→`ro`, `ja*`→`ja`, 기본값은 `en`으로 연결하고, SEO `hreflang` 및 `sitemap.xml`에 7개 언어를 모두 반영한다
완료 기준:
  1. 7개 언어(`en`, `ja`, `zh-CN`, `zh-TW`, `fr`, `es`, `ro`)의 모든 정적 라우트가 빌드(`out/en/...` ~ `out/ro/...`)되고 프리캐시된다
  2. `src/i18n/i18n.test.ts`와 `src/content/schema.test.ts`가 7개 언어 전체 키 일치 및 `claims.json` 숫자 일치 검사를 통과한다
  3. 320px 및 390px 뷰포트에서 7개 언어 모두 가로 스크롤(`overflow-x`)이 0건이고, 언어 전환기가 키보드·스크린 리더·강제 색상 모드에서 정상 동작한다
  4. `npm run verify` 전체 통과
범위 밖: 아랍어 등 RTL(오른쪽→왼쪽) 레이아웃 언어
외부 의존: 신규 추가 언어(`zh-CN`, `zh-TW`, `fr`, `es`, `ro`) 문구의 원어민 감수(`blocked`에 기록)
