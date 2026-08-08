export type LinkRow = {
  id: string;
  channel: string;
  campaign: string;
  destination: string;
  clicks: number;
  signups: number;
  paying: number;
  archived?: boolean;
};

export type ClientCv = {
  id: string;
  name: string;
  style: "Modern" | "Classic" | "Minimal";
  status:
    | "Draft"
    | "Sent"
    | "Viewed"
    | "Claim pending"
    | "Claimed"
    | "Expired"
    | "Archived";
  edited: string;
  claimCode: string;
};

export type Draft = {
  id: string;
  format: "Script" | "Post" | "Article";
  brief: string;
  body: string;
  createdAt: string;
};

export type PartnerSettings = {
  publicName: string;
  audience: string;
  lane: string;
  slug: string;
  commissionChanges: boolean;
  payoutUpdates: boolean;
  complianceReminders: boolean;
  productResources: boolean;
};

export const fixedNow = "2026-08-09T09:30:00+04:00";

export const partner = {
  name: "Mohamed B.",
  audience: "Career coaches and CV writers",
  lane: "Career services",
  slug: "mohamed-b",
  currency: "USD",
  timezone: "Asia/Dubai",
} as const;

export const initialLinks: LinkRow[] = [
  {
    id: "linkedin",
    channel: "LinkedIn",
    campaign: "LinkedIn bio",
    destination: "/",
    clicks: 620,
    signups: 48,
    paying: 18,
  },
  {
    id: "cv-claim",
    channel: "Client CV",
    campaign: "CV claim links",
    destination: "/partner",
    clicks: 515,
    signups: 39,
    paying: 11,
  },
  {
    id: "youtube",
    channel: "YouTube",
    campaign: "YouTube description",
    destination: "/",
    clicks: 410,
    signups: 31,
    paying: 7,
  },
  {
    id: "newsletter",
    channel: "Newsletter",
    campaign: "August newsletter",
    destination: "/",
    clicks: 300,
    signups: 19,
    paying: 3,
  },
];

export const periodTotals = initialLinks.reduce(
  (total, link) => ({
    clicks: total.clicks + link.clicks,
    signups: total.signups + link.signups,
    paying: total.paying + link.paying,
  }),
  { clicks: 0, signups: 0, paying: 0 },
);

export const balances = {
  lifetime: 10377,
  pending: 185,
  held: 120,
  payable: 1200,
  paid: 8872,
  scheduled: 0,
  recovery: 0,
} as const;

export const trend = [
  { label: "Mar", value: 620 },
  { label: "Apr", value: 810 },
  { label: "May", value: 730 },
  { label: "Jun", value: 980 },
  { label: "Jul", value: 1080 },
  { label: "Aug", value: 1200 },
] as const;

export const initialClients: ClientCv[] = [
  {
    id: "cv-1",
    name: "Lina Kareem",
    style: "Modern",
    status: "Claimed",
    edited: "Aug 8, 2026",
    claimCode: "lina-k",
  },
  {
    id: "cv-2",
    name: "Omar Nasser",
    style: "Minimal",
    status: "Viewed",
    edited: "Aug 7, 2026",
    claimCode: "omar-n",
  },
  {
    id: "cv-3",
    name: "Maya Rahman",
    style: "Classic",
    status: "Claim pending",
    edited: "Aug 6, 2026",
    claimCode: "maya-r",
  },
  {
    id: "cv-4",
    name: "Yousef Ali",
    style: "Modern",
    status: "Draft",
    edited: "Aug 4, 2026",
    claimCode: "yousef-a",
  },
];

export const ledger = [
  {
    id: "led-1",
    description: "Plus subscription · LinkedIn bio",
    source: 49.99,
    commission: 15,
    status: "Payable",
    date: "Aug 8, 2026",
  },
  {
    id: "led-2",
    description: "Pro subscription · CV claim link",
    source: 29.99,
    commission: 9,
    status: "Pending",
    date: "Aug 7, 2026",
  },
  {
    id: "led-3",
    description: "Plus subscription · Newsletter",
    source: 49.99,
    commission: 15,
    status: "Held",
    date: "Aug 6, 2026",
  },
  {
    id: "led-4",
    description: "Plus subscription · YouTube",
    source: 49.99,
    commission: 15,
    status: "Paid",
    date: "Aug 3, 2026",
  },
  {
    id: "led-5",
    description: "Refund adjustment · LinkedIn",
    source: -49.99,
    commission: -15,
    status: "Reversed",
    date: "Aug 1, 2026",
  },
] as const;

export const initialSettings: PartnerSettings = {
  publicName: partner.name,
  audience: partner.audience,
  lane: partner.lane,
  slug: partner.slug,
  commissionChanges: true,
  payoutUpdates: true,
  complianceReminders: true,
  productResources: false,
};

export const activity = ledger.slice(0, 4);

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 ? 2 : 0,
  }).format(value);
}

export function normalizeEstimatorInput(
  value: number,
  min: number,
  max: number,
) {
  const finiteValue = Number.isFinite(value) ? value : min;
  return Math.min(max, Math.max(min, Math.round(finiteValue)));
}

export function calculateEstimator(
  monthlyReferrals: number,
  paidMonths: number,
  programMonths: number,
  price = 14.99,
  rate = 0.3,
) {
  const safeMonthlyReferrals = Math.max(0, Math.floor(monthlyReferrals));
  const safePaidMonths = Math.max(0, Math.floor(paidMonths));
  const safeProgramMonths = Math.max(0, Math.floor(programMonths));
  let totalCustomerMonths = 0;
  for (let cohort = 0; cohort < safeProgramMonths; cohort += 1) {
    totalCustomerMonths +=
      safeMonthlyReferrals *
      Math.min(safePaidMonths, safeProgramMonths - cohort);
  }
  return {
    total: totalCustomerMonths * price * rate,
    finalRunRate:
      safeMonthlyReferrals *
      Math.min(safePaidMonths, safeProgramMonths) *
      price *
      rate,
  };
}

export function createLocalDraft(
  format: Draft["format"],
  brief: string,
): Draft {
  const disclosure =
    "I may earn a commission if you subscribe through this link.";
  const bodies = {
    Script: `Your CV should do more than sit in a PDF. With Tabbio, you can turn it into one live link that is simple to share and easy to update. ${disclosure}`,
    Post: `A PDF CV is useful, but a live CV link keeps the story current. Tabbio helps candidates share one clear link with recruiters and update it without resending files. ${disclosure}`,
    Article: `A strong CV is a living story, not a frozen attachment. Tabbio gives candidates one shareable link for their experience, projects, and updates. For career professionals, that means a clearer handoff and a better client experience. ${disclosure}`,
  };
  const seed = `${format}:${brief}`;
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return {
    id: `draft-${(hash >>> 0).toString(36)}`,
    format,
    brief,
    body: bodies[format],
    createdAt: fixedNow,
  };
}
