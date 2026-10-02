import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BRAND_BUDGET_BYTES, BRAND_COLORS, BRAND_IMAGES } from "./brand-images";

/** WebP 머리에서 픽셀 크기를 읽는다(VP8X·VP8L·VP8) */
function webpSize(buf: Buffer): [number, number] {
  expect(buf.toString("ascii", 0, 4)).toBe("RIFF");
  expect(buf.toString("ascii", 8, 12)).toBe("WEBP");
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
  }
  if (chunk === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  throw new Error(`알 수 없는 WebP 조각 ${chunk}`);
}

describe("brand images (public/brand)", () => {
  const files = Object.entries(BRAND_IMAGES).map(([name, img]) => ({
    name,
    ...img,
    buf: readFileSync(`public${img.src}`),
  }));

  it.each(files)("$name is a WebP of the declared size (no layout shift)", (f) => {
    expect(webpSize(f.buf)).toEqual([f.width, f.height]);
  });

  it("light and dark lettering are the same size, so swapping them never moves the layout", () => {
    expect(BRAND_IMAGES["wordmark-navy"]).toMatchObject({
      width: BRAND_IMAGES["wordmark-cream"].width,
      height: BRAND_IMAGES["wordmark-cream"].height,
    });
    expect(BRAND_IMAGES["logo-navy"]).toMatchObject({
      width: BRAND_IMAGES["logo-cream"].width,
      height: BRAND_IMAGES["logo-cream"].height,
    });
  });

  it("all together stay small enough for the offline precache", () => {
    const total = files.reduce((n, f) => n + f.buf.length, 0);
    expect(total).toBeLessThan(BRAND_BUDGET_BYTES);
  });
});

describe("brand tokens", () => {
  const css = readFileSync("src/app/globals.css", "utf8");

  it("globals.css has the same brand colors the derivative script paints, once each", () => {
    expect(css.match(/--brand-cream:\s*(#[0-9a-f]{6})/g)).toEqual([
      `--brand-cream: ${BRAND_COLORS.cream}`,
    ]);
    expect(css.match(/--brand-navy:\s*(#[0-9a-f]{6})/g)).toEqual([
      `--brand-navy: ${BRAND_COLORS.navy}`,
    ]);
  });
});
