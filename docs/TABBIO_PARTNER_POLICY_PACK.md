# Tabbio Partner Policy Pack

Status: product-complete draft for review  
Version: 2026-08-10  
Business context: Tabbio is a UAE-based business. Partner eligibility may extend worldwide, subject to local law, program approval, and payout-provider coverage.

## Purpose

This pack is the policy contract for the frontend prototype and the future affiliate service. It prevents commercial, legal, privacy, financial, and operational rules from being invented independently in UI copy or backend code.

It is not yet an executed legal agreement. Production release requires approved Tabbio entity details, contacts, effective dates, governing-law language, provider terms, tax treatment, retention periods, translations, and counsel sign-off.

## Document set

| Document                                 | Job                                                                                                      | Production acceptance                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Partner Program Agreement                | Defines eligibility, the independent relationship, responsibilities, suspension, and termination         | Required                                |
| Commission and Attribution Schedule      | Defines eligible revenue, the proposed 30% rate, attribution, holds, reversals, and payout rules         | Required                                |
| Promotion and Disclosure Policy          | Defines disclosures, claims, prohibited promotion, platforms, and territorial responsibility             | Required                                |
| Agency and Team Addendum                 | Defines the agency counterparty, staff access, team links, client-fee separation, and commission roll-up | Required for agencies                   |
| Brand and Partner Credential Licence     | Defines permitted assets, placement, assigned edition, expiry, and withdrawal                            | Required before asset access            |
| Partner Privacy and Tracking Notice      | Defines data purposes, tracking transparency, retention, sharing, and rights                             | Required notice and applicable consent  |
| Payout, Identity, Tax, and Permit Policy | Defines independent compliance states and payout onboarding                                              | Acknowledgement where applicable        |
| Program Integrity and Appeals Procedure  | Defines holds, evidence, decisions, corrections, and appeals                                             | Notice; acceptance if Legal requires it |

The frontend source of truth is `apps/tabbio-partners/src/data/program-policy.ts`. Public reading routes begin at `/partners/policies`.

## UAE operating rule

- Tabbio's business and governance context is the UAE.
- The UAE Advertiser Permit is conditional on the promoter and activity; it is not a worldwide checkbox.
- UAE citizens, residents, visitors, agencies, exemptions, registered accounts, expiry, and evidence require a Legal-owned decision tree based on current official guidance.
- Partners outside the UAE follow the rules that apply where they operate and where their audience is located.
- The UI must never show `Verified` until an authorized process has actually reviewed the relevant evidence.

## Version and acceptance contract

Production acceptance must be server-side and append-only. Store:

- document ID and immutable version;
- content hash and locale;
- actor and partner or agency membership;
- acceptance time and source;
- applicable program and territory context;
- later withdrawal, replacement, or re-acceptance evidence.

A browser checkbox or `localStorage` value is demonstration state only.

## Publication gate

Before these documents become binding:

1. Legal approves agreement, territory, UAE permit, disclosure, termination, and appeal language.
2. Finance approves eligible revenue, rounding, holds, threshold, cutoff, currency, fees, reversals, and recovery.
3. Privacy approves tracking classification, lawful basis or consent, retention, rights, subprocessors, and international transfers.
4. Tax and payout owners approve KYC, sanctions, tax, supported countries, and provider terms.
5. Tabbio inserts verified legal entity, address, legal, privacy, accessibility, and support contacts.
6. English and Arabic production versions receive qualified human review.
7. Backend acceptance, audit, notification, and policy-withdrawal behavior passes the launch tests.
