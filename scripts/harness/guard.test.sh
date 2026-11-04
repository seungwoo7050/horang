#!/usr/bin/env bash
# guard.sh 테스트: 막아야 할 입력(exit 2)과 통과해야 할 입력(exit 0)을 검증한다.
set -euo pipefail

cd "$(dirname "$0")/../.."
GUARD="bash scripts/harness/guard.sh"

pass_count=0
fail_count=0

expect_block() {
  local label="$1"
  local payload="$2"
  set +e
  printf '%s' "$payload" | $GUARD >/dev/null 2>&1
  local code=$?
  set -e
  if [ "$code" -eq 2 ]; then
    pass_count=$((pass_count + 1))
  else
    echo "FAIL (차단되어야 함, code=$code): $label" >&2
    fail_count=$((fail_count + 1))
  fi
}

expect_allow() {
  local label="$1"
  local payload="$2"
  set +e
  printf '%s' "$payload" | $GUARD >/dev/null 2>&1
  local code=$?
  set -e
  if [ "$code" -eq 0 ]; then
    pass_count=$((pass_count + 1))
  else
    echo "FAIL (허용되어야 함, code=$code): $label" >&2
    fail_count=$((fail_count + 1))
  fi
}

# 막아야 할 입력
expect_block ".env 파일 직접 수정" '{"tool_name":"Edit","tool_input":{"file_path":"/repo/.env"}}'
expect_block ".env.local 파일 쓰기" '{"tool_name":"Write","tool_input":{"file_path":"/repo/.env.local"}}'
expect_block "git push 실행" '{"tool_name":"Bash","tool_input":{"command":"git push origin main"}}'
expect_block "git -C 경로 push 실행" '{"tool_name":"Bash","tool_input":{"command":"git -C ../DocsArchive push"}}'
expect_block "npm run deploy 실행" '{"tool_name":"Bash","tool_input":{"command":"npm run deploy"}}'
expect_block "wrangler deploy 실행" '{"tool_name":"Bash","tool_input":{"command":"npx wrangler@4.146.0 deploy"}}'
expect_block "셸 리다이렉션으로 .env 덮어쓰기" '{"tool_name":"Bash","tool_input":{"command":"echo SECRET=1 > .env"}}'
expect_block "상위 디렉터리 rm -rf" '{"tool_name":"Bash","tool_input":{"command":"rm -rf .."}}'

# 통과해야 할 입력
expect_allow ".env.example 수정 허용" '{"tool_name":"Edit","tool_input":{"file_path":"/repo/.env.example"}}'
expect_allow "일반 컴포넌트 수정 허용" '{"tool_name":"Edit","tool_input":{"file_path":"/repo/src/components/Screen.tsx"}}'
expect_allow "git status 및 commit 허용" '{"tool_name":"Bash","tool_input":{"command":"git status && git commit -m test"}}'
expect_allow "npm run build 허용" '{"tool_name":"Bash","tool_input":{"command":"npm run build"}}'

if [ "$fail_count" -ne 0 ]; then
  echo "guard.test.sh: 실패 ($fail_count건 실패, $pass_count건 통과)" >&2
  exit 1
fi

echo "guard.test.sh: 통과 (${pass_count}/${pass_count})"
