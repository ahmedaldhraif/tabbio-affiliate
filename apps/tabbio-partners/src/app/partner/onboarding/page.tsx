"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CloudOff,
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@refref/ui/components/alert";
import { Button } from "@refref/ui/components/button";
import { Card } from "@refref/ui/components/card";
import { Checkbox } from "@refref/ui/components/checkbox";
import { Input } from "@refref/ui/components/input";
import { Label } from "@refref/ui/components/label";
import { Progress } from "@refref/ui/components/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@refref/ui/components/select";
import { Skeleton } from "@refref/ui/components/skeleton";
import { Textarea } from "@refref/ui/components/textarea";

import { DEMO_RESET_EVENT, useDemo } from "@/components/demo-provider";
import { PageHeader, StatusBadge } from "@/components/shared";
import { readScenarioState } from "@/components/tools/browser-actions";
import { partnerLanes } from "@/data/partner-application";
import { PROGRAM_POLICY_VERSION } from "@/data/program-policy";

const STORAGE_KEY = "tabbio-partner-onboarding-local-v1";
const AGREEMENT_VERSION = PROGRAM_POLICY_VERSION;

type OnboardingData = {
  publicName: string;
  lane: string;
  audience: string;
  territory: string;
  channels: string[];
  experience: string;
  acceptsProgram: boolean;
  acceptsResponsibility: boolean;
  acceptsPrivacy: boolean;
};

type StoredOnboarding = {
  step: number;
  complete: boolean;
  savedAt: string;
  data: OnboardingData;
};

const emptyData: OnboardingData = {
  publicName: "",
  lane: "",
  audience: "",
  territory: "",
  channels: [],
  experience: "",
  acceptsProgram: false,
  acceptsResponsibility: false,
  acceptsPrivacy: false,
};

