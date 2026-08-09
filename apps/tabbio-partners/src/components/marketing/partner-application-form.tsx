"use client";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  emptyPartnerApplication,
  isPartnerLane,
  lanePrompts,
  partnerLanes,
  readPartnerApplication,
  validatePartnerApplication,
} from "@/data/partner-application";
import type { PartnerApplicationDraft } from "@/data/partner-application";

const storageKey = "tabbio-partner-application-draft-v2";

const firstStepFields = ["firstName", "email", "lane"] as const;

export function PartnerApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<PartnerApplicationDraft>(
    emptyPartnerApplication,
  );
  const [loaded, setLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const current = window.localStorage.getItem(storageKey);
      const previous = window.localStorage.getItem(
        "tabbio-partner-application-draft-v1",
      );
      const saved = current ?? previous;
      if (saved) setDraft(readPartnerApplication(JSON.parse(saved)));
    } catch {
      // The form still works when storage is unavailable.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || submitted) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      // Saving a draft is helpful, not required.
    }
  }, [draft, loaded, submitted]);

  const update = <Key extends keyof PartnerApplicationDraft>(
    key: Key,
    value: PartnerApplicationDraft[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const focusFirstError = (nextErrors: Record<string, string>) => {
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validatePartnerApplication(draft);

    if (step === 1) {
      const nextErrors = Object.fromEntries(
        firstStepFields.flatMap((field) =>
          validationErrors[field] ? [[field, validationErrors[field]]] : [],
        ),
      );

      if (Object.keys(nextErrors).length > 0) {
        focusFirstError(nextErrors);
        return;
      }

      setErrors({});
      setStep(2);
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>("input")?.focus();
      });
      return;
    }

    focusFirstError(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitted(true);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      // The success state remains truthful without storage.
    }
  };

  if (submitted) {
    return (
      <div className="partner-form-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <h3>Your preview is ready.</h3>
        <p>See what your Partner workspace will feel like.</p>
        <div className="partner-form-success__actions">
          <Link className="partner-submit" href="/partner">
            Open demo Partner area
          </Link>
          <button type="button" onClick={() => setSubmitted(false)}>
            Review answers
          </button>
        </div>
      </div>
    );
  }

  const aboutPrompt = isPartnerLane(draft.lane)
    ? lanePrompts[draft.lane]
    : "Tell us what you do, who you help, and how Tabbio fits into your work.";

  return (
    <form
      ref={formRef}
      className="partner-application"
      noValidate
      onSubmit={submit}
    >
      <div className="partner-form-progress" aria-label={`Step ${step} of 2`}>
        <div>
          <span>Step {step} of 2</span>
          <strong>{step === 1 ? "About you" : "Your work"}</strong>
        </div>
        <div className="partner-form-progress__track" aria-hidden="true">
          <span className="is-active" />
          <span className={step === 2 ? "is-active" : undefined} />
        </div>
      </div>

      {step === 1 ? (
        <>
          <div className="partner-form-row">
            <label className="partner-field">
              <span>First name *</span>
              <input
                value={draft.firstName}
                placeholder="Your first name"
                autoComplete="given-name"
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={
                  errors.firstName ? "partner-first-name-error" : undefined
                }
                onChange={(event) => update("firstName", event.target.value)}
              />
              {errors.firstName && (
                <small id="partner-first-name-error" role="alert">
                  {errors.firstName}
                </small>
              )}
            </label>
            <label className="partner-field">
              <span>Email *</span>
              <input
                value={draft.email}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "partner-email-error" : undefined
                }
                onChange={(event) => update("email", event.target.value)}
              />
              {errors.email && (
                <small id="partner-email-error" role="alert">
                  {errors.email}
                </small>
              )}
            </label>
          </div>

          <fieldset
            className="partner-choice-group partner-lane-group"
            aria-describedby={errors.lane ? "partner-lane-error" : undefined}
          >
            <legend>Which best describes your work? *</legend>
            <p>Choose the closest match.</p>
            <div className="partner-lane-list">
              {partnerLanes.map((lane) => (
                <label key={lane} className="partner-lane-option">
                  <input
                    type="radio"
                    name="partner-lane"
                    value={lane}
                    checked={draft.lane === lane}
                    aria-invalid={Boolean(errors.lane)}
                    onChange={() => update("lane", lane)}
                  />
                  <span>
                    <strong>
                      {lane === "Other" ? "Something else" : lane}
                    </strong>
                  </span>
                </label>
              ))}
            </div>
            {draft.lane === "Other" && (
              <label className="partner-field partner-lane-other-field">
                <span>Describe your work (optional)</span>
                <input
                  value={draft.otherWork}
                  placeholder="e.g. Community manager"
                  maxLength={80}
                  onChange={(event) => update("otherWork", event.target.value)}
                />
              </label>
            )}
            {errors.lane && (
              <small id="partner-lane-error" role="alert">
                {errors.lane}
              </small>
            )}
          </fieldset>

          <div className="partner-step-actions partner-step-actions--continue">
            <button className="partner-submit" type="submit">
              Continue <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="partner-step-summary">
            <span>
              <strong>{draft.firstName}</strong>
              <small>
                {draft.lane === "Other" && draft.otherWork.trim()
                  ? draft.otherWork
                  : draft.lane === "Other"
                    ? "Something else"
                    : draft.lane}
              </small>
            </span>
            <button type="button" onClick={() => setStep(1)}>
              Edit
            </button>
          </div>

          <label className="partner-field">
            <span>Work link (optional)</span>
            <input
              value={draft.profileUrl}
              placeholder="https://your-best-work.com"
              type="url"
              inputMode="url"
              aria-invalid={Boolean(errors.profileUrl)}
              aria-describedby={`partner-profile-hint${
                errors.profileUrl ? " partner-profile-error" : ""
              }`}
              onChange={(event) => update("profileUrl", event.target.value)}
            />
            <small id="partner-profile-hint" className="partner-field-hint">
              Profile, channel, portfolio, or website.
            </small>
            {errors.profileUrl && (
              <small id="partner-profile-error" role="alert">
                {errors.profileUrl}
              </small>
            )}
          </label>

          <label className="partner-field">
            <span>How do you work? *</span>
            <textarea
              value={draft.about}
              placeholder={aboutPrompt}
              rows={4}
              aria-invalid={Boolean(errors.about)}
              aria-describedby={`partner-about-hint${
                errors.about ? " partner-about-error" : ""
              }`}
              onChange={(event) => update("about", event.target.value)}
            />
            <small id="partner-about-hint" className="partner-field-hint">
              A few sentences are enough.
            </small>
            {errors.about && (
              <small id="partner-about-error" role="alert">
                {errors.about}
              </small>
            )}
          </label>

          <div className="partner-consent-row">
            <label className="partner-consent">
              <input
                type="checkbox"
                checked={draft.agreed}
                aria-invalid={Boolean(errors.agreed)}
                aria-describedby={
                  errors.agreed ? "partner-consent-error" : undefined
                }
                onChange={(event) => update("agreed", event.target.checked)}
              />
              <span>
                I confirm my information and reviewed the partner agreement,
                commission schedule, promotion policy, and privacy notice. *
              </span>
            </label>
            <Link href="/partners/policies">Review policies</Link>
          </div>
          {errors.agreed && (
            <small
              id="partner-consent-error"
              className="partner-consent-error"
              role="alert"
            >
              {errors.agreed}
            </small>
          )}

          <div className="partner-step-actions">
            <button
              className="partner-secondary-button"
              type="button"
              onClick={() => setStep(1)}
            >
              <ArrowLeft aria-hidden="true" /> Back
            </button>
            <button className="partner-submit" type="submit">
              Save preview
            </button>
          </div>
          <p className="partner-form-note">
            Saved locally. Nothing is sent yet.
          </p>
        </>
      )}
    </form>
  );
}
