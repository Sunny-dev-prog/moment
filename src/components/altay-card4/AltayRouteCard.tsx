import { Home, Menu, MessageCircle, Plus, Search, User, Users } from "lucide-react";
import { Theme4Card4VideoShell } from "@/components/altay-card4/Theme4Card4VideoShell";
import { getThemeTitleVars, isLightBackground } from "@/lib/colorUtils";
import { getThemeCardBackgroundOverlayStyle, getThemeCardBackgroundStyle } from "@/lib/themeCardBackground";
import type { ThemeData } from "@/types/theme";

const ALTAI_THEME_BG_FALLBACK = "#879b84;#566a59;#233129";

export function AltayRouteCard({
  data,
  totalCards,
}: {
  data: ThemeData;
  totalCards: number;
}) {
  const resolvedBgColor = data.bgColor || ALTAI_THEME_BG_FALLBACK;
  const lightBg = isLightBackground(resolvedBgColor);
  const titleVars = getThemeTitleVars(resolvedBgColor);
  const bgStyle = getThemeCardBackgroundStyle(resolvedBgColor);
  const textMain = lightBg ? "text-neutral-900" : "text-white";
  const textSoft = lightBg ? "text-neutral-700" : "text-white/80";
  const tabBorder = lightBg ? "border-neutral-200" : "border-white/15";
  const themedTitleStyle = titleVars as React.CSSProperties;
  const themedTitleColorStyle = { color: "var(--card4-title-color)" };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden text-[#173854]" style={bgStyle}>
      <div className="pointer-events-none absolute inset-0" style={getThemeCardBackgroundOverlayStyle()} />
      <div className="relative h-full w-full">
        <nav className="absolute inset-x-0 top-0 z-20 px-5 pt-3 text-[13px]">
          <div className="flex items-center justify-between">
            <Menu className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
            <div className={`flex items-center gap-3 ${textSoft}`} style={themedTitleStyle}>
              <span>团购</span>
              <span>经验</span>
              <span style={themedTitleColorStyle}>{data.navTag}</span>
              <span>关注</span>
              <span>商城</span>
              <span className={`font-bold ${textMain}`} style={themedTitleColorStyle}>推荐</span>
            </div>
            <Search className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
          </div>
        </nav>

        <div
          className="relative z-10 px-5 pt-11"
          data-testid="theme4-card4-content-flow"
        >
          <header className="mt-3" style={themedTitleStyle}>
            <h1
              className="theme-shared-card-title text-shadow-soft font-extrabold"
              data-testid="altay-card4-title"
            >
              <span className="block">从阿勒泰出发</span>
              <span className="block">这是一条完美的驾车环线</span>
            </h1>
          </header>
        </div>

        {/* 提示板块 - 紧跟导航栏"推荐"下方 */}
        <div className="absolute right-3 z-20" style={{ top: '44px' }}>
          <div className="rounded-2xl px-3.5 py-2.5 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] pointer-events-none" style={{ animation: "altay-hint-bounce 1.6s ease-in-out infinite", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)" }}>
            <span className="block text-[15px] font-extrabold leading-snug" style={{ color: "#FFD700", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
              点击任何一个地点
            </span>
            <span className="block text-[15px] font-extrabold leading-snug" style={{ color: "#FFD700", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
              了解详细信息
            </span>
          </div>
        </div>

        <div
          className="absolute inset-x-5 top-[118px] bottom-[52px] z-10 overflow-hidden"
          data-testid="theme4-card4-panel-wrap"
        >
          <Theme4Card4VideoShell />
        </div>

        <nav className={`absolute inset-x-0 bottom-0 z-20 px-5 pb-2 pt-2 ${tabBorder} border-t`}>
          <div className="flex items-end justify-between">
            <TabItem icon={<Home className="h-4 w-4" />} label="首页" active light={lightBg} style={themedTitleStyle} />
            <TabItem icon={<Users className="h-4 w-4" />} label="朋友" light={lightBg} />
            <button
              className={`-mt-2 flex h-9 w-9 items-center justify-center rounded-md border-2 ${
                lightBg ? "border-neutral-900 text-neutral-900" : "border-white text-white"
              }`}
              style={themedTitleStyle}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <TabItem icon={<MessageCircle className="h-4 w-4" />} label="消息" light={lightBg} />
            <TabItem icon={<User className="h-4 w-4" />} label="我" light={lightBg} />
          </div>
        </nav>
      </div>
    </div>
  );
}

function TabItem({
  icon,
  label,
  active,
  light,
  style,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  light: boolean;
  style?: React.CSSProperties;
}) {
  const color = active
    ? light ? "text-neutral-900" : "text-white"
    : light ? "text-neutral-500" : "text-white/55";
  return (
    <div className={`flex w-12 flex-col items-center gap-0.5 ${color}`} style={active ? style : undefined}>
      {icon}
      <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{label}</span>
    </div>
  );
}
