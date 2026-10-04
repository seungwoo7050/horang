import { expect, test, type Page } from "@playwright/test";

test.describe("language", () => {
  test("/ sends a Japanese browser to /ja/", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "ja-JP" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/ja\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await ctx.close();
  });

  test("/ follows the order of the browser's languages", async ({ browser }) => {
    for (const [languages, expected] of [
      [["en-US", "en", "ja"], "/en/"],
      [["fr-FR", "ja", "en"], "/ja/"],
      [["ko-KR"], "/en/"],
    ] as const) {
      const ctx = await browser.newContext();
      await ctx.addInitScript((l) => {
        Object.defineProperty(navigator, "languages", { get: () => l });
      }, languages);
      const page = await ctx.newPage();
      await page.goto("/");
      await expect(page, languages.join(",")).toHaveURL(new RegExp(`${expected}$`));
      await ctx.close();
    }
  });

  test("/ has a title and language links even without JavaScript", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveTitle("Horang");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/$/);
    await expect(page.locator('link[rel="alternate"][hreflang="ja"]')).toHaveAttribute(
      "href",
      /\/ja\/$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
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
  // 같은 자리 버튼을 300ms 안에 다시 누르면 두 번째 탭으로 보고 거른다(flow-steps.spec double tap). 읽는 간격을 둔다
  await page.waitForTimeout(400);
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

test("staff: the sentence goes full screen, and ×, Esc and system back all close it", async ({
  page,
}) => {
  await page.goto("/en/staff/");
  await page.getByRole("button", { name: "Where is the elevator?" }).click();
  const show = page.getByRole("button", { name: "Show big" });
  const dialog = page.getByRole("dialog", { name: "Where is the elevator?" });

  await show.click();
  await expect(dialog.locator('blockquote[lang="ko"]')).toHaveText("엘리베이터가 어디예요?");
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  // 초점은 닫기 버튼에 머문다
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(show).toBeFocused();

  await show.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(show).toBeFocused();

  // 시스템 뒤로는 화면을 떠나지 않고 닫기만 한다. 고른 문장도 그대로
  await show.click();
  await expect(dialog).toBeVisible();
  await page.goBack();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/en\/staff\/$/);
  await expect(page.locator('blockquote[lang="ko"]')).toHaveText("엘리베이터가 어디예요?");
});

test("gate: before choosing a cause, staff is one tap away", async ({ page }) => {
  await page.goto("/en/gate/");
  await page.getByRole("link", { name: /Show this to staff/ }).click();
  await expect(page).toHaveURL(/\/en\/staff\/$/);
  await expect(page.locator('blockquote[lang="ko"]')).toHaveText("개찰구에서 나갈 수가 없어요.");
});

test("arex: folded source lines show the grade and date, the grade name only when opened", async ({
  page,
}) => {
  await page.goto("/en/arex/");
  const sources = page.locator("main details").first();
  const head = sources.locator("summary");
  await expect(head).toContainText("checked Oct");
  // 등급 이름은 스크린 리더용으로 남아 있지만 1px로 잘려 보이지 않는다
  const name = await head.getByText("Official source").boundingBox();
  expect(name!.width).toBeLessThanOrEqual(1);
  await head.click();
  await expect(sources.getByText("Official source · checked").first()).toBeVisible();
});

test("gate: step 3 sentence also goes full screen, and system back closes it without leaving the step", async ({
  page,
}) => {
  await page.goto("/en/gate/");
  await page.getByRole("button", { name: "Not enough balance" }).click();
  await page.getByRole("button", { name: "Still stuck" }).click();
  await expect(page.locator("main h1")).toHaveText("Show this to station staff");
  const show = page.getByRole("button", { name: "Show big" });
  await show.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator('blockquote[lang="ko"]')).toContainText("잔액이 부족해요");
  // 단계 흐름은 단계가 바뀌면 새 제목으로 초점을 옮긴다(스크린 리더가 새 단계를 읽음). 닫기는 단계 이동이 아니다
  await page.evaluate(() => {
    const w = window as unknown as { h1Focus: number };
    w.h1Focus = 0;
    document.querySelector("main h1")!.addEventListener("focus", () => w.h1Focus++);
  });
  await page.goBack();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/cause=lowBalance&step=2/);
  await expect(page.locator("main h1")).toHaveText("Show this to station staff");
  // 같은 단계로 돌아온 뒤로는 단계 이동이 아니다: 초점은 제목이 아니라 크게 보기 버튼에 남는다
  // (모핑이 끝난 뒤 늦게 도는 effect가 초점을 옮기지 않는지 보려고 전환 시간보다 오래 기다린다)
  await page.waitForTimeout(800);
  await expect(show).toBeFocused();
  expect(await page.evaluate(() => (window as unknown as { h1Focus: number }).h1Focus)).toBe(0);
  // 한 번 더 뒤로 = 이전 단계
  await page.goBack();
  await expect(page.locator("main h1")).toHaveText("Top up, then tap out");
});

