import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@refref/ui/components/badge";
import { Button } from "@refref/ui/components/button";

import { BrandMark } from "@/components/brand-mark";

const sections = [
  {
    id: "status",
    title: "Status of this page",
    body: [
      "This is a local product prototype dated August 9, 2026. It is not a signed partner agreement, legal advice, an offer of employment, or evidence that the program is active in any territory.",
      "Program eligibility, eligible products and revenue, attribution, commission, holds, payout timing, tax, provider availability, termination, and data handling still require approval and production configuration.",
    ],
  },
  {
    id: "eligibility",
    title: "Worldwide eligibility and territory",
    body: [
      "The proposed program accepts applications from UGC creators, career coaches, CV writers, recruiters, talent teams, and agencies worldwide. Acceptance is not automatic and may depend on age, identity, lawful business activity, promotion quality, sanctions screening, local law, tax requirements, and payout-provider coverage.",
      "The UAE Advertiser Permit is not a worldwide requirement. Official UAE guidance applies to advertising activity carried out from within the UAE. Citizens and residents have one permit route, while visiting advertisers have a separate route through an accredited advertising or talent agency. Every partner remains responsible for rules that apply where they operate and where their audience is located.",
    ],
  },
  {
    id: "agencies",
    title: "Recruiters, agencies, and team links",
    body: [
      "A recruiter or agency may screen or shortlist a candidate, create the candidate's Tabbio CV, and send a tracked partner or claim link. If an eligible attributed candidate pays for an eligible subscription, the proposed commission belongs to the approved agency partner account.",
      "The planned agency model can issue team-level links that roll up to the agency. The agency remains the program counterparty, controls team access, and is responsible for staff conduct. Any internal commission split, salary, bonus, or contractor payment stays between the agency and its team. RefRef's current data model does not natively provide a multi-level sub-affiliate payout chain, so this requires dedicated production design and testing.",
    ],
  },
  {
    id: "client-relationship",
    title: "Your client relationship stays yours",
    body: [
      "Tabbio is not a party to the partner's coaching, recruitment, CV-writing, content, consulting, or other client-service agreement. The partner sets and manages its own scope, fees, invoices, delivery, support, cancellations, refunds, and client disputes.",
      "Tabbio partner commission is separate from those client fees and is calculated only from eligible Tabbio subscription revenue. A partner must not imply that Tabbio employs, certifies, endorses, or guarantees the partner or the partner's services unless Tabbio has given that permission in writing.",
    ],
  },
  {
    id: "commission",
    title: "Proposed commission model",
    body: [
      "The design proposes 30% recurring commission on eligible net revenue from settled, attributed payments for paid Tabbio plans named in the final program schedule. A signup, free account, trial, invoice, or subscription-created event alone would not create commission.",
      "Lifetime refers to future eligible payments while the attribution and applicable program terms remain valid. It does not promise income for any period or for a person's lifetime.",
    ],
  },
  {
    id: "attribution",
    title: "Recommended attribution order",
    body: [
      "The recommended Version 1 order is an accepted signed claim, then an explicitly confirmed partner code, then the last eligible partner click within 90 days. The relationship would lock when accepted, with an audited correction path for genuine conflicts.",
      "This ordering and window are recommended defaults, not an activated production rule.",
    ],
  },
  {
    id: "refunds",
    title: "Refunds, reversals, and recovery",
    body: [
      "A refund, chargeback, credit note, or corrected source event would create a linked reversal. Historical financial entries would not be silently edited.",
      "If a related commission was already paid, the proposed default is a visible negative recovery entry that offsets future payable commission. Tabbio would not automatically debit a partner's bank account.",
    ],
  },
  {
    id: "integrity",
    title: "Attribution integrity and prohibited conduct",
    body: [
      "Partners must not use self-referrals, fake or automated traffic, duplicate identities, cookie stuffing, forced redirects, misleading claims, spam, impersonation, undisclosed incentives, prohibited trademark bidding, or attempts to override another partner's valid attribution. Candidate or client personal data must never be placed in referral URLs.",
      "Tabbio may hold or reject a reward while investigating suspicious activity. A production decision must record the evidence, reason, reviewer, and appeal path. RefRef provides product-scoped referral codes, event-linked rewards, status handling, and idempotency concepts, but its fraud-prevention documentation is currently incomplete and cannot replace a Tabbio fraud policy or monitoring system.",
    ],
  },
  {
    id: "payouts",
    title: "Payout proposal",
    body: [
      "The proposed cadence is monthly with a USD 50 minimum threshold. A payout could be scheduled only after commission is payable, required checks are complete, the threshold and cutoff rules pass, and Finance approves the batch.",
      "No payout provider is configured in this prototype. Provider feasibility, currency conversion, fees, tax handling, payout day, holds, failures, and reconciliation require approval.",
    ],
  },
  {
    id: "membership",
    title: "Leaving, suspension, and removal",
    body: [
      "Application status, program membership, promotion eligibility, and payout readiness are separate states. A payout restriction should block scheduling, not hide already accrued amounts or silently suspend membership.",
      "Paid history remains visible. Legal, Product, and Finance must approve the effect of leaving, suspension, or termination on future, held, payable, and recovery balances.",
    ],
  },
  {
    id: "partner-duty",
    title: "Independent partner duties",
    body: [
      "A partner acts as an independent business or individual, not as a Tabbio employee, agent, franchisee, or legal representative. The partner cannot bind Tabbio, make guarantees on Tabbio's behalf, or present estimated earnings as promised results.",
      "The partner is responsible for its own registrations, licences, permits, taxes, invoices, records, insurance, and legally required disclosures. Tabbio may request current evidence before enabling promotion or payout, but a check by Tabbio does not transfer that responsibility.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy summary",
    body: [
      "A production program should collect only the evidence needed for attribution, application review, fraud prevention, support, accounting, and legal obligations. Referral and claim URLs must not expose private CV content.",
      "The final privacy notice must explain the data collected, purpose, lawful basis where applicable, sharing, retention, deletion, security, and data-rights process. None of those production services are connected here.",
    ],
  },
  {
    id: "disclosure",
    title: "Partner disclosure guidance",
    body: [
      "Partners should clearly disclose that they may earn commission when recommending Tabbio. The disclosure must be easy to notice and fit the channel and jurisdiction.",
      "Example wording for review: ‘I may earn a commission if you subscribe through this link.’ This example is not automatic legal approval for every channel or territory, and the toolkit does not publish it for you.",
    ],
  },
  {
    id: "brand",
    title: "Brand, content, and approved tools",
    body: [
      "Partners may use only current, approved Tabbio names, marks, product claims, pricing, screenshots, and kit assets. They must not register confusing domains or social handles, alter the logo, imply exclusive status, or publish false claims about jobs, recruiters, subscriptions, earnings, or product results.",
      "The planned toolkit can provide tracked links and QR codes, candidate CV and claim flows, brand assets, content drafts, disclosure copy, resources, and earnings records. Drafts require partner review. No AI or publishing tool posts content automatically in this prototype.",
    ],
  },
  {
    id: "partner-badge",
    title: "Partner credential status and use",
    body: [
      "The proposed Tabbio Partner credential identifies an approved, active program participant and may show the approved Creator, Career, or Agency path. It is not a professional certification, employment mark, agency appointment, endorsement of the partner's services, or promise of results. Credential access should begin only after approval and end immediately when participation expires, is suspended, or terminates.",
      "Partners may place the unchanged current-year credential on websites, email signatures, proposals, presentations, media kits, and social posts. They must not switch editions, remove the active year, use it as an avatar, account name, social handle, app icon, or part of their own logo; alter its words, colors, proportions, or elements; display it more prominently than their own brand; or use it without a nearby commission disclosure where one is required. A production digital credential should link to a public status-verification page.",
    ],
  },
  {
    id: "records",
    title: "Records, changes, and appeals",
    body: [
      "A production program should keep auditable records for application decisions, terms acceptance, links, attribution, source payments, reward calculations, holds, reversals, approvals, payouts, disputes, and policy versions. Material program changes should have an effective date and reasonable notice where required.",
      "Partners should have a clear support and appeal route for rejected attribution, held rewards, suspensions, and data requests. Emergency action may be needed for security, fraud, or legal risk, but the reason and authorized owner should still be recorded.",
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility commitment",
    body: [
      "The target is WCAG 2.2 AA across keyboard, screen reader, zoom, reflow, contrast, touch, reduced motion, and high-contrast use. English and Arabic layouts should preserve a logical reading order, with legal Arabic reviewed by a qualified human translator.",
    ],
  },
  {
    id: "support",
    title: "Support and contact",
    body: [
      "A production legal contact, privacy contact, accessibility channel, and partner-support route are not configured in this local prototype. They must be added before launch and must show response ownership without inventing a response-time promise.",
    ],
  },
] as const;

const references = [
  {
    label: "UAE Advertiser Permit guidance",
    href: "https://uaemc.gov.ae/en/%D8%AA%D8%B5%D8%B1%D9%8A%D8%AD-%D9%85%D8%B9%D9%84%D9%86/",
  },
  {
    label: "Tabbio pricing",
    href: "https://www.tabbio.com/en/pricing",
  },
  {
    label: "RefRef source and alpha notice",
    href: "https://github.com/refrefhq/refref",
  },
  {
    label: "Google Partners badge guidelines",
    href: "https://support.google.com/google-ads/answer/9028798",
  },
  {
    label: "Shopify Partner branding guidance",
    href: "https://help.shopify.com/en/partners/partner-program/shopify-branding",
  },
  {
    label: "Atlassian Marketplace Partner brand guidelines",
    href: "https://developer.atlassian.com/platform/marketplace/atlassian-brand-guidelines-for-marketplace-partners/",
  },
] as const;

export function ProgramTerms() {
  return (
    <div className="min-h-screen bg-[#f7f4ff] text-[#281b43]">
      <header className="border-b border-[#ded6ed] bg-white">
        <div className="page-wrap flex min-h-[72px] items-center justify-between gap-4">
          <Link
            className="focus-ring rounded-xl"
            href="/partners"
            aria-label="Tabbio Partners home"
          >
            <BrandMark />
          </Link>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="focus-ring hidden h-11 rounded-full px-4 sm:inline-flex"
            >
              <Link href="/partner">Partner area</Link>
            </Button>
            <Button
              asChild
              className="focus-ring h-11 rounded-full bg-[#5a2aff] px-5 text-white hover:bg-[#512eff]"
            >
              <Link href="/partner/onboarding">Become a partner</Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="bg-[#16082f] py-16 text-white sm:py-24">
          <div className="page-wrap">
            <Link
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#cdbfff] hover:text-white"
              href="/partners"
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to
              partner page
            </Link>
            <div className="mt-8 max-w-4xl">
              <Badge className="border border-[#bba9ff]/25 bg-[#7550dc]/20 px-3 py-1 text-[#ded5ff] shadow-none">
                Local prototype summary
              </Badge>
              <h1 className="mt-6 text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[1] tracking-[-.04em]">
                Proposed partner-program terms
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#c8bdd8]">
                A plain-language record of what the current frontend
                demonstrates, what is recommended, and what still needs approval
                before anyone can rely on it.
              </p>
            </div>
          </div>
        </section>

        <div className="page-wrap grid gap-12 py-14 lg:grid-cols-[250px_1fr] lg:py-20">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-2xl bg-[#e9e1fb] p-5">
              <div className="flex items-start gap-3">
                <CircleAlert
                  className="mt-0.5 size-5 shrink-0 text-[#5a2aff]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Not a legal agreement</p>
                  <p className="mt-2 text-sm leading-6 text-[#66567d]">
                    No account, attribution, check, commission, or payout is
                    created by this local page.
                  </p>
                </div>
              </div>
            </div>
            <nav
              className="mt-6 hidden space-y-1 lg:block"
              aria-label="Terms sections"
            >
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="focus-ring block rounded-lg px-3 py-2 text-sm text-[#66567d] hover:bg-white hover:text-[#4721bd]"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="max-w-3xl">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8 border-b border-[#ded6ed] py-9 first:pt-0 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle2
                    className="mt-1 size-5 shrink-0 text-[#6d3bff]"
                    aria-hidden="true"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-.025em]">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4 text-base leading-7 text-[#5e5270]">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            <section className="border-t border-[#ded6ed] py-9">
              <h2 className="text-2xl font-semibold tracking-[-.025em]">
                Source checks
              </h2>
              <p className="mt-3 text-base leading-7 text-[#5e5270]">
                These sources informed the prototype. Final terms still need
                qualified legal, finance, privacy, and tax review.
              </p>
              <ul className="mt-5 space-y-2">
                {references.map((reference) => (
                  <li key={reference.href}>
                    <a
                      className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-[#4721bd] hover:text-[#321792]"
                      href={reference.href}
                    >
                      {reference.label}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-10 rounded-2xl bg-[#271251] p-7 text-white sm:p-9">
              <h2 className="text-2xl font-semibold tracking-[-.025em]">
                Ready to inspect the flow?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#cbbfdb]">
                Continue into the local application or Partner workspace. Both
                remain frontend-only demonstrations.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="focus-ring h-12 rounded-full bg-white px-6 text-[#281551] hover:bg-[#eee8ff]"
                >
                  <Link href="/partner/onboarding">
                    Open application <ArrowUpRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="focus-ring h-12 rounded-full border-white/25 bg-white/8 px-6 text-white shadow-none hover:bg-white/14 hover:text-white"
                >
                  <Link href="/partner">See Partner area</Link>
                </Button>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
