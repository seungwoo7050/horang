// Horang 서비스 워커. 빌드 후 scripts/postbuild.mts가 버전과 미리 캐시 목록을 채워 out/sw.js로 만든다.
// 도착 직후 데이터가 없어도 핵심 화면이 열리게 모든 정적 파일을 미리 캐시한다(CLAUDE.md 오프라인 우선).
// 페이지는 네트워크 먼저(최신 사실), 실패하거나 느리면 캐시. _next/static은 해시 파일이라 캐시 먼저.
const VERSION = "__VERSION__";
const PRECACHE = __PRECACHE__;
const CACHE = `horang-${VERSION}`;
const NETWORK_TIMEOUT_MS = 4000;

// Cloudflare가 서빙하는 정식 경로(경로 조각마다 퍼센트 인코딩, 예: "$" → "%24").
// 미리 캐시 목록도 이 형태라서 브라우저가 "$" 그대로 요청해도 찾을 수 있다(postbuild-lib canonicalPath와 같음)
const canonical = (pathname) =>
  pathname
    .split("/")
    .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
    .join("/");

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k.startsWith("horang-") && k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const key = url.origin + canonical(url.pathname);
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(caches.match(key).then((hit) => hit || fetch(request)));
    return;
  }
  event.respondWith(networkFirst(request, key, url));
});

async function networkFirst(request, key, url) {
  const cache = await caches.open(CACHE);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT_MS),
      ),
    ]);
    // 검색어(_rsc 등) 없이 정식 경로로 저장해 캐시가 불어나지 않게 한다
    if (response.ok && response.type === "basic" && !response.redirected) {
      cache.put(key, response.clone());
    }
    return response;
  } catch {
    const hit = await cache.match(key);
    if (hit) return hit;
    if (request.mode === "navigate") {
      const lang = url.pathname.startsWith("/ja/") ? "/ja/" : "/en/";
      const home = await cache.match(lang);
      if (home) return home;
    }
    return Response.error();
  }
}
