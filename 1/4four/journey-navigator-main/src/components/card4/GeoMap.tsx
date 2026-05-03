import { NODES, REGIONS, ROUTE_PATH, VIEWBOX, type NodeCoord } from "@/lib/route-coords";
import { DayInfo } from "./types";
import { DayNode } from "./DayNode";

interface Props {
  data: Record<string, DayInfo> | null;
  loading: boolean;
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * SVG 真实方位地图：等高线 + 区域 chip + 路线 + 12 节点
 * 节点用绝对定位 div 覆盖在 SVG 上方，便于交互和文字渲染
 */
export const GeoMap = ({ data, loading, activeId, onSelect }: Props) => {
  return (
    <div className="relative w-full h-full">
      {/* 底层 SVG: 等高线 + 路径 */}
      <svg
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <filter id="road-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="road-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--road-glow))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--road-stroke))" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* 三块地形分区轮廓（极淡） */}
        {REGIONS.map((r) => (
          <path
            key={r.key}
            d={r.contour}
            fill="hsl(var(--terrain-line) / 0.025)"
            stroke="hsl(var(--terrain-line) / 0.1)"
            strokeWidth="0.18"
            strokeDasharray="0.8 0.6"
          />
        ))}

        {/* 等高线装饰：随机几条波浪线暗示山脉/河谷 */}
        <g stroke="hsl(var(--terrain-line) / 0.07)" strokeWidth="0.15" fill="none">
          <path d="M 8 14 Q 30 10 55 16 T 95 18" />
          <path d="M 10 22 Q 32 18 58 23 T 96 26" />
          <path d="M 6 70 Q 30 66 55 71 T 95 70" />
          <path d="M 8 78 Q 30 74 55 79 T 95 78" />
          <path d="M 8 110 Q 30 106 55 111 T 95 110" />
          <path d="M 8 118 Q 30 114 55 119 T 95 118" />
        </g>

        {/* 主路径（青绿发光，虚线流动） */}
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="url(#road-grad)"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#road-glow)"
          opacity="0.55"
        />
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="hsl(var(--road-stroke))"
          strokeWidth="0.45"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="road-flow"
          opacity="0.95"
        />

        {/* 区域 chip 标签 */}
        {REGIONS.map((r) => (
          <g key={`chip-${r.key}`} transform={`translate(${r.chipX} ${r.chipY})`}>
            <text
              x="0"
              y="0"
              fill="hsl(var(--terrain-line) / 0.45)"
              fontSize="2.2"
              fontWeight="600"
              letterSpacing="0.3"
            >
              {r.name}
            </text>
            <text
              x="0"
              y="2.6"
              fill="hsl(var(--terrain-line) / 0.28)"
              fontSize="1.5"
              letterSpacing="0.2"
            >
              {r.sub}
            </text>
          </g>
        ))}
      </svg>

      {/* 上层节点（HTML，便于交互） */}
      <div className="absolute inset-0">
        {NODES.map((node) => (
          <DayNode
            key={node.id}
            node={node}
            info={data?.[node.id] ?? null}
            loading={loading}
            active={activeId === node.id}
            dimmed={activeId !== null && activeId !== node.id}
            onClick={() => onSelect(activeId === node.id ? null : node.id)}
          />
        ))}
      </div>

      {/* 指北针 */}
      <div className="absolute top-2 right-2 flex flex-col items-center text-white/55">
        <div className="text-[10px] font-semibold leading-none">N</div>
        <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-white/55 mt-0.5" />
      </div>
    </div>
  );
};

export type { NodeCoord };
