import { useState, useRef, useEffect, useMemo } from "react";
import { THEMES, ThemeData, PLACEHOLDER, getThemeCardCount, ThemeId } from "@/types/theme";
import { loadThemes, getLocalJsonDataSource } from "@/lib/dataLoader";
import { CardOne } from "@/components/CardOne";
import { CardTwo } from "@/components/CardTwo";
import { CardThree } from "@/components/CardThree";
import { CardFour } from "@/components/CardFour";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterParams } from "@/lib/deepseekApi";
import { useThemeAudio, warmThemeAudioFromGesture } from "@/hooks/useThemeAudio";
import { AudioFocusProvider } from "@/hooks/AudioFocusContext";

const HOME_THEME_LABELS: Record<string, string> = {
  "001": "武汉东湖樱花园",
  "002": "云南大理洱海",
  "003": "太原古县城",
  "004": "阿勒泰风景名胜区",
  "005": "吉林长白山",
  "006": "上海外滩",
};

const Index = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [themes, setThemes] = useState<Record<string, ThemeData>>(() => {
    const empty: Record<string, ThemeData> = {};
    for (const t of THEMES) {
      empty[t.id] = { id: t.id, ...PLACEHOLDER } as ThemeData;
    }
    return empty;
  });
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTheme = selectedId ? themes[selectedId] : null;
  const totalCards = selectedTheme ? getThemeCardCount(selectedTheme.id) : 3;
  // selectedId 非空时播放对应主题背景音乐，为空时停止（主页静音）
  const themeAudio = useThemeAudio((selectedId as ThemeId | null) ?? null);
  const audioApi = useMemo(
    () => ({ pauseForVideo: themeAudio.pauseForVideo, resumeFromVideo: themeAudio.resumeFromVideo }),
    [themeAudio.pauseForVideo, themeAudio.resumeFromVideo],
  );

  useEffect(() => {
    setCardIndex((current) => Math.min(totalCards - 1, current));
  }, [totalCards]);

  useEffect(() => {
    const initDataSource = async () => {
      const { setDataSource } = await import("@/lib/dataLoader");
      setDataSource(getLocalJsonDataSource());
    };
    initDataSource();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadThemes();
        setThemes(data);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

  const updateThemeData = (themeId: string, updates: Partial<ThemeData>) => {
    setThemes((current) => {
      const theme = current[themeId];
      if (!theme) return current;

      return {
        ...current,
        [themeId]: {
          ...theme,
          ...updates,
        },
      };
    });
  };

  // 滑动检测
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // 最小滑动距离

    if (Math.abs(diff) < threshold) return;

    setIsTransitioning(true);
    if (diff > 0) {
      // 向左滑动 -> 下一张卡片
      setCardIndex((prev) => (prev + 1) % totalCards);
    } else {
      // 向右滑动 -> 上一张卡片
      setCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
    }
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // 键盘控制
  useEffect(() => {
    if (!selectedId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIsTransitioning(true);
        setCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
        setTimeout(() => setIsTransitioning(false), 500);
      } else if (e.key === "ArrowLeft") {
        setIsTransitioning(true);
        setCardIndex((prev) => (prev + 1) % totalCards);
        setTimeout(() => setIsTransitioning(false), 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, totalCards]);

  const renderCard = () => {
    if (!selectedTheme) return null;

    const cards = [
      <CardOne key="card1" data={selectedTheme} totalCards={totalCards} />,
      <CardTwo
        key="card2"
        data={selectedTheme}
        totalCards={totalCards}
        onUpdateFilterParams={(params: FilterParams) => {
          updateThemeData(selectedTheme.id, {
            c2_brightness: params.brightness,
            c2_contrast: params.contrast,
            c2_saturation: params.saturation,
            c2_temperature: params.temperature,
            c2_highlight: params.highlight,
            c2_shadow: params.shadow,
            c2_grain: params.grain,
            c2_filter: params.filter,
          });
        }}
      />,
      <CardThree
        key="card3"
        data={selectedTheme}
        totalCards={totalCards}
        onUpdateCopywriting={(updates) => {
          updateThemeData(selectedTheme.id, updates);
        }}
      />,
    ];

    if (totalCards === 4) {
      cards.push(<CardFour key="card4" data={selectedTheme} totalCards={totalCards} themeAudio={themeAudio} />);
    }

    return cards[cardIndex];
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-black">
      {/* 选择区域 - 当未选择时显示 */}
      {!selectedId ? (
        <main
          className="relative flex flex-1 items-end justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-5 pb-10 pt-6 sm:px-8 sm:pb-12"
          style={{ backgroundImage: 'url("/homepage/dabeij.png")' }}
        >
          <style>{`
            @keyframes gold-btn-glow {
              0%, 100% { box-shadow: 0 0 8px rgba(255,215,0,0.3), 0 4px 12px -4px rgba(255,215,0,0.25); }
              50% { box-shadow: 0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,215,0,0.2), 0 4px 16px -4px rgba(0,0,0,0.15); }
            }
            @keyframes gold-btn-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            @keyframes gold-btn-shine {
              0% { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
          `}</style>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,18,22,0.18)_0%,rgba(22,18,22,0.06)_38%,rgba(16,12,18,0.48)_78%,rgba(12,10,16,0.72)_100%)]" />

          {/* 右侧7行内容 - 整体下移避免遮挡标题 */}
          <div className="absolute right-2 top-[22%] flex flex-col items-end gap-1 sm:right-8">
            <style>{`
              @keyframes fadeInRight {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
              }
              .no-wrap { white-space: nowrap; }
            `}</style>
            {/* 导引行 - 小字体 */}
            <div className="rounded-l-2xl bg-gradient-to-l from-red-500 via-orange-400 to-yellow-400 px-3 py-1 shadow-2xl animate-[fadeInRight_0.8s_ease-out_0.5s_both]">
              <span className="no-wrap text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-sm">
                🎨 每个主题的卡片4 · 是个性化定制 ✨
              </span>
            </div>
            {/* 后六行具体内容 - 大字体 */}
            <div className="rounded-l-2xl bg-gradient-to-l from-red-500 via-orange-400 to-yellow-400 px-4 py-2 shadow-2xl animate-[fadeInRight_0.8s_ease-out_0.7s_both]">
              <span className="no-wrap text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-xl">🏯 武汉：黄鹤楼吃醋了</span>
            </div>
            <div className="rounded-l-2xl bg-gradient-to-l from-orange-500 to-red-400 px-4 py-2 shadow-2xl animate-[fadeInRight_0.8s_ease-out_0.75s_both]">
              <span className="no-wrap text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-xl">🌊 云南：把洱海装进播放器</span>
            </div>
            <div className="rounded-l-2xl bg-gradient-to-l from-red-500 via-orange-400 to-yellow-400 px-4 py-2 shadow-2xl animate-[fadeInRight_0.8s_ease-out_0.8s_both]">
              <span className="no-wrap text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-xl">🍜 太原：来亲自做一碗面</span>
            </div>
            <div className="rounded-l-2xl bg-gradient-to-l from-orange-500 to-red-400 px-4 py-2 shadow-2xl animate-[fadeInRight_0.8s_ease-out_0.85s_both]">
              <span className="no-wrap text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-xl">🚗 阿勒泰：这条驾车线路请你收下</span>
            </div>
            <div className="rounded-l-2xl bg-gradient-to-l from-red-500 via-orange-400 to-yellow-400 px-4 py-2 shadow-2xl animate-[fadeInRight_0.8s_ease-out_0.9s_both]">
              <span className="no-wrap text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-xl">⛷️ 长白山：这些滑雪姿势简直不要太帅</span>
            </div>
            <div className="rounded-l-2xl bg-gradient-to-l from-orange-500 to-red-400 px-4 py-2 shadow-2xl animate-[fadeInRight_0.8s_ease-out_0.95s_both]">
              <span className="no-wrap text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] sm:text-xl">🏛️ 上海滩：万国建筑，神秘万千</span>
            </div>
          </div>

          {/* 底部主题按钮 */}
          <div className="relative w-full max-w-[560px] mt-auto">
            <div
              className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4 sm:gap-y-4"
              data-testid="homepage-theme-grid"
            >
              {THEMES.map((t, index) => (
                <button
                  key={t.id}
                  onClick={() => {
                    void warmThemeAudioFromGesture(t.id as ThemeId);
                    setSelectedId(t.id);
                    setCardIndex(0);
                  }}
                  className="group relative flex min-h-[58px] items-center justify-center overflow-visible rounded-full border border-amber-400/60 bg-[rgba(255,215,0,0.88)] px-4 py-3 text-center font-semibold text-[#1a1a1a] shadow-[0_4px_12px_-4px_rgba(255,215,0,0.35)] backdrop-blur-[8px] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-amber-300 hover:bg-[#FFD700] hover:shadow-[0_0_16px_rgba(255,215,0,0.5),0_6px_20px_-4px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,215,0,0.6)] focus-visible:ring-offset-2 active:scale-95 sm:min-h-[64px] sm:text-[15px]"
                  style={{ animation: `gold-btn-glow 2s ease-in-out ${index * 0.15}s infinite, gold-btn-float 2.5s ease-in-out ${index * 0.12}s infinite` }}
                  data-testid={`theme-button-${t.id}`}
                >
                  <span className="relative z-10 leading-[1.35] tracking-[0.01em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                    {HOME_THEME_LABELS[t.id] ?? t.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      ) : selectedTheme ? (
        /* 卡片预览区域 - 适配 9:16 竖屏卡片比例 */
        <AudioFocusProvider audioApi={audioApi}>
        <div
          className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-50 to-amber-100 p-3 overflow-hidden"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 装饰太阳元素 */}
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300 opacity-20 blur-3xl" />

          {/* 卡片容器 - 丝滑动画 */}
          <div className="relative w-full max-w-[420px] bg-white" style={{ aspectRatio: "9 / 16" }}>
            <div
              className="h-full w-full overflow-hidden"
              style={{
                transition: isTransitioning ? "none" : "opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                opacity: 1,
              }}
            >
              {renderCard()}
            </div>
          </div>

          {/* 卡片指示器 */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {Array.from({ length: totalCards }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsTransitioning(true);
                  setCardIndex(i);
                  setTimeout(() => setIsTransitioning(false), 500);
                }}
                className={`h-2 rounded-full transition-all ${
                  cardIndex === i
                    ? "w-6 bg-orange-400"
                    : "w-2 bg-orange-300 hover:bg-orange-400"
                }`}
              />
            ))}
          </div>

          {/* 左右箭头提示 */}
          <button
            onClick={() => {
              setIsTransitioning(true);
              setCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-orange-400/80 p-2 transition hover:bg-orange-500"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>

          <button
            onClick={() => {
              setIsTransitioning(true);
              setCardIndex((prev) => (prev + 1) % totalCards);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-orange-400/80 p-2 transition hover:bg-orange-500"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>

          {/* 返回按钮 */}
          <button
            onClick={() => setSelectedId(null)}
            className="absolute left-4 top-4 rounded-full bg-orange-400 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-500 shadow-lg"
          >
            ← 返回
          </button>

          {/* 卡片编号显示 */}
          <div className="absolute right-4 top-4 rounded-full bg-orange-400 px-4 py-2 text-sm font-bold text-white shadow-lg">
            {cardIndex + 1}/{totalCards}
          </div>
        </div>
        </AudioFocusProvider>
      ) : null}
    </div>
  );
};

export default Index;
