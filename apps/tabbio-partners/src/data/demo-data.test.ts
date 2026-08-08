import { describe, expect, it } from "vitest";

import {
  balances,
  calculateEstimator,
  createLocalDraft,
  normalizeEstimatorInput,
  periodTotals,
} from "./demo-data";

describe("partner demo invariants", () => {
  it("derives the approved 30-day totals", () => {
    expect(periodTotals).toEqual({ clicks: 1845, signups: 137, paying: 39 });
    expect(periodTotals.clicks).toBeGreaterThanOrEqual(periodTotals.signups);
    expect(periodTotals.signups).toBeGreaterThanOrEqual(periodTotals.paying);
  });

  it("reconciles lifetime earnings", () => {
    expect(
      balances.paid + balances.payable + balances.pending + balances.held,
    ).toBe(balances.lifetime);
  });

  it("calculates cohort earnings without double counting", () => {
    const result = calculateEstimator(4, 12, 18);
    expect(result.total).toBeCloseTo(2698.2, 2);
    expect(result.finalRunRate).toBeCloseTo(215.856, 3);
  });

  it("keeps invalid estimator inputs inside the local contract", () => {
    expect(calculateEstimator(-4, 12.9, -2)).toEqual({
      total: 0,
      finalRunRate: 0,
    });
  });

  it("normalizes typed estimator values to a bounded whole number", () => {
    expect(normalizeEstimatorInput(5.49, 1, 20)).toBe(5);
    expect(normalizeEstimatorInput(5.5, 1, 20)).toBe(6);
    expect(normalizeEstimatorInput(30.2, 1, 20)).toBe(20);
    expect(normalizeEstimatorInput(Number.NaN, 1, 20)).toBe(1);
  });

  it("creates a deterministic, disclosed local draft", () => {
    const first = createLocalDraft("Post", "A practical CV tip");
    const second = createLocalDraft("Post", "A practical CV tip");
    expect(first).toEqual(second);
    expect(first.body).toContain("I may earn a commission");
  });
});
