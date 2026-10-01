import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 없는 정적 PWA: `next build`가 out/에 HTML만 만든다.
  output: "export",
  // 정적 호스팅에서 /en/ 같은 경로가 index.html로 바로 열리게 한다.
  trailingSlash: true,
  // 루트 CLAUDE.md는 project-docs 브랜치로 연결된 링크라 next dev가 덮어쓰지 않게 끈다.
  agentRules: false,
};

export default nextConfig;
