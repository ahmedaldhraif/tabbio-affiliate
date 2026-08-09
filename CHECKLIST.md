# Tabbio Partner Frontend Acceptance Checklist

This checklist converts the current frontend-only scope into a verifiable release gate. It complements Checklist Design, Material 3, WCAG 2.2 AA, `PRD.md`, and `DESIGN.md`. A checked item means it was exercised in this local repository; it does not prove a production backend or provider.

## Scope truth

- [x] Every partner route keeps the persistent `Demo data · Local simulation` disclosure.
- [x] No screen implies live authentication, attribution, AI generation, publishing, verification, payout setup, or money movement.
- [x] Mutable demo records persist only in `localStorage` and can be reset.
- [x] One deterministic fixture supplies the shared 30-day totals and reconciled earnings.
- [x] The root `LICENSE`, upstream history, and RefRef provenance remain present.

## Public experience

- [x] Header, hero, concise offer, estimate disclaimer, joining steps, CV proof, earning paths, toolkit, FAQ, final CTA, and oversized wordmark footer are present.
- [x] Estimator uses paired range and number controls with programmatically associated labels.
- [x] Default estimator result is USD 2,698.20 and final-month run rate is USD 215.86.
- [x] FAQ supports keyboard interaction and multiple expanded answers.
- [x] Public calls to action open the local onboarding or partner demo; no dead primary action remains.
- [x] Terms and safe referral-preview routes render locally.
- [x] The estimator appears once; the second proof surface is a visual cohort-stack chart rather than duplicated controls.
- [x] Visible landing copy is short, plain-language, and paired with a visual or direct action.

## Landing SEO and discoverability

- [x] `/partners` is the single canonical landing route and `/` redirects to it.
- [x] Title, description, H1, and first paragraph state the partner-program intent without keyword stuffing.
- [x] Semantic landmarks and sequential headings expose the same story shown visually.
- [x] FAQ JSON-LD matches the six visible questions and answers.
- [x] Organization, WebSite, and WebPage JSON-LD identify the page and Tabbio entity.
- [x] `robots.txt` allows public partner content and excludes the future private partner area and referral previews.
- [x] `sitemap.xml` includes only the public partner landing and program terms.
- [x] `llms.txt` gives agents a concise, factual program summary and public links.

## Partner shell

- [x] Expanded layouts show one 240px rail and one main content surface.
- [x] Compact layouts show one bottom navigation with Overview, Create, Links, Earnings, and More.
- [x] Active navigation uses icon, label, and tonal surface, not color alone.
- [x] Skip link, navigation landmark, main landmark, page H1, focus visibility, and logical focus order are present.
- [x] The shell supports the development RTL state without mirroring brand marks or numeric data.

## Routes and work

- [x] Onboarding validates, advances, saves locally, resumes, and explains every simulated check.
- [x] Overview reconciles payable balance, metrics, chart summary/data alternative, activity, currency, period, and timezone.
- [x] Clients supports search, filters, create, detail, status text, complete compact cards, and local persistence.
- [x] Create supports format/options, deterministic local draft, editing, disclosure, save/history, copy, download, and reset.
- [x] Links supports a local-origin URL, matching QR, copy/download, create/archive, scoped metrics, and local persistence.
- [x] Earnings explains every balance, labels its recent ledger as an incomplete sample, shows negative reversals, and offers truthful demo payout and balance-summary details.
- [x] Resources exposes real local files, version/type/size labels, approved copy actions, disclosure, and unique rules.
- [x] Settings saves profile/notification choices locally, previews the public identity, and labels checks `Not configured`, `Demo only`, or `Not connected`.

## States and feedback

- [x] Relevant routes demonstrate loading, empty, no-results, error/retry, overflow, and success states.
- [x] Controls expose disabled, focus, selected, validation-error, and success states where applicable.
- [x] Copy, save, create, archive, reset, and download actions provide immediate visible feedback.
- [x] Dialogs have labelled titles/descriptions, Escape close behavior, focus containment, and focus return through RefRef/Radix primitives.
- [x] Destructive local actions explain the effect or remain easily recoverable through Reset demo.

## Responsive and accessible verification

- [x] No page-level horizontal overflow at 320, 375, 390, 600, 768, 839, 840, 1024, 1440, or 1600 CSS pixels.
- [x] Text and controls remain available at 200% text zoom and 400% reflow.
- [x] Touch targets are at least 44px and primary compact controls target 48px.
- [x] Color contrast, status text, form labels, field errors, headings, tables, and chart alternative meet the documented contract.
- [x] Reduced motion removes non-essential transitions without losing state feedback.
- [x] English LTR and prototype RTL remain usable.

## Repository quality gate

- [x] Frozen-lockfile install succeeds.
- [x] App format check succeeds.
- [x] App lint succeeds with zero warnings.
- [x] App type-check succeeds.
- [x] Estimator, metric, and reconciliation unit tests succeed.
- [x] Filtered production build succeeds.
- [x] Browser smoke covers public landing, onboarding, every partner destination, referral preview, local mutations, refresh, Back/Forward, console, and broken assets.
- [ ] Re-capture the revised public landing at 1512px and 390px after local browser automation is available; the current browser security policy blocked automated localhost capture.

## Local verification evidence

- Production export: 18 static pages.
- Unit tests: 6 of 6 passing.
- Responsive matrix: 110 route-width checks across 11 routes and 10 widths, with zero page-level overflow and an H1 on every route.
- Text zoom: 8 key routes at 200% root text size, with zero page-level overflow. The 320px checks cover the WCAG 400% reflow viewport equivalent.
- Automated accessibility: 10 key routes at 390px with zero axe violations. Gradient contrast remained a manual-review item and passed visual review.
- Persistence: corrupt payload, blocked storage, reset-race, and shared onboarding identity regressions passed.
- Interaction details: controlled mobile menu, exact 840px shell breakpoint, destination-aware referral preview, fractional estimator normalization, stale-draft invalidation, and 44px shared controls passed.
- Downloads: partner kit ZIP and manifest, QR image, recent-ledger sample CSV, and balance summary were opened or content-checked locally. Asset byte counts and SHA-256 values match the current bundled files.
- Designer-source implementation: the original geometric Tabbio mark path, blue-violet textured field, split calculator, section order, compact typography, neutral surfaces, CV claim visual, and oversized footer wordmark are implemented from the supplied SVG composition. The later user instruction removes the repeated calculator and shortens copy.
- Local lab only: landing and overview recorded approximately 48ms FCP/LCP and zero CLS. These are not field-performance or production-hosting claims.

## Deferred production evidence

The following cannot be checked by this frontend build: authentication/session security, RBAC and tenancy, database persistence/migrations, real redirects/cookies/consent, attribution and billing idempotency, immutable financial ledger, provider webhooks, KYC/tax/permit/legal approval, real payouts, email/analytics/AI/publishing integrations, production observability, backups, rollback, security testing, field performance, and deployment. Their gates remain in `PRD.md`.
