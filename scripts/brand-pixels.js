// 브랜드 에셋 파생본의 픽셀 처리(브라우저 안에서 돈다). scripts/brand.mts가 Playwright Chromium 페이지에 넣는다.
// 새 npm 의존성 없이 canvas로 읽고, 고치고, 줄이고, 인코딩한다. 원본 파일은 건드리지 않는다.
globalThis.brand = (() => {
  const INF = 1e20;

  async function load(src) {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = new OffscreenCanvas(img.width, img.height);
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    return x.getImageData(0, 0, img.width, img.height);
  }

  /** 1차원 제곱 거리 변환(Felzenszwalb–Huttenlocher). 없는 자리는 INF(유한한 큰 수라 뺄셈이 NaN이 되지 않는다) */
  function edt1(f, n) {
    const d = new Float64Array(n);
    const v = new Int32Array(n);
    const z = new Float64Array(n + 1);
    let k = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1; q < n; q++) {
      let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) {
        k--;
        s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      }
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < n; q++) {
      while (z[k + 1] < q) k++;
      d[q] = (q - v[k]) ** 2 + f[v[k]];
    }
    return d;
  }

  /** 각 픽셀에서 mask가 1인 가장 가까운 픽셀까지의 거리(픽셀) */
  function distanceTo(mask, w, h) {
    const g = new Float64Array(w * h);
    const col = new Float64Array(h);
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) col[y] = mask[y * w + x] ? 0 : INF;
      const r = edt1(col, h);
      for (let y = 0; y < h; y++) g[y * w + x] = r[y];
    }
    const row = new Float64Array(w);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) row[x] = g[y * w + x];
      const r = edt1(row, w);
      for (let x = 0; x < w; x++) g[y * w + x] = Math.sqrt(r[x]);
    }
    return g;
  }

  const solid = (img) => {
    const m = new Uint8Array(img.width * img.height);
    for (let i = 0; i < m.length; i++) m[i] = img.data[i * 4 + 3] >= 128 ? 1 : 0;
    return m;
  };

  /** 아래에 색을 깐다(원래 픽셀이 위). a: 깔 색의 불투명도 0~1 */
  function under(img, i, rgb, a) {
    const d = img.data;
    const top = d[i * 4 + 3] / 255;
    const out = top + a * (1 - top);
    if (out <= 0) return;
    for (let c = 0; c < 3; c++) {
      d[i * 4 + c] = Math.round((d[i * 4 + c] * top + rgb[c] * a * (1 - top)) / out);
    }
    d[i * 4 + 3] = Math.round(out * 255);
  }

  /**
   * 바깥과 이어지지 않은 투명한 구멍(배경 제거 때 함께 뚫린 눈)을 채운다.
   * box가 있으면 그 안의 구멍만. 가장자리 반투명 고리는 같은 색을 아래에 깔아 이어 붙인다
   */
  function fillHoles(img, rgb, box) {
    const { width: w, height: h } = img;
    const m = solid(img);
    const outside = new Uint8Array(w * h);
    const stack = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    while (stack.length) {
      const i = stack.pop();
      if (outside[i] || m[i]) continue;
      outside[i] = 1;
      const x = i % w;
      if (x > 0) stack.push(i - 1);
      if (x < w - 1) stack.push(i + 1);
      if (i >= w) stack.push(i - w);
      if (i < w * (h - 1)) stack.push(i + w);
    }
    const hole = new Uint8Array(w * h);
    let n = 0;
    for (let i = 0; i < w * h; i++) {
      const x = i % w;
      const y = (i / w) | 0;
      const inBox = !box || (x >= box[0] && y >= box[1] && x <= box[2] && y <= box[3]);
      if (!m[i] && !outside[i] && inBox) {
        hole[i] = 1;
        n++;
      }
    }
    // 구멍에서 3px 안: 원래 픽셀(반투명 테두리) 아래에 같은 색을 깐다
    const dist = distanceTo(hole, w, h);
    for (let i = 0; i < w * h; i++) {
      if (dist[i] <= 3) under(img, i, rgb, Math.min(1, 3.5 - dist[i]));
    }
    return n;
  }

  /**
   * 테두리에 닿은 줄무늬가 배경 제거 때 함께 깎인 자리(가장자리의 홈)를 메운다.
   * 홈마다 SVG 경로로 덧댈 모양을 받아 원래 그림 "아래"에 칠한다(destination-over): 이미 칠해진 픽셀은 그대로라
   * 경로는 홈을 넉넉히 덮고 바깥 선만 원래 윤곽을 이어 그리면 된다. 경로의 가장자리는 canvas가 부드럽게 칠한다
   */
  function patchUnder(img, paths, rgb) {
    const c = new OffscreenCanvas(img.width, img.height);
    const x = c.getContext("2d");
    x.putImageData(img, 0, 0);
    const before = img.data;
    x.globalCompositeOperation = "destination-over";
    x.fillStyle = `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
    for (const d of paths) x.fill(new Path2D(d));
    const after = x.getImageData(0, 0, img.width, img.height);
    let n = 0;
    for (let i = 3; i < before.length; i += 4) if (after.data[i] - before[i] > 127) n++;
    img.data.set(after.data);
    return n;
  }

  /**
   * 그림 틀에서 평평하게 잘린 팔 끝을 둥근 앞발로 잇는다. 세로 열 x에서 불투명한 구간을 찾아
   * 그 열의 색을 오른쪽으로 반타원(가로 reach) 모양만큼 늘린다: 줄마다 원래 음영이 그대로 이어지고,
   * 끝으로 갈수록 조금 어둡게 해 둥근 면처럼 보이게 한다. 반환: [y0, y1, 늘린 픽셀 수]
   */
  function roundCut(img, x, reach) {
    const { width: w, height: h, data: d } = img;
    let y0 = -1;
    let y1 = -1;
    for (let y = 0; y < h; y++)
      if (d[(y * w + x) * 4 + 3] >= 128) {
        if (y0 < 0) y0 = y;
        y1 = y;
      }
    const c = (y0 + y1) / 2;
    const half = (y1 - y0) / 2 + 1;
    let n = 0;
    for (let y = y0; y <= y1; y++) {
      const t = (y - c) / half;
      const len = reach * Math.sqrt(Math.max(0, 1 - t * t));
      const src = (y * w + x) * 4;
      for (let dx = 1; dx <= Math.ceil(len) + 1 && x + dx < w; dx++) {
        const cover = Math.max(0, Math.min(1, len - dx + 1));
        const i = (y * w + x + dx) * 4;
        const shade = 1 - 0.1 * (dx / reach) ** 2;
        for (let k = 0; k < 3; k++) d[i + k] = Math.round(d[src + k] * shade);
        d[i + 3] = Math.round(d[src + 3] * cover);
        if (cover > 0) n++;
      }
    }
    return [y0, y1, n];
  }

  /** 마스코트 원본 보수 세 가지(눈 구멍 → 깎인 줄무늬 → 잘린 앞발). fix는 brand.mts의 MASCOT_FIX */
  function fixMascot(img, fix) {
    return {
      eyes: fillHoles(img, fix.eye, fix.eyeBox),
      notches: patchUnder(img, fix.notches, fix.stripe),
      paw: roundCut(img, fix.paw.x, fix.paw.reach),
    };
  }

  /** 정사각형 아이콘: 배경색을 깔고 원본의 crop [x, y, 한 변]을 size 크기로 */
  function iconCanvas(img, crop, size, bg) {
    const art = resized(img, [crop[0], crop[1], crop[2], crop[2]], [size, size]);
    const c = new OffscreenCanvas(size, size);
    const x = c.getContext("2d");
    x.fillStyle = bg;
    x.fillRect(0, 0, size, size);
    x.drawImage(art, 0, 0);
    return c;
  }

  /**
   * 정확히 그 색인 픽셀만 바꾼다(불투명도는 그대로). pairs: [[from, to], ...], tol: 채널당 허용 차이.
   * minX: 이 x부터만(로고에서 호랑이 마크의 크림 입 주변·남색 배낭을 건드리지 않게)
   */
  function swapColors(img, pairs, tol, minX = 0) {
    const d = img.data;
    const counts = pairs.map(() => 0);
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0 || (i / 4) % img.width < minX) continue;
      for (let p = 0; p < pairs.length; p++) {
        const [from, to] = pairs[p];
        if (
          Math.abs(d[i] - from[0]) <= tol &&
          Math.abs(d[i + 1] - from[1]) <= tol &&
          Math.abs(d[i + 2] - from[2]) <= tol
        ) {
          d[i] = to[0];
          d[i + 1] = to[1];
          d[i + 2] = to[2];
          counts[p]++;
          break;
        }
      }
    }
    return counts;
  }

  /** 불투명도 threshold 이상인 픽셀의 경계 상자 [x0, y0, x1, y1] */
  function bbox(img, threshold = 8) {
    const { width: w, height: h, data: d } = img;
    let x0 = w;
    let y0 = h;
    let x1 = -1;
    let y1 = -1;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (d[(y * w + x) * 4 + 3] >= threshold) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
    return [x0, y0, x1, y1];
  }

  /**
   * 잘라서 줄인 캔버스. 반씩 여러 번 줄여 큰 축소에서도 가는 선이 뭉개지지 않게 한다.
   * crop: [x, y, w, h](원본 좌표, 원본 밖은 투명), out: [w, h]
   */
  function resized(img, crop, out) {
    let c = new OffscreenCanvas(img.width, img.height);
    c.getContext("2d").putImageData(img, 0, 0);
    let [sx, sy, sw, sh] = crop;
    while (sw / 2 >= out[0] && sh / 2 >= out[1]) {
      const n = new OffscreenCanvas(Math.ceil(sw / 2), Math.ceil(sh / 2));
      const x = n.getContext("2d");
      x.imageSmoothingQuality = "high";
      x.drawImage(c, sx, sy, sw, sh, 0, 0, n.width, n.height);
      c = n;
      sx = 0;
      sy = 0;
      sw = n.width;
      sh = n.height;
    }
    const o = new OffscreenCanvas(out[0], out[1]);
    const x = o.getContext("2d");
    x.imageSmoothingQuality = "high";
    x.drawImage(c, sx, sy, sw, sh, 0, 0, out[0], out[1]);
    return o;
  }

  async function encode(canvas, type, quality) {
    const blob = await canvas.convertToBlob({ type, quality });
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = "";
    for (let i = 0; i < buf.length; i += 0x8000)
      s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return { type: blob.type, base64: btoa(s) };
  }

  return {
    load,
    fillHoles,
    patchUnder,
    roundCut,
    fixMascot,
    iconCanvas,
    swapColors,
    bbox,
    resized,
    encode,
  };
})();
