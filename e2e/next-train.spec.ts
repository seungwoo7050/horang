import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// 다음 열차는 기기 시간대와 상관없이 한국 시각으로 계산한다. 시계를 고정해 확인한다.
type Row = Record<"t1" | "t2" | "seoul", string>;
const tt = JSON.parse(readFileSync("src/content/timetables.json", "utf8"))["arex-express"] as {
  toSeoul: Row[];
  toAirport: Row[];
};
const atKorea = (hhmm: string) => new Date(`2026-10-02T${hhmm}:00+09:00`);
const firstAtOrAfter = (times: string[], hhmm: string) => times.find((t) => t >= hhmm);

test.use({ timezoneId: "America/New_York" }); // 폰이 아직 고향 시간대인 여행자

test("arriving at T1 at 13:13 Korea time shows the next official Express", async ({ page }) => {
  await page.clock.setFixedTime(atKorea("13:13"));
  await page.goto("/en/arex/");
  const panel = page.locator("section", {
    has: page.getByRole("heading", { name: "Next Express" }),
  });
  await expect(panel.getByText("Now 13:13 in Korea")).toBeVisible();
  const next = firstAtOrAfter(
    tt.toSeoul.map((r) => r.t1),
    "13:13",
  )!;
  await expect(panel.locator("li").first().locator("strong")).toHaveText(next);
  await expect(panel.locator("li")).toHaveCount(3);
});

test("after the last train it says so and gives tomorrow's first", async ({ page }) => {
  await page.clock.setFixedTime(atKorea("23:10"));
  await page.goto("/en/arex/");
  await page.getByRole("button", { name: "Terminal 2" }).click();
  await expect(page.getByText(`Tomorrow's first one leaves at ${tt.toSeoul[0]!.t2}`)).toBeVisible();
});

test("leaving Korea: next Express from Seoul Station with the Terminal 2 arrival", async ({
  page,
}) => {
  await page.clock.setFixedTime(atKorea("06:00"));
  await page.goto("/ja/arex/");
  await page.getByRole("button", { name: "第2ターミナル" }).click();
  await page.getByRole("button", { name: "空港へ向かいますか？" }).click();
  const first = page.locator("ol li").first();
  await expect(first.locator("strong")).toHaveText(tt.toAirport[0]!.seoul);
  await expect(first).toContainText("まもなく発車");
  await expect(first).toContainText(`${tt.toAirport[0]!.t2}着`);
});
