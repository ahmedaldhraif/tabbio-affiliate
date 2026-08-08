# Tabbio Affiliate

Tabbio Affiliate is a complete frontend experience for Tabbio's partner program, built on the real [RefRef](https://github.com/amicalhq/refref) open-source codebase.

It includes the public partner landing page and the complete partner workspace: onboarding, overview, clients, content creation, referral links and QR codes, earnings, downloadable resources, and settings.

> [!IMPORTANT]
> This repository currently provides a frontend-only local prototype. Authentication, server APIs, database persistence, production attribution, AI generation, and real payouts are intentionally not connected yet. Every simulated workflow is labelled inside the product.

## Run locally

Prerequisites:

- Node.js 20 or newer
- pnpm 10.23.0

```powershell
git clone https://github.com/ahmedaldhraif/tabbio-affiliate.git
cd tabbio-affiliate
pnpm install --frozen-lockfile
pnpm dev:tabbio
```

Open [http://localhost:3100](http://localhost:3100).

## Product surfaces

- Public partner landing page, earnings estimator, FAQ, terms, and referral previews
- Four-step resumable partner onboarding
- Partner overview with transparent demo metrics and balances
- Client search, filtering, creation, status, and details
- Deterministic local content drafting, editing, copy, save, and download
- Referral-link creation, destination selection, QR generation, copy, download, and archive
- Earnings balances, recent ledger sample, CSV export, and balance summary
- Downloadable partner brand kit, approved copy, tokens, and playbook
- Profile, notification, and public partner identity settings
- Responsive desktop and mobile navigation, RTL development state, reduced motion, keyboard support, and accessible status feedback

Mutable prototype data is stored only in the browser's `localStorage` and can be reset from the interface.

## Documentation

| Document                                              | Purpose                                                                          |
| ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| [PRODUCT.md](PRODUCT.md)                              | Concise product definition and scope                                             |
| [PRD.md](PRD.md)                                      | Complete product requirements, workflows, data contracts, and production gates   |
| [DESIGN.md](DESIGN.md)                                | Material 3 design system, tokens, responsive behavior, states, and accessibility |
| [CLAUDE.md](CLAUDE.md)                                | Implementation authority and rules for coding agents                             |
| [CHECKLIST.md](CHECKLIST.md)                          | Evidence-backed frontend acceptance checklist                                    |
| [TABBIO_LOCAL.md](TABBIO_LOCAL.md)                    | Local development and verification commands                                      |
| [RefRef provenance](docs/TABBIO_REFREF_PROVENANCE.md) | Upstream relationship, reuse boundary, and licensing notes                       |

## Verification

The checked-in frontend has passed:

- Frozen-lockfile installation
- Formatting, zero-warning application lint, and TypeScript checks
- 6 unit tests
- An 18-page static production export
- 110 responsive route-width checks
- Automated accessibility scans on 10 key routes with zero axe violations
- Text zoom, reflow, reduced-motion, RTL, storage-failure, reset-race, and download checks

See [CHECKLIST.md](CHECKLIST.md) for the exact local evidence and the production capabilities that remain deferred.

## Architecture

The isolated Tabbio application lives in [`apps/tabbio-partners`](apps/tabbio-partners) and reuses the shared `@refref/ui` package. Root scripts filter development, build, and type-check operations to the Tabbio application without removing the upstream RefRef monorepo.

## RefRef and license

This repository remains a GitHub fork of `amicalhq/refref`. Upstream history and attribution are preserved, and the `upstream` Git remote can be used to review future RefRef changes.

RefRef and this derivative repository are distributed under the [GNU Affero General Public License v3.0](LICENSE). Review the license and obtain legal advice before offering a modified network service.
