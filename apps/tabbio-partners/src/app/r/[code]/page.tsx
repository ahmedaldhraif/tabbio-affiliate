import { ReferralPreviewClient } from "./referral-preview-client";

const demoCodes = ["demo", "mohamed-b", "linkedin"] as const;

export function generateStaticParams() {
  return demoCodes.map((code) => ({ code }));
}

export const dynamicParams = false;

export default async function ReferralPreview({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <ReferralPreviewClient code={code} />;
}
