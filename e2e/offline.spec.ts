import { expect, test } from "@playwright/test";

// 비행기 모드: 한 번 연 뒤에는 네트워크 없이 핵심 화면이 열려야 한다(CLAUDE.md 오프라인 우선)
test("after one visit, every screen opens offline", async ({ page, context }) => {
  await page.goto("/en/");
  await page.waitForFunction(async () => {
    const keys = await caches.keys();
    if (keys.length === 0) return false;
    const cached = await (await caches.open(keys[0]!)).keys();
    return cached.some((r) => r.url.endsWith("/ja/staff/"));
  });
  await page.evaluate(() => navigator.serviceWorker.ready);
  // 진짜 오프라인: 페이지와 서비스 워커의 fetch 모두 네트워크에 닿지 않게 한다.
  // 서비스 워커의 요청까지 막히려면 PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1(playwright.config.ts)이 필요하다.
  // 없으면 서비스 워커가 서버에서 받아 와 미리 캐시가 비어도 통과한다
  let blockedFromWorker = 0;
  await context.route("**", (route) => {
    if (route.request().serviceWorker()) blockedFromWorker++;
    return route.abort("internetdisconnected");
  });
  await context.setOffline(true);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Do you need help?" })).toBeVisible();

  // 앱 안에서 이동(RSC 요청)도 캐시에서
  await page.getByRole("link", { name: /Which card/ }).click();
  await expect(page.getByRole("heading", { name: "Where are you now?" })).toBeVisible();

  for (const path of ["/ja/gate/", "/en/arex/", "/ja/station/", "/en/staff/"]) {
    await page.goto(path);
    await expect(page.locator("h1").first()).toBeVisible();
  }

  // 이상한 주소(잘못된 퍼센트 인코딩)도 그 언어 첫 화면으로 대신 연다
  await page.goto("/ja/%E0%A4%A/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");

  // 언어 선택 페이지도
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|ja)\/$/);

  // 서비스 워커가 네트워크 먼저 시도한 요청이 실제로 막혔다(막는 장치가 서비스 워커에도 걸렸다는 증거)
  expect(blockedFromWorker).toBeGreaterThan(0);
});
