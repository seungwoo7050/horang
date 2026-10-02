import { describe, expect, it } from "vitest";
import { claims, timetables } from "@/content";
import { koreaMinutes, minutesOf, nextDepartures } from "./next-departures";

const rows = [{ t: "05:24" }, { t: "06:08" }, { t: "22:48" }];
const at = (hhmm: string) => minutesOf(hhmm);

describe("nextDepartures", () => {
  it("picks the next trains including one leaving this minute", () => {
    expect(
      nextDepartures(rows, (r) => r.t, at("06:08"), 2).map((d) => [d.time, d.inMinutes]),
    ).toEqual([
      ["06:08", 0],
      ["22:48", 1000],
    ]);
  });

  it("returns nothing after the last train", () => {
    expect(nextDepartures(rows, (r) => r.t, at("22:49"))).toEqual([]);
  });

  it("before the first train, the first train is next", () => {
    expect(nextDepartures(rows, (r) => r.t, at("00:30"), 1)[0]?.time).toBe("05:24");
  });
});

describe("koreaMinutes", () => {
  it("uses Korea time whatever the device time zone", () => {
    // 2026-10-02 04:13 UTC = 13:13 KST
    expect(koreaMinutes(new Date("2026-10-02T04:13:00Z"))).toBe(13 * 60 + 13);
    // 15:30 UTC = 다음 날 00:30 KST
    expect(koreaMinutes(new Date("2026-10-02T15:30:00Z"))).toBe(30);
  });
});

describe("AREX Express timetable data", () => {
  const tt = timetables["arex-express"];
  const text = (id: string) => claims.find((c) => c.id === id)!.text.en;

  it("agrees with the first and last times in the claims shown on screen", () => {
    const toSeoul = text("arex.express.airport-departures");
    expect(toSeoul).toContain(`${tt.toSeoul[0]!.t2} to ${tt.toSeoul.at(-1)!.t2} at Terminal 2`);
    expect(toSeoul).toContain(`${tt.toSeoul[0]!.t1} to ${tt.toSeoul.at(-1)!.t1} at Terminal 1`);
    expect(text("arex.express.seoul-departures")).toContain(
      `${tt.toAirport[0]!.seoul} to ${tt.toAirport.at(-1)!.seoul}`,
    );
    expect(toSeoul).toContain(`${tt.toSeoul.length} a day`);
  });

  it("never runs past midnight (nextDepartures assumes one service day)", () => {
    const all = [
      ...tt.toSeoul.flatMap((r) => [r.t2, r.t1, r.seoul]),
      ...tt.toAirport.flatMap((r) => [r.seoul, r.t1, r.t2]),
    ];
    expect(all.every((t) => minutesOf(t) >= minutesOf("04:00"))).toBe(true);
  });

  it("keeps the official travel times (Express 43 min to T1, 51 min to T2)", () => {
    for (const r of tt.toAirport) {
      expect(minutesOf(r.t1) - minutesOf(r.seoul)).toBe(43);
      expect(minutesOf(r.t2) - minutesOf(r.seoul)).toBe(51);
    }
  });
});
