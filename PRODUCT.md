# Product

<!-- impeccable:product-schema 1 -->

> Status: Frontend prototype implementation started on 2026-08-09 in the user's GitHub fork of RefRef. The prototype is intentionally browser-local: no authentication, server, database, live attribution, AI API, payout provider, or external messaging is connected. Commercial, legal, provider, and production decisions remain open.

## Platform

web

## Users

- The primary user is an existing or new Tabbio user who also earns as a partner. The initial lanes are career writers/coaches, creators, and agencies. Candidate sourcing and client-CV work are workflows within those lanes, not separate products.
- Partner-program operators review applications, eligibility, attribution, claims, compliance, and support cases.
- Finance operators approve commission adjustments, payout batches, reversals, and reconciliation.
- Referred visitors and customers receive partner links or CV claim links and must be able to understand who shared them and what happens to their data.

## Product Purpose

Tabbio Partner lets people earn from useful Tabbio-related work they already do: create or share client CVs, teach through content, recommend Tabbio, and help a candidate or client claim a useful result. A partner should be able to join, satisfy the program checks, share a trackable link, understand every attribution and commission state, and receive a reconciled payout. Tabbio staff must be able to explain and audit the same journey from source event to payout.

## Positioning

Partners are Tabbio users who earn, not users of a disconnected affiliate microsystem. The partner experience belongs inside the main Tabbio account and connects referral infrastructure to Tabbio-native work such as CV creation, client handoff, content drafting, and claim links. RefRef supplies reusable referral-engine primitives, while Material Web may supply selectively reusable M3 component code or patterns. Neither source defines the Tabbio product model or visual identity.

## Operating Context

- A public `/partners` page explains the program and begins application or sign-in.
- The authenticated Partner area uses the existing Tabbio identity, account shell, and billing/customer records.
- Partners commonly copy links, download QR codes, draft promotional content, send client work, check attribution, and reconcile earnings across desktop and mobile.
- Program operations depend on subscription billing events, refund and dispute events, agreement versions, jurisdiction-specific checks, a payout provider, support decisions, and immutable financial records.
- English and Arabic are expected contexts. The designer export names Inter for English and Cairo for Arabic; implementation must confirm that the canonical font files and licenses are available.

## Capabilities and Constraints

### Product commitments evidenced by the supplied material

- The proposed offer is 30% recurring commission for the attributed customer's eligible lifetime, monthly payouts, and a USD 50 minimum payout threshold shown in the design as approximately AED 185.
- The Partner area includes Overview, Client CVs/CV Builder, Content Builder, Links, Earnings, Resources, and Settings.
- The public experience includes an earnings estimator, the joining steps, Tabbio-native earning workflows, resources, FAQ, and a direct join action.
- Material 3 is the authority for component logic, interaction, state, adaptive layout, and accessibility. It is not a requirement to install a second UI framework.
- Material Web `v2.5.0` is an Apache-2.0 implementation reference, not a blanket dependency decision. Its stable controls, tokens, docs, and tests may be reused only if they fit the canonical Tabbio stack; missing product components and all Tabbio-specific compositions remain Tabbio-owned.
- Checklist Design is a completeness and QA authority, not a visual style to copy.
- The supplied SVG files are visual evidence only. Their text is outlined and their controls are not semantic or reusable.
- RefRef is an AGPL-3.0 alpha baseline. For this local prototype the user selected a real public fork and the repository keeps the upstream AGPL license and history. Network deployment still requires an AGPL obligations review and corresponding-source process.

### Open product decisions

