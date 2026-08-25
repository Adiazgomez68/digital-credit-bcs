# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

A digital credit application microsite (free-destination personal loan) built as a technical assessment for a Frontend Expert role at Banco Caja Social (BCS). Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui + Zustand + TanStack Query + MSW, pnpm-managed.

Full domain context, the Spanish→English naming translation table, route inventory, and architecture decisions already made live in `docs/project-context.md` — **read it before writing any code that touches routing, the application state machine, or domain types.** Deeper rationale (rubric reading, state machine diagram, API contracts, security posture) is in `docs/hoja-de-ruta.md` (Spanish).

**IMPORTANT — this is not the Next.js you know.** Per `AGENTS.md`, this project pins a Next.js version with breaking changes vs. training data. Before writing App Router code, check `node_modules/next/dist/docs/` for the relevant guide.

## Commands

```bash
pnpm dev      # start dev server (next dev)
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
pnpm test     # vitest, watch mode
pnpm test:run # vitest, single run (use this one in CI-like checks)
```

Run a single test file with `pnpm vitest run <path>` (e.g. `pnpm vitest run src/proxy.test.ts`). Vitest is configured in `vitest.config.mts` (jsdom environment, `@/*` alias, and env vars mocked for tests: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_MOCKING=disabled`, `NEXT_PUBLIC_EMAIL_AUTH`, `NEXT_PUBLIC_PASSWORD_AUTH`). Existing suites: `src/mocks/db.test.ts` (state machine transitions, one-draft-per-document rule), `src/proxy.test.ts` (advisor-portal auth gate), and `src/services/*-service.test.ts`. Playwright e2e is still just a recommendation in `docs/hoja-de-ruta.md`, not set up.

Husky + lint-staged run `eslint --fix` and `prettier --write` on staged `*.ts`/`*.tsx` files at commit time (`prepare` script installs the hook).

## Architecture

### Two route modules, one codebase

- **Public client module**: `/` (route group `(client)/(marketing)`), `/credit/*` (multi-step application wizard — channel, basic-user-data, supplementary-user-data, simulation, summary, confirmation — all implemented). No auth.
- **Internal advisor portal**: `/advisor-portal/*` (`auth`, `applications`, `applications/[id]`, `applications/[id]/edit`). Route folders exist under `src/app/advisor-portal/` but are still empty — not yet implemented. Deliberately *not linked* from anywhere in the public site. Protected by `src/proxy.ts` (matcher `/advisor-portal/:path*` — this Next.js version renamed `middleware` to `proxy`, see `AGENTS.md`) checking a simulated session cookie (`bcs_advisor_session`); see `src/proxy.test.ts` for the gate's expected behavior.

Client-facing wizard steps live under `src/components/wizard/<step>/` (e.g. `basic-data`, `supplementary-data`, `simulation`, `summary`, `confirmation`, `channel`, `abandon`), each paired with a route in `src/app/(client)/credit/<step>/page.tsx` that's mostly a thin wrapper. Never hardcode a route string — use `WEB_ROUTES` from `src/routes/web.ts` for a route known at write-time, and `ENDPOINTS` from `src/routes/endpoints.ts` for API paths. `STEP_ROUTES` (same file) exists only for the one case that needs a step→route lookup by a runtime value rather than a literal — `WizardBackLink` (`src/components/wizard/back-link.tsx`), which receives an arbitrary `WizardStep` prop.

Both modules share the same `types/`, `store/`, `providers/`, and `components/ui/`. Full route table and per-route status (exists / scaffolded / to-create) is in `docs/project-context.md`.

### State split: Zustand is a navigation pointer only, never data

`src/store/application-store.ts` (vanilla `createStore` from `zustand`, wrapped with `persist`) holds only `id`, `channel`, `advisorId`. The `partialize` in that file is deliberately narrow — it must never grow to include sensitive fields (`document`, `income`, `expenses`, `amountRequested`, etc.). Those live only in the backend mock and are fetched with TanStack Query, then fed into React Hook Form via the `values` prop (not `defaultValues`), so a resumed session re-hydrates from the server, not from `localStorage`. Which route to resume at also lives server-side, on `Application.resumeRoute` — never cached locally as a `step` pointer, since that duplicated source of truth was itself a source of bugs (a stale local pointer could point at server state that no longer existed).

The store is exposed through React context, not a global singleton — see `src/providers/application-store-provider.tsx`. Access it with the `useApplicationStore` hook from that file (not a hand-rolled `useSolicitudStore` name from the planning docs — see the naming table in `docs/project-context.md`). One `ApplicationStoreProvider` instance is created per app via `useState(() => createApplicationStore())` in `layout.tsx`, following the standard Zustand-with-Next.js SSR-safe pattern (avoids sharing store instances across requests).

Server state (the application record itself, offers, events) goes through TanStack Query (`src/providers/tanstack-provider.tsx`), whose `isPending`/`isError`/`isSuccess` states are meant to be used directly as the UI's loading/error/success states rather than reinvented with ad hoc booleans.

### Domain types are the naming source of truth

`src/types/application.ts` and `src/types/store.ts` already establish the real English naming used throughout the code (`Application`, `ApplicationStatus`, `Channel`, `OfferSimulated`, `ApplicationEvent`, `Application.resumeRoute`, etc.). When the planning docs use Spanish domain terms or different English names than what's already in these files, the code wins — see the translation table in `docs/project-context.md` rather than inventing new names.

Key state machine: `ApplicationStatus` = `draft → simulation_realized | simulation_rejected → pending_validation → finalized`, with `abandoned` reachable from most non-terminal states. Editing rights are status- *and actor*-gated: `draft` → client only; `pending_validation` → advisor only (from `/advisor-portal`); `finalized`/`abandoned` → terminal for everyone. This rule must be enforced in code, not just hidden via UI — see `docs/hoja-de-ruta.md` §5 for the full diagram and the "one active draft per document" business rule (`POST /applications` returns the existing draft instead of creating a duplicate).

### Mocking and traceability

- **MSW** is the API mock layer (`msw.workerDirectory: ["public"]` in `package.json`); handlers/business rules live in `src/mocks/handlers/{applications,advisor-auth}/` on top of an in-memory `Map` in `src/mocks/db.ts`. `simulate-offer` stays deterministic (income/expense-based payment-capacity rule + a reproducible amount that triggers a technical-error path), never `Math.random()`.
- Every application-mutating call is expected to carry a `correlationId` and emit an `ApplicationEvent` (`actor: "client" | "advisor" | "system"`). In practice this means: don't call `fetch`/`apiClient` directly from components — go through a function in `src/services/{applications,advisor-auth}-service.ts`, which calls `apiClient` (`src/lib/http-client/`, exported via `src/lib/http-client/index.ts`). `apiClient` auto-attaches `X-Correlation-Id` (via `generateCorrelationId()`) and `X-Actor` headers and reports every call through `src/lib/observability/logger.ts`. Add new mutations as new service functions following this same shape rather than inlining a request.

### shadcn/ui

Already initialized (`components.json`, style `base-nova`, `baseColor: neutral`, icon library `lucide`). Primitives live in `src/components/ui/` (`accordion`, `alert-dialog`, `avatar`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `field`, `input`, `label`, `radio-group`, `select`, `separator`, `skeleton`, `table` so far). Use/extend these before hand-rolling a component; add new ones via the shadcn CLI to stay consistent with the configured style and aliases (`@/components`, `@/lib`, `@/hooks`).

### Path alias

`@/*` → `src/*` (see `tsconfig.json`).
