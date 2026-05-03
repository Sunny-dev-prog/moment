import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CardFour } from "@/components/CardFour";
import { emptyThemeData } from "@/types/theme";

function createTheme005Data() {
  return {
    ...emptyThemeData("005"),
    navTag: "长白山",
    bgColor: "#d6ecf5;#c3d9e7;#94abc0",
  };
}

describe("Changbai card4 media", () => {
  beforeEach(() => {
    vi.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders video and image media nodes with public asset urls", () => {
    const { container } = render(<CardFour data={createTheme005Data()} totalCards={4} />);

    const videos = Array.from(container.querySelectorAll("video"));
    const images = Array.from(container.querySelectorAll("img"));

    expect(videos).toHaveLength(3);
    expect(videos.map((video) => video.getAttribute("src"))).toEqual([
      "/card4/changbai-videos/001.mp4",
      "/card4/changbai-videos/002.mp4",
      "/card4/changbai-videos/003.mp4",
    ]);

    const tuangouImages = images
      .map((image) => image.getAttribute("src"))
      .filter((src): src is string => Boolean(src) && src.includes("/card4/changbai-tuangou/"));

    expect(tuangouImages).toEqual([
      "/card4/changbai-tuangou/1.jpg",
      "/card4/changbai-tuangou/2.jpg",
      "/card4/changbai-tuangou/3.jpg",
      "/card4/changbai-tuangou/4.jpg",
    ]);

    expect(screen.queryByText("视频暂不可用")).not.toBeInTheDocument();
    expect(screen.queryByText("图片加载失败")).not.toBeInTheDocument();
  });
});
