// 파비콘(icon.svg): T1 얼굴(src/components/Tiger.tsx TigerFace mood="hi"와 같은 그림)을 다크 bg 위에.
// 색은 globals.css 토큰 값(다크 bg, tiger, tiger-ink)과 브랜드 크림. 홈 화면 아이콘 PNG는 마스코트(make-icons.mts)
const C = { bg: "#0b1020", tiger: "#ffb547", cream: "#f7f1e8", ink: "#0e1424" };

/** Tiger.tsx Head + Face(hi)를 SVG 문자열로(같은 식) */
function face(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  ear: number,
  eyeY: number,
  s: number,
) {
  const ex = rx * 0.66;
  const ey = cy - ry * 0.78;
  const k = ry / 28;
  const x = (d: number) => cx + d * s;
  const y = (d: number) => eyeY + d * s;
  const stripes = [
    `M${cx - 8 * k} ${cy - ry + 3 * k}q${1 * k} ${5 * k} ${2.5 * k} ${9 * k}`,
    `M${cx} ${cy - ry + 1.5 * k}v${11 * k}`,
    `M${cx + 8 * k} ${cy - ry + 3 * k}q${-1 * k} ${5 * k} ${-2.5 * k} ${9 * k}`,
    `M${cx - rx + 3 * k} ${cy - 5 * k}l${6.5 * k} ${1.6 * k}`,
    `M${cx - rx + 4 * k} ${cy + 4.5 * k}l${5.5 * k} ${0.4 * k}`,
    `M${cx + rx - 3 * k} ${cy - 5 * k}l${-6.5 * k} ${1.6 * k}`,
    `M${cx + rx - 4 * k} ${cy + 4.5 * k}l${-5.5 * k} ${0.4 * k}`,
  ].join("");
  const nose = `M${x(-3.4)} ${y(6.4)}q${3.4 * s} ${-1.4 * s} ${6.8 * s} 0q${-0.6 * s} ${3.4 * s} ${-3.4 * s} ${4 * s}q${-2.8 * s} ${-0.6 * s} ${-3.4 * s} ${-4 * s}z`;
  const mouth = `M${x(-6)} ${y(11)}q${3 * s} ${3.4 * s} ${6 * s} 0q${3 * s} ${3.4 * s} ${6 * s} 0`;
  return `<g fill="${C.tiger}"><circle cx="${cx - ex}" cy="${ey}" r="${ear}"/><circle cx="${cx + ex}" cy="${ey}" r="${ear}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></g>
<g fill="${C.cream}"><circle cx="${cx - ex + ear * 0.1}" cy="${ey + ear * 0.1}" r="${ear * 0.55}"/><circle cx="${cx + ex - ear * 0.1}" cy="${ey + ear * 0.1}" r="${ear * 0.55}"/><ellipse cx="${cx}" cy="${cy + ry * 0.42}" rx="${rx * 0.54}" ry="${ry * 0.46}"/></g>
<path d="${stripes}" stroke="${C.ink}" stroke-width="${3.4 * k}" stroke-linecap="round" fill="none"/>
<g fill="${C.ink}"><circle cx="${x(-11)}" cy="${y(0)}" r="${3.2 * s}"/><circle cx="${x(11)}" cy="${y(0)}" r="${3.2 * s}"/><path d="${nose}"/></g>
<path d="${mouth}" stroke="${C.ink}" stroke-width="${1.9 * s}" stroke-linecap="round" fill="none"/>`;
}

export function iconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<rect width="120" height="120" rx="24" fill="${C.bg}"/>
${face(60, 66, 46, 38, 15, 62, 1.38)}
</svg>`;
}
