import { describe, expect, it } from "vitest";
import { claimNumbers, pageHasNumber } from "./sources-lib.mts";

describe("claimNumbers", () => {
  it("keeps amounts, clock times and percentages, not small counts", () => {
    expect(
      claimNumbers(
        "Express takes 43 minutes, costs ₩13,000, runs 06:00 to 23:00, 26 a day, fee 3.7%.",
      ),
    ).toEqual(["13,000", "06:00", "23:00", "3.7%"]);
  });
});

describe("pageHasNumber", () => {
  it("matches with or without thousands separators", () => {
    expect(pageHasNumber("<td>13000</td>", "13,000")).toBe(true);
    expect(pageHasNumber("<td>13,000원</td>", "13,000")).toBe(true);
  });

  it("does not match inside a bigger number", () => {
    expect(pageHasNumber("113,000", "13,000")).toBe(false);
    expect(pageHasNumber("13,0005", "13,000")).toBe(false);
  });

  it("matches clock times with or without a leading zero", () => {
    expect(pageHasNumber("첫차 6:00", "06:00")).toBe(true);
    expect(pageHasNumber("<td>06:00</td>", "06:00")).toBe(true);
    expect(pageHasNumber("16:00", "06:00")).toBe(false);
  });

  it("matches an amount followed by a comma in a list", () => {
    expect(pageHasNumber("₩5,000, ₩8,000 and ₩10,000", "5,000")).toBe(true);
    expect(pageHasNumber("₩5,000, ₩8,000 and ₩10,000", "10,000")).toBe(true);
    expect(pageHasNumber("5,000원, 8,000원", "5,000")).toBe(true);
    expect(pageHasNumber("13,000,000", "13,000")).toBe(false);
  });

  it("matches percentages", () => {
    expect(pageHasNumber("평균 3.7%의 수수료", "3.7%")).toBe(true);
    expect(pageHasNumber("3.7 %", "3.7%")).toBe(true);
  });

  it("does not match a percentage inside a bigger number", () => {
    expect(pageHasNumber("13.7%", "3.7%")).toBe(false);
    expect(pageHasNumber("03.7%", "3.7%")).toBe(false);
    expect(pageHasNumber("3.75%", "3.7%")).toBe(false);
  });
});
