#!/usr/bin/env bash
# 디자인 및 아키텍처 가드:
# 1. AI 슬롭 스타일 클래스(과도한 네온 그라데이션, 무분별한 대형 그림자 등) 차단
# 2. 임의의 비표준 픽셀 간격(예: m-[13px], p-[17px], gap-[11px]) 차단 (4px 스케일 강제)
# 3. 화면/컴포넌트 코드(src/app, src/components) 내 외부 URL(https://) 직접 하드코딩 차단 (OutLink + links.json 강제)
# 쓰는 법: bash scripts/harness/design-guard.sh [검사할 파일 또는 디렉터리...]
set -euo pipefail

cd "$(dirname "$0")/../.."

targets=()
if [ "$#" -gt 0 ]; then
  targets=("$@")
else
  targets=("src/app" "src/components")
fi

fail=0

# 1. AI 슬롭 클래스 패턴
slop_pattern='(bg-gradient-to-(r|l|t|b|tr|tl|br|bl)|from-(purple|indigo|pink|fuchsia|violet)-[0-9]+|via-(purple|indigo|pink|fuchsia|violet)-[0-9]+|to-(purple|indigo|pink|fuchsia|violet)-[0-9]+|shadow-2xl|backdrop-blur-3xl)'
slop_hits="$(grep -rnE --include='*.tsx' --include='*.ts' --include='*.css' -- "$slop_pattern" "${targets[@]}" 2>/dev/null || true)"
if [ -n "$slop_hits" ]; then
  echo "차단(design-guard): AI 슬롭 클래스(네온 그라데이션·과도한 그림자)가 검출되었습니다:" >&2
  echo "$slop_hits" | sed 's/^/  /' >&2
  fail=1
fi

# 2. 임의의 홀수·비표준 픽셀 간격 (Tailwind arbitrary spacing: p-[13px], m-[7px], gap-[15px] 등)
arb_spacing_pattern='\b(p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y)-\[[0-9]+px\]'
arb_hits="$(grep -rnE --include='*.tsx' --include='*.ts' -- "$arb_spacing_pattern" "${targets[@]}" 2>/dev/null || true)"
if [ -n "$arb_hits" ]; then
  echo "차단(design-guard): 임의 픽셀 간격 클래스가 검출되었습니다 (4px 기반 스케일 토큰 사용 필수):" >&2
  echo "$arb_hits" | sed 's/^/  /' >&2
  fail=1
fi

# 3. 화면·컴포넌트 내 직접 외부 https:// 링크 하드코딩 (seo.ts,links.test.tsx,svg xmlns 제외)
url_hits="$(grep -rnE --include='*.tsx' --include='*.ts' -- 'https?://' "${targets[@]}" 2>/dev/null \
  | grep -v 'src/app/seo\.ts:' \
  | grep -v 'src/app/seo\.test\.ts:' \
  | grep -v 'src/content/links\.test\.tsx:' \
  | grep -v 'http://www\.w3\.org/' \
  | grep -v '^\s*//' \
  | grep -v '//.*https\?://' || true)"
if [ -n "$url_hits" ]; then
  echo "차단(design-guard): 화면 코드에 직접 쓴 외부 URL이 검출되었습니다 (links.json과 OutLink를 사용하세요):" >&2
  echo "$url_hits" | sed 's/^/  /' >&2
  fail=1
fi

if [ "$fail" -eq 0 ]; then
  echo "design-guard: 통과"
fi
exit "$fail"
