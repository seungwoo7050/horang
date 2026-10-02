import { defineConfig, devices } from "@playwright/test";

// 빌드 결과(out/)를 Cloudflare처럼 서빙해 실제 배포본과 같은 조건으로 확인한다.
// 먼저 `npm run build`가 필요하다(`npm run e2e`가 둘 다 한다).
// E2E_BASE_URL을 주면 로컬 서버 없이 그 주소(배포본)를 검사한다.
const PORT = 4173;
const REMOTE = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: { baseURL: REMOTE ?? `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
  webServer: REMOTE
    ? undefined
    : {
        command: `node scripts/serve-out.mjs ${PORT}`,
        url: `http://localhost:${PORT}/en/`,
        reuseExistingServer: !process.env.CI,
      },
});
