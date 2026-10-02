import { describe, expect, it } from "vitest";
import { Claim, ClaimsFile, PhrasesFile, staleness } from "./schema";

const claim = (over: Partial<Claim> = {}): Claim => ({
  id: "arex.express.fare-adult",
  kind: "fare",
  text: { en: "Express adult fare is ₩13,000.", ja: "直通列車の大人運賃は13,000ウォンです。" },
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
  it("needs ko, en and ja", () => {
    const phrase = {
      id: "gate.cant-exit",
      ko: "개찰구에서 나갈 수가 없어요.",
      en: "x",
      ja: "",
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
