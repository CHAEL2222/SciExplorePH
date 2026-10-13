# SciExplorePH

A responsive science and math learning space with six Philippine-context lessons, lesson quizzes, browser-saved progress, and Explore chat. Lesson content is introductory and does not claim formal DepEd curriculum certification.

## Run locally

Use Node.js 24.15+ (Angular 22 requirement) and npm.

```sh
npm ci
npm run chat
# In another terminal:
npm start -- --host 0.0.0.0
```

Open http://localhost:4200. The Angular development proxy forwards `/api` requests to the chat server on loopback port 3001.

## Live AI

The chat works without credentials as an **offline lesson guide** that retrieves existing lesson text; it does not generate AI responses. To enable Gemini, set `GEMINI_API_KEY` in the server process environment, then run `npm run chat`. Never put this key in Angular environment files, client code, or Git. Reload the app after configuring the server. Live conversations are sent to Google Gemini; the UI discloses this. The server uses `gemini-2.5-flash` and limits message size, simultaneous calls, and request duration. It does not log or persist conversations.

The included server is for local development. Before public deployment, put it behind an authenticated same-origin application gateway with per-user quotas and rate limits. Serve the build from `www/`, support SPA route fallback to `index.html`, and proxy `/api` to the server. The Angular development proxy is not included in a production build.

## Learning data

Correct quiz answers allow learners to complete a lesson and earn 50 XP once per lesson. Completion IDs are stored locally under `sciexplore-completed`; they are not shared across devices. Clearing browser storage resets progress. Chat history lasts for the current page session and can be cleared independently.

## Checks

```sh
npm run build
npm run lint
npm test -- --watch=false
npm run test:server
```

Reference resources for further study: [PAGASA](https://www.pagasa.dost.gov.ph/), [PHIVOLCS](https://www.phivolcs.dost.gov.ph/), and [DepEd learning resources](https://lrmds.deped.gov.ph/).
