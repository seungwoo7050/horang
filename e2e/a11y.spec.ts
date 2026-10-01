import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// WCAG 2.2 AA(DESIGN.md §4): axe 자동 검사 + axe가 보지 않는 그래픽 대비·동작 줄이기
const SCREENS = ["", "gate/", "card/", "arex/", "station/", "staff/"];

async function axe(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return result.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
  );
}

for (const scheme of ["dark", "light"] as const) {
  test.describe(`${scheme} mode`, () => {
    test.use({ colorScheme: scheme, contextOptions: { reducedMotion: "reduce" } });

    test("every screen passes axe (first step)", async ({ page }) => {
      for (const lang of ["en", "ja"]) {
        for (const path of SCREENS) {
          await page.goto(`/${lang}/${path}`);
          expect(await axe(page), `/${lang}/${path}`).toEqual([]);
        }
      }
    });

    test("later steps pass axe too", async ({ page }) => {
      await page.goto("/en/gate/");
      await page.getByRole("button", { name: "Not enough balance" }).click();
      expect(await axe(page), "gate step 2").toEqual([]);
      await page.getByRole("button", { name: "Still stuck" }).click();
      expect(await axe(page), "gate step 3").toEqual([]);

      await page.goto("/en/card/");
      await page.getByRole("button", { name: /At Incheon Airport/ }).click();
      await page.getByRole("button", { name: /A lot/ }).click();
      expect(await axe(page), "card result").toEqual([]);

      await page.goto("/en/station/");
      await page.getByRole("button", { name: /^Line 4/ }).click();
      expect(await axe(page), "station route").toEqual([]);
    });

    test("the ribbon line keeps 3:1 against the page (WCAG 1.4.11)", async ({ page }) => {
      await page.goto("/en/station/");
      await page.getByRole("button", { name: /^Line 4/ }).click();
      const ratio = await page.evaluate(() => {
        const rgb = (c: string) => (c.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
        const lum = ([r, g, b]: number[]) =>
          [r!, g!, b!]
            .map((v) => v / 255)
            .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
            .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i]!, 0);
        const ribbon = document.querySelector("svg path[stroke-dasharray]")!;
        const line = lum(rgb(getComputedStyle(ribbon).stroke));
        const bg = lum(rgb(getComputedStyle(document.body).backgroundColor));
        return (Math.max(line, bg) + 0.05) / (Math.min(line, bg) + 0.05);
      });
      expect(ratio).toBeGreaterThanOrEqual(3);
    });
  });
}

test.describe("reduced motion", () => {
  test("with Reduce Motion the ribbon is drawn at once, with no animation", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/en/station/");
    await page.getByRole("button", { name: /^Line 4/ }).click();
    const ribbon = page.locator("svg path[stroke-dasharray]");
    await expect(ribbon).toHaveCSS("animation-name", "none");
    await expect(ribbon).toHaveCSS("transition-duration", "0s");
    await ctx.close();
  });

  test("without it, the ribbon animates with the token duration", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    await page.goto("/en/station/");
    await page.getByRole("button", { name: /^Line 4/ }).click();
    await expect(page.locator("svg path[stroke-dasharray]")).toHaveCSS(
      "transition-duration",
      "0.5s",
    );
    await ctx.close();
  });
});
