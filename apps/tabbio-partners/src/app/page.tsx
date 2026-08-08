import type { Metadata } from "next";

import { PartnerLanding } from "@/components/marketing/partner-landing";

export const metadata: Metadata = {
  title: "Partner program",
  description:
    "Explore a local frontend demo of the proposed Tabbio partner program and its recurring commission estimator.",
};

export default function HomePage() {
  return <PartnerLanding />;
}
