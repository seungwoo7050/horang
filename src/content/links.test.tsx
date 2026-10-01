import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OutLink } from "@/components/OutLink";
import { links } from "@/content";
import { LinksFile } from "./schema";

const SRC = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("external URLs live only in the link registry", () => {
  it("no screen code has an http(s) URL", () => {
    const offenders = sourceFiles(SRC).filter((file) =>
      /https?:\/\//.test(readFileSync(file, "utf8")),
    );
    expect(offenders.map((f) => f.slice(SRC.length + 1))).toEqual([]);
  });

  it("every <OutLink id> points at a registered link", () => {
    const known = new Set(links.map((l) => l.id));
    const used = sourceFiles(SRC).flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(/<OutLink[^>]*\bid="([^"]+)"/g)].map((m) => m[1]),
    );
    expect(used.filter((id) => id && !known.has(id))).toEqual([]);
  });
});

describe("LinksFile", () => {
  const link = {
    id: "arex-official",
    url: "https://www.airportrailroad.com/",
    label: { en: "AREX", ja: "AREX" },
    affiliate: false,
    checkedAt: "2026-10-01",
  };

  it("accepts an https link", () => {
    expect(LinksFile.safeParse([link]).success).toBe(true);
  });

  it("rejects plain http and other schemes", () => {
    expect(LinksFile.safeParse([{ ...link, url: "http://example.com" }]).success).toBe(false);
    expect(LinksFile.safeParse([{ ...link, url: "javascript:alert(1)" }]).success).toBe(false);
  });
});

describe("OutLink", () => {
  it("opens in a new tab and uses the registry label", () => {
    const html = renderToStaticMarkup(<OutLink id="arex-official" />);
    expect(html).toContain('href="https://www.airportrailroad.com/"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("AREX official site");
    expect(html).not.toContain("data-paid-link");
  });

  it("uses the Japanese label", () => {
    expect(renderToStaticMarkup(<OutLink id="arex-official" lang="ja" />)).toContain("公式サイト");
  });

  it("fails loudly for an unknown id", () => {
    expect(() => renderToStaticMarkup(<OutLink id="nope" />)).toThrow("link 없음");
  });
});
