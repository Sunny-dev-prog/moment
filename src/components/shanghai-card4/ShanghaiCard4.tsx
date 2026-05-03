import { useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Home,
  Menu,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import shanghaiAsia from "@/assets/card4/shanghai/bld-asia.png";
import shanghaiBoc from "@/assets/card4/shanghai/bld-boc.png";
import shanghaiClub from "@/assets/card4/shanghai/bld-club.png";
import shanghaiCustom from "@/assets/card4/shanghai/bld-custom.png";
import shanghaiHsbc from "@/assets/card4/shanghai/bld-hsbc.png";
import shanghaiPeace from "@/assets/card4/shanghai/bld-peace.png";
import shanghaiPanorama from "@/assets/card4/shanghai/bund-panorama.jpg";
import shanghaiHeroAsia from "@/assets/card4/shanghai/hero-asia.jpg";
import shanghaiHeroBoc from "@/assets/card4/shanghai/hero-boc.jpg";
import shanghaiHeroClub from "@/assets/card4/shanghai/hero-club.jpg";
import shanghaiHeroCustom from "@/assets/card4/shanghai/hero-custom.jpg";
import shanghaiHeroHsbc from "@/assets/card4/shanghai/hero-hsbc.jpg";
import shanghaiHeroPeace from "@/assets/card4/shanghai/hero-peace.jpg";
import { getThemeTitleVars, parseBgColorGradient } from "@/lib/colorUtils";
import { BuildingStoryResponse, generateBundBuildingStory } from "@/lib/deepseekApi";

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
    icon: shanghaiAsia,
    hero: shanghaiHeroAsia,
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
    icon: shanghaiHsbc,
    hero: shanghaiHeroHsbc,
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
    icon: shanghaiClub,
    hero: shanghaiHeroClub,
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
    icon: shanghaiCustom,
    hero: shanghaiHeroCustom,
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
    icon: shanghaiPeace,
    hero: shanghaiHeroPeace,
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
    icon: shanghaiBoc,
    hero: shanghaiHeroBoc,
  },
];

const SHANGHAI_CARD_BG = "#22314c;#46365c;#8a5d66";

