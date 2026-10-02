import { expect, test } from "@playwright/test";

test.describe("language", () => {
  test("/ sends a Japanese browser to /ja/", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "ja-JP" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/ja\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await ctx.close();
  });

  test("the chosen language is remembered", async ({ page }) => {
    await page.goto("/en/");
    await page.getByRole("link", { name: "日本語" }).click();
    await expect(page).toHaveURL(/\/ja\/$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/ja\/$/);
  });
});

test("gate: low balance → fix → staff sentence → solved", async ({ page }) => {
  await page.goto("/en/");
  await page.getByRole("link", { name: /stuck at the gate/ }).click();
  await page.getByRole("button", { name: "Not enough balance" }).click();
  await expect(page.getByRole("heading", { name: "Top up, then tap out" })).toBeVisible();
  await expect(page.getByText("Official source · checked").first()).toBeVisible();
  await page.getByRole("button", { name: "Still stuck" }).click();
  await expect(page.locator('blockquote[lang="ko"]')).toContainText("잔액이 부족해요");
  await page.getByRole("button", { name: "That worked" }).click();
  await expect(page.getByRole("heading", { name: /You're through/ })).toBeVisible();
});

test("card: at the airport, riding a lot → WOWPASS and Tmoney now, Climate Card later", async ({
  page,
}) => {
  await page.goto("/en/card/");
  await page.getByRole("button", { name: /At Incheon Airport/ }).click();
  await page.getByRole("button", { name: /A lot/ }).click();
  const names = page.locator("section h2");
  await expect(names).toHaveText(["WOWPASS", "Tmoney", "Climate Card Tourist Pass"]);
});

test("arex: Terminal 2 numbers come from the claims; leaving mode shows Seoul departures", async ({
  page,
}) => {
  await page.goto("/en/arex/");
  await page.getByRole("button", { name: "Terminal 2" }).click();
  // 큰 숫자 칸은 "51" + "min"
  await expect(page.locator("p", { hasText: /^51min$/ })).toBeVisible();
  await expect(page.locator("p", { hasText: /^~66min$/ })).toBeVisible();
  // 비교 카드의 요금 칸(아래 요금 표에도 같은 숫자가 있어 비교 카드로 좁힌다)
  await expect(page.locator("p", { hasText: /^₩5,350$/ })).toBeVisible();
  await page.getByRole("button", { name: "Going to the airport?" }).click();
  // 접힌 출처 안에도 같은 원문이 있어 보이는 첫 문장으로 좁힌다
  await expect(page.getByText(/06:00 to 23:00/).first()).toBeVisible();
});

test("station: Line 1 flags unchecked steps where they happen and walks three steps", async ({
  page,
}) => {
  await page.goto("/en/station/");
  await page.getByRole("button", { name: /^Line 1/ }).click();
  await expect(page.getByText("Not yet checked on site.")).toBeVisible();
  await expect(page.getByRole("img", { name: /Route map for Line 1/ })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText(/where exactly the transfer gate is/)).toBeVisible();
  await page.getByRole("button", { name: "Can't find it?" }).click();
  await expect(page.locator('blockquote[lang="ko"]')).toContainText("갈아타는 곳");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText(/sources disagree about the elevator/)).toBeVisible();
  await page.getByRole("button", { name: "I'm there" }).click();
  await expect(page.getByRole("heading", { name: "You made it!" })).toBeVisible();
});

test("staff: switching sentences and calling 1330", async ({ page }) => {
  await page.goto("/ja/staff/");
  await page.getByRole("button", { name: "エレベーターはどこですか。" }).click();
  await expect(page.locator('blockquote[lang="ko"]')).toHaveText("엘리베이터가 어디예요?");
  await expect(page.getByRole("link", { name: "1330に電話する" })).toHaveAttribute(
    "href",
    "tel:+8221330",
  );
});

test("no screen scrolls sideways on a phone", async ({ page }) => {
  for (const lang of ["en", "ja"]) {
    for (const path of ["", "gate/", "card/", "arex/", "station/", "staff/"]) {
      await page.goto(`/${lang}/${path}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `/${lang}/${path}`).toBeLessThanOrEqual(0);
    }
  }
});

test("theme: sun/moon button overrides the device setting and remembers it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en/");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
  // 기기 설정과 같은 쪽으로 돌아오면 저장을 지우고 다시 기기 설정을 따른다
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /./);
  await page.goto("/en/gate/");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /./);
});
