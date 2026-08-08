# Tabbio Partner Program Implementation Guide

This file is the operating contract for any coding agent working on the Tabbio partner program. It turns the product, design, compliance, and RefRef audit decisions into implementation rules.

## 1. Read this authority stack first

Use the first applicable source when two sources disagree:

1. User approvals and `PRD.md` for scope, business rules, state machines, requirements, data contracts, and release gates.
2. `PRODUCT.md` for product identity, users, positioning, and durable principles.
3. `DESIGN.md` for visual language, component behavior, responsive rules, accessibility, and copy.
4. The actual Tabbio application repository for established code conventions and shared systems.
5. Current official Material 3 and Checklist Design guidance for behavior and coverage.
6. Material Web `v2.5.0` at commit `b4de401eb665ec63474f39319a4ba8f2145974cc` for optional component implementation code and patterns.
7. The supplied Tabbio SVG exports for visual direction only.
8. RefRef at commit `81af934fec3b20990a4d9af7ed472d0d14d73a82` for selectively reusable concepts or code, subject to the license gate below.

Do not let a mockup, an upstream example, or an implementation shortcut silently redefine a rule in the first three documents. If a necessary decision is still open, record it in the PRD and stop at the affected boundary instead of inventing policy.

## 2. Current status and stop conditions

The user selected this real RefRef fork as the implementation repository and authorized one isolated local frontend in `apps/tabbio-partners`. Build and test that frontend without connecting authentication, servers, databases, live attribution, payout providers, AI/LLM APIs, email, analytics, or publishing. Use deterministic fixtures and browser-local persistence only, with a persistent demo disclosure.

The selected source route is the public AGPL fork at `ahmedaldhraif/refref`, pinned initially to upstream commit `81af934fec3b20990a4d9af7ed472d0d14d73a82`. Preserve the upstream license and history. Legal review and corresponding-source operations remain a stop condition before network deployment.

Before production or backend implementation begins, the remaining Gate 0 decisions in `PRD.md` must be resolved:

- identify the canonical Tabbio identity/billing repository and its deployment environments, if separate from this fork;
- complete the AGPL deployment and corresponding-source review, or obtain a commercial/dual license;
- choose whether Material Web is adopted, selectively wrapped, used as an Apache-licensed porting reference, or rejected after a target-stack compatibility spike;
- approve attribution, recurring commission, refund, chargeback, payout, currency, tax, and termination rules;
- approve tenant and role boundaries;
- approve tracking consent, retention, privacy, and UAE advertising compliance;
- confirm the payout provider and whether its UAE account model supports the required flow.

Never describe a local build, test double, sandbox connection, or unconfigured provider as production-ready.

### Frontend prototype commands

- Install: `pnpm install --frozen-lockfile`
- Run only the Tabbio frontend: `pnpm dev:tabbio`
- Build only the Tabbio frontend: `pnpm build:tabbio`
- Type-check only the Tabbio frontend: `pnpm typecheck:tabbio`
- Direct tests: `pnpm --filter @tabbio/partners test:run`

Do not run the unfiltered root `pnpm dev` for this prototype. It starts RefRef services that require authentication, secrets, and database infrastructure.

## 3. Non-negotiable product rules

- Partners are Tabbio users who earn. The partner experience lives inside the main Tabbio application and shares its identity system.
- The public acquisition route is `/partners`. The authenticated partner workspace uses the route map in `PRD.md`.
- The supplied SVGs establish direction, not production components or trustworthy sample data.
- Material Design 3 defines component behavior and interaction logic. Material Web is a possible implementation source, not an automatic dependency or a replacement for current M3 guidance.
- Checklist Design verifies flow and state coverage. WCAG 2.2 AA and OWASP ASVS 5.0 remain independent release gates.
- One screen gets one obvious highest-emphasis action. Use specific verbs, visible field labels, inline errors, and durable confirmation for durable actions.
- Never use color alone for status, never put personal data in URLs, and never fabricate dashboard activity or financial values.
- Content generation may create drafts. It must not publish automatically.
- Payout creation and provider submission are explicit, auditable operations. They are never hidden side effects of viewing a page or changing a setting.
- Application, membership, compliance checks, and payout capability are independent state axes. Payout setup does not by itself gate Partner access or earning.
- Money records are immutable ledger entries. Corrections use compensating entries, not destructive edits. A paid entry stays paid; a post-payout correction creates a linked negative recovery entry and never triggers an automatic bank debit.

