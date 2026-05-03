import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CardOne } from "@/components/CardOne";
import { CardTwo } from "@/components/CardTwo";
import { CardThree } from "@/components/CardThree";
import { CardFour } from "@/components/CardFour";
import { PhoneFrame } from "@/components/PhoneFrame";
import { useThemeAudio } from "@/hooks/useThemeAudio";
import { AudioFocusProvider } from "@/hooks/AudioFocusContext";
import { loadThemes, getLocalJsonDataSource } from "@/lib/dataLoader";
import { ThemeData, ThemeId, getThemeCardCount } from "@/types/theme";
import { getThemeBgColorFromScreenshotUrls } from "@/lib/colorUtils";
import { FilterParams } from "@/lib/deepseekApi";

const VALID: ThemeId[] = ["001", "002", "003", "004", "005", "006"];

// 风格key映射
const STYLE_KEY_MAP: Record<number, string> = {
  0: "positive",
  1: "sad",
  2: "realistic",
  3: "inspirational",
  4: "literary",
  5: "relaxed",
  6: "funny",
  7: "romantic",
};

export default function Theme() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resolvedThemeId = id && VALID.includes(id as ThemeId) ? (id as ThemeId) : null;
  const [data, setData] = useState<ThemeData | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const totalCards = id && VALID.includes(id as ThemeId) ? getThemeCardCount(id as ThemeId) : 3;
  const initialCard = Math.min(
    totalCards - 1,
    Math.max(0, parseInt(searchParams.get("card") ?? "1", 10) - 1),
  );
  const [cardIndex, setCardIndex] = useState(initialCard);
  const themeAudio = useThemeAudio(resolvedThemeId);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 使用原生事件监听器阻止触摸滑动 (passive: false 允许 preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const options: AddEventListenerOptions = { passive: false };
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    container.addEventListener("touchstart", handleTouchStart, options);
    container.addEventListener("touchmove", handleTouchMove, options);
    container.addEventListener("touchend", handleTouchEnd, options);
    container.addEventListener("contextmenu", handleContextMenu);
    
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  const audioApi = useMemo(
    () => ({ pauseForVideo: themeAudio.pauseForVideo, resumeFromVideo: themeAudio.resumeFromVideo }),
    [themeAudio.pauseForVideo, themeAudio.resumeFromVideo],
  );

  useEffect(() => {
    const initAndLoad = async () => {
      if (!id || !VALID.includes(id as ThemeId)) {
        navigate("/");
        return;
      }

      const { setDataSource } = await import("@/lib/dataLoader");
      setDataSource(getLocalJsonDataSource());

      const loaded = await loadThemes();
      const themeData = loaded[id as ThemeId];
      setData(themeData ?? null);

      if (!themeData) {
        navigate("/");
        return;
      }
    };
    initAndLoad();
  }, [id, navigate]);

  useEffect(() => {
    setCardIndex((current) => Math.min(totalCards - 1, current));
  }, [totalCards]);

  useEffect(() => {
    if (!data) return;

    if (data.bgColor) return;
    const screenshotUrls = [data.photo1, data.photo2].filter(Boolean);
    if (screenshotUrls.length === 0) return;

    let active = true;
    getThemeBgColorFromScreenshotUrls(screenshotUrls).then((bgColor) => {
      if (!active || !bgColor) return;
      setData((current) => (current ? { ...current, bgColor } : current));
    });

    return () => {
      active = false;
    };
  }, [data]);

  if (!data) return null;

  // 严格的卡片导航函数 - 只允许通过按钮操作
  function go(delta: number) {
    setCardIndex((current) => {
      const next = current + delta;
      // 严格边界检查：不能越界
      // 第一张卡片(cardIndex=0)时，禁止左滑(go(-1))回到最后一张
      // 最后一张卡片(cardIndex=totalCards-1)时，禁止右滑(go(1))回到第一张
      if (next < 0 || next >= totalCards) {
        return current; // 边界处不响应，保持当前位置
      }
      return next;
    });
  }

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-neutral-950 select-none"
      style={{ touchAction: "none" }}
    >
      <button
        onClick={() => navigate("/")}
        className="fixed left-4 top-4 z-50 flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20"
      >
        <ChevronLeft className="h-4 w-4" />
        返回
      </button>

      {/* 左右切换按钮 */}
      <button
        onClick={() => go(-1)}
        disabled={cardIndex === 0}
        className="fixed left-4 top-1/2 z-50 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30"
        aria-label="上一张"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        disabled={cardIndex === totalCards - 1}
        className="fixed right-4 top-1/2 z-50 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30"
        aria-label="下一张"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* 卡片索引提示 */}
      <div className="fixed right-4 top-4 z-50 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur">
        卡片 {cardIndex + 1} / {totalCards}
      </div>

      {/* 预加载状态提示 */}
      {isPreloading && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-xs text-blue-200 backdrop-blur">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>AI正在生成滤镜参数和文案...</span>
        </div>
      )}

      <AudioFocusProvider audioApi={audioApi}>
        {/* 触摸滑动已在父容器通过原生事件监听器阻止 */}
        <div style={{ touchAction: "none" }}>
          <PhoneFrame>
            {cardIndex === 0 && <CardOne data={data} totalCards={totalCards} />}
            {cardIndex === 1 && (
              <CardTwo 
                data={data} 
                totalCards={totalCards}
                onUpdateFilterParams={(params: FilterParams) => {
                  setData((current) => current ? {
                    ...current,
                    c2_brightness: params.brightness,
                    c2_contrast: params.contrast,
                    c2_saturation: params.saturation,
                    c2_temperature: params.temperature,
                    c2_highlight: params.highlight,
                    c2_shadow: params.shadow,
                    c2_grain: params.grain,
                    c2_filter: params.filter,
                  } : current);
                }}
              />
            )}
            {cardIndex === 2 && (
              <CardThree 
                data={data}
                totalCards={totalCards}
                onUpdateCopywriting={(updates) => {
                  setData((current) => current ? { ...current, ...updates } : current);
                }}
              />
            )}
            {cardIndex === 3 && totalCards === 4 && <CardFour data={data} totalCards={totalCards} themeAudio={themeAudio} />}
          </PhoneFrame>
        </div>
      </AudioFocusProvider>
    </div>
  );
}
