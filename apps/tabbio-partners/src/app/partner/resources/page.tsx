"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clipboard,
  Download,
  FileText,
  Info,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@refref/ui/components/alert";
import { Button } from "@refref/ui/components/button";
import { Card } from "@refref/ui/components/card";

import { PageHeader } from "@/components/shared";
import { copyText } from "@/components/tools/browser-actions";
import { programDocuments } from "@/data/program-policy";

const introCopy =
  "Create, share, and grow with Tabbio. Use my partner link to get started.";
const disclosureCopy =
  "I may earn a commission if you subscribe through this link.";

const badgeVariants = [
  {
    id: "stacked",
    name: "Stacked badge",
    use: "Profiles, media kits, proposals, and LinkedIn Featured",
    width: 942,
    height: 526,
    preview:
      "/brand/partner-badges/2026/tabbio-active-partner-2026-stacked-preview.webp",
    base: "/brand/partner-badges/2026/tabbio-active-partner-2026-stacked",
  },
  {
    id: "horizontal",
    name: "Horizontal badge",
    use: "Websites, email signatures, CVs, and presentation footers",
    width: 1658,
    height: 303,
    preview:
      "/brand/partner-badges/2026/tabbio-active-partner-2026-horizontal-preview.webp",
    base: "/brand/partner-badges/2026/tabbio-active-partner-2026-horizontal",
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
    title: "Protect personal information",
    detail:
      "Never add a client name, email, CV detail, or other personal information to a tracked link or QR code.",
  },
  {
    title: "Protect Tabbio brand terms",
    detail:
      "Do not buy ads on protected Tabbio brand terms unless the program terms explicitly allow it.",
  },
] as const;

