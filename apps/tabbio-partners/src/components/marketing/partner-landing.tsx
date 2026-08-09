"use client";

/*
 * THESIS: A direct, visual path from useful career work to recurring earnings.
 * COMPOSITION: Calculator hero, six benefits, three product proofs, split form,
 * three-step review path, FAQ, footer.
 * DEPTH: Tabbio gradient establishes the promise; quiet neutral surfaces carry
 * information; deep violet frames product proof.
 * TYPOGRAPHY: Existing Tabbio display hierarchy with short, literal copy.
 * SPACING: Large section rhythm, compact controls, 48px minimum actions.
 * Higgsfield informs conversion order only; Tabbio owns the colors, product
 * language, proof, and M3 interaction behavior.
 */

import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  Globe2,
  Instagram,
  Link2,
  Menu,
  MessageSquareText,
  Music2,
  Plus,
  QrCode,
  ShieldCheck,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@refref/ui/components/button";

import { BrandMark } from "@/components/brand-mark";
import { PartnerApplicationForm } from "@/components/marketing/partner-application-form";
import { calculateEstimator, normalizeEstimatorInput } from "@/data/demo-data";
import { publicFaq } from "@/data/marketing";

const PLAN_PRICE = 14.99;
const COMMISSION_RATE = 0.3;

const navItems = [
  ["Home", "https://www.tabbio.com/en"],
  ["Features", "https://www.tabbio.com/en/features"],
  ["Pricing", "https://www.tabbio.com/en/pricing"],
  ["For Employers", "https://www.tabbio.com/en/employers"],
  ["For Developers", "https://docs.tabbio.com/en"],
  ["Tools", "https://www.tabbio.com/en/tools"],
] as const;

const benefits = [
  {
    icon: CircleDollarSign,
    title: "30% recurring",
    copy: "Earn while an eligible referral keeps paying.",
  },
  {
    icon: FileText,
    title: "Client-ready CVs",
    copy: "Build useful work your clients can claim.",
  },
  {
    icon: Link2,
    title: "Links and QR codes",
    copy: "Give every channel a trackable path.",
  },
  {
    icon: MessageSquareText,
    title: "Content toolkit",
    copy: "Start from clear formats and disclosure copy.",
  },
  {
    icon: BarChart3,
    title: "Visible earnings",
    copy: "See pending, payable, and paid amounts.",
  },
  {
    icon: ShieldCheck,
    title: "Partner support",
    copy: "Use approved assets, guidance, and program rules.",
  },
] as const;

