"use client";

/*
 * THESIS: Useful work compounds; this page demonstrates recurring commission instead of promising easy income.
 * OWN-WORLD: Ink-violet fields, crisp white type, lilac calculation surfaces, and one violet-to-pink earning signal.
 * STORY: Visitors understand the proposed plan, test its assumptions, see practical earning paths, then choose to apply.
 * FIRST VIEWPORT: A plain-language offer and two actions sit beside a live cohort stack with the calculation exposed.
 * FORM: Persuade surface, pinned split-stage composition, derived directly from the supplied Tabbio partner direction.
 */

import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  FileText,
  Fingerprint,
  Globe2,
  Layers3,
  Link2,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Plus,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
  WandSparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@refref/ui/components/badge";
import { Button } from "@refref/ui/components/button";
import { Card } from "@refref/ui/components/card";
import { Input } from "@refref/ui/components/input";

import { BrandMark } from "@/components/brand-mark";
import {
  calculateEstimator,
  formatUsd,
  normalizeEstimatorInput,
} from "@/data/demo-data";

const planPrice = 14.99;
const commissionRate = 0.3;
const marketingNav = [
  ["The model", "#model"],
  ["How it works", "#how-it-works"],
  ["Ways to earn", "#ways-to-earn"],
  ["FAQ", "#faq"],
] as const;

function formatEstimatorUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const facts = [
  {
    label: "30% recurring",
    detail: "of eligible collected revenue under the proposed plan",
    icon: CircleDollarSign,
  },
  {
    label: "Monthly payouts",
    detail: "after eligibility, review, threshold, and provider checks",
    icon: WalletCards,
  },
  {
    label: "$50 threshold",
    detail: "proposed minimum before a payout can be scheduled",
    icon: ScanLine,
  },
  {
    label: "3 useful paths",
    detail: "client CVs, educational content, and agency handoffs",
    icon: Layers3,
  },
] as const;

const joiningSteps = [
  {
    title: "Choose how you help",
    copy: "Tell us whether you work with clients, teach an audience, or support candidates through an agency.",
    note: "One account can use every approved tool.",
    icon: UsersRound,
  },
  {
    title: "Complete the checks",
    copy: "Review the program agreement and complete only the identity or promotion checks that apply to you.",
    note: "External reviews show their real pending state.",
    icon: ShieldCheck,
  },
  {
    title: "Share useful work and track it",
    copy: "Create a CV claim link, educational draft, or tracked recommendation, then inspect eligible activity in Partner.",
    note: "Nothing is published or paid automatically in this demo.",
    icon: Link2,
  },
] as const;

const earningPaths = [
  {
    title: "Build a client CV",
    copy: "Create useful work first, send a protected claim link, and let the client choose whether to continue in Tabbio.",
    action: "Client CV workflow",
    icon: FileCheck2,
  },
  {
    title: "Teach with clear content",
    copy: "Draft a practical post, script, or article with an honest partner disclosure, then publish it yourself where it fits.",
    action: "Creator workflow",
    icon: MessageSquareText,
  },
  {
    title: "Hand off a candidate",
    copy: "Give a candidate or agency client one trackable next step without exposing private CV details in the referral URL.",
    action: "Agency workflow",
    icon: BriefcaseBusiness,
  },
] as const;

