import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Wind, Flower2, Snowflake, Moon } from "lucide-react";
import { ErhaiMusicPlayer } from "./ErhaiMusicPlayer";
import { TieDyePattern, CangshanRidge, BaiBorder } from "./BaiPattern";
import riderImg from "@/assets/cycling-rider.jpg";
import coastImg from "@/assets/cycling-coast.jpg";

const tabs = ["团购", "经验", "大理", "关注", "商城", "推荐"];

/** 风花雪月 — Dali's four legendary scenes */
const fengHuaXueYue = [
  { Icon: Wind, label: "下关风", note: "顺风一程" },
  { Icon: Flower2, label: "上关花", note: "花期正好" },
  { Icon: Snowflake, label: "苍山雪", note: "西望十九峰" },
  { Icon: Moon, label: "洱海月", note: "夜骑回大理" },
];

/** 三道茶 inspired ride stages — 一苦二甘三回味 */
const stages = [
  { ch: "苦", title: "出发 · 才村码头", desc: "晨雾未散，前 30km 顶着下关风" },
  { ch: "甘", title: "抵达 · 双廊", desc: "海舌落日，咖啡与风同时到位" },
  { ch: "回味", title: "归来 · 海舌公园", desc: "128km 闭环，今夜枕着洱海月" },
];

