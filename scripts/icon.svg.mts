// 앱 아이콘(T1 얼굴, DESIGN.md §3-2). 색은 globals.css 토큰 값(다크 bg, tiger, tiger-face, tiger-ink)과 같다.
// scale: 얼굴 크기(마스커블 아이콘은 안전 영역 안에 들어가도록 작게)
export function iconSvg(scale = 0.78) {
  const bg = "#0e1424";
  const tiger = "#ffb547";
  const face = "#fff4e0";
  const ink = "#0e1424";
  const t = 60 - 60 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<rect width="120" height="120" fill="${bg}"/>
<g transform="translate(${t} ${t + 4 * scale}) scale(${scale})">
<g fill="${tiger}"><circle cx="30" cy="34" r="13"/><circle cx="90" cy="34" r="13"/><ellipse cx="60" cy="66" rx="44" ry="38"/></g>
<g fill="${face}"><circle cx="30" cy="34" r="6"/><circle cx="90" cy="34" r="6"/><ellipse cx="60" cy="80" rx="22" ry="17"/></g>
<path d="M52 30v9M60 28v12M68 30v9M18 60h9M17 70h9M93 60h9M94 70h9" stroke="${ink}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
<g fill="${ink}"><circle cx="48.75" cy="60" r="3.25"/><circle cx="71.25" cy="60" r="3.25"/><path d="M56.875 68.75h6.25l-3.125 3.25z"/></g>
<path d="M55 75q5 4.375 10 0" stroke="${ink}" stroke-width="2.375" stroke-linecap="round" fill="none"/>
</g></svg>`;
}
