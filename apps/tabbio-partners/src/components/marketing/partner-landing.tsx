"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  FileText,
  Globe2,
  Menu,
  MessageSquareText,
  Plus,
  ShieldCheck,
  UsersRound,
  WandSparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@refref/ui/components/button";

import { BrandMark } from "@/components/brand-mark";
import { calculateEstimator, normalizeEstimatorInput } from "@/data/demo-data";
import { publicFaq } from "@/data/marketing";

const PLAN_PRICE = 14.99;
const COMMISSION_RATE = 0.3;

const navItems = [
  ["How it works", "#how-it-works"],
  ["Ways to earn", "#ways-to-earn"],
  ["Questions", "#faq"],
] as const;

const steps = [
  ["Choose your lane", "Tell us how you help."],
  ["Finish the checks", "Complete the steps shown."],
  ["Share your work", "Send one tracked link."],
  ["Track payments", "See every commission."],
] as const;

const earningPaths = [
  {
    icon: FileText,
    eyebrow: "CV professionals",
    title: "Make every CV useful twice.",
    copy: "Build it for your client. Share it through Tabbio.",
  },
  {
    icon: MessageSquareText,
    eyebrow: "Creators",
    title: "Teach once. Keep earning.",
    copy: "Share honest career advice with your partner link.",
  },
  {
    icon: BriefcaseBusiness,
    eyebrow: "Agencies",
    title: "Give every candidate one link.",
    copy: "A cleaner handoff for candidates and clients.",
  },
] as const;

const toolkit = [
  [FileText, "Proven formats", "Start with a useful structure."],
  [MessageSquareText, "Ready words", "Copy, edit, and share."],
  [ShieldCheck, "Brand kit", "Use the right assets."],
  [WandSparkles, "Tabbio assistant", "Get help when you need it."],
] as const;

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type EstimatorSliderProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
};

function EstimatorSlider({
  id,
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: EstimatorSliderProps) {
  const update = (next: number) =>
    onChange(normalizeEstimatorInput(next, min, max));

  return (
    <div className="tabbio-slider">
      <div className="tabbio-slider__label">
        <label htmlFor={`${id}-range`}>{label}</label>
        <div>
          <input
            id={`${id}-number`}
            aria-label={`${label}, numeric value`}
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(event) => update(event.currentTarget.valueAsNumber)}
          />
          {suffix && <span>{suffix}</span>}
        </div>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => update(event.currentTarget.valueAsNumber)}
      />
    </div>
  );
}

