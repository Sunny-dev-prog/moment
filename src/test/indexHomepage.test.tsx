import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/dataLoader", () => ({
  loadThemes: vi.fn(async () => ({})),
  getLocalJsonDataSource: vi.fn(() => ({})),
  setDataSource: vi.fn(),
}));

vi.mock("@/hooks/useThemeAudio", () => ({
  useThemeAudio: vi.fn(() => undefined),
  warmThemeAudioFromGesture: vi.fn(async () => undefined),
}));

import Index from "@/pages/Index";

describe("Index homepage", () => {
  it("使用首屏背景图并展示6个景点按钮", async () => {
    render(<Index />);

    const grid = await screen.findByTestId("homepage-theme-grid");
    expect(grid).toBeInTheDocument();

    [
      "武汉东湖樱花园",
      "云南大理洱海",
      "太原古县城",
      "阿勒泰风景名胜区",
      "吉林长白山",
      "上海外滩",
    ].forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });

    expect(screen.queryByText("阳光微笑队")).not.toBeInTheDocument();
  });
});
