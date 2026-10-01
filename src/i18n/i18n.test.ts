import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { en } from "./en";
import { ja } from "./ja";

const SRC = join(process.cwd(), "src");
const UI_DIRS = ["app", "components"].map((d) => join(SRC, d));

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return tsxFiles(path);
    return name.endsWith(".tsx") && !name.includes(".test.") ? [path] : [];
  });
}

/** 글자(라틴·가나·한자·한글)가 들어간 JSX 텍스트나 사람이 읽는 속성 값 */
const LETTER = "[A-Za-z\\u3040-\\u30ff\\u4e00-\\u9fff\\uac00-\\ud7af]";
const JSX_TEXT = new RegExp(`>\\s*[^<>{}\\s]*${LETTER}[^<>{}]*<`, "g");
const TEXT_ATTR = new RegExp(`\\b(aria-label|title|alt|placeholder)="[^"]*${LETTER}`, "g");

function hardcoded(source: string): string[] {
  const code = source.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return [...code.matchAll(JSX_TEXT), ...code.matchAll(TEXT_ATTR)].map((m) => m[0].trim());
}

function keys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

function values(obj: object): string[] {
  return Object.values(obj).flatMap((v) => (typeof v === "object" && v !== null ? values(v) : [v]));
}

describe("UI text comes from message files", () => {
  it("no hard-coded text in app/ or components/", () => {
    const found = UI_DIRS.flatMap(tsxFiles).flatMap((file) =>
      hardcoded(readFileSync(file, "utf8")).map((hit) => `${file.slice(SRC.length + 1)}: ${hit}`),
    );
    expect(found).toEqual([]);
  });

  it("the detector catches text and attributes", () => {
    expect(hardcoded("<p>Do you need help?</p>")).toHaveLength(1);
    expect(hardcoded("<p>お困りですか</p>")).toHaveLength(1);
    expect(hardcoded('<nav aria-label="Language">')).toHaveLength(1);
    expect(hardcoded("<p>{t.home.ask}</p>")).toHaveLength(0);
    expect(hardcoded("<strong>{s.title}</strong> <small>{s.hint}</small>")).toHaveLength(0);
  });
});

describe("message files", () => {
  it("en and ja have the same keys", () => {
    expect(keys(ja).sort()).toEqual(keys(en).sort());
  });

  it("no empty strings", () => {
    expect([...values(en), ...values(ja)].filter((v) => !String(v).trim())).toEqual([]);
  });

  it("Japanese copy uses full-width question marks and colons", () => {
    expect(values(ja).filter((v) => /[?:]/.test(String(v)))).toEqual([]);
  });
});
