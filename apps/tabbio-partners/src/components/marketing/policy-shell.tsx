import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";

import { Button } from "@refref/ui/components/button";

import { BrandMark } from "@/components/brand-mark";
import {
  PROGRAM_POLICY_VERSION,
  UAE_BUSINESS_CONTEXT,
  type ProgramDocument,
} from "@/data/program-policy";

export function PolicyHeader() {
  return (
    <header className="border-b border-[#e7e1ef] bg-white">
      <div className="page-wrap flex min-h-[72px] items-center justify-between gap-4">
        <Link
          className="focus-ring rounded-lg"
          href="/partners"
          aria-label="Tabbio Partners home"
        >
          <BrandMark />
        </Link>
        <Button asChild className="min-h-11 rounded-full px-5">
          <Link href="/partners#form">Apply</Link>
        </Button>
      </div>
    </header>
  );
}

export function PolicyFooter() {
  return (
    <footer className="border-t border-[#e7e1ef] bg-[#f7f4fb] py-8">
      <div className="page-wrap flex flex-col gap-3 text-sm text-[#665f70] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Tabbio · UAE-based business · Frontend policy draft</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="focus-ring rounded" href="/partners/policies">
            Policy centre
          </Link>
          <Link className="focus-ring rounded" href="/partners">
            Partner program
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PolicyStatus() {
  return (
    <div className="grid gap-4 border-y border-[#dfd6eb] py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div>
        <p className="text-sm font-semibold text-[#2b2434]">
          Product-complete draft, not an activated agreement
        </p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-[#6f6678]">
          This version defines the intended frontend and operational contract.
          Legal, Finance, Privacy, and Tax must approve the production version.
        </p>
      </div>
      <span className="w-fit rounded-full bg-[#eee9ff] px-3 py-1.5 text-xs font-semibold text-[#4b23c6]">
        {PROGRAM_POLICY_VERSION}
      </span>
    </div>
  );
}

export function PolicyDocumentView({
  document,
}: {
  document: ProgramDocument;
}) {
  return (
    <div className="min-h-screen bg-[#fcfbfd] text-[#29242e]">
      <PolicyHeader />
      <main id="main-content">
        <div className="page-wrap py-10 sm:py-16">
          <Link
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#5a2aff]"
            href="/partners/policies"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> All policies
          </Link>

          <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
            <article className="min-w-0 max-w-[760px]">
              <p className="text-sm font-semibold text-[#5a2aff]">
                {PROGRAM_POLICY_VERSION}
              </p>
              <h1 className="mt-3 max-w-3xl text-[clamp(2.35rem,6vw,4.8rem)] font-semibold leading-[1.02] tracking-[-.035em]">
                {document.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#665f70]">
                {document.summary}
              </p>

              <PolicyStatus />

              <div className="mt-12 space-y-12">
                {document.sections.map((section) => (
                  <section
                    key={section.title}
                    id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                    className="scroll-mt-8"
                  >
                    <h2 className="text-2xl font-semibold tracking-[-.025em]">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4 text-[1.02rem] leading-8 text-[#514a58]">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.bullets && (
                      <ul className="mt-5 space-y-3" role="list">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="grid grid-cols-[20px_minmax(0,1fr)] gap-3 text-[1.02rem] leading-7 text-[#514a58]"
                          >
                            <Check
                              className="mt-1 size-5 text-[#5a2aff]"
                              aria-hidden="true"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              <div className="mt-14 border-t border-[#dfd6eb] pt-7">
                <p className="text-sm leading-6 text-[#6f6678]">
                  This draft records intended program behavior. Production
                  acceptance must store the exact approved version, locale,
                  actor, and time on the server. Nothing on this local page does
                  that yet.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-5 min-h-11 rounded-xl"
                >
                  <Link href="/partners/policies">
                    Continue through the policy centre
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>

            <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">
              <div className="border-t-2 border-[#5a2aff] pt-5">
                <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#6f6678]">
                  Applies to
                </p>
                <p className="mt-2 text-sm font-semibold leading-6">
                  {document.appliesTo}
                </p>
              </div>
              <div className="mt-7 flex items-start gap-3 border-t border-[#dfd6eb] pt-5">
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-[#5a2aff]"
                  aria-hidden="true"
                />
                <p className="text-sm leading-6 text-[#665f70]">
                  {UAE_BUSINESS_CONTEXT}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <PolicyFooter />
    </div>
  );
}
