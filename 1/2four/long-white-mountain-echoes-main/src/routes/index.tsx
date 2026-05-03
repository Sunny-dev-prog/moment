import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import bronzeDoor from "@/assets/bronze-door-bg.jpg";

export const Route = createFileRoute("/")({
  component: Card4,
});

/* ============== 数据 ============== */
const mainCards = [
  { front: "好久不见", sub: "2005.8.17 — 2015.8.17 长白山", back: "北纬 41°42′ · 东经 128°03′", backSub: "长白·归期" },
  { front: "带我回家", sub: "长白雪落，故人归",            back: "麒 麟",                       backSub: "十年一诺" },
  { front: "长白山见", sub: "十年一诺，山海赴约",          back: "8 1 7",                       backSub: "青铜门 · 归家" },
];

const coins = [
  { face: "邪", back: "吴邪" },
  { face: "灵", back: "张起灵" },
  { face: "胖", back: "王胖子" },
];

type Floaty = {
  id: string;
  type: "ticket" | "note";
  x: number; y: number; rot: number;
  title?: string; lines: string[];
  tone: "paper" | "kraft" | "blue" | "pink";
};

const initialFloats: Floaty[] = [
  { id: "t1", type: "ticket", x: 4,  y: 6,  rot: -6, tone: "paper",
    title: "杭州 → 长白山", lines: ["2015.8.17  座位号 0817", "票价：十年执念"] },
  { id: "t2", type: "ticket", x: 52, y: 2,  rot: 5,  tone: "kraft",
    title: "二道白河 → 云顶天宫", lines: ["车次：十年赴约号", "检票口：青铜门"] },
  { id: "n1", type: "note",   x: 6,  y: 52, rot: -4, tone: "blue",
    lines: ["小哥，我来接你了"] },
  { id: "n2", type: "note",   x: 50, y: 56, rot: 6,  tone: "pink",
    lines: ["接小哥回家！"] },
];

const schemes = [
  {
    key: "ogtxt", label: "原著台词向",
    items: [
      { tag: "C位主卡", text: "好久不见 · 2005-2015 长白山" },
      { tag: "车票",   text: "杭州 → 长白山 · 座位号 0817" },
      { tag: "便签",   text: "「小哥，我来接你了」" },
      { tag: "卡币",   text: "邪 · 灵" },
    ],
  },
  {
    key: "minimal", label: "极简氛围",
    items: [
      { tag: "C位卡币", text: "817 · 长白" },
      { tag: "迷你卡币", text: "十年 · 归期 · 圆满" },
      { tag: "角落便签", text: "2015.8.17" },
      { tag: "信物卡",   text: "归家" },
    ],
  },
  {
    key: "team", label: "铁三角团魂",
    items: [
      { tag: "C位主卡", text: "铁三角 · 长白山永不散" },
      { tag: "同行车票", text: "二道白河 → 雨村 · 三人同行" },
      { tag: "卡币", text: "吴邪 · 张起灵 · 王胖子" },
      { tag: "便签", text: "「我们回家」" },
    ],
  },
];

/* ============== 组件 ============== */
function Card4() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f3ef] py-3">
      <PhoneFrame>
        <CardSurface />
      </PhoneFrame>
    </div>
  );
}

/* 手机外壳（沿用前3张演示风格） */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[420px] aspect-[5.9/19] bg-[#f4f3ef] rounded-[28px] overflow-hidden shadow-xl flex flex-col">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[13px] font-semibold text-neutral-800 shrink-0">
        <span>23:02</span>
        <div className="px-6 py-1 rounded-full bg-black flex items-center gap-1">
          <span className="w-3 h-3 rounded-full border-2 border-emerald-400" />
        </div>
        <span>5G</span>
      </div>
      {/* 顶部页眉 */}
      <div className="flex items-center justify-between px-4 pb-2 shrink-0">
        <span className="text-2xl text-neutral-700">×</span>
        <div className="text-center leading-tight">
          <div className="text-[15px] font-semibold text-neutral-900">Lovable App</div>
          <div className="text-[11px] text-neutral-400">172.20.10.4</div>
        </div>
        <span className="text-2xl text-neutral-700 tracking-widest">···</span>
      </div>

      <div className="flex-1 min-h-0 px-2 pb-2">
        {children}
      </div>

      {/* 底部 Tab Bar */}
      <div className="shrink-0 border-t border-neutral-200 bg-white px-2 pt-1 pb-2 flex items-end justify-around text-[10px] text-neutral-500">
        {[
          { l: "首页", i: "⌂", active: true },
          { l: "朋友", i: "👥" },
          { l: "", i: "+", big: true },
          { l: "消息", i: "💬" },
          { l: "我",   i: "👤" },
        ].map((t, idx) => (
          <div key={idx} className="flex flex-col items-center gap-0.5 flex-1">
            {t.big ? (
              <div className="w-9 h-9 border-2 border-neutral-800 rounded-md flex items-center justify-center text-xl font-light">+</div>
            ) : (
              <span className="text-lg">{t.i}</span>
            )}
            <span className={t.active ? "text-neutral-900 font-medium" : ""}>{t.l}</span>
          </div>
        ))}
      </div>

      {/* 页面指示器 4/4 */}
      <div className="shrink-0 flex items-center justify-center gap-1.5 pb-2 bg-white">
        {[0,1,2,3].map(i => (
          <span key={i} className={`h-1 rounded-full transition-all ${i===3 ? "w-5 bg-orange-400" : "w-3 bg-neutral-300"}`} />
        ))}
      </div>
    </div>
  );
}

