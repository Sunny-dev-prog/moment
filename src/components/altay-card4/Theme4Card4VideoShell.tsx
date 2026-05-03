import { useEffect, useMemo, useRef, useState } from "react";
import { getPublicAssetUrl } from "@/lib/publicAsset";
import { ALTAI_MAP_NODES, type AltayMapNode } from "./altayRouteData";
import { generateAltayRouteInfo, type AltayRouteInfoResponse } from "@/lib/deepseekApi";
import "./theme4-card4-video.css";

const CONTINUOUS_CORNER_RADIUS = 30.5;
const CONTINUOUS_CORNER_SMOOTHING = 0.528;
const FALLBACK_VIEWPORT = { width: 320, height: 420 };

function formatCoord(value: number) {
  return Number(value.toFixed(3));
}

function getContinuousCornerPath(width: number, height: number, radius: number, smoothing: number) {
  const safeWidth = Math.max(width, radius * 2);
  const safeHeight = Math.max(height, radius * 2);
  const safeRadius = Math.min(radius, safeWidth / 2, safeHeight / 2);
  const handle = safeRadius * smoothing;
  const right = formatCoord(safeWidth);
  const bottom = formatCoord(safeHeight);
  const radiusValue = formatCoord(safeRadius);
  const handleValue = formatCoord(handle);
  const rightStart = formatCoord(safeWidth - safeRadius);
  const bottomStart = formatCoord(safeHeight - safeRadius);
  const rightHandle = formatCoord(safeWidth - safeRadius + handle);
  const bottomHandle = formatCoord(safeHeight - safeRadius + handle);
  const leftHandle = formatCoord(safeRadius - handle);
  const topHandle = formatCoord(safeRadius - handle);

  return [
    `M ${radiusValue} 0`,
    `H ${rightStart}`,
    `C ${rightHandle} 0 ${right} ${topHandle} ${right} ${radiusValue}`,
    `V ${bottomStart}`,
    `C ${right} ${bottomHandle} ${rightHandle} ${bottom} ${rightStart} ${bottom}`,
    `H ${radiusValue}`,
    `C ${leftHandle} ${bottom} 0 ${bottomHandle} 0 ${bottomStart}`,
    `V ${radiusValue}`,
    `C 0 ${topHandle} ${leftHandle} 0 ${radiusValue} 0`,
    "Z",
  ].join(" ");
}

/** 生成 CSS clip-path: path() 所需的像素路径 */
function getContinuousCornerClipPath(width: number, height: number, radius: number, smoothing: number) {
  const path = getContinuousCornerPath(width, height, radius, smoothing);
  return `path('${path}')`;
}

const ICON_MAP: Record<string, string> = {
  airport: "✈",
  city: "🏙",
  village: "🏘",
  mountain: "⛰",
  lake: "🌊",
  forest: "🌲",
  oilfield: "🛢",
  meadow: "🌿",
};

