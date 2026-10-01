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

  // 언어 선택 페이지도
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|ja)\/$/);
});
