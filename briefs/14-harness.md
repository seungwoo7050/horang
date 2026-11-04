상태: 확정(오케스트레이터)
브랜치: feature/harness (devlog: 14-harness, 앞 기준: main @ 98b0dca)
문제: 14번 단계부터 에이전트가 디자인 시스템 재구축, 여행 전 주기 도메인 확장, 7개 국어 확장을 구현한다. 지금 저장소에는 에이전트가 읽을 짧은 AGENTS.md도, 위험 명령·슬롭 디자인·외부 링크 우회를 막는 실행 가드도, 로컬과 CI가 함께 부르는 단일 verify 진입점도 없다.
결정:
  - 규칙은 글보다 실행되는 가드로 강제한다(Claude Code 훅 + 셸 가드 스크립트) / 대안: AGENTS.md에 규칙을 길게 쓰기. 길수록 우선순위가 무너지고 지켜진다는 보장이 없다 / 바꿀 신호: 훅이 정상 작업을 자주 막아 우회가 늘면 가드를 줄인다
  - 검사 진입점은 `npm run verify:fast`와 `npm run verify` 두 단계로 통일한다. 로컬 훅, 에이전트, CI가 같은 스크립트를 부른다 / 대안: Makefile. 이 저장소는 npm 스크립트가 관례라 따른다 / 바꿀 신호: 비-Node 도구가 절반을 넘으면
  - `verify:fast`는 `content:check` + `lint` + `typecheck` + `format:check` + `vitest run` + 하네스 가드 테스트(`scripts/harness/*.test.sh`)를 묶고, `verify`는 `verify:fast` + `npm run build` + 포트 4173 충돌 검사 후 `playwright test` + `scripts/check-public.sh`를 묶는다 / 대안: 매번 E2E까지 강제. 정적 빌드와 브라우저 기동 시간이 걸려 편집 루프가 느려진다 / 바꿀 신호: `verify:fast`를 통과하고 `verify`에서 자주 깨지는 검사가 생기면 빠른 쪽으로 옮긴다
  - 쓰기 전(PreToolUse, `scripts/harness/guard.sh`)에 막는 것: `.env*` 편집, `git push`, `wrangler deploy`/`npm run deploy`, 저장소 밖 `rm -rf` / 대안: 권한 설정만 두기. 권한 설정은 이유를 돌려주지 않는다 / 바꿀 신호: 사람이 직접 우회해야 하는 일이 생기면
  - 디자인·아키텍처 가드(`scripts/harness/design-guard.sh`)를 둔다: 무분별한 네온·슬롭 그라데이션 클래스(`bg-gradient-to-`, `from-purple-`, `from-indigo-`, `via-pink-`, `shadow-2xl`), 화면 컴포넌트(`src/app/`, `src/components/`) 안의 직접 외부 URL(`https://`) 하드코딩(`OutLink`와 `links.json` 우회 방지), 공개 금지 키워드 유입을 검사한다 / 대안: 코드 리뷰에만 맡기기. 에이전트가 반복해서 슬롭 클래스를 넣을 수 있다 / 바꿀 신호: 정당한 예외가 생기면 허용 주석이나 경로 예외를 둔다
  - 가드마다 막아야 할 입력과 통과해야 할 입력을 테스트로 둔다(`scripts/harness/guard.test.sh`, `scripts/harness/design-guard.test.sh`). `verify:fast`에 포함한다
  - `AGENTS.md`는 100줄 이하로 명령·불변 제약·포인터만 두고, `CLAUDE.md`는 `AGENTS.md`를 가리키는 한 줄로 둔다
완료 기준:
  1. `npm run verify:fast`와 `npm run verify`가 기준점(`main` @ `98b0dca`) 이상의 테스트 수로 모두 통과한다
  2. `.github/workflows/ci.yml`의 check·e2e 단계가 `npm run verify:fast` 등을 일관되게 사용한다
  3. `scripts/harness/guard.test.sh`와 `scripts/harness/design-guard.test.sh`가 막아야 할 예와 통과해야 할 예를 모두 통과한다
  4. `AGENTS.md`가 100줄 이하이고 `scripts/check-public.sh`가 통과한다
범위 밖: UI 컴포넌트 변경, 새 도메인 콘텐츠 추가
외부 의존: 없음