- The actual Tabbio repository, runtime, auth model, billing source, deployment environment, and existing design-system components have not been supplied in this workspace.
- Engineering must choose whether Material Web is adopted directly, wrapped behind Tabbio components, used only as a porting reference, or rejected after a compatibility and accessibility spike. Its maintenance-mode status prevents assuming future roadmap coverage.
- Finance must approve eligible revenue, discounts, tax, fees, proration, rounding, hold duration, payout day, FX handling, termination, and forfeiture rules.
- Legal/compliance must approve program terms, disclosures, privacy/consent, territory eligibility, advertiser-permit handling, document retention, and the RefRef license approach.
- Stripe Connect is a candidate payout provider, not a configured or approved production dependency. Payouts remain manual or disabled until provider onboarding, sandbox reconciliation, and explicit production approval are complete.
- The attribution precedence and window require product approval. The recommended starting policy is accepted signed claim, then explicit confirmed code, then last eligible partner click within 90 days, with attribution locked when the customer relationship is accepted and changed only by audited manual correction.

### Current implementation slice

- The selected repository is the public fork `ahmedaldhraif/refref`, based on upstream commit `81af934fec3b20990a4d9af7ed472d0d14d73a82`.
- The frontend lives in `apps/tabbio-partners` as an isolated Next.js application inside the RefRef monorepo.
- It reuses real `@refref/ui` primitives while keeping RefRef authentication, tRPC, database, tracking, and worker code outside the app boundary.
- Every metric, client, commission, check, and provider state is deterministic example data or a browser-local change stored in `localStorage`.
- The frontend is suitable for local UX testing only. It does not prove any production backend, legal, financial, privacy, security, or deployment requirement.

## Brand Commitments

- Keep the Tabbio name, violet identity, direct human language, generous whitespace, and restrained in-product surfaces shown in the attachments.
- Public surfaces may use the supplied blue/violet texture and violet-to-pink earning gradient. Operating surfaces use color mainly for action, status, and the single earnings focal point.
- Do not fabricate partner names, customer counts, earnings, testimonials, approval speed, or payout guarantees. Demonstration data must be visibly labelled as example data.
- Commission estimates must be labelled as estimates and explain the assumptions that produced them.
- Use familiar financial language. A partner should never need to infer the difference between pending, held, payable, scheduled, paid, reversed, and disputed.

## Evidence on Hand

- `C:/Users/DESKTOP PC/Downloads/Become a partner.svg` is a 1512 by 6609 public landing-page export. SHA-256: `EFDD1ECAFDD77A2E7E7173109BF859C40D2BA39FF4618822F195616B454649F5`.
- `C:/Users/DESKTOP PC/Downloads/Tabbio - Karim Fakhry File (1).zip` contains seven 1512 by 982 partner-area SVG exports. SHA-256: `1C438FFC341A0573C8B45C2B26C3B2D101F3830BCB2CBC68263F6650DD090DC5`.
- The current audited RefRef baseline is upstream commit `81af934fec3b20990a4d9af7ed472d0d14d73a82` from 2026-03-20.
- The current audited Material Web release is `v2.5.0`, commit `b4de401eb665ec63474f39319a4ba8f2145974cc`, released in July 2026 under Apache-2.0. Its README and roadmap still label the project maintenance mode with no planned new components.
- No verified testimonials, production analytics, customer examples, signed program terms, provider credentials, source Figma file, canonical font files, or live backend are present in this workspace.

## Product Principles

1. Partners are users who earn. Keep one identity, one product, and one obvious Partner entry point.
2. Money must be explainable. Every displayed amount traces to an immutable source event, effective rule version, calculation, state transition, and payout record.
3. Useful work comes before promotion. Help partners create, teach, share, and hand off real Tabbio value instead of pushing generic affiliate spam.
4. Automate calculation and evidence capture, not unapproved legal, financial, publishing, or payout decisions.
5. Show the real state. Pending checks, missing providers, held commissions, failed payouts, and unavailable data must never appear complete.

## Accessibility & Inclusion

- Target WCAG 2.2 AA for the public page and every authenticated workflow.
- All functionality must work with keyboard, screen reader, zoom, high contrast, reduced motion, and touch input.
- Charts and color-coded states require text equivalents. Sliders require labelled numeric inputs. Data tables require semantic headers and a complete compact-screen alternative.
- Layout and components must be ready for Arabic and RTL. Translation quality and legal copy require human review before Arabic is released.
