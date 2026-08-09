export const partnerLanes = [
  "UGC creator",
  "Career coach",
  "CV writer",
  "Recruiter or talent specialist",
  "Agency",
  "Other",
] as const;

export type PartnerLane = (typeof partnerLanes)[number];

export type PartnerApplicationDraft = {
  firstName: string;
  email: string;
  lane: string;
  profileUrl: string;
  about: string;
  agreed: boolean;
};

export const emptyPartnerApplication: PartnerApplicationDraft = {
  firstName: "",
  email: "",
  lane: "",
  profileUrl: "",
  about: "",
  agreed: false,
};

export const lanePrompts: Record<PartnerLane, string> = {
  "UGC creator":
    "Tell us what you create, who watches it, and how you would show Tabbio in use.",
  "Career coach":
    "Tell us who you coach and how Tabbio could support your client work.",
  "CV writer":
    "Tell us about the CV work you deliver and how clients receive it today.",
  "Recruiter or talent specialist":
    "Tell us who you place or support and where Tabbio fits in the handoff.",
  Agency:
    "Tell us about your clients and the Tabbio workflow you would recommend.",
  Other: "Tell us what you do and how you would introduce people to Tabbio.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function isPartnerLane(value: string): value is PartnerLane {
  return partnerLanes.includes(value as PartnerLane);
}

export function readPartnerApplication(
  value: unknown,
): PartnerApplicationDraft {
  if (!isRecord(value)) return emptyPartnerApplication;

  const legacyLanes = Array.isArray(value.lanes) ? value.lanes : [];
  const requestedLane = text(value.lane) || text(legacyLanes[0]);

  return {
    firstName: text(value.firstName),
    email: text(value.email),
    lane: isPartnerLane(requestedLane) ? requestedLane : "",
    profileUrl: text(value.profileUrl) || text(value.workUrl),
    about: text(value.about),
    agreed: value.agreed === true,
  };
}

export function validatePartnerApplication(draft: PartnerApplicationDraft) {
  const errors: Record<string, string> = {};
  if (!draft.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!/^\S+@\S+\.\S+$/.test(draft.email))
    errors.email = "Enter a valid email address.";
  if (!isPartnerLane(draft.lane)) errors.lane = "Choose your primary lane.";
  if (draft.about.trim().length < 20)
    errors.about = "Add a little more about your work and audience.";
  if (draft.profileUrl && !/^https?:\/\/\S+$/i.test(draft.profileUrl))
    errors.profileUrl = "Enter a full link beginning with http or https.";
  if (!draft.agreed) errors.agreed = "Confirm before continuing.";
  return errors;
}
