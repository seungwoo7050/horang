import { describe, expect, it } from "vitest";
import { parseExpressTimetable } from "./timetable-lib.mts";

const table = (rows: string[][]) =>
  `<table><caption>x</caption><tr><th>a</th></tr>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</table>`;
const rows = [
  ["05:16", "05:24", "06:07", "06:00", "06:43", "06:51"],
  ["22:40", "22:48", "23:31", "23:00", "23:43", "23:51"],
];

describe("parseExpressTimetable", () => {
  it("splits each row into the two directions", () => {
    const tt = parseExpressTimetable(table(rows) + table(rows));
    expect(tt.toSeoul[1]).toEqual({ t2: "22:40", t1: "22:48", seoul: "23:31" });
    expect(tt.toAirport[0]).toEqual({ seoul: "06:00", t1: "06:43", t2: "06:51" });
  });

  it("stops when the holiday table differs (the app has no holiday handling)", () => {
    const holiday = [rows[0]!, ["22:30", "22:38", "23:21", "23:00", "23:43", "23:51"]];
    expect(() => parseExpressTimetable(table(rows) + table(holiday))).toThrow("휴일");
  });

  it("stops when the page structure changes", () => {
    expect(() => parseExpressTimetable("<p>no tables</p>")).toThrow("찾지 못했다");
  });
});
