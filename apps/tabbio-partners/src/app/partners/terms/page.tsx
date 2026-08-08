import type { Metadata } from "next";

import { ProgramTerms } from "@/components/marketing/program-terms";

export const metadata: Metadata = {
  title: "Proposed program terms",
  description:
    "Plain-language terms and unresolved production boundaries for the local Tabbio Partner prototype.",
};

export default function PartnerTermsPage() {
  return <ProgramTerms />;
}
