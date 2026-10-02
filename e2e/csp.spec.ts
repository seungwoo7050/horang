import { expect, test } from "@playwright/test";

// 빌드가 만든 _headers의 CSP(인라인 스크립트 해시) 아래에서 화면이 막힘 없이 동작해야 한다
test("pages run under the generated CSP without violations", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) violations.push(m.text());
  });
  page.on("pageerror", (e) => violations.push(e.message));

  const response = await page.goto("/en/");
  expect(response?.headers()["content-security-policy"]).toContain("script-src 'self' 'sha256-");

  for (const lang of ["en", "ja"]) {
    for (const path of ["", "gate/", "card/", "arex/", "station/", "staff/"]) {
      await page.goto(`/${lang}/${path}`);
      await expect(page.locator("h1").first()).toBeVisible();
    }
  }
  // 인터랙션(클라이언트 이동·상태 변경)도
  await page.goto("/en/");
  await page.getByRole("link", { name: /stuck at the gate/ }).click();
  await page.getByRole("button", { name: "Not enough balance" }).click();
  await expect(page.getByRole("heading", { name: "Top up, then tap out" })).toBeVisible();
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|ja)\/$/);

  expect(violations).toEqual([]);
});
