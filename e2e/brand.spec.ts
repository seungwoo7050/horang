import { expect, test, type Locator, type Page } from "@playwright/test";

// 사용자 제공 브랜드 에셋의 파생본(public/brand)이 화면에 제대로 뜨는지

/** 이미지가 실제로 그려졌다(깨진 이미지가 아니다) */
const drawn = (img: Locator) =>
  img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);

/** 지금 보이는 워드마크 한 장(숨긴 쪽은 display:none이라 접근성 트리에 없다) */
const wordmark = (page: Page) => page.getByRole("banner").getByRole("img", { name: "Horang" });

test.describe("brand", () => {
  test("home header: navy wordmark on light, cream on dark, and the sun/moon button wins", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/en/");
    await expect(wordmark(page)).toHaveCount(1);
    await expect(wordmark(page)).toHaveAttribute("src", "/brand/wordmark-navy.webp");
    await expect.poll(() => drawn(wordmark(page))).toBe(true);

    await page.emulateMedia({ colorScheme: "dark" });
    await expect(wordmark(page)).toHaveAttribute("src", "/brand/wordmark-cream.webp");
    await expect.poll(() => drawn(wordmark(page))).toBe(true);

    // 기기는 어둡지만 손으로 밝게 고르면 네이비
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await expect(wordmark(page)).toHaveAttribute("src", "/brand/wordmark-navy.webp");
    // 일본어 화면도 같은 이름
    await page.goto("/ja/");
    await expect(wordmark(page)).toHaveAttribute("src", "/brand/wordmark-navy.webp");
  });

  test("home hero: the mascot keeps its box before it loads and hides the cut hand behind the bubble", async ({
    page,
  }) => {
    for (const width of [320, 360, 412]) {
      await page.setViewportSize({ width, height: 800 });
      for (const lang of ["en", "ja"]) {
        await page.goto(`/${lang}/`);
        const hero = page.locator("main img[src='/brand/mascot.webp']");
        await expect(hero).toHaveAttribute("width", "258");
        await expect(hero).toHaveAttribute("height", "336");
        await expect(hero).toHaveAttribute("alt", "");
        await expect.poll(() => drawn(hero)).toBe(true);
        const img = (await hero.boundingBox())!;
        // 비율 그대로(늘어나지 않게)
        expect(Math.abs(img.width / img.height - 258 / 336)).toBeLessThan(0.01);
        // 원본 그림 틀에서 잘린 손끝: 이미지 오른쪽 가장자리, 높이 472~753/1600 자리. 말풍선이 덮는다
        const bubble = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
        const cut = {
          x: img.x + img.width,
          top: img.y + img.height * 0.295,
          bottom: img.y + img.height * 0.471,
        };
        const where = `${lang} ${width}px`;
        expect(bubble.x, where).toBeLessThan(cut.x - 4);
        // 모서리가 둥근 곳(radius)이 아닌 곧은 왼쪽 변이 덮는지: 위아래로 radius만큼 여유
        expect(bubble.y + 4, where).toBeLessThanOrEqual(cut.top);
        expect(bubble.y + bubble.height - 18, where).toBeGreaterThanOrEqual(cut.bottom);
        // 말풍선이 마스코트보다 위에 그려진다
        const onTop = await page.evaluate(
          ([x, y]) => document.elementFromPoint(x!, y!)?.closest("h1") !== null,
          [cut.x - 2, (cut.top + cut.bottom) / 2],
        );
        expect(onTop, where).toBe(true);
      }
    }
  });

  test("home hero and wordmark still show offline", async ({ page, context }) => {
    await page.goto("/en/");
    await page.waitForFunction(async () => {
      const keys = await caches.keys();
      if (keys.length === 0) return false;
      const cached = await (await caches.open(keys[0]!)).keys();
      const urls = cached.map((r) => new URL(r.url).pathname);
      return [
        "/brand/mascot.webp",
        "/brand/wordmark-navy.webp",
        "/brand/wordmark-cream.webp",
      ].every((u) => urls.includes(u));
    });
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.route("**", (route) => route.abort("internetdisconnected"));
    await context.setOffline(true);
    for (const scheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.reload();
      await expect(page.getByRole("heading", { name: "Do you need help?" })).toBeVisible();
      await expect
        .poll(() => drawn(page.locator("main img[src='/brand/mascot.webp']")), { message: scheme })
        .toBe(true);
      await expect.poll(() => drawn(wordmark(page)), { message: scheme }).toBe(true);
    }
  });
});
