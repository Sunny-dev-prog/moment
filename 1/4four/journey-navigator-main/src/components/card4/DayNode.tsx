import { VIEWBOX, type NodeCoord } from "@/lib/route-coords";
import { DayInfo } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  node: NodeCoord;
  info: DayInfo | null;
  loading: boolean;
  active: boolean;
  dimmed: boolean;
  onClick: () => void;
}

const DIFF_LABEL: Record<string, { dot: string; text: string; chinese: string }> = {
  low:  { dot: "bg-[hsl(var(--diff-low))]",  text: "text-[hsl(var(--diff-low))]",  chinese: "低难" },
  mid:  { dot: "bg-[hsl(var(--diff-mid))]",  text: "text-[hsl(var(--diff-mid))]",  chinese: "中难" },
  high: { dot: "bg-[hsl(var(--diff-high))]", text: "text-[hsl(var(--diff-high))]", chinese: "高难" },
};

export const DayNode = ({ node, info, loading, active, dimmed, onClick }: Props) => {
  // 节点位置百分比
  const left = `${(node.x / VIEWBOX.w) * 100}%`;
  const top = `${(node.y / VIEWBOX.h) * 100}%`;

  // 详情卡的弹出方向：左半屏 → 向右弹；右半屏 → 向左弹
  const popRight = node.x < 50;

  const diff = info ? DIFF_LABEL[info.difficulty] : DIFF_LABEL.mid;

  return (
    <div
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
        dimmed && "opacity-35",
        active && "z-20",
      )}
      style={{ left, top }}
    >
      {/* 圆点 + D编号 */}
      <button
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center rounded-full text-white font-mono-num font-bold transition-all",
          "border border-white/40 backdrop-blur",
          active
            ? "w-10 h-10 text-[11px] bg-[hsl(var(--road-glow))]/30 ring-2 ring-[hsl(var(--road-glow))]/70 node-pulse"
            : "w-7 h-7 text-[9px] bg-white/15 hover:bg-white/25",
        )}
        style={{
          boxShadow: active
            ? `0 0 16px hsl(var(--road-glow) / 0.7)`
            : `0 0 6px hsl(var(--road-stroke) / 0.5)`,
        }}
      >
        {node.id}
      </button>

      {/* 节点旁短名（默认态） */}
      {!active && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none",
            popRight ? "left-full ml-1.5" : "right-full mr-1.5",
          )}
        >
          <div className="text-[10px] text-white/85 font-medium leading-tight">
            {node.shortName}
          </div>
          {info && (
            <div className="text-[9px] text-white/55 font-mono-num leading-tight">
              {info.km}km
            </div>
          )}
          {loading && !info && (
            <div className="h-2 w-8 mt-0.5 rounded shimmer" />
          )}
        </div>
      )}

      {/* 详情卡（展开态） */}
      {active && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-[150px] glass-strong rounded-xl p-2.5 pointer-events-none",
            popRight ? "left-full ml-3" : "right-full mr-3",
          )}
          style={{ boxShadow: "0 8px 24px hsl(var(--card-bg-to) / 0.4)" }}
        >
          <div className="text-[11px] font-semibold text-white leading-tight mb-1">
            {node.id} · {info ? `${info.from} → ${info.to}` : node.label}
          </div>
          {info ? (
            <>
              <div className="flex items-center gap-2 text-[10px] text-white/85 font-mono-num mb-1">
                <span>📏 {info.km}km</span>
                <span>⏱ {info.hours}h</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", diff.dot)} />
                <span className={cn("text-[10px] font-medium", diff.text)}>
                  {info.roadType} · {diff.chinese}
                </span>
              </div>
              <div className="text-[10px] text-white/70 leading-snug border-t border-white/15 pt-1.5">
                ✦ {info.highlight}
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded shimmer" />
              <div className="h-2 w-3/4 rounded shimmer" />
              <div className="h-2 w-2/3 rounded shimmer" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
