import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  Play,
  Plus,
  Home,
  Users,
  MessageCircle,
  User,
  ImageIcon,
  X,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ThemeData } from "@/types/theme";
import { getThemeTitleVars, isLightBackground } from "@/lib/colorUtils";
import { FilterParams, generateFilterParams } from "@/lib/deepseekApi";
import { useAudioFocus } from "@/hooks/AudioFocusContext";
import {
  getThemeCardBackgroundOverlayStyle,
  getThemeCardBackgroundStyle,
} from "@/lib/themeCardBackground";

interface Props {
  data: ThemeData;
  onUpdateFilterParams?: (params: FilterParams) => void;
  totalCards?: number;
}

/** 醒图 App 唤起 scheme（找不到 App 时静默失败） */
const XINGTU_SCHEME = "snssdk1128://";

// 参数配置：中文名 + 单位/范围说明
const PARAM_CONFIG = [
  { key: "brightness", label: "亮度", unit: "" },
  { key: "contrast", label: "对比度", unit: "" },
  { key: "saturation", label: "饱和度", unit: "" },
  { key: "temperature", label: "色温", unit: "" },
  { key: "highlight", label: "高光", unit: "" },
  { key: "shadow", label: "阴影", unit: "" },
  { key: "grain", label: "颗粒", unit: "" },
  { key: "filter", label: "滤镜", unit: "" },
] as const;

