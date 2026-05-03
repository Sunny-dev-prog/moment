import { useEffect, useRef, useState } from "react";
import { Home, Menu, MessageCircle, Plus, Search, Sparkles, User, Users } from "lucide-react";
import type { ThemeData } from "@/types/theme";
import { getThemeTitleVars, isLightBackground, parseBgColorGradient } from "@/lib/colorUtils";
import {
  WUHAN_CARD_SHELL,
  WUHAN_SHOWCASE_THEMES,
  type WuhanPhotoSourceSet,
  type WuhanShowcaseLayout,
  type WuhanShowcaseTheme,
} from "@/components/wuhan-card4/wuhanLightShowConfig";

type CardProps = {
  data?: ThemeData;
  totalCards?: number;
};

export type WuhanLightShowCompareProps = {
  themeList?: WuhanShowcaseTheme[];
  onChange?: (theme: WuhanShowcaseTheme) => void;
  layout?: WuhanShowcaseLayout;
};

export function WuhanLightShowCard({ data, totalCards = 4 }: CardProps) {
  const lightBg = isLightBackground(data?.bgColor);
  const titleVars = getThemeTitleVars(data?.bgColor || "");
  const bgStyle = data?.bgColor
    ? { background: parseBgColorGradient(data.bgColor) }
    : { background: WUHAN_CARD_SHELL.background };
  const textMain = lightBg ? "text-neutral-900" : "text-white";
  const textSoft = lightBg ? "text-neutral-700" : "text-white/80";
  const subtitleClass = "text-[15px] font-semibold tracking-[0.04em]";
  const tabBorder = lightBg ? "border-neutral-200" : "border-white/15";

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={bgStyle}>
      <style>{`
        @keyframes wuhan-btn-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(255,215,0,0.25), 0 4px 12px -4px rgba(255,215,0,0.2); }
          50% { box-shadow: 0 0 28px rgba(255,215,0,0.7), 0 0 56px rgba(255,215,0,0.25), 0 4px 16px -4px rgba(0,0,0,0.2); }
        }
        @keyframes wuhan-btn-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(120% 60% at 50% 100%, rgba(0,0,0,0.25), transparent 60%)",
          backdropFilter: "blur(2px)",
        }}
      />

      <div className="relative flex h-full flex-col px-4 pb-2 pt-3">
        <nav className="flex items-center justify-between text-[13px]">
          <Menu className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
          <div className={`flex items-center gap-3 ${textSoft}`}>
            <span>团购</span>
            <span>经验</span>
            <span>{data?.navTag || "武汉"}</span>
            <span>关注</span>
            <span>商城</span>
            <span className={`font-bold ${textMain}`}>推荐</span>
          </div>
          <Search className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
        </nav>

        <header className="mt-2" style={titleVars as React.CSSProperties}>
          <div className={`inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/45 px-2.5 py-1 text-[10px] ${textSoft} backdrop-blur`}>
            <Sparkles className="h-3 w-3" />
            黄鹤楼主题灯光实拍
          </div>
          <h1 className="theme-shared-card-title text-shadow-soft mt-2 font-extrabold leading-[1.24]">
            这一刻不只有樱花
            <br />
            这一刻的黄鹤楼同样值得你一看
          </h1>
          <p
            className={`mt-1 ${subtitleClass}`}
            style={{
              background: "linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "100% 100%",
            }}
          >
            多彩黄鹤楼 绚丽灯光秀《鹤舞千秋》
          </p>
        </header>

        <WuhanLightShowCompare themeList={WUHAN_SHOWCASE_THEMES} layout="horizontal" />

        <div className="mt-2 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalCards }).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] rounded-full ${i === 3 ? "w-8" : "w-5"} ${
                i === 3 ? (lightBg ? "bg-neutral-900" : "bg-white") : lightBg ? "bg-neutral-400" : "bg-white/35"
              }`}
            />
          ))}
        </div>

        <nav className={`mt-2 flex items-end justify-between border-t ${tabBorder} pt-2`}>
          <BottomTab icon={<Home className="h-4 w-4" />} label="首页" active light={lightBg} />
          <BottomTab icon={<Users className="h-4 w-4" />} label="朋友" light={lightBg} />
          <button className={`-mt-2 flex h-9 w-9 items-center justify-center rounded-md border-2 ${lightBg ? "border-neutral-900 text-neutral-900" : "border-white text-white"}`}>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <BottomTab icon={<MessageCircle className="h-4 w-4" />} label="消息" light={lightBg} />
          <BottomTab icon={<User className="h-4 w-4" />} label="我" light={lightBg} />
        </nav>
      </div>
    </div>
  );
}

