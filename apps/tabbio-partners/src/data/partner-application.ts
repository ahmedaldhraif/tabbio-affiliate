export const partnerLanes = [
  "CV writer",
  "Career coach",
  "Content creator",
  "Recruiter",
  "Agency",
  "Other",
] as const;

export const partnerChannels = [
  "LinkedIn",
  "Instagram",
  "TikTok",
  "YouTube",
  "Newsletter",
  "Website",
  "Offline",
  "Other",
] as const;

export const partnerReachOptions = [
  "Just starting",
  "1–10 clients",
  "11–50 clients",
  "51–200 clients",
  "200+ clients",
] as const;

export type PartnerApplicationDraft = {
  firstName: string;
  email: string;
  profileUrl: string;
  workUrl: string;
  country: string;
  about: string;
  lanes: string[];
  channels: string[];
  reach: string;
  agreed: boolean;
};

export const emptyPartnerApplication: PartnerApplicationDraft = {
  firstName: "",
  email: "",
  profileUrl: "",
  workUrl: "",
  country: "",
  about: "",
  lanes: [],
  channels: [],
  reach: "",
  agreed: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function textList(value: unknown, allowed: readonly string[]) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string =>
      typeof item === "string" && allowed.includes(item),
  );
}

export function readPartnerApplication(
  value: unknown,
): PartnerApplicationDraft {
  if (!isRecord(value)) return emptyPartnerApplication;

  return {
    firstName: text(value.firstName),
    email: text(value.email),
    profileUrl: text(value.profileUrl),
    workUrl: text(value.workUrl),
    country: text(value.country),
    about: text(value.about),
    lanes: textList(value.lanes, partnerLanes),
    channels: textList(value.channels, partnerChannels),
    reach: partnerReachOptions.includes(
      value.reach as (typeof partnerReachOptions)[number],
    )
      ? String(value.reach)
      : "",
    agreed: value.agreed === true,
  };
}

export function validatePartnerApplication(draft: PartnerApplicationDraft) {
  const errors: Record<string, string> = {};
  if (!draft.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!/^\S+@\S+\.\S+$/.test(draft.email))
    errors.email = "Enter a valid email address.";
  if (draft.lanes.length === 0) errors.lanes = "Choose at least one lane.";
  if (draft.channels.length === 0)
    errors.channels = "Choose at least one channel.";
  if (!draft.reach) errors.reach = "Choose the closest range.";
  if (draft.about.trim().length < 20)
    errors.about = "Tell us a little more about your work.";
  if (draft.profileUrl && !/^https?:\/\/\S+$/i.test(draft.profileUrl))
    errors.profileUrl = "Enter a full link beginning with http or https.";
  if (draft.workUrl && !/^https?:\/\/\S+$/i.test(draft.workUrl))
    errors.workUrl = "Enter a full link beginning with http or https.";
  if (!draft.agreed) errors.agreed = "Confirm before continuing.";
  return errors;
}

export function toggleApplicationValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
