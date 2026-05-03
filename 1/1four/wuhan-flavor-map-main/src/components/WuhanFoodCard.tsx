import { Search, Menu, Home, Users, Plus, MessageCircle, User, ChevronUp } from "lucide-react";

type Spot = {
  emoji: string;
  area: string;
  shop: string;
  dish: string;
  distance: string;
  x: number;
  y: number;
  side: "left" | "right";
};

// 6 个站点 + 起点。坐标基于 360×640 viewBox。手工放置避免重叠。
const START = { x: 285, y: 70 };

const SPOTS: Spot[] = [
  { emoji: "🍜", area: "粮道街",   shop: "赵师傅天天红", dish: "过早·热干面",  distance: "约5km",  x: 75,  y: 158, side: "right" },
  { emoji: "🦐", area: "楚河汉街", shop: "巴厘龙虾",     dish: "油焖大虾",     distance: "约6km",  x: 250, y: 248, side: "left"  },
  { emoji: "🦞", area: "万松园",   shop: "靓靓蒸虾",     dish: "夜宵小龙虾",   distance: "约7km",  x: 90,  y: 340, side: "right" },
  { emoji: "🥟", area: "户部巷",   shop: "老通城",       dish: "三鲜豆皮",     distance: "约8km",  x: 245, y: 432, side: "left"  },
  { emoji: "🎁", area: "江汉路",   shop: "蔡林记礼盒",   dish: "武汉伴手礼",   distance: "约9km",  x: 95,  y: 520, side: "right" },
  { emoji: "🌸", area: "樱花限定", shop: "DQ 暴风雪",    dish: "樱花冰淇淋",   distance: "限定",   x: 240, y: 600, side: "left"  },
];

// 平滑手绘路径：起点 → 6 站点
const buildTrail = () => {
  const pts = [START, ...SPOTS];
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const midY = (a.y + b.y) / 2;
    // 让控制点偏向起点 x，制造手绘弯曲感
    d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
  }
  return d;
};

