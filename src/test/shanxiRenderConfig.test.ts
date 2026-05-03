import { describe, expect, it } from "vitest";

import {
  SHANXI_MATCH_RULES,
  SHANXI_NOODLE_PROFILES,
  SHANXI_SAUCE_PROFILES,
  getShanxiRenderDescriptor,
} from "@/components/shanxi-card4/shanxiRenderConfig";

describe("shanxi render config", () => {
  it("covers every sauce and noodle combination", () => {
    const sauceIds = Object.keys(SHANXI_SAUCE_PROFILES);
    const noodleIds = Object.keys(SHANXI_NOODLE_PROFILES);

    sauceIds.forEach((sauceId) => {
      noodleIds.forEach((noodleId) => {
        expect(SHANXI_MATCH_RULES[`${sauceId}:${noodleId}` as keyof typeof SHANXI_MATCH_RULES]).toBeDefined();
      });
    });
  });

  it("keeps random micro-variation within required bounds", () => {
    const descriptor = getShanxiRenderDescriptor({
      sauceType: "tomato",
      noodleShape: "lamian",
      seedKey: "tomato:lamian:7",
    });

    expect(descriptor.variation.spreadOffsetPct).toBeGreaterThanOrEqual(-0.05);
    expect(descriptor.variation.spreadOffsetPct).toBeLessThanOrEqual(0.05);
    expect(descriptor.variation.saturationDeltaPct).toBeGreaterThanOrEqual(-0.03);
    expect(descriptor.variation.saturationDeltaPct).toBeLessThanOrEqual(0.03);
  });

  it("produces readable metrics for the debug panel", () => {
    const descriptor = getShanxiRenderDescriptor({
      sauceType: "beef",
      noodleShape: "maoer",
      seedKey: "beef:maoer:11",
    });

    expect(descriptor.metrics.attachmentRate).toBeGreaterThan(60);
    expect(descriptor.metrics.gamutSpread).toBeGreaterThan(30);
    expect(descriptor.metrics.highlightContrast).toBeGreaterThan(20);
  });
});
