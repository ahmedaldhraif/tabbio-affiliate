import { describe, expect, it } from "vitest";

import {
  emptyPartnerApplication,
  readPartnerApplication,
  validatePartnerApplication,
} from "./partner-application";

describe("partner application", () => {
  it("rejects an incomplete application with corrective messages", () => {
    expect(validatePartnerApplication(emptyPartnerApplication)).toEqual({
      firstName: "Enter your first name.",
      email: "Enter a valid email address.",
      lanes: "Choose at least one lane.",
      channels: "Choose at least one channel.",
      reach: "Choose the closest range.",
      about: "Tell us a little more about your work.",
      agreed: "Confirm before continuing.",
    });
  });

  it("accepts a complete starting-small application", () => {
    expect(
      validatePartnerApplication({
        ...emptyPartnerApplication,
        firstName: "Ahmed",
        email: "ahmed@example.com",
        lanes: ["Career coach"],
        channels: ["Offline"],
        reach: "Just starting",
        about: "I help graduates prepare clear career stories.",
        agreed: true,
      }),
    ).toEqual({});
  });

  it("sanitizes a stale or malformed local draft", () => {
    expect(
      readPartnerApplication({
        firstName: 42,
        email: "saved@example.com",
        lanes: ["Recruiter", "Unknown"],
        channels: "LinkedIn",
        reach: "Millions",
        agreed: "yes",
      }),
    ).toEqual({
      ...emptyPartnerApplication,
      email: "saved@example.com",
      lanes: ["Recruiter"],
    });
  });

  it("validates optional links only when supplied", () => {
    expect(
      validatePartnerApplication({
        ...emptyPartnerApplication,
        firstName: "Sara",
        email: "sara@example.com",
        lanes: ["CV writer"],
        channels: ["LinkedIn"],
        reach: "1–10 clients",
        about: "I help early career candidates improve their CVs.",
        profileUrl: "linkedin.com/in/sara",
        workUrl: "https://example.com/work",
        agreed: true,
      }),
    ).toEqual({
      profileUrl: "Enter a full link beginning with http or https.",
    });
  });
});
