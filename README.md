# Horang

![Horang — a tiger guide for Incheon Airport, AREX and Seoul Station](public/og.png)

**A pocket guide for the first hour in Seoul.** You land at Incheon Airport, take AREX (the airport railroad) to Seoul Station, and something stops you: the gate won't open, you don't know which card to buy, or which train to take. Open Horang, tap where you're stuck, and the tiger walks you out of it one step at a time.

**Live:** https://horang.seungwoo7050.workers.dev · English and 日本語

> Unofficial helper. Not run by or affiliated with any rail company (AREX, Korail, Seoul Metro) or Incheon Airport.

## What it does

| Screen                               | Helps with                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **I'm stuck at the gate**            | Pick the cause (low balance, error beep, wrong direction, Express ticket), follow the fix, or show staff a sentence |
| **Which card?**                      | Single-journey card, T-money or Climate Card, depending on where you are and how much you'll ride                   |
| **AREX: Express or All-stop?**       | Time and fare side by side, the next trains from the official timetable, and a departure-day mode                   |
| **Seoul Station: exits & transfers** | Elevator routes for luggage from the AREX platform to Lines 1 and 4 and Exit 15, drawn floor by floor               |
| **Show this to staff**               | Short Korean sentences in big type, a full-screen "Show big" view, and the 1330 Korea Travel Helpline               |

- **Works offline** after the first visit (service worker precache), including timetables and maps.
- **No sign-up, no account, no backend, no tracking.** A static site.
- **Every fact carries its source**: each claim is graded A (checked on site), B (official source) or C (traveler reports) with the date it was last checked.
- Light and dark, Reduce Motion, forced colors and screen readers are tested.

## Status

Pre-release. The screens, offline support and deployment are done. Before a public launch:

- On-site checks at Seoul Station (routes, exits and elevators are B-grade from official sources today)
- Native-speaker review of the Korean staff sentences and the Japanese text (currently marked as drafts in the app)
- Field tests with travelers from abroad

## Run it

Requires Node 22.

```bash
npm ci
npm run dev        # http://localhost:3000
```

| Command                                                      | What it does                                                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `npm run check`                                              | Lint, typecheck, format check, unit tests (Vitest)                                                                 |
| `npm run build`                                              | Content check (zod) → static export to `out/` → service worker and CSP `_headers`                                  |
| `node scripts/serve-out.mjs 4173` then `npx playwright test` | End-to-end tests against the built site, served the way Cloudflare serves it (restart the server after each build) |
| `npm run deploy`                                             | Build and deploy `out/` to Cloudflare Workers static assets                                                        |

CI runs check → build → e2e on every pull request, and deploys `main` to Cloudflare when everything passes.

## How it's built

- **Next.js 16** static export (`output: "export"`), **React 19** with view transitions for the screen-to-screen morphs. CSS modules and design tokens, no UI library.
- **Content is data**: `src/content/claims.json` (facts with evidence grades and sources), `phrases.json` (staff sentences), `timetables.json` (official AREX Express timetable), `links.json`. A zod schema checks them before every build, and the build fails on a missing source or date.
- **i18n**: `src/i18n/en.ts` and `ja.ts` must have the same keys (unit-tested). Japanese line breaks follow phrase boundaries.
- **Hosting**: Cloudflare Workers static assets (`wrangler.jsonc`). A strict CSP with script hashes is generated at build time.

```
src/app/[lang]/     screens (gate, card, arex, station, staff)
src/components/     flows, route map, "Show big", brand images
src/content/        claims, phrases, timetables, links
src/i18n/           English and Japanese text
scripts/            build steps and brand-image derivatives
e2e/                Playwright tests (flows, offline, CSP, a11y, brand)
```

## 한국어 요약

인천공항에 내려 공항철도로 서울역에 오는 외국인 여행자가 개찰구·교통카드·직통/일반 열차·출구와 환승에서 막힐 때 쓰는 안내 웹앱입니다. 영어와 일본어를 지원하고, 첫 방문 뒤에는 오프라인에서도 열리며, 로그인이나 서버가 없습니다. 모든 안내에는 근거 등급(현장 확인·공식 출처·여행자 보고)과 확인 날짜가 붙습니다. 철도 운영사나 공항과 관계없는 비공식 도우미입니다.
