상태: 확정(사람)
브랜치: feature/design-system (devlog: 15-design-system, 앞 기준: main)
문제: 기존 화면은 초기 4개 상황(개찰구, 카드, AREX, 서울역)만 담는 구조와 개별 CSS Modules(`.module.css`)로 짜여 있다. 앞으로 시내 이동·식당/결제·긴급/출국과 7개 국어로 확장하려면 일관된 컴포넌트 체계(Tailwind CSS + `shadcn/ui`)와 여정 단계별 탐색 구조가 필요하며, 정적 export·오프라인·CSP·강제 색상·`<ViewTransition>` 연속성을 깨뜨리지 않고 시각 완성도를 높여야 한다.
결정:
  - Tailwind CSS v4와 `shadcn/ui` 프리미티브(`src/components/ui/*`: Button, Card, Badge, Tabs, Sheet/Dialog, Separator, Accordion 등)를 도입해 기존 컴포넌트를 재구축한다 / 대안: CSS Modules 유지. 도메인과 화면이 3배로 늘어날 때 상태·반응형·접근성 프리미티브(포커스 트랩, 탭 키보드 이동 등)를 매번 수동 CSS로 짜면 파편화가 커진다 / 바꿀 신호: 정적 빌드 번들이 기준보다 과도하게 커지면 사용하지 않는 프리미티브를 제거한다
  - Horang 고유의 Night Arrival 색·간격·모션·타이포 토큰(`globals.css`의 `--color-bg`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-line`, `--color-ribbon`, `--color-ribbon-fill` 등)을 그대로 유지하고, Tailwind 테마 및 `shadcn/ui` 시맨틱 변수와 1:1로 매핑한다 / 대안: `shadcn/ui` 기본 회색(Zinc) 테마로 덮어쓰기. Horang만의 따뜻한 크림·네이비·호박색 리본 정체성과 다크 모드·강제 색상 대비 설계가 사라진다 / 바꿀 신호: 명도 대비가 WCAG AA(본문 4.5:1, 그래픽 3:1)에 미달하는 조합이 발견되면 토큰 값을 조정한다
  - 홈 화면에 여정 단계별 탐색 구조(Journey Category Tabs / Sections: 입국·공항철도 / 시내 이동·환승 / 식당·결제 / 긴급·출국)를 수용할 수 있는 정제된 레이아웃과 반응형 컨테이너(390px 모바일 단일 열, 768px 태블릿·1440px 데스크톱에서도 여백과 위계가 무너지지 않는 중심/격자 레이아웃)를 적용한다 / 대안: 첫 화면에 상황 줄을 10개 이상 일렬로 나열하기. 막힌 순간 한눈에 고르기 어렵고 스크롤이 길어진다 / 바꿀 신호: 탭 전환 없이 한 화면에서 모두 보는 편이 빠르다는 사용성 피드백이 오면 섹션 그룹 헤더 방식으로 바꾼다
  - 기존 E2E 계약(`e2e/flows.spec.ts`, `e2e/a11y.spec.ts`, `e2e/csp.spec.ts`, `e2e/offline.spec.ts`, `e2e/brand.spec.ts`, `e2e/next-train.spec.ts`, `e2e/flow-steps.spec.ts`)과 `<ViewTransition>` 모핑, `PhraseShow` 전체 화면 맞춤, 강제 색상 모드(`forced-colors: active`) 테두리 규칙을 100% 보존한다
완료 기준:
  1. Tailwind CSS 및 `shadcn/ui` 컴포넌트(`src/components/ui/*`)가 구축되고 기존 화면·컴포넌트가 새 디자인 시스템으로 동작한다
  2. 390px, 768px, 1440px 뷰포트(라이트·다크 모드)에서 가로 스크롤(`overflow-x`)이 0건이고 시각적 불균형이 없다
  3. `npm run verify`(단위 테스트, 가드 테스트, 정적 빌드, 서비스 워커·CSP 생성, Playwright 전체 E2E, `axe-core` 접근성 검사)가 모두 통과한다
범위 밖: 시내 이동·식당·긴급 도메인 상세 콘텐츠 추가(16~18에서 수행), 7개 국어 번역 추가(19에서 수행)
외부 의존: 없음