const nextSteps = [
  ["Apply", "Tell us how you help people with careers."],
  ["We review", "A real person checks fit and your work."],
  ["Start sharing", "Get your link, resources, and dashboard."],
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
  idPrefix,
  compact = false,
  referrals,
  paidMonths,
  programMonths,
  setReferrals,
  setPaidMonths,
  setProgramMonths,
}: {
  idPrefix: string;
  compact?: boolean;
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
    <section
      className={`tabbio-estimator${compact ? " tabbio-estimator--compact" : ""}`}
      aria-labelledby={`${idPrefix}-estimate-title`}
    >
      <div className="tabbio-estimator__controls">
        <div className="tabbio-plan">
          <span>Individual plan</span>
          <strong>Plus, $14.99 monthly</strong>
          <ChevronRight aria-hidden="true" />
        </div>
        <EstimatorSlider
          id={`${idPrefix}-referrals`}
          label="New paying referrals each month"
          value={referrals}
          min={1}
          max={20}
          onChange={setReferrals}
        />
        <EstimatorSlider
          id={`${idPrefix}-paid-months`}
          label="Average months each customer pays"
          value={paidMonths}
          min={1}
          max={24}
          onChange={setPaidMonths}
        />
        <EstimatorSlider
          id={`${idPrefix}-program-months`}
          label="Time in the program"
          value={programMonths}
          min={1}
          max={36}
          suffix="months"
          onChange={setProgramMonths}
        />
      </div>
      <div className="tabbio-estimator__result">
        <p id={`${idPrefix}-estimate-title`}>Estimated total commission</p>
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
          <Link className="tabbio-header-cta" href="#form">
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

function Footer() {
  return (
    <footer className="tabbio-public-footer">
      <div className="tabbio-landing-wrap tabbio-footer-links">
        <div>
          <strong>Product</strong>
          <a href="https://www.tabbio.com/en/features">Features</a>
          <a href="https://www.tabbio.com/en/pricing">Pricing</a>
          <a href="https://www.tabbio.com/en/employers">For Employers</a>
        </div>
        <div>
          <strong>Company</strong>
          <a href="https://www.tabbio.com/en/about">About</a>
          <a href="https://www.tabbio.com/blog">Blog</a>
          <a href="https://www.tabbio.com/en/contact">Contact</a>
        </div>
        <div>
          <strong>Legal</strong>
          <Link href="/partners/terms">Program terms</Link>
          <Link href="/partners/terms#privacy">Privacy</Link>
          <Link href="/partners/terms#disclosure">Disclosure</Link>
        </div>
        <div className="tabbio-footer-downloads">
          <div>
            <a href="https://www.tabbio.com/en/download">
              <small>GET IT ON</small>
              <strong>Google Play</strong>
            </a>
            <a href="https://www.tabbio.com/en/download">
              <small>Download on the</small>
              <strong>App Store</strong>
            </a>
          </div>
          <span aria-hidden="true">
            <Youtube />
            <Instagram />
            <Music2 />
          </span>
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
                Build useful career work, share one clear link, and earn 30% on
                eligible subscriptions.
              </p>
              <div className="tabbio-hero__actions">
                <Button asChild className="tabbio-primary-button">
                  <Link href="#form">Become A Partner</Link>
                </Button>
                <Link className="tabbio-hero-link" href="#partner-work">
                  See how it works <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
              <ul
                className="tabbio-hero__facts"
                aria-label="Program highlights"
              >
                <li>
                  <Check aria-hidden="true" /> 30% recurring commission
                </li>
                <li>
                  <Check aria-hidden="true" /> Monthly payouts
                </li>
              </ul>
            </div>
            <Estimator
              idPrefix="hero"
              referrals={referrals}
              paidMonths={paidMonths}
              programMonths={programMonths}
              setReferrals={setReferrals}
              setPaidMonths={setPaidMonths}
              setProgramMonths={setProgramMonths}
            />
          </div>
        </section>

        <section className="program-benefits" aria-labelledby="benefits-title">
          <div className="tabbio-landing-wrap">
            <p className="program-eyebrow">What you get</p>
            <h2 id="benefits-title">Everything in one partner program.</h2>
            <div className="program-benefit-grid">
              {benefits.map(({ icon: Icon, title, copy }) => (
                <article key={title}>
                  <span>
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="partner-work"
          className="program-showcase"
          aria-labelledby="showcase-title"
        >
          <div className="tabbio-landing-wrap">
            <p className="program-eyebrow">Made for real partner work</p>
            <h2 id="showcase-title">
              From useful work to <span>tracked earnings.</span>
            </h2>
            <div className="program-showcase-grid">
              <article className="program-showcase-card program-showcase-card--cv">
                <div className="program-showcase-card__copy">
                  <small>01 · Build</small>
                  <h3>Create a CV your client can claim.</h3>
                </div>
                <div
                  className="program-cv-preview"
                  aria-label="Sample CV preview"
                >
                  <div>
                    <span>SK</span>
                    <p>
                      <strong>Sara Khan</strong>
                      <small>Product Designer</small>
                    </p>
                    <em>Ready to claim</em>
                  </div>
                  <section>
                    <small>Selected experience</small>
                    <strong>Senior Product Designer</strong>
                    <i />
                    <i />
                    <i />
                  </section>
                </div>
              </article>

              <article className="program-showcase-card program-showcase-card--share">
                <div className="program-showcase-card__copy">
                  <small>02 · Share</small>
                  <h3>Turn one idea into a clear path.</h3>
                </div>
                <div
                  className="program-share-preview"
                  aria-label="Sample tracked share"
                >
                  <div className="program-share-preview__post">
                    <span>3 fixes for a CV that gets ignored</span>
                    <strong>Make the first six seconds count.</strong>
                    <small>Partner link · Paid disclosure included</small>
                  </div>
                  <div className="program-share-preview__link">
                    <QrCode aria-hidden="true" />
                    <p>
                      <small>Tracked link</small>
                      <strong>tabbio.com/s/sara</strong>
                    </p>
                    <Check aria-hidden="true" />
                  </div>
                </div>
              </article>

              <article className="program-showcase-card program-showcase-card--track">
                <div className="program-showcase-card__copy">
                  <small>03 · Track</small>
                  <h3>See what is pending, payable, and paid.</h3>
                </div>
                <div
                  className="program-ledger-preview"
                  aria-label="Sample earnings ledger"
                >
                  <div>
                    <small>This month</small>
                    <strong>$382.24</strong>
                    <span>+18% from last month</span>
                  </div>
                  <ul>
                    <li>
                      <span>Pending</span>
                      <strong>$91.38</strong>
                    </li>
                    <li>
                      <span>Payable</span>
                      <strong>$126.47</strong>
                    </li>
                    <li>
                      <span>Paid</span>
                      <strong>$164.39</strong>
                    </li>
                  </ul>
                </div>
              </article>
            </div>
            <p className="program-preview-note">
              Product previews use sample data. No fabricated partner results.
            </p>
          </div>
        </section>

        <section
          id="form"
          className="program-form"
          aria-labelledby="form-title"
        >
          <div className="tabbio-landing-wrap program-form-shell">
            <div className="program-form-intro">
              <div>
                <p className="program-eyebrow">Become a partner</p>
                <h2 id="form-title">
                  Tell us how you help people move forward.
                </h2>
                <p>Short, straightforward questions.</p>
              </div>
              <ul>
                <li>
                  <CircleDollarSign aria-hidden="true" />
                  <span>
                    <strong>30% recurring</strong>
                    On eligible paid subscriptions
                  </span>
                </li>
                <li>
                  <ClipboardCheck aria-hidden="true" />
                  <span>
                    <strong>Human review</strong>
                    No instant or automated approval promise
                  </span>
                </li>
                <li>
                  <BriefcaseBusiness aria-hidden="true" />
                  <span>
                    <strong>Your work matters</strong>
                    Starting small does not disqualify you
                  </span>
                </li>
              </ul>
              <p className="program-form-intro__note">
                Local frontend preview · Nothing is transmitted yet
              </p>
            </div>
            <div className="program-form-panel">
              <PartnerApplicationForm />
            </div>
          </div>
        </section>

        <section className="program-next" aria-labelledby="next-title">
          <div className="tabbio-landing-wrap">
            <p className="program-eyebrow">What happens next</p>
            <h2 id="next-title">Three clear steps.</h2>
            <ol>
              {nextSteps.map(([title, copy], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className="tabbio-faq" aria-labelledby="faq-title">
          <div className="tabbio-landing-wrap">
            <div className="tabbio-faq__heading">
              <h2 id="faq-title">
                Frequently Asked <span>Questions</span>
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
      </main>
      <Footer />
    </div>
  );
}