/* 卡片主体 */
function CardSurface() {
  return (
    <div className="relative h-full w-full rounded-[22px] overflow-hidden">
      {/* 1) 底层渐变 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #d6ecf5 0%, #c4dff0 22%, #a8c5d8 48%, #5a6b80 78%, #2d3a52 100%)",
        }}
      />
      {/* 2) 中层背景图（青铜门）—— 融合在中段 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bronzeDoor})`,
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          opacity: 0.42,
          mixBlendMode: "soft-light",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 22%, #000 82%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 22%, #000 82%, transparent 100%)",
        }}
      />
      {/* 第二遍微弱叠加，让铜门轮廓若隐若现 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bronzeDoor})`,
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          opacity: 0.18,
          mixBlendMode: "overlay",
        }}
      />
      {/* 3) 顶层蓝白雾 + 整张卡的飘雪 */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.55), transparent 60%)" }}
      />
      <SnowLayer count={22} />

      {/* 顶部导航 + 角标 */}
      <TopNav />

      {/* 滚动内容 */}
      <div className="absolute inset-0 pt-14 pb-14 overflow-y-auto no-scrollbar">
        <div className="px-4 space-y-4 pb-4">
          <Header />
          <SectionA />
          <SectionB />
          <SectionC />
          <FooterTip />
        </div>
      </div>

      {/* 左右翻页箭头 */}
      <SideArrow side="left" />
      <SideArrow side="right" />

      {/* 底部按钮 */}
      <BottomCTA />
    </div>
  );
}

/* ===== 顶部导航 ===== */
function TopNav() {
  const tabs = ["团购", "经验", "长白山", "关注", "商城", "推荐"];
  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2 pt-2">
      <button className="bg-orange-400 text-white text-xs font-semibold rounded-full px-3 py-1.5 shadow">
        ← 返回
      </button>
      <div className="flex items-center gap-2 text-[13px] text-neutral-700/90 px-1">
        {tabs.map((t, i) => (
          <span key={t} className={i === tabs.length - 1 ? "font-bold text-neutral-900" : ""}>
            {t}
          </span>
        ))}
      </div>
      <button className="bg-orange-400 text-white text-xs font-semibold rounded-full px-3 py-1.5 shadow">
        4/4
      </button>
    </div>
  );
}

