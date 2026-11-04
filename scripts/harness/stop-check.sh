#!/usr/bin/env bash
# Stop 훅: 에이전트가 작업을 끝내기 전에 verify:fast가 통과하는지 확인한다.
set -euo pipefail

cd "$(dirname "$0")/../.."
npm run verify:fast
