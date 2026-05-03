import { useMemo, useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Home,
  Users,
  Plus,
  MessageCircle,
  User,
  Search,
  ChevronRight,
} from "lucide-react";

import skyline from "@/assets/card4/bund-skyline.png";
import panorama from "@/assets/card4/bund-panorama.jpg";

import bAsia from "@/assets/card4/bld-asia.png";
import bHsbc from "@/assets/card4/bld-hsbc.png";
import bClub from "@/assets/card4/bld-club.png";
import bCustom from "@/assets/card4/bld-custom.png";
import bPeace from "@/assets/card4/bld-peace.png";
import bBoc from "@/assets/card4/bld-boc.png";

import hAsia from "@/assets/card4/hero-asia.jpg";
import hHsbc from "@/assets/card4/hero-hsbc.jpg";
import hClub from "@/assets/card4/hero-club.jpg";
import hCustom from "@/assets/card4/hero-custom.jpg";
import hPeace from "@/assets/card4/hero-peace.jpg";
import hBoc from "@/assets/card4/hero-boc.jpg";

type Step = "pickBuilding" | "viewDetail" | "done";

type Building = {
  id: string;
  year: string;
  name: string;
  enName: string;
  style: string;
  architect: string;
  fact: string;
  feature: string;
  icon: string;
  hero: string;
};

const BUILDINGS: Building[] = [
  {
    id: "asia",
    year: "1893",
    name: "亚细亚大楼",
    enName: "Asia Building",
    style: "折衷主义",
    architect: "玛礼逊洋行",
    fact: "外滩第一楼",
    feature: "巴洛克式立面 · 拱券窗",
    icon: bAsia,
    hero: hAsia,
  },
  {
    id: "hsbc",
    year: "1923",
    name: "汇丰银行大楼",
    enName: "HSBC Building",
    style: "新古典主义",
    architect: "公和洋行",
    fact: "远东第一大楼",
    feature: "巨型穹顶 · 八角门厅",
    icon: bHsbc,
    hero: hHsbc,
  },
  {
    id: "club",
    year: "1925",
    name: "上海总会",
    enName: "Shanghai Club",
    style: "英国文艺复兴",
    architect: "塔兰特 & 莫里森",
    fact: "远东最长酒吧",
    feature: "三段式立面 · 爱奥尼柱",
    icon: bClub,
    hero: hClub,
  },
  {
    id: "custom",
    year: "1927",
    name: "江海关大楼",
    enName: "Custom House",
    style: "新古典主义",
    architect: "公和洋行",
    fact: "外滩大钟「Big Ching」",
    feature: "钟楼 · 多立克柱廊",
    icon: bCustom,
    hero: hCustom,
  },
  {
    id: "peace",
    year: "1929",
    name: "和平饭店",
    enName: "Peace Hotel",
    style: "装饰艺术 (Art Deco)",
    architect: "公和洋行",
    fact: "沙逊大厦 · 远东第一楼",
    feature: "墨绿铜皮金字塔顶",
    icon: bPeace,
    hero: hPeace,
  },
  {
    id: "boc",
    year: "1937",
    name: "中国银行大楼",
    enName: "Bank of China",
    style: "中西合璧",
    architect: "陆谦受 / 公和洋行",
    fact: "外滩唯一华人主笔建筑",
    feature: "歇山顶 · 蓝色琉璃瓦",
    icon: bBoc,
    hero: hBoc,
  },
];