## 4. System ownership

The main Tabbio application owns:

- authentication, sessions, user identity, organizations, and account lifecycle;
- CVs, content, customer subscriptions, invoices, refunds, and chargebacks as business facts;
- the primary application shell, navigation, localization, and shared design primitives.

The affiliate domain owns:

- partner applications, independent program membership, compliance, and payout-capability states;
- referral codes and links;
- privacy-aware click and attribution evidence;
- commission rules and version history;
- immutable commission ledger entries and their lifecycle;
- payout batches, payout attempts, reconciliation, and failure states;
- fraud signals, manual review, support evidence, notifications, and audit events.

Provider adapters own transport only. They must not become the source of truth for Tabbio policy.

Every tenant-owned read and write must be scoped by the authenticated tenant or organization on the server. Never trust a caller-supplied `programId`, `productId`, `partnerId`, or organization identifier without verifying membership and permission.

## 5. RefRef reuse and license rules

RefRef is an alpha reference, not a drop-in production backend. Its repository is AGPL-3.0 and its affiliate template is marked coming soon.

Before copying or modifying RefRef code:

1. Record the approved license path and responsible owner.
2. Pin the source to commit `81af934fec3b20990a4d9af7ed472d0d14d73a82`; do not build against a floating branch.
3. Preserve required copyright, license, notice, modification, and source-availability obligations.
4. Keep a provenance record mapping each reused file or concept to the pinned source.
5. Re-run dependency, secret, and license scans in the implementation repository.

Candidates for selective reuse after approval:

- program, participant, referral-code, referral-link, event, and reward-rule concepts;
- track API request validation and API-key concepts;
- fixed and percentage reward calculation concepts;
- redirect lookup and rate-limiting patterns;
- attribution URL capture and cookie concepts, redesigned for consent and privacy;
- accessible headless UI patterns that fit Tabbio's existing component system.

Rebuild or materially harden:

- tenant isolation and role authorization;
- partner onboarding and the partner portal;
- click, conversion, and recurring subscription attribution;
- idempotent billing-event ingestion and durable queue processing;
- the immutable commission ledger and all refund, chargeback, cap, threshold, and currency behavior;
- payout, KYC, tax, reconciliation, and failure recovery;
- fraud review, notifications, webhooks, audit logs, and production deployment.

Do not copy RefRef's plaintext secret handling, personal-data redirect parameters, globally scoped referral lookup, caller-trusted identifiers, hard-coded currency, fire-and-forget reward processing, development database workflow, or incomplete role checks.

## 6. Material Web reuse rules

Material Web is Apache-2.0, but its README and roadmap mark it maintenance mode with no planned new components. Use the pinned `v2.5.0` release, not a floating branch. Preserve applicable license, copyright, notice, and modification provenance.

Before adding `@material/web` or porting code, test it inside the real Tabbio stack for framework events and typing, forms/autofill, SSR or hydration where applicable, individual-import bundle cost, theming, browser support, keyboard/focus, screen readers, zoom, touch, high contrast, Arabic/RTL, test tooling, and removal cost. Record an ADR selecting adopt, wrap, port, or reject.

Stable candidates include buttons, icon buttons, checkboxes, radios, switches, text fields, selects, sliders, dialogs, menus, lists, tabs, chips, progress, and focus-ring behavior. Wrap adopted controls behind Tabbio components. Import individual modules, map styles through Tabbio semantic tokens, and retain visual/accessibility regression tests.

