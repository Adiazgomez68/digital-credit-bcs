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
```

No test runner is configured yet (`docs/hoja-de-ruta.md` recommends Vitest/Jest + Testing Library + MSW for flow tests, and Playwright for e2e, once the transactional flow exists). There is no `test` script in `package.json` — check before assuming one exists.

Husky + lint-staged run `eslint --fix` and `prettier --write` on staged `*.ts`/`*.tsx` files at commit time (`prepare` script installs the hook).

## Architecture

### Two route modules, one codebase

- **Public client module**: `/` (route group `(marketing)`), `/credit/*` (multi-step application wizard), `/check-application`, `/my-applications*`. No auth.
- **Internal advisor portal**: `/admin-portal/*`. Deliberately *not linked* from anywhere in the public site. Will be protected by `middleware.ts` (matcher `/admin-portal/:path*`) checking a simulated session cookie (`bcs_advisor_session`) — not yet implemented.

Both modules share the same `types/`, `store/`, `providers/`, and `components/ui/`. Full route table and per-route status (exists / scaffolded / to-create) is in `docs/project-context.md`.

### State split: Zustand is a navigation pointer only, never data

`src/store/application-store.ts` (vanilla `createStore` from `zustand`, wrapped with `persist`) holds only `id`, `channel`, `advisorId`, `step`. The `partialize` in that file is deliberately narrow — it must never grow to include sensitive fields (`document`, `income`, `expenses`, `amountRequested`, etc.). Those live only in the backend mock and are fetched with TanStack Query, then fed into React Hook Form via the `values` prop (not `defaultValues`), so a resumed session re-hydrates from the server, not from `localStorage`.

The store is exposed through React context, not a global singleton — see `src/providers/application-store-provider.tsx`. Access it with the `useApplicationStore` hook from that file (not a hand-rolled `useSolicitudStore` name from the planning docs — see the naming table in `docs/project-context.md`). One `ApplicationStoreProvider` instance is created per app via `useState(() => createApplicationStore())` in `layout.tsx`, following the standard Zustand-with-Next.js SSR-safe pattern (avoids sharing store instances across requests).

Server state (the application record itself, offers, events) goes through TanStack Query (`src/providers/tanstack-provider.tsx`), whose `isPending`/`isError`/`isSuccess` states are meant to be used directly as the UI's loading/error/success states rather than reinvented with ad hoc booleans.

### Domain types are the naming source of truth

`src/types/application.ts` and `src/types/store.ts` already establish the real English naming used throughout the code (`Application`, `ApplicationStatus`, `Channel`, `OfferSimulated`, `ApplicationEvent`, `ApplicationState.step`, `goToStep`, etc.). When the planning docs use Spanish domain terms or different English names than what's already in these files, the code wins — see the translation table in `docs/project-context.md` rather than inventing new names.

Key state machine: `ApplicationStatus` = `draft → simulation_realized | simulation_rejected → pending_validation → finalized`, with `abandoned` reachable from most non-terminal states. Editing rights are status- *and actor*-gated: `draft` → client only; `pending_validation` → advisor only (from `/admin-portal`); `finalized`/`abandoned` → terminal for everyone. This rule must be enforced in code, not just hidden via UI — see `docs/hoja-de-ruta.md` §5 for the full diagram and the "one active draft per document" business rule (`POST /applications` returns the existing draft instead of creating a duplicate).

### Mocking and traceability

- **MSW** is the API mock layer (`msw.workerDirectory: ["public"]` in `package.json`); `simulate-offer` must stay deterministic (income/expense-based rule + a reproducible error hook), never `Math.random()`.
- Every application-mutating call is expected to carry a `correlationId` and emit an `ApplicationEvent` (`actor: "client" | "advisor" | "system"`) — this is graded as part of "observability and traceability," so route mutations through one shared service/hook rather than logging ad hoc.

### shadcn/ui

Already initialized (`components.json`, style `base-nova`, `baseColor: neutral`, icon library `lucide`). Primitives live in `src/components/ui/` (`button`, `card`, `checkbox`, `dialog`, `input`, `label`, `radio-group`, `select`, `table` so far). Use/extend these before hand-rolling a component; add new ones via the shadcn CLI to stay consistent with the configured style and aliases (`@/components`, `@/lib`, `@/hooks`).

### Path alias

`@/*` → `src/*` (see `tsconfig.json`).
