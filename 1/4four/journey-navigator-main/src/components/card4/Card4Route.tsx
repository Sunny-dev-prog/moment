import { useEffect, useState } from "react";
import { RefreshCw, Car, Mountain, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GeoMap } from "./GeoMap";
import { DayInfo, RoutePlan } from "./types";

const CACHE_KEY = "card4_route_v1";
const CACHE_TTL = 24 * 60 * 60 * 1000;

export const Card4Route = () => {
  const [data, setData] = useState<Record<string, DayInfo> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const load = async (force = false) => {
    setLoading(true);
    try {
      if (!force) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as { ts: number; plan: RoutePlan };
          if (Date.now() - parsed.ts < CACHE_TTL) {
            const map: Record<string, DayInfo> = {};
            parsed.plan.days.forEach((d) => (map[d.id] = d));
            setData(map);
            setLoading(false);
            return;
          }
        }
      }

      const { data: resp, error } = await supabase.functions.invoke("generate-route");
      if (error) throw error;
      if (resp?.error) throw new Error(resp.error);

      const plan = resp as RoutePlan;
      if (!plan?.days?.length) throw new Error("AI 未返回有效路线");

      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), plan }));
      const map: Record<string, DayInfo> = {};
      plan.days.forEach((d) => (map[d.id] = d));
      setData(map);
    } catch (e: any) {
      console.error("load route error:", e);
      const msg = e?.message?.includes("429")
        ? "请求过于频繁，请稍后再试"
        : e?.message?.includes("402")
        ? "AI 额度已用完"
        : "路线规划失败，请重试";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* 标题区 */}
      <div className="relative px-4 pt-2 pb-1 shrink-0 z-20">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-bold text-white text-glow leading-tight">
              北疆自驾环线
            </h1>
            <div className="text-[12px] text-white/70 mt-0.5">
              每天开多少路 · 路况难度全解析
            </div>
            <div className="text-[10px] text-white/50 mt-0.5 font-mono-num">
              阿勒泰进 · 伊宁出 ｜ 12 Days
            </div>
          </div>
          <button
            onClick={() => load(true)}
            disabled={loading}
            className="shrink-0 mt-1 w-9 h-9 glass-strong rounded-full flex items-center justify-center text-white/90 disabled:opacity-50"
            aria-label="重新规划"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 地图主区域（铺满剩余空间） */}
      <div className="relative flex-1 min-h-0 px-2">
        <GeoMap
          data={data}
          loading={loading}
          activeId={activeId}
          onSelect={setActiveId}
        />

        {/* 中段提示气泡（仅未选中时显示） */}
        {!activeId && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[58%] z-10 glass px-2.5 py-1 rounded-full pointer-events-none">
            <span className="text-[10px] text-white/85">
              👉 点节点查看当天路况
            </span>
          </div>
        )}
      </div>

      {/* 底部三按钮 */}
      <div className="shrink-0 px-3 pb-2 pt-2 z-20">
        <div className="flex items-center gap-2">
          <FilterBtn icon={<Car className="w-3.5 h-3.5" />} label="轻松路线" />
          <FilterBtn icon={<Mountain className="w-3.5 h-3.5" />} label="风景路线" />
          <FilterBtn icon={<Zap className="w-3.5 h-3.5" />} label="高效路线" />
        </div>
      </div>
    </div>
  );
};

const FilterBtn = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex-1 glass-strong rounded-full px-2 py-1.5 flex items-center justify-center gap-1 text-white/90 text-[11px] font-medium hover:bg-white/20 transition">
    {icon}
    {label}
  </button>
);
