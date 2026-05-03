import { useEffect, useMemo, useRef, useState } from "react";
import { getPublicAssetUrl } from "@/lib/publicAsset";

type VideoItem = {
  id: string;
  label: string;
  src: string;
};

type ChangbaiCard4VideoRowProps = {
  items?: [VideoItem, VideoItem, VideoItem];
  softTextColor: string;
  activeId: string;
  onVideoEnd: (id: string) => void;
};

const DEFAULT_ITEMS: [VideoItem, VideoItem, VideoItem] = [
  { id: "ke", label: "克", src: getPublicAssetUrl("/card4/changbai-videos/001.mp4") },
  { id: "dan", label: "单", src: getPublicAssetUrl("/card4/changbai-videos/002.mp4") },
  { id: "li", label: "离", src: getPublicAssetUrl("/card4/changbai-videos/003.mp4") },
];

export function ChangbaiCard4VideoRow({
  items = DEFAULT_ITEMS,
  softTextColor,
  activeId,
  onVideoEnd,
}: ChangbaiCard4VideoRowProps) {
  return (
    <div className="relative h-full min-h-0 overflow-hidden rounded-[22px]">
      {items.map((item) => (
        <VideoTile
          key={item.id}
          item={item}
          softTextColor={softTextColor}
          isActive={activeId === item.id}
          onVideoEnd={onVideoEnd}
        />
      ))}
    </div>
  );
}

function VideoTile({
  item,
  softTextColor,
  isActive,
  onVideoEnd,
}: {
  item: VideoItem;
  softTextColor: string;
  isActive: boolean;
  onVideoEnd: (id: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const ariaLabel = useMemo(() => `${item.label}视频播放器`, [item.label]);

  function safePlay(video: HTMLVideoElement) {
    try {
      const result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => undefined);
      }
    } catch {
      // Keep inline fallback UI when autoplay is unavailable.
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      if (video.currentTime >= video.duration && Number.isFinite(video.duration)) {
        video.currentTime = 0;
      }
      safePlay(video);
      return;
    }

    try {
      video.pause();
    } catch {
      // Ignore browsers/environments that block media APIs.
    }
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setLoaded(true);
      setFailed(false);
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("canplay", handleLoaded);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("canplay", handleLoaded);
    };
  }, []);

  async function handleOpenFullscreen() {
    const container = videoRef.current;
    if (!container) return;

    try {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen failures and keep inline playback.
    }
  }

  return (
    <div
      className={`absolute inset-0 flex min-w-0 flex-col gap-2 transition-all duration-500 ease-out ${
        isActive ? "pointer-events-auto opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-3"
      }`}
      aria-hidden={isActive ? undefined : true}
    >
      <div className="relative z-30 flex min-h-7 items-center px-3">
        <p
          className="overflow-wrap-break-word px-1 text-[clamp(12px,2.4vw,14px)] font-medium leading-none tracking-[0.01em]"
          style={{
            color: "#666666",
            textShadow: "0 1px 6px rgba(255,255,255,0.72)",
          }}
        >
          这是专业运动员，请勿直接尝试
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/35 bg-white/22 shadow-[0_18px_40px_-28px_rgba(85,112,131,0.55)]">
          {!failed ? (
            <>
              <div
                className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${
                  loaded ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(226,238,245,0.72) 100%)",
                }}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-white/90 shadow-[0_8px_18px_-10px_rgba(85,112,131,0.55)]" />
                  <span className="text-[10px] font-medium" style={{ color: softTextColor }}>
                    加载中
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenFullscreen}
                className="absolute inset-0 z-20"
                aria-label={`${ariaLabel}，点击全屏`}
              />

              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={item.src}
                preload="metadata"
                muted
                playsInline
                autoPlay={isActive}
                disablePictureInPicture
                controls={false}
                onLoadedData={() => setLoaded(true)}
                onError={() => setFailed(true)}
                onEnded={() => onVideoEnd(item.id)}
              />
            </>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center px-3 text-center text-[10px] font-medium"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(215,229,238,0.74) 100%)",
                color: softTextColor,
              }}
            >
              视频暂不可用
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