Treat `labs/*` as reference-only and never ship it as a production runtime dependency. Build missing navigation, tables, charts, search, snackbar, tooltip, date/time picker, autocomplete, segmented controls, earnings displays, estimator, and product compositions with established Tabbio primitives and the contracts in `DESIGN.md`.

Do not import `@material/web/all.js` in production, switch Tabbio to Roboto from an upstream example, expose raw Material tokens as business semantics, or assume a recent release cancels the published maintenance-mode warning.

## 7. Implementation workflow

For each delivery slice:

1. Inspect the target repository's root instructions, package scripts, Git status, shared components, authentication model, tenancy model, billing facts, and existing migrations.
2. Map the slice to requirement IDs and acceptance criteria in `PRD.md`.
3. Write or update an architecture decision record when a decision changes a documented boundary.
4. Implement the narrowest complete vertical slice, including server authorization, persistence, UI states, telemetry, and tests.
5. Add forward and rollback-safe migrations. Production must use reviewed migrations, never an implicit schema push.
6. Verify the normal path and every relevant loading, empty, validation, error, offline, permission, suspended, and retry state.
7. Record what was verified locally, in sandbox, and in production as three separate claims.

Prefer reversible, incremental changes. Preserve unrelated user edits and existing application conventions.

## 8. Backend engineering rules

- Use the target repository's language and framework. If it is TypeScript, keep strict typing and validate untrusted boundaries with the established schema library.
- Represent money with integer minor units plus ISO 4217 currency. Never use binary floating-point arithmetic for commissions or payouts.
- Apply the approved rounding rule once at the ledger boundary and test half-unit cases explicitly.
- Store timestamps in UTC and render them in the user's locale.
- Use opaque identifiers. Do not derive IDs from emails, names, or other personal data.
- Require unique event IDs and idempotency keys for billing events, conversions, reversals, and payout requests.
- Process financial side effects through a durable queue or transactional outbox. A request must not report success while essential work is only an unobserved background promise.
- Use database transactions and constraints to enforce uniqueness and legal state transitions.
- Append financial adjustments. A paid entry remains paid; create a linked negative recovery entry for later refunds/chargebacks and follow the approved offset, collection-review, or write-off path. Never hard-delete commissions, payouts, or audit evidence.
- Implement attribution precedence only from the ordered PRD matrix: locked attribution, then accepted claim, explicit confirmed code, and eligible tracked click, with audited correction outside the normal tiers.
- Encrypt provider credentials and sensitive payout data with managed secrets or keys. Never return secrets after creation or write them to logs.
- Verify webhook signatures, reject stale deliveries, and make retries safe.
- Centralize authorization checks and test tenant isolation at the data-access boundary.
- Redact or hash tracking data according to the approved privacy policy and retention schedule.

## 9. Frontend engineering rules

- Reuse Tabbio's existing components and tokens before adding dependencies. Do not install Material UI solely because M3 is the behavior reference. Use approved Material Web wrappers only after the Section 6 gate.
- Use the shell-aware adaptive navigation pattern in `DESIGN.md`. The canonical shell owns one persistent bar or rail; Partner-local navigation nests there when supported or uses one content-level section control. Never create competing bars or rails.
- Preserve the attachment's direct, friendly direction: violet-led brand, dark hero, restrained violet-to-pink accent, Inter for English, and Cairo for Arabic.
- Use semantic HTML for tables. M3 has no authoritative data-table component, so table behavior follows `DESIGN.md`, WCAG, and Checklist Design.
- A visual status must always include text. A chart must have a textual equivalent.
- Fields keep visible labels after entry. Errors identify the field, cause, and recovery action.
- Every data surface needs coherent loading, empty, no-results, partial-data, error, retry, and permission states.
- Tables, cards, and charts on one screen must derive from the same source and time window. Never repeat the contradictory sample values from the exports.
- Use skeletons only when the layout is known. Use determinate progress for measurable work and concise status text for longer uncertain work.
- Destructive or financially material actions require explicit confirmation and a durable result state.
- Respect reduced motion. Motion must explain hierarchy, continuity, or feedback and must not delay work.
- English copy is direct and human. Avoid jargon, exaggerated promises, and em dashes. Arabic layouts must be intentionally mirrored and tested, not merely translated.