export function ShanghaiCard4({ totalCards }: { totalCards: number }) {
  const [step, setStep] = useState<Step>("pickBuilding");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [storyById, setStoryById] = useState<Record<string, BuildingStoryResponse>>({});
  const [storyState, setStoryState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [storyError, setStoryError] = useState<string>("");
  const storyRequestIdRef = useRef(0);
  const titleVars = getThemeTitleVars(SHANGHAI_CARD_BG);
  const bgStyle = { background: parseBgColorGradient(SHANGHAI_CARD_BG) };
  const lightBg = false;
  const textMain = lightBg ? "text-neutral-900" : "text-white";
  const textSoft = lightBg ? "text-neutral-700" : "text-white/80";
  const tabBorder = lightBg ? "border-neutral-200" : "border-white/15";

  const active = useMemo(
    () => BUILDINGS.find((building) => building.id === activeId) ?? null,
    [activeId],
  );

  const reset = () => {
    storyRequestIdRef.current += 1;
    setStep("pickBuilding");
    setActiveId(null);
    setSeen(new Set());
    setStoryState("idle");
    setStoryError("");
  };

  const pickBuilding = (id: string) => {
    storyRequestIdRef.current += 1;
    setActiveId(id);
    setStep("viewDetail");
    setStoryState("idle");
    setStoryError("");
    setSeen((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const backToTimeline = () => {
    storyRequestIdRef.current += 1;
    if (seen.size >= BUILDINGS.length) {
      setStep("done");
      setStoryState("idle");
      setStoryError("");
      return;
    }
    setStep("pickBuilding");
    setActiveId(null);
    setStoryState("idle");
    setStoryError("");
  };

  const progress = `${seen.size}/${BUILDINGS.length}`;
  const activeStory = activeId ? storyById[activeId] : undefined;
  const isStoryOverlayVisible = storyState === "loading" || storyState === "ready" || storyState === "error";

  const showBuildingStory = async () => {
    if (!active) return;
    if (activeStory) {
      setStoryState("ready");
      setStoryError("");
      return;
    }

    setStoryState("loading");
    setStoryError("");
    const requestId = storyRequestIdRef.current + 1;
    storyRequestIdRef.current = requestId;

    try {
      const story = await generateBundBuildingStory({
        buildingName: active.name,
        year: active.year,
        style: active.style,
        architect: active.architect,
        fact: active.fact,
        feature: active.feature,
      });

      if (storyRequestIdRef.current !== requestId) {
        return;
      }
      setStoryById((prev) => ({ ...prev, [active.id]: story }));
      setStoryState("ready");
    } catch (error) {
      if (storyRequestIdRef.current !== requestId) {
        return;
      }
      console.error("显示建筑故事失败:", error);
      setStoryState("error");
      setStoryError("故事生成失败，请稍后再试");
    }
  };

  const hideBuildingStory = () => {
    storyRequestIdRef.current += 1;
    setStoryState("idle");
    setStoryError("");
  };

  return (
    <div className="card4-root relative flex h-full w-full flex-col overflow-hidden" style={bgStyle}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(120% 60% at 50% 100%, rgba(0,0,0,0.25), transparent 60%)",
          backdropFilter: "blur(2px)",
        }}
      />

      <div className="relative flex h-full flex-col px-5 pb-2 pt-3 text-[#f5e9c8]">
        <nav className="relative z-10 flex items-center justify-between text-[13px]">
          <Menu className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
          <div className={`flex items-center gap-3 ${textSoft}`} style={titleVars as React.CSSProperties}>
            <span>团购</span>
            <span>经验</span>
            <span style={{ color: "var(--card4-title-color)" }}>外滩</span>
            <span>关注</span>
            <span>商城</span>
            <span className={`font-bold ${textMain}`} style={{ color: "var(--card4-title-color)" }}>推荐</span>
          </div>
          <Search className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
        </nav>

        <div className="relative z-10 flex items-end justify-between pt-3">
          <div style={titleVars as React.CSSProperties}>
            <h1 className="theme-shared-card-title text-shadow-soft font-extrabold">
              一城外滩百年
              <br />
              半部万国建筑
            </h1>
            <p className="mt-1 text-[11px] tracking-[0.2em]" style={{ color: "var(--card4-title-color)", opacity: 0.55 }}>
              THE BUND · 1893 — 1937
            </p>
          </div>
          <Search className="mb-1 h-4 w-4 text-amber-100/50" />
        </div>

        <div className="relative z-10 mt-3 flex min-h-[340px] items-start justify-center px-3">
          {step === "pickBuilding" && (
            <div className="card4-fade relative w-full max-w-[380px]">
              <div className="card4-spine pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2" />
              <ul className="relative space-y-2.5 py-1">
                {BUILDINGS.map((building, index) => {
                  const left = index % 2 === 0;
                  const wasSeen = seen.has(building.id);

                  return (
                    <li key={building.id} className="relative flex items-center" style={{ minHeight: 48 }}>
                      <span
                        className={`card4-dot absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                          wasSeen ? "card4-dot-seen" : "card4-dot-pulse"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => pickBuilding(building.id)}
                        className={`card4-node group flex w-[46%] items-center gap-2 rounded-xl bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-1.5 pr-2 ring-1 ring-amber-200/15 backdrop-blur-md transition-all hover:ring-amber-300/60 ${
                          left ? "mr-auto flex-row" : "ml-auto flex-row-reverse"
                        } ${wasSeen ? "opacity-95" : ""}`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/40 ring-1 ring-amber-200/20">
                          <img
                            src={building.icon}
                            alt={building.name}
                            width={36}
                            height={36}
                            loading="lazy"
                            className="h-9 w-9 object-contain"
                          />
                        </div>
                        <div className={`flex flex-col ${left ? "items-start" : "items-end"}`}>
                          <span className="card4-year-pill text-[10px] font-semibold">
                            {building.year}
                          </span>
                          <span className="mt-0.5 text-[12px] font-semibold leading-tight text-amber-50/95">
                            {building.name}
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
              <div className="card4-hero-frame relative mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-2xl ring-1 ring-white/12">
                <img
                  key={active.id}
                  src={active.hero}
                  alt={active.name}
                  width={600}
                  height={750}
                  className="card4-hero-img h-full w-full object-cover"
                />
                {isStoryOverlayVisible && (
                  <div className="absolute inset-0 z-10 overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(180deg,rgba(17,24,39,0.9),rgba(10,14,24,0.96))] shadow-[0_18px_44px_-24px_rgba(0,0,0,0.75)] backdrop-blur-md">
                    <div className="flex h-full flex-col">
                      <div className="border-b border-white/10 px-4 py-3">
                        <div className="text-[10px] font-semibold tracking-[0.24em] text-amber-100/55">
                          BUND STORY
                        </div>
                        <div className="mt-1 text-[18px] font-bold leading-tight text-amber-50">
                          {activeStory?.title || `${active.name}正在开口讲述`}
                        </div>
                        <div className="mt-1 text-[11px] leading-snug text-amber-100/65">
                          {activeStory?.subtitle || "正在为你整理这栋建筑的历史线索与时代记忆"}
                        </div>
                      </div>

                      <div className="hide-scrollbar flex-1 overflow-y-auto px-4 py-3">
                        {storyState === "loading" && (
                          <div className="space-y-3">
                            <div className="inline-flex items-center gap-1 rounded-full bg-amber-300/90 px-3 py-1 text-[11px] font-semibold text-slate-900">
                              <Sparkles className="h-3 w-3" />
                              正在生成建筑故事
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
                        )}

                        {storyState !== "loading" && activeStory && (
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1.5">
                              {activeStory.highlights.map((item) => (
                                <span key={item} className="rounded-full border border-white/12 bg-white/6 px-2.5 py-1 text-[10px] font-medium text-amber-100/78">
                                  {item}
                                </span>
                              ))}
                            </div>
                            {activeStory.paragraphs.map((paragraph) => (
                              <p key={paragraph} className="text-[13px] leading-6 text-amber-50/88">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        )}

                        {storyState === "error" && !activeStory && (
                          <div className="flex h-full flex-col items-start justify-center gap-3">
                            <div className="rounded-full border border-red-200/20 bg-red-400/12 px-3 py-1 text-[11px] font-semibold text-red-100/90">
                              故事生成失败
                            </div>
                            <p className="text-[13px] leading-6 text-amber-50/80">
                              {storyError || "当前网络或服务暂时不可用，请稍后重试。"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={backToTimeline}
                  className="card4-pulse-dot inline-flex min-w-[112px] items-center justify-center gap-1 rounded-full bg-slate-950/78 px-4 py-2 text-[12px] font-semibold text-amber-50 ring-1 ring-white/12 shadow-lg backdrop-blur-md"
                >
                  {seen.size >= BUILDINGS.length ? "看完整外滩" : "返回时间轴"}
                </button>
                <button
                  type="button"
                  onClick={isStoryOverlayVisible ? hideBuildingStory : showBuildingStory}
                  className="card4-pulse-dot inline-flex min-w-[164px] items-center justify-center gap-1 rounded-full bg-amber-300/95 px-5 py-2.5 text-[12px] font-semibold text-slate-900 shadow-lg transition-transform hover:scale-[1.02]"
                >
                  {isStoryOverlayVisible ? "返回建筑外观" : "点击查看详细内容"}
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="card4-fade relative w-full">
              <div className="card4-hero-frame relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <img
                  src={shanghaiPanorama}
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
                {BUILDINGS.map((building) => (
                  <span key={building.id} className="card4-year-pill text-[10px] font-medium">
                    {building.year} · {building.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1" />

        {step !== "viewDetail" && (
          <div className="relative z-10 mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-full bg-slate-900/70 py-3 text-[14px] font-medium text-amber-100/80 ring-1 ring-white/10 backdrop-blur-md"
            >
              {step === "done" ? "再看一遍" : "不感兴趣"}
            </button>
            <button className="flex-[1.4] rounded-full bg-amber-50 py-3 text-[14px] font-semibold text-slate-900 shadow-lg">
              查看详情
            </button>
          </div>
        )}

        <div className="relative z-10 flex items-center justify-center gap-1.5 py-2">
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === totalCards - 1 ? "w-6 bg-amber-300" : "w-1.5 bg-amber-100/30"
              }`}
            />
          ))}
        </div>

        <nav className={`relative z-10 mt-2 flex items-end justify-between border-t ${tabBorder} pt-2`}>
          <TabItem icon={<Home className="h-4 w-4" />} label="首页" active style={titleVars as React.CSSProperties} />
          <TabItem icon={<Users className="h-4 w-4" />} label="朋友" />
          <button
            className={`-mt-2 flex h-9 w-9 items-center justify-center rounded-md border-2 ${
              lightBg ? "border-neutral-900 text-neutral-900" : "border-white text-white"
            }`}
            style={titleVars as React.CSSProperties}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <TabItem icon={<MessageCircle className="h-4 w-4" />} label="消息" />
          <TabItem icon={<User className="h-4 w-4" />} label="我" />
        </nav>
      </div>
    </div>
  );
}

function TabItem({
  icon,
  label,
  active,
  style,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  style?: React.CSSProperties;
}) {
  const color = active ? "text-white" : "text-white/55";
  return (
    <div className={`flex w-12 flex-col items-center gap-0.5 ${color}`} style={active ? style : undefined}>
      {icon}
      <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{label}</span>
    </div>
  );
}
