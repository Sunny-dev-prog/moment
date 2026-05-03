import { useEffect, useMemo, useRef, useState } from "react";
import { getPublicAssetUrl } from "@/lib/publicAsset";
import "./changbai-card4-tuangou.css";

type CarouselItem = {
  id: string;
  src: string;
  alt: string;
};

type ChangbaiTuanGouCarouselProps = {
  items?: CarouselItem[];
  softTextColor: string;
  intervalMs?: number;
};

const DEFAULT_ITEMS: CarouselItem[] = [
  { id: "1", src: getPublicAssetUrl("/card4/changbai-tuangou/1.jpg"), alt: "抖音团购推荐图1" },
  { id: "2", src: getPublicAssetUrl("/card4/changbai-tuangou/2.jpg"), alt: "抖音团购推荐图2" },
  { id: "3", src: getPublicAssetUrl("/card4/changbai-tuangou/3.jpg"), alt: "抖音团购推荐图3" },
  { id: "4", src: getPublicAssetUrl("/card4/changbai-tuangou/4.jpg"), alt: "抖音团购推荐图4" },
];

export function ChangbaiTuanGouCarousel({
  items = DEFAULT_ITEMS,
  softTextColor,
  intervalMs = 2000,
}: ChangbaiTuanGouCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const availableItems = useMemo(
    () => items.filter((item) => !failedIds[item.id]),
    [failedIds, items],
  );

  useEffect(() => {
    if (availableItems.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % availableItems.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [availableItems.length, intervalMs]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const slide = container.children[activeIndex] as HTMLElement | undefined;
    if (!slide) return;
    if (typeof container.scrollTo === "function") {
      container.scrollTo({
        left: slide.offsetLeft,
        behavior: "smooth",
      });
      return;
    }
    container.scrollLeft = slide.offsetLeft;
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex < availableItems.length) return;
    setActiveIndex(0);
  }, [activeIndex, availableItems.length]);

  if (availableItems.length === 0) {
    return (
      <div
        className="changbai-tuangou-carousel flex h-full w-full items-center justify-center bg-white px-4 text-center text-[13px] font-medium"
        style={{ color: softTextColor }}
      >
        图片加载失败
      </div>
    );
  }

  return (
    <div className="changbai-tuangou-carousel relative h-full w-full overflow-hidden bg-white">
      <div
        ref={containerRef}
        className="hide-scrollbar flex h-full snap-x snap-mandatory gap-[10px] overflow-x-auto scroll-smooth"
      >
        {availableItems.map((item) => (
          <div
            key={item.id}
            className="relative h-full min-w-full snap-start overflow-hidden bg-white px-[10px]"
          >
            <div className="changbai-tuangou-media-shell relative h-full w-full bg-white">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="changbai-tuangou-media-image h-full w-full object-contain"
                onError={() => {
                  setFailedIds((current) => ({ ...current, [item.id]: true }));
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
