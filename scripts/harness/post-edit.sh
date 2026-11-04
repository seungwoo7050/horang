#!/usr/bin/env bash
# PostToolUse 훅: 파일을 편집한 뒤 해당 파일의 린트 또는 콘텐츠 스키마 검사를 즉시 실행해 피드백한다.
set -euo pipefail

input="$(cat)"
if [ -z "$input" ]; then
  exit 0
fi

file_path="$(printf '%s' "$input" | node -e '
  let d = "";
  process.stdin.on("data", c => d += c);
  process.stdin.on("end", () => {
    try {
      const j = JSON.parse(d);
      const p = (j.tool_input && (j.tool_input.file_path || j.tool_input.path)) || "";
      process.stdout.write(String(p));
    } catch {
      process.stdout.write("");
    }
  });
')"

if [ -z "$file_path" ] || [ ! -f "$file_path" ]; then
  exit 0
fi

case "$file_path" in
  *src/content/*.json|*src/content/schema.ts)
    npm run --silent content:check
    ;;
  *.ts|*.tsx|*.mjs|*.mts)
    npx eslint "$file_path"
    ;;
esac

exit 0
