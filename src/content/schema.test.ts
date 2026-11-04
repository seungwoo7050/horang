import { describe, expect, it } from "vitest";
import { Claim, ClaimsFile, PhrasesFile, staleness } from "./schema";

const claim = (over: Partial<Claim> = {}): Claim => ({
  id: "arex.express.fare-adult",
  kind: "fare",
  text: {
    en: "Express adult fare is ₩13,000.",
    ja: "直通列車の大人運賃は13,000ウォンです。",
    "zh-CN": "直达列车成人票价为 ₩13,000。",
    "zh-TW": "直達列車成人票價為 ₩13,000。",
    fr: "Le tarif adulte Express est de ₩13,000.",
    es: "La tarifa de adulto del Expreso es de ₩13,000.",
    ro: "Tariful pentru adulți la Expres este ₩13,000.",
  },
  evidence: "B",
  sources: [{ url: "https://www.airportrailroad.com/train/express/introduce", title: "AREX" }],
  verifiedAt: "2026-10-01",
  verifiedBy: "test",
  ...over,
});

describe("ClaimsFile", () => {
  it("accepts a sourced claim", () => {
    expect(ClaimsFile.safeParse([claim()]).success).toBe(true);
  });

  it("rejects a claim without sources", () => {
    expect(ClaimsFile.safeParse([claim({ sources: [] })]).success).toBe(false);
  });

  it("rejects an unknown evidence grade", () => {
    expect(ClaimsFile.safeParse([{ ...claim(), evidence: "D" }]).success).toBe(false);
  });

  it("accepts screen numbers that appear in both texts", () => {
    expect(ClaimsFile.safeParse([claim({ data: { adult: 13000 } })]).success).toBe(true);
  });

  it("rejects screen numbers missing from a text", () => {
    const r = ClaimsFile.safeParse([claim({ data: { adult: 12000 } })]);
    expect(r.success).toBe(false);
  });

  it("does not accept a screen number found only inside a bigger number", () => {
    const prices = {
      en: "1 day ₩6,000, 5 days ₩15,000.",
      ja: "1日6,000ウォン、5日15,000ウォン。",
      "zh-CN": "1天 ₩6,000，5天 ₩15,000。",
      "zh-TW": "1天 ₩6,000，5天 ₩15,000。",
      fr: "1 jour ₩6,000, 5 jours ₩15,000.",
      es: "1 día ₩6,000, 5 días ₩15,000.",
      ro: "1 zi ₩6,000, 5 zile ₩15,000.",
    };
    // 5,000은 15,000 안에만 있다(1일 요금이 문장과 어긋남)
    expect(ClaimsFile.safeParse([claim({ text: prices, data: { d1: 5000 } })]).success).toBe(false);
    expect(
      ClaimsFile.safeParse([claim({ text: prices, data: { d1: 6000, d5: 15000 } })]).success,
    ).toBe(true);
    const time = {
      en: "43 minutes to T1 and 51 minutes to T2.",
      ja: "第1ターミナルまで43分、第2ターミナルまで51分です。",
      "zh-CN": "到 T1 需 43 分钟，到 T2 需 51 分钟。",
      "zh-TW": "到 T1 需 43 分鐘，到 T2 需 51 分鐘。",
      fr: "43 minutes vers T1 et 51 minutes vers T2.",
      es: "43 minutos a T1 y 51 minutos a T2.",
      ro: "43 minute până la T1 și 51 minute până la T2.",
    };
    expect(ClaimsFile.safeParse([claim({ text: time, data: { t1: 3, t2: 1 } })]).success).toBe(
      false,
    );
    expect(ClaimsFile.safeParse([claim({ text: time, data: { t1: 43, t2: 51 } })]).success).toBe(
      true,
    );
  });

  it("rejects a non-ISO verification date", () => {
    expect(ClaimsFile.safeParse([claim({ verifiedAt: "2026/10/01" })]).success).toBe(false);
  });

  it("rejects a missing Japanese text", () => {
    expect(ClaimsFile.safeParse([{ ...claim(), text: { en: "x", ja: "" } }]).success).toBe(false);
  });

  it("rejects a non-http source", () => {
    const bad = claim({ sources: [{ url: "javascript:alert(1)", title: "x" }] });
    expect(ClaimsFile.safeParse([bad]).success).toBe(false);
  });

  it("rejects duplicate ids", () => {
    expect(ClaimsFile.safeParse([claim(), claim()]).success).toBe(false);
  });
});

describe("PhrasesFile", () => {
  it("needs ko and all 7 locales", () => {
    const phrase = {
      id: "gate.cant-exit",
      ko: "개찰구에서 나갈 수가 없어요.",
      en: "x",
      ja: "",
      "zh-CN": "x",
      "zh-TW": "x",
      fr: "x",
      es: "x",
      ro: "x",
      reviewed: false,
    };
    expect(PhrasesFile.safeParse([phrase]).success).toBe(false);
  });
});

describe("staleness", () => {
  it("follows the 30/60-day fare policy", () => {
    const c = claim({ verifiedAt: "2026-10-01" });
    expect(staleness(c, "2026-10-31")).toBe("fresh");
    expect(staleness(c, "2026-11-01")).toBe("due");
    expect(staleness(c, "2026-11-30")).toBe("due");
    expect(staleness(c, "2026-12-01")).toBe("stale");
  });

  it("follows the 90/180-day route policy", () => {
    const c = claim({ kind: "route", verifiedAt: "2026-10-01" });
    expect(staleness(c, "2026-12-30")).toBe("fresh");
    expect(staleness(c, "2027-01-01")).toBe("due");
    expect(staleness(c, "2027-03-31")).toBe("stale");
  });
});
