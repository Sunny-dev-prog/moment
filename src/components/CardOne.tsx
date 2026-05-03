import { Menu, Search, Sparkles, Plus, Home, Users, MessageCircle, User, ChevronUp } from "lucide-react";
import { ThemeData } from "@/types/theme";
import { getThemeTitleVars, isLightBackground } from "@/lib/colorUtils";
import {
  getThemeCardBackgroundOverlayStyle,
  getThemeCardBackgroundStyle,
} from "@/lib/themeCardBackground";
import { PhonePolaroid } from "./PhonePolaroid";

interface Props {
  data: ThemeData;
  totalCards?: number;
}

/**
 * 卡片一：抖音 9:19.5 竖屏布局
 * 完整还原参考图的层级结构，所有文字均来自 ThemeData，未配置时显示占位符。
 */
export function CardOne({ data, totalCards = 3 }: Props) {
  const lightBg = isLightBackground(data.bgColor);
  const titleVars = getThemeTitleVars(data.bgColor);
  const themedTitleStyle = { color: "var(--card4-title-color)" };
  const bgStyle = getThemeCardBackgroundStyle(data.bgColor);

  // 文字配色：浅背景用深色，深背景用白色
  const textMain = lightBg ? "text-neutral-900" : "text-white";
  const textSoft = lightBg ? "text-neutral-700" : "text-white/80";
  const textMuted = lightBg ? "text-neutral-500" : "text-white/55";
  const dividerCls = lightBg ? "bg-neutral-300" : "bg-white/25";
  const ghostBtn = lightBg
    ? "border-neutral-400 text-neutral-800"
    : "border-white/40 text-white";
  const primaryBtn = lightBg
    ? "bg-neutral-900 text-white"
    : "bg-white text-neutral-900";

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={bgStyle}
    >
      {/* 高斯模糊柔光层 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          ...getThemeCardBackgroundOverlayStyle(),
          backdropFilter: "blur(2px)",
        }}
      />

      <div className="relative flex h-full flex-col px-5 pb-2 pt-3">
        {/* 1. 顶部导航 */}
        <nav className="flex items-center justify-between text-[13px]">
          <Menu className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
          <div className={`flex items-center gap-3 ${textSoft}`} style={titleVars as React.CSSProperties}>
            <span>团购</span>
            <span>经验</span>
            <span style={themedTitleStyle}>{data.navTag}</span>
            <span>关注</span>
            <span>商城</span>
            <span className={`font-bold ${textMain}`} style={themedTitleStyle}>推荐</span>
          </div>
          <Search className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
        </nav>

        {/* 2. 主标题 */}
        <header className="mt-7" style={titleVars as React.CSSProperties}>
          <h1 className="theme-shared-card-title text-shadow-soft font-extrabold">
            <span className="block">{data.title1}</span>
            <span className="block">{data.title2}</span>
            <span className="block">{data.title3}</span>
          </h1>
        </header>

        {/* 3. 信息卡片 */}
        <section className="glass-card mt-5 rounded-2xl px-4 py-3.5">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "目的地", value: data.destination },
              { label: "时段", value: data.timeOfDay },
              { label: "天气", value: data.weather },
              { label: "氛围", value: data.mood },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <div className={`text-[11px] ${textMuted}`}>{item.label}</div>
                <div className={`mt-1 truncate text-[14px] font-semibold ${textMain}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <div className={`my-3 h-px w-full ${dividerCls}`} />
          {data.infoLine && (
          <div className={`flex items-center gap-1.5 text-[12px] ${textSoft}`}>
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate-1">{data.infoLine}</span>
          </div>
          )}
        </section>

        {/* 4. 场景卡片 */}
        <section className="glass-card-deep mt-3 rounded-2xl px-4 py-3.5">
          <div className={`text-[11px] tracking-[0.18em] ${textMuted}`}>
            SCENE · <span className={textSoft}>{data.sceneLabel}</span>
          </div>
          <div className={`mt-2 text-[13px] leading-[1.55] ${textSoft}`}>
            {data.sceneLine1 && <p className="truncate-1">{data.sceneLine1}</p>}
            {data.sceneLine2 && <p className="truncate-1 mt-1">{data.sceneLine2}</p>}
            {data.sceneLine3 && <p className="truncate-1 mt-1">{data.sceneLine3}</p>}
          </div>

          {/* 拍立得 */}
          <div className="mt-3">
            <PhonePolaroid photo1={data.photo1} photo2={data.photo2} />
          </div>
        </section>

        {/* 5. 4 条卡片指示器 */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalCards }).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] rounded-full ${i === 0 ? "w-8" : "w-5"} ${
                i === 0
                  ? lightBg ? "bg-neutral-900" : "bg-white"
                  : lightBg ? "bg-neutral-400" : "bg-white/35"
              }`}
            />
          ))}
        </div>

        {/* 6. 底部按钮 */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            className={`h-11 rounded-full border text-[14px] font-medium ${ghostBtn}`}
          >
            不感兴趣
          </button>
          <button
            className={`h-11 rounded-full text-[14px] font-semibold shadow-md ${primaryBtn}`}
          >
            查看详情
          </button>
        </div>

        {/* 上滑提示 */}
        <div className={`mt-1.5 flex items-center justify-center gap-1 text-[11px] ${textMuted}`}>
          <ChevronUp className="h-3 w-3" />
          上滑继续看视频
        </div>

        {/* 7. Tab 栏 */}
        <nav className={`mt-1.5 flex items-end justify-between border-t ${lightBg ? "border-neutral-200" : "border-white/15"} pt-2`}>
          <TabItem icon={<Home className="h-4 w-4" />} label="首页" active light={lightBg} style={titleVars as React.CSSProperties} />
          <TabItem icon={<Users className="h-4 w-4" />} label="朋友" light={lightBg} />
          <button
            className={`-mt-2 flex h-9 w-9 items-center justify-center rounded-md border-2 ${lightBg ? "border-neutral-900 text-neutral-900" : "border-white text-white"}`}
            style={titleVars as React.CSSProperties}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <TabItem icon={<MessageCircle className="h-4 w-4" />} label="消息" light={lightBg} />
          <TabItem icon={<User className="h-4 w-4" />} label="我" light={lightBg} />
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