const faqItems = [
  {
    question: "Who can apply to become a Tabbio partner?",
    answer:
      "The proposed starting lanes are career writers and coaches, creators, and agencies. Eligibility, territories, and any activity-specific checks still require final program approval. Applying does not mean automatic acceptance.",
  },
  {
    question: "What does 30% recurring commission mean?",
    answer:
      "Under the proposed plan, an active partner would receive 30% of eligible net revenue from each settled, attributed payment. Discounts, credits, tax, excluded products, refunds, and other approved rules can change the eligible base. Lifetime means future eligible payments while the attribution and applicable terms remain valid, not guaranteed income.",
  },
  {
    question: "How would attribution work?",
    answer:
      "The recommended starting order is an accepted signed claim, then an explicitly confirmed partner code, then the last eligible partner click within 90 days. Attribution would lock when the customer relationship is accepted, with audited correction for genuine disputes. This policy is still awaiting approval.",
  },
  {
    question: "When would I be paid?",
    answer:
      "The proposed cadence is monthly after commission becomes payable, the USD 50 threshold is met, required checks are complete, and Finance approves the batch. Payout provider availability is not configured in this local prototype, so no real payout can be scheduled here.",
  },
  {
    question: "What happens after a refund or chargeback?",
    answer:
      "A later refund, chargeback, or credit would create a linked reversal instead of editing history. If the original commission was already paid, the proposed default is a visible negative recovery balance offset against future payable commission, never an automatic bank debit.",
  },
  {
    question: "Do I need an advertiser permit?",
    answer:
      "It depends on your jurisdiction and activity. Tabbio should ask only for checks that apply and show their actual review state. Legal must approve the decision tree before launch, so this prototype does not declare anyone verified or exempt.",
  },
  {
    question: "Can I choose different CV styles for clients?",
    answer:
      "The local product demo includes Modern, Classic, and Minimal example styles. Final production availability depends on the canonical Tabbio CV builder. A client sees what is being shared before accepting a claim.",
  },
  {
    question: "What happens if I leave or the account is suspended?",
    answer:
      "Paid history remains visible. The effect on future, held, and payable commission needs an approved legal and finance rule. A real product must show the reason, effective time, impact on links and payouts, and a support or appeal route.",
  },
  {
    question: "What happens to client and referral data?",
    answer:
      "Only the minimum evidence needed for attribution, fraud review, support, and finance should be collected. A referral link must not expose private CV content. Collection, retention, deletion, and data-rights details require an approved privacy notice before launch.",
  },
  {
    question: "Where can I read the agreement or ask for help?",
    answer:
      "Open the local program-terms page for the current prototype summary. It is not a signed agreement. A production support channel, final agreement version, disclosure guidance, and legal contact still need configuration.",
  },
] as const;

type EstimatorControlProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  hint: string;
  onChange: (value: number) => void;
};

function EstimatorControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  hint,
  onChange,
}: EstimatorControlProps) {
  const applyValue = (nextValue: number) =>
    onChange(normalizeEstimatorInput(nextValue, min, max));

  return (
    <div className="border-t border-white/10 py-4 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-4">
        <label
          className="text-sm font-semibold text-white"
          htmlFor={`${id}-number`}
        >
          {label}
        </label>
        <Input
          id={`${id}-number`}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-describedby={`${id}-hint`}
          className="h-12 w-20 border-white/20 bg-white/10 text-center text-base font-semibold tabular-nums text-white shadow-none focus-visible:border-[#c7b8ff] focus-visible:ring-[#9d82ff]/40"
          onChange={(event) => applyValue(event.currentTarget.valueAsNumber)}
        />
      </div>
      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={`${label} slider`}
        aria-describedby={`${id}-hint`}
        className="mt-3 h-12 w-full cursor-pointer accent-[#9d82ff]"
        onChange={(event) => applyValue(event.currentTarget.valueAsNumber)}
      />
      <div
        className="flex items-start justify-between gap-4 text-xs text-[#cfc5ed]"
        id={`${id}-hint`}
      >
        <span>{hint}</span>
        <span className="shrink-0 tabular-nums">
          {min}–{max}
        </span>
      </div>
    </div>
  );
}

