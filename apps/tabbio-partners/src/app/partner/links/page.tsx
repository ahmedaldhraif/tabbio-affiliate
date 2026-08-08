"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Check,
  Clipboard,
  Download,
  ExternalLink,
  Info,
  Link2,
  Plus,
  QrCode,
  RotateCcw,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
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

import { useDemo } from "@/components/demo-provider";
import {
  EmptyState,
  MetricCard,
  PageHeader,
  StatusBadge,
} from "@/components/shared";
import {
  copyText,
  downloadSvgElement,
  readScenarioState,
} from "@/components/tools/browser-actions";
import type { LinkRow } from "@/data/demo-data";

const destinationLabels: Record<string, string> = {
  "/": "Partner landing",
  "/partners": "Program overview",
  "/partner": "Partner demo",
};

function safeDestination(destination?: string) {
  return destination && destination in destinationLabels ? destination : "/";
}

function LinksSkeleton() {
  return (
    <div className="app-page space-y-5" aria-label="Loading links">
      <Skeleton className="h-24 max-w-2xl rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
      <Skeleton className="h-[420px] rounded-2xl" />
    </div>
  );
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function LinksPage() {
  const { links, settings, addLink, updateLink } = useDemo();
  const [scenario, setScenario] = useState("default");
  const [origin, setOrigin] = useState("http://localhost:3100");
  const [selectedId, setSelectedId] = useState("main");
  const [channel, setChannel] = useState("LinkedIn");
  const [campaign, setCampaign] = useState("");
  const [destination, setDestination] = useState("/");
  const [filter, setFilter] = useState("active");
  const [error, setError] = useState("");
  const [copiedTarget, setCopiedTarget] = useState("");

  useEffect(() => {
    setScenario(readScenarioState());
    setOrigin(window.location.origin);
  }, []);

  const effectiveLinks = scenario === "empty" ? [] : links;
  const activeLinks = effectiveLinks.filter((link) => !link.archived);
  const filteredLinks = effectiveLinks.filter(
    (link) =>
      filter === "all" ||
      (filter === "archived" ? link.archived : !link.archived),
  );
  const totals = useMemo(
    () =>
      activeLinks.reduce(
        (sum, link) => ({
          clicks: sum.clicks + link.clicks,
          signups: sum.signups + link.signups,
          paying: sum.paying + link.paying,
        }),
        { clicks: 0, signups: 0, paying: 0 },
      ),
    [activeLinks],
  );
  const selectedLink = links.find((link) => link.id === selectedId);

  const getLinkUrl = (link?: LinkRow) => {
    const query = new URLSearchParams({
      partner: settings.slug,
      destination: safeDestination(link?.destination),
    });
    if (link) query.set("link", link.id);
    return `${origin}/r/demo?${query.toString()}`;
  };
  const selectedUrl = getLinkUrl(selectedLink);
  const selectedLabel = selectedLink?.campaign ?? "Main partner link";
  const selectedDestination = safeDestination(selectedLink?.destination);

  const copyLink = async (value: string, id: string) => {
    try {
      await copyText(value);
      setCopiedTarget(id);
      toast.success("Link copied");
      window.setTimeout(() => setCopiedTarget(""), 1800);
    } catch (copyError) {
      setError(
        copyError instanceof Error
          ? copyError.message
          : "Copy is unavailable in this browser.",
      );
    }
  };

  const createTrackedLink = () => {
    if (!campaign.trim()) {
      setError("Give this tracked link a campaign name.");
      return;
    }
    const id = `local-${Date.now()}`;
    addLink({
      id,
      channel,
      campaign: campaign.trim(),
      destination,
      clicks: 0,
      signups: 0,
      paying: 0,
    });
    setSelectedId(id);
    setCampaign("");
    setFilter("active");
    setError("");
    toast.success("Tracked link created locally");
  };

  const toggleArchive = (link: LinkRow) => {
    updateLink(link.id, { archived: !link.archived });
    toast.success(
      link.archived ? "Link restored locally" : "Link archived locally",
    );
  };

  if (scenario === "loading") return <LinksSkeleton />;

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Local referral tools"
        title="Links and QR codes"
        description="Create browser-only tracked links, keep every QR tied to its visible target, and review one coherent demo dataset."
        actions={
          <Button
            className="min-h-11 rounded-xl"
            onClick={() =>
              document
                .getElementById("create-link")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Plus />
            Create tracked link
          </Button>
        }
      />

      {(error || scenario === "error") && (
        <Alert variant="destructive" className="mb-5 rounded-xl">
          <Info aria-hidden="true" />
          <AlertTitle>
            {scenario === "error"
              ? "Tracking is not connected"
              : "Link action needs attention"}
          </AlertTitle>
          <AlertDescription>
            {scenario === "error"
              ? "These URLs and counts are a local simulation. No redirect, click capture, or attribution service is running."
              : error}
          </AlertDescription>
        </Alert>
      )}

      <section
        aria-labelledby="main-link-title"
        className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <Card className="min-w-0 rounded-2xl border-[#ded7f8] bg-[#faf9ff] p-5 shadow-none sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#5a2aff]">
                Main partner link
              </p>
              <h2 id="main-link-title" className="mt-1 text-2xl font-semibold">
                One clean URL for general sharing
              </h2>
            </div>
            <StatusBadge status="Demo only" />
          </div>
          <div className="mt-1 flex min-w-0 flex-col gap-3 rounded-xl bg-white p-3 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 break-all text-sm text-[#4a4a4d]">
              {getLinkUrl()}
            </code>
            <Button
              variant="outline"
              className="min-h-11 rounded-xl"
              onClick={() => copyLink(getLinkUrl(), "main-copy")}
            >
              {copiedTarget === "main-copy" ? <Check /> : <Clipboard />}
              {copiedTarget === "main-copy" ? "Copied" : "Copy link"}
            </Button>
          </div>
          <p className="flex items-start gap-2 text-xs leading-5 text-[#5e6470]">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            The URL uses this page&apos;s current local origin. It is not a live
            redirect or tracking endpoint.
          </p>
        </Card>

        <Card className="min-w-0 items-center rounded-2xl border-[#e5e7eb] p-5 text-center shadow-none">
          <div className="flex w-full items-start justify-between gap-3 text-left">
            <div>
              <p className="text-sm font-semibold">QR preview</p>
              <p className="mt-1 max-w-52 truncate text-xs text-[#5e6470]">
                {selectedLabel}
              </p>
            </div>
            <QrCode className="size-5 text-[#5a2aff]" aria-hidden="true" />
          </div>
          <figure
            aria-describedby="qr-target"
            className="rounded-xl bg-white p-3 ring-1 ring-[#e5e7eb]"
          >
            <QRCodeSVG
              id="partner-link-qr"
              value={selectedUrl}
              size={168}
              level="M"
              bgColor="#ffffff"
              fgColor="#2b2b2b"
              title={`QR code for ${selectedLabel}`}
            />
          </figure>
          <p
            id="qr-target"
            className="w-full break-all text-left text-xs leading-5 text-[#5e6470]"
          >
            Encodes: {selectedUrl}
          </p>
          <p className="w-full text-left text-xs font-medium text-[#5e6470]">
            Preview continues to: {destinationLabels[selectedDestination]}
          </p>
          <div className="grid w-full grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="min-h-11 rounded-xl"
              onClick={() => copyLink(selectedUrl, "qr-copy")}
            >
              <Clipboard />
              Copy
            </Button>
            <Button
              variant="outline"
              className="min-h-11 rounded-xl"
              onClick={() => {
                try {
                  downloadSvgElement(
                    "partner-link-qr",
                    `tabbio-${selectedId}-qr.svg`,
                  );
                  toast.success("QR downloaded");
                } catch (downloadError) {
                  setError(
                    downloadError instanceof Error
                      ? downloadError.message
                      : "QR download is unavailable.",
                  );
                }
              }}
            >
              <Download />
              QR SVG
            </Button>
          </div>
        </Card>
      </section>

      <section className="mt-6" aria-labelledby="active-totals-title">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="active-totals-title" className="text-lg font-semibold">
              Active-link totals
            </h2>
            <p className="mt-1 text-xs text-[#6b7280]">
              Last 30 days across active demo links. A signup is attributed
              after accepted account association; paying means at least one
              eligible settled payment.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#6b7280]">
            {activeLinks.length} active links
          </span>
        </div>
        <div className="metric-grid grid gap-4">
          <MetricCard
            label="Clicks"
            value={formatCount(totals.clicks)}
            note="Eligible tracked visits"
            icon={ExternalLink}
          />
          <MetricCard
            label="Attributed signups"
            value={formatCount(totals.signups)}
            note={`${totals.clicks ? ((totals.signups / totals.clicks) * 100).toFixed(1) : "0.0"}% of clicks`}
            icon={Link2}
          />
          <MetricCard
            label="Paying customers"
            value={formatCount(totals.paying)}
            note={`${totals.signups ? ((totals.paying / totals.signups) * 100).toFixed(1) : "0.0"}% of signups`}
            icon={Check}
          />
        </div>
      </section>

      <section
        id="create-link"
        className="mt-8 scroll-mt-6"
        aria-labelledby="create-link-title"
      >
        <Card className="min-w-0 rounded-2xl border-[#e5e7eb] p-5 shadow-none sm:p-6">
          <div>
            <h2 id="create-link-title" className="text-xl font-semibold">
              Create a tracked link
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#6b7280]">
              Choose an allowlisted local destination. New links start with zero
              activity.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="link-channel">Channel</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger
                  id="link-channel"
                  className="h-11 w-full rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "LinkedIn",
                    "Client CV",
                    "YouTube",
                    "Newsletter",
                    "Workshop",
                    "Other",
                  ].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-campaign">Campaign name</Label>
              <Input
                id="link-campaign"
                value={campaign}
                onChange={(event) => {
                  setCampaign(event.target.value);
                  setError("");
                }}
                placeholder="e.g. September workshop"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-destination">Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger
                  id="link-destination"
                  className="h-11 w-full rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="/">Partner landing</SelectItem>
                  <SelectItem value="/partners">Partner program</SelectItem>
                  <SelectItem value="/partner">Partner demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs leading-5 text-[#5e6470]">
              Only the public partner slug and local demo choices are added. No
              email or client details appear in the URL.
            </p>
            <Button className="min-h-11 rounded-xl" onClick={createTrackedLink}>
              <Plus />
              Create local link
            </Button>
          </div>
        </Card>
      </section>

      <section className="mt-8" aria-labelledby="tracked-links-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="tracked-links-title" className="text-xl font-semibold">
              Tracked links
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Select QR to make that exact URL the current QR target.
            </p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger
              className="min-h-11 min-w-36 rounded-xl"
              aria-label="Filter tracked links"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="all">All links</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredLinks.length ? (
          <>
            <div className="hidden overflow-x-auto rounded-2xl border border-[#e5e7eb] md:block">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <caption className="visually-hidden">
                  Tracked link activity and local actions
                </caption>
                <thead className="bg-[#f6f6f7] text-xs text-[#59606c]">
                  <tr>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Campaign
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Destination
                    </th>
                    <th
                      className="px-4 py-3 text-right font-semibold"
                      scope="col"
                    >
                      Clicks
                    </th>
                    <th
                      className="px-4 py-3 text-right font-semibold"
                      scope="col"
                    >
                      Signups
                    </th>
                    <th
                      className="px-4 py-3 text-right font-semibold"
                      scope="col"
                    >
                      Paying
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      State
                    </th>
                    <th
                      className="px-4 py-3 text-right font-semibold"
                      scope="col"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="border-t border-[#eceef0]">
                      <td className="px-4 py-4">
                        <strong className="block">{link.campaign}</strong>
                        <span className="mt-1 block text-xs text-[#6b7280]">
                          {link.channel}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#4a4a4d]">
                        {link.destination}
                      </td>
                      <td className="px-4 py-4 text-right tabular">
                        {link.clicks}
                      </td>
                      <td className="px-4 py-4 text-right tabular">
                        {link.signups}
                      </td>
                      <td className="px-4 py-4 text-right tabular">
                        {link.paying}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          status={link.archived ? "Archived" : "Active"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant={
                              selectedId === link.id ? "secondary" : "ghost"
                            }
                            className="min-h-11 rounded-xl"
                            onClick={() => {
                              setSelectedId(link.id);
                              document
                                .getElementById("main-link-title")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            <QrCode />
                            QR
                          </Button>
                          <Button
                            variant="ghost"
                            className="min-h-11 rounded-xl"
                            onClick={() =>
                              copyLink(getLinkUrl(link), `copy-${link.id}`)
                            }
                          >
                            {copiedTarget === `copy-${link.id}` ? (
                              <Check />
                            ) : (
                              <Clipboard />
                            )}
                            {copiedTarget === `copy-${link.id}`
                              ? "Copied"
                              : "Copy"}
                          </Button>
                          <Button
                            variant="ghost"
                            className="min-h-11 rounded-xl"
                            onClick={() => toggleArchive(link)}
                          >
                            {link.archived ? <RotateCcw /> : <Archive />}
                            {link.archived ? "Restore" : "Archive"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 md:hidden">
              {filteredLinks.map((link) => (
                <article
                  key={link.id}
                  className="min-w-0 rounded-2xl border border-[#e5e7eb] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold">{link.campaign}</h3>
                      <p className="mt-1 text-xs text-[#6b7280]">
                        {link.channel} · {link.destination}
                      </p>
                    </div>
                    <StatusBadge
                      status={link.archived ? "Archived" : "Active"}
                    />
                  </div>
                  <dl className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-[#f6f6f7] p-3 text-center min-[600px]:grid-cols-3">
                    <div>
                      <dt className="text-[11px] text-[#5e6470]">Clicks</dt>
                      <dd className="mt-1 font-semibold tabular">
                        {link.clicks}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#5e6470]">Signups</dt>
                      <dd className="mt-1 font-semibold tabular">
                        {link.signups}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-[#5e6470]">Paying</dt>
                      <dd className="mt-1 font-semibold tabular">
                        {link.paying}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 grid grid-cols-1 gap-1 min-[600px]:grid-cols-3">
                    <Button
                      variant="ghost"
                      className="min-h-11 rounded-xl px-2"
                      onClick={() => setSelectedId(link.id)}
                    >
                      <QrCode />
                      QR
                    </Button>
                    <Button
                      variant="ghost"
                      className="min-h-11 rounded-xl px-2"
                      onClick={() =>
                        copyLink(getLinkUrl(link), `mobile-${link.id}`)
                      }
                    >
                      <Clipboard />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      className="min-h-11 rounded-xl px-2"
                      onClick={() => toggleArchive(link)}
                    >
                      {link.archived ? <RotateCcw /> : <Archive />}
                      {link.archived ? "Restore" : "Archive"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title={
              filter === "archived"
                ? "No archived links"
                : "No tracked links in this view"
            }
            description={
              filter === "archived"
                ? "Archived links stay recoverable here."
                : "Create a local tracked link or change the filter to see saved links."
            }
            action={
              <Button
                variant="outline"
                className="min-h-11 rounded-xl"
                onClick={() => {
                  setFilter("all");
                  document
                    .getElementById("create-link")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Plus />
                Create a link
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
