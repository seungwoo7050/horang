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

// 매분 바뀌는 시계·남은 분은 화면 읽기 중에 끼어들지 않고, 첫 열차가 바뀔 때만 알린다
test("screen readers hear when the next train changes, not every minute", async ({ page }) => {
  await page.clock.install({ time: atKorea("13:13") });
  await page.goto("/en/arex/");
  const panel = page.locator("section", {
    has: page.getByRole("heading", { name: "Next Express" }),
  });
  await expect(panel.getByText("Now 13:13 in Korea")).toBeVisible();
  await expect(panel).not.toHaveAttribute("aria-live", /./);
  const live = page.locator("main [aria-live]");
  const quiet = await live.allTextContents();
  expect(quiet.join("")).toBe("");

  await page.clock.fastForward("01:00");
  await expect(panel.getByText("Now 13:14 in Korea")).toBeVisible();
  expect((await live.allTextContents()).join("")).toBe("");

  const times = tt.toSeoul.map((r) => r.t1);
  const first = firstAtOrAfter(times, "13:14")!;
  const second = times[times.indexOf(first) + 1]!;
  const [h, m] = first.split(":").map(Number) as [number, number];
  const wait = h * 60 + m + 1 - (13 * 60 + 14);
  await page.clock.fastForward(
    `${String(Math.floor(wait / 60)).padStart(2, "0")}:${String(wait % 60).padStart(2, "0")}:00`,
  );
  await expect(panel.locator("li").first().locator("strong")).toHaveText(second);
  await expect(live).toContainText(second);
});