const steps = ["Your work", "Where you share", "Program rules", "Review"];
const channelOptions = [
  "LinkedIn",
  "Instagram",
  "TikTok",
  "YouTube",
  "Newsletter",
  "Client CVs",
  "Workshops",
  "Other",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function readOnboardingData(value: unknown): OnboardingData {
  if (!isRecord(value)) return { ...emptyData };

  const channels = Array.isArray(value.channels)
    ? [
        ...new Set(
          value.channels.filter(
            (item): item is string =>
              typeof item === "string" && channelOptions.includes(item),
          ),
        ),
      ]
    : [];
  const lane = readString(value.lane);
  const migratedLane =
    lane === "Career services"
      ? "Career coach"
      : lane === "Creator / educator"
        ? "UGC creator"
        : lane;

  return {
    publicName: readString(value.publicName),
    lane: partnerLanes.includes(migratedLane as (typeof partnerLanes)[number])
      ? migratedLane
      : "",
    audience: readString(value.audience),
    territory: readString(value.territory),
    channels,
    experience: readString(value.experience),
    acceptsProgram: value.acceptsProgram === true,
    acceptsResponsibility: value.acceptsResponsibility === true,
    acceptsPrivacy: value.acceptsPrivacy === true,
  };
}

function hasCompleteOnboardingData(data: OnboardingData) {
  return Boolean(
    data.publicName.trim() &&
      data.lane &&
      data.audience.trim() &&
      data.territory.trim() &&
      data.channels.length > 0 &&
      data.experience.trim() &&
      data.acceptsProgram &&
      data.acceptsResponsibility &&
      data.acceptsPrivacy,
  );
}

function readStoredOnboarding(value: unknown): StoredOnboarding | null {
  if (!isRecord(value)) return null;

  const data = readOnboardingData(value.data);
  const rawStep =
    typeof value.step === "number" && Number.isFinite(value.step)
      ? Math.trunc(value.step)
      : 0;
  const savedAt =
    typeof value.savedAt === "string" &&
    Number.isFinite(Date.parse(value.savedAt))
      ? value.savedAt
      : "";

  return {
    step: Math.min(3, Math.max(0, rawStep)),
    complete: value.complete === true && hasCompleteOnboardingData(data),
    savedAt,
    data,
  };
}

function writeStoredOnboarding(value: StoredOnboarding) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function OnboardingSkeleton() {
  return (
    <div className="app-page space-y-6" aria-label="Loading onboarding">
      <Skeleton className="h-24 w-full max-w-2xl rounded-2xl" />
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-[420px] w-full rounded-2xl" />
    </div>
  );
}

export default function OnboardingPage() {
  const { saveSettings, settings } = useDemo();
  const [ready, setReady] = useState(false);
  const [scenario, setScenario] = useState("default");
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [data, setData] = useState<OnboardingData>(emptyData);
  const [savedAt, setSavedAt] = useState("");
  const [error, setError] = useState("");
  const [persistenceAvailable, setPersistenceAvailable] = useState<
    boolean | null
  >(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const autosaveGenerationRef = useRef(0);
  const skipNextAutosaveRef = useRef(false);
  const hasUserChangeRef = useRef(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef(0);

  useEffect(() => {
    const resetMountedOnboarding = () => {
      autosaveGenerationRef.current += 1;
      if (autosaveTimerRef.current !== null) {
        window.clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
      skipNextAutosaveRef.current = true;
      hasUserChangeRef.current = false;
      previousStepRef.current = -1;
      setStep(0);
      setComplete(false);
      setData({ ...emptyData });
      setSavedAt("");
      setError("");
      setPersistenceAvailable(null);
    };

    window.addEventListener(DEMO_RESET_EVENT, resetMountedOnboarding);
    setScenario(readScenarioState());
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = readStoredOnboarding(JSON.parse(stored) as unknown);
        if (parsed) {
          setData(parsed.data);
          setStep(parsed.step);
          previousStepRef.current = parsed.step;
          setComplete(parsed.complete);
          setSavedAt(parsed.savedAt);
        }
      }
    } catch {
      setError(
        "Your saved setup could not be read. A fresh local draft is open instead.",
      );
    }
    setReady(true);

    return () => {
      autosaveGenerationRef.current += 1;
      if (autosaveTimerRef.current !== null) {
        window.clearTimeout(autosaveTimerRef.current);
      }
      window.removeEventListener(DEMO_RESET_EVENT, resetMountedOnboarding);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }
    if (!hasUserChangeRef.current) return;

    const generation = autosaveGenerationRef.current + 1;
    autosaveGenerationRef.current = generation;
    const timer = window.setTimeout(() => {
      if (generation !== autosaveGenerationRef.current) return;
      const nextSavedAt = new Date().toISOString();
      const stored: StoredOnboarding = {
        step,
        complete,
        savedAt: nextSavedAt,
        data,
      };
      if (writeStoredOnboarding(stored)) {
        setSavedAt(nextSavedAt);
        setPersistenceAvailable(true);
      } else {
        setPersistenceAvailable(false);
        setError(
          "This browser blocked local saving. Keep this tab open so your entries are not lost.",
        );
      }
      autosaveTimerRef.current = null;
    }, 350);
    autosaveTimerRef.current = timer;
    return () => {
      if (autosaveTimerRef.current === timer) {
        window.clearTimeout(timer);
        autosaveTimerRef.current = null;
      }
    };
  }, [complete, data, ready, step]);

  useEffect(() => {
    if (!ready || complete || previousStepRef.current === step) return;
    previousStepRef.current = step;
    stepHeadingRef.current?.focus();
  }, [complete, ready, step]);

  const savedLabel = useMemo(() => {
    if (!savedAt) return "Saving starts after your first change";
    return `Saved locally at ${new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(savedAt))}`;
  }, [savedAt]);

  const update = <Key extends keyof OnboardingData>(
    key: Key,
    value: OnboardingData[Key],
  ) => {
    hasUserChangeRef.current = true;
    setData((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const validateStep = (index: number) => {
    if (
      index === 0 &&
      (!data.publicName.trim() || !data.lane || !data.audience.trim())
    ) {
      setError(
        "Add your public name, partner lane, and audience before continuing.",
      );
      return false;
    }
    if (
      index === 1 &&
      (!data.territory.trim() ||
        data.channels.length === 0 ||
        !data.experience.trim())
    ) {
      setError(
        "Add your territory, at least one promotion channel, and a short experience note.",
      );
      return false;
    }
    if (
      index === 2 &&
      (!data.acceptsProgram ||
        !data.acceptsResponsibility ||
        !data.acceptsPrivacy)
    ) {
      setError(
        "Confirm all three prototype declarations before reviewing your setup.",
      );
      return false;
    }
    setError("");
    return true;
  };

  const continueForward = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(3, current + 1));
  };

  const finish = () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) return;

    const nextSavedAt = new Date().toISOString();
    const saved = writeStoredOnboarding({
      step: 3,
      complete: true,
      savedAt: nextSavedAt,
      data,
    });
    autosaveGenerationRef.current += 1;
    if (autosaveTimerRef.current !== null) {
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    setPersistenceAvailable(saved);
    if (saved) {
      setSavedAt(nextSavedAt);
      setError("");
    } else {
      setError(
        "This browser blocked local saving. Your setup remains available while this tab stays open.",
      );
    }
    saveSettings({
      ...settings,
      publicName: data.publicName.trim(),
      audience: data.audience.trim(),
      lane: data.lane,
      slug: slugify(data.publicName) || settings.slug,
    });
    setComplete(true);
  };

  if (!ready || scenario === "loading") return <OnboardingSkeleton />;

  if (complete) {
    return (
      <div className="app-page">
        <div className="mx-auto max-w-3xl py-4 lg:py-10">
          <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-[#eaf7ef] text-[#28744f]">
            <Check className="size-7" aria-hidden="true" />
          </div>
          <PageHeader
            title={
              persistenceAvailable === false
                ? "Your setup is ready in this tab"
                : "Your local setup is saved"
            }
            description={
              persistenceAvailable === false
                ? "Local storage is blocked, so keep this tab open to retain your answers. Nothing was sent to Tabbio."
                : "This browser can resume your answers. No application, check, agreement, or payout account was sent to Tabbio."
            }
          />
          <Card className="gap-0 overflow-hidden rounded-2xl border-[#e5e7eb] py-0 shadow-none">
            <div className="grid gap-px bg-[#e5e7eb] sm:grid-cols-2">
              {[
                {
                  label: "Application",
                  status:
                    persistenceAvailable === false ? "Tab only" : "Demo only",
                  note:
                    persistenceAvailable === false
                      ? "Available in memory until this tab closes"
                      : "Saved in this browser, not submitted",
                },
                {
                  label: "Program membership",
                  status: "No membership",
                  note: "No production partner record exists",
                },
                {
                  label: "Promotion checks",
                  status: "Not configured",
                  note: "No jurisdiction service is connected",
                },
                {
                  label: "Payout account",
                  status: "Not connected",
                  note: "No payout provider is attached",
                },
              ].map((item) => (
                <div key={item.label} className="bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{item.label}</h2>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-h-11 rounded-xl">
              <Link href="/partner">
                Go to partner overview
                <ArrowRight />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-h-11 rounded-xl"
              onClick={() => {
                hasUserChangeRef.current = true;
                setComplete(false);
                setStep(0);
              }}
            >
              Edit answers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Local application"
        title="Set up your partner profile"
        description="Four short steps, saved in this browser. External reviews and provider checks are not connected in this prototype."
      />

      <section aria-label="Onboarding progress" className="mb-6">
        <p className="sr-only" role="status" aria-live="polite" aria-atomic>
          Step {step + 1} of 4: {steps[step]}
        </p>
        <div className="mb-3 flex items-center justify-between gap-4 text-sm">
          <strong>
            Step {step + 1} of 4 · {steps[step]}
          </strong>
          <span className="flex items-center gap-1.5 text-[#6b7280]">
            <Save className="size-4" aria-hidden="true" />
            {savedLabel}
          </span>
        </div>
        <Progress
          value={(step + 1) * 25}
          aria-label={`${(step + 1) * 25}% complete`}
          aria-valuetext={`Step ${step + 1} of 4: ${steps[step]}`}
        />
        <ol className="mt-3 hidden grid-cols-4 gap-2 text-xs text-[#6b7280] sm:grid">
          {steps.map((label, index) => (
            <li
              key={label}
              className={index <= step ? "font-semibold text-[#4b23c6]" : ""}
            >
              {label}
            </li>
          ))}
        </ol>
      </section>

      {(error || scenario === "error") && (
        <Alert
          variant="destructive"
          className="mb-5 rounded-xl"
          aria-live="assertive"
        >
          <CircleAlert aria-hidden="true" />
          <AlertTitle>
            {scenario === "error"
              ? "Remote checks are unavailable"
              : "Check this step"}
          </AlertTitle>
          <AlertDescription>
            {scenario === "error"
              ? "No application or compliance service is connected. Your local answers are still safe in this browser."
              : error}
          </AlertDescription>
        </Alert>
      )}

      <Card className="rounded-2xl border-[#e5e7eb] p-5 shadow-none sm:p-7">
        {step === 0 && (
          <section aria-labelledby="step-one-title">
            <h2
              ref={stepHeadingRef}
              id="step-one-title"
              tabIndex={-1}
              className="text-xl font-semibold"
            >
              Tell people what you do
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              This shapes your local public-page preview. You can change it
              later.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="public-name">Public name</Label>
                <Input
                  id="public-name"
                  value={data.publicName}
                  onChange={(event) => update("publicName", event.target.value)}
                  placeholder="e.g. Mohamed B."
                  className="h-11 rounded-xl"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lane">Partner lane</Label>
                <Select
                  value={data.lane}
                  onValueChange={(value) => update("lane", value)}
                >
                  <SelectTrigger id="lane" className="h-11 w-full rounded-xl">
                    <SelectValue placeholder="Choose your lane" />
                  </SelectTrigger>
                  <SelectContent>
                    {partnerLanes.map((lane) => (
                      <SelectItem key={lane} value={lane}>
                        {lane}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="audience">Who do you help?</Label>
                <Input
                  id="audience"
                  value={data.audience}
                  onChange={(event) => update("audience", event.target.value)}
                  placeholder="e.g. Career changers making their first CV"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs leading-5 text-[#6b7280]">
                  Keep this specific enough for a visitor to recognise
                  themselves.
                </p>
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section aria-labelledby="step-two-title">
            <h2
              ref={stepHeadingRef}
              id="step-two-title"
              tabIndex={-1}
              className="text-xl font-semibold"
            >
              Where will you share useful work?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              This does not connect or publish to any channel.
            </p>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="territory">Country or territory</Label>
                <Input
                  id="territory"
                  value={data.territory}
                  onChange={(event) => update("territory", event.target.value)}
                  placeholder="e.g. United Arab Emirates"
                  className="h-11 rounded-xl"
                  autoComplete="country-name"
                />
                <p className="text-xs leading-5 text-[#6b7280]">
                  Used only for this local prototype. It does not run a legal or
                  permit check.
                </p>
              </div>
              <fieldset>
                <legend className="text-sm font-medium">
                  Promotion channels
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {channelOptions.map((channel) => {
                    const selected = data.channels.includes(channel);
                    return (
                      <label
                        key={channel}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 text-sm font-medium ${selected ? "border-[#b8a6ff] bg-[#f4f1ff] text-[#4721bd]" : "border-[#e5e7eb]"}`}
                      >
                        <Checkbox
                          checked={selected}
                          onCheckedChange={(checked) =>
                            update(
                              "channels",
                              checked
                                ? [...data.channels, channel]
                                : data.channels.filter(
                                    (item) => item !== channel,
                                  ),
                            )
                          }
                        />
                        {channel}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="space-y-2">
                <Label htmlFor="experience">Relevant experience</Label>
                <Textarea
                  id="experience"
                  value={data.experience}
                  onChange={(event) => update("experience", event.target.value)}
                  placeholder="Describe the work you already do with this audience."
                  className="min-h-28 rounded-xl"
                />
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="step-three-title">
            <h2
              ref={stepHeadingRef}
              id="step-three-title"
              tabIndex={-1}
              className="text-xl font-semibold"
            >
              Confirm the prototype rules
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              These acknowledgements are stored locally. They are not a signed
              production agreement.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#514a58]">
              Review the complete{" "}
              <Link
                className="focus-ring rounded font-semibold text-[#5a2aff] underline underline-offset-4"
                href="/partners/policies"
              >
                Partner Policy Centre
              </Link>{" "}
              before continuing.
            </p>
            <div className="mt-6 space-y-3">
              {[
                [
                  "acceptsProgram",
                  "I reviewed the partner agreement and commission schedule",
                  `${AGREEMENT_VERSION}. Legal and Finance approval is still pending.`,
                ],
                [
                  "acceptsResponsibility",
                  "I reviewed the promotion, disclosure, and brand rules",
                  "I remain responsible for every claim and disclosure I publish.",
                ],
                [
                  "acceptsPrivacy",
                  "I reviewed the privacy and tracking notice",
                  "I will not place client, candidate, CV, email, or other personal data in referral URLs.",
                ],
              ].map(([key, label, note]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e5e7eb] p-4"
                >
                  <Checkbox
                    className="mt-1"
                    checked={
                      data[
                        key as keyof Pick<
                          OnboardingData,
                          | "acceptsProgram"
                          | "acceptsResponsibility"
                          | "acceptsPrivacy"
                        >
                      ]
                    }
                    onCheckedChange={(checked) =>
                      update(key as keyof OnboardingData, Boolean(checked))
                    }
                  />
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#6b7280]">
                      {note}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#f3f4f6] p-4 text-sm leading-6 text-[#4a4a4d]">
              <CloudOff
                className="mt-0.5 size-5 shrink-0 text-[#6b7280]"
                aria-hidden="true"
              />
              <p>
                <strong>No external submission.</strong> Completing this step
                cannot activate membership, verify eligibility, or connect a
                payout provider.
              </p>
            </div>
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="step-four-title">
            <h2
              ref={stepHeadingRef}
              id="step-four-title"
              tabIndex={-1}
              className="text-xl font-semibold"
            >
              Review what will be saved
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              Finish creates a resumable local demo only.
            </p>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#e5e7eb] sm:grid-cols-2">
              {[
                ["Public name", data.publicName],
                ["Partner lane", data.lane],
                ["Audience", data.audience],
                ["Territory", data.territory],
                ["Channels", data.channels.join(", ")],
                ["Agreement", AGREEMENT_VERSION],
              ].map(([label, value]) => (
                <div key={label} className="bg-white p-4">
                  <dt className="text-xs font-medium text-[#6b7280]">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <h3 className="text-sm font-semibold">
                Checks after this local step
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Application", status: "Demo only" },
                  { label: "Promotion eligibility", status: "Not configured" },
                  { label: "Payout account", status: "Not connected" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-[#f6f6f7] p-3">
                    <p className="text-xs text-[#6b7280]">{item.label}</p>
                    <div className="mt-2">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#eceef0] pt-5">
          <Button
            variant="ghost"
            className="min-h-11 rounded-xl"
            disabled={step === 0}
            onClick={() => {
              hasUserChangeRef.current = true;
              setError("");
              setStep((current) => Math.max(0, current - 1));
            }}
          >
            <ArrowLeft />
            Back
          </Button>
          {step < 3 ? (
            <Button className="min-h-11 rounded-xl" onClick={continueForward}>
              Continue
              <ArrowRight />
            </Button>
          ) : (
            <Button className="min-h-11 rounded-xl" onClick={finish}>
              <ShieldCheck />
              Finish local setup
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