/* ===== 主标题区 ===== */
function Header() {
  return (
    <div className="space-y-3 mt-2">
      <h1 className="font-extrabold text-[24px] leading-[1.25] text-neutral-900 drop-shadow-sm">
        此刻，铁三角正赴
        <br />
        <span className="text-sky-500">《盗墓笔记》长白山</span>
        <br />
        十年之约
      </h1>

      {/* 信息条 */}
      <div className="rounded-2xl bg-white/55 backdrop-blur-md border border-white/70 shadow-sm px-3 py-2.5">
        <div className="grid grid-cols-4 gap-1 text-center">
          {[
            ["主题", "归家"],
            ["时段", "8.17"],
            ["信物", "青铜门"],
            ["暗号", "817"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[10px] text-neutral-500">{k}</div>
              <div className="text-[15px] font-bold text-neutral-900 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-white/70 text-[12px] text-neutral-700 flex items-center gap-1">
          <span className="text-sky-500">✦</span>
          长白·归家·十年·封神 → 入坑这部神作吗？
        </div>
      </div>
    </div>
  );
}

/* ===== 板块 A：C位主卡轮播（翻转 + 长按发光） ===== */
function SectionA() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  const [glowIdx, setGlowIdx] = useState<number | null>(null);
  const pressTimer = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const toggleFlip = (i: number) => {
    setFlipped(prev => prev.map((v, k) => (k === i ? !v : v)));
  };

  const onPointerDown = (e: React.PointerEvent, i: number) => {
    startX.current = e.clientX;
    moved.current = false;
    pressTimer.current = window.setTimeout(() => setGlowIdx(i), 380);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    if (Math.abs(e.clientX - startX.current) > 8) {
      moved.current = true;
      if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
    }
  };
  const onPointerUp = (e: React.PointerEvent, i: number) => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
    setGlowIdx(null);
    if (startX.current != null && moved.current) {
      const dx = e.clientX - startX.current;
      if (dx < -30) setIdx(v => Math.min(v + 1, mainCards.length - 1));
      else if (dx > 30) setIdx(v => Math.max(v - 1, 0));
    } else {
      // tap
      toggleFlip(i);
    }
    startX.current = null;
    moved.current = false;
  };

  return (
    <section className="space-y-2">
      <SectionTitle kicker="SCENE · 雪落长白" title="C位主卡 · 三句封神台词" hint="点击翻面 · 左右滑切 · 长按发光" />

      <div className="relative h-[180px] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(calc(${-idx * 100}% + ${-idx * 0}px))` }}
        >
          {mainCards.map((c, i) => (
            <div key={i} className="w-full shrink-0 px-2 flex items-center justify-center">
              <div
                className={`flip-card w-[78%] h-[160px] cursor-pointer ${glowIdx === i ? "gold-glow rounded-2xl" : ""}`}
                onPointerDown={(e) => onPointerDown(e, i)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, i)}
                onPointerCancel={() => { if (pressTimer.current) clearTimeout(pressTimer.current); setGlowIdx(null); }}
              >
                <div className={`flip-inner ${flipped[i] ? "flipped" : ""}`}>
                  {/* 正面 */}
                  <div className="flip-face">
                    <MainCardFace front sub={c.sub} text={c.front} />
                  </div>
                  {/* 背面 */}
                  <div className="flip-face flip-back">
                    <MainCardFace text={c.back} sub={c.backSub} />
                  </div>
                </div>
                {/* 长按金粉 */}
                {glowIdx === i && <GoldParticles />}
              </div>
            </div>
          ))}
        </div>

        {/* 指示点 */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5">
          {mainCards.map((_, i) => (
            <button key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-amber-600" : "w-1.5 bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MainCardFace({ text, sub, front }: { text: string; sub: string; front?: boolean }) {
  return (
    <div
      className="w-full h-full rounded-2xl border-2 flex flex-col items-center justify-center text-center shadow-[0_8px_24px_-8px_rgba(60,40,10,0.35)] relative overflow-hidden"
      style={{
        borderColor: "#c9a96e",
        background:
          "linear-gradient(160deg, #fbf6ea 0%, #f1e6c9 60%, #e7d6a8 100%)",
      }}
    >
      {/* 极淡青铜纹底 */}
      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, #5a4a1f 0 1px, transparent 1.5px), radial-gradient(circle at 70% 70%, #5a4a1f 0 1px, transparent 1.5px)",
          backgroundSize: "18px 18px, 22px 22px",
        }}
      />
      <div className="relative">
        <div className={`font-stamp text-[34px] leading-none text-[#6b4a1c] ${front ? "" : "tracking-[0.3em]"}`}>
          {text}
        </div>
        <div className="mt-3 text-[11px] text-[#8a6a2c] tracking-wider">{sub}</div>
      </div>
      <div className="absolute top-1.5 right-2 text-[9px] text-[#a98944] tracking-widest">817 · 长白</div>
      <div className="absolute bottom-1.5 left-2 text-[9px] text-[#a98944]">№ 2015 / 0817</div>
    </div>
  );
}

function GoldParticles() {
  const dots = Array.from({ length: 10 });
  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map((_, i) => {
        const tx = (Math.random() * 60 - 30).toFixed(0) + "px";
        const ty = (-30 - Math.random() * 40).toFixed(0) + "px";
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-amber-300"
            style={{
              animation: `goldParticle ${0.9 + Math.random() * 0.6}s ease-out ${i * 0.05}s infinite`,
              ["--tx" as never]: tx,
              ["--ty" as never]: ty,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

/* ===== 板块 B：雪地散落区（拖动 + 卡币翻转 + 飘雪） ===== */
function SectionB() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [floats, setFloats] = useState<Floaty[]>(initialFloats);
  const dragging = useRef<{ id: string; offX: number; offY: number; rect: DOMRect } | null>(null);
  const [activeRot, setActiveRot] = useState<Record<string, number>>({});

  const onDragStart = (e: React.PointerEvent, f: Floaty) => {
    if (!containerRef.current) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = containerRef.current.getBoundingClientRect();
    const px = (f.x / 100) * rect.width;
    const py = (f.y / 100) * rect.height;
    dragging.current = { id: f.id, offX: e.clientX - rect.left - px, offY: e.clientY - rect.top - py, rect };
  };
  const onDragMove = (e: React.PointerEvent) => {
    const d = dragging.current;
    if (!d) return;
    const rect = d.rect;
    const nx = ((e.clientX - rect.left - d.offX) / rect.width) * 100;
    const ny = ((e.clientY - rect.top - d.offY) / rect.height) * 100;
    setFloats(prev => prev.map(it => it.id === d.id
      ? { ...it, x: Math.max(0, Math.min(80, nx)), y: Math.max(0, Math.min(78, ny)) }
      : it));
    setActiveRot(r => ({ ...r, [d.id]: Math.sin(Date.now() / 80) * 4 }));
  };
  const onDragEnd = () => {
    if (dragging.current) setActiveRot(r => ({ ...r, [dragging.current!.id]: 0 }));
    dragging.current = null;
  };

  // 卡币翻转
  const [coinFlip, setCoinFlip] = useState<boolean[]>([false, false, false]);

  return (
    <section className="space-y-2">
      <SectionTitle kicker="SNOW · 雪地信物" title="散落小卡 · 可拖动 · 可翻转" hint="按住车票/便签拖一拖，点卡币翻面" />

      <div
        ref={containerRef}
        className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-white/60 shadow-sm"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(220,235,245,0.55) 100%)",
          backdropFilter: "blur(8px)",
        }}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerLeave={onDragEnd}
      >
        {/* 雪花飘落（仅此区域） */}
        <SnowLayer count={14} small />

        {/* 拖动信物 */}
        {floats.map((f) => (
          <div
            key={f.id}
            className="absolute touch-none select-none"
            style={{
              left: `${f.x}%`,
              top:  `${f.y}%`,
              transform: `rotate(${(activeRot[f.id] ?? 0) + f.rot}deg)`,
              transition: dragging.current?.id === f.id ? "none" : "transform .25s ease",
              ["--rot" as never]: `${f.rot}deg`,
            } as React.CSSProperties}
          >
            <div className="float-soft" style={{ animationDelay: `${(parseInt(f.id.slice(1)) || 1) * 0.7}s` }}>
              {f.type === "ticket"
                ? <Ticket title={f.title!} lines={f.lines} tone={f.tone} onPointerDown={(e) => onDragStart(e, f)} />
                : <Note lines={f.lines} tone={f.tone} onPointerDown={(e) => onDragStart(e, f)} />
              }
            </div>
          </div>
        ))}

        {/* 底部卡币一排（不参与拖动） */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-4">
          {coins.map((c, i) => (
            <button
              key={i}
              className="flip-card w-14 h-14"
              onClick={() => setCoinFlip(prev => prev.map((v,k) => k===i ? !v : v))}
            >
              <div className={`flip-inner ${coinFlip[i] ? "flipped" : ""}`}>
                <div className="flip-face">
                  <Coin text={c.face} />
                </div>
                <div className="flip-face flip-back">
                  <Coin text={c.back} small />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 提示水印 */}
        <div className="absolute top-2 right-3 text-[10px] text-neutral-500/80">长按拖动 · 点击翻面</div>
      </div>
    </section>
  );
}

function Ticket({
  title, lines, tone, onPointerDown,
}: { title: string; lines: string[]; tone: Floaty["tone"]; onPointerDown: (e: React.PointerEvent) => void }) {
  const bg =
    tone === "kraft" ? "linear-gradient(160deg,#f0e1c4,#e6d2a4)" : "linear-gradient(160deg,#fdfaf2,#f3ead2)";
  return (
    <div
      onPointerDown={onPointerDown}
      className="relative w-[160px] rounded-md shadow-md cursor-grab active:cursor-grabbing border border-amber-200/80"
      style={{ background: bg }}
    >
      {/* 撕边圆缺 */}
      <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/80" />
      <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/80" />
      <div className="px-3 py-2">
        <div className="text-[9px] tracking-[0.2em] text-amber-700/80">TICKET · 十年赴约</div>
        <div className="font-stamp text-[14px] text-[#5a3a14] mt-0.5 leading-tight">{title}</div>
        <div className="border-t border-dashed border-amber-700/30 my-1.5" />
        {lines.map((l, i) => (
          <div key={i} className="text-[10px] text-[#6c4a1f] leading-snug">{l}</div>
        ))}
      </div>
    </div>
  );
}

function Note({
  lines, tone, onPointerDown,
}: { lines: string[]; tone: Floaty["tone"]; onPointerDown: (e: React.PointerEvent) => void }) {
  const bg =
    tone === "blue" ? "linear-gradient(160deg,#eaf4ff,#d4e8ff)" :
    tone === "pink" ? "linear-gradient(160deg,#ffeede,#ffd9b8)" :
                      "linear-gradient(160deg,#fff,#f3f3eb)";
  const ink = tone === "blue" ? "#1f3b6b" : "#7a3a12";
  return (
    <div
      onPointerDown={onPointerDown}
      className="relative w-[150px] rounded-sm shadow-md cursor-grab active:cursor-grabbing border border-white/80"
      style={{ background: bg }}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-amber-100/80 rotate-2 shadow-sm rounded-[2px]" />
      <div className="px-3 py-3">
        {lines.map((l, i) => (
          <div key={i} className="font-hand text-[18px] leading-tight" style={{ color: ink }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function Coin({ text, small }: { text: string; small?: boolean }) {
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(80,55,15,0.5)] border-2"
      style={{
        background: "radial-gradient(circle at 35% 30%, #eccd86, #b6873b 70%, #7a5a20)",
        borderColor: "#7a5a20",
      }}
    >
      <span
        className={`font-stamp text-[#3b2a0c] ${small ? "text-[11px]" : "text-[22px]"} drop-shadow-[0_1px_0_rgba(255,230,170,0.6)]`}
      >
        {text}
      </span>
    </div>
  );
}

/* ===== 板块 C：成套方案 Tab ===== */
function SectionC() {
  const [k, setK] = useState(0);
  const cur = schemes[k];
  return (
    <section className="space-y-2">
      <SectionTitle kicker="COMBO · 成套方案" title="一键复刻三套搭配" hint="切换标签换方案" />

      <div className="rounded-2xl bg-white/55 backdrop-blur-md border border-white/70 shadow-sm p-3">
        <div className="flex gap-1.5 mb-3">
          {schemes.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setK(i)}
              className={`text-[12px] px-3 py-1.5 rounded-full transition-all ${
                i === k
                  ? "bg-neutral-900 text-white shadow"
                  : "bg-white/70 text-neutral-700 border border-white/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div key={cur.key} className="space-y-2 fade-up">
          {cur.items.map((it, i) => (
            <div key={i} className="flex items-start gap-2 rounded-xl bg-white/70 border border-white/80 px-3 py-2">
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-600 mt-0.5">
                {it.tag}
              </span>
              <span className="text-[13px] text-neutral-800 leading-snug">{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterTip() {
  return (
    <div className="pt-1 pb-2">
      <div className="font-extrabold text-[18px] leading-snug text-neutral-900">
        接下来，以
        <span className="text-sky-500">主题视角</span>
        <br />
        解锁城市之旅！
      </div>
    </div>
  );
}

/* ===== 公共：板块标题 / 侧边箭头 / 底部 CTA / 飘雪 ===== */
function SectionTitle({ kicker, title, hint }: { kicker: string; title: string; hint?: string }) {
  return (
    <div className="px-1">
      <div className="text-[10px] tracking-[0.25em] text-neutral-600/90">{kicker}</div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-[15px] font-bold text-neutral-900">{title}</div>
        {hint && <div className="text-[10px] text-neutral-600/80">{hint}</div>}
      </div>
    </div>
  );
}

function SideArrow({ side }: { side: "left" | "right" }) {
  return (
    <button
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-1" : "right-1"}
        bg-orange-400 text-white w-7 h-7 rounded-full flex items-center justify-center shadow z-20`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}

function BottomCTA() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-2 pt-2 bg-gradient-to-t from-[#23304a]/85 via-[#23304a]/55 to-transparent">
      <div className="flex items-center gap-2">
        <button className="flex-1 rounded-full bg-white/85 text-neutral-800 text-[13px] font-medium py-2.5 border border-white">
          不感兴趣
        </button>
        <button className="flex-[1.4] rounded-full bg-neutral-900 text-white text-[13px] font-semibold py-2.5">
          查看详情
        </button>
      </div>
      <div className="text-center text-[10px] text-white/80 mt-1.5">︿ 上滑继续看视频</div>
    </div>
  );
}

function SnowLayer({ count, small }: { count: number; small?: boolean }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        size: (small ? 2 : 3) + Math.random() * (small ? 2 : 4),
        dur: 6 + Math.random() * 8,
        delay: -Math.random() * 10,
        op: 0.4 + Math.random() * 0.5,
      })),
    [count, small],
  );
  // 防 SSR/CSR 不匹配：仅客户端渲染
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snow-dot"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.op,
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
