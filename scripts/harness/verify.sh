#!/usr/bin/env bash
# 통합 검증 스크립트:
#   bash scripts/harness/verify.sh fast  -> content:check + lint + typecheck + format:check + vitest + 가드 테스트 + 공개 경계
#   bash scripts/harness/verify.sh full  -> fast + build + 포트 4173 확인 + playwright test
set -euo pipefail

cd "$(dirname "$0")/../.."
mode="${1:-full}"

echo "==> [1/6] 콘텐츠 스키마 및 출처 검증 (content:check)"
npm run content:check

echo "==> [2/6] ESLint·타입·포맷 검사"
npm run lint
npm run typecheck
npm run format:check

echo "==> [3/6] 단위 테스트 (Vitest)"
npm run test

echo "==> [4/6] 하네스 및 디자인 가드 검사"
bash scripts/harness/design-guard.sh
bash scripts/harness/guard.test.sh
bash scripts/harness/design-guard.test.sh

echo "==> [5/6] 공개 경계 검사 (check-public)"
bash scripts/check-public.sh

if [ "$mode" = "fast" ]; then
  echo "✓ verify:fast 통과"
  exit 0
fi

echo "==> [6/6] 정적 빌드 및 Playwright E2E 검사"
# 포트 4173을 다른 프로세스가 이미 점유하고 있으면 정리하거나 경고를 띄운다
if lsof -iTCP:4173 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "주의: 포트 4173에서 실행 중인 기존 정적 서버를 종료합니다."
  kill $(lsof -iTCP:4173 -sTCP:LISTEN -t) 2>/dev/null || true
  sleep 1
fi

npm run build
npx playwright test
echo "✓ verify (full) 통과"
