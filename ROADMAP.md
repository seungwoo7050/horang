# 로드맵: 14번 이후 (여행 전 주기 확장 & 디자인 고도화)

목표는 인천공항과 서울역에서의 **첫 한 시간**만 돕던 Horang을, 외국인 여행자가 한국에 머무는 **여행 내내(입국 → 시내 지하철·버스·택시 이동 → 식당·키오스크·결제 → 약국·분실물·응급 → 도심공항·택스리펀드·출국)** 통신이 불안한 곳에서도 즉시 꺼내 쓰는 **7개 국어 오프라인 포켓 도우미**로 완성하는 것이다.

런타임 백엔드·DB·사용자 계정은 두지 않는다. 모든 화면은 Next.js 정적 export(`output: "export"`)와 서비스 워커 사전 캐시로 동작하고, 모든 사실(요금·시각·규칙·경로)은 `claims.json`에 근거 등급(A/B/C)·출처·검증일을 붙여 빌드 타임에 검증한다.

코드는 숫자 없는 `feature/<slug>` 브랜치에서 구현한 뒤 `main`에 병합(`--no-ff`)하고, 개발로그는 `14-harness`부터 순차 번호를 매긴다.

| 순번 | 코드 브랜치 | 브리프 | 내용 | 완료 기준(요약) | 외부 의존 |
| --- | --- | --- | --- | --- | --- |
| 14 | `feature/harness` | [`briefs/14-harness.md`](briefs/14-harness.md) | 100줄 이하 `AGENTS.md`·`CLAUDE.md`, Claude Code 훅(`.claude/settings.json` + `scripts/harness/guard.sh`, `post-edit.sh`, `stop-check.sh`), 디자인 슬롭·외부 URL 하드코딩을 막는 `design-guard.sh`, CI와 같이 쓰는 `npm run verify:fast` / `npm run verify`, 가드 테스트(`*.test.sh`) | `npm run verify:fast`와 `npm run verify` 통과, 가드 테스트(막을 예·통과할 예) 통과, CI가 같은 스크립트를 부름 | 없음 |
| 15 | `feature/design-system` | [`briefs/15-design-system.md`](briefs/15-design-system.md) | `frontend-design` 스킬 원칙에 따라 Tailwind CSS v4 + `shadcn/ui` 도입 및 기존 CSS Modules 컴포넌트 전면 재구축. Night Arrival 라이트/다크 토큰·`<ViewTransition>`·강제 색상·모션 줄이기 보존, 여정 단계별 탐색 구조(Arrival · City Transit · Dining & Pay · Emergency & Depart) 및 390/768/1440px 반응형 정제 | 전 화면 Tailwind + `shadcn/ui` 전환 완료, 390/768/1440px 가로 스크롤 0건, 기존 E2E·접근성(`axe-core`)·CSP·오프라인 테스트 통과 | 없음 |
| 16 | `feature/city-transit` | [`briefs/16-city-transit.md`](briefs/16-city-transit.md) | **시내 이동·환승 확장**: 지하철·시내버스 환승/하차 태그 규칙(하차 미태그 페널티, 30분 환승, 앞문 승차·뒷문 하차, 현금 없는 버스), 택시 이용·결제·기사님께 보여줄 목적지/요청 카드(`PhraseShow`), 주요 거점역(홍대입구·명동·강남·성수) 엘리베이터·환승 경로 그래프 추가 | 거점역 전환 및 층별 경로 표시 동작, 버스·택시 트러블슈팅 플로우 및 기사님용 크게 보기 동작, 신규 `claims.json`·`phrases.json` 스키마 검증 통과 | 역 현장 확인(B등급으로 수록, A등급 전환은 blocked) |
| 17 | `feature/dining-pay` | [`briefs/17-dining-pay.md`](briefs/17-dining-pay.md) | **식당·키오스크·결제 막힘 해결**: 키오스크/테이블오더 막힘(한국 휴대전화 번호 요구, 해외 카드 IC 거절), 식이제한·알레르기·비건·할랄·매운맛 조합/선택형 직원 크게 보기(`PhraseShow`) 카드, WOWPASS·티머니 시내 충전·환불 안내 | 식이제한·알레르기 선택 시 한국어 큰 글씨가 스크롤 없이 화면에 맞춤 표시, 키오스크·결제 해결 플로우 E2E 통과 | 원어민 감수(reviewed: false 표기, 감수는 blocked) |
| 18 | `feature/emergency-depart` | [`briefs/18-emergency-depart.md`](briefs/18-emergency-depart.md) | **긴급·약국·분실·세금환급·출국**: 증상별 약국 소통 카드(해열·진통, 소화제, 감기, 상처, 알레르기) 및 응급(119·1330), 지하철·택시 분실물 찾기 단계별 안내, 물품보관함(T-Luggage/코인로커), 서울역 도심공항터미널 사전탑승수속·택스리펀드·공항 귀환 안내 | 약국·응급·분실물·출국 플로우 및 `PhraseShow` 동작, 오프라인 상태에서 전 화면 탐색 및 `tel:`·외부 링크 레지스트리 검증 통과 | 없음 |
| 19 | `feature/i18n-expansion` | [`briefs/19-i18n-expansion.md`](briefs/19-i18n-expansion.md) | **7개 국어 확장(`en`, `ja`, `zh-CN`, `zh-TW`, `fr`, `es`, `ro`)**: UI 메시지(`src/i18n/`)와 콘텐츠(`claims.json`, `phrases.json`, `links.json`)를 간체·번체 중국어, 프랑스어, 스페인어, 루마니아어까지 7개 언어로 확장, 언어별 타이포그래피·줄바꿈 규칙, 7개 언어 선택 시트/드롭다운, `hreflang`·사이트맵 반영 | 7개 로케일 정적 빌드 성공, 모든 언어 키·숫자 정합성 테스트(`i18n.test.ts`, `schema.test.ts`) 통과, 320px/390px 7개 언어 가로 넘침 0건 | 다국어 원어민 감수(blocked) |

