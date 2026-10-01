// 앱이 콘텐츠를 읽는 유일한 입구. 정적 빌드 중에 파싱하므로 스키마 위반이면 빌드가 실패한다.
import claimsJson from "./claims.json";
import phrasesJson from "./phrases.json";
import { ClaimsFile, PhrasesFile } from "./schema";

export const claims = ClaimsFile.parse(claimsJson);
export const phrases = PhrasesFile.parse(phrasesJson);

export function getClaim(id: string) {
  const claim = claims.find((c) => c.id === id);
  if (!claim) throw new Error(`claim 없음: ${id}`);
  return claim;
}
