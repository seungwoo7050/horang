/**
 * 추천·제휴 자리(ARCHITECTURE.md §4). 지금은 아무것도 그리지 않는다.
 * 허용된 자리만 이름으로 둔다. 급한 화면(개찰구 막힘, 직원 문장)에는 자리를 만들지 않는다.
 */
export type SponsorSlotName = "after-card-pick" | "after-arex-pick";

export function SponsorSlot({ name }: { name: SponsorSlotName }) {
  void name;
  return null;
}
