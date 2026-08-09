"use client";

/*
 * THESIS: A direct, visual path from useful career work to recurring earnings.
 * COMPOSITION: Direct promise, Tabbio work artifacts, three partner lanes,
 * one-input estimate, product proof, application, review path, FAQ, footer.
 * DEPTH: Expressive Tabbio artifacts carry the hero; quiet neutral surfaces
 * keep every later section immediately scannable.
 * TYPOGRAPHY: Existing Tabbio display hierarchy with short, literal copy.
 * SPACING: Large section rhythm, compact controls, 48px minimum actions.
 * Higgsfield informs conversion order only; Tabbio owns the colors, product
 * language, proof, and M3 interaction behavior.
 */

import {
  ArrowUpRight,
  BarChart3,
  FileText,
  Instagram,
  LayoutDashboard,
  Menu,
  Music2,
  Plus,
  QrCode,
  Video,
  X,
  Youtube,
} from "lucide-react";
import NumberFlow from "@number-flow/react";
import { GraduationCapIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { Button } from "@refref/ui/components/button";

import { BrandMark } from "@/components/brand-mark";
import { PartnerApplicationForm } from "@/components/marketing/partner-application-form";
import {
  balances,
  calculateEstimator,
  formatUsd,
  ledger,
  periodTotals,
} from "@/data/demo-data";
import { publicFaq } from "@/data/marketing";

const PLAN_PRICE = 29.99;
const COMMISSION_RATE = 0.3;
const SIMPLE_ESTIMATE_MONTHS = 12;
const MAX_CUSTOMERS = 1_000_000;

const CUSTOMER_STOPS = [
  ...Array.from({ length: 20 }, (_, index) => index + 1),
  ...Array.from({ length: 16 }, (_, index) => 25 + index * 5),
  ...Array.from({ length: 36 }, (_, index) => 125 + index * 25),
  ...Array.from({ length: 36 }, (_, index) => 1_250 + index * 250),
  ...Array.from({ length: 36 }, (_, index) => 12_500 + index * 2_500),
  ...Array.from({ length: 36 }, (_, index) => 125_000 + index * 25_000),
] as const;

const navItems = [
  ["Who it’s for", "#audiences"],
  ["How it works", "#partner-work"],
  ["Earnings", "#earnings"],
  ["FAQ", "#faq"],
] as const;

const audiencePaths = [
  {
    image: "/images/audience-cv-professional.png",
    imageAlt: "Career professional helping a client review a CV",
    title: "Coaches & CV writers",
    copy: "Client CVs and claim links.",
  },
  {
    image: "/images/audience-ugc-creator.png",
    imageAlt: "UGC creator filming a vertical product video",
    title: "UGC creators",
    copy: "Useful tutorials and reviews.",
  },
  {
    image: "/images/audience-recruiter-agency.png",
    imageAlt: "Recruitment team reviewing candidate profiles together",
    title: "Recruiters & agencies",
    copy: "Candidate subscriptions become extra income.",
  },
] as const;

const nextSteps = [
  ["Say hello", "Tell us what you do."],
  ["We review", "A real person checks the fit."],
  ["Start sharing", "Get your link and tools."],
] as const;

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type CustomerCountInputProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
};

