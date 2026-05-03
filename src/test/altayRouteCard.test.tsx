import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AltayRouteCard } from "@/components/altay-card4/AltayRouteCard";
import { getPublicAssetUrl } from "@/lib/publicAsset";
import { emptyThemeData } from "@/types/theme";

function createTheme004Data() {
  return {
    ...emptyThemeData("004"),
    navTag: "阿勒泰",
    bgColor: "#879b84;#566a59;#233129",
  };
}

describe("AltayRouteCard", () => {
  it("保留标题并让图片填满标题下方的整个内容区域", () => {
    const { container } = render(<AltayRouteCard data={createTheme004Data()} totalCards={4} />);

    expect(screen.getByText("从阿勒泰出发")).toBeInTheDocument();
    expect(screen.getByText("这是一条完美的驾车环线")).toBeInTheDocument();
    expect(screen.getByTestId("theme4-card4-video")).toBeInTheDocument();

    const panelWrap = screen.getByTestId("theme4-card4-panel-wrap");
    const contentFlow = screen.getByTestId("theme4-card4-content-flow");
    const image = screen.getByTestId("altay-card4-fill-image");
    const frame = screen.getByTestId("altay-card4-continuous-frame");

    expect(contentFlow.className).toContain("pt-11");
    expect(panelWrap.className).toContain("top-[118px]");
    expect(panelWrap.className).toContain("bottom-[52px]");
    expect(frame.tagName.toLowerCase()).toBe("svg");
    expect(image).toHaveAttribute("href", getPublicAssetUrl("/zt4/1.jpg"));
    expect(image.getAttribute("class")).toContain("theme4-card4-fill-image");
    expect(container.querySelectorAll("video")).toHaveLength(0);

    const navs = container.querySelectorAll("nav");
    expect(navs).toHaveLength(2);
    expect(container.querySelectorAll("button")).toHaveLength(1);
  });

  it("移除所有高德地图相关内容并且不再渲染地图节点", () => {
    render(<AltayRouteCard data={createTheme004Data()} totalCards={4} />);

    expect(screen.queryByTestId("altay-route-map-canvas")).not.toBeInTheDocument();
    expect(screen.queryByTestId("altay-route-map-viewport")).not.toBeInTheDocument();
    expect(screen.queryByTestId("altay-route-map-ready")).not.toBeInTheDocument();
    expect(screen.queryByTestId("altay-route-loading")).not.toBeInTheDocument();
    expect(document.querySelector(".theme4-card4-map-viewport")).not.toBeInTheDocument();
    expect(document.querySelector(".theme4-card4-map-stage")).not.toBeInTheDocument();
    expect(document.querySelector(".theme4-card4-map-canvas")).not.toBeInTheDocument();
  });

  it("图片以覆盖模式填满卡片区域且不会产生内部滚动条", () => {
    render(<AltayRouteCard data={createTheme004Data()} totalCards={4} />);

    const image = screen.getByTestId("altay-card4-fill-image");
    const panelWrap = screen.getByTestId("theme4-card4-panel-wrap");
    const shell = screen.getByTestId("theme4-card4-video");
    const surface = shell.querySelector(".theme4-card4-video-surface");
    const frame = screen.getByTestId("altay-card4-continuous-frame");
    const framePath = frame.querySelector("path");

    expect(image.getAttribute("class")).toContain("theme4-card4-fill-image");
    expect(panelWrap.className).toContain("overflow-hidden");
    expect(shell.className).toContain("h-full");
    expect(surface).toHaveAttribute("data-continuous-radius", "30.5");
    expect(surface).toHaveAttribute("data-continuous-smoothing", "0.528");
    expect(framePath?.getAttribute("d")).toContain("C");
  });

  it("顶部和底部导航保留与前三张卡片一致的核心文案", () => {
    const { container } = render(<AltayRouteCard data={createTheme004Data()} totalCards={4} />);

    expect(screen.getByText("团购")).toBeInTheDocument();
    expect(screen.getByText("经验")).toBeInTheDocument();
    expect(screen.getByText("阿勒泰")).toBeInTheDocument();
    expect(screen.getByText("关注")).toBeInTheDocument();
    expect(screen.getByText("商城")).toBeInTheDocument();
    expect(screen.getByText("推荐")).toBeInTheDocument();
    expect(screen.getByText("首页")).toBeInTheDocument();
    expect(screen.getByText("朋友")).toBeInTheDocument();
    expect(screen.getByText("消息")).toBeInTheDocument();
    expect(screen.getByText("我")).toBeInTheDocument();

    const [topNav, bottomNav] = Array.from(container.querySelectorAll("nav"));
    expect(topNav.className).toContain("absolute");
    expect(topNav.className).toContain("top-0");
    expect(bottomNav.className).toContain("absolute");
    expect(bottomNav.className).toContain("bottom-0");
  });

  it("标题使用共享卡片4字号和行高规则", () => {
    render(<AltayRouteCard data={createTheme004Data()} totalCards={4} />);

    const title = screen.getByTestId("altay-card4-title");
    expect(title.className).toContain("theme-shared-card-title");
    expect(title.className).toContain("font-extrabold");
    expect(title.parentElement?.className).toContain("mt-3");
    expect(title.parentElement?.className).not.toContain("absolute");
  });
});
