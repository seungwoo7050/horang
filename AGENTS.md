# Horang 에이전트 작업 규칙 (AGENTS.md)

## 1. 검증 명령 (단일 진입점)

- **빠른 검사 (편집 중·끝내기 전 필수)**: `npm run verify:fast`
  - 실행 내용: `content:check` → `lint` → `typecheck` → `format:check` → `vitest run` → 하네스·디자인 가드 테스트(`scripts/harness/*.test.sh`)
- **전체 검사 (브랜치 완료 전 필수)**: `npm run verify`
  - 실행 내용: `verify:fast` → `npm run build` (`out/`, `sw.js`, `_headers` 생성) → 포트 4173 충돌 확인 및 `playwright test` → `scripts/check-public.sh`
- **포맷 자동 정리**: `npm run format`

## 2. 아키텍처 불변 제약 (절대 깨뜨리지 말 것)

1. **정적 Export 전용 (`output: "export"`)**:
   - 런타임 서버·API 라우트·DB·동적 SSR을 추가하지 않는다.
   - 첫 방문 이후 오프라인(`sw.js` 사전 캐시)에서도 모든 화면, 시간표, 역 지도가 그대로 열려야 한다.
2. **근거 없는 사실(Claim) 금지**:
   - 요금, 소요 시간, 열차 시각, 환승·태그 규칙, 보관함·택스리펀드 조건 등 모든 사실은 반드시 `src/content/claims.json`에 근거 등급(`A` 현장 확인 / `B` 공식 출처 / `C` 여행자 보고), 출처 URL(`sources`), 검증일(`verifiedAt`)과 함께 등록한다.
   - `claim.data`의 숫자는 지원하는 모든 언어 문장(`claim.text`)에 같은 수로 들어 있어야 한다(`src/content/schema.ts` 검증).
3. **외부 링크 레지스트리 (`OutLink`)**:
   - `src/app/` 및 `src/components/` 안에서 외부 URL(`https://...`)이나 전화번호(`tel:...`)를 직접 하드코딩하지 않는다.
   - 반드시 `src/content/links.json`에 등록하고 `<OutLink id="..." />` 컴포넌트로만 연결한다.
4. **다국어(i18n) 동등성**:
   - 화면 컴포넌트에 사용자 노출 문자열을 직접 쓰지 않고 `src/i18n/` 메시지 키와 `src/content/*.json`만 사용한다.
   - 지원하는 모든 로케일(`locales`)은 동일한 메시지 키 구조와 콘텐츠 키를 100% 갖추어야 한다.
5. **CSP 및 접근성·반응형 무결성**:
   - 인라인 스크립트는 `scripts/postbuild-lib.mts`가 SHA-256 해시를 `_headers`와 404 meta CSP에 넣으므로 임의의 인라인 스크립트/스타일을 추가할 때 CSP E2E(`e2e/csp.spec.ts`) 통과를 확인한다.
   - 라이트·다크 모드, `forced-colors: active`(고대비), `prefers-reduced-motion: reduce`, `axe-core` 접근성, 320px/390px/768px/1440px 가로 스크롤 0건을 유지한다.

## 3. 금지 사항 (하네스 가드로 차단)

- `.env*` 파일 읽기·수정 금지 (`.env.example` 제외)
- `git push`, `npm run deploy`, `wrangler deploy` 실행 금지 (사람에게 확인 요청)
- 저장소 루트 또는 외부 경로 `rm -rf` 금지
- AI 슬롭 디자인 클래스(`bg-gradient-to-`, `from-purple-`, `from-indigo-`, `via-pink-`, `shadow-2xl`) 및 임의 픽셀 간격(`m-[13px]` 등) 사용 금지 (`scripts/harness/design-guard.sh`)
- 공개 브랜치에 비공개 저장소 이름·구직 용어·개인 이메일·API 키 모양 문자열 커밋 금지 (`scripts/check-public.sh`)

## 4. 주요 경로 포인터

- 콘텐츠 및 스키마: `src/content/schema.ts`, `src/content/claims.json`, `src/content/phrases.json`, `src/content/links.json`, `src/content/timetables.json`
- 다국어 메시지: `src/i18n/index.ts`, `src/i18n/en.ts`, `src/i18n/ja.ts`
- 역 경로 그래프: `src/station-map/types.ts`, `src/station-map/graph.ts`, `src/station-map/seoul-station.ts`
- 빌드 후처리(SW·CSP): `scripts/postbuild.mts`, `scripts/postbuild-lib.mts`, `scripts/sw.template.js`
- 하네스 가드·검증: `scripts/harness/verify.sh`, `scripts/harness/guard.sh`, `scripts/harness/design-guard.sh`