export function CardTwo({ data, onUpdateFilterParams, totalCards = 3 }: Props) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingFullscreen = useRef(false);
  const audioFocus = useAudioFocus();
  const FOCUS_ID = "card2-video";

  const lightBg = isLightBackground(data.bgColor);
  const titleVars = getThemeTitleVars(data.bgColor);
  const themedTitleStyle = titleVars as React.CSSProperties;
  const themedTitleColorStyle = { color: "var(--card4-title-color)" };
  const bgStyle = getThemeCardBackgroundStyle(data.bgColor);

  const textMain = lightBg ? "text-neutral-900" : "text-white";
  const textSoft = lightBg ? "text-neutral-700" : "text-white/80";
  const textMuted = lightBg ? "text-neutral-500" : "text-white/55";
  const tabBorder = lightBg ? "border-neutral-200" : "border-white/15";

  // 从data中获取预生成的滤镜参数
  const filterParams: FilterParams | null = data.c2_filter && data.c2_filter !== "无" ? {
    brightness: data.c2_brightness || "0",
    contrast: data.c2_contrast || "0",
    saturation: data.c2_saturation || "0",
    temperature: data.c2_temperature || "0",
    highlight: data.c2_highlight || "0",
    shadow: data.c2_shadow || "0",
    grain: data.c2_grain || "0",
    filter: data.c2_filter,
  } : null;

  // 检查是否正在生成（正在生成时显示加载状态）
  // c2_filter为"无"或空字符串或undefined时表示还未生成AI参数
  const isGenerating = !data.c2_filter || data.c2_filter === "无" || data.c2_filter === "";

  // 当需要生成时，调用API生成滤镜参数
  useEffect(() => {
    if (!isGenerating || !onUpdateFilterParams) return;

    const generateParams = async () => {
      const sceneDescription = [
        data.timeOfDay,
        data.weather,
        data.mood,
        data.destination,
      ].filter(Boolean).join("，");

      const params = await generateFilterParams(
        data.id,
        data.navTag,
        `主题为"${data.navTag}"，场景特点：${sceneDescription}。请生成适合该场景的醒图滤镜参数。`,
        sceneDescription
      );

      if (params) {
        onUpdateFilterParams(params);
      }
    };

    generateParams();
  }, [isGenerating, data.id, data.navTag, data.timeOfDay, data.weather, data.mood, data.destination, onUpdateFilterParams]);

  useEffect(() => {
    if (!activeVideoUrl || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => undefined);
  }, [activeVideoUrl]);

  useEffect(() => {
    if (activeVideoUrl && pendingFullscreen.current && overlayRef.current?.requestFullscreen) {
      pendingFullscreen.current = false;
      overlayRef.current.requestFullscreen().catch(() => undefined);
    }
  }, [activeVideoUrl]);

  function closeVideo() {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
    pendingFullscreen.current = false;
    setActiveVideoUrl(null);
    audioFocus.releaseFocus(FOCUS_ID);
  }

  function openVideo(url: string) {
    pendingFullscreen.current = true;
    setActiveVideoUrl(url);
    audioFocus.requestFocus(FOCUS_ID);
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={bgStyle}>
      {/* 高斯模糊柔光层 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={getThemeCardBackgroundOverlayStyle()}
      />

      <div className="relative flex h-full flex-col px-4 pb-2 pt-3" style={titleVars as React.CSSProperties}>
        {/* 1. 顶栏 */}
        <nav className="flex shrink-0 items-center justify-between text-[13px]">
          <Menu className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
          <div className={`flex items-center gap-3 ${textSoft}`} style={themedTitleStyle}>
            <span>团购</span>
            <span>经验</span>
            <span style={themedTitleColorStyle}>{data.c2_navTag}</span>
            <span>关注</span>
            <span>商城</span>
            <span className={`font-bold ${textMain}`} style={themedTitleColorStyle}>推荐</span>
          </div>
          <Search className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
        </nav>

        {/* 2. 标题 */}
        <header className="shrink-0 mt-3" style={titleVars as React.CSSProperties}>
          <h1 className="theme-shared-card-title text-shadow-soft font-extrabold leading-[1.24]">
            同一地点
          </h1>
          <p className="theme-shared-card-title text-shadow-soft mt-0.5 font-extrabold leading-[1.24]">
            邂逅不同抖音创作者的高光时刻
          </p>
        </header>

        {/* 3. 中间滚动区域 */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* 视频卡片 - 左右并排抖音风格 */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <VideoCard
              title={data.c2_video1Title}
              desc={data.c2_video1Desc}
              url={data.c2_video1Url}
              cover={data.c2_video1Cover}
              lightBg={lightBg}
              titleStyle={themedTitleColorStyle}
              onOpen={openVideo}
            />
            <VideoCard
              title={data.c2_video2Title}
              desc={data.c2_video2Desc}
              url={data.c2_video2Url}
              cover={data.c2_video2Cover}
              lightBg={lightBg}
              titleStyle={themedTitleColorStyle}
              onOpen={openVideo}
            />
          </div>

          {/* "来醒图，我教你拍大片" 单独一行 */}
          <p className="shrink-0 mt-1.5 text-[20px] font-semibold leading-tight truncate-1" style={themedTitleColorStyle}>
            来醒图，我教你拍大片
          </p>

          {/* 醒图调参卡片（AI自动生成参数） */}
          <XingtuCard
            icon={data.c2_xingtuIcon}
            line1={data.c2_xingtuLine1}
            line2={data.c2_xingtuLine2}
            params={filterParams}
            isGenerating={isGenerating}
            lightBg={lightBg}
            className="shrink-0 mt-2"
            titleStyle={themedTitleColorStyle}
          />

          {/* 底部文字一行 */}
          <p className={`shrink-0 mt-1.5 text-[13px] font-medium leading-tight ${textSoft}`}>
            {[data.c2_bigLine1 || "参数超详细", data.c2_bigLine2 || "右滑再加些细节吧"].filter(Boolean).join("，")}
          </p>
        </div>

        {/* 4. 4 条卡片指示器（当前第 2 条加粗） */}
        <div className="shrink-0 mt-2 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalCards }).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] rounded-full ${i === 1 ? "w-8" : "w-5"} ${
                i === 1
                  ? lightBg ? "bg-neutral-900" : "bg-white"
                  : lightBg ? "bg-neutral-400" : "bg-white/35"
              }`}
            />
          ))}
        </div>

        {/* 5. Tab 栏 */}
        <nav className={`shrink-0 mt-2 flex items-end justify-between border-t ${tabBorder} pt-2`}>
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
        </nav>
      </div>

      {activeVideoUrl ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
        >
          <div className="relative mx-auto h-full w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl">
            <button
              type="button"
              onClick={closeVideo}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="退出全屏"
            >
              <X className="h-5 w-5" />
            </button>
            <video
              ref={videoRef}
              src={activeVideoUrl}
              className="h-full w-full bg-black object-contain"
              controls
              autoPlay
              playsInline
              onEnded={closeVideo}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- VideoCard - 抖音风格视频卡片 ---------- */
// 从文案开头提取数字（如"313"或"2.3w"），返回 {likeCount, cleanDesc}
function parseDescWithLikeCount(desc: string): { likeCount: string; cleanDesc: string } {
  // 匹配开头的数字：纯数字(313) 或 带小数点的数字(2.3w) 或 整数带单位(1.2万)
  const match = desc.match(/^(\d+(?:\.\d+)?(?:w|万)?)\s*/i);
  if (match) {
    const likeCount = match[1];
    const cleanDesc = desc.slice(match[0].length).trimStart();
    return { likeCount, cleanDesc };
  }
  return { likeCount: "0", cleanDesc: desc };
}

function VideoCard({
  title,
  desc,
  url,
  cover,
  lightBg,
  titleStyle,
  onOpen,
}: {
  title: string;
  desc: string;
  url: string;
  cover: string;
  lightBg: boolean;
  titleStyle?: React.CSSProperties;
  onOpen: (url: string) => void;
}) {
  const titleCls = lightBg ? "text-neutral-900" : "text-white";
  const descCls = lightBg ? "text-neutral-600" : "text-white/65";
  const cardCls = lightBg
    ? "bg-neutral-900/5 border border-neutral-900/10"
    : "glass-card";
  const disabled = !url;

  // 解析文案，提取数字和清洁文案
  const { likeCount, cleanDesc } = disabled ? { likeCount: "0", cleanDesc: "" } : parseDescWithLikeCount(desc);

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) onOpen(url);
      }}
      disabled={disabled}
      className={`flex flex-col overflow-hidden rounded-xl text-left transition active:scale-[0.99] ${cardCls} ${
        disabled ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      {/* 视频封面区域 - 竖版比例 */}
      <div className="relative aspect-[5/7] w-full bg-neutral-800 overflow-hidden">
        {/* 封面图片 */}
        {cover && (
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {/* 播放按钮 */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
          </div>
        </div>
        {/* 时长标签 */}
        <div className="absolute bottom-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded text-[10px] bg-black/50 text-white">
          {disabled ? "待补充" : "00:15"}
        </div>
      </div>
      
      {/* 文字信息区域 - 固定高度布局确保底部对齐 */}
      <div className="flex flex-col flex-1 min-h-0 px-2 py-1.5">
        {/* 标题行 */}
        <div className={`text-[13px] font-semibold leading-tight ${titleCls}`} style={titleStyle}>
          {title}
        </div>
        
        {/* 文案区域 - 严格限制两行，超出显示省略号 */}
        <div 
          className={`text-[11px] leading-snug ${descCls} line-clamp-2 break-words`}
          style={{ 
            paddingTop: "2px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "2.2em" // 确保即使只有一行也有固定高度
          }}
        >
          {disabled ? "视频资源暂不可用" : cleanDesc}
        </div>
        
        {/* 点赞数 - 固定在底部，使用flex-grow保持对齐 */}
        <div 
          className={`flex items-center gap-1 text-[10px] ${descCls} flex-shrink-0`}
          style={{ 
            paddingTop: "4px",
            marginTop: "auto", // 将点赞区推到容器底部
            minHeight: "16px" // 确保点赞数行高度固定
          }}
        >
          <Heart className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{likeCount}</span>
        </div>
      </div>
    </button>
  );
}

/* ---------- XingtuCard - 醒图参数卡片（2行4列布局） ---------- */
function XingtuCard({
  icon,
  line1,
  line2,
  params,
  isGenerating,
  lightBg,
  className,
  titleStyle,
}: {
  icon: string;
  line1: string;
  line2: string;
  params: FilterParams | null;
  isGenerating: boolean;
  lightBg: boolean;
  className?: string;
  titleStyle?: React.CSSProperties;
}) {
  const baseCls = lightBg
    ? "bg-neutral-900/5 border border-neutral-900/10"
    : "glass-card";
  const titleCls = lightBg ? "text-neutral-900" : "text-white";
  const subCls = lightBg ? "text-neutral-600" : "text-white/65";
  const keyCls = lightBg ? "text-neutral-500" : "text-white/50";
  const valCls = lightBg ? "text-neutral-900" : "text-white";
  const dividerCls = lightBg ? "bg-neutral-900/10" : "bg-white/15";

  function openXingtu() {
    try {
      window.location.href = XINGTU_SCHEME;
    } catch {
      /* noop */
    }
  }

  // 获取参数值数组，按顺序：亮度、对比度、饱和度、色温、高光、阴影、颗粒、滤镜
  const getParamValue = (key: string): string => {
    if (!params) return "-";
    switch (key) {
      case "brightness": return params.brightness;
      case "contrast": return params.contrast;
      case "saturation": return params.saturation;
      case "temperature": return params.temperature;
      case "highlight": return params.highlight;
      case "shadow": return params.shadow;
      case "grain": return params.grain;
      case "filter": return params.filter;
      default: return "-";
    }
  };

  return (
    <div
      onClick={openXingtu}
      className={`flex flex-col rounded-xl px-3 py-2 transition active:scale-[0.99] ${baseCls} ${className ?? ""}`}
    >
      {/* 醒图卡片头部 - 左边文字，右边图标 */}
      <div className="flex items-center gap-2">
        {/* 左侧：文字两行 */}
        <div className="min-w-0 flex-1">
          <div className={`text-[12px] font-semibold ${titleCls}`} style={titleStyle}>{line1}</div>
          <div className={`text-[10px] ${subCls}`}>{line2}</div>
        </div>

        {/* 右侧：醒图APP图标或加载状态 */}
        <div className="shrink-0 h-9 w-9 rounded-lg bg-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {isGenerating ? (
            <Loader2 className="h-4 w-4 text-neutral-500 animate-spin" />
          ) : icon ? (
            <img src={icon} alt="Xingtu" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-4 w-4 text-neutral-400" />
          )}
        </div>
      </div>

      {/* 分割线 */}
      <div className={`h-px w-full ${dividerCls} my-2`} />

      {/* 8 个键值参数，2 行 × 4 列 */}
      {isGenerating ? (
        <div className={`flex items-center justify-center py-4 ${subCls}`}>
          <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
          <span className="text-[11px]">AI正在生成滤镜参数...</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-x-2 gap-y-2">
          {PARAM_CONFIG.map((config) => (
            <div key={config.key} className="flex flex-col">
              <span className={`text-[9px] ${keyCls}`}>{config.label}</span>
              <span className={`text-[11px] font-semibold truncate ${valCls}`}>
                {getParamValue(config.key)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 默认滤镜参数
function getDefaultFilterParams(themeId: string): FilterParams {
  const defaults: Record<string, FilterParams> = {
    "001": { brightness: "10", contrast: "15", saturation: "20", temperature: "-5", highlight: "-10", shadow: "15", grain: "5", filter: "夜樱" },
    "002": { brightness: "5", contrast: "10", saturation: "25", temperature: "10", highlight: "-5", shadow: "20", grain: "0", filter: "奶夏" },
    "003": { brightness: "-5", contrast: "20", saturation: "-10", temperature: "-15", highlight: "-20", shadow: "30", grain: "15", filter: "古都" },
    "004": { brightness: "15", contrast: "5", saturation: "30", temperature: "5", highlight: "10", shadow: "10", grain: "0", filter: "北野" },
    "005": { brightness: "20", contrast: "10", saturation: "5", temperature: "-20", highlight: "15", shadow: "25", grain: "10", filter: "雪境" },
    "006": { brightness: "-10", contrast: "25", saturation: "40", temperature: "25", highlight: "-30", shadow: "40", grain: "20", filter: "繁花" },
  };
  return defaults[themeId] || { brightness: "0", contrast: "0", saturation: "0", temperature: "0", highlight: "0", shadow: "0", grain: "0", filter: "原生" };
}

/* ---------- TabItem ---------- */
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
