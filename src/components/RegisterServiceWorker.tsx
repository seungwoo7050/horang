"use client";

import { useEffect } from "react";

/** 배포본에서만 서비스 워커를 등록한다(dev에는 sw.js가 없다). 설치 버튼 없이 조용히 캐시한다 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // 등록 실패는 온라인 사용에 영향이 없다
    });
  }, []);
  return null;
}
