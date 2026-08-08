"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import {
  Check,
  Clipboard,
  Download,
  FileJson,
  FileText,
  Info,
  LoaderCircle,
  PackageOpen,
  Palette,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@refref/ui/components/alert";
import { Button } from "@refref/ui/components/button";
import { Card } from "@refref/ui/components/card";
import { Skeleton } from "@refref/ui/components/skeleton";

import { EmptyState, PageHeader, StatusBadge } from "@/components/shared";
import {
  copyText,
  downloadBlob,
  downloadText,
  readScenarioState,
} from "@/components/tools/browser-actions";

const VERSION = "Prototype 2026-08-09";
const introCopy =
  "Turn a PDF CV into one live link that stays easy to share and update.";
const disclosureCopy =
  "I may earn a commission if you subscribe through this link.";

const resources = [
  {
    name: "Tabbio mark",
    filename: "tabbio-mark.svg",
    href: "/brand/tabbio-mark.svg",
    type: "SVG",
    size: "504 B",
    bytes: 504,
    checksum:
      "2766FC7166139B39F2A2567A3998442BA6480D052D830B84A9076B513C3C14F3",
    preview: true,
  },
  {
    name: "Tabbio lockup",
    filename: "tabbio-lockup.svg",
    href: "/brand/tabbio-lockup.svg",
    type: "SVG",
    size: "652 B",
    bytes: 652,
    checksum:
      "0F8C99AA14CE408B01A5C79B9DB8E8669C4C596631F2D4FAFF3E2A35AEEA4775",
    preview: true,
  },
  {
    name: "Brand tokens",
    filename: "tabbio-brand-tokens.json",
    href: "/brand/tabbio-brand-tokens.json",
    type: "JSON",
    size: "379 B",
    bytes: 379,
    checksum:
      "2F59C1D8E3F0F47A880E0160E1905D3FF64A24A826B705E1489511E5BF625A4A",
    preview: false,
  },
  {
    name: "Prototype partner copy",
    filename: "approved-partner-copy.txt",
    href: "/brand/approved-partner-copy.txt",
    type: "TXT",
    size: "354 B",
    bytes: 354,
    checksum:
      "12719C600F1550C8EDAB4FA683CA5C4818CF8C2747FC1230EF548DCA17960307",
    preview: false,
  },
  {
    name: "Partner playbook",
    filename: "partner-playbook.md",
    href: "/brand/partner-playbook.md",
    type: "Markdown",
    size: "759 B",
    bytes: 759,
    checksum:
      "C8ADDE1A1C9FAFC10F6CD7713C411118994AB191437D6AAED9874371DC5918F1",
    preview: false,
  },
] as const;

const promotionRules = [
  {
    title: "Disclose the relationship",
    detail:
      "Place a clear partner disclosure close to every tracked link so people understand that you may earn a commission.",
  },
  {
    title: "Use claims you can verify",
    detail:
      "Describe real Tabbio capabilities. Do not promise job offers, hiring outcomes, partner income, or guaranteed results.",
  },
  {
    title: "Respect each channel",
    detail:
      "Follow the advertising, sponsorship, and disclosure rules for every country and platform where your content appears.",
  },
  {
    title: "Keep referral URLs private-data free",
    detail:
      "Never add a client name, email, CV detail, or other personal information to a tracked link or QR code.",
  },
  {
    title: "Protect brand terms",
    detail:
      "Do not buy ads on protected Tabbio brand terms unless the approved production program terms explicitly allow it.",
  },
] as const;

