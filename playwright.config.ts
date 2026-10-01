import { defineConfig, devices } from "@playwright/test";

// 빌드 결과(out/)를 Cloudflare처럼 서빙해 실제 배포본과 같은 조건으로 확인한다.
// 먼저 `npm run build`가 필요하다(`npm run e2e`가 둘 다 한다).
const PORT = 4173;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
  webServer: {
    command: `node scripts/serve-out.mjs ${PORT}`,
    url: `http://localhost:${PORT}/en/`,
    reuseExistingServer: !process.env.CI,
  },
});
