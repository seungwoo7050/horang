#!/usr/bin/env bash
# PreToolUse 가드: .env 편집, 원격 푸시(git push), 운영 배포(wrangler deploy / npm run deploy), 위험한 rm -rf 차단.
# 입력: 표준 입력 JSON (tool_name, tool_input)
set -euo pipefail

input="$(cat)"
if [ -z "$input" ]; then
  exit 0
fi

tool_name="$(printf '%s' "$input" | node -e '
  let d = "";
  process.stdin.on("data", c => d += c);
  process.stdin.on("end", () => {
    try {
      const j = JSON.parse(d);
      process.stdout.write(String(j.tool_name || ""));
    } catch {
      process.stdout.write("");
    }
  });
')"

case "$tool_name" in
  Edit|Write|MultiEdit)
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
    base="$(basename "$file_path")"
    if [[ "$base" == .env* && "$base" != ".env.example" ]]; then
      echo "차단(guard): $base 파일은 직접 편집할 수 없습니다 (.env.example만 허용)." >&2
      exit 2
    fi
    ;;
  Bash)
    cmd="$(printf '%s' "$input" | node -e '
      let d = "";
      process.stdin.on("data", c => d += c);
      process.stdin.on("end", () => {
        try {
          const j = JSON.parse(d);
          const c = (j.tool_input && (j.tool_input.command || j.tool_input.CommandLine)) || "";
          process.stdout.write(String(c));
        } catch {
          process.stdout.write("");
        }
      });
    ')"
    if printf '%s' "$cmd" | grep -qE '(^|[;&|[:space:]])git([[:space:]]+-C[[:space:]]+[^[:space:]]+)?[[:space:]]+push([[:space:]]|$)'; then
      echo "차단(guard): git push는 사람에게 먼저 확인받은 뒤에만 실행할 수 있습니다." >&2
      exit 2
    fi
    if printf '%s' "$cmd" | grep -qE '(npm[[:space:]]+run[[:space:]]+deploy|wrangler(@[^[:space:]]+)?[[:space:]]+deploy)'; then
      echo "차단(guard): 운영 배포(deploy)는 사람에게 먼저 확인받은 뒤에만 실행할 수 있습니다." >&2
      exit 2
    fi
    if printf '%s' "$cmd" | grep -qE '(>|>>|tee[[:space:]]+|cp[[:space:]]+.*|mv[[:space:]]+.*)(^|[[:space:]/])\.env(\.[a-zA-Z0-9_-]+)?([[:space:]]|$)' && ! printf '%s' "$cmd" | grep -qE '\.env\.example'; then
      echo "차단(guard): 셸 명령으로 .env 파일을 덮어쓸 수 없습니다." >&2
      exit 2
    fi
    if printf '%s' "$input" | grep -qE 'rm[[:space:]]+-[a-zA-Z]*r[a-zA-Z]*f[[:space:]]+(/|~|\.\.|"\$HOME"|\$HOME|\.[[:space:]]*$)'; then
      echo "차단(guard): 저장소 루트 또는 상위·홈 경로에 대한 rm -rf는 금지됩니다." >&2
      exit 2
    fi
    ;;
esac

exit 0
