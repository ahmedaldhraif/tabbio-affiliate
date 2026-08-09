"use client";

import { Check, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  emptyPartnerApplication,
  partnerChannels,
  partnerLanes,
  partnerReachOptions,
  readPartnerApplication,
  toggleApplicationValue,
  validatePartnerApplication,
} from "@/data/partner-application";
import type { PartnerApplicationDraft } from "@/data/partner-application";

const storageKey = "tabbio-partner-application-draft-v1";

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
      const saved = window.localStorage.getItem(storageKey);
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
        <h3>Application ready</h3>
        <p>
          This frontend preview saved your answers on this device. Connect the
          application API later to send them for review.
        </p>
        <button type="button" onClick={() => setSubmitted(false)}>
          Review answers
        </button>
      </div>
    );
  }

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
          <span>Business email *</span>
          <input
            value={draft.email}
            placeholder="you@company.com"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={`partner-email-hint${
              errors.email ? " partner-email-error" : ""
            }`}
            onChange={(event) => update("email", event.target.value)}
          />
          <small id="partner-email-hint" className="partner-field-hint">
            Use the email you want linked to your partner account.
          </small>
          {errors.email && (
            <small id="partner-email-error" role="alert">
              {errors.email}
            </small>
          )}
        </label>
      </div>

      <fieldset
        className="partner-choice-group"
        aria-describedby={errors.lanes ? "partner-lanes-error" : undefined}
      >
        <legend>How do you help people? *</legend>
        <div className="partner-choice-list">
          {partnerLanes.map((lane) => {
            const selected = draft.lanes.includes(lane);
            return (
              <button
                key={lane}
                type="button"
                aria-pressed={selected}
                aria-invalid={Boolean(errors.lanes)}
                onClick={() =>
                  update("lanes", toggleApplicationValue(draft.lanes, lane))
                }
              >
                {selected && <Check aria-hidden="true" />}
                {lane}
              </button>
            );
          })}
        </div>
        {errors.lanes && (
          <small id="partner-lanes-error" role="alert">
            {errors.lanes}
          </small>
        )}
      </fieldset>

      <fieldset
        className="partner-choice-group"
        aria-describedby={
          errors.channels ? "partner-channels-error" : undefined
        }
      >
        <legend>Where do you reach people? *</legend>
        <div className="partner-choice-list">
          {partnerChannels.map((channel) => {
            const selected = draft.channels.includes(channel);
            return (
              <button
                key={channel}
                type="button"
                aria-pressed={selected}
                aria-invalid={Boolean(errors.channels)}
                onClick={() =>
                  update(
                    "channels",
                    toggleApplicationValue(draft.channels, channel),
                  )
                }
              >
                {selected && <Check aria-hidden="true" />}
                {channel}
              </button>
            );
          })}
        </div>
        {errors.channels && (
          <small id="partner-channels-error" role="alert">
            {errors.channels}
          </small>
        )}
      </fieldset>

      <fieldset
        className="partner-choice-group"
        aria-describedby={errors.reach ? "partner-reach-error" : undefined}
      >
        <legend>People you help in a typical month *</legend>
        <div className="partner-choice-list partner-choice-list--single">
          {partnerReachOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={draft.reach === option}
              aria-invalid={Boolean(errors.reach)}
              onClick={() => update("reach", option)}
            >
              {draft.reach === option && <Check aria-hidden="true" />}
              {option}
            </button>
          ))}
        </div>
        {errors.reach && (
          <small id="partner-reach-error" role="alert">
            {errors.reach}
          </small>
        )}
      </fieldset>

      <label className="partner-field">
        <span>Tell us about your work and how you would use Tabbio *</span>
        <textarea
          value={draft.about}
          placeholder="What you do, who you help, and the first thing you would share."
          rows={5}
          aria-invalid={Boolean(errors.about)}
          aria-describedby={errors.about ? "partner-about-error" : undefined}
          onChange={(event) => update("about", event.target.value)}
        />
        {errors.about && (
          <small id="partner-about-error" role="alert">
            {errors.about}
          </small>
        )}
      </label>

      <div className="partner-form-row">
        <label className="partner-field">
          <span>Professional profile</span>
          <input
            value={draft.profileUrl}
            placeholder="https://linkedin.com/in/..."
            type="url"
            inputMode="url"
            aria-invalid={Boolean(errors.profileUrl)}
            aria-describedby={
              errors.profileUrl ? "partner-profile-error" : undefined
            }
            onChange={(event) => update("profileUrl", event.target.value)}
          />
          {errors.profileUrl && (
            <small id="partner-profile-error" role="alert">
              {errors.profileUrl}
            </small>
          )}
        </label>
        <label className="partner-field">
          <span>Best recent work</span>
          <input
            value={draft.workUrl}
            placeholder="https://"
            type="url"
            inputMode="url"
            aria-invalid={Boolean(errors.workUrl)}
            aria-describedby={`partner-work-hint${
              errors.workUrl ? " partner-work-error" : ""
            }`}
            onChange={(event) => update("workUrl", event.target.value)}
          />
          <small id="partner-work-hint" className="partner-field-hint">
            A CV, post, video, or portfolio you are proud of.
          </small>
          {errors.workUrl && (
            <small id="partner-work-error" role="alert">
              {errors.workUrl}
            </small>
          )}
        </label>
      </div>

      <label className="partner-field partner-field--country">
        <span>Country</span>
        <input
          value={draft.country}
          placeholder="United Arab Emirates"
          autoComplete="country-name"
          onChange={(event) => update("country", event.target.value)}
        />
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
        Submit application
      </button>
      <p className="partner-form-note">
        Local preview only. No application is sent until a backend is connected.
      </p>
    </form>
  );
}
