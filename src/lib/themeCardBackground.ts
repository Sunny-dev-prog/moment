import { parseBgColorGradient } from "@/lib/colorUtils";

export const THEME_CARD_BACKGROUND_OVERLAY =
  "radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(120% 60% at 50% 100%, rgba(0,0,0,0.25), transparent 60%)";

export function getThemeCardBackgroundStyle(bgColor: string) {
  return bgColor
    ? { background: parseBgColorGradient(bgColor) }
    : { background: "#ffffff" };
}

export function getThemeCardBackgroundOverlayStyle() {
  return {
    background: THEME_CARD_BACKGROUND_OVERLAY,
  };
}