export default function ResourcesPage() {
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const copyResource = async (value: string, key: string) => {
    try {
      await copyText(value);
      setCopied(key);
      setError("");
      toast.success("Copied to your clipboard");
      window.setTimeout(() => setCopied(""), 1800);
    } catch (copyError) {
      setError(
        copyError instanceof Error
          ? copyError.message
          : "Copy is unavailable in this browser.",
      );
    }
  };

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Partner toolkit"
        title="Resources"
        description="Official assets, ready-to-use copy, and promotion guidance"
      />

      {error && (
        <Alert variant="destructive" className="mb-6 rounded-xl">
          <Info aria-hidden="true" />
          <AlertTitle>Copy action failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="mb-10" aria-labelledby="brand-kit-title">
        <Card className="grid min-w-0 gap-0 overflow-hidden rounded-2xl border-[#ded6ed] p-0 shadow-none lg:grid-cols-[minmax(280px,.8fr)_minmax(0,1.2fr)]">
          <div className="grid min-h-64 place-items-center bg-[#f3efff] p-8 sm:p-12">
            <Image
              src="/brand/tabbio-main-logo-violet.svg"
              alt="Tabbio logo in Tabbio violet"
              width={795}
              height={192}
              priority
              unoptimized
              className="h-auto w-full max-w-[420px]"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <div className="mb-5 grid size-11 place-items-center rounded-xl bg-[#eee9ff] text-[#4b23c6]">
              <Palette className="size-5" aria-hidden="true" />
            </div>
            <h2
              id="brand-kit-title"
              className="text-2xl font-semibold tracking-[-.025em]"
            >
              Official Tabbio branding
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b6473]">
              English and Arabic logos, favicon, and submark in black, white,
              and Tabbio violet. Includes SVG, PNG, JPG, EPS, and PDF files.
            </p>
            <div className="mt-6">
              <Button asChild className="min-h-11 rounded-xl">
                <a
                  href="/brand/tabbio-branding.zip"
                  download="Tabbio Branding.zip"
                >
                  <Download /> Download branding
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-10" aria-labelledby="partner-badge-title">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2
              id="partner-badge-title"
              className="text-2xl font-semibold tracking-[-.025em]"
            >
              Your Active Partner badge
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6473]">
              Shows that you&apos;re an active Tabbio Partner. Choose the format
              that fits where you&apos;re sharing it.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="min-h-11 rounded-xl">
              <a
                href="/brand/tabbio-active-partner-2026-badge-kit.zip"
                download="tabbio-active-partner-2026-badge-kit.zip"
              >
                <Download /> Download both
              </a>
            </Button>
            <Button asChild variant="outline" className="min-h-11 rounded-xl">
              <a
                href="/brand/partner-badge-guidelines.md"
                download="tabbio-active-partner-2026-guidelines.md"
              >
                <FileText /> How to use it
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {badgeVariants.map((badge, index) => (
            <Card
              key={badge.id}
              className="min-w-0 gap-0 overflow-hidden rounded-2xl border-[#ded6ed] p-0 shadow-none"
            >
              <div className="grid min-h-[250px] place-items-center bg-[#f4f2f7] p-6 sm:p-8">
                <Image
                  src={badge.preview}
                  alt={`Tabbio Active Partner 2026 ${badge.id} badge`}
                  width={badge.width}
                  height={badge.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  unoptimized
                  className={`h-auto w-full ${badge.id === "stacked" ? "max-w-[360px]" : "max-w-[620px]"}`}
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold">{badge.name}</h3>
                <p className="mt-1 text-sm leading-6 text-[#6b6473]">
                  {badge.use}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild size="sm" className="rounded-lg">
                    <a href={`${badge.base}.svg`} download>
                      <Download /> SVG
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                  >
                    <a href={`${badge.base}.png`} download>
                      <Download /> PNG
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="rounded-lg"
                  >
                    <a href={`${badge.base}@2x.png`} download>
                      PNG @2x
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-[#7b7282]">
          Use the badge only while your partner status is active. It confirms
          program membership, not professional certification or endorsement.
        </p>
      </section>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-8 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <section className="min-w-0" aria-labelledby="copy-library-title">
          <div className="mb-4">
            <h2 id="copy-library-title" className="text-xl font-semibold">
              Copy and share
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Start here, then make the wording sound like you.
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
                  <h3 className="font-semibold">{item.label}</h3>
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
            <h2 id="promotion-rules-title" className="text-xl font-semibold">
              Promote responsibly
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Five rules to check before you publish.
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
        className="mt-8 grid gap-5 rounded-2xl bg-[#241153] p-5 text-white sm:p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
        aria-labelledby="partner-guide-title"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
            <BadgeCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="partner-guide-title" className="text-xl font-semibold">
              Partner guide
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#ddd5f5]">
              Practical guidance for content, links, disclosures, and using the
              Tabbio brand clearly.
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="secondary"
          className="min-h-11 rounded-xl bg-white text-[#241153] hover:bg-[#f4f1ff]"
        >
          <a
            href="/brand/partner-playbook.md"
            download="tabbio-partner-guide.md"
          >
            <ShieldCheck /> Download guide
          </a>
        </Button>
      </section>

      <section className="mt-10" aria-labelledby="program-documents-title">
        <div className="grid gap-5 border-t border-[#ddd6e7] pt-7 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          <div>
            <h2
              id="program-documents-title"
              className="text-2xl font-semibold tracking-[-.025em]"
            >
              Program documents
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6b6473]">
              The rules behind commission, promotion, agencies, privacy,
              compliance, and your partner credential. Tabbio is UAE-based;
              eligible partners may operate worldwide.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-5 min-h-11 rounded-xl"
            >
              <Link href="/partners/policies">
                Open policy centre <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="min-w-0 border-t border-[#e5e0ea]">
            {programDocuments.map((document) => (
              <Link
                key={document.slug}
                href={`/partners/policies/${document.slug}`}
                className="focus-ring group grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[#e5e0ea] py-4"
              >
                <span className="min-w-0">
                  <span className="block font-semibold">
                    {document.shortTitle}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#6b6473]">
                    {document.summary}
                  </span>
                </span>
                <ArrowRight
                  className="size-5 text-[#5a2aff] transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
