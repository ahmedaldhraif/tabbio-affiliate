export const PROGRAM_POLICY_VERSION = "Draft 2026-08-10";

export const UAE_BUSINESS_CONTEXT =
  "Tabbio is a UAE-based business. Partner applications may come from eligible people and agencies worldwide, subject to local law, program review, and payout-provider coverage.";

export const PARTNER_DISCLOSURE =
  "I may earn a commission if you subscribe through this link.";

export type PolicySection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type ProgramDocument = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  appliesTo: string;
  acceptanceRequired: boolean;
  sections: readonly PolicySection[];
};

export const programDocuments: readonly ProgramDocument[] = [
  {
    slug: "partner-agreement",
    title: "Partner Program Agreement",
    shortTitle: "Partner agreement",
    summary:
      "The relationship between Tabbio and every approved individual or agency partner.",
    appliesTo: "Every applicant and approved partner",
    acceptanceRequired: true,
    sections: [
      {
        title: "Program status",
        paragraphs: [
          "This frontend presents a draft agreement for product and legal review. It does not activate membership, create an account, award commission, or replace a signed production agreement.",
          UAE_BUSINESS_CONTEXT,
        ],
      },
      {
        title: "Eligibility and approval",
        paragraphs: [
          "Applicants must provide accurate information, be legally able to contract, conduct lawful business, and satisfy any identity, sanctions, tax, platform, territory, and payout checks that apply to them.",
          "Application, program membership, promotion eligibility, and payout readiness are separate decisions. Approval in one state does not imply approval in another.",
        ],
      },
      {
        title: "Independent relationship",
        paragraphs: [
          "A partner is an independent individual or business—not a Tabbio employee, agent, franchisee, or legal representative. A partner cannot bind Tabbio or promise results on Tabbio's behalf.",
          "Tabbio is not a party to a partner's coaching, recruitment, CV-writing, content, consulting, or other client-service agreement. The partner controls and remains responsible for those services, fees, invoices, delivery, support, cancellations, and disputes.",
        ],
      },
      {
        title: "Suspension and termination",
        paragraphs: [
          "Tabbio may restrict promotion, hold reviewable commission, suspend access, or terminate participation for policy, fraud, security, legal, or brand risk. Production decisions must record the reason, evidence, authorized reviewer, effective time, and available appeal route.",
          "Paid history must remain visible. The production agreement must define the treatment of pending, held, payable, and recovery balances when participation ends.",
        ],
      },
    ],
  },
  {
    slug: "commercial-schedule",
    title: "Commission and Attribution Schedule",
    shortTitle: "Commission schedule",
    summary:
      "How eligible revenue, recurring commission, attribution, holds, and reversals are intended to work.",
    appliesTo: "Every commission-bearing referral",
    acceptanceRequired: true,
    sections: [
      {
        title: "Proposed commission",
        paragraphs: [
          "The proposed rate is 30% recurring commission on eligible net revenue from settled, attributed payments for paid Tabbio plans identified in the final schedule.",
          "A signup, free account, trial, invoice, or subscription-created event does not by itself create commission. “Lifetime” means future eligible payments while the attribution and applicable terms remain valid; it is not an income guarantee.",
        ],
      },
      {
        title: "Attribution",
        paragraphs: [
          "The recommended order is an accepted signed claim, then an explicitly confirmed partner code, then the last eligible partner click within 90 days. Attribution locks when the customer relationship is accepted and changes only through an audited correction.",
          "This order and window are product recommendations until approved and configured in the production system.",
        ],
      },
      {
        title: "Refunds and recovery",
        paragraphs: [
          "A refund, credit, chargeback, corrected event, or ineligible payment creates a linked reversal rather than silently editing financial history.",
          "If the related commission was already paid, the proposed default is a visible recovery balance applied against future payable commission. Tabbio would not automatically debit a partner's bank account without separate lawful authority.",
        ],
      },
      {
        title: "Payout proposal",
        paragraphs: [
          "The proposed cadence is monthly with a USD 50 base threshold. Scheduling requires payable commission, completed applicable checks, the current cutoff and threshold, and Finance approval.",
          "No payout provider is connected to this prototype. Payout day, supported countries, currency conversion, fees, tax handling, holds, returns, failures, and reconciliation remain production decisions.",
        ],
      },
    ],
  },
  {
    slug: "promotion-disclosure",
    title: "Promotion and Disclosure Policy",
    shortTitle: "Promotion policy",
    summary:
      "The practical rules for honest recommendations, disclosures, paid media, and platform conduct.",
    appliesTo: "Every public or private promotion",
    acceptanceRequired: true,
    sections: [
      {
        title: "Disclose the relationship",
        paragraphs: [
          "Partners must make their commission relationship easy to notice before or close to the recommendation and tracked link. The disclosure must suit the channel, language, audience, and applicable law.",
          `A concise starting point is: “${PARTNER_DISCLOSURE}” This wording is not automatic legal approval for every territory or platform.`,
        ],
      },
      {
        title: "Prohibited promotion",
        paragraphs: [
          "Partners must not mislead people, guarantee jobs or earnings, impersonate Tabbio, spam, use fake traffic, stuff cookies, force redirects, hide incentives, create duplicate identities, or interfere with another partner's valid attribution.",
        ],
        bullets: [
          "No self-referrals unless a written program exception explicitly permits them.",
          "No protected-brand search advertising, confusing domains, or social handles without written permission.",
          "No candidate, client, CV, email, or other personal data in referral URLs or QR codes.",
          "No altered pricing, product capability, hiring, income, endorsement, or certification claims.",
        ],
      },
      {
        title: "UAE and other territories",
        paragraphs: [
          "Because Tabbio is based in the UAE, its program governance and review begin from a UAE operating context. That does not make the UAE Advertiser Permit a worldwide requirement.",
          "A person promoting from within the UAE must follow the advertiser-permit route and any exemptions that apply to their activity and status. A partner outside the UAE remains responsible for the advertising, disclosure, consumer, platform, and tax rules applicable where they operate and where their audience is located.",
        ],
      },
    ],
  },
  {
    slug: "agency-team-addendum",
    title: "Agency and Team Addendum",
    shortTitle: "Agency addendum",
    summary:
      "How recruiter agencies, career-service teams, and their staff participate under one partner account.",
    appliesTo: "Agencies, talent teams, and multi-user partners",
    acceptanceRequired: true,
    sections: [
      {
        title: "Agency ownership",
        paragraphs: [
          "The approved agency is the program counterparty. Team members may receive scoped access or team-level links, but eligible commission rolls up to the agency partner account unless Tabbio expressly agrees otherwise.",
          "The agency controls staff access and remains responsible for staff conduct. Internal salary, bonus, contractor payment, or commission sharing stays between the agency and its team.",
        ],
      },
      {
        title: "Candidate and client work",
        paragraphs: [
          "An agency may screen or shortlist a candidate, create a Tabbio CV, and share a tracked partner or claim link. If an eligible attributed customer later pays for an eligible plan, the agency may earn the applicable commission in addition to its own client-service fees.",
          "Tabbio does not set, collect, guarantee, or resolve the agency's own recruitment, coaching, CV-writing, or consulting fees.",
        ],
      },
      {
        title: "Team changes",
        paragraphs: [
          "The production system must support least-privilege roles, prompt removal of departed staff, traceable link ownership, and agency-level audit history. RefRef does not natively provide a multi-level sub-affiliate payout chain, so no such chain is promised by this frontend.",
        ],
      },
    ],
  },
  {
    slug: "brand-credential",
    title: "Brand and Partner Credential Licence",
    shortTitle: "Brand and badge licence",
    summary:
      "When and how approved partners may use Tabbio assets and the Active Partner credential.",
    appliesTo: "Approved partners using Tabbio assets",
    acceptanceRequired: true,
    sections: [
      {
        title: "Approved use",
        paragraphs: [
          "Partners may use only current assets supplied through the official resource library. Logos, badges, screenshots, product names, pricing, and claims must remain unchanged and must follow the supplied clear-space, size, color, and placement guidance.",
          "The current-year Active Partner credential shows active program membership. It is not a professional certification, employment mark, agency appointment, endorsement of the partner's services, or promise of results.",
        ],
      },
      {
        title: "Placement and withdrawal",
        paragraphs: [
          "The credential may appear on websites, email signatures, proposals, presentations, media kits, portfolios, and suitable social posts. It must not become an avatar, account name, handle, app icon, part of another logo, or a substitute for the partner's own identity.",
          "Only the edition assigned to the partner may be used. Access ends when participation expires, is suspended, or terminates; annual files must be replaced when a new active-year kit is issued.",
        ],
      },
    ],
  },
  {
    slug: "privacy-tracking",
    title: "Partner Privacy and Tracking Notice",
    shortTitle: "Privacy and tracking",
    summary:
      "The intended data boundaries for applications, attribution, support, accounting, and partner tools.",
    appliesTo: "Applicants, partners, referred visitors, and customers",
    acceptanceRequired: true,
    sections: [
      {
        title: "Data purpose",
        paragraphs: [
          "A production program should collect only the data needed for application review, identity and compliance checks, referral attribution, fraud prevention, support, accounting, payment, security, and legal obligations.",
          "Referral links should use opaque identifiers. Candidate names, emails, CV content, payment data, identity documents, and other private information must not appear in URLs or ordinary logs.",
        ],
      },
      {
        title: "Tracking transparency",
        paragraphs: [
          "The production notice must explain the attribution technology, purpose, lawful basis or consent classification, first- or last-touch behavior, retention period, recipients, deletion effect, and how a person can exercise applicable rights.",
          "This prototype stores demo inputs in the current browser only. It does not set production attribution cookies or send application, identity, payment, or analytics data to a Tabbio backend.",
        ],
      },
      {
        title: "Retention and rights",
        paragraphs: [
          "Production retention must distinguish short-lived click evidence from financial, agreement, compliance, fraud, support, and audit records that may require longer lawful retention or legal holds.",
          "Tabbio must publish verified privacy contact details and a request process before collecting production partner data.",
        ],
      },
    ],
  },
  {
    slug: "payout-compliance",
    title: "Payout, Identity, Tax, and Permit Policy",
    shortTitle: "Payout and compliance",
    summary:
      "The checks that may affect promotion or payout without silently changing unrelated account states.",
    appliesTo: "Partners preparing to promote or receive payment",
    acceptanceRequired: false,
    sections: [
      {
        title: "Separate states",
        paragraphs: [
          "Identity, advertiser-permit evidence, sanctions screening, tax information, program membership, promotion eligibility, and payout capability are independent states. A missing payout account should block payout scheduling—not access, earning visibility, or historical records.",
          "Each production check needs an owner, evidence type, jurisdiction, review state, expiry where applicable, reason, and recovery action.",
        ],
      },
      {
        title: "UAE operating context",
        paragraphs: [
          "Tabbio is a UAE-based business. UAE promotion activity must follow the current UAE Media Council framework and the route applicable to the promoter. Partners outside the UAE are not automatically subject to the UAE resident permit route, but remain responsible for their local requirements.",
          "Tabbio must not display “verified” until the relevant evidence has actually been reviewed by an authorized process.",
        ],
      },
      {
        title: "Payout onboarding",
        paragraphs: [
          "A production payout provider may require identity, address, bank, ownership, tax, and sanctions information. Supported countries, currencies, fees, conversion, thresholds, returned payments, and dormant balances must be published before real payouts begin.",
          "No provider, bank account, tax collection, permit review, or payout submission is connected in this frontend prototype.",
        ],
      },
    ],
  },
  {
    slug: "fraud-appeals",
    title: "Program Integrity and Appeals Procedure",
    shortTitle: "Integrity and appeals",
    summary:
      "How suspicious activity, attribution disputes, holds, decisions, and appeals should be handled.",
    appliesTo: "Partners, reviewers, support, and finance operators",
    acceptanceRequired: false,
    sections: [
      {
        title: "Reviewable activity",
        paragraphs: [
          "Tabbio may review unusual traffic, duplicate identities, self-referrals, attribution manipulation, misleading promotion, incentive abuse, automated activity, high refund rates, disputed customer relationships, or attempts to take over payout access.",
          "A hold is not the same as rejection. Production UI must show the affected item, current state, reason category, review owner, permitted evidence, and next step without exposing security-sensitive detection methods.",
        ],
      },
      {
        title: "Decision and appeal",
        paragraphs: [
          "A production decision must preserve evidence and record the rule version, reviewer, time, reason, financial effect, notice, and appeal route. Corrections create linked history rather than deleting or overwriting prior records.",
          "Partners should be able to appeal attribution, held commission, suspension, termination, or data-handling decisions through a published support channel. Emergency security or legal action may occur first, but still requires an auditable follow-up.",
        ],
      },
    ],
  },
] as const;

export function getProgramDocument(slug: string) {
  return programDocuments.find((document) => document.slug === slug);
}
