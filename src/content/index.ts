// 앱이 콘텐츠를 읽는 유일한 입구. 정적 빌드 중에 파싱하므로 스키마 위반이면 빌드가 실패한다.
import claimsJson from "./claims.json";
import linksJson from "./links.json";
import phrasesJson from "./phrases.json";
import timetablesJson from "./timetables.json";
import { ClaimsFile, LinksFile, PhrasesFile, TimetablesFile } from "./schema";

export const claims = ClaimsFile.parse(claimsJson);
export const phrases = PhrasesFile.parse(phrasesJson);
export const links = LinksFile.parse(linksJson);
export const timetables = TimetablesFile.parse(timetablesJson);

export function getClaim(id: string) {
  const claim = claims.find((c) => c.id === id);
  if (!claim) throw new Error(`claim 없음: ${id}`);
  return claim;
}

export function getLink(id: string) {
  const link = links.find((l) => l.id === id);
  if (!link) throw new Error(`link 없음: ${id}`);
  return link;
}

/**
 * 크게 보기 아래에 늘 붙는 답하는 법 문장(직원에게: 말 대신 손가락으로 가리켜 달라).
 * 고르는 문장 목록에는 넣지 않는다(크게 보기마다 이미 보인다)
 */
export const POINT_PHRASE = "staff.point";

export function getPhrase(id: string) {
  const phrase = phrases.find((p) => p.id === id);
  if (!phrase) throw new Error(`phrase 없음: ${id}`);
  return phrase;
}
