# Tabbio Partner RefRef Provenance

## Source

- Upstream: `https://github.com/amicalhq/refref`
- User fork: `https://github.com/ahmedaldhraif/refref`
- Initial upstream baseline: `81af934fec3b20990a4d9af7ed472d0d14d73a82`
- License retained at repository root: AGPL-3.0

## Reuse in the local frontend

The Tabbio application is a new workspace app at `apps/tabbio-partners`. It imports maintained source primitives from `packages/ui`, including buttons, cards, fields, dialogs, tables, tabs, accordions, switches, sliders, tooltips, and feedback components. Those primitives remain part of this AGPL repository.

The prototype does not import RefRef's authenticated layouts, Better Auth setup, tRPC clients, database packages, referral tracking script, redirect service, API routes, workers, secret management, PostHog, or payout/provider code.

## Modification boundary

Tabbio owns the public partner composition, partner navigation, demo state adapter, data fixtures, business-language labels, local interactions, visual tokens, and documentation added by this branch. Material 3 is used as interaction guidance; no Material Web runtime code was added.

## Deployment note

This record documents source provenance, not legal advice. Before the modified program is offered over a network, the owner must review AGPL corresponding-source and notice obligations and establish a reliable source-offer/release process. Production backend, provider, privacy, and financial requirements remain gated by `PRD.md`.
