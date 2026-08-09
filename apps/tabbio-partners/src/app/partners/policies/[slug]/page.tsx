import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyDocumentView } from "@/components/marketing/policy-shell";
import { getProgramDocument, programDocuments } from "@/data/program-policy";

type PolicyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return programDocuments.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({
  params,
}: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getProgramDocument(slug);
  if (!document) return {};

  return {
    title: document.title,
    description: document.summary,
    alternates: { canonical: `/partners/policies/${document.slug}` },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const document = getProgramDocument(slug);
  if (!document) notFound();

  return <PolicyDocumentView document={document} />;
}
