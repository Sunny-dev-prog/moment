import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { SENTINEL_BACKGROUND, SENTINEL_OVERLAY } = vi.hoisted(() => ({
  SENTINEL_BACKGROUND: "rgb(1, 2, 3)",
  SENTINEL_OVERLAY: "rgba(255, 255, 255, 0.2)",
}));

vi.mock("@/lib/themeCardBackground", () => ({
  THEME_CARD_BACKGROUND_OVERLAY: SENTINEL_OVERLAY,
  getThemeCardBackgroundStyle: vi.fn(() => ({ background: SENTINEL_BACKGROUND })),
  getThemeCardBackgroundOverlayStyle: vi.fn(() => ({ background: SENTINEL_OVERLAY })),
}));

import { CardFour } from "@/components/CardFour";
import { CardOne } from "@/components/CardOne";
import { CardThree } from "@/components/CardThree";
import { CardTwo } from "@/components/CardTwo";
import { getThemeCardBackgroundOverlayStyle, getThemeCardBackgroundStyle } from "@/lib/themeCardBackground";
import { emptyThemeData } from "@/types/theme";

function createTheme004Data() {
  return {
    ...emptyThemeData("004"),
    bgColor: "#879b84;#566a59;#233129",
    c2_filter: "北野",
    c3_emo1: "阿勒泰的风里有自由的味道",
    c3_emo2: "阿勒泰那么大，却没有一个角落属于我",
    c3_emo3: "阿勒泰很美，但路途遥远，值得一来",
    c3_emo4: "去阿勒泰，寻找内心深处的宁静",
    c3_emo5: "雪山、草原、湖泊，这里是大地的诗篇",
    c3_emo6: "在阿勒泰，时间是用来浪费的",
    c3_emo7: "阿勒泰的牛羊：这些人类真奇怪，看我们吃草",
    c3_emo8: "想和你一起在阿勒泰的草原上数星星",
  };
}

function getCardRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement;
}

describe("theme card background sync", () => {
  it("keeps theme 004 card four background in sync with cards one to three", () => {
    const data = createTheme004Data();
    vi.mocked(getThemeCardBackgroundStyle).mockClear();
    vi.mocked(getThemeCardBackgroundOverlayStyle).mockClear();

    const cardOne = getCardRoot(render(<CardOne data={data} totalCards={4} />).container);
    const cardTwo = getCardRoot(render(<CardTwo data={data} totalCards={4} />).container);
    const cardThree = getCardRoot(render(<CardThree data={data} totalCards={4} />).container);
    const cardFour = getCardRoot(render(<CardFour data={data} totalCards={4} />).container);

    [cardOne, cardTwo, cardThree, cardFour].forEach((card) => {
      expect(card.style.background).toBe(SENTINEL_BACKGROUND);
      expect((card.children[0] as HTMLElement).style.background).toBe(SENTINEL_OVERLAY);
    });

    expect(getThemeCardBackgroundStyle).toHaveBeenCalledTimes(4);
    expect(getThemeCardBackgroundOverlayStyle).toHaveBeenCalledTimes(4);
    expect(vi.mocked(getThemeCardBackgroundStyle).mock.calls).toEqual([
      [data.bgColor],
      [data.bgColor],
      [data.bgColor],
      [data.bgColor],
    ]);
  });

  it("exposes the real fallback rule for empty theme backgrounds", async () => {
    const actual = await vi.importActual<typeof import("@/lib/themeCardBackground")>("@/lib/themeCardBackground");
    expect(actual.getThemeCardBackgroundStyle("").background).toBe("#ffffff");
  });
});