function Estimator({
  referrals,
  paidMonths,
  programMonths,
  setReferrals,
  setPaidMonths,
  setProgramMonths,
}: {
  referrals: number;
  paidMonths: number;
  programMonths: number;
  setReferrals: (value: number) => void;
  setPaidMonths: (value: number) => void;
  setProgramMonths: (value: number) => void;
}) {
  const result = calculateEstimator(
    referrals,
    paidMonths,
    programMonths,
    PLAN_PRICE,
    COMMISSION_RATE,
  );
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(
      () =>
        setAnnouncement(`Estimated total commission ${money(result.total)}`),
      350,
    );
    return () => window.clearTimeout(timeout);
  }, [result.total]);

  return (
    <section className="tabbio-estimator" aria-labelledby="estimate-title">
      <div className="tabbio-estimator__controls">
        <div className="tabbio-plan">
          <span>Individual plan</span>
          <strong>Plus, $14.99 monthly</strong>
          <ChevronRight aria-hidden="true" />
        </div>
        <EstimatorSlider
          id="referrals"
          label="New paying referrals each month"
          value={referrals}
          min={1}
          max={20}
          onChange={setReferrals}
        />
        <EstimatorSlider
          id="paid-months"
          label="Average months each customer pays"
          value={paidMonths}
          min={1}
          max={24}
          onChange={setPaidMonths}
        />
        <EstimatorSlider
          id="program-months"
          label="Time in the program"
          value={programMonths}
          min={1}
          max={36}
          suffix="months"
          onChange={setProgramMonths}
        />
      </div>
      <div className="tabbio-estimator__result">
        <p id="estimate-title">Estimated total commission</p>
        <strong>{money(result.total)}</strong>
      </div>
      <div className="tabbio-estimator__notes">
        <p>About {money(result.finalRunRate)} in the final month shown</p>
        <p>
          {referrals} referrals × {money(PLAN_PRICE * COMMISSION_RATE)} per paid
          month
        </p>
        <p>Estimate only. USD. Refunds and eligibility can change totals.</p>
      </div>
      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </section>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="tabbio-marketing-header">
      <div className="tabbio-landing-wrap tabbio-marketing-header__inner">
        <Link href="/" aria-label="Tabbio partner program home">
          <BrandMark light compact />
        </Link>
        <nav aria-label="Partner program">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="tabbio-marketing-header__actions">
          <span className="tabbio-language">
            <Globe2 aria-hidden="true" /> EN
          </span>
          <Link className="tabbio-sign-in" href="/partner">
            Sign in
          </Link>
          <button
            className="tabbio-menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-partner-nav"
            onClick={() => setOpen((current) => !current)}
          >
            <span className="visually-hidden">Open navigation</span>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <Link className="tabbio-header-cta" href="/partner/onboarding">
            Join
          </Link>
        </div>
        {open && (
          <nav id="mobile-partner-nav" className="tabbio-mobile-nav">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <Link href="/partner" onClick={() => setOpen(false)}>
              Open partner area
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

function StackVisual({ referrals }: { referrals: number }) {
  const months = [1, 3, 6, 9, 12, 15, 18];

  return (
    <div
      className="tabbio-stack"
      aria-label="Example of referrals stacking over time"
    >
      <div className="tabbio-stack__legend">
        <span>
          <i /> New customers
        </span>
        <strong>{referrals} each month</strong>
      </div>
      <div className="tabbio-stack__chart">
        {months.map((month, index) => (
          <div className="tabbio-stack__month" key={month}>
            <div
              className="tabbio-stack__bar"
              style={{ height: `${20 + index * 11}%` }}
            >
              {Array.from({ length: index + 1 }).map((_, block) => (
                <span key={block} />
              ))}
            </div>
            <small>{month}</small>
          </div>
        ))}
      </div>
      <p>Month</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="tabbio-public-footer">
      <div className="tabbio-landing-wrap tabbio-footer-links">
        <div>
          <strong>Product</strong>
          <a href="#how-it-works">How it works</a>
          <a href="#ways-to-earn">Ways to earn</a>
          <Link href="/partner">Partner area</Link>
        </div>
        <div>
          <strong>Company</strong>
          <a href="#faq">Questions</a>
          <Link href="/partners/terms#support">Contact</Link>
        </div>
        <div>
          <strong>Legal</strong>
          <Link href="/partners/terms">Program terms</Link>
          <Link href="/partners/terms#privacy">Privacy</Link>
          <Link href="/partners/terms#disclosure">Disclosure</Link>
        </div>
      </div>
      <div className="tabbio-footer-wordmark" aria-hidden="true">
        tabbio
      </div>
      <p className="tabbio-footer-note">
        © 2026 Tabbio · Local frontend prototype
      </p>
    </footer>
  );
}

export function PartnerLanding() {
  const [referrals, setReferrals] = useState(4);
  const [paidMonths, setPaidMonths] = useState(12);
  const [programMonths, setProgramMonths] = useState(18);

  return (
    <div className="tabbio-public-page">
      <Header />
      <main id="main-content">
        <section className="tabbio-hero" aria-labelledby="partner-hero-title">
          <div className="tabbio-landing-wrap tabbio-hero__grid">
            <div className="tabbio-hero__copy">
              <h1 id="partner-hero-title">
                <span>Your work</span>
                keeps paying.
              </h1>
              <p>
                Join the Tabbio partner program and earn 30% recurring
                commission on eligible referrals.
              </p>
              <div className="tabbio-hero__actions">
                <Button asChild className="tabbio-primary-button">
                  <Link href="/partner/onboarding">Become a Partner</Link>
                </Button>
                <Link className="tabbio-hero-link" href="/partner">
                  See the Partner Area <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
              <ul
                className="tabbio-hero__facts"
                aria-label="Program highlights"
              >
                <li>
                  <Check aria-hidden="true" /> 30% recurring
                </li>
                <li>
                  <Check aria-hidden="true" /> Clear monthly tracking
                </li>
              </ul>
            </div>
            <Estimator
              referrals={referrals}
              paidMonths={paidMonths}
              programMonths={programMonths}
              setReferrals={setReferrals}
              setPaidMonths={setPaidMonths}
              setProgramMonths={setProgramMonths}
            />
          </div>
        </section>

        <section className="tabbio-stack-section" aria-labelledby="stack-title">
          <div className="tabbio-landing-wrap">
            <h2 id="stack-title">
              See how the <span>stack grows.</span>
            </h2>
            <StackVisual referrals={referrals} />
            <p className="tabbio-small-note">
              Each new group can add to later months. Estimates are not
              guaranteed.
            </p>
          </div>
        </section>

        <section
          id="how-it-works"
          className="tabbio-steps"
          aria-labelledby="steps-title"
        >
          <div className="tabbio-landing-wrap">
            <h2 id="steps-title">
              Your first link, <span>in one session.</span>
            </h2>
            <ol>
              {steps.map(([title, copy], index) => (
                <li key={title}>
                  <span>{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="tabbio-claim" aria-labelledby="claim-title">
          <div className="tabbio-landing-wrap tabbio-claim__grid">
            <div>
              <h2 id="claim-title">
                Build it. Send it. See when it’s claimed.
              </h2>
              <p>
                Create the CV. Your client checks it, claims it, and keeps it
                live.
              </p>
              <Link href="/partner/clients">
                Open CV Builder <ChevronRight aria-hidden="true" />
              </Link>
            </div>
            <div
              className="tabbio-cv-visual"
              aria-label="Example client CV claim"
            >
              <div className="tabbio-cv-visual__top">
                <span>
                  <UsersRound aria-hidden="true" />
                </span>
                <div>
                  <strong>Client 01</strong>
                  <small>CV finishing up</small>
                </div>
                <em>Claimed</em>
              </div>
              <div className="tabbio-cv-visual__paper">
                <small>Client CV</small>
                <strong>Selected experience</strong>
                <p>Clean, clear, ready to share.</p>
                <div>
                  <span />
                  <span />
                  <span />
                </div>
                <a>Crafted by Sara Khan</a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="ways-to-earn"
          className="tabbio-paths"
          aria-labelledby="paths-title"
        >
          <div className="tabbio-landing-wrap">
            <h2 id="paths-title">
              Use the work you <span>already do</span>
            </h2>
            <div className="tabbio-path-grid">
              {earningPaths.map(({ icon: Icon, eyebrow, title, copy }) => (
                <article key={title}>
                  <span className="tabbio-line-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div className="tabbio-path-visual" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <small>{eyebrow}</small>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <ArrowUpRight aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tabbio-toolkit" aria-labelledby="toolkit-title">
          <div className="tabbio-landing-wrap">
            <h2 id="toolkit-title">No blank page.</h2>
            <div>
              {toolkit.map(([Icon, title, copy]) => (
                <article key={title}>
                  <span className="tabbio-line-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="tabbio-faq" aria-labelledby="faq-title">
          <div className="tabbio-landing-wrap">
            <div className="tabbio-faq__heading">
              <h2 id="faq-title">
                Frequently asked <span>questions</span>
              </h2>
              <p>Quick answers. Clear terms.</p>
            </div>
            <div className="tabbio-faq__list">
              {publicFaq.map(({ question, answer }) => (
                <details key={question}>
                  <summary>
                    {question}
                    <span>
                      <Plus aria-hidden="true" />
                    </span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="tabbio-final-cta" aria-labelledby="final-cta-title">
          <div className="tabbio-landing-wrap">
            <h2 id="final-cta-title">
              Your first link is <span>ten minutes</span> away
            </h2>
            <p>Join, finish the checks, and share your link.</p>
            <Button asChild className="tabbio-primary-button">
              <Link href="/partner/onboarding">Become a Partner</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