export function CycleCard() {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden"
      style={{ background: "var(--gradient-erhai)" }}
    >
      {/* Background tie-dye wash */}
      <TieDyePattern id="tiedye-bg" opacity={0.06} />
      <div className="pointer-events-none absolute inset-0 text-erhai-indigo-deep" aria-hidden>
        <svg className="w-full h-full"><rect width="100%" height="100%" fill="url(#tiedye-bg)" /></svg>
      </div>

      {/* Hero photo wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${coastImg})`, filter: "blur(10px)" }}
        aria-hidden
      />

      {/* 苍山 ridge silhouette behind everything */}
      <div className="pointer-events-none absolute inset-x-0 top-[18%] h-24 text-erhai-indigo-deep/40" aria-hidden>
        <CangshanRidge className="w-full h-full" />
      </div>

      <div className="relative w-full max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/25">
        {/* 白族 山墙 border top */}
        <div className="h-1.5 bg-erhai-indigo/70 text-erhai-orange/90">
          <BaiBorder className="w-full h-full" />
        </div>

        {/* Top nav */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-3 text-white">
          <button className="flex items-center gap-1 rounded-full bg-erhai-orange/90 text-white text-sm font-medium pl-2 pr-3 py-1.5 shadow">
            <ArrowLeft className="size-4" /> 返回
          </button>
          <div className="flex items-center gap-3 text-[13px] font-medium">
            {tabs.map((t) => (
              <span key={t} className={t === "推荐" ? "text-white font-bold" : "text-white/70"}>
                {t}
              </span>
            ))}
          </div>
          <span className="rounded-full bg-erhai-orange/90 text-white text-xs font-semibold px-2.5 py-1 shadow">3/4</span>
        </div>

        {/* Title — Bai-flavored copy */}
        <div className="px-5 pt-1 pb-4 text-white">
          <div className="text-[10px] tracking-[0.45em] text-white/70 mb-1.5">DALI · 白 族 · ZHĀ RǍN</div>
          <h1 className="text-[28px] leading-tight font-extrabold tracking-tight drop-shadow-sm">
            把<span className="text-erhai-orange">苍山十九峰</span>
          </h1>
          <h1 className="text-[28px] leading-tight font-extrabold tracking-tight drop-shadow-sm">
            写进<span className="text-white">128 公里的</span>
          </h1>
          <h1 className="text-[28px] leading-tight font-extrabold tracking-tight drop-shadow-sm">
            <span className="relative inline-block">
              <span className="relative z-10">环洱海</span>
              <span className="absolute inset-x-0 bottom-1 h-2.5 bg-erhai-orange/60 -z-0" />
            </span>
            车辙里
          </h1>
        </div>

        {/* 风花雪月 strip */}
        <div className="mx-4 rounded-2xl bg-erhai-indigo/35 backdrop-blur-md border border-white/20 px-3 py-3 text-white">
          <div className="grid grid-cols-4 gap-2">
            {fengHuaXueYue.map(({ Icon, label, note }) => (
              <div key={label} className="text-center">
                <Icon className="size-4 mx-auto text-white/90" strokeWidth={1.5} />
                <div className="text-[12px] font-bold mt-1 tracking-wide">{label}</div>
                <div className="text-[9.5px] text-white/65 mt-0.5">{note}</div>
              </div>
            ))}
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/15 grid grid-cols-3 text-center text-white/95">
            <div><div className="text-[10px] text-white/65">距离</div><div className="text-[14px] font-bold">128km</div></div>
            <div><div className="text-[10px] text-white/65">爬升</div><div className="text-[14px] font-bold">1974m</div></div>
            <div><div className="text-[10px] text-white/65">用时</div><div className="text-[14px] font-bold">9h30m</div></div>
          </div>
        </div>

        {/* 洱海音乐播放器 — 圈即洱海 */}
        <div className="mt-4 mx-4">
          <ErhaiMusicPlayer />
        </div>

        {/* 三道茶 stages — uniquely Bai */}
        <div className="mt-4 mx-4">
          <div className="text-[10px] tracking-[0.35em] text-white/80 font-semibold mb-2 px-1">
            三 道 茶 · 一 苦 二 甘 三 回 味
          </div>
          <div className="space-y-1.5">
            {stages.map((s, i) => (
              <div
                key={s.ch}
                className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur border border-white/15 px-3 py-2"
              >
                <div className="shrink-0 size-9 rounded-full bg-erhai-indigo/70 border border-white/30 flex items-center justify-center text-white font-bold text-base">
                  {s.ch}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-white">{s.title}</div>
                  <div className="text-[11px] text-white/75 truncate">{s.desc}</div>
                </div>
                <div className="text-[10px] text-white/50 font-mono">0{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Polaroids */}
        <div className="mt-4 px-4 flex justify-center items-center gap-2 h-44">
          <div className="relative bg-white p-2 pb-6 rounded-sm shadow-xl -rotate-[5deg] w-32">
            <img src={riderImg} alt="举车骑行者" className="w-full h-32 object-cover" />
            <div className="absolute bottom-1 left-2 text-[10px] text-neutral-700 font-medium">@骑行老炮</div>
          </div>
          <div className="relative bg-white p-2 pb-6 rounded-sm shadow-xl rotate-[6deg] w-32 -ml-3">
            <img src={coastImg} alt="海边骑行" className="w-full h-32 object-cover" />
            <div className="absolute -top-2 -left-2 size-6 rounded-full bg-white shadow flex items-center justify-center">
              <Heart className="size-3.5 fill-erhai-orange text-erhai-orange" />
            </div>
            <div className="absolute bottom-1 left-2 text-[10px] text-neutral-700 font-medium">@洱海慢骑</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 mt-3 flex items-center gap-3">
          <button className="flex-1 rounded-full bg-white/15 backdrop-blur border border-white/40 text-white text-sm font-semibold py-3">
            不感兴趣
          </button>
          <button className="flex-[1.4] rounded-full bg-white text-erhai-indigo-deep text-sm font-bold py-3 shadow-lg">
            出发 · 环湖
          </button>
        </div>

        <div className="text-center text-[11px] text-white/70 mt-3 pb-2">
          · 上滑解锁 苍 山 视 角 ·
        </div>

        {/* 白族 山墙 border bottom */}
        <div className="h-1.5 bg-erhai-indigo/70 text-erhai-orange/90 mt-2">
          <BaiBorder className="w-full h-full" />
        </div>

        {/* Side arrows */}
        <button
          aria-label="上一张"
          className="absolute left-1 top-1/2 -translate-y-1/2 size-9 rounded-full bg-erhai-orange/85 text-white flex items-center justify-center shadow-md"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          aria-label="下一张"
          className="absolute right-1 top-1/2 -translate-y-1/2 size-9 rounded-full bg-erhai-orange/85 text-white flex items-center justify-center shadow-md"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Page dots */}
        <div className="flex items-center justify-center gap-1.5 pb-3 pt-1">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={
                i === 2
                  ? "h-1.5 w-5 rounded-full bg-erhai-orange"
                  : "h-1.5 w-1.5 rounded-full bg-white/60"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
