# Frontend Documentation

This document is the high-level source of truth for the frontend in this repository. It describes the behavior and
operating model implemented by the current React source, package configuration, tests, and build integration.

For backend endpoint details, request and response fields, and server-side authorization, see the [backend API
contract](API-CONTRACT.md). For the backend runtime and deployment model, see the [backend documentation](BACKEND.md).

Documentation should be updated when frontend views, role behavior, API clients, build steps, dependencies, or runtime
configuration changes.

## Contents

- [Purpose](#purpose)
- [Application structure](#application-structure)
- [Runtime and setup](#runtime-and-setup)
- [Authentication and session behavior](#authentication-and-session-behavior)
- [Roles and views](#roles-and-views)
- [Core workflows](#core-workflows)
- [Data flow and state management](#data-flow-and-state-management)
- [API integration](#api-integration)
- [Visual system](#visual-system)
- [Build and packaging](#build-and-packaging)
- [Testing and validation](#testing-and-validation)
- [Design tradeoffs](#design-tradeoffs)
- [Known limitations](#known-limitations)
- [Change rules](#change-rules)

## Purpose

The frontend is a single-page care-referral portal for administrators, care coordinators, and auditors. It provides
role-scoped views for monitoring referrals, managing members and coordinators, reviewing SLA risk, and completing
referral workflow actions.

The application is a client-rendered React experience. It does not use a client-side router; `App.tsx` switches the
visible view using an `activeTab` state value.

### Technology baseline

| Concern | Current implementation |
| --- | --- |
| UI framework | React 19.2.8 |
| Language | TypeScript |
| Development/build tool | Vite 8 |
| Styling | Tailwind CSS 3.4 with PostCSS and Autoprefixer |
| Design-system dependency | `@uhg-abyss/web` 2.4.0 |
| Icons | Lucide React 0.511.0 |
| Date input | React DatePicker 9.1.0 |
| Fonts | Enterprise Sans, Enterprise Sans Condensed, and Enterprise Serif Text |
| Tests | Vitest 4.1 with React Testing Library and jsdom |
| Runtime prerequisite | Node.js 24 or newer |

## Application structure

### Bootstrap sequence

1. `index.html` provides the `root` element and loads `/src/main.tsx`.
2. `main.tsx` creates the React root and renders `App` inside `StrictMode`.
3. `App.tsx` restores a token from `localStorage`, derives the current user from the JWT payload, and chooses between
   `LoginView` and the authenticated portal.
4. After authentication, `App.tsx` loads members, coordinators, auditors, and referrals in parallel.

### Source organization

| Path | Responsibility |
| --- | --- |
| `frontend/src/App.tsx` | Application shell, user/session state, view selection, data loading, and mutation orchestration |
| `frontend/src/components/` | Portal views, tables, modals, navigation, dashboards, and feedback UI |
| `frontend/src/components/overdue-dashboard/` | Risk metrics, chart calculations, and metric dialog support |
| `frontend/src/features/system/` | System health view and its tests |
| `frontend/src/shared/api/` | Typed HTTP wrappers for authentication, people, referrals, and notifications |
| `frontend/src/shared/components/` | Reusable date, select, avatar, textarea, and visual helper components |
| `frontend/src/shared/utils/` | Shared validation and utility functions |
| `frontend/src/types.ts` | Shared frontend domain types |
| `frontend/src/index.css` | Tailwind directives, font-face declarations, and global base styles |
| `frontend/tailwind.config.js` | Tailwind content paths, fonts, colors, spacing, and dark-mode configuration |
| `frontend/public/` | Static images, videos, fonts, and other public assets |
| `frontend/src/test/` | Vitest setup and test support |

The current organization is mostly component-oriented, with a dedicated `features/system` slice for health. It is not a
fully feature-folder-organized application.

## Runtime and setup

### Prerequisites

- Node.js 24 or newer
- npm
- A running backend at `http://localhost:8080` for authenticated application data

From `frontend/`, install dependencies and start Vite:

```bash
npm install
npm run dev -- --host localhost
```

The development application is available at `http://localhost:5173`.

### Development proxy

[vite.config.ts](../frontend/vite.config.ts) proxies these browser paths to the backend:

| Browser path | Backend target |
| --- | --- |
| `/api` | `http://localhost:8080` |
| `/actuator/` | `http://localhost:8080` |

The frontend uses relative paths and has no frontend environment-variable configuration for changing this API base
path. In a packaged deployment, Spring Boot serves the compiled frontend and handles the same relative paths.

## Authentication and session behavior

### Login and registration

`LoginView` supports:

- Login with email and password
- Registration requests for `AUD` or `CRD` roles
- Registration-status lookup by email
- Password completion after administrator approval

The backend owns credential validation and JWT issuance. See [API-CONTRACT.md](API-CONTRACT.md) for the complete
request and response contract.

### Token storage

The frontend stores the JWT in browser `localStorage` under the key `auth_token`. The shared API client reads that value
and adds `Authorization: Bearer <token>` to requests.

On application startup, `App.tsx` decodes the JWT payload client-side to recover `sub`, `role`, `name`, and `externalId`.
This decoding is used for UI state; it is not a replacement for signature validation or backend authorization.

Logout removes the token, clears the current user, resets the active tab and referral filters, and returns the user to the
login screen. There is no refresh-token flow. When the backend token expires, the user must authenticate again.

### Client-side versus server-side authorization

The frontend hides views and blocks actions based on the current role and, for coordinators, assignment ownership. These
checks improve user experience but are not a security boundary. The backend JWT filter and service rules remain the source
of truth for authorization.

## Roles and views

The application maps backend role codes to portal roles:

| Backend code | Portal role | Available views |
| --- | --- | --- |
| `ADM` | Administrator | Dashboard, Members, Overdue Risk Center, Access Control Center |
| `CRD` | Coordinator | Dashboard, My Workflow, Members |
| `AUD` | Auditor | Dashboard only, read-only |

### Dashboard

Available to all portal roles. It includes:

- Overdue referrals
- Active interventions
- Urgent-priority referrals
- Closed cases
- Filterable referral table
- Referral detail and audit history
- Administrator-only referral creation

Dashboard card metrics can apply preset filters for overdue, active, urgent, and closed referrals. Coordinator views are
scoped to the coordinator's assigned cases where the workflow requires it.

### My Workflow

Available to coordinators. It focuses on the coordinator's assigned referrals, SLA milestones, workload metrics, and
notification activity.

### 360 Member Profiles

Available to administrators and coordinators. It provides member demographics, referral history, and coordinator
information. Administrators can create members and coordinators; coordinators have read-oriented access.

### Overdue Risk Center

Available to administrators. It provides overdue referral analytics, priority breakdowns, trend metrics, coordinator risk
summaries, and drill-down views.

### Access Control Center

Available to administrators. It supports registration-request review, approval or rejection, auditor visibility, and SLA
extension request review.

## Core workflows

### Referral workflow

1. An administrator creates a referral by selecting a member, referral type, priority, coordinator, due date, and notes.
2. Users open a referral to view its full detail and audit history.
3. Administrators can reassign referrals, change due dates, update priority, and update status.
4. Coordinators can update status, update priority, and request SLA extensions for their assigned referrals.
5. Auditors can inspect dashboard and referral information without mutation controls.
6. After a mutation, the frontend refetches the affected data from the backend rather than maintaining an optimistic local
   copy.

The backend enforces the referral state machine and authorization. The frontend presents the currently supported status
flow: `CREATED` to `IN_PROGRESS`, then `COMPLETED` or `CANCELLED`.

### SLA extension workflow

A coordinator or administrator can submit an SLA-extension request from referral detail. Submission leaves the current due
date unchanged. An administrator reviews the request in Access Control Center; approval applies the requested date and
rejection leaves the original date unchanged.

The frontend also exposes the administrator's direct due-date change action, which is separate from the request-and-review
flow.

### Notifications

`CoordinatorProfileHeader` polls the backend notification endpoint every 30 seconds while the coordinator workflow or
dashboard context is active. Notifications are displayed in the profile header and can navigate the user to the related
referral.

The frontend uses:

```text
GET /api/notifications?since=<epoch-milliseconds>
```

The backend filters events for the authenticated user and returns them newest first. This is polling, not real-time
WebSocket or server-sent-event delivery.

### Health view

The system health feature calls `/actuator/health` directly rather than through the API client.
It also requests `/actuator/info` for build information, but `/actuator/info` is not currently public in the backend security configuration and will return `401` unless the backend allowlist is updated or the request includes the JWT.
The page refreshes health data every five seconds and provides a pause/resume control and a manual check action.

## Data flow and state management

### Central state owner

`App.tsx` owns the primary application state using React hooks. There is no Redux, Zustand, or other global state library.
State includes:

- Current user and role
- Members, coordinators, auditors, and referrals
- Active view and dark-mode preference
- Referral filters and selected referral
- Modal state and preselected member/coordinator context
- Toast messages and administrative pending counts

### Initial load

After a user is established, the app requests members, coordinators, auditors, and referrals in parallel with
`Promise.all`. A failure produces an error toast.

### Refresh strategy

After create or update operations, the app refetches the primary collections and preserves the selected referral when
possible. Opening a referral first shows the list record and then requests the detail record to obtain complete audit
history.

The app also refreshes its local “today” value every 60 seconds so overdue calculations roll over without a full page
reload.

### Filtering and pagination

The referral table applies client-side filtering and sorting over the loaded referral array. Its UI supports status,
priority, timeline/date range, coordinator, referral type, and text search filters, plus page navigation over the current
filtered result set.

This is distinct from backend filtering: the browser initially loads the referral collection and performs table-specific
presentation filtering locally.

## API integration

All domain API calls go through [apiClient.ts](../frontend/src/shared/api/apiClient.ts). It:

- Uses `/api` as the base path
- Sends JSON content type headers
- Injects the JWT from `localStorage` when present
- Throws an error containing the HTTP status and response text for non-success responses

Typed API modules are:

| Module | Backend surface |
| --- | --- |
| `shared/api/auth.ts` | Login, registration, registration status, and administrator registration review |
| `shared/api/persons.ts` | Members, coordinators, and auditors |
| `shared/api/referrals.ts` | Referral listing, detail, mutation, and SLA-extension operations |
| `shared/api/notifications.ts` | Notification polling |

The frontend does not currently expose every backend endpoint as a client function. The backend API contract remains the
complete server-side reference.

## Visual system

### Styling approach

The application is Tailwind-first. The Tailwind configuration uses class-based dark mode and defines Optum brand colors,
semantic status colors, chart colors, custom spacing, and Enterprise font families.

Global CSS loads local font files from `public/fonts/` with `font-display: swap`:

- Enterprise Sans
- Enterprise Sans Condensed
- Enterprise Serif Text

Lucide React supplies interface icons. React DatePicker supplies date-picker behavior.

### Abyss usage

`@uhg-abyss/web` is installed and is used by the system health feature for components such as `Alert`, `Badge`, `Button`,
`Card`, `Heading`, `LoadingSpinner`, `PageBody`, and `Text`, plus its `styled` utility.

Most of the portal uses custom React components and Tailwind classes rather than Abyss primitives. This is the current
implementation and should not be described as an all-Abyss UI.

## Build and packaging

### NPM scripts

Run these commands from `frontend/`:

```bash
npm run dev
npm run build
npm run preview
npm test
npm run type-check
npm run lint
npm run format:check
```

`npm run build` runs TypeScript project compilation followed by the Vite production build. The output is written to
`frontend/dist/`.

### Maven integration

The frontend is also a Maven module. The frontend Maven plugin installs the configured Node.js 24.18.0 and npm 11.16.0
versions, installs dependencies, runs tests, and builds the frontend during the Maven lifecycle.

The backend module copies `frontend/dist` into packaged backend public resources. A full package therefore combines the
React build and Spring Boot application:

```bash
mvn clean package
```

For frontend-only iteration, use the NPM commands. For deployment packaging, validate the integrated Maven build.

## Testing and validation

The configured test stack is Vitest with jsdom, React Testing Library, and `@testing-library/jest-dom`. The shared test
setup installs DOM matchers, mocks `ResizeObserver`, and performs cleanup.

The current checked-in frontend test is:

- `src/features/system/HealthPage.test.tsx`: health loading, successful responses, component status rendering, malformed
  responses, network failures, automatic refresh, pause/resume, and manual retry behavior.

Run the frontend checks from `frontend/`:

```bash
npm test
npm run type-check
npm run lint
npm run build
```

Current automated coverage does not include `App`, authentication flows, API-client behavior, referral tables, modals,
role navigation, or the major dashboard workflows.

## Design tradeoffs

### Centralized state in `App.tsx`

Keeping application state and mutation orchestration in one component makes the capstone workflow straightforward to
follow and avoids introducing a state-management dependency. The tradeoff is prop drilling and broad rerender scope as
the application grows.

### Full refetch after mutations

The frontend refetches backend collections after mutations instead of applying optimistic updates. This keeps the UI
aligned with server-side rules and audit data. The tradeoff is additional network traffic and less immediate interaction
feedback.

### Client-side filtering

The referral table loads the collection and applies rich filters, sorting, and pagination in the browser. This enables
responsive table interactions without adding backend query complexity. The tradeoff is that large datasets increase
initial payload size and browser work.

### Tailwind-first custom UI

Tailwind and custom components allow the portal to match its workflow-specific visual requirements quickly. The tradeoff
is less consistency and accessibility support than a fully standardized component-library implementation would provide.

### Local-storage JWT persistence

Persisting the token lets a browser session survive a page reload without a server-side session. The tradeoff is browser
storage exposure and the absence of refresh, revocation, and password-reset flows.

## Known limitations

- No client-side router; view navigation is state-driven inside `App.tsx`.
- No refresh-token, logout API, password-reset, or token-revocation flow.
- Client-side role checks are not a substitute for backend authorization.
- Primary collections are loaded without pagination or lazy loading, and mutations trigger full refetches.
- The notification UI polls every 30 seconds and has no persistent notification archive.
- Automated coverage is concentrated in the health feature; core authentication and referral workflows are not currently
  covered by frontend tests.
- Accessibility coverage for custom controls and modals is incomplete, including focus management and some ARIA labeling.
- Dark-mode support is not perfectly consistent across all custom components.
- Most UI styling is custom Tailwind code; Abyss is not the sole component system.
- No Vite image optimization, code-splitting, service worker, or offline fallback is configured.
- The frontend contains synthetic/demo data assumptions appropriate for local scenarios, not production healthcare data.

## Change rules

- Derive frontend documentation from the current source, package scripts, Vite configuration, and Maven integration.
- Update [API-CONTRACT.md](API-CONTRACT.md) when frontend API usage reveals a backend contract change.
- Run `npm test`, `npm run type-check`, `npm run lint`, and `npm run build` after frontend behavior changes.
- Run `mvn clean package` when frontend packaging integration changes.
- Keep client-side role behavior aligned with backend authorization, but never treat hidden UI controls as security.
- Do not add credentials, tokens, or production data to examples or source control.