function nearestCustomerStop(value: number) {
  let closestIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  CUSTOMER_STOPS.forEach((stop, index) => {
    const distance = Math.abs(stop - value);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function CustomerCountInput({ id, value, onChange }: CustomerCountInputProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  const update = (raw: string) => {
    setDraft(raw);
    if (!raw.trim()) return;

    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 1) return;

    onChange(Math.min(MAX_CUSTOMERS, Math.round(parsed)));
  };

  const sliderIndex = nearestCustomerStop(value);
  const sliderProgress = (sliderIndex / (CUSTOMER_STOPS.length - 1)) * 100;

  return (
    <div className="tabbio-customer-input">
      <label className="visually-hidden" htmlFor={id}>
        Customers per month
      </label>
      <div className="tabbio-customer-input__value">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_CUSTOMERS}
          step={1}
          value={draft}
          onChange={(event) => update(event.currentTarget.value)}
          onBlur={() => setDraft(String(value))}
        />
      </div>
      <input
        className="tabbio-customer-input__range"
        type="range"
        min={0}
        max={CUSTOMER_STOPS.length - 1}
        step={1}
        value={sliderIndex}
        aria-label="Swipe customers per month"
        aria-valuetext={`${value.toLocaleString("en-US")} new customers per month`}
        style={{ "--slider-progress": `${sliderProgress}%` } as CSSProperties}
        onChange={(event) =>
          onChange(CUSTOMER_STOPS[Number(event.currentTarget.value)] ?? 1)
        }
      />
    </div>
  );
}

function Estimator({
  idPrefix,
  referrals,
  setReferrals,
}: {
  idPrefix: string;
  referrals: number;
  setReferrals: (value: number) => void;
}) {
  const result = calculateEstimator(
    referrals,
    SIMPLE_ESTIMATE_MONTHS,
    SIMPLE_ESTIMATE_MONTHS,
    PLAN_PRICE,
    COMMISSION_RATE,
  );
  const [announcement, setAnnouncement] = useState("");
  const compactResult = result.finalRunRate >= 1_000_000;

  useEffect(() => {
    const timeout = window.setTimeout(
      () =>
        setAnnouncement(
          `Estimated monthly commission after 12 months ${money(result.finalRunRate)}`,
        ),
      350,
    );
    return () => window.clearTimeout(timeout);
  }, [result.finalRunRate]);

  return (
    <section
      className="tabbio-estimator"
      aria-labelledby={`${idPrefix}-estimate-title`}
    >
      <div className="tabbio-estimator__controls">
        <div className="tabbio-estimator__control-heading">
          <h3>New Pro customers each month</h3>
        </div>
        <CustomerCountInput
          id={`${idPrefix}-referrals`}
          value={referrals}
          onChange={setReferrals}
        />
      </div>
      <div className="tabbio-estimator__result">
        <div className="tabbio-estimator__money-art" aria-hidden="true">
          <Image
            src="/images/earnings-money-illustration.webp"
            alt=""
            fill
            sizes="(max-width: 720px) 58vw, 28vw"
          />
        </div>
        <div className="tabbio-estimator__result-heading">
          <p id={`${idPrefix}-estimate-title`}>Estimated monthly</p>
        </div>
        <strong>
          <NumberFlow
            value={result.finalRunRate}
            locales="en-US"
            format={{
              style: "currency",
              currency: "USD",
              notation: compactResult ? "compact" : "standard",
              minimumFractionDigits: compactResult ? 0 : 2,
              maximumFractionDigits: compactResult ? 1 : 2,
            }}
            transformTiming={{
              duration: 240,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            spinTiming={{
              duration: 240,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            opacityTiming={{ duration: 120, easing: "ease-out" }}
            respectMotionPreference
          />
        </strong>
        <p className="tabbio-estimator__result-note">
          After 12 months · 30% of Pro
        </p>
      </div>
      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </section>
  );
}

function HeroStudio() {
  const prefersReducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const frame = window.requestAnimationFrame(() => setPlaying(true));
    return () => window.cancelAnimationFrame(frame);
  }, [prefersReducedMotion]);

  const artifactMotion = (delay: number) => ({
    animate: playing
      ? {
          opacity: [0.82, 1],
          y: [14, 0],
          scale: [0.985, 1],
        }
      : { opacity: 1, y: 0, scale: 1 },
    transition: {
      delay,
      duration: 0.52,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <div
      className="tabbio-hero-studio"
      aria-label="Creators, coaches, and recruiters working with Tabbio"
    >
      <motion.div
        className="tabbio-hero-editorial"
        initial={false}
        {...artifactMotion(0.08)}
      >
        <Image
          src="/images/partner-hero-editorial.webp"
          alt="A UGC creator, career coach, and recruiter working together"
          fill
          priority
          sizes="(max-width: 980px) 92vw, 48vw"
        />
      </motion.div>

      <motion.div
        className="tabbio-hero-stamp"
        initial={false}
        {...artifactMotion(0.42)}
      >
        <Image
          className="tabbio-hero-stamp__money"
          src="/images/earnings-money-illustration.webp"
          alt=""
          fill
          sizes="154px"
          aria-hidden="true"
        />
        <div className="tabbio-hero-stamp__copy">
          <strong>30%</strong>
          <span>recurring</span>
        </div>
      </motion.div>

      <motion.div
        className="tabbio-hero-link-card"
        initial={false}
        {...artifactMotion(0.62)}
      >
        <span>
          <small>Your partner link</small>
          <strong>tabbio.com/r/you</strong>
        </span>
      </motion.div>

      <motion.div
        className="tabbio-hero-badge-card"
        initial={false}
        {...artifactMotion(0.78)}
      >
        <Image
          src="/brand/partner-badges/2026/tabbio-active-partner-2026-stacked-preview.webp"
          alt="Tabbio Active Partner 2026 badge"
          width={942}
          height={526}
        />
      </motion.div>
    </div>
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
          <BrandMark />
        </Link>
        <nav aria-label="Partner program">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="tabbio-marketing-header__actions">
          <Link className="tabbio-sign-in" href="/partner">
            Preview app
          </Link>
          <button
            className="tabbio-menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-partner-nav"
            onClick={() => setOpen((current) => !current)}
          >
            <span className="visually-hidden">
              {open ? "Close navigation" : "Open navigation"}
            </span>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <Link className="tabbio-header-cta" href="#form">
            Join
          </Link>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-partner-nav"
              className="tabbio-mobile-nav"
              aria-label="Mobile partner program"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.99 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {navItems.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              ))}
              <Link href="/partner" onClick={() => setOpen(false)}>
                Preview partner app
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
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
          <Link href="/partners/policies">Policy centre</Link>
          <Link href="/partners/policies/partner-agreement">
            Partner agreement
          </Link>
          <Link href="/partners/policies/privacy-tracking">
            Privacy &amp; tracking
          </Link>
          <Link href="/partners/policies/promotion-disclosure">
            Promotion &amp; disclosure
          </Link>
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

  return (
    <div className="tabbio-public-page">
      <Header />
      <main id="main-content">
        <section className="tabbio-hero" aria-labelledby="partner-hero-title">
          <div className="tabbio-landing-wrap tabbio-hero__grid">
            <div className="tabbio-hero__copy">
              <p className="tabbio-hero__label">Tabbio Partner</p>
              <h1 id="partner-hero-title">
                Help people move forward. Earn with Tabbio.
              </h1>
              <p>
                For creators, coaches, CV writers, recruiters, and agencies.
                Earn 30% on eligible subscriptions.
              </p>
              <div className="tabbio-hero__actions">
                <Button asChild className="tabbio-primary-button">
                  <Link href="#form">Apply now</Link>
                </Button>
                <Link className="tabbio-hero-link" href="/partner">
                  Preview app <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </div>
            <HeroStudio />
          </div>
        </section>

        <section
          id="audiences"
          className="program-audiences"
          aria-labelledby="audiences-title"
        >
          <div className="tabbio-landing-wrap">
            <div className="program-section-heading">
              <h2 id="audiences-title">Made for useful work.</h2>
              <p>Pick your path.</p>
            </div>
            <div className="program-audience-grid">
              {audiencePaths.map(({ image, imageAlt, title, copy }, index) => (
                <article key={title}>
                  <div
                    className="program-audience-card__media"
                    style={{
                      position: "relative",
                      minHeight: 220,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={image}
                      alt={imageAlt}
                      width={1456}
                      height={1092}
                      loading={index === 0 ? "eager" : "lazy"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 33vw"
                    />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="program-paper-bridge" aria-hidden="true">
            <Image
              className="program-paper-bridge__image"
              src="/images/partner-paper-ribbon-landscape.png"
              alt=""
              width={1792}
              height={1075}
              sizes="(max-width: 720px) 96vw, 760px"
            />
          </div>
        </section>

        <section
          id="earnings"
          className="program-estimator"
          aria-labelledby="earnings-title"
        >
          <div className="tabbio-landing-wrap">
            <div className="program-section-heading">
              <h2 id="earnings-title">Estimate earnings.</h2>
            </div>
            <Estimator
              idPrefix="earnings"
              referrals={referrals}
              setReferrals={setReferrals}
            />
          </div>
        </section>

        <section
          id="partner-work"
          className="program-showcase program-showcase--app"
          aria-labelledby="showcase-title"
        >
          <div className="tabbio-landing-wrap">
            <div className="program-showcase-heading">
              <div>
                <h2 id="showcase-title">Create. Share. Track.</h2>
              </div>
              <Link href="/partner">
                Open demo <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>

            <div className="program-app-preview">
              <aside aria-label="Partner app preview navigation">
                <BrandMark light compact />
                <nav>
                  <span className="is-active">
                    <LayoutDashboard aria-hidden="true" /> Overview
                  </span>
                  <span>
                    <FileText aria-hidden="true" /> Clients
                  </span>
                  <span>
                    <Video aria-hidden="true" /> Create
                  </span>
                  <span>
                    <QrCode aria-hidden="true" /> Links
                  </span>
                  <span>
                    <BarChart3 aria-hidden="true" /> Earnings
                  </span>
                </nav>
              </aside>
              <div className="program-app-preview__main">
                <header>
                  <div>
                    <strong>Partner overview</strong>
                  </div>
                  <span>Demo data</span>
                </header>
                <div className="program-app-preview__metrics">
                  <article className="program-app-preview__balance">
                    <small>Next payout</small>
                    <strong>{formatUsd(balances.payable)}</strong>
                  </article>
                  <article>
                    <small>Clicks</small>
                    <strong>
                      {periodTotals.clicks.toLocaleString("en-US")}
                    </strong>
                  </article>
                  <article>
                    <small>Signups</small>
                    <strong>
                      {periodTotals.signups.toLocaleString("en-US")}
                    </strong>
                  </article>
                  <article>
                    <small>Paying</small>
                    <strong>
                      {periodTotals.paying.toLocaleString("en-US")}
                    </strong>
                  </article>
                </div>
                <div className="program-app-preview__workspace">
                  <section aria-labelledby="preview-next-task">
                    <div>
                      <h3 id="preview-next-task">Create something useful.</h3>
                    </div>
                    <div className="program-app-preview__actions">
                      <span>
                        <GraduationCapIcon
                          weight="duotone"
                          aria-hidden="true"
                        />{" "}
                        Create a client CV
                      </span>
                      <span>
                        <Video aria-hidden="true" /> Draft UGC content
                      </span>
                      <span>
                        <QrCode aria-hidden="true" /> Create tracked link
                      </span>
                    </div>
                  </section>
                  <section aria-labelledby="preview-ledger-title">
                    <div>
                      <h3 id="preview-ledger-title">Recent earnings.</h3>
                    </div>
                    <ul>
                      {ledger.slice(0, 3).map((entry) => (
                        <li key={entry.id}>
                          <span>
                            <strong>{entry.description}</strong>
                            <small>{entry.status}</small>
                          </span>
                          <em>{formatUsd(entry.commission)}</em>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </div>
            <p className="program-preview-note">Demo data only.</p>
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
                <h2 id="form-title">Apply to Tabbio Partner.</h2>
                <p>Two quick steps.</p>
              </div>
              <div className="program-form-portrait">
                <Image
                  src="/images/partner-apply-editorial.webp"
                  alt="A career creator working on a CV and recording an app tutorial"
                  fill
                  sizes="(max-width: 980px) 100vw, 36vw"
                />
                <span aria-hidden="true">30% recurring</span>
              </div>
              <Link className="program-form-badge" href="/partner/resources">
                <Image
                  src="/brand/partner-badges/2026/tabbio-active-partner-2026-stacked-preview.webp"
                  alt="Tabbio Active Partner 2026 badge"
                  width={942}
                  height={526}
                />
                <span>
                  <strong>Your Partner badge</strong>
                  <small>Shows you&apos;re an active Tabbio Partner.</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <div className="program-form-panel">
              <PartnerApplicationForm />
            </div>
          </div>
        </section>

        <section className="program-next" aria-labelledby="next-title">
          <div className="tabbio-landing-wrap">
            <h2 id="next-title">Three steps. That’s it.</h2>
            <ol>
              {nextSteps.map(([title, copy], index) => (
                <li key={title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className="tabbio-faq" aria-labelledby="faq-title">
          <div className="tabbio-landing-wrap">
            <div className="tabbio-faq__heading">
              <h2 id="faq-title">Questions.</h2>
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
