import { expect, test, type Page } from "@playwright/test";

// 단계 흐름(개찰구·카드·서울역) 공통 동작: 포커스, 브라우저 기록, 연타
const h1 = (page: Page) => page.locator("main h1");

test.describe("focus", () => {
  test.use({ hasTouch: false, isMobile: false });

  for (const [path, first, next] of [
    ["/en/gate/", "Not enough balance", "Top up, then tap out"],
    ["/en/card/", "At Incheon Airport", "How much will you ride?"],
    ["/en/station/", "Line 1", "Take the elevator"],
  ] as const) {
    test(`${path}: a new step moves focus to its heading`, async ({ page }) => {
      await page.goto(path);
      await page.getByRole("button", { name: new RegExp(first) }).focus();
      await page.keyboard.press("Enter");
      await expect(h1(page)).toBeFocused();
      await expect(h1(page)).toContainText(next);
    });
  }

  test("going back a step also moves focus to the heading", async ({ page }) => {
    await page.goto("/en/gate/");
    await page.getByRole("button", { name: "Not enough balance" }).click();
    await page.getByRole("button", { name: "Back" }).click();
    await expect(h1(page)).toHaveText("What happened at the gate?");
    await expect(h1(page)).toBeFocused();
  });

  test("first load does not steal focus", async ({ page }) => {
    await page.goto("/en/gate/");
    await expect(page.locator("body")).toBeFocused();
  });
});

test.describe("browser history", () => {
  test("gate: system back goes to the previous step, not out of the flow", async ({ page }) => {
    await page.goto("/en/");
    await page.getByRole("link", { name: /stuck at the gate/ }).click();
    await page.getByRole("button", { name: "Not enough balance" }).click();
    await page.getByRole("button", { name: "Still stuck" }).click();
    await expect(h1(page)).toHaveText("Show this to station staff");
    await page.goBack();
    await expect(h1(page)).toHaveText("Top up, then tap out");
    await page.goBack();
    await expect(h1(page)).toHaveText("What happened at the gate?");
    // 고른 원인은 표시가 남는다
    await expect(page.getByRole("button", { name: "Not enough balance" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.goForward();
    await expect(h1(page)).toHaveText("Top up, then tap out");
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL(/\/en\/$/);
  });

  test("gate: the step survives a reload, and ‹ does what system back does", async ({ page }) => {
    await page.goto("/en/gate/");
    await page.getByRole("button", { name: "Not enough balance" }).click();
    await page.getByRole("button", { name: "Still stuck" }).click();
    await page.reload();
    await expect(h1(page)).toHaveText("Show this to station staff");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(h1(page)).toHaveText("Top up, then tap out");
    const afterHeaderBack = page.url();
    await page.goForward();
    await expect(h1(page)).toHaveText("Show this to station staff");
    await page.goBack();
    expect(page.url()).toBe(afterHeaderBack);
  });

  test("gate: a shared step link opens that step, and ‹ still walks back", async ({ page }) => {
    await page.goto("/en/gate/");
    await page.getByRole("button", { name: "Not enough balance" }).click();
    await page.getByRole("button", { name: "Still stuck" }).click();
    const url = page.url();
    const fresh = await page.context().newPage();
    await fresh.goto(url);
    await expect(h1(fresh)).toHaveText("Show this to station staff");
    await fresh.getByRole("button", { name: "Back" }).click();
    await expect(h1(fresh)).toHaveText("Top up, then tap out");
    // 같은 자리를 곧바로 다시 누르면 두 번째 탭으로 보고 거른다(아래 double tap). 사람이 다시 누르는 간격을 둔다
    await fresh.waitForTimeout(400);
    await fresh.getByRole("button", { name: "Back" }).click();
    await expect(h1(fresh)).toHaveText("What happened at the gate?");
  });

  test("card: system back undoes the last answer", async ({ page }) => {
    await page.goto("/en/card/");
    await page.getByRole("button", { name: /At Incheon Airport/ }).click();
    await page.getByRole("button", { name: /A lot/ }).click();
    await expect(page.locator("section h2").first()).toHaveText("WOWPASS");
    await page.reload();
    await expect(page.locator("section h2").first()).toHaveText("WOWPASS");
    await page.goBack();
    await expect(h1(page)).toHaveText("How much will you ride?");
    await page.goBack();
    await expect(h1(page)).toHaveText("Where are you now?");
  });

  test("station: system back walks the route steps back to the list", async ({ page }) => {
    await page.goto("/en/station/");
    await page.getByRole("button", { name: /^Line 1/ }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Step 2 of 3")).toBeVisible();
    await page.reload();
    await expect(page.getByText("Step 2 of 3")).toBeVisible();
    await page.goBack();
    await expect(page.getByText("Step 1 of 3")).toBeVisible();
    await page.goBack();
    await expect(h1(page)).toHaveText("From the AREX platform, where are you going?");
  });

  test("going back slides in from the left, forward from the right", async ({ page }) => {
    await page.goto("/en/gate/");
    await page.getByRole("button", { name: "Not enough balance" }).click();
    const stage = page.locator("main h1").locator("..");
    await expect(stage).toHaveClass(/forward/);
    await page.goBack();
    await expect(h1(page)).toHaveText("What happened at the gate?");
    await expect(stage).toHaveClass(/backward/);
  });
});

test.describe("double tap", () => {
  test("gate: a double tap on Still stuck stops at the staff sentence", async ({ page }) => {
    await page.goto("/en/gate/");
    await page.getByRole("button", { name: "Not enough balance" }).click();
    await page.getByRole("button", { name: "Still stuck" }).dblclick();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/en\/gate\//);
    await expect(h1(page)).toHaveText("Show this to station staff");
  });

  test("station: a double tap on Next moves one step", async ({ page }) => {
    await page.goto("/en/station/");
    await page.getByRole("button", { name: /^Line 1/ }).click();
    await page.getByRole("button", { name: "Next" }).dblclick();
    await page.waitForTimeout(500);
    await expect(page.getByText("Step 2 of 3")).toBeVisible();
    await page.getByRole("button", { name: "Next" }).dblclick();
    await page.waitForTimeout(500);
    await expect(page.getByText("Step 3 of 3")).toBeVisible();
  });

  test("‹ double tap at step 2 goes back one step, not out of the flow", async ({ page }) => {
    await page.goto("/en/gate/");
    await page.getByRole("button", { name: "Not enough balance" }).click();
    await page.getByRole("button", { name: "Back" }).dblclick();
    await page.waitForTimeout(500);
    await expect(h1(page)).toHaveText("What happened at the gate?");
    await expect(page).toHaveURL(/\/en\/gate\//);
  });

  test("gate: a double tap on That worked does not leave for home", async ({ page }) => {
    await page.goto("/en/gate/");
    await page.getByRole("button", { name: "Not enough balance" }).click();
    await page.getByRole("button", { name: "That worked" }).dblclick();
    await page.waitForTimeout(500);
    await expect(h1(page)).toHaveText(/You're through/);
  });
});
