import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WuhanLightShowCompare } from "@/components/wuhan-card4/WuhanLightShowCard";
import { WUHAN_SHOWCASE_THEMES } from "@/components/wuhan-card4/wuhanLightShowConfig";

describe("WuhanLightShowCompare", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("点击按钮后切换主题，并在300ms内禁用重复触发", () => {
    const onChange = vi.fn();
    render(<WuhanLightShowCompare themeList={WUHAN_SHOWCASE_THEMES} onChange={onChange} />);

    const target = screen.getByRole("tab", { name: "流光" });
    fireEvent.click(target);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(target).toBeDisabled();

    fireEvent.click(screen.getByRole("tab", { name: "幽蓝" }));
    expect(onChange).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(301);
    });
    expect(screen.getByRole("tab", { name: "流光" })).not.toBeDisabled();
  });

  it("图片加载失败时显示灰色占位图并上报错误", async () => {
    vi.useRealTimers();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<WuhanLightShowCompare themeList={WUHAN_SHOWCASE_THEMES} />);

    const img = screen.getByTestId("reality-image");
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByTestId("photo-fallback")).toBeInTheDocument();
    });
    expect(errorSpy).toHaveBeenCalled();
  });

  it("支持左右滑动切换主题", () => {
    const onChange = vi.fn();
    render(<WuhanLightShowCompare themeList={WUHAN_SHOWCASE_THEMES} onChange={onChange} />);

    const stage = screen.getByTestId("showcase-stage");
    fireEvent.touchStart(stage, { changedTouches: [{ clientX: 220 }] });
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 130 }] });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].label).toBe("流光");
  });

  it("传入斜切布局参数时仍保持原图完整显示", () => {
    render(<WuhanLightShowCompare themeList={WUHAN_SHOWCASE_THEMES} layout="diagonal" />);

    expect(screen.getByTestId("reality-image")).toBeInTheDocument();
  });
});