function AltayMapOverlay({
  viewport,
  onNodeClick,
  activeNodeId,
}: {
  viewport: { width: number; height: number };
  onNodeClick: (node: AltayMapNode) => void;
  activeNodeId: string | null;
}) {
  const px = (pct: number, dim: number) => (pct / 100) * dim;

  return (
    <g>
      {ALTAI_MAP_NODES.map((node) => {
        const isAirport = node.id === "altay-airport" || node.id === "yining-airport";
        const isActive = activeNodeId === node.id;
        const cx = px(node.labelX, viewport.width);
        const cy = px(node.labelY, viewport.height);
        const dotX = px(node.x, viewport.width);
        const dotY = px(node.y, viewport.height);
        const handleClick = isAirport ? undefined : () => onNodeClick(node);
        const cursorStyle = isAirport ? "default" : "pointer";

        return (
          <g key={node.id}>
            <line
              x1={dotX}
              y1={dotY}
              x2={cx}
              y2={cy}
              stroke={isActive ? "#FE2C55" : "rgba(255,215,0,0.7)"}
              strokeWidth={isActive ? 2 : 1.5}
              strokeDasharray="3 2"
            />

            {isActive && (
              <circle
                cx={dotX}
                cy={dotY}
                r={44}
                fill="none"
                stroke="#FE2C55"
                strokeWidth={2.5}
                opacity={0.5}
              >
                <animate attributeName="r" values="28;56;28" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}

            {/* 发光光晕 - 非激活状态也有 */}
            {!isActive && (
              <circle
                cx={dotX}
                cy={dotY}
                r={14}
                fill="rgba(255,215,0,0.25)"
              >
                <animate attributeName="r" values="10;18;10" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}

            <circle
              cx={dotX}
              cy={dotY}
              r={isActive ? 9 : 5.5}
              fill={isActive ? "#FE2C55" : "#FFD700"}
              stroke={isActive ? "#fff" : "rgba(255,255,255,0.8)"}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ cursor: cursorStyle }}
              onClick={handleClick}
            />

            <circle
              cx={dotX}
              cy={dotY}
              r={56}
              fill="transparent"
              style={{ cursor: cursorStyle }}
              onClick={handleClick}
            />

            {isActive && (
              <rect
                x={dotX - 72}
                y={dotY - 72}
                width={144}
                height={144}
                rx={10}
                fill="none"
                stroke="#FE2C55"
                strokeWidth={2.5}
                strokeDasharray="5 3"
                opacity={0.8}
              >
                <animate attributeName="stroke-dashoffset" values="0;16" dur="1.5s" repeatCount="indefinite" />
              </rect>
            )}

            {/* 标签外层发光 - 非激活景点才有 */}
            {!isActive && !isAirport && (
              <rect
                x={cx - 44}
                y={cy - 16}
                width={88}
                height={30}
                rx={15}
                fill="rgba(255,215,0,0.15)"
                stroke="none"
              >
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
              </rect>
            )}

            <g style={{ cursor: cursorStyle }} onClick={handleClick}>
              {/* 整体浮动动画 - 非激活景点 */}
              {!isActive && !isAirport && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;0,-3;0,0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              )}
              <rect
                x={cx - (isAirport ? 52 : 40)}
                y={cy - 12}
                width={isAirport ? 104 : 80}
                height={22}
                rx={11}
                fill={isActive ? "#FE2C55" : isAirport ? "rgba(0,0,0,0.55)" : "rgba(255,215,0,0.9)"}
                stroke={isActive ? "rgba(255,255,255,0.7)" : isAirport ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.5)"}
                strokeWidth={isActive ? 1.2 : 1}
              >
                {!isActive && !isAirport && (
                  <animate attributeName="opacity" values="1;0.85;1" dur="2.5s" repeatCount="indefinite" />
                )}
              </rect>

              <rect
                x={cx - (isAirport ? 72 : 60)}
                y={cy - 28}
                width={isAirport ? 144 : 120}
                height={48}
                rx={20}
                fill="transparent"
              />

              <text
                x={cx - (isAirport ? 42 : 32)}
                y={cy + 4}
                fontSize={11}
                style={{ pointerEvents: "none" }}
              >
                {ICON_MAP[node.icon] || "📍"}
              </text>

              <text
                x={cx - (isAirport ? 26 : 16)}
                y={cy + 4.5}
                fontSize={isAirport ? 10 : 9.5}
                fontWeight={isActive ? 700 : 700}
                fill={isActive ? "white" : isAirport ? "white" : "#1a1a1a"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {node.name}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/* ───── 全屏悬浮框 ───── */
function AltayFullscreenOverlay({
  node,
  loading,
  routeInfo,
  onClose,
}: {
  node: AltayMapNode;
  loading: boolean;
  routeInfo: AltayRouteInfoResponse | null;
  onClose: () => void;
}) {
  return (
    <div
      className="absolute inset-x-0 top-[18%] bottom-[18%] z-50 mx-3 flex flex-col overflow-hidden rounded-[24px] border border-white/15 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.75)]"
      style={{
        background: "linear-gradient(180deg, #879b84, #566a59, #233129)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        animation: "altay-overlay-in 0.35s ease-out",
      }}
    >
      {/* 顶部区域 - 固定不滚动 */}
      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/12 text-[20px]">
              {ICON_MAP[node.icon] || "📍"}
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-[0.2em] text-white/55">
                ALTAY ROUTE
              </div>
              <div className="mt-0.5 text-[20px] font-bold leading-tight text-white">
                {node.name}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/70 text-[14px] ring-1 ring-white/10 hover:bg-white/15 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="mt-2 text-[12px] leading-snug text-white/65">
          📍 海拔 {node.elevationM}m · {node.lat.toFixed(2)}°N {node.lng.toFixed(2)}°E · {node.summary}
        </div>
      </div>

      {/* 内容区 - 可滚动 */}
      <div className="altay-scroll-area min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {loading ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/90 px-3 py-1 text-[11px] font-semibold text-slate-900">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                正在生成路线信息
              </div>
              <div className="space-y-2">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="space-y-1.5">
                    <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-[90%] animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-[76%] animate-pulse rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ) : routeInfo ? (
            <div className="space-y-5">
              {/* 核心数据标签 */}
              <div className="flex flex-wrap gap-2">
                <RouteTag icon="🛣️" text={routeInfo.distanceFromAirport} />
                <RouteTag icon="⏱️" text={routeInfo.driveTimeFromAirport} />
                <RouteTag icon="🌤️" text={routeInfo.bestSeason} />
              </div>

              {/* 沿途路况 */}
              <RouteSection
                label="沿途路况"
                icon="🛣️"
                items={routeInfo.roadConditions}
                accentColor="#38bdf8"
              />

              {/* 景点特色 */}
              <RouteSection
                label="景点特色"
                icon="✨"
                items={routeInfo.scenicFeatures}
                accentColor="#f472b6"
              />

              {/* 旅行建议 */}
              <RouteSection
                label="旅行建议"
                icon="🎒"
                items={routeInfo.travelTips}
                accentColor="#4ade80"
              />

              {/* AI 标识 */}
              {routeInfo.fromFallback ? (
                <div className="rounded-xl border border-white/15 bg-white/8 px-3 py-2 text-[11px] text-white/70">
                  当前使用本地备选数据
                </div>
              ) : (
                <div className="text-center text-[10px] text-white/35 pt-1">
                  Powered by AI · 信息仅供参考
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <p className="text-[13px] text-white/60">暂无路线信息</p>
            </div>
          )}
        </div>
    </div>
  );
}

function RouteTag({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[12px] font-medium text-white">
      <span>{icon}</span>
      {text}
    </span>
  );
}

function RouteSection({
  label,
  icon,
  items,
  accentColor,
}: {
  label: string;
  icon: string;
  items: string[];
  accentColor: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <span className="text-[14px]">{icon}</span>
        <span className="text-[14px] font-bold text-white">{label}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span
              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-[13px] leading-6 text-white/70">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───── 主组件 ───── */
export function Theme4Card4VideoShell() {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState(FALLBACK_VIEWPORT);
  const [activeNode, setActiveNode] = useState<AltayMapNode | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<AltayRouteInfoResponse | null>(null);

  useEffect(() => {
    const node = surfaceRef.current;
    if (!node) return;

    const updateViewport = () => {
      const nextWidth = Math.max(1, node.clientWidth || FALLBACK_VIEWPORT.width);
      const nextHeight = Math.max(1, node.clientHeight || FALLBACK_VIEWPORT.height);
      setViewport((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    };

    updateViewport();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      updateViewport();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const continuousClipPath = useMemo(
    () => getContinuousCornerClipPath(viewport.width, viewport.height, CONTINUOUS_CORNER_RADIUS, CONTINUOUS_CORNER_SMOOTHING),
    [viewport.height, viewport.width],
  );

  const continuousPath = useMemo(
    () => getContinuousCornerPath(viewport.width, viewport.height, CONTINUOUS_CORNER_RADIUS, CONTINUOUS_CORNER_SMOOTHING),
    [viewport.height, viewport.width],
  );

  const handleNodeClick = async (node: AltayMapNode) => {
    // 切换选中状态
    if (activeNode?.id === node.id) {
      setActiveNode(null);
      setShowFullscreen(false);
      return;
    }
    setActiveNode(node);
    setShowFullscreen(true);
    setLoading(true);
    setRouteInfo(null);

    try {
      const info = await generateAltayRouteInfo(
        node.name,
        node.icon,
        node.elevationM,
        node.lat,
        node.lng,
        node.summary,
      );
      setRouteInfo(info);
    } catch (err) {
      console.error("获取路线信息失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
    setActiveNode(null);
    setRouteInfo(null);
  };

  return (
    <div className={`theme4-card4-video flex h-full min-h-0 w-full flex-1 flex-col relative ${showFullscreen ? "has-overlay" : ""}`} data-testid="theme4-card4-video">
      <div
        ref={surfaceRef}
        className="theme4-card4-video-surface flex h-full w-full min-h-0 overflow-hidden"
        data-continuous-radius={CONTINUOUS_CORNER_RADIUS.toFixed(1)}
        data-continuous-smoothing={CONTINUOUS_CORNER_SMOOTHING.toFixed(3)}
        style={{
          transition: "filter 0.3s ease",
          filter: showFullscreen ? "blur(8px) brightness(0.6)" : "none",
          clipPath: continuousClipPath,
          WebkitClipPath: continuousClipPath,
        }}
      >
        {/* 背景图片 */}
        <img
          src={getPublicAssetUrl("/zt4/1.jpg")}
          alt=""
          className="theme4-card4-fill-image absolute inset-0 h-full w-full object-cover"
          data-testid="altay-card4-fill-image"
        />

        {/* 地图叠加层：地点标签 */}
        <svg
          className="theme4-card4-overlay-svg absolute inset-0 h-full w-full"
          viewBox={`0 0 ${viewport.width} ${viewport.height}`}
          aria-hidden="true"
        >
          <AltayMapOverlay
            viewport={viewport}
            onNodeClick={handleNodeClick}
            activeNodeId={activeNode?.id ?? null}
          />
        </svg>

        {/* 边框描边 - 用 SVG 叠加 */}
        <svg
          className="theme4-card4-stroke-svg absolute inset-0 h-full w-full pointer-events-none"
          viewBox={`0 0 ${viewport.width} ${viewport.height}`}
          aria-hidden="true"
        >
          <path d={continuousPath} className="theme4-card4-surface-stroke" />
        </svg>
      </div>

      {/* 全屏悬浮框 */}
      {showFullscreen && activeNode && (
        <AltayFullscreenOverlay
          node={activeNode}
          loading={loading}
          routeInfo={routeInfo}
          onClose={handleCloseFullscreen}
        />
      )}
    </div>
  );
}
