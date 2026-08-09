import type { Metadata } from "next";

import { PartnerLanding } from "@/components/marketing/partner-landing";
import { publicFaq } from "@/data/marketing";

export const metadata: Metadata = {
  title: "Partner Program | 30% Recurring Commission",
  description:
    "Join the global Tabbio partner program for creators, career coaches, CV writers, recruiters, and agencies. Earn 30% recurring commission on eligible subscriptions.",
  alternates: { canonical: "/partners" },
  keywords: [
    "Tabbio partner program",
    "Tabbio affiliate program",
    "CV affiliate program",
    "career creator partner program",
    "UGC creator affiliate program",
    "career coach affiliate program",
    "recruiter affiliate program",
    "recruitment agency referral program",
  ],
  openGraph: {
    type: "website",
    url: "/partners",
    siteName: "Tabbio",
    title: "Tabbio Partner Program",
    description:
      "A global partner program for creators, career coaches, CV writers, recruiters, and agencies.",
  },
  twitter: {
    card: "summary",
    title: "Tabbio Partner Program",
    description:
      "A global partner program for creators, career coaches, CV writers, recruiters, and agencies.",
  },
};

export default function PartnersPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.tabbio.com/#organization",
        name: "Tabbio",
        url: "https://www.tabbio.com/",
        logo: "https://www.tabbio.com/favicon.ico",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.tabbio.com/#website",
        name: "Tabbio",
        url: "https://www.tabbio.com/",
        publisher: { "@id": "https://www.tabbio.com/#organization" },
      },
      {
        "@type": "WebPage",
        "@id": "https://www.tabbio.com/partners#webpage",
        url: "https://www.tabbio.com/partners",
        name: "Tabbio Partner Program",
        description:
          "Creators, career coaches, CV writers, recruiters, and agencies worldwide can refer eligible customers and track recurring commission.",
        isPartOf: { "@id": "https://www.tabbio.com/#website" },
        about: { "@id": "https://www.tabbio.com/#organization" },
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.tabbio.com/partners#faq",
        mainEntity: publicFaq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <PartnerLanding />
    </>
  );
}
