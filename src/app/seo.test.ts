import { describe, expect, it } from "vitest";
import { pageMetadata, PAGES } from "./seo";

describe("pageMetadata", () => {
  it("links each language version of the same screen", () => {
    const m = pageMetadata("ja", "gate/", "改札から出られない");
    expect(m.title).toBe("改札から出られない · Horang");
    expect(m.alternates?.canonical).toBe("/ja/gate/");
    expect(m.alternates?.languages).toEqual({
      en: "/en/gate/",
      ja: "/ja/gate/",
      "x-default": "/en/gate/",
    });
  });

  it("points x-default of the home screen at the language picker", () => {
    expect(pageMetadata("en", "").alternates?.languages).toMatchObject({ "x-default": "/" });
  });

  it("covers every screen route", () => {
    expect(PAGES).toEqual(["", "gate/", "card/", "arex/", "station/", "staff/"]);
  });
});