function ActionPair({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${compact ? "" : "mt-8"}`}
    >
      <Button
        asChild
        size="lg"
        className="focus-ring h-12 rounded-full bg-[#6d3bff] px-6 text-white shadow-[0_12px_30px_rgba(80,38,209,.28)] hover:bg-[#7950ff]"
      >
        <Link href="/partner/onboarding">
          Become a partner
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="focus-ring h-12 rounded-full border-white/25 bg-white/8 px-6 text-white shadow-none hover:bg-white/14 hover:text-white"
      >
        <Link href="/partner">See the local Partner area</Link>
      </Button>
    </div>
  );
}

function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      mobileTriggerRef.current?.focus();
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !mobileNavRef.current?.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070313]/90 text-white backdrop-blur-xl">
      <div className="page-wrap flex min-h-[72px] items-center justify-between gap-2 sm:gap-4">
        <Link
          className="focus-ring rounded-xl"
          href="/partners"
          aria-label="Tabbio Partners home"
        >
          <span className="sm:hidden">
            <BrandMark light compact />
          </span>
          <span className="hidden sm:inline-flex">
            <BrandMark light />
          </span>
        </Link>
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Partner page"
        >
          {marketingNav.map(([label, href]) => (
            <a
              key={href}
              className="focus-ring flex min-h-12 items-center rounded-full px-4 text-sm font-medium text-[#d8d0eb] hover:bg-white/8 hover:text-white"
              href={href}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div
            className="hidden min-h-12 items-center gap-2 rounded-full px-3 text-xs text-[#c8bed8] lg:flex"
            title="Arabic requires human translation and legal review before release"
          >
            <Globe2 className="size-4" aria-hidden="true" />
            <span>English</span>
            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-[#ded5e9]">
              Demo only
            </span>
          </div>
          <Button
            asChild
            variant="ghost"
            className="focus-ring hidden h-12 rounded-full px-4 text-white hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            <Link href="/partner">Sign in</Link>
          </Button>
          <div ref={mobileNavRef} className="relative lg:hidden">
            <button
              ref={mobileTriggerRef}
              type="button"
              className="focus-ring grid size-12 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/8 text-white hover:bg-white/14"
              aria-expanded={mobileOpen}
              aria-controls="compact-partner-navigation"
              onClick={() => setMobileOpen((current) => !current)}
            >
              <span className="visually-hidden">
                Toggle partner page navigation
              </span>
              {mobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
            {mobileOpen && (
              <div
                id="compact-partner-navigation"
                className="absolute right-0 top-14 z-50 w-[min(84vw,320px)] rounded-2xl border border-white/12 bg-[#150a2c] p-3 shadow-[0_24px_70px_rgba(0,0,0,.42)]"
              >
                <nav className="grid gap-1" aria-label="Compact partner page">
                  {marketingNav.map(([label, href]) => (
                    <a
                      key={href}
                      className="focus-ring flex min-h-12 items-center rounded-xl px-3 text-sm font-medium text-[#ddd4e8] hover:bg-white/10 hover:text-white"
                      href={href}
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
                <div className="my-3 border-y border-white/10 py-3">
                  <div className="flex min-h-12 items-center gap-2 px-3 text-sm text-white">
                    <Globe2
                      className="size-4 text-[#b9a4ff]"
                      aria-hidden="true"
                    />
                    <span className="font-medium">English</span>
                    <span className="ml-auto rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-[#ded5e9]">
                      Only in demo
                    </span>
                  </div>
                  <p className="px-3 pb-1 text-xs leading-5 text-[#a99eb7]">
                    Arabic requires human translation and legal review before
                    release.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="focus-ring h-12 w-full rounded-xl border-white/15 bg-white/8 text-white shadow-none hover:bg-white/14 hover:text-white"
                >
                  <Link href="/partner" onClick={() => setMobileOpen(false)}>
                    Sign in to Partner
                  </Link>
                </Button>
              </div>
            )}
          </div>
          <Button
            asChild
            className="focus-ring h-12 rounded-full bg-white px-4 text-[#25114f] hover:bg-[#f2edff]"
          >
            <Link href="/partner/onboarding">Become a partner</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function EarningsEstimator({
  monthlyReferrals,
  paidMonths,
  programMonths,
  setMonthlyReferrals,
  setPaidMonths,
  setProgramMonths,
}: {
  monthlyReferrals: number;
  paidMonths: number;
  programMonths: number;
  setMonthlyReferrals: (value: number) => void;
  setPaidMonths: (value: number) => void;
  setProgramMonths: (value: number) => void;
}) {
  const result = calculateEstimator(
    monthlyReferrals,
    paidMonths,
    programMonths,
    planPrice,
    commissionRate,
  );
  const customerMonths = useMemo(() => {
    let total = 0;
    for (let cohort = 0; cohort < programMonths; cohort += 1) {
      total += monthlyReferrals * Math.min(paidMonths, programMonths - cohort);
    }
    return total;
  }, [monthlyReferrals, paidMonths, programMonths]);
  const cohorts = useMemo(
    () =>
      Array.from({ length: programMonths }, (_, index) => {
        const month = index + 1;
        const activeMonths = Math.min(paidMonths, programMonths - index);
        return { month, activeMonths };
      }),
    [paidMonths, programMonths],
  );
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAnnouncement(
        `Estimated commission ${formatEstimatorUsd(result.total)}. Final monthly run rate ${formatEstimatorUsd(result.finalRunRate)}.`,
      );
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [result.finalRunRate, result.total]);

  return (
    <section
      aria-labelledby="estimator-title"
      className="relative overflow-hidden rounded-2xl border border-white/14 bg-[#12082e] shadow-[0_30px_90px_rgba(0,0,0,.34)]"
    >
      <div className="border-b border-white/10 bg-white/[.055] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#c8b7ff]">
              LOCAL COHORT ESTIMATOR
            </p>
            <h2
              id="estimator-title"
              className="mt-1 text-xl font-semibold tracking-[-.02em] text-white"
            >
              See how the stack builds
            </h2>
          </div>
          <Badge className="border border-[#a78cff]/30 bg-[#6d3bff]/20 px-3 py-1 text-[#ddd3ff] shadow-none">
            Illustrative estimate
          </Badge>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[.9fr_1.1fr]">
        <div className="p-5 sm:p-6">
          <EstimatorControl
            id="monthly-referrals"
            label="New paying referrals each month"
            value={monthlyReferrals}
            min={1}
            max={20}
            hint="Example customers who make an eligible payment"
            onChange={setMonthlyReferrals}
          />
          <EstimatorControl
            id="paid-months"
            label="Paid months per customer"
            value={paidMonths}
            min={1}
            max={24}
            hint="How long each example customer keeps paying"
            onChange={setPaidMonths}
          />
          <EstimatorControl
            id="program-months"
            label="Months in the program"
            value={programMonths}
            min={1}
            max={36}
            hint="The period used for this estimate"
            onChange={setProgramMonths}
          />
        </div>

        <div className="flex min-h-full flex-col bg-[#f7f4ff] p-5 text-[#26184d] sm:p-6">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-[#654d93]">
                Estimated commission
              </p>
              <p className="mt-1 text-[clamp(2.35rem,6vw,4rem)] font-semibold leading-none tracking-[-.04em] tabular-nums">
                {formatEstimatorUsd(result.total)}
              </p>
            </div>
            <div className="pb-1 text-right">
              <p className="text-xs text-[#715e97]">Final monthly run rate</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatEstimatorUsd(result.finalRunRate)}
              </p>
            </div>
          </div>

          <div
            className="mt-7"
            role="img"
            aria-label={`${programMonths} monthly referral cohorts shown as a commission stack`}
          >
            <div
              className="flex h-32 items-end gap-1 overflow-hidden rounded-xl bg-[#ebe5fb] px-3 pt-3"
              aria-hidden="true"
            >
              {cohorts.map((cohort) => (
                <span
                  key={cohort.month}
                  className="min-w-1 flex-1 rounded-t-[3px] bg-[#6d3bff] transition-[height,background-color] duration-200 ease-out even:bg-[#986fff]"
                  style={{
                    height: `${Math.max(8, (cohort.activeMonths / Math.max(paidMonths, 1)) * 100)}%`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-[#715e97]">
              <span>First cohort</span>
              <span>Month {programMonths}</span>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-[#dcd3f3] text-sm">
            <div className="bg-white/80 p-3">
              <dt className="text-xs text-[#715e97]">Customer-months</dt>
              <dd className="mt-1 font-semibold tabular-nums">
                {customerMonths}
              </dd>
            </div>
            <div className="bg-white/80 p-3">
              <dt className="text-xs text-[#715e97]">
                Commission per paid month
              </dt>
              <dd className="mt-1 font-semibold tabular-nums">
                {formatEstimatorUsd(planPrice * commissionRate)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-[#66577f]">
            Assumes a {formatUsd(planPrice)} monthly plan, 30% commission, even
            referrals, and no discounts, credits, tax exclusions, refunds,
            reversals, holds, or churn beyond the paid-month input. This is an
            estimate, not guaranteed income.
          </p>
          <p className="visually-hidden" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05020d] text-white">
      <div className="page-wrap grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-start">
        <div className="max-w-xl">
          <BrandMark light />
          <p className="mt-4 text-sm leading-6 text-[#bcb3cc]">
            Tabbio Partner is shown here as a local frontend demonstration.
            Nothing on this page creates an account, records attribution,
            completes a check, publishes content, or schedules a payout.
          </p>
        </div>
        <nav
          className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#d5cde0] sm:grid-cols-3"
          aria-label="Legal and support"
        >
          <Link
            className="focus-ring rounded hover:text-white"
            href="/partners/terms"
          >
            Program terms
          </Link>
          <Link
            className="focus-ring rounded hover:text-white"
            href="/partners/terms#privacy"
          >
            Privacy
          </Link>
          <Link
            className="focus-ring rounded hover:text-white"
            href="/partners/terms#disclosure"
          >
            Disclosure guide
          </Link>
          <Link
            className="focus-ring rounded hover:text-white"
            href="/partners/terms#accessibility"
          >
            Accessibility
          </Link>
          <Link
            className="focus-ring rounded hover:text-white"
            href="/partners/terms#support"
          >
            Contact
          </Link>
          <Link className="focus-ring rounded hover:text-white" href="/partner">
            Partner area
          </Link>
        </nav>
      </div>
      <div className="page-wrap flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-[#91879f] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Tabbio. Local prototype.</p>
        <p>Proposed program details require Legal and Finance approval.</p>
      </div>
    </footer>
  );
}

export function PartnerLanding() {
  const [monthlyReferrals, setMonthlyReferrals] = useState(4);
  const [paidMonths, setPaidMonths] = useState(12);
  const [programMonths, setProgramMonths] = useState(18);
  const result = calculateEstimator(
    monthlyReferrals,
    paidMonths,
    programMonths,
    planPrice,
    commissionRate,
  );
  const activePayments = monthlyReferrals * Math.min(paidMonths, programMonths);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#070313] text-white">
      <MarketingHeader />
      <main id="main-content">
        <section className="hero-atmosphere relative overflow-hidden border-b border-white/10">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,3,19,.05),#070313_96%)]"
            aria-hidden="true"
          />
          <div className="page-wrap relative grid min-h-[calc(100svh-72px)] items-center gap-14 py-16 lg:grid-cols-[.88fr_1.12fr] lg:py-20">
            <div className="max-w-2xl">
              <Badge className="border border-white/15 bg-white/8 px-3 py-1 text-[#ddd5ef] shadow-none">
                <Sparkles aria-hidden="true" /> Local partner-program demo
              </Badge>
              <h1 className="mt-7 max-w-[10ch] text-[clamp(3.4rem,8vw,6rem)] font-semibold leading-[.96] tracking-[-.04em]">
                Your work keeps paying.
              </h1>
              <p className="mt-7 max-w-[62ch] text-lg leading-8 text-[#d0c7df]">
                Create useful Tabbio work, share a clear next step, and earn a
                proposed 30% recurring commission when an attributed customer
                makes an eligible payment.
              </p>
              <ActionPair />
              <div className="mt-8 flex max-w-xl items-start gap-3 border-t border-white/12 pt-5 text-sm leading-6 text-[#aaa0ba]">
                <ShieldCheck
                  className="mt-1 size-4 shrink-0 text-[#bba8ff]"
                  aria-hidden="true"
                />
                <p>
                  This page is a local simulation. Program rules, eligibility,
                  legal terms, payout provider, and production activation still
                  require approval and configuration.
                </p>
              </div>
            </div>

            <EarningsEstimator
              monthlyReferrals={monthlyReferrals}
              paidMonths={paidMonths}
              programMonths={programMonths}
              setMonthlyReferrals={setMonthlyReferrals}
              setPaidMonths={setPaidMonths}
              setProgramMonths={setProgramMonths}
            />
          </div>
        </section>

        <section
          className="border-b border-white/10 bg-[#0b0617] py-10"
          aria-labelledby="facts-title"
        >
          <div className="page-wrap">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="facts-title" className="text-lg font-semibold">
                The proposed plan, at a glance
              </h2>
              <p className="text-sm text-[#aaa0ba]">
                Commercial terms are not production-approved.
              </p>
            </div>
            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-white/12 sm:grid-cols-2 xl:grid-cols-4">
              {facts.map(({ label, detail, icon: Icon }) => (
                <div key={label} className="min-h-40 bg-[#120a25] p-5">
                  <Icon className="size-5 text-[#b8a5ff]" aria-hidden="true" />
                  <p className="mt-7 text-xl font-semibold tracking-[-.02em]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#bcb2cc]">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="model"
          className="scroll-mt-24 bg-[#f7f4ff] py-24 text-[#26184d] sm:py-32"
          aria-labelledby="model-title"
        >
          <div className="page-wrap grid gap-14 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
            <div className="max-w-lg lg:sticky lg:top-28">
              <p className="text-sm font-semibold text-[#6d3bff]">
                THE COMPOUNDING MODEL
              </p>
              <h2
                id="model-title"
                className="mt-4 text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[1.02] tracking-[-.04em]"
              >
                Every month adds a new layer.
              </h2>
              <p className="mt-6 text-base leading-7 text-[#625779]">
                A cohort is simply the group of referred customers who start in
                the same month. As long as their payments remain eligible,
                earlier cohorts can overlap with newer ones.
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  title: "Month 1 starts the base",
                  detail: `${monthlyReferrals} example customers each generate ${formatEstimatorUsd(planPrice * commissionRate)} for an eligible paid month.`,
                  width: "w-[46%]",
                },
                {
                  title: "New cohorts join the stack",
                  detail: `Over ${programMonths} months, each new group can contribute for up to ${paidMonths} paid months.`,
                  width: "w-[72%]",
                },
                {
                  title: "The run rate shows the final month",
                  detail: `${activePayments} active example payments in month ${programMonths} produce a ${formatEstimatorUsd(result.finalRunRate)} monthly run rate.`,
                  width: "w-full",
                },
              ].map((item, index) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-2xl bg-white p-6 sm:p-8"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ebe5ff] text-sm font-bold text-[#5730cc]">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold tracking-[-.02em]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#695d80]">
                    {item.detail}
                  </p>
                  <div
                    className="mt-7 h-3 overflow-hidden rounded-full bg-[#eeeaf7]"
                    aria-hidden="true"
                  >
                    <div
                      className={`${item.width} h-full rounded-full bg-[#6d3bff]`}
                    />
                  </div>
                </article>
              ))}
              <div className="rounded-2xl bg-[#251150] p-6 text-white sm:p-8">
                <p className="text-sm font-semibold text-[#c6b7ff]">
                  Calculation proof
                </p>
                <p className="mt-3 text-xl font-semibold leading-8">
                  Customer-months × {formatUsd(planPrice)} plan price × 30% =
                  estimated commission.
                </p>
                <p className="mt-3 text-sm leading-6 text-[#c8bed9]">
                  The estimator calculates each cohort separately. It does not
                  assume every customer pays forever, and it does not account
                  for unapproved eligibility rules.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 bg-[#09041a] py-24 sm:py-32"
          aria-labelledby="how-title"
        >
          <div className="page-wrap">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#b9a4ff]">
                HOW JOINING WORKS
              </p>
              <h2
                id="how-title"
                className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-.04em]"
              >
                Three steps, with every real state visible.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#bcb2cc]">
                Application approval, promotion eligibility, active membership,
                and payout readiness are different checks. Tabbio should never
                collapse them into one vague green tick.
              </p>
            </div>

            <ol className="mt-14 grid gap-5 lg:grid-cols-3">
              {joiningSteps.map(({ title, copy, note, icon: Icon }, index) => (
                <li
                  key={title}
                  className="relative min-h-[340px] overflow-hidden rounded-2xl border border-white/12 bg-[#12092a] p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl bg-[#6d3bff] text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span
                      className="text-5xl font-semibold tracking-[-.04em] text-white/40"
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-16 text-2xl font-semibold tracking-[-.025em]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#c4bacf]">
                    {copy}
                  </p>
                  <p className="mt-6 flex items-start gap-2 border-t border-white/10 pt-4 text-xs leading-5 text-[#9f93ad]">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[#b8a5ff]"
                      aria-hidden="true"
                    />
                    {note}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="bg-[#ded2ff] py-24 text-[#241347] sm:py-32"
          aria-labelledby="claim-title"
        >
          <div className="page-wrap grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-semibold text-[#5b31d0]">
                CV CLAIM PROOF
              </p>
              <h2
                id="claim-title"
                className="mt-4 text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[1.03] tracking-[-.04em]"
              >
                The referral can begin with real client work.
              </h2>
              <p className="mt-6 text-base leading-7 text-[#5c5070]">
                A career professional creates a useful CV, sends a protected
                claim link, and lets the client decide whether to accept it in
                Tabbio. Private CV details never belong in the referral URL.
              </p>
              <Button
                asChild
                variant="outline"
                className="focus-ring mt-8 h-12 rounded-full border-[#5a36b8]/25 bg-white/45 px-6 text-[#3a1e7f] shadow-none hover:bg-white hover:text-[#3a1e7f]"
              >
                <Link href="/partner">
                  Open the local CV workflow <ChevronRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <Card className="gap-0 overflow-hidden rounded-2xl border-0 bg-[#0b0518] py-0 text-white shadow-[0_30px_80px_rgba(40,18,90,.24)]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#6d3bff]">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">Example client CV</p>
                    <p className="text-xs text-[#a99eb7]">
                      Synthetic demonstration
                    </p>
                  </div>
                </div>
                <Badge className="border-0 bg-[#1f714f] px-3 py-1 text-white">
                  Ready to send
                </Badge>
              </div>
              <div className="p-5 sm:p-7">
                <div className="rounded-xl bg-white p-5 text-[#2b2340]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">
                        Client-approved preview
                      </p>
                      <p className="mt-1 text-sm text-[#6b617c]">
                        Modern style · no public URL yet
                      </p>
                    </div>
                    <LockKeyhole
                      className="size-5 text-[#6d3bff]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-6 space-y-3" aria-hidden="true">
                    <div className="h-2 w-2/3 rounded-full bg-[#d9d1e8]" />
                    <div className="h-2 w-full rounded-full bg-[#eeeaf5]" />
                    <div className="h-2 w-5/6 rounded-full bg-[#eeeaf5]" />
                  </div>
                </div>

                <ol
                  className="mt-6 space-y-0"
                  aria-label="Example CV claim journey"
                >
                  {[
                    [
                      "CV prepared",
                      "The partner creates and reviews the work.",
                    ],
                    [
                      "Protected claim sent",
                      "The client receives a signed, expiring handoff.",
                    ],
                    [
                      "Client accepts",
                      "Consent locks the recommended attribution.",
                    ],
                    [
                      "Eligible payment settles",
                      "A versioned commission entry can be created.",
                    ],
                  ].map(([title, copy], index) => (
                    <li key={title} className="grid grid-cols-[24px_1fr] gap-3">
                      <div className="flex flex-col items-center">
                        <span className="mt-1 grid size-6 place-items-center rounded-full bg-[#6d3bff] text-white">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                        {index < 3 && (
                          <span
                            className="h-full w-px bg-white/15"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-[#a99eb7]">
                          {copy}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          </div>
        </section>

        <section
          id="ways-to-earn"
          className="scroll-mt-24 bg-[#f8f7fb] py-24 text-[#26184d] sm:py-32"
          aria-labelledby="paths-title"
        >
          <div className="page-wrap">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#6d3bff]">
                THREE EARNING PATHS
              </p>
              <h2
                id="paths-title"
                className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-.04em]"
              >
                Start with the work people already trust you to do.
              </h2>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {earningPaths.map(
                ({ title, copy, action, icon: Icon }, index) => (
                  <article
                    key={title}
                    className={`flex min-h-[360px] flex-col rounded-2xl p-7 ${index === 1 ? "bg-[#6d3bff] text-white" : "bg-[#ece7f7] text-[#26184d]"}`}
                  >
                    <Icon
                      className={`size-7 ${index === 1 ? "text-white" : "text-[#6d3bff]"}`}
                      aria-hidden="true"
                    />
                    <div className="mt-auto pt-20">
                      <p
                        className={`text-xs font-semibold ${index === 1 ? "text-white" : "text-[#745ca4]"}`}
                      >
                        {action}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-[-.025em]">
                        {title}
                      </h3>
                      <p
                        className={`mt-3 text-sm leading-6 ${index === 1 ? "text-white" : "text-[#655977]"}`}
                      >
                        {copy}
                      </p>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          className="bg-[#0b0617] py-24 sm:py-32"
          aria-labelledby="toolkit-title"
        >
          <div className="page-wrap grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-semibold text-[#b9a4ff]">
                THE PARTNER TOOLKIT
              </p>
              <h2
                id="toolkit-title"
                className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-.04em]"
              >
                Practical help, without autopilot.
              </h2>
              <p className="mt-6 text-base leading-7 text-[#bcb2cc]">
                Build and organize useful material inside Partner. Copy or
                export it when you are ready. Tabbio does not auto-publish posts
                or make legal claims on your behalf.
              </p>
              <Button
                asChild
                className="focus-ring mt-8 h-12 rounded-full bg-white px-6 text-[#281551] hover:bg-[#eee8ff]"
              >
                <Link href="/partner">
                  Explore the local toolkit <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#130a28]">
              {[
                {
                  title: "Tracked links and QR",
                  copy: "Name a channel and campaign, then inspect scoped example activity.",
                  icon: Link2,
                  state: "Copy or export",
                },
                {
                  title: "Content Builder",
                  copy: "Draft a script, post, or article with a visible disclosure.",
                  icon: WandSparkles,
                  state: "No auto-publish",
                },
                {
                  title: "Approved words",
                  copy: "Use versioned program descriptions and disclosure guidance.",
                  icon: BookOpen,
                  state: "Review required",
                },
                {
                  title: "Brand kit and resources",
                  copy: "Keep file versions, formats, and usage notes together.",
                  icon: Fingerprint,
                  state: "Local examples",
                },
              ].map(({ title, copy, icon: Icon, state }) => (
                <div
                  key={title}
                  className="grid gap-4 border-b border-white/10 p-5 last:border-b-0 sm:grid-cols-[48px_1fr_auto] sm:items-center sm:p-6"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-white/8 text-[#b9a4ff]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#afa4bd]">
                      {copy}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-[#d4c9df]">
                    {state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="scroll-mt-24 bg-[#f7f4ff] py-24 text-[#26184d] sm:py-32"
          aria-labelledby="faq-title"
        >
          <div className="page-wrap grid gap-12 lg:grid-cols-[.66fr_1.34fr]">
            <div className="max-w-md">
              <p className="text-sm font-semibold text-[#6d3bff]">
                PROGRAM QUESTIONS
              </p>
              <h2
                id="faq-title"
                className="mt-4 text-[clamp(2.5rem,5vw,4.4rem)] font-semibold leading-[1.04] tracking-[-.04em]"
              >
                Read the rule, not the fine-print fog.
              </h2>
              <p className="mt-6 text-base leading-7 text-[#665a7a]">
                Multiple answers can stay open while you compare them. These
                summaries describe the proposed local demo, not final legal
                terms.
              </p>
              <Link
                className="focus-ring mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#5b31d0] hover:underline"
                href="/partners/terms"
              >
                Read local program terms{" "}
                <ChevronRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <div className="divide-y divide-[#dcd5e9] border-y border-[#dcd5e9]">
              {faqItems.map(({ question, answer }) => (
                <details key={question} className="group">
                  <summary className="focus-ring flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 rounded-lg py-5 text-left text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    <span>{question}</span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8e1f8] text-[#5b31d0] transition-transform duration-200 group-open:rotate-45">
                      <Plus className="size-5" aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="max-w-3xl pb-6 pr-12 text-sm leading-7 text-[#665a7a]">
                    <p>{answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden bg-[#210c4a] py-24 sm:py-32"
          aria-labelledby="final-title"
        >
          <div
            className="pointer-events-none absolute -right-24 -top-40 size-[520px] rounded-full bg-[#8e5dff]/25 blur-[100px]"
            aria-hidden="true"
          />
          <div className="page-wrap relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#cebfff]">
                YOUR NEXT USEFUL STEP
              </p>
              <h2
                id="final-title"
                className="mt-4 text-[clamp(2.7rem,6vw,5.3rem)] font-semibold leading-[1] tracking-[-.04em]"
              >
                Bring the work. Tabbio makes the trail clear.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#c9bddb]">
                Explore the application flow or inspect the local Partner
                workspace. No data leaves this frontend demo.
              </p>
            </div>
            <ActionPair compact />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
