# Horang

[한국어](README.md) · **English**

![Horang — a tiger guide for Incheon Airport, AREX and Seoul Station](public/og.png)

**A pocket guide for the first hour in Seoul.** You land at Incheon Airport, take AREX (the airport railroad) to Seoul Station, and something stops you: the gate won't open, you don't know which card to buy, or which train to take. Open Horang, tap where you're stuck, and the tiger walks you out of it one step at a time.

**Live:** https://horang.seungwoo7050.workers.dev · English and 日本語

> Unofficial helper. Not run by or affiliated with any rail company (AREX, Korail, Seoul Metro) or Incheon Airport.

<p align="center">
  Next.js 16 (static export) · React 19 · TypeScript · zod · Cloudflare Workers · Playwright<br>
  October 2026 · 158 commits · about 180 tests
</p>

<p align="center"><img src="assets/screenshots/screens-light.png" alt="Home screen, a gate fix step, AREX comparison with next trains, and the Line 4 route at Seoul Station" width="860"></p>

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

<p align="center"><img src="assets/screenshots/screens-flows.png" alt="Choosing what went wrong at the gate, the card recommendation, and a Korean sentence to show staff" width="660"></p>

## How it's built

- **Next.js 16** static export (`output: "export"`), **React 19** with view transitions for the screen-to-screen morphs. CSS modules and design tokens, no UI library.
- **Content**: `src/content/claims.json` (38 facts with evidence grades and sources), `phrases.json` (staff sentences), `timetables.json` (official AREX Express timetable), `links.json`.
- **i18n**: `src/i18n/en.ts` and `ja.ts`.
- **Hosting**: Cloudflare Workers static assets (`wrangler.jsonc`). Only `out/` is uploaded, with no Worker script.

```
src/app/[lang]/     screens (gate, card, arex, station, staff)
src/components/     flows, route map, "Show big", brand images
src/content/        claims, phrases, timetables, links and the zod schema
src/station-map/    Seoul Station graph and route layout
src/i18n/           English and Japanese text
scripts/            content check, source watch, service worker and CSP generation, brand images
e2e/                Playwright tests (flows, offline, CSP, a11y, next train, brand)
```

<p align="center"><img src="assets/screenshots/screens-dark.png" alt="Dark mode: home, AREX, Seoul Station route, and staff sentences" width="860"></p>

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

## Current status

Pre-release. The screens, offline support and deployment are done. Before a public launch:

- On-site checks at Seoul Station (routes, exits and elevators are B-grade from official sources today)
- Native-speaker review of the Korean staff sentences and the Japanese text (currently marked as drafts in the app)
- Field tests with travelers from abroad