## 순서를 정한 이유

1. **14(`feature/harness`)**에서 검증 스크립트(`verify:fast`, `verify`)와 디자인·보안 가드(`design-guard.sh`, `guard.sh`)를 먼저 세워야, 이후 디자인 재구축과 대규모 콘텐츠·다국어 확장에서 슬롭 스타일이나 스키마 누락이 들어오지 않는다.
2. **15(`feature/design-system`)**에서 Tailwind CSS + `shadcn/ui`와 여정별 홈 탐색 구조(Arrival · City Transit · Dining & Pay · Emergency & Depart)를 먼저 마련해야, 16~18에서 추가할 새 도메인 화면들이 같은 컴포넌트와 간격·타이포 위계로 일관되게 들어간다.
3. **16~18(`city-transit` → `dining-pay` → `emergency-depart`)**에서 여행자의 실제 시간순 동선(이동 → 식사·결제 → 긴급·출국)에 따라 도메인 콘텐츠와 플로우를 먼저 영어·일본어 기준으로 단단하게 완성한다.
4. **19(`feature/i18n-expansion`)**에서 확정된 전체 도메인 문구와 `claims.json`·`phrases.json`을 한 번에 7개 국어(`en`, `ja`, `zh-CN`, `zh-TW`, `fr`, `es`, `ro`)로 확장해야, 도메인 추가 때마다 7개 언어 파일을 반복 수정하는 비용을 줄인다.

## 뺀 것과 바꿀 신호

| 뺀 것 | 이유 | 다시 넣을 신호 |
| --- | --- | --- |
| 실시간 지하철·버스 도착 API 연동 | 지하·로밍 전 오프라인 환경에서는 API가 실패하고, 키·프록시 Worker 운영 면적이 생긴다. 막힌 순간의 규칙·환승 동선·소통 카드는 정적 데이터로 충분하다 | 실시간 지연·운휴 알림이 핵심 요구가 되어 Cloudflare Worker 프록시를 둘 이유가 생길 때 |
| 지도 타일(네이버·카카오·구글 지도 임베드) | 외부 타일 스크립트는 CSP(`connect-src 'self'`)와 오프라인 사전 캐시 제약을 깨뜨리고, 환승 엘리베이터 층간 이동은 축척 없는 단면 개념도가 더 읽기 쉽다 | 역 밖 도보 길찾기까지 앱 안에서 직접 그려야 할 때 |
| 백엔드 DB 및 사용자 계정·북마크 동기화 | 로그인 없이 링크 하나를 열어 즉시 해결하는 것이 목적이다. 최근 본 역·언어·테마는 `localStorage`로 충분하다 | 여러 기기 사이에 여행 일정을 동기화해야 할 때 |
| AI 실시간 번역/챗봇 호출 | 역무원·식당 직원 앞에서는 생성형 답변을 기다리는 것보다 검증된 짧은 한국어 문장을 화면 가득(`PhraseShow`) 즉시 띄우는 것이 빠르고 정확하다 | 정해진 상황 카드로 덮이지 않는 자유 대화가 자주 필요해질 때 |
