# RefRef Production Gap Register

Status: engineering handoff  
Audited upstream baseline: `amicalhq/refref` commit `81af934fec3b20990a4d9af7ed472d0d14d73a82`  
Scope: Tabbio Partner production readiness

## Decision

RefRef is an AGPL-3.0 alpha referral-engine baseline. It is not the complete Tabbio affiliate backend and must not define Tabbio policy, money, tenancy, privacy, or visual identity by default.

No backend is connected to the current `apps/tabbio-partners` frontend. This register defines the missing production work without pretending it exists.

## Reusable foundation

- Organizations, products, programs, participants, referral codes, and links.
- Signup and purchase event routes.
- Event-linked fixed and percentage reward calculation.
- Basic duplicate-reward prevention.
- Manual approval and status UI.
- API-key, Better Auth, PostgreSQL, migration, and test foundations.

Every reused part still requires license, tenant-scope, authorization, migration, privacy, and failure-path verification.

## P0 gaps before real attribution or money

| Gap                          | Required Tabbio result                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| License and service boundary | Written AGPL/commercial-license decision and corresponding-source process or approved clean-room boundary              |
| Tenant isolation             | Product and organization scoping on every read/write plus cross-tenant negative tests                                  |
| Partner lifecycle            | Application, membership, promotion eligibility, compliance, and payout capability as independent state machines        |
| Agreement evidence           | Immutable document version, hash, locale, actor, time, and re-acceptance records                                       |
| Billing intake               | Signed, replay-protected, idempotent Tabbio billing and refund webhook adapter                                         |
| Attribution                  | Deterministic precedence, expiry, lock, correction, and conflict history                                               |
| Financial ledger             | Immutable accrual, hold, release, reversal, recovery, adjustment, and paid allocations                                 |
| Refunds and disputes         | Full and partial refunds, credits, chargebacks, proration, and post-payout recovery                                    |
| Currency and rounding        | Source currency, eligible base, decimal arithmetic, rule version, FX policy, and reconciliation                        |
| Fraud operations             | Cases, evidence, holds, review permissions, decisions, notices, and appeals                                            |
| Payouts                      | Provider onboarding, payout account, batches, maker/checker approval, submission, retries, returns, and reconciliation |
| Audit                        | Append-only security, agreement, attribution, money, compliance, and administrator action history                      |

## P1 launch and operations gaps

- Staff queues for applications, compliance, attribution disputes, fraud, support, and Finance.
- Role and step-up controls for payout destination, tax details, commission rules, adjustments, and batch submission.
- Complete API contract and provider contract tests.
- Queue, retry, dead-letter, replay, and emergency pause controls.
- Observability, alerting, backup, restore, incident, rollback, and data-export procedures.
- Data inventory, retention, deletion/anonymization, legal hold, and subject-right workflows.
- Notification delivery with versioned templates and delivery evidence.
- Arabic/RTL, accessibility, performance, and security release evidence.

## Known upstream integrity concerns

- The Stripe guide describes features not proven by corresponding integration code.
- Fraud-prevention documentation is `TBD`.
- “Disbursed” is currently a mutable reward status, not evidence of a provider transfer.
- Reward creation hardcodes USD.
- Reward status accepts free-form strings.
- Refund, chargeback, reversal, payout batch, payout account, agreement acceptance, and audit-log models are absent.
- Some referral lookup logic requires stricter product/program scoping.
- The OpenAPI file does not describe the full implemented route surface.

These are implementation findings, not accusations about upstream intent. Tabbio must validate the exact selected source before each production merge.
