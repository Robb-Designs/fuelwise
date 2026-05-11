# FuelWise Health

Frontend application for athlete activity analysis and weekly training recommendations.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [How the Application Works](#how-the-application-works)
- [Routing and Access Control](#routing-and-access-control)
- [Authentication Flow](#authentication-flow)
- [Activity Sync and Normalization](#activity-sync-and-normalization)
- [Dashboard Computation Pipeline](#dashboard-computation-pipeline)
- [Environment Configuration](#environment-configuration)
- [Run Locally](#run-locally)
- [Build and Preview](#build-and-preview)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## Overview

FuelWise Health is a React + TypeScript single-page application that:

- Connects a user account through OAuth.
- Syncs recent activity data from an API.
- Normalizes inconsistent API payloads into one frontend activity shape.
- Computes weekly load trends and recommendation outputs.
- Renders a dashboard with stats, diagnostics, and recent activity cards.

## Tech Stack

| Layer | Implementation |
| --- | --- |
| UI | React 19 |
| Language | TypeScript |
| Build Tool | Vite 6 |
| Router | React Router DOM 7 |
| Styling | Tailwind CSS 4 + component CSS |

## How the Application Works

At runtime, the app follows this sequence:

1. App mounts and initializes route tree.
2. Auth context restores local auth state from browser storage.
3. Protected routes gate dashboard access.
4. Dashboard requests activity feed using authenticated API requests.
5. Activity feed normalizes records and computes weekly metrics.
6. UI renders stat cards, recommendations, activity list, and diagnostics.

## Routing and Access Control

Route wiring is defined in `src/App.tsx`.

```tsx
<Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/exchange_token" element={<ExchangeTokenPage />} />
    <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        }
    />
</Routes>
```

`/dashboard` is guarded by `ProtectedRoute`, which allows rendering only when the user is authenticated.

## Authentication Flow

Authentication state is managed by `src/context/AuthContext.tsx`.

Primary behavior:

- `login()` requests an OAuth start URL from `VITE_AUTH_START_PATH`.
- Browser is redirected to provider authorization.
- Provider redirects back to `/exchange_token`.
- `ExchangeTokenPage` exchanges `code` for `{ access_token, athlete }`.
- `completeLogin()` persists token + user profile in localStorage.
- `logout()` clears stored auth state and returns to home.

Token persistence keys used by the frontend:

```ts
const ACCESS_TOKEN_KEY = "fuelwise_access_token";
const ATHLETE_KEY = "fuelwise_user";
```

## Activity Sync and Normalization

Activity sync lives in `src/hooks/useStrava.ts` (`useActivityFeed`).

The hook attempts configured and fallback endpoints:

```ts
const endpointCandidates = [
    configuredPath,
    "/api/hefit/activities",
    "/api/activities",
    "/api/strava/activities",
].filter((value): value is string => Boolean(value));
```

For each endpoint:

- Sends `Authorization: Bearer <token>` when token is available.
- Validates HTTP response status.
- Parses JSON payload.
- Extracts activity arrays from multiple payload shapes.
- Normalizes each item to a common `Activity` interface.

If all endpoints fail, the hook switches to internal mock activities and exposes diagnostics (`kind`, `endpoint`, `status`, `usedAuthorizationHeader`).

## Dashboard Computation Pipeline

`src/pages/DashboardPage.tsx` composes auth state, activity feed, and weekly analytics:

```tsx
const { athlete, logout, accessToken } = useAuth();
const { activities, isLoading, error, reload, isUsingMockData, dataSourceLabel, diagnostic } = useStrava(accessToken);

const weeklySummaries = useMemo(() => calculateWeeklyLoad(activities), [activities]);
const result = useMemo(() => generateFuelWiseResult(weeklySummaries), [weeklySummaries]);
```

Rendered outputs include:

- Weekly mileage and load metrics.
- Week-over-week load change.
- Injury risk signal.
- Recommendation panel (training + nutrition guidance).
- Recent activity cards.
- Fetch diagnostics and retry action when sync fails.

## Environment Configuration

Copy `.env.example` to `.env` and set values:

```bash
VITE_API_BASE_URL=
VITE_AUTH_PROVIDER_CLIENT_ID=
VITE_AUTH_START_PATH=/api/auth/connect
VITE_AUTH_CALLBACK_PATH=/api/auth/callback
VITE_ACTIVITIES_PATH=/api/hefit/activities
VITE_DEV_BYPASS_AUTH=false
```

Environment values are read with `import.meta.env` at build/runtime in the frontend.

## Run Locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Default dev server: `http://localhost:5173`

## Build and Preview

Create a production build:

```bash
npm run build
```

Preview the built app:

```bash
npm run preview
```

## Deployment

The app is published on GitHub Pages at:

https://robb-designs.github.io/fuelwise/

To redeploy the current build to the `gh-pages` branch, run:

```bash
npm run deploy
```

## Project Structure

```text
fuelwise-health/
├── public/
│   ├── data/
│   └── images/
├── server/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── types/
│   └── utils/
├── .env.example
├── package.json
└── README.md
```
