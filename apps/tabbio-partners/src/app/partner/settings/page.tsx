"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  Clipboard,
  ExternalLink,
  Info,
  LockKeyhole,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@refref/ui/components/alert";
import { Button } from "@refref/ui/components/button";
import { Card } from "@refref/ui/components/card";
import { Input } from "@refref/ui/components/input";
import { Label } from "@refref/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@refref/ui/components/select";
import { Skeleton } from "@refref/ui/components/skeleton";
import { Switch } from "@refref/ui/components/switch";
import { Textarea } from "@refref/ui/components/textarea";

import { useDemo } from "@/components/demo-provider";
import { PageHeader, StatusBadge } from "@/components/shared";
import {
  copyText,
  readScenarioState,
} from "@/components/tools/browser-actions";
import type { PartnerSettings } from "@/data/demo-data";

const notificationRows: Array<{
  key: keyof Pick<
    PartnerSettings,
    | "commissionChanges"
    | "payoutUpdates"
    | "complianceReminders"
    | "productResources"
  >;
  label: string;
  description: string;
}> = [
  {
    key: "commissionChanges",
    label: "Commission changes",
    description: "Local previews for rule or balance updates.",
  },
  {
    key: "payoutUpdates",
    label: "Payout updates",
    description: "Prototype notices about payout state changes.",
  },
  {
    key: "complianceReminders",
    label: "Program check reminders",
    description: "Local reminders when a future check needs attention.",
  },
  {
    key: "productResources",
    label: "New partner resources",
    description: "Prototype updates when a local guide or file changes.",
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function SettingsSkeleton() {
  return (
    <div className="app-page space-y-5" aria-label="Loading settings">
      <Skeleton className="h-24 max-w-2xl rounded-2xl" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-[680px] rounded-2xl" />
        <Skeleton className="h-[440px] rounded-2xl" />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { ready, settings, saveSettings } = useDemo();
  const [form, setForm] = useState<PartnerSettings>(settings);
  const [scenario, setScenario] = useState("default");
  const [origin, setOrigin] = useState("http://localhost:3100");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setScenario(readScenarioState());
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (ready) setForm(settings);
  }, [ready, settings]);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(settings),
    [form, settings],
  );
  const previewUrl = `${origin}/partners/${form.slug || "your-name"}`;

  const update = <Key extends keyof PartnerSettings>(
    key: Key,
    value: PartnerSettings[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanSlug = slugify(form.slug);
    if (
      !form.publicName.trim() ||
      !form.audience.trim() ||
      !form.lane ||
      !cleanSlug
    ) {
      setError(
        "Add a public name, audience, lane, and valid page slug before saving.",
      );
      return;
    }
    const next = {
      ...form,
      publicName: form.publicName.trim(),
      audience: form.audience.trim(),
      slug: cleanSlug,
    };
    saveSettings(next);
    setForm(next);
    setSaved(true);
    setError("");
    toast.success("Settings saved in this browser");
  };

  const copyPreviewUrl = async () => {
    try {
      await copyText(previewUrl);
      setCopied(true);
      toast.success("Preview URL copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch (copyError) {
      setError(
        copyError instanceof Error
          ? copyError.message
          : "Copy is unavailable in this browser.",
      );
    }
  };

  if (!ready || scenario === "loading") return <SettingsSkeleton />;

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Browser settings"
        title="Partner settings"
        description="Manage the local public profile and notification preferences. Provider, agreement, and security states remain separate and honest."
        actions={
          <Button
            form="partner-settings-form"
            type="submit"
            className="min-h-11 rounded-xl"
            disabled={!dirty && !error}
          >
            <Save />
            Save changes
          </Button>
        }
      />

      {(error || scenario === "error") && (
        <Alert
          variant="destructive"
          className="mb-5 rounded-xl"
          aria-live="assertive"
        >
          <Info aria-hidden="true" />
          <AlertTitle>
            {scenario === "error"
              ? "Connected settings are unavailable"
              : "Check your profile"}
          </AlertTitle>
          <AlertDescription>
            {scenario === "error"
              ? "No account, notification, compliance, or payout service is connected. Local browser settings remain editable."
              : error}
          </AlertDescription>
        </Alert>
      )}

      {saved && !dirty && (
        <Alert
          className="mb-5 rounded-xl border-[#bfe2cc] bg-[#f0faf4] text-[#246844]"
          role="status"
        >
          <Check aria-hidden="true" />
          <AlertTitle>Saved locally</AlertTitle>
          <AlertDescription className="text-[#326e4d]">
            Your profile and notification choices now persist in this browser.
            Nothing was sent to a server.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form
          id="partner-settings-form"
          onSubmit={submit}
          className="min-w-0 space-y-6"
        >
          <Card className="min-w-0 rounded-2xl border-[#e5e7eb] p-5 shadow-none sm:p-6">
            <div className="flex min-w-0 flex-col items-start gap-3 min-[600px]:flex-row">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eee9ff] text-[#5a2aff]">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">Public profile</h2>
                <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                  These fields update the preview beside the form. The page is
                  not published.
                </p>
              </div>
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Public name</Label>
                <Input
                  id="settings-name"
                  value={form.publicName}
                  onChange={(event) => update("publicName", event.target.value)}
                  className="h-11 rounded-xl"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-lane">Partner lane</Label>
                <Select
                  value={form.lane}
                  onValueChange={(value) => update("lane", value)}
                >
                  <SelectTrigger
                    id="settings-lane"
                    className="h-11 w-full min-w-0 rounded-xl"
                  >
                    <SelectValue placeholder="Choose a lane" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Career services">
                      Career services
                    </SelectItem>
                    <SelectItem value="Creator / educator">
                      Creator / educator
                    </SelectItem>
                    <SelectItem value="Agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-audience">Audience</Label>
                <Textarea
                  id="settings-audience"
                  value={form.audience}
                  onChange={(event) => update("audience", event.target.value)}
                  className="min-h-24 rounded-xl"
                  placeholder="Who do you help?"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="settings-slug">Public page slug</Label>
                <div className="flex min-w-0 items-center rounded-xl border border-[#e5e7eb] bg-white focus-within:border-[#5a2aff] focus-within:ring-3 focus-within:ring-[#5a2aff]/20">
                  <span className="hidden shrink-0 pl-3 text-sm text-[#6b7280] sm:block">
                    /partners/
                  </span>
                  <Input
                    id="settings-slug"
                    value={form.slug}
                    onChange={(event) => update("slug", event.target.value)}
                    onBlur={() => update("slug", slugify(form.slug))}
                    className="h-11 border-0 shadow-none focus-visible:ring-0"
                    aria-describedby="slug-help"
                  />
                </div>
                <p id="slug-help" className="text-xs leading-5 text-[#6b7280]">
                  Lowercase letters, numbers, and hyphens. Preview only, not a
                  live route.
                </p>
              </div>
            </div>
          </Card>

          <Card className="min-w-0 rounded-2xl border-[#e5e7eb] p-5 shadow-none sm:p-6">
            <div className="flex min-w-0 flex-col items-start gap-3 min-[600px]:flex-row">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f3f4f6] text-[#4a4a4d]">
                <Bell className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                  Saved preferences only. No email, push, or webhook delivery is
                  connected.
                </p>
              </div>
            </div>
            <div className="divide-y divide-[#eceef0]">
              {notificationRows.map((row) => (
                <div
                  key={row.key}
                  className="flex min-h-20 flex-col items-start gap-3 py-3 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between min-[600px]:gap-5"
                >
                  <div>
                    <Label
                      htmlFor={`notification-${row.key}`}
                      className="leading-5"
                    >
                      {row.label}
                    </Label>
                    <p
                      id={`notification-${row.key}-detail`}
                      className="mt-1 text-xs leading-5 text-[#6b7280]"
                    >
                      {row.description}
                    </p>
                  </div>
                  <span className="relative inline-flex size-11 shrink-0 [&>input]:left-full">
                    <Switch
                      id={`notification-${row.key}`}
                      checked={form[row.key]}
                      onCheckedChange={(checked) => update(row.key, checked)}
                      aria-describedby={`notification-${row.key}-detail`}
                    />
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex min-w-0 flex-col items-stretch gap-3 rounded-2xl bg-[#f6f6f7] p-4 min-[600px]:flex-row min-[600px]:flex-wrap min-[600px]:items-center min-[600px]:justify-between">
            <p className="text-sm text-[#59606c]">
              {dirty
                ? "You have unsaved local changes."
                : "Your local settings match the saved browser copy."}
            </p>
            <Button
              type="submit"
              className="min-h-11 w-full whitespace-normal rounded-xl min-[600px]:w-auto"
              disabled={!dirty && !error}
            >
              <Save />
              Save changes
            </Button>
          </div>
        </form>

        <aside
          className="min-w-0 space-y-6 xl:sticky xl:top-6"
          aria-label="Settings preview and account checks"
        >
          <Card className="min-w-0 overflow-hidden rounded-2xl border-[#ded7f8] p-0 shadow-none">
            <div className="bg-[#241153] p-5 text-white">
              <div className="flex flex-col items-start gap-2 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between">
                <span className="text-xs font-semibold text-[#ddd5f5]">
                  Public page preview
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
                  Not published
                </span>
              </div>
              <div className="mt-10 grid size-12 place-items-center rounded-full bg-white text-sm font-bold text-[#241153]">
                {form.publicName
                  ? form.publicName
                      .split(/\s+/)
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "YP"}
              </div>
              <h2 className="mt-4 text-2xl font-semibold">
                {form.publicName || "Your public name"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#ddd5f5]">
                {form.audience || "Describe the people you help."}
              </p>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-[#6b7280]">
                  Partner lane
                </span>
                <span className="text-sm font-semibold">
                  {form.lane || "Not set"}
                </span>
              </div>
              <div className="mt-4 rounded-xl bg-[#f6f6f7] p-3">
                <p className="break-all text-xs leading-5 text-[#59606c]">
                  {previewUrl}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-3 min-h-11 w-full rounded-xl"
                type="button"
                onClick={copyPreviewUrl}
              >
                {copied ? <Check /> : <Clipboard />}
                {copied ? "Copied preview URL" : "Copy preview URL"}
              </Button>
              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#6b7280]">
                <ExternalLink
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                This preview URL is display-only and may not resolve.
              </p>
            </div>
          </Card>

          <section aria-labelledby="checks-title">
            <div className="mb-3">
              <h2 id="checks-title" className="text-xl font-semibold">
                Account checks
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Independent states with no inferred approval.
              </p>
            </div>
            <Card className="min-w-0 gap-0 overflow-hidden rounded-2xl border-[#e5e7eb] py-0 shadow-none">
              {[
                {
                  label: "Program agreement",
                  status: "Demo only",
                  detail:
                    "No signed agreement or acceptance evidence is stored.",
                },
                {
                  label: "Advertiser permit",
                  status: "Not configured",
                  detail:
                    "No jurisdiction decision tree or document review is connected.",
                },
                {
                  label: "Payout account",
                  status: "Not connected",
                  detail: "No payout provider or bank destination is attached.",
                },
                {
                  label: "Account security",
                  status: "Not connected",
                  detail:
                    "Password and step-up authentication belong to the main Tabbio account.",
                },
              ].map((check, index) => (
                <div
                  key={check.label}
                  className={`p-4 ${index ? "border-t border-[#eceef0]" : ""}`}
                >
                  <div className="flex flex-col items-start gap-2 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between">
                    <h3 className="text-sm font-semibold">{check.label}</h3>
                    <StatusBadge status={check.status} />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#6b7280]">
                    {check.detail}
                  </p>
                </div>
              ))}
            </Card>
          </section>

          <div className="flex items-start gap-3 rounded-2xl bg-[#f6f6f7] p-4">
            <LockKeyhole
              className="mt-0.5 size-5 shrink-0 text-[#5a2aff]"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-semibold">
                Sensitive changes stay elsewhere
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#59606c]">
                Email, password, two-factor authentication, payout destination,
                and tax details require the canonical Tabbio security flow. This
                prototype does not simulate those changes.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