test("staff and gate: the big view also asks staff, in Korean, to point instead of explaining", async ({
  page,
}) => {
  for (const path of ["/en/staff/", "/en/gate/?cause=lowBalance&step=2"]) {
    await page.goto(path);
    await page.getByRole("button", { name: "Show big" }).click();
    const dialog = page.getByRole("dialog");
    const ask = dialog.locator('p[lang="ko"]');
    await expect(ask).toHaveText("한국어를 잘 몰라요. 손가락으로 가리켜 주세요.");
    await expect(
      dialog.getByText("I don't understand much Korean. Could you point for me?"),
    ).toBeVisible();
    // 보여 주는 문장보다 작게: 눈은 먼저 큰 문장으로 간다
    const size = (l: typeof ask) => l.evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    expect(await size(ask)).toBeLessThan(await size(dialog.locator('blockquote[lang="ko"]')));
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  }
  // 고르는 목록에는 없다
  await page.goto("/en/staff/");
  await expect(page.getByRole("button", { name: /Could you point/ })).toHaveCount(0);
});

test("staff: where the browser allows it, showing big also hides the browser bars, and leaving that closes it", async ({
  page,
}) => {
  await page.goto("/en/staff/");
  const show = page.getByRole("button", { name: "Show big" });
  const dialog = page.getByRole("dialog");
  const fullscreen = () => page.evaluate(() => document.fullscreenElement !== null);
  expect(await page.evaluate(() => document.fullscreenEnabled)).toBe(true);

  // × 로 닫으면 전체 화면도 풀린다
  await show.click();
  await expect(dialog).toBeVisible();
  await expect.poll(fullscreen).toBe(true);
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toHaveCount(0);
  await expect.poll(fullscreen).toBe(false);

  // 브라우저 쪽에서 전체 화면을 끝내면(Android 뒤로가 먼저 전체 화면을 끝낸다) 크게 보기도 닫힌다. 화면은 그대로
  await show.click();
  await expect.poll(fullscreen).toBe(true);
  // 모핑(크게 보기가 화면에 붙기 전)이 끝나기 전에 끝내도 놓치지 않는다: 전환 시간보다 기다려 늦게 열리지 않는지도 본다
  await page.evaluate(() => document.exitFullscreen());
  await expect
    .poll(() => page.evaluate(() => "horangPhraseShow" in (history.state ?? {})))
    .toBe(false);
  await page.waitForTimeout(600);
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/en\/staff\/$/);
});

