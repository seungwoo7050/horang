import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { en } from "./en";
import { ja } from "./ja";
import { defaultLocale, locales, pickLocaleSource } from ".";

const SRC = join(process.cwd(), "src");
const UI_DIRS = ["app", "components"].map((d) => join(SRC, d));

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return tsxFiles(path);
    return name.endsWith(".tsx") && !name.includes(".test.") ? [path] : [];
  });
}

/** 글자(라틴·가나·한자·한글) */
const LETTER = /[A-Za-z\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]/;
/** 사람이 읽는 속성 */
const TEXT_ATTRS = new Set(["aria-label", "title", "alt", "placeholder"]);

/**
 * 하드코딩 문구: JSX 텍스트, JSX 자식 자리의 문자열 리터럴({"..."}), 사람이 읽는 속성 값(="..." 또는 ={"..."}).
 * 정규식은 {·}에 닿은 텍스트("Hello {name}")를 놓쳐서 TypeScript 파서로 JSX 노드를 직접 본다
 */
function hardcoded(source: string): string[] {
  const file = ts.createSourceFile(
    "x.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const hits: string[] = [];
  const literal = (n: ts.Node | undefined): string | undefined => {
    if (n && ts.isJsxExpression(n)) return literal(n.expression);
    if (n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n))) return n.text;
    return undefined;
  };
  const visit = (n: ts.Node) => {
    if (ts.isJsxText(n) && LETTER.test(n.text)) hits.push(n.text.trim());
    if (ts.isJsxExpression(n) && (ts.isJsxElement(n.parent) || ts.isJsxFragment(n.parent))) {
      const text = literal(n);
      if (text && LETTER.test(text)) hits.push(text);
    }
    if (ts.isJsxAttribute(n) && TEXT_ATTRS.has(n.name.getText(file))) {
      const text = literal(n.initializer);
      if (text && LETTER.test(text)) hits.push(`${n.name.getText(file)}=${text}`);
    }
    ts.forEachChild(n, visit);
  };
  visit(file);
  return hits;
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
    expect(
      hardcoded('const a = list.some((c) => c.ok === "x");\nreturn (\n<p>{a}</p>'),
    ).toHaveLength(0);
    expect(hardcoded("<strong>{s.title}</strong> <small>{s.hint}</small>")).toHaveLength(0);
  });

  it("the detector catches text inside expressions and next to them", () => {
    expect(hardcoded('<p>{"Tap here"}</p>')).toHaveLength(1);
    expect(hardcoded("<p>{`Tap here`}</p>")).toHaveLength(1);
    expect(hardcoded('<button aria-label={"Close"} />')).toHaveLength(1);
    expect(hardcoded("<p>Hello {name}</p>")).toHaveLength(1);
    expect(hardcoded("<p>{n} minutes</p>")).toHaveLength(1);
    expect(hardcoded("<p>{a}<small>min</small></p>")).toHaveLength(1);
  });

  it("the detector leaves code alone", () => {
    expect(hardcoded('<p className={"x y"}>{t.a}</p>')).toHaveLength(0);
    expect(hardcoded("<p key={`${a}-${b}`}>{t.a}</p>")).toHaveLength(0);
    expect(hardcoded("const [s, set] = useState<Step>(0);\nreturn <p>{s}</p>;")).toHaveLength(0);
    expect(hardcoded("function f<T extends Base>(x: T) {\n  return <p>{x}</p>;\n}")).toHaveLength(
      0,
    );
    expect(hardcoded('<p>{a ? "" : null} · {b}</p>')).toHaveLength(0);
  });
});

describe("message files", () => {
  it("en and ja have the same keys", () => {
    expect(keys(ja).sort()).toEqual(keys(en).sort());
  });

  it("no empty strings", () => {
    expect([...values(en), ...values(ja)].filter((v) => !String(v).trim())).toEqual([]);
  });

  it("phrase breaks (U+200B) only sit between words in Japanese copy", () => {
    expect(values(en).filter((v) => String(v).includes("\u200b"))).toEqual([]);
    const bad = /^\u200b|\u200b$|\u200b\u200b|\s\u200b|\u200b\s/;
    expect(values(ja).filter((v) => bad.test(String(v)))).toEqual([]);
  });

  it("Japanese copy uses full-width question marks and colons", () => {
    expect(values(ja).filter((v) => /[?:]/.test(String(v)))).toEqual([]);
  });
});

describe("first-visit language (inline script on /)", () => {
  // 브라우저에서 도는 원문 그대로 실행한다
  const pick = new Function(`return ${pickLocaleSource}`)() as (
    languages: string[],
    supported: readonly string[],
    fallback: string,
  ) => string;
  const first = (languages: string[]) => pick(languages, locales, defaultLocale);

  it("follows the browser's priority order", () => {
    expect(first(["en-US", "en", "ja"])).toBe("en");
    expect(first(["ja-JP", "en"])).toBe("ja");
    expect(first(["fr-FR", "ja", "en"])).toBe("ja");
    expect(first(["JA"])).toBe("ja");
  });

  it("falls back to English when no language matches", () => {
    expect(first(["ko-KR"])).toBe("en");
    expect(first([])).toBe("en");
    expect(first([""])).toBe("en");
  });
});
