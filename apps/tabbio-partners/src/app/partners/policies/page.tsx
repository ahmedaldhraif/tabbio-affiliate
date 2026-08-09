import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCheck2, MapPin, ShieldCheck } from "lucide-react";

import {
  PolicyFooter,
  PolicyHeader,
  PolicyStatus,
} from "@/components/marketing/policy-shell";
import {
  PROGRAM_POLICY_VERSION,
  UAE_BUSINESS_CONTEXT,
  programDocuments,
} from "@/data/program-policy";

export const metadata: Metadata = {
  title: "Tabbio Partner Policy Centre",
  description:
    "Draft Tabbio partner agreement, commission, disclosure, agency, brand, privacy, payout, compliance, and appeals policies.",
  alternates: { canonical: "/partners/policies" },
};

export default function PartnerPoliciesPage() {
  return (
    <div className="min-h-screen bg-[#fcfbfd] text-[#29242e]">
      <PolicyHeader />
      <main id="main-content">
        <section className="page-wrap py-12 sm:py-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5a2aff]">
              <ShieldCheck className="size-5" aria-hidden="true" />
              Tabbio Partner governance
            </div>
            <h1 className="mt-5 text-[clamp(2.7rem,7vw,5.8rem)] font-semibold leading-[.98] tracking-[-.04em]">
              Clear rules before real money moves.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#665f70]">
              One place for the relationship, commission, promotion, agency,
              brand, privacy, payout, and appeal rules behind the Tabbio Partner
              experience.
            </p>
          </div>

          <div className="mt-10 max-w-5xl">
            <PolicyStatus />
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
            <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">
              <div className="flex items-start gap-3 border-t-2 border-[#5a2aff] pt-5">
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-[#5a2aff]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Based in the UAE</p>
                  <p className="mt-2 text-sm leading-6 text-[#665f70]">
                    {UAE_BUSINESS_CONTEXT}
                  </p>
                </div>
              </div>
              <div className="mt-7 border-t border-[#dfd6eb] pt-5 text-sm leading-6 text-[#665f70]">
                <p>
                  The UAE Advertiser Permit is conditional on the promoter and
                  activity. It is not a worldwide checkbox.
                </p>
              </div>
            </aside>

            <div className="min-w-0 border-t border-[#d8d0e2]">
              {programDocuments.map((document, index) => (
                <Link
                  key={document.slug}
                  href={`/partners/policies/${document.slug}`}
                  className="focus-ring group grid min-h-36 gap-3 border-b border-[#d8d0e2] py-6 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-start sm:gap-5"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-[#eee9ff] text-sm font-semibold text-[#4b23c6]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xl font-semibold tracking-[-.02em]">
                      {document.title}
                    </span>
                    <span className="mt-2 block max-w-2xl text-sm leading-6 text-[#665f70]">
                      {document.summary}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#6f6678]">
                      <FileCheck2 className="size-4" aria-hidden="true" />
                      {document.acceptanceRequired
                        ? "Included in partner acceptance"
                        : "Operational policy"}
                    </span>
                  </span>
                  <ArrowRight
                    className="hidden size-5 text-[#5a2aff] transition-transform group-hover:translate-x-1 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-14 max-w-5xl bg-[#241153] px-6 py-7 text-white sm:px-8">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <p className="font-semibold">
                  Version {PROGRAM_POLICY_VERSION}
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#ddd5f5]">
                  Production launch still requires approved entity details,
                  contacts, effective dates, provider terms, translations, and
                  server-side acceptance records.
                </p>
              </div>
              <Link
                href="/partners#form"
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#241153]"
              >
                Return to application <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PolicyFooter />
    </div>
  );
}