export default function Card4Bund() {
  const [step, setStep] = useState<Step>("pickBuilding");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  const active = useMemo(
    () => BUILDINGS.find((b) => b.id === activeId) ?? null,
    [activeId],
  );

  const reset = () => {
    setStep("pickBuilding");
    setActiveId(null);
    setSeen(new Set());
  };

  const pickBuilding = (id: string) => {
    setActiveId(id);
    setStep("viewDetail");
    setSeen((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const backToTimeline = () => {
    if (seen.size >= BUILDINGS.length) {
      setStep("done");
      return;
    }
    setStep("pickBuilding");
    setActiveId(null);
  };

  const progress = `${seen.size}/${BUILDINGS.length}`;

  return (
    <div className="card4-root relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden">
      {/* 背景层 */}
      <div className="card4-bg pointer-events-none absolute inset-0" />
      <div className="card4-noise pointer-events-none absolute inset-0" />
      <img
        src={skyline}
        alt=""
        aria-hidden
        className="card4-skyline pointer-events-none absolute inset-x-0 top-0 h-[180px] w-full object-cover opacity-25"
      />
      <div className="card4-glow pointer-events-none absolute inset-x-0 top-0 h-[55%]" />

      {/* 顶部导航 */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button className="card4-pill flex items-center gap-1 px-3 py-1.5 text-[13px]">
          <ArrowLeft className="h-3.5 w-3.5" />
          返回
        </button>
        <nav className="flex items-center gap-3 text-[13px] text-amber-100/60">
          <span>外滩</span>
          <span>建筑</span>
          <span>历史</span>
          <span>收藏</span>
          <span className="font-semibold text-amber-50">推荐</span>
        </nav>
        <button
          onClick={reset}
          className="card4-pill flex items-center gap-1 px-3 py-1.5 text-[13px]"
          aria-label="重来"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {progress}
        </button>
      </header>

      {/* 主标题 */}
      <div className="relative z-10 flex items-end justify-between px-5 pt-3">
        <div>
          <h1 className="card4-title text-[26px] leading-[1.15]">
            一城外滩百年
            <br />
            <span className="card4-title-accent">半部万国建筑</span>
          </h1>
          <p className="mt-1 text-[11px] tracking-[0.2em] text-amber-100/55">
            THE BUND · 1893 — 1937
          </p>
        </div>
        <Search className="mb-1 h-4 w-4 text-amber-100/50" />
      </div>

      {/* 主舞台：固定高度避免布局跳动 */}
      <div className="relative z-10 mt-3 flex min-h-[340px] items-start justify-center px-3">
        {step === "pickBuilding" && (
          <div className="card4-fade relative w-full max-w-[380px]">
            {/* 中央金线 */}
            <div className="card4-spine pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2" />
            <ul className="relative space-y-2.5 py-1">
              {BUILDINGS.map((b, i) => {
                const left = i % 2 === 0;
                const wasSeen = seen.has(b.id);
                return (
                  <li
                    key={b.id}
                    className="relative flex items-center"
                    style={{ minHeight: 48 }}
                  >
                    {/* 节点圆点 */}
                    <span
                      className={`card4-dot absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                        wasSeen ? "card4-dot-seen" : "card4-dot-pulse"
                      }`}
                    />
                    {/* 卡片 */}
                    <button
                      onClick={() => pickBuilding(b.id)}
                      className={`card4-node group flex w-[46%] items-center gap-2 rounded-xl bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-1.5 pr-2 ring-1 ring-amber-200/15 backdrop-blur-md transition-all hover:ring-amber-300/60 ${
                        left ? "mr-auto flex-row" : "ml-auto flex-row-reverse"
                      } ${wasSeen ? "opacity-95" : ""}`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/40 ring-1 ring-amber-200/20">
                        <img
                          src={b.icon}
                          alt={b.name}
                          width={36}
                          height={36}
                          loading="lazy"
                          className="h-9 w-9 object-contain"
                        />
                      </div>
                      <div
                        className={`flex flex-col ${left ? "items-start" : "items-end"}`}
                      >
                        <span className="card4-year-pill text-[10px] font-semibold">
                          {b.year}
                        </span>
                        <span className="mt-0.5 text-[12px] font-semibold text-amber-50/95 leading-tight">
                          {b.name}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-2 flex justify-center">
              <span className="card4-pulse-dot inline-flex items-center gap-1 rounded-full bg-amber-300/95 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-lg">
                <Sparkles className="h-3 w-3" />
                选一栋建筑，听它讲百年故事
              </span>
            </div>
          </div>
        )}

        {step === "viewDetail" && active && (
          <div className="card4-fade relative w-full">
            <div className="card4-hero-frame relative mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-2xl">
              <img
                key={active.id}
                src={active.hero}
                alt={active.name}
                width={600}
                height={750}
                className="card4-hero-img h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <span className="card4-year-pill text-[10px] font-semibold">
                  {active.year} · {active.style}
                </span>
                <div className="mt-1 text-[18px] font-bold text-amber-50 leading-tight">
                  {active.name}
                </div>
                <div className="text-[10px] tracking-widest text-amber-100/60">
                  {active.enName.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-center">
              <button
                onClick={backToTimeline}
                className="card4-pulse-dot inline-flex items-center gap-1 rounded-full bg-amber-300/95 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-lg"
              >
                {seen.size >= BUILDINGS.length ? "看完整外滩" : "返回时间轴"}
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="card4-fade relative w-full">
            <div className="card4-hero-frame relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <img
                src={panorama}
                alt="外滩全景"
                width={1280}
                height={800}
                className="card4-rise h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="text-[16px] font-bold text-amber-50">
                  百年外滩 · 半部万国建筑史
                </div>
                <div className="text-[11px] text-amber-100/65">
                  你已解锁 6 / 6 栋历史建筑
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-2">
              {BUILDINGS.map((b) => (
                <span
                  key={b.id}
                  className="card4-year-pill text-[10px] font-medium"
                >
                  {b.year} · {b.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 下半区：建筑档案常驻 */}
      <div className="relative z-10 mx-4 mt-2">
        {step !== "done" ? (
          <div
            className={`card4-fade rounded-2xl bg-gradient-to-br from-slate-900/65 to-slate-950/55 p-3 ring-1 ring-amber-200/15 backdrop-blur-md ${
              step === "pickBuilding" ? "opacity-60" : ""
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-amber-200/75">
                INFO · 建筑档案
              </span>
              <span className="text-[10px] text-amber-100/50">
                {step === "viewDetail" ? active?.enName : "点上方建筑解锁"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "建筑年代", value: active?.year ?? "——" },
                { label: "建筑风格", value: active?.style ?? "——" },
                { label: "设计 / 历史", value: active?.architect ?? "——" },
                { label: "建筑特点", value: active?.feature ?? "——" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-black/30 px-2.5 py-1.5 ring-1 ring-white/5"
                >
                  <div className="text-[9px] tracking-widest text-amber-200/55">
                    {item.label}
                  </div>
                  <div className="mt-0.5 truncate text-[12px] font-medium text-amber-50/95">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            {active && step === "viewDetail" && (
              <div className="mt-2 border-t border-amber-200/10 pt-2 text-[11px] text-amber-100/75">
                <span className="text-amber-200/80">· </span>
                {active.fact}
              </div>
            )}
          </div>
        ) : (
          <div className="card4-fade text-center">
            <div className="text-[12px] tracking-[0.2em] text-amber-200/70">
              SHANGHAI · THE BUND
            </div>
            <div className="mt-1 text-[14px] text-amber-100/80">
              不是历史在远方 — 是你刚走过它
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* 底部 CTA */}
      <div className="relative z-10 mt-3 flex items-center gap-3 px-4">
        <button
          onClick={reset}
          className="flex-1 rounded-full bg-slate-900/70 py-3 text-[14px] font-medium text-amber-100/80 ring-1 ring-white/10 backdrop-blur-md"
        >
          {step === "done" ? "再看一遍" : "不感兴趣"}
        </button>
        <button className="flex-[1.4] rounded-full bg-amber-50 py-3 text-[14px] font-semibold text-slate-900 shadow-lg">
          查看详情
        </button>
      </div>

      {/* 底部 tabbar */}
      <div className="relative z-10 mt-3 flex items-end justify-between border-t border-white/10 bg-black/35 px-6 pb-3 pt-2 backdrop-blur-md">
        {[
          { icon: Home, label: "首页", active: true },
          { icon: Users, label: "朋友" },
          { icon: Plus, label: "", big: true },
          { icon: MessageCircle, label: "消息" },
          { icon: User, label: "我" },
        ].map((t, i) => (
          <div
            key={i}
            className={`flex flex-col items-center ${
              t.big ? "-mt-3 rounded-md border-2 border-amber-50 p-1.5" : ""
            }`}
          >
            <t.icon
              className={`h-5 w-5 ${t.active ? "text-amber-50" : "text-amber-100/60"}`}
            />
            {t.label && (
              <span
                className={`mt-0.5 text-[10px] ${
                  t.active ? "text-amber-50" : "text-amber-100/60"
                }`}
              >
                {t.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 进度指示器 */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 py-2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === 3 ? "w-6 bg-amber-300" : "w-1.5 bg-amber-100/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
