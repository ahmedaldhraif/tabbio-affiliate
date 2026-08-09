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
      lane: "Choose your primary lane.",
      about: "Add a little more about your work and audience.",
      agreed: "Confirm before continuing.",
    });
  });

  it("accepts a complete UGC creator application", () => {
    expect(
      validatePartnerApplication({
        ...emptyPartnerApplication,
        firstName: "Maya",
        email: "maya@example.com",
        lane: "UGC creator",
        profileUrl: "https://instagram.com/maya",
        about: "I make practical career videos for first-job candidates.",
        agreed: true,
      }),
    ).toEqual({});
  });

  it("accepts a career coach with no audience-size requirement", () => {
    expect(
      validatePartnerApplication({
        ...emptyPartnerApplication,
        firstName: "Sara",
        email: "sara@example.com",
        lane: "Career coach",
        about: "I coach graduates through interviews and career changes.",
        agreed: true,
      }),
    ).toEqual({});
  });

  it("migrates a valid lane and work link from the earlier local draft", () => {
    expect(
      readPartnerApplication({
        firstName: "Ahmed",
        email: "saved@example.com",
        lanes: ["Career coach", "Unknown"],
        workUrl: "https://example.com/work",
        channels: "LinkedIn",
        agreed: "yes",
      }),
    ).toEqual({
      ...emptyPartnerApplication,
      firstName: "Ahmed",
      email: "saved@example.com",
      lane: "Career coach",
      profileUrl: "https://example.com/work",
    });
  });

  it("validates an optional link only when supplied", () => {
    expect(
      validatePartnerApplication({
        ...emptyPartnerApplication,
        firstName: "Maya",
        email: "maya@example.com",
        lane: "UGC creator",
        about: "I create useful short videos for career changers.",
        profileUrl: "instagram.com/maya",
        agreed: true,
      }),
    ).toEqual({
      profileUrl: "Enter a full link beginning with http or https.",
    });
  });
});
