import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CardTwo } from "@/components/CardTwo";
import { emptyThemeData } from "@/types/theme";

function createTheme002Data(overrides?: Partial<ReturnType<typeof emptyThemeData>>) {
  return {
    ...emptyThemeData("002"),
    c2_navTag: "大理",
    c2_video1Title: "视频一",
    c2_video1Desc: "描述一",
    c2_video2Title: "视频二",
    c2_video2Desc: "描述二",
    c2_video1Url: "/total/chapter-002/video1.mp4",
    c2_video2Url: "",
    ...overrides,
  };
}

describe("CardTwo media fallback", () => {
  it("disables video card interaction when the media url is missing", () => {
    const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    render(<CardTwo data={createTheme002Data()} totalCards={4} />);

    const unavailableCard = screen.getByRole("button", { name: /视频二/i });
    expect(unavailableCard).toBeDisabled();
    expect(screen.getByText("视频资源暂不可用")).toBeInTheDocument();

    fireEvent.click(unavailableCard);

    expect(playSpy).not.toHaveBeenCalled();
    playSpy.mockRestore();
  });
});
