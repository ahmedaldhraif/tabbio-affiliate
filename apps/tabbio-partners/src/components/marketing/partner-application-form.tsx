"use client";

import { CheckCircle2 } from "lucide-react";
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
import type {
  PartnerApplicationDraft,
  PartnerLane,
} from "@/data/partner-application";

const storageKey = "tabbio-partner-application-draft-v2";

const laneDescriptions: Record<PartnerLane, string> = {
  "UGC creator": "Short-form demos, reviews, and tutorials",
  "Career coach": "Career guidance and client transformation",
  "CV writer": "CV creation, delivery, and claim links",
  "Recruiter or talent specialist": "Candidate guidance and handoffs",
  Agency: "Career, recruitment, or creator services",
  Other: "Another useful way to introduce Tabbio",
};

export function PartnerApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<PartnerApplicationDraft>(
    emptyPartnerApplication,
  );
  const [loaded, setLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validatePartnerApplication(draft);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

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
        <p className="program-eyebrow">Saved on this device</p>
        <h3>Application preview complete</h3>
        <p>
          Nothing was sent. Open the demo Partner area to see the experience
          after approval, or return to your answers.
        </p>
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
      <div className="partner-form-row">
        <label className="partner-field">
          <span>First name *</span>
          <input
            value={draft.firstName}
            placeholder="Ahmed"
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
            aria-describedby={errors.email ? "partner-email-error" : undefined}
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
        <legend>Choose your primary lane *</legend>
        <p>Choose the closest match. You can change it later.</p>
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
                <strong>{lane}</strong>
                <small>{laneDescriptions[lane]}</small>
              </span>
            </label>
          ))}
        </div>
        {errors.lane && (
          <small id="partner-lane-error" role="alert">
            {errors.lane}
          </small>
        )}
      </fieldset>

      <label className="partner-field">
        <span>Best work or profile link</span>
        <input
          value={draft.profileUrl}
          placeholder="https://instagram.com/..."
          type="url"
          inputMode="url"
          aria-invalid={Boolean(errors.profileUrl)}
          aria-describedby={`partner-profile-hint${
            errors.profileUrl ? " partner-profile-error" : ""
          }`}
          onChange={(event) => update("profileUrl", event.target.value)}
        />
        <small id="partner-profile-hint" className="partner-field-hint">
          Instagram, TikTok, LinkedIn, YouTube, portfolio, or website.
        </small>
        {errors.profileUrl && (
          <small id="partner-profile-error" role="alert">
            {errors.profileUrl}
          </small>
        )}
      </label>

      <label className="partner-field">
        <span>About your work *</span>
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
          {aboutPrompt}
        </small>
        {errors.about && (
          <small id="partner-about-error" role="alert">
            {errors.about}
          </small>
        )}
      </label>

      <label className="partner-consent">
        <input
          type="checkbox"
          checked={draft.agreed}
          aria-invalid={Boolean(errors.agreed)}
          aria-describedby={errors.agreed ? "partner-consent-error" : undefined}
          onChange={(event) => update("agreed", event.target.checked)}
        />
        <span>
          I confirm this information is accurate and I agree to the current
          program terms. *
        </span>
      </label>
      {errors.agreed && (
        <small
          id="partner-consent-error"
          className="partner-consent-error"
          role="alert"
        >
          {errors.agreed}
        </small>
      )}

      <button className="partner-submit" type="submit">
        Save application preview
      </button>
      <p className="partner-form-note">
        Local preview only. No application is sent until a backend is connected.
      </p>
    </form>
  );
}
