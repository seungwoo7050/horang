import { readFileSync } from "node:fs";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { buildVersion, precacheUrls, renderServiceWorker } from "./postbuild-lib.mts";

describe("precacheUrls", () => {
  it("maps index.html files to slash URLs and keeps other files", () => {
    expect(
      precacheUrls([
        "index.html",
        "en/index.html",
        "en/gate/index.html",
        "en/gate/__next._tree.txt",
        "_next/static/chunks/a.js",
        "icons/icon-192.png",
      ]),
    ).toEqual([
      "/",
      "/_next/static/chunks/a.js",
      "/en/",
      "/en/gate/",
      "/en/gate/__next._tree.txt",
      "/icons/icon-192.png",
    ]);
  });

  it("skips the worker itself and host config files", () => {
    expect(precacheUrls(["sw.js", "_headers", "a.js.map", "404.html"])).toEqual(["/404.html"]);
  });
});

describe("buildVersion", () => {
  it("changes when content changes and ignores order", () => {
    const a = buildVersion([
      { path: "a", content: "1" },
      { path: "b", content: "2" },
    ]);
    const b = buildVersion([
      { path: "b", content: "2" },
      { path: "a", content: "1" },
    ]);
    const c = buildVersion([
      { path: "a", content: "1" },
      { path: "b", content: "3" },
    ]);
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});

describe("renderServiceWorker", () => {
  it("fills version and precache list", () => {
    const sw = renderServiceWorker('const V = "__VERSION__"; const P = __PRECACHE__;', "abc", [
      "/",
    ]);
    expect(sw).toContain('const V = "abc"');
    expect(sw).toContain('[\n  "/"\n]');
  });

  it("refuses a template where a mark is missing or repeated", () => {
    expect(() => renderServiceWorker("__VERSION__ __VERSION__ __PRECACHE__", "v", [])).toThrow();
    expect(() => renderServiceWorker("__VERSION__", "v", [])).toThrow();
  });

  it("turns the real template into valid JavaScript", () => {
    const template = readFileSync("scripts/sw.template.js", "utf8");
    const sw = renderServiceWorker(template, "abc", ["/", "/en/"]);
    expect(() => new Script(sw)).not.toThrow();
  });
});