export function WuhanLightShowCompare({
  themeList = WUHAN_SHOWCASE_THEMES,
  onChange,
  layout: _layout = "horizontal",
}: WuhanLightShowCompareProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({});
  const [scale, setScale] = useState(1);
  const lockTimerRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);
  const autoPlayRef = useRef<number | null>(null);
  const userActiveRef = useRef(false);
  const lockedRef = useRef(false);

  const activeTheme = themeList[activeIndex] ?? themeList[0];
  const activePhotoSrc = getPreferredPhotoSrc(activeTheme?.photo);
  const hasImageError = Boolean(activeTheme && errorMap[activeTheme.id]);
  const isImageLoaded = Boolean(activeTheme && loadedMap[activeTheme.id]);

  useEffect(() => {
    if (!activeTheme || !activePhotoSrc || isImageLoaded || hasImageError || typeof Image === "undefined") return;

    let cancelled = false;
    const image = new Image();
    image.src = activePhotoSrc;
    image.onload = () => {
      if (!cancelled) setLoadedMap((current) => ({ ...current, [activeTheme.id]: true }));
    };
    image.onerror = () => {
      if (!cancelled) {
        reportImageLoadError(activeTheme.id);
        setErrorMap((current) => ({ ...current, [activeTheme.id]: true }));
      }
    };
    return () => {
      cancelled = true;
    };
  }, [activePhotoSrc, activeTheme, hasImageError, isImageLoaded]);

  useEffect(
    () => () => {
      if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
      if (autoPlayRef.current) window.clearTimeout(autoPlayRef.current);
    },
    [],
  );

  const switchTheme = (nextIndex: number, isUserAction = false) => {
    if (!themeList.length || lockedRef.current || nextIndex === activeIndex || nextIndex < 0 || nextIndex >= themeList.length) return;
    if (isUserAction) userActiveRef.current = true;
    setActiveIndex(nextIndex);
    setScale(1);
    onChange?.(themeList[nextIndex]);
    lockedRef.current = true;
    if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      lockedRef.current = false;
    }, 300);
  };

  /* 自动轮播：1秒无操作自动切换到下一个主题 */
  useEffect(() => {
    if (autoPlayRef.current) window.clearTimeout(autoPlayRef.current);

    if (userActiveRef.current) {
      /* 用户刚操作过，1.5秒后恢复自动轮播 */
      autoPlayRef.current = window.setTimeout(() => {
        userActiveRef.current = false;
        switchTheme((activeIndex + 1) % themeList.length);
      }, 1500);
    } else {
      autoPlayRef.current = window.setTimeout(() => {
        switchTheme((activeIndex + 1) % themeList.length);
      }, 1000);
    }

    return () => {
      if (autoPlayRef.current) window.clearTimeout(autoPlayRef.current);
    };
  }, [activeIndex, themeList.length]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      pinchRef.current = {
        distance: getDistance(event.touches[0], event.touches[1]),
        scale,
      };
      touchStartXRef.current = null;
      return;
    }
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && pinchRef.current) {
      const nextDistance = getDistance(event.touches[0], event.touches[1]);
      const ratio = nextDistance / Math.max(1, pinchRef.current.distance);
      setScale(clamp(pinchRef.current.scale * ratio, 0.5, 2));
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (pinchRef.current && event.touches.length < 2) {
      pinchRef.current = null;
      return;
    }
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    touchStartXRef.current = null;
    if (startX === null || endX === null) return;
    const delta = endX - startX;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) switchTheme((activeIndex + 1) % themeList.length, true);
    if (delta > 0) switchTheme((activeIndex - 1 + themeList.length) % themeList.length, true);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && Math.abs(event.deltaY) < 3) return;
    event.preventDefault();
    setScale((current) => clamp(current + (event.deltaY < 0 ? 0.08 : -0.08), 0.5, 2));
  };

  if (!activeTheme) return null;

  return (
    <div className="mt-3 flex-1">
      <div className="grid grid-cols-4 gap-2" role="tablist" aria-label="黄鹤楼灯光主题">
        {themeList.map((theme, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={theme.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={theme.label}
              disabled={lockedRef.current}
              onClick={() => switchTheme(index, true)}
              data-testid={`theme-btn-${theme.id}`}
              className={`group relative overflow-visible rounded-full border px-3 font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,215,0,0.5)] focus-visible:ring-offset-2 active:scale-95 ${
                active
                  ? "min-h-[50px] text-[15px] border-white/70 bg-[#FFD700] text-[#1a1a1a] shadow-[0_0_18px_rgba(255,215,0,0.5),0_4px_12px_-4px_rgba(0,0,0,0.3)] scale-110"
                  : "min-h-[42px] text-[13px] border-amber-300/50 bg-[rgba(255,215,0,0.85)] text-[#1a1a1a] shadow-[0_4px_12px_-4px_rgba(255,215,0,0.3)] hover:bg-[#FFD700] hover:shadow-[0_0_16px_rgba(255,215,0,0.45),0_4px_12px_-4px_rgba(0,0,0,0.25)]"
              } disabled:cursor-not-allowed disabled:opacity-85`}
              style={!active ? { animation: `wuhan-btn-glow 2s ease-in-out ${index * 0.2}s infinite, wuhan-btn-float 2.5s ease-in-out ${index * 0.15}s infinite` } : undefined}
            >
              <span className="relative z-10">{theme.label}</span>
            </button>
          );
        })}
      </div>

      <section className="glass-card-deep mt-3 flex h-[38vh] min-h-[260px] flex-col overflow-hidden rounded-[24px] px-3 py-3 shadow-[0_20px_60px_-28px_rgba(70,26,48,0.45)]">
        <div className="grid h-full grid-cols-[minmax(0,1.45fr)_96px] gap-3">
          <div
            data-testid="showcase-stage"
            data-scale={scale.toFixed(2)}
            className="relative overflow-hidden rounded-[20px] border border-white/55 bg-white/16"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            style={{ touchAction: "pan-y pinch-zoom" }}
          >
            <div
              className="absolute inset-0 transition-transform duration-300 ease-in-out"
              style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
            >
              <RealityPanel
                theme={activeTheme}
                photoLoaded={isImageLoaded}
                photoFailed={hasImageError}
                onImageLoad={() => setLoadedMap((current) => ({ ...current, [activeTheme.id]: true }))}
                onImageError={() => {
                  reportImageLoadError(activeTheme.id);
                  setErrorMap((current) => ({ ...current, [activeTheme.id]: true }));
                }}
              />
            </div>
          </div>

          <aside className="flex flex-col justify-between rounded-[20px] border border-white/55 bg-white/24 px-3 py-4 backdrop-blur-md">
            <div>
              <div
                className="mx-auto text-[18px] leading-none text-white"
                style={{
                  fontFamily: '"STKaiti","KaiTi","FangSong","Noto Serif SC","Songti SC",serif',
                  letterSpacing: "0.16em",
                  textShadow: "0 2px 10px rgba(0,0,0,0.22)",
                }}
              >
                黄鹤楼
              </div>
              <div className="mt-2 h-px bg-white/30" />
            </div>
            <div
              className="mx-auto flex flex-1 flex-row-reverse items-start justify-center gap-2 py-2 text-white"
              aria-label="黄鹤楼四句诗"
            >
              {[
                { line: "昔人已乘黄鹤去", marginTop: "0%" },
                { line: "此地空余黄鹤楼", marginTop: "12%" },
                { line: "黄鹤一去不复返", marginTop: "24%" },
                { line: "白云千载空悠悠", marginTop: "36%" },
              ].map(({ line, marginTop }) => (
                <p
                  key={line}
                  className="text-[14px] leading-none"
                  style={{
                    marginTop,
                    writingMode: "vertical-rl",
                    textOrientation: "upright",
                    fontFamily: '"Zhi Mang Xing","STXingkai","KaiTi","STKaiti","FangSong","Noto Serif SC","Songti SC",serif',
                    letterSpacing: "0.14em",
                    textShadow: "0 2px 10px rgba(0,0,0,0.18)",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
            <div className="text-right text-[10px] tracking-[0.16em] text-white/70">崔 颢</div>
          </aside>
        </div>
      </section>
    </div>
  );
}

type StageProps = {
  theme: WuhanShowcaseTheme;
  photoLoaded: boolean;
  photoFailed: boolean;
  onImageLoad: () => void;
  onImageError: () => void;
};

function RealityPanel({ theme, photoLoaded, photoFailed, onImageLoad, onImageError }: StageProps) {
  return (
    <ImagePanel
      theme={theme}
      photoLoaded={photoLoaded}
      photoFailed={photoFailed}
      onImageLoad={onImageLoad}
      onImageError={onImageError}
    />
  );
}

function ImagePanel({
  theme,
  photoLoaded,
  photoFailed,
  onImageLoad,
  onImageError,
}: StageProps) {
  const src = getPreferredPhotoSrc(theme.photo);

  return (
    <div className="relative h-full overflow-hidden bg-[#d5d5d5] transition-opacity ease-in-out" style={{ transitionDuration: "400ms" }}>
      {!photoLoaded && !photoFailed ? (
        <div
          className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,#d8d8d8_0%,#efefef_48%,#d8d8d8_100%)]"
          data-testid="photo-skeleton"
        />
      ) : null}

      {photoFailed || !src ? (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#cfcfcf_0%,#bdbdbd_100%)]" data-testid="photo-fallback">
          <FallbackTower />
        </div>
      ) : (
        <picture className={`absolute inset-0 block transition-opacity ease-in-out ${photoLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDuration: "400ms" }}>
          {theme.photo.webp2x ? <source srcSet={buildSrcSet(theme.photo.webp2x, theme.photo.webp3x)} type="image/webp" /> : null}
          {theme.photo.jpeg2x ? <source srcSet={buildSrcSet(theme.photo.jpeg2x, theme.photo.jpeg3x)} type="image/jpeg" /> : null}
          <img
            data-testid="reality-image"
            src={src}
            alt={theme.photo.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
            onLoad={onImageLoad}
            onError={onImageError}
          />
        </picture>
      )}
    </div>
  );
}

function FallbackTower() {
  return (
    <svg viewBox="0 0 320 320" className="h-full w-full">
      <rect width="320" height="320" fill="url(#fallback-sky)" />
      <defs>
        <linearGradient id="fallback-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d9d9d9" />
          <stop offset="100%" stopColor="#bcbcbc" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="294" rx="86" ry="16" fill="rgba(0,0,0,0.12)" />
      {[220, 176, 136, 100, 68].map((y, index) => (
        <g key={y} transform={`translate(0 ${y})`} opacity={1 - index * 0.08}>
          <path d={`M ${70 + index * 16} 12 Q 160 -8 ${250 - index * 16} 12`} fill="none" stroke="#9a9a9a" strokeWidth="3" />
          <rect x={92 + index * 14} y="12" width={136 - index * 28} height="20" rx="6" fill="#b7b7b7" stroke="#9a9a9a" />
        </g>
      ))}
    </svg>
  );
}

function BottomTab({
  icon,
  label,
  active,
  light,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  light: boolean;
}) {
  const color = active ? (light ? "text-neutral-900" : "text-white") : light ? "text-neutral-500" : "text-white/55";
  return (
    <div className={`flex w-12 flex-col items-center gap-0.5 ${color}`}>
      {icon}
      <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{label}</span>
    </div>
  );
}

function buildSrcSet(src2x?: string, src3x?: string) {
  return [src2x ? `${src2x} 2x` : null, src3x ? `${src3x} 3x` : null].filter(Boolean).join(", ");
}

function getPreferredPhotoSrc(photo: WuhanPhotoSourceSet | undefined) {
  if (!photo) return "";
  return photo.jpeg2x || photo.webp2x || photo.fallbackSrc || "";
}

function reportImageLoadError(themeId: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("wuhan-lightshow-image-error", { detail: { themeId } }));
  }
  console.error(`wuhan-lightshow-image-error:${themeId}`);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(a: Touch, b: Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
