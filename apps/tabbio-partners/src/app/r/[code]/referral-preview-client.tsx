"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Link2, ShieldCheck } from "lucide-react";

import { Button } from "@refref/ui/components/button";

import { BrandMark } from "@/components/brand-mark";

const destinations = {
  "/": "Open the partner landing",
  "/partners": "Explore the program",
  "/partner": "Open the partner demo",
} as const;

type Destination = keyof typeof destinations;

function publicNameFromSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ReferralPreviewClient({ code }: { code: string }) {
  const [destination, setDestination] = useState<Destination>("/");
  const [partnerName, setPartnerName] = useState("A Tabbio partner");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requestedDestination = query.get("destination");
    if (requestedDestination && requestedDestination in destinations) {
      setDestination(requestedDestination as Destination);
    }

    const slug = query.get("partner") ?? "";
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setPartnerName(publicNameFromSlug(slug));
    }
  }, []);

  return (
    <main
      id="main-content"
      className="grid min-h-screen place-items-center bg-[#f4f2ff] p-5"
    >
      <section className="surface-shadow w-full max-w-lg rounded-[28px] border border-[#e2ddf4] bg-white p-7 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <BrandMark />
          <span className="rounded-full bg-[#eee9ff] px-3 py-1 text-xs font-semibold text-[#4c24c6]">
            Local preview
          </span>
        </div>
        <div className="mt-9 grid size-12 place-items-center rounded-2xl bg-[#5a2aff] text-white">
          <Link2 className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-.035em]">
          {partnerName} shared Tabbio with you.
        </h1>
        <p className="mt-3 leading-7 text-[#5e6470]">
          Review this local referral preview, then continue to the destination
          the partner selected. No visit or choice is recorded.
        </p>
        <div className="mt-6 rounded-2xl border border-[#e8e5f2] bg-[#faf9ff] p-4 text-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 size-5 shrink-0 text-[#5a2aff]"
              aria-hidden="true"
            />
            <div>
              <strong>Tracking is simulated</strong>
              <p className="mt-1 leading-6 text-[#5e6470]">
                Code{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-[#4b23c6]">
                  {code}
                </code>{" "}
                and the selected destination are shown for UI testing only. No
                click, cookie, attribution, or personal data is recorded.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="h-12 flex-1 rounded-full bg-[#5a2aff] hover:bg-[#512eff]"
          >
            <Link href={destination}>
              {destinations[destination]} <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 flex-1 rounded-full"
          >
            <Link href="/partners/terms">Read program terms</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