function ResourcesSkeleton() {
  return (
    <div className="app-page space-y-5" aria-label="Loading resources">
      <Skeleton className="h-24 max-w-2xl rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [scenario, setScenario] = useState("default");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [buildingKit, setBuildingKit] = useState(false);

  useEffect(() => setScenario(readScenarioState()), []);

  const copyResource = async (value: string, key: string) => {
    try {
      await copyText(value);
      setCopied(key);
      toast.success("Copy saved to your clipboard");
      window.setTimeout(() => setCopied(""), 1800);
    } catch (copyError) {
      setError(
        copyError instanceof Error
          ? copyError.message
          : "Copy is unavailable in this browser.",
      );
    }
  };

  const buildManifest = () => ({
    name: "Tabbio partner prototype kit",
    version: VERSION,
    status:
      "Local prototype. Legal and brand approval required before production use.",
    files: resources.map(({ name, filename, href, type, bytes, checksum }) => ({
      name,
      filename,
      url: href,
      mediaType: type,
      bytes,
      sha256: checksum,
    })),
    copy: { introduction: introCopy, partnerDisclosure: disclosureCopy },
    promotionRules,
  });

  const downloadManifest = () => {
    const manifest = buildManifest();
    downloadText(
      "tabbio-partner-prototype-kit-manifest.json",
      JSON.stringify(manifest, null, 2),
      "application/json;charset=utf-8",
    );
    toast.success("Kit manifest downloaded");
  };

  const downloadFullKit = async () => {
    setBuildingKit(true);
    setError("");
    try {
      const zip = new JSZip();
      await Promise.all(
        resources.map(async (resource) => {
          const response = await fetch(resource.href);
          if (!response.ok)
            throw new Error(`${resource.filename} could not be loaded.`);
          zip.file(resource.filename, await response.arrayBuffer());
        }),
      );
      zip.file("manifest.json", JSON.stringify(buildManifest(), null, 2));
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob("tabbio-partner-kit-prototype.zip", blob);
      toast.success("Full prototype kit downloaded");
    } catch (kitError) {
      setError(
        kitError instanceof Error
          ? kitError.message
          : "The full kit could not be built. Download files individually instead.",
      );
    } finally {
      setBuildingKit(false);
    }
  };

  if (scenario === "loading") return <ResourcesSkeleton />;

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Prototype library"
        title="Resources for useful promotion"
        description="Download the real local prototype files, copy working text, and check the rule behind each share."
        actions={
          <Button
            className="min-h-11 rounded-xl"
            onClick={downloadFullKit}
            disabled={buildingKit}
          >
            {buildingKit ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <PackageOpen />
            )}
            {buildingKit ? "Building local kit…" : "Download full kit"}
          </Button>
        }
      />

      <Alert className="mb-6 rounded-xl border-[#d9cffd] bg-[#f5f1ff] text-[#3e1b9d]">
        <ShieldAlert aria-hidden="true" />
        <AlertTitle>Local prototype files</AlertTitle>
        <AlertDescription className="text-[#5737a6]">
          These files are downloadable and versioned for this prototype. They
          are not an officially approved production brand kit, legal disclosure,
          or promotion policy.
        </AlertDescription>
      </Alert>

      {(error || scenario === "error") && (
        <Alert variant="destructive" className="mb-6 rounded-xl">
          <Info aria-hidden="true" />
          <AlertTitle>
            {scenario === "error"
              ? "Resource sync is not connected"
              : "Copy action failed"}
          </AlertTitle>
          <AlertDescription>
            {scenario === "error"
              ? "The local files below can still download. No remote resource library or approval workflow is configured."
              : error}
          </AlertDescription>
        </Alert>
      )}

      {scenario === "empty" ? (
        <EmptyState
          title="No production kit is connected"
          description="This state represents a workspace before approved resources are published. The local prototype kit remains available for testing."
          action={
            <Button
              variant="outline"
              className="min-h-11 rounded-xl"
              onClick={downloadFullKit}
              disabled={buildingKit}
            >
              <PackageOpen />
              {buildingKit ? "Building kit…" : "Download prototype kit"}
            </Button>
          }
        />
      ) : (
        <>
          <section aria-labelledby="resource-files-title">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="resource-files-title" className="text-xl font-semibold">
                  Local files
                </h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Version, file size, and SHA-256 are fixed to the bundled
                  prototype assets.
                </p>
              </div>
              <StatusBadge status={VERSION} />
            </div>
            <Card className="min-w-0 gap-0 overflow-hidden rounded-2xl border-[#e5e7eb] py-0 shadow-none">
              {resources.map((resource, index) => (
                <article
                  key={resource.filename}
                  className={`grid items-center gap-4 p-4 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:p-5 ${index ? "border-t border-[#eceef0]" : ""}`}
                >
                  <div className="grid h-16 w-[72px] place-items-center overflow-hidden rounded-xl bg-[#f3f4f6] p-2">
                    {resource.preview ? (
                      <Image
                        src={resource.href}
                        alt=""
                        width={
                          resource.filename === "tabbio-mark.svg" ? 128 : 520
                        }
                        height={128}
                        unoptimized
                        className="h-auto max-h-12 w-auto max-w-full"
                      />
                    ) : resource.type === "JSON" ? (
                      <FileJson
                        className="size-6 text-[#5a2aff]"
                        aria-hidden="true"
                      />
                    ) : (
                      <FileText
                        className="size-6 text-[#5a2aff]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{resource.name}</h3>
                      <span className="rounded-full bg-[#f3f4f6] px-2 py-1 text-[11px] font-semibold text-[#5e6470]">
                        Prototype
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#6b7280]">
                      {resource.type} · {resource.size} · {VERSION}
                    </p>
                    <p
                      className="mt-1 truncate font-mono text-[11px] text-[#6b7280]"
                      title={`SHA-256 ${resource.checksum}`}
                    >
                      SHA-256 {resource.checksum.slice(0, 16)}…
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="min-h-11 justify-self-start rounded-xl sm:justify-self-end"
                  >
                    <a href={resource.href} download={resource.filename}>
                      <Download />
                      Download
                    </a>
                  </Button>
                </article>
              ))}
            </Card>
          </section>

          <div className="mt-8 grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <section className="min-w-0" aria-labelledby="copy-library-title">
              <div className="mb-4">
                <h2 id="copy-library-title" className="text-xl font-semibold">
                  Copy library
                </h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Prototype wording for layout and workflow testing.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    key: "intro",
                    label: "Short introduction",
                    value: introCopy,
                  },
                  {
                    key: "disclosure",
                    label: "Partner disclosure",
                    value: disclosureCopy,
                  },
                ].map((item) => (
                  <Card
                    key={item.key}
                    className="gap-4 rounded-2xl border-[#e5e7eb] p-5 shadow-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="mt-1 text-xs text-[#8a6415]">
                          Prototype only. Approval required.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="min-h-11 rounded-xl"
                        onClick={() => copyResource(item.value, item.key)}
                      >
                        {copied === item.key ? <Check /> : <Clipboard />}
                        {copied === item.key ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <blockquote className="rounded-xl bg-[#f6f6f7] p-4 text-sm leading-6 text-[#4a4a4d]">
                      {item.value}
                    </blockquote>
                  </Card>
                ))}
              </div>
            </section>

            <section aria-labelledby="promotion-rules-title">
              <div className="mb-4">
                <h2
                  id="promotion-rules-title"
                  className="text-xl font-semibold"
                >
                  Promotion rules
                </h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Each rule solves a different risk. Confirm production terms
                  and local law before publishing.
                </p>
              </div>
              <Card className="min-w-0 gap-0 overflow-hidden rounded-2xl border-[#e5e7eb] py-0 shadow-none">
                {promotionRules.map((rule, index) => (
                  <div
                    key={rule.title}
                    className={`grid grid-cols-[36px_minmax(0,1fr)] gap-3 p-4 sm:p-5 ${index ? "border-t border-[#eceef0]" : ""}`}
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-[#eee9ff] text-[#4b23c6]">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{rule.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#6b7280]">
                        {rule.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </Card>
            </section>
          </div>

          <section
            className="mt-8 rounded-2xl bg-[#241153] p-5 text-white sm:p-7"
            aria-labelledby="manifest-title"
          >
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="mb-3 grid size-11 place-items-center rounded-xl bg-white/10">
                  <Palette className="size-5" aria-hidden="true" />
                </div>
                <h2 id="manifest-title" className="text-xl font-semibold">
                  Need the complete local kit?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#ddd5f5]">
                  The ZIP contains all five bundled files plus a JSON manifest
                  with local paths, byte sizes, checksums, copy snippets, and
                  promotion rules.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button
                  variant="ghost"
                  className="min-h-11 rounded-xl text-white hover:bg-white/10 hover:text-white"
                  onClick={downloadManifest}
                >
                  <FileJson />
                  Manifest only
                </Button>
                <Button
                  variant="secondary"
                  className="min-h-11 rounded-xl bg-white text-[#241153] hover:bg-[#f4f1ff]"
                  onClick={downloadFullKit}
                  disabled={buildingKit}
                >
                  {buildingKit ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Download />
                  )}
                  {buildingKit ? "Building kit…" : "Download ZIP"}
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