## 10. Required test coverage

Discover and use the target repository's actual commands. Do not invent package scripts in documentation or CI.

At minimum, cover:

- unit tests for attribution precedence, cookie expiry, commission versions, rounding, caps, thresholds, refunds, chargebacks, and state transitions;
- property or table-driven tests for money calculations and legal ledger transitions;
- integration tests for tenant isolation, RBAC, duplicate webhook delivery, transaction rollback, outbox delivery, and provider retry behavior;
- contract tests for billing, payout, email, analytics, and tracking adapters;
- end-to-end tests for application, approval, link creation, attribution, recurring earning, reversal, payout setup, payout failure recovery, and suspension;
- accessibility tests plus keyboard, focus, zoom, contrast, screen-reader, reduced-motion, and RTL manual checks;
- responsive checks at compact, medium, expanded, large, and extra-large layouts;
- security tests for broken object authorization, cross-tenant access, replay, rate limits, secret exposure, injection, and dependency vulnerabilities;
- migration tests against a production-like database, including rollback or forward-fix procedures;
- reconciliation tests proving ledger totals, dashboard totals, payout totals, and exported totals agree.

Tests that only use mocks do not prove the database schema, migrations, queue, provider contracts, or production deployment.

## 11. Security, privacy, and operational controls

- Apply least privilege to Partner, Finance, Support/Operations, Compliance, Program Admin, and Security Auditor roles. Multi-user partner teams are outside Version 1.
- Require step-up authentication for payout destination changes and other high-risk actions.
- Notify the account through an independent channel after sensitive financial changes.
- Keep an append-only audit trail for policy changes, manual attribution, commission adjustments, account state changes, payout actions, and administrative access.
- Add rate limits and abuse controls to public redirects, application forms, claim flows, and tracking endpoints.
- Do not activate cross-site tracking, advertising pixels, or non-essential cookies before the approved consent behavior is implemented.
- Treat dependency audit findings as release blockers according to the severity policy in `PRD.md`; document any exception with an owner and expiry.
- Provide runbooks for webhook failure, queue backlog, provider outage, reconciliation mismatch, compromised referral link, suspected fraud, and payout reversal.

## 12. External-action boundary

The following require explicit configuration, appropriate credentials, a validated environment, and user authorization:

- publishing generated content;
- sending production email or notifications;
- changing a live user's partner, commission, or payout state;
- submitting or releasing real payouts;
- modifying production billing or attribution records;
- enabling production tracking, analytics, or advertising integrations;
- deploying, migrating, or exposing a production service.

When an adapter is unavailable, retain a truthful pending or configuration-required state. Never simulate completion in a production-facing UI.

## 13. Definition of done for each slice

A slice is done only when:

- its PRD requirement IDs and acceptance criteria are satisfied;
- server authorization and tenant isolation are enforced and tested;
- its database constraints, migration, idempotency, audit, and retry behavior are complete;
- normal and exceptional UI states are implemented responsively and accessibly;
- metrics and financial totals reconcile to one canonical source;
- privacy, security, telemetry, and operational handling are included;
- focused tests and the repository's broader required checks pass;
- documentation describes the implemented behavior and any remaining production activation step;
- the handoff states exactly what was verified locally, in sandbox, and in production.

Passing a build alone is not completion. A partner program is ready only when its money, permissions, attribution evidence, recovery paths, and user-facing states remain correct under retries and failure.
