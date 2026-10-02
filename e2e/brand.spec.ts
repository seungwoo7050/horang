import { expect, test, type Locator, type Page } from "@playwright/test";

// 사용자 제공 브랜드 에셋의 파생본(public/brand)이 화면에 제대로 뜨는지

/** 이미지가 실제로 그려졌다(깨진 이미지가 아니다) */
const drawn = (img: Locator) =>
  img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);

/** WCAG 대비(계산된 색 "rgb(r, g, b)" 두 개) */
function contrast(a: string, b: string) {
  const lum = (c: string) => {
    const [r, g, bl] = c
      .match(/\d+/g)!
      .slice(0, 3)
      .map((v) => {
        const x = Number(v) / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

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

  test("home hero: the mascot keeps its box before it loads and waves its paw next to the bubble", async ({
    page,
  }) => {
    for (const width of [320, 360, 412]) {
      await page.setViewportSize({ width, height: 800 });
      for (const lang of ["en", "ja"]) {
        await page.goto(`/${lang}/`);
        const where = `${lang} ${width}px`;
        const hero = page.locator("main img[src='/brand/mascot.webp']");
        await expect(hero).toHaveAttribute("width", "276");
        await expect(hero).toHaveAttribute("height", "336");
        await expect(hero).toHaveAttribute("alt", "");
        await expect.poll(() => drawn(hero)).toBe(true);
        const img = (await hero.boundingBox())!;
        // 비율 그대로(늘어나지 않게)
        expect(Math.abs(img.width / img.height - 276 / 336), where).toBeLessThan(0.01);
        // 말풍선은 마스코트 옆: 들어 올린 앞발(오른쪽 끝, 높이 471~757/1600)을 가리지 않는다
        const bubble = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
        expect(bubble.x, where).toBeGreaterThanOrEqual(img.x + img.width);
        const paw = await page.evaluate(
          ([x, y]) => document.elementFromPoint(x!, y!)?.getAttribute("src"),
          [img.x + img.width - 3, img.y + img.height * (614 / 1600)],
        );
        expect(paw, where).toBe("/brand/mascot.webp");
        // 말풍선 글자는 두 줄 이하(320px에서도 "Do you / need help?")
        const lines = await page.getByRole("heading", { level: 1 }).evaluate((h) => {
          const cs = getComputedStyle(h);
          const inner = h.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
          return Math.round(inner / parseFloat(cs.lineHeight));
        });
        expect(lines, where).toBeLessThanOrEqual(2);
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

  test("help panel: the mascot leans in next to the staff heading, on the brand color, readable", async ({
    page,
  }) => {
    const expected = { light: "rgb(247, 241, 232)", dark: "rgb(15, 23, 42)" };
    for (const scheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      for (const open of [
        async () => page.goto("/en/staff/"),
        async () => {
          await page.goto("/en/gate/");
          await page.getByRole("button", { name: "Not enough balance" }).click();
          await page.getByRole("button", { name: "Still stuck" }).click();
        },
      ]) {
        await open();
        const heading = page.getByRole("heading", { level: 1 });
        const panel = heading.locator("..");
        const bust = panel.locator("img[src='/brand/mascot-bust.webp']");
        await expect(bust).toHaveAttribute("alt", "");
        await expect(bust).toHaveAttribute("width", "144");
        await expect.poll(() => drawn(bust)).toBe(true);
        const [bg, ink] = await heading.evaluate((h) => [
          getComputedStyle(h.parentElement!).backgroundColor,
          getComputedStyle(h).color,
        ]);
        expect(bg, `${scheme} ${page.url()}`).toBe(expected[scheme]);
        expect(contrast(ink!, bg!)).toBeGreaterThanOrEqual(4.5);
        // 어깨 아래(잘린 자리)는 패널 아래 가장자리에 붙어 가려진다
        const p = (await panel.boundingBox())!;
        const b = (await bust.boundingBox())!;
        expect(Math.abs(b.y + b.height - (p.y + p.height))).toBeLessThanOrEqual(1);
        expect(b.y).toBeGreaterThanOrEqual(p.y);
      }
    }
  });

  test("404: the waving mascot shows under the 404's own CSP", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (m) => {
      if (/Content Security Policy/i.test(m.text())) violations.push(m.text());
    });
    for (const scheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      const res = await page.goto("/en/no-such-page/");
      expect(res?.status()).toBe(404);
      const mascot = page.locator("main img[src='/brand/mascot.webp']");
      await expect(mascot).toHaveAttribute("alt", "");
      await expect.poll(() => drawn(mascot), { message: scheme }).toBe(true);
      expect((await mascot.boundingBox())!.height).toBe(168);
    }
    expect(violations).toEqual([]);
  });

  test("/ without JavaScript: the logo matches the brightness above the two languages", async ({
    browser,
  }) => {
    for (const scheme of ["light", "dark"] as const) {
      const ctx = await browser.newContext({ javaScriptEnabled: false, colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto("/");
      const logo = page.getByRole("heading", { level: 1 }).getByRole("img", { name: "Horang" });
      await expect(logo).toHaveCount(1);
      await expect(logo).toHaveAttribute(
        "src",
        scheme === "light" ? "/brand/logo-navy.webp" : "/brand/logo-cream.webp",
      );
      await expect.poll(() => drawn(logo), { message: scheme }).toBe(true);
      await expect(page.getByRole("link", { name: "日本語" })).toHaveAttribute("href", "/ja/");
      await ctx.close();
    }
  });

  test("home-screen icons are the mascot PNGs at their declared sizes; the favicon stays the small SVG face", async ({
    page,
    request,
  }) => {
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    const icons = manifest.icons as { src: string; sizes: string; type: string }[];
    expect(icons.map((i) => i.type)).toEqual(["image/png", "image/png", "image/png"]);
    await page.goto("/en/");
    const apple = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
    for (const [src, size] of [
      ...icons.map((i) => [i.src, i.sizes] as const),
      [apple!, "180x180"] as const,
    ]) {
      const res = await request.get(src);
      expect(res.status(), src).toBe(200);
      const png = await res.body();
      expect(png.subarray(1, 4).toString("ascii"), src).toBe("PNG");
      expect(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, src).toBe(size);
    }
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", /\/icons\/icon\.svg/);
  });

  test("share preview: og:image is the 1200×630 mascot picture and is not in the offline precache", async ({
    page,
    request,
  }) => {
    await page.goto("/ja/");
    const url = await page.locator('meta[property="og:image"]').getAttribute("content");
    const png = await (await request.get(new URL(url!).pathname)).body();
    expect(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`).toBe("1200x630");
    const sw = await (await request.get("/sw.js")).text();
    expect(sw).not.toContain('"/og.png"');
  });
});
