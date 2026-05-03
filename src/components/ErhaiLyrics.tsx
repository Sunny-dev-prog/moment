import { useEffect, useMemo, useRef, useState } from "react";
import {
  findActiveLyricIndex,
  getFallbackLyricLine,
  getLyricProgress,
  loadLyrics,
  type LyricLine,
  type LyricSource,
} from "@/lib/erhaiLyrics";

interface ErhaiLyricsProps {
  source: LyricSource;
  currentTime: number;
}

const CONTAINER_HEIGHT = 96;
const LINE_HEIGHT = 24;
const CENTER_OFFSET = CONTAINER_HEIGHT / 2 - LINE_HEIGHT / 2;
const TOUCH_RELEASE_THRESHOLD_MS = 60;

export function ErhaiLyrics({
  source,
  currentTime,
}: ErhaiLyricsProps) {
  const [lines, setLines] = useState<LyricLine[]>([getFallbackLyricLine()]);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const releaseTimerRef = useRef<number | null>(null);
  const lastTouchMoveAtRef = useRef(0);

  useEffect(() => {
    let alive = true;

    loadLyrics(source)
      .then((loaded) => {
        if (!alive) return;
        setLines(loaded);
      })
      .catch(() => {
        if (!alive) return;
        setLines([getFallbackLyricLine()]);
      })
      .finally(() => {
        if (alive) setIsReady(true);
      });

    return () => {
      alive = false;
    };
  }, [source]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = () => setIsMobile(media.matches);
    handleMediaChange();
    media.addEventListener("change", handleMediaChange);
    return () => media.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    function clearReleaseTimer() {
      if (releaseTimerRef.current !== null) {
        window.clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
    }

    function scheduleRelease() {
      clearReleaseTimer();
      releaseTimerRef.current = window.setTimeout(() => {
        setTouchActive(false);
      }, TOUCH_RELEASE_THRESHOLD_MS);
    }

    const handleTouchStart = () => {
      clearReleaseTimer();
      setTouchActive(true);
      lastTouchMoveAtRef.current = performance.now();
    };

    const handleTouchMove = () => {
      const now = performance.now();
      if (now - lastTouchMoveAtRef.current < TOUCH_RELEASE_THRESHOLD_MS) return;
      lastTouchMoveAtRef.current = now;
      setTouchActive(true);
      scheduleRelease();
    };

    const handleTouchEnd = () => {
      scheduleRelease();
    };

    node.addEventListener("touchstart", handleTouchStart, { passive: true });
    node.addEventListener("touchmove", handleTouchMove, { passive: true });
    node.addEventListener("touchend", handleTouchEnd, { passive: true });
    node.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      clearReleaseTimer();
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchmove", handleTouchMove);
      node.removeEventListener("touchend", handleTouchEnd);
      node.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const activeIndex = useMemo(() => findActiveLyricIndex(lines, currentTime), [currentTime, lines]);
  const lineProgress = useMemo(() => getLyricProgress(lines, activeIndex, currentTime), [activeIndex, currentTime, lines]);
  const translateY = -(activeIndex * LINE_HEIGHT + lineProgress * LINE_HEIGHT);

  useEffect(() => {
    if (!isMobile || touchActive) return;
    const node = containerRef.current;
    if (!node) return;

    const targetScrollTop = Math.max(0, activeIndex * LINE_HEIGHT + lineProgress * LINE_HEIGHT);
    const frame = window.requestAnimationFrame(() => {
      node.scrollTop = targetScrollTop;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, isMobile, lineProgress, touchActive]);

  return (
    <div className="relative mx-auto w-[84%] max-w-[330px]">
      <style>{`
        .erhai-lyrics-shell {
          position: relative;
          height: var(--erhai-lyrics-height);
          overflow: hidden;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.08);
          -webkit-overflow-scrolling: auto;
          scrollbar-width: none;
        }
        .erhai-lyrics-shell::-webkit-scrollbar {
          display: none;
        }
        .erhai-lyrics-sync {
          padding-block: var(--erhai-lyrics-center-offset);
          transition: transform 180ms linear;
          will-change: transform;
        }
        @media (max-width: 768px) {
          .erhai-lyrics-shell {
            overflow-y: auto;
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch;
          }
          .erhai-lyrics-sync {
            transition: none;
            transform: none !important;
            will-change: auto;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className="erhai-lyrics-shell px-4"
        aria-label="歌词同步显示"
        style={{
          ["--erhai-lyrics-height" as string]: `${CONTAINER_HEIGHT}px`,
          ["--erhai-lyrics-line-height" as string]: `${LINE_HEIGHT}px`,
          ["--erhai-lyrics-center-offset" as string]: `${CENTER_OFFSET}px`,
        }}
      >
      <div
        className="erhai-lyrics-sync"
        style={{
          transform: isMobile ? undefined : `translateY(${translateY}px)`,
        }}
      >
        {lines.map((line, index) => {
          const distance = Math.abs(index - (activeIndex + lineProgress));
          const opacity = Math.max(0.18, 1 - distance * 0.32);
          const scale = Math.max(0.92, 1 - distance * 0.04);
          const active = index === activeIndex;
          return (
            <div
              key={line.key}
              className="flex items-center justify-center text-center"
              style={{ minHeight: "var(--erhai-lyrics-line-height)" }}
            >
              <span
                className={`leading-[1.4] transition-[color,opacity,transform,text-shadow,font-weight] duration-200 ${
                  active ? "font-semibold text-white" : "font-normal text-white/70"
                }`}
                style={{
                  fontSize: 17,
                  opacity,
                  transform: `scale(${scale})`,
                  textShadow: active ? "0 1px 8px rgba(0,0,0,0.14)" : "none",
                }}
              >
                {line.text}
              </span>
            </div>
          );
        })}
      </div>

      {!isReady ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[13px] text-white/70">
          加载歌词中...
        </div>
      ) : null}
    </div>
    </div>
  );
}