export const WuhanFoodCard = () => {
  return (
    <div className="relative mx-auto w-full max-w-[420px] min-h-screen overflow-hidden bg-gradient-wuhan text-foreground">
      {/* 飘落樱花 */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {[...Array(14)].map((_, i) => {
          const size = 8 + (i % 4) * 3;
          return (
            <div
              key={i}
              className="absolute -top-6 animate-petal"
              style={{
                left: `${(i * 7.3) % 100}%`,
                animationDelay: `${i * 1.1}s`,
                animationDuration: `${12 + (i % 5) * 2}s`,
              }}
            >
              <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1c1.5 2 3 3 5 3-1 2-1 4 0 6-2 0-3.5 1-5 3-1.5-2-3-3-5-3 1-2 1-4 0-6 2 0 3.5-1 5-3z"
                  fill="hsl(var(--sakura-glow))"
                  opacity="0.7"
                />
              </svg>
            </div>
          );
        })}
      </div>

      {/* 顶部导航 */}
      <header className="relative z-20 flex items-center justify-between px-5 pt-3 pb-2">
        <Menu className="h-6 w-6 text-primary" strokeWidth={2.2} />
        <nav className="flex items-center gap-3 text-[13px] text-primary/85">
          <span>团购</span>
          <span>经验</span>
          <span>武汉</span>
          <span>关注</span>
          <span>商城</span>
          <span className="font-bold text-primary">推荐</span>
        </nav>
        <Search className="h-6 w-6 text-primary" strokeWidth={2.2} />
      </header>

      {/* 标题 */}
      <section className="relative z-20 px-5 pt-1 pb-2">
        <h1 className="text-[19px] font-black leading-[1.35] text-primary text-shadow-soft tracking-wide">
          欣赏完樱花的浪漫
          <br />
          肯定饿坏了吧？
          <br />
          这条<span className="text-sakura-glow">夜食路线</span>，请收下：
        </h1>
        <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full glass-pink px-3 py-1 text-[11px] text-primary">
          <span>⛩</span>
          武汉本地人认证 · 6 站夜食巡礼
        </div>
      </section>

      {/* 邮票纸 美食地图 */}
      <section className="relative z-10 mx-auto px-3 pb-2">
        <div className="relative mx-auto" style={{ maxWidth: 380 }}>
          <svg
            viewBox="0 0 360 700"
            className="block w-full h-auto drop-shadow-[0_12px_28px_hsl(245_45%_15%/0.45)]"
            aria-hidden
          >
            <defs>
              {/* 邮票齿边 mask */}
              <mask id="stampMask">
                <rect x="0" y="0" width="360" height="700" fill="white" />
                {/* 顶部 / 底部齿 */}
                {[...Array(20)].map((_, i) => (
                  <g key={`th-${i}`}>
                    <circle cx={10 + i * 18} cy="6" r="6" fill="black" />
                    <circle cx={10 + i * 18} cy="694" r="6" fill="black" />
                  </g>
                ))}
                {/* 左右齿 */}
                {[...Array(38)].map((_, i) => (
                  <g key={`tv-${i}`}>
                    <circle cx="6" cy={10 + i * 18} r="6" fill="black" />
                    <circle cx="354" cy={10 + i * 18} r="6" fill="black" />
                  </g>
                ))}
              </mask>

              <pattern id="paperGrain" width="3" height="3" patternUnits="userSpaceOnUse">
                <rect width="3" height="3" fill="hsl(var(--paper-warm))" />
                <circle cx="1" cy="1" r="0.4" fill="hsl(var(--paper-edge))" opacity="0.5" />
              </pattern>

              <radialGradient id="paperVignette" cx="50%" cy="50%" r="70%">
                <stop offset="60%" stopColor="hsl(var(--paper-warm))" stopOpacity="0" />
                <stop offset="100%" stopColor="hsl(var(--ink-deep))" stopOpacity="0.18" />
              </radialGradient>

              <radialGradient id="emojiGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--sakura-glow))" stopOpacity="0.95" />
                <stop offset="100%" stopColor="hsl(var(--sakura-pink))" stopOpacity="0.1" />
              </radialGradient>

              <filter id="inkBleed">
                <feGaussianBlur stdDeviation="0.4" />
              </filter>
            </defs>

            {/* —— 纸底（带邮票齿） —— */}
            <g mask="url(#stampMask)">
              <rect x="0" y="0" width="360" height="700" fill="url(#paperGrain)" />
              <rect x="0" y="0" width="360" height="700" fill="url(#paperVignette)" />
              {/* 内边框 */}
              <rect
                x="14" y="14" width="332" height="672"
                fill="none"
                stroke="hsl(var(--ink-deep))"
                strokeWidth="1"
                strokeDasharray="2 4"
                opacity="0.35"
              />
            </g>

            {/* —— 长江波浪（背景，贯穿） —— */}
            <g opacity="0.22" stroke="hsl(var(--wuhan-deep))" strokeWidth="1.2" fill="none" strokeLinecap="round">
              <path d="M -10 380 Q 90 360, 180 395 T 380 380" />
              <path d="M -10 392 Q 90 372, 180 407 T 380 392" />
              <path d="M -10 404 Q 90 384, 180 419 T 380 404" />
            </g>
            <text
              x="320" y="375" fill="hsl(var(--wuhan-deep))"
              fontSize="9" opacity="0.55" letterSpacing="3"
              transform="rotate(-8 320 375)"
            >长 江</text>

            {/* —— 顶部小字标题 —— */}
            <g>
              <text x="32" y="42" fill="hsl(var(--ink-deep))" fontSize="14" fontWeight="900" letterSpacing="3">
                ✦ 武汉夜食地图 ✦
              </text>
              <text x="32" y="58" fill="hsl(var(--ink-deep))" fontSize="9" opacity="0.55" letterSpacing="2">
                EAST LAKE → DOWNTOWN · 6 STOPS
              </text>
            </g>

            {/* —— 右上邮戳 —— */}
            <g transform="translate(305, 50) rotate(-14)">
              <circle r="28" fill="none" stroke="hsl(var(--stamp-red))" strokeWidth="2" opacity="0.85" />
              <circle r="22" fill="none" stroke="hsl(var(--stamp-red))" strokeWidth="0.8" opacity="0.7" strokeDasharray="2 3" />
              <text textAnchor="middle" y="-4" fontSize="8" fontWeight="900" fill="hsl(var(--stamp-red))" letterSpacing="2">WUHAN</text>
              <text textAnchor="middle" y="6" fontSize="7" fill="hsl(var(--stamp-red))" letterSpacing="1">★ 樱花季 ★</text>
              <text textAnchor="middle" y="15" fontSize="6" fill="hsl(var(--stamp-red))" opacity="0.8">2026·SPRING</text>
            </g>

            {/* —— 4 角图钉 —— */}
            {[
              { x: 22, y: 22 }, { x: 338, y: 22 },
              { x: 22, y: 678 }, { x: 338, y: 678 },
            ].map((p, i) => (
              <g key={`pin-${i}`}>
                <circle cx={p.x} cy={p.y} r="5" fill="hsl(var(--sakura-pink))" />
                <circle cx={p.x - 1.2} cy={p.y - 1.2} r="1.6" fill="hsl(var(--sakura-glow))" />
              </g>
            ))}

            {/* —— 蜿蜒虚线轨迹（脚印感） —— */}
            <path
              d={buildTrail()}
              fill="none"
              stroke="hsl(var(--ink-deep))"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="1 7"
              opacity="0.55"
              filter="url(#inkBleed)"
            />
            {/* 路径下方一条更淡的实线伴影 */}
            <path
              d={buildTrail()}
              fill="none"
              stroke="hsl(var(--sakura-pink))"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.18"
            />

            {/* —— 起点：东湖樱花园 —— */}
            <g transform={`translate(${START.x}, ${START.y})`}>
              {/* 樱花树 */}
              <g transform="translate(28, -28)">
                <rect x="-1.2" y="14" width="2.4" height="16" fill="hsl(var(--ink-deep))" opacity="0.7" />
                <circle cx="-7" cy="10" r="8" fill="hsl(var(--sakura-glow))" opacity="0.85" />
                <circle cx="7" cy="10" r="8" fill="hsl(var(--sakura-pink))" opacity="0.85" />
                <circle cx="0" cy="2" r="9" fill="hsl(var(--sakura-glow))" opacity="0.95" />
                <circle cx="-3" cy="14" r="6" fill="hsl(var(--sakura-pink))" opacity="0.75" />
                <circle cx="5" cy="16" r="5" fill="hsl(var(--sakura-glow))" opacity="0.7" />
                <circle cx="-9" cy="18" r="4" fill="hsl(var(--sakura-pink))" opacity="0.6" />
              </g>
              {/* 五角星起点 */}
              <circle r="13" fill="hsl(var(--paper-warm))" stroke="hsl(var(--stamp-red))" strokeWidth="1.5" />
              <path
                d="M 0 -8 L 2.4 -2.5 L 8 -2.5 L 3.5 1 L 5.2 6.5 L 0 3.2 L -5.2 6.5 L -3.5 1 L -8 -2.5 L -2.4 -2.5 Z"
                fill="hsl(var(--stamp-red))"
              />
              {/* 起点标签（左侧） */}
              <g transform="translate(-18, 0)">
                <text x="0" y="-2" textAnchor="end" fontSize="11" fontWeight="900" fill="hsl(var(--ink-deep))">
                  东湖樱花园
                </text>
                <text x="0" y="10" textAnchor="end" fontSize="8.5" fill="hsl(var(--stamp-red))" letterSpacing="1.5">
                  START · 起点
                </text>
              </g>
            </g>

            {/* —— 6 个美食站点 —— */}
            {SPOTS.map((s, i) => {
              const isLeftLabel = s.side === "left";
              const labelX = isLeftLabel ? s.x - 22 : s.x + 22;
              const anchor = isLeftLabel ? "end" : "start";
              return (
                <g key={s.area}>
                  {/* 距离胶囊（节点上方一点） */}
                  <g transform={`translate(${s.x}, ${s.y - 24})`}>
                    <rect x="-22" y="-7" width="44" height="13" rx="6.5"
                      fill="hsl(var(--ink-deep))" opacity="0.78" />
                    <text textAnchor="middle" y="2.5" fontSize="8.5" fill="hsl(var(--sakura-glow))" letterSpacing="1">
                      {s.distance}
                    </text>
                  </g>

                  {/* emoji 圆 + 编号 */}
                  <circle cx={s.x} cy={s.y} r="18" fill="url(#emojiGlow)" />
                  <circle cx={s.x} cy={s.y} r="14" fill="hsl(var(--paper-warm))" stroke="hsl(var(--ink-deep))" strokeWidth="1.2" />
                  <text x={s.x} y={s.y + 5.5} textAnchor="middle" fontSize="16">{s.emoji}</text>
                  {/* 编号小章 */}
                  <g transform={`translate(${s.x + (isLeftLabel ? 13 : -13)}, ${s.y - 13})`}>
                    <circle r="7" fill="hsl(var(--stamp-red))" />
                    <text textAnchor="middle" y="3" fontSize="9" fontWeight="900" fill="hsl(var(--paper-warm))">
                      {i + 1}
                    </text>
                  </g>

                  {/* 文字标签 */}
                  <g>
                    <text x={labelX} y={s.y - 4} textAnchor={anchor} fontSize="10" fill="hsl(var(--stamp-red))" letterSpacing="1">
                      {s.area}
                    </text>
                    <text x={labelX} y={s.y + 9} textAnchor={anchor} fontSize="11.5" fontWeight="900" fill="hsl(var(--ink-deep))">
                      {s.shop}
                    </text>
                    <text x={labelX} y={s.y + 21} textAnchor={anchor} fontSize="9" fill="hsl(var(--ink-deep))" opacity="0.65">
                      {s.dish}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* —— 终点小红旗（最后一个站旁） —— */}
            <g transform={`translate(${SPOTS[5].x + 22}, ${SPOTS[5].y - 24})`}>
              <rect x="0" y="0" width="0.8" height="22" fill="hsl(var(--ink-deep))" />
              <path d="M 0.8 0 L 14 4 L 0.8 9 Z" fill="hsl(var(--stamp-red))" />
            </g>

            {/* —— 黄鹤楼剪影（地图中段右侧空地） —— */}
            <g transform="translate(310, 295)" opacity="0.85">
              {/* 五层飞檐塔 */}
              <g fill="hsl(var(--ink-deep))">
                {/* 塔基 */}
                <rect x="-22" y="60" width="44" height="6" />
                {/* 五层 — 由下到上逐渐缩小，每层屋顶外撇 */}
                <path d="M-20 60 L-24 54 L24 54 L20 60 Z" />
                <rect x="-15" y="44" width="30" height="10" />
                <path d="M-17 44 L-21 38 L21 38 L17 44 Z" />
                <rect x="-12" y="30" width="24" height="8" />
                <path d="M-14 30 L-18 24 L18 24 L14 30 Z" />
                <rect x="-9" y="17" width="18" height="7" />
                <path d="M-11 17 L-15 11 L15 11 L11 17 Z" />
                <rect x="-7" y="6" width="14" height="5" />
                <path d="M-9 6 L-12 1 L12 1 L9 6 Z" />
                {/* 顶尖宝瓶 */}
                <rect x="-1" y="-8" width="2" height="9" />
                <circle cx="0" cy="-10" r="2.5" />
              </g>
              {/* 红柱点缀 */}
              <rect x="-1" y="44" width="2" height="10" fill="hsl(var(--stamp-red))" opacity="0.85" />
              <rect x="-1" y="30" width="2" height="8" fill="hsl(var(--stamp-red))" opacity="0.85" />
              <text x="0" y="78" textAnchor="middle" fontSize="7.5" fill="hsl(var(--ink-deep))" letterSpacing="1.5" opacity="0.85">
                黄鹤楼
              </text>
            </g>

            {/* —— 长江大桥剪影（江上方左侧） —— */}
            <g transform="translate(48, 415)" opacity="0.85">
              {/* 上层路面 */}
              <path d="M-30 0 L40 0" stroke="hsl(var(--ink-deep))" strokeWidth="1.4" />
              {/* 下层（双层桥） */}
              <path d="M-30 6 L40 6" stroke="hsl(var(--ink-deep))" strokeWidth="1" />
              {/* 三跨拱 */}
              <path d="M-30 0 Q-15 -10 0 0 Q15 -10 30 0 Q42 -8 50 0"
                fill="none" stroke="hsl(var(--ink-deep))" strokeWidth="1.2" />
              {/* 桥墩 */}
              {[-30, -10, 12, 32].map((x, i) => (
                <rect key={i} x={x - 1} y="6" width="2" height="14" fill="hsl(var(--ink-deep))" />
              ))}
              {/* 倒影 */}
              <path d="M-30 22 Q-15 28 0 22 Q15 28 30 22 Q42 26 50 22"
                fill="none" stroke="hsl(var(--wuhan-deep))" strokeWidth="0.6" opacity="0.4" strokeDasharray="2 2" />
              <text x="5" y="36" textAnchor="middle" fontSize="7" fill="hsl(var(--ink-deep))" letterSpacing="1.5" opacity="0.85">
                长江大桥
              </text>
            </g>

            {/* —— 散落小贴纸 —— */}
            <text x="32" y="240" fontSize="13" opacity="0.7">🏮</text>
            <text x="335" y="180" fontSize="12" opacity="0.7">🌙</text>
            <text x="40" y="640" fontSize="12" opacity="0.7">🥢</text>
            <text x="330" y="650" fontSize="12" opacity="0.7">☕</text>
            <text x="325" y="555" fontSize="11" opacity="0.7">🍵</text>

            {/* —— 底部提示条 —— */}
            <g transform="translate(180, 670)">
              <text textAnchor="middle" fontSize="8" fill="hsl(var(--ink-deep))" opacity="0.6" letterSpacing="3">
                · 沿途任选 · 也可全打卡 ·
              </text>
            </g>
          </svg>
        </div>
      </section>

      {/* 分页 + 操作 */}
      <section className="relative z-20 px-5 pb-3">
        <div className="mb-2 flex items-center justify-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === 3 ? "w-5 bg-primary" : "w-1.5 bg-primary/35"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button className="flex-1 rounded-full glass px-4 py-2.5 text-sm font-medium text-primary">
            不感兴趣
          </button>
          <button className="flex-[1.4] rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glass)]">
            查看详情
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] text-primary/70">
          <ChevronUp className="h-3 w-3" />
          上滑继续看视频
        </div>
      </section>

      {/* 底部 Tab */}
      <nav className="relative z-20 flex items-center justify-around border-t border-primary/15 bg-wuhan-night/40 px-2 py-2 backdrop-blur-md">
        <TabItem icon={<Home className="h-5 w-5" />} label="首页" />
        <TabItem icon={<Users className="h-5 w-5" />} label="朋友" />
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-primary">
          <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
        </button>
        <TabItem icon={<MessageCircle className="h-5 w-5" />} label="消息" />
        <TabItem icon={<User className="h-5 w-5" />} label="我" />
      </nav>
    </div>
  );
};

const TabItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-0.5 text-primary/85">
    {icon}
    <span className="text-[10px]">{label}</span>
  </div>
);

export default WuhanFoodCard;
