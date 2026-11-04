#!/usr/bin/env bash
# design-guard.sh 테스트: 막아야 할 슬롭·임의간격·외부URL과 통과해야 할 정상 컴포넌트를 검증한다.
set -euo pipefail

cd "$(dirname "$0")/../.."
DESIGN_GUARD="bash scripts/harness/design-guard.sh"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

pass_count=0
fail_count=0

expect_block_file() {
  local label="$1"
  local content="$2"
  local f="$tmpdir/bad.tsx"
  printf '%s\n' "$content" > "$f"
  set +e
  $DESIGN_GUARD "$f" >/dev/null 2>&1
  local code=$?
  set -e
  if [ "$code" -ne 0 ]; then
    pass_count=$((pass_count + 1))
  else
    echo "FAIL (차단되어야 함): $label" >&2
    fail_count=$((fail_count + 1))
  fi
}

expect_allow_file() {
  local label="$1"
  local content="$2"
  local f="$tmpdir/good.tsx"
  printf '%s\n' "$content" > "$f"
  set +e
  $DESIGN_GUARD "$f" >/dev/null 2>&1
  local code=$?
  set -e
  if [ "$code" -eq 0 ]; then
    pass_count=$((pass_count + 1))
  else
    echo "FAIL (허용되어야 함): $label" >&2
    fail_count=$((fail_count + 1))
  fi
}

# 막아야 할 입력
expect_block_file "네온 그라데이션 슬롭 클래스" 'export const Box = () => <div className="bg-gradient-to-r from-purple-500 to-indigo-600" />;'
expect_block_file "과도한 그림자 shadow-2xl" 'export const Card = () => <div className="rounded-xl shadow-2xl p-4" />;'
expect_block_file "임의 픽셀 마진/패딩(p-[13px])" 'export const Row = () => <div className="flex p-[13px] gap-[7px]" />;'
expect_block_file "직접 쓴 외부 https URL" 'export const Link = () => <a href="https://example.com">Go</a>;'

# 통과해야 할 입력
expect_allow_file "4px 스케일과 토큰 기반 컴포넌트" 'export const Clean = () => <div className="flex items-center gap-4 p-4 bg-surface text-ink" />;'
expect_allow_file "SVG 표준 xmlns 허용" 'export const Icon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" />;'

if [ "$fail_count" -ne 0 ]; then
  echo "design-guard.test.sh: 실패 ($fail_count건 실패, $pass_count건 통과)" >&2
  exit 1
fi

echo "design-guard.test.sh: 통과 (${pass_count}/${pass_count})"