test("staff: full screen keeps the screen awake, again after coming back to the tab", async ({
  page,
}) => {
  // 실제 잠금 대신 요청·해제 수를 세는 가짜(헤드리스 브라우저는 화면이 없다)
  await page.addInitScript(() => {
    const w = window as unknown as { wl: { req: number; rel: number } };
    w.wl = { req: 0, rel: 0 };
    Object.defineProperty(navigator, "wakeLock", {
      value: {
        request: async () => {
          w.wl.req++;
          return { release: async () => void w.wl.rel++ };
        },
      },
    });
  });
  const count = () => page.evaluate(() => (window as unknown as { wl: object }).wl);
  const visibility = (state: "visible" | "hidden") =>
    page.evaluate((s) => {
      Object.defineProperty(document, "visibilityState", { value: s, configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    }, state);

  await page.goto("/en/staff/");
  await page.getByRole("button", { name: "Show big" }).click();
  await expect.poll(count).toEqual({ req: 1, rel: 0 });
  await visibility("hidden");
  await visibility("visible");
  await expect.poll(count).toEqual({ req: 2, rel: 0 });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(count).toEqual({ req: 2, rel: 1 });
});

test("arex: switching to and from the departure mode starts at the top of the new view", async ({
  page,
}) => {
  await page.goto("/en/arex/");
  await page.getByRole("button", { name: "Going to the airport?" }).click();
  await expect(page.getByRole("heading", { name: "Leaving from Seoul Station" })).toBeInViewport();
  await page.getByRole("button", { name: "Back to the comparison" }).click();
  await expect(page.getByRole("heading", { name: "Express or All-stop?" })).toBeInViewport();
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

test("an unknown address shows Horang's 404 with a way back in both languages", async ({
  page,
}) => {
  const res = await page.goto("/ja/no-such-page/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This page isn't here" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go to the first screen" })).toHaveAttribute(
    "href",
    "/en/",
  );
  await expect(page.getByRole("link", { name: "最初の画面へ" })).toHaveAttribute("href", "/ja/");
});

test("a malformed address gets an error page, and the server keeps serving", async ({
  request,
}) => {
  const bad = await request.get("/en/%E0%A4%A/", { maxRedirects: 0 });
  expect(bad.status()).toBeGreaterThanOrEqual(400);
  expect(bad.status()).toBeLessThan(500);
  expect((await request.get("/en/")).status()).toBe(200);
});

test("theme: the address bar color (theme-color) follows the chosen brightness after reloads", async ({
  page,
}) => {
  // 지금 적용되는 theme-color(media가 맞는 meta)가 화면 배경 토큰과 같은지
  const matches = () =>
    page.evaluate(() => {
      const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
      const used = metas.find((m) => !m.media || matchMedia(m.media).matches)?.content;
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim();
      return `${used} = ${bg}`;
    });
  const same = (s: string) => s.split(" = ")[0] === s.split(" = ")[1];
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en/");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  expect(same(await matches()), await matches()).toBe(true);
  await page.reload();
  expect(same(await matches()), `after reload: ${await matches()}`).toBe(true);
  await page.goto("/en/gate/");
  expect(same(await matches()), `another screen: ${await matches()}`).toBe(true);
  // 앱 안 이동: Next가 머리를 다시 그리며 meta를 뺐다 넣는 동안에도 그려지는 모든 프레임에서 맞아야 한다.
  // 한 순간만 재면 빠진 뒤 다시 넣기 전 틈(최대 수백 ms)에 걸리느냐에 따라 결과가 갈린다
  await page.goto("/en/");
  await page.evaluate(() => {
    const frames: string[] = ((window as unknown as { __tc: string[] }).__tc = []);
    const sample = () => {
      const metas = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')];
      const used = metas.find((m) => !m.media || matchMedia(m.media).matches)?.content;
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim();
      frames.push(`${used} = ${bg}`);
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.getByRole("link", { name: /stuck at the gate/ }).click();
  await expect(page.getByRole("heading", { name: "What happened at the gate?" })).toBeVisible();
  // Next가 기기 밝기별 meta 둘을 다시 넣어 머리가 자리 잡을 때까지(고른 밝기 meta와 함께) 기다린 뒤 프레임 기록을 본다
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.querySelectorAll('meta[name="theme-color"][media]').length >= 2 &&
          !!document.querySelector('meta[name="theme-color"][data-chosen]'),
      ),
    )
    .toBe(true);
  const frames = await page.evaluate(() => (window as unknown as { __tc: string[] }).__tc);
  expect(
    frames.filter((f) => !same(f)),
    `in-app move, wrong frames of ${frames.length}`,
  ).toEqual([]);
  expect(same(await matches()), `in-app move: ${await matches()}`).toBe(true);
  await page.goto("/en/");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.emulateMedia({ colorScheme: "light" });
  expect(same(await matches()), `device turned light: ${await matches()}`).toBe(true);
});

test("404: the Japanese note breaks only at phrase boundaries, like the app screens", async ({
  page,
}) => {
  await page.goto("/en/no-such-page/");
  await expect(page.locator('section[lang="ja"] p').first()).toHaveCSS("word-break", "keep-all");
});

// 공항철도 비교 칸의 큰 숫자+단위("約59分")는 가장 좁은 폰(320px)에서도 한 줄로 칸 안에 들어가야 한다
test.describe("320px phone", () => {
  test.use({ viewport: { width: 320, height: 700 } });

  test("arex: big numbers stay on one line inside their column", async ({ page }) => {
    for (const lang of ["en", "ja"]) {
      await page.goto(`/${lang}/arex/`);
      for (const terminal of [0, 1]) {
        await page.locator('[role="group"] button').nth(terminal).click();
        const cells = await page.locator("section p:has(> small)").evaluateAll((ps) =>
          ps.map((p) => {
            const s = getComputedStyle(p);
            const range = document.createRange();
            range.selectNodeContents(p);
            const col = p.parentElement!;
            const cs = getComputedStyle(col);
            const inner =
              col.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            return {
              text: p.textContent,
              lines: Math.round(p.getBoundingClientRect().height / parseFloat(s.lineHeight)),
              fits: range.getBoundingClientRect().width <= inner + 0.5,
            };
          }),
        );
        expect(cells.length, `/${lang}/arex/ terminal ${terminal}`).toBeGreaterThanOrEqual(2);
        for (const c of cells) expect(c, `/${lang}/arex/`).toMatchObject({ lines: 1, fits: true });
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `/${lang}/arex/`).toBeLessThanOrEqual(0);
    }
  });
});

// 일본어 화면의 칸(버튼·카드·이름-값 줄) 안 글자는 오른쪽 끝(문장부호 포함)이 칸 안쪽 경계를 넘지 않고,
// 칸도 화면 본문 폭을 넘지 않아야 한다. 구 경계(U+200B)가 없는 문장이 keep-all 칸에 들어가면 한 덩어리가 되어 밀려 나간 적이 있다
for (const width of [320, 360]) {
  test.describe(`${width}px phone, Japanese`, () => {
    test.use({ viewport: { width, height: 800 } });

    const outside = (page: Page, selector: string) =>
      page.locator(selector).evaluateAll((els) => {
        const main = document.querySelector("main")!;
        const ms = getComputedStyle(main);
        const mainRight = main.getBoundingClientRect().right - parseFloat(ms.paddingRight);
        return els.flatMap((el) => {
          const cs = getComputedStyle(el);
          const box = el.getBoundingClientRect();
          const inner = box.right - parseFloat(cs.borderRightWidth) - parseFloat(cs.paddingRight);
          const range = document.createRange();
          range.selectNodeContents(el);
          const textRight = Math.max(...[...range.getClientRects()].map((r) => r.right));
          const bad: string[] = [];
          if (textRight > inner + 0.5)
            bad.push(`text past card by ${(textRight - inner).toFixed(1)}px: ${el.textContent}`);
          if (box.right > mainRight + 0.5)
            bad.push(
              `card past screen body by ${(box.right - mainRight).toFixed(1)}px: ${el.textContent}`,
            );
          return bad;
        });
      });

    test("staff: phrase cards keep every character, end punctuation too, inside", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/ja/staff/");
      await expect(page.locator("main ul button")).toHaveCount(12);
      expect(await outside(page, "main ul button, main figure > *, main a")).toEqual([]);
    });

    test("card: figure rows keep the name and the amount inside", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/ja/card/");
      await page.getByRole("button", { name: /仁川空港にいる/ }).click();
      await expect(page.getByRole("heading", { name: /どのくらい乗りますか/ })).toBeVisible();
      // 같은 자리 두 번째 탭은 흐름이 무시하므로(useFlowHistory) 키보드로 고른다
      await page.getByRole("button", { name: /数回だけ/ }).press("Enter");
      await expect(page.locator("main dl dt").first()).toBeVisible();
      expect(await outside(page, "main dl dt, main dl dd")).toEqual([]);
    });
  });
}
