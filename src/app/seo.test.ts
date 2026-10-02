import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { pageMetadata, PAGES, rootMetadata } from "./seo";

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

  it("gives every screen the shared preview image, which exists in public/", () => {
    for (const page of PAGES) {
      const og = pageMetadata("en", page).openGraph as { images: { url: string }[] };
      expect(og.images[0]?.url).toBe("/og.png");
    }
    expect(existsSync("public/og.png")).toBe(true);
  });

  it("covers every screen route", () => {
    expect(PAGES).toEqual(["", "gate/", "card/", "arex/", "station/", "staff/"]);
  });
});

describe("rootMetadata (the language picker at /)", () => {
  it("is titled Horang and links back to every language (hreflang is mutual)", () => {
    const m = rootMetadata();
    expect(m.title).toBe("Horang");
    expect(m.alternates?.canonical).toBe("/");
    expect(m.alternates?.languages).toEqual({ en: "/en/", ja: "/ja/", "x-default": "/" });
  });
});
