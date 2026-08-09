# Partner Frontend to Backend Handoff

Status: frontend contract; backend intentionally disconnected

## Truth boundary

The current frontend is for local UX testing. It uses deterministic fixtures and browser-local persistence. It does not prove authentication, server persistence, attribution, billing, commission, compliance, notifications, AI generation, or payouts.

Do not remove the visible demo boundary until the corresponding production capability passes its acceptance gate.

## Surface contracts

| Frontend surface   | Required production contract                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Public application | Create one idempotent application, store the accepted policy versions, return a resumable status, and prevent duplicate submissions |
| Onboarding         | Read real lifecycle states; store scoped profile data and server-side acknowledgements; never infer approval                        |
| Overview           | Read period-defined metrics from reconciled read models; every amount links to ledger evidence                                      |
| CV Builder         | Reference canonical Tabbio CV permissions; affiliate service stores IDs and handoff evidence, not CV content                        |
| Content Builder    | Save drafts with versioned disclosure; no automatic publishing or unapproved claims                                                 |
| Links              | Create allowlisted destinations and opaque codes; redirect safely; record privacy-approved click evidence                           |
| Earnings           | Read immutable ledger entries and payout allocations; exports match the displayed filters and definitions                           |
| Resources          | Return only approved, current, assigned assets; withdraw expired or suspended credentials                                           |
| Settings           | Persist preferences; hand sensitive identity, security, payout, and tax changes to step-up protected canonical flows                |
| Policies           | Serve approved immutable versions and record exact acceptance evidence                                                              |

## State model

Keep these independent:

- application: draft, submitted, reviewing, changes requested, approved, rejected, withdrawn;
- membership: inactive, active, suspended, terminated;
- promotion eligibility: pending, eligible, restricted, expired;
- payout capability: not started, pending, enabled, restricted, failed;
- commission entry: pending, held, payable, scheduled, paid, reversed, recovery;
- credential: unavailable, active, expired, withdrawn.

A payout restriction must not erase earnings or silently suspend membership. A permit requirement must not be applied to partners whose activity is outside its scope.

## API and event rules

- Every mutation receives an idempotency key and actor context.
- Every object is scoped by organization, product, program, and partner membership as applicable.
- Billing and payout webhooks require signature verification, replay protection, schema versioning, and durable deduplication.
- Financial changes create linked entries; they never overwrite historical money.
- API responses return machine states plus plain-language reason and recovery fields.
- Logs exclude secrets, documents, bank/tax data, CV content, and raw personal attribution data.

## Frontend release sequence

1. Keep fixtures and `Demo mode` while implementing provider-independent contracts.
2. Connect authentication and application status behind a development flag.
3. Connect links and attribution in sandbox with deterministic test accounts.
4. Connect billing-to-ledger and refund/reversal vertical slices.
5. Connect read-only payout setup and Finance sandbox operations.
6. Run controlled end-to-end pilot evidence.
7. Remove demo labels only per capability after production acceptance—not globally.
