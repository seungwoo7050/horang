import { readFileSync } from "node:fs";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";
import {
  buildVersion,
  contentSecurityPolicy,
  headersFile,
  htmlRoute,
  inlineScriptHashes,
  precacheUrls,
  renderServiceWorker,
} from "./postbuild-lib.mts";

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

describe("security headers", () => {
  const html = '<script src="/a.js"></script><script>self.x=1</script><script></script>';

  it("hashes only non-empty inline scripts", () => {
    // echo -n 'self.x=1' | openssl dgst -sha256 -binary | base64
    expect(inlineScriptHashes(html)).toEqual([
      "'sha256-OeQ5f9lOMes7jOc0cGCXX08CnAERweUkLpVXXpflaLg='",
    ]);
  });

  it("allows only our own files plus the hashed inline scripts", () => {
    const csp = contentSecurityPolicy(["'sha256-abc'"]);
    expect(csp).toContain("script-src 'self' 'sha256-abc'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toMatch(/script-src[^;]*unsafe/);
  });

  it("maps HTML files to routes", () => {
    expect(htmlRoute("index.html")).toBe("/");
    expect(htmlRoute("en/gate/index.html")).toBe("/en/gate/");
  });

  it("puts CSP only on page rules so headers never merge", () => {
    const text = headersFile([{ route: "/en/", html }]);
    const blocks = text.trim().split("\n\n");
    expect(blocks[0]).toMatch(/^\/\*\n/);
    expect(blocks[0]).not.toContain("Content-Security-Policy");
    expect(blocks.at(-1)).toMatch(/^\/en\/\n {2}Content-Security-Policy: /);
  });

  it("fails the build when Cloudflare limits are exceeded", () => {
    const many = Array.from({ length: 100 }, (_, i) => ({ route: `/p${i}/`, html: "" }));
    expect(() => headersFile(many)).toThrow("규칙");
  });
});
