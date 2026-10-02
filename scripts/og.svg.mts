// 공유 미리보기 이미지(OG, 1200×630). 앉은 호랑이(T2)의 꼬리 리본이 화면을 가로질러 정류점으로 이어진다.
// 글자를 넣지 않는다: 이미지에 굳은 글꼴은 기기 글꼴과 달라지고(일본어는 특히), 제목은 og:title이 보여 준다.
// 색은 globals.css 다크 토큰 값과 같다(bg, ribbon, tiger, tiger-face, tiger-ink).
const C = {
  bg: "#0b1020",
  ribbon: "#ffb547",
  tiger: "#ffb547",
  face: "#fff4e0",
  ink: "#0e1424",
};

/** Tiger.tsx TigerSitting(mood="hi")와 같은 그림(손 흔드는 팔은 리본과 겹쳐 뺐다)(viewBox 0 0 120 120) */
const tiger = `
<g fill="${C.tiger}">
  <path d="M34 100 Q30 64 60 62 Q90 64 86 100 Z"/>
  <ellipse cx="48" cy="100" rx="9" ry="5"/><ellipse cx="72" cy="100" rx="9" ry="5"/>
  <circle cx="40" cy="24" r="8"/><circle cx="80" cy="24" r="8"/>
  <rect x="32" y="20" width="56" height="46" rx="22"/>
</g>
<path d="M46 78l8 3M44 88l9 2M74 78l-8 3M76 88l-9 2M55 22v6M60 21v8M65 22v6" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
<g fill="${C.face}">
  <ellipse cx="60" cy="90" rx="11" ry="11"/><circle cx="40" cy="24" r="3.5"/><circle cx="80" cy="24" r="3.5"/>
  <ellipse cx="60" cy="52" rx="15" ry="11"/>
</g>
<g fill="${C.ink}">
  <circle cx="51.9" cy="40" r="2.34"/><circle cx="68.1" cy="40" r="2.34"/>
  <path d="M57.75 46.3h4.5l-2.25 2.34z"/>
</g>
<path d="M56.4 50.8q3.6 3.15 7.2 0" stroke="${C.ink}" stroke-width="1.71" stroke-linecap="round" fill="none"/>
`;

export function ogSvg() {
  // 호랑이: 왼쪽, 3.6배, 세로 가운데. 꼬리 끝(116,44)에서 리본이 이어진다
  const s = 3.6;
  const tx = 70;
  const ty = (630 - 120 * s) / 2 + 10;
  const [x0, y0] = [tx + 116 * s, ty + 44 * s];
  const r = 40;
  const hi = 170;
  const lo = 420;
  const turn = 820;
  // 꼬리(Tiger.tsx와 같은 곡선) → 위로 → 오른쪽 → 한 층 아래로 → 끝까지(앱의 직교 리본과 같은 말투)
  const route = [
    `M${tx + 78 * s} ${ty + 98 * s}`,
    `C${tx + 100 * s} ${ty + 100 * s} ${tx + 108 * s} ${ty + 84 * s} ${tx + 98 * s} ${ty + 74 * s}`,
    `S${tx + 112 * s} ${ty + 50 * s} ${x0} ${y0}`,
    `L${x0 + 20} ${hi + r} Q${x0 + 26} ${hi} ${x0 + 26 + r} ${hi}`,
    `H${turn - r} Q${turn} ${hi} ${turn} ${hi + r}`,
    `V${lo - r} Q${turn} ${lo} ${turn + r} ${lo} H1090`,
  ].join(" ");
  const stop = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="7" fill="${C.bg}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${C.bg}"/>
<g filter="url(#glow)">
  <path d="${route}" fill="none" stroke="${C.ribbon}" stroke-width="${6 * s}" stroke-linecap="round" stroke-linejoin="round"/>
  ${stop(640, hi)}${stop(turn, (hi + lo) / 2)}
  <circle cx="1090" cy="${lo}" r="30" fill="${C.bg}" stroke="${C.ribbon}" stroke-width="12"/>
</g>
<g transform="translate(${tx} ${ty}) scale(${s})">${tiger}</g>
<defs><filter id="glow" x="-10%" y="-20%" width="120%" height="140%">
  <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="${C.ribbon}" flood-opacity="0.45"/>
</filter></defs>
</svg>`;
}
