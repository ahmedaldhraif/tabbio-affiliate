# Tabbio Partner Local Frontend

This repository is the user's real GitHub fork of [`amicalhq/refref`](https://github.com/amicalhq/refref). The Tabbio partner prototype is additive and lives in `apps/tabbio-partners`.

## Run locally

Requirements: Node.js 20 or newer and pnpm 10.23.0.

```powershell
pnpm install --frozen-lockfile
pnpm dev:tabbio
```

Open [http://localhost:3100](http://localhost:3100). The public partner page is `/`; the partner workspace is `/partner`.

Useful checks:

```powershell
pnpm --filter @tabbio/partners format:check
pnpm --filter @tabbio/partners lint
pnpm typecheck:tabbio
pnpm --filter @tabbio/partners test:run
pnpm build:tabbio
```

## What is connected

- Real RefRef monorepo and Git history.
- Real `@refref/ui` source components.
- Responsive Tabbio-branded frontend routes.
- Deterministic example records and calculations.
- Browser-local edits through `localStorage`.

## What is intentionally not connected

- Authentication, authorization, server routes, or a database.
- Real referral redirects, cookies, attribution, billing events, or commission ledger.
- AI/LLM generation, publishing, email, or analytics.
- KYC, advertiser permits, agreements, payout accounts, or money movement.

All visible operational data is labelled as a local simulation. A successful local build is frontend evidence only.

## Prototype state checks

Partner pages accept development query states such as `?state=empty`, `?state=loading`, `?state=error`, `?state=overflow`, and `?state=rtl` where relevant. Use the Reset demo action in the desktop rail to restore fixtures.

## Later integration seam

Keep the components and route model, then replace `DemoProvider` with authenticated service adapters. Preserve the independent application, membership, compliance, and payout-capability states in `PRD.md`; never map them into one green status.
