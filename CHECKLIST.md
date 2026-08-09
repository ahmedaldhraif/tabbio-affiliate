# Tabbio Partner Frontend Acceptance Checklist

This checklist converts the current frontend-only scope into a verifiable release gate. It complements Checklist Design, Material 3, WCAG 2.2 AA, `PRD.md`, and `DESIGN.md`. A checked item means it was exercised in this local repository; it does not prove a production backend or provider.

## Scope truth

- [x] Every partner route keeps the persistent `Demo data · Local simulation` disclosure.
- [x] No screen implies live authentication, attribution, AI generation, publishing, verification, payout setup, or money movement.
- [x] Mutable demo records persist only in `localStorage` and can be reset.
- [x] One deterministic fixture supplies the shared 30-day totals and reconciled earnings.
- [x] The root `LICENSE`, upstream history, and RefRef provenance remain present.

## Public experience

- [x] Header, direct product hero, three audience paths, one earnings calculator, actual Partner app preview, embedded application, review path, FAQ, and oversized wordmark footer are present.
- [x] Estimator is swipe-first from 1 to 1,000,000 customers, with a paired editable number field and accessible value text.
- [x] Default estimator uses four new Pro customers per month and shows a USD 431.86 month-12 estimate.
- [x] FAQ supports keyboard interaction and multiple expanded answers.
- [x] Public calls to action move directly to the application or demo Partner app; the local success state also provides a clear app entrance.
- [x] Terms and safe referral-preview routes render locally.
- [x] The estimator appears once in a dedicated earnings section, keeping the first decision moment focused on audience, offer, and action.
- [x] The public estimator asks for one value only and states the month-12 and 30% Pro basis once, on a restrained background that never competes with or covers the amount.
- [x] Visible landing copy is short, plain-language, and paired with a visual or direct action.
- [x] Each public section owns one idea; repeated program benefits and non-clickable arrow affordances are removed.
- [x] The application uses two progressive steps, visible labels, M3-style filled fields and radio surfaces, 48px targets, inline errors, first-error focus, lane-aware prompts, and a persistent success state.
- [x] UGC creators, career coaches, CV writers, recruiters or talent specialists, and agencies are explicit primary-lane choices.
- [x] Application drafts persist locally; the frontend-only limitation remains documented without adding prototype/debug language to the customer-facing invitation panel.
- [x] Hero and application visuals use distinct, mixed-ethnicity editorial illustrations with restrained print grain; no perfume, cosmetics, floating icon clouds, or glossy 3D motifs appear.
- [x] The post-application path uses three short tactile cards and explicitly mentions human review.
- [x] Product demonstrations identify sample data and do not invent partner testimonials, creator counts, or results.

## Landing SEO and discoverability

- [x] `/partners` is the single canonical landing route and `/` redirects to it.
- [x] Title, description, H1, and first paragraph state the partner-program intent without keyword stuffing.
- [x] Semantic landmarks and sequential headings expose the same story shown visually.
- [x] FAQ JSON-LD matches all visible questions and answers, including worldwide eligibility, UAE activity, agency teams, client fees, tools, attribution, payouts, and prohibited promotion.
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
- [x] CV Builder uses familiar Material 3 tabs, a compact search/status toolbar, semantic desktop and mobile client records, and a searchable CV Skills list with All, Tabbio, Community, Yours, instruction preview, and create-entry states.
- [x] Create supports format/options, deterministic local draft, editing, disclosure, save/history, copy, download, and reset.
- [x] Links supports a local-origin URL, matching QR, copy/download, create/archive, scoped metrics, and local persistence.
- [x] Earnings explains every balance, labels its recent ledger as an incomplete sample, shows negative reversals, and offers truthful demo payout and balance-summary details.
- [x] Resources exposes real local files, version/type/size labels, approved copy actions, disclosure, and unique rules.
- [x] Resources includes the Tabbio Partner credential system with universal, Creator, Career, and Agency editions; horizontal, compact, and social formats; approved light, dark, and violet applications; direct SVG/PNG downloads; and a complete prototype policy.
- [x] Credential policy separates active program participation from certification, employment, endorsement, disclosure, and payout status; annual renewal, production issuance, edition assignment, expiry enforcement, and public verification remain backend-dependent.
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

- Production export: 20 static pages.
- Unit tests: 11 of 11 passing, including UGC creator and career coach applications, optional-link validation, and legacy-draft migration.
- Responsive matrix: 110 route-width checks across 11 routes and 10 widths, with zero page-level overflow and an H1 on every route.
- Text zoom: 8 key routes at 200% root text size, with zero page-level overflow. The 320px checks cover the WCAG 400% reflow viewport equivalent.
- Automated accessibility: 10 key routes at 390px with zero axe violations. Gradient contrast remained a manual-review item and passed visual review.
- Persistence: corrupt payload, blocked storage, reset-race, and shared onboarding identity regressions passed.
- Interaction details: controlled mobile menu, exact 840px shell breakpoint, destination-aware referral preview, progressive 1-to-1M estimator slider without redundant endpoint labels, stale-draft invalidation, and 44px shared controls passed.
- Downloads: partner kit ZIP and manifest, QR image, recent-ledger sample CSV, and balance summary were opened or content-checked locally. Asset byte counts and SHA-256 values match the current bundled files.
- Designer-source implementation: the original geometric Tabbio mark, violet identity, blue and pink supporting colors, compact typography, neutral surfaces, CV language, app-store badges, social marks, and oversized footer wordmark remain. Audience cards use mixed-ethnicity editorial illustrations of the actual partner work, including an app/SaaS UGC recording. The paper-ribbon landscape appears once as a compact transition, while the earnings collage stays contained beside the result.
- Partnership conversion implementation: Higgsfield informed the page sequence and low-friction application pattern only. Tabbio colors, product previews, form language, proof standard, and M3 behavior remain original to this product.
- Local lab only: landing and overview recorded approximately 48ms FCP/LCP and zero CLS. These are not field-performance or production-hosting claims.

## Deferred production evidence

The following cannot be checked by this frontend build: authentication/session security, RBAC and tenancy, database persistence/migrations, real redirects/cookies/consent, attribution and billing idempotency, immutable financial ledger, provider webhooks, KYC/tax/permit/legal approval, real payouts, email/analytics/AI/publishing integrations, production observability, backups, rollback, security testing, field performance, and deployment. Their gates remain in `PRD.md`.
