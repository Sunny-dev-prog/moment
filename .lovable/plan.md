## 总览

- 卡片1 / 卡片2 顶栏目前**已经没有时间和电量行**，直接是 `三横 + 团购 + 经验 + A1/A2 + 关注 + 商城 + 推荐 + 搜索`。本次无需删除任何"状态栏"。
- 卡片3 沿用前两张的 9:19.5 PhoneFrame、毛玻璃、浅/深背景自适应文字色、4 段指示器（第 3 段加粗）、底部 Tab 栏。
- 当前预览背景仍是纯白；接入 `AT1` 后会自动套用渐变并触发文字色反转 / 渐变方向反转，与卡片 1 保持同一逻辑。

## 一、数据模型与 Excel 解析

`src/types/theme.ts` 在 `ThemeData` 末尾新增卡片3 字段，并写入 `PLACEHOLDER`：

```
c3_navTag        // A3
c3_emotions: { tag: string; text: string }[]   // 8 条，前缀 ...系来自固定枚举，文本来自 B3-I3
c3_authors: { name: string; avatar: string; audio: string }[]  // 8 条
   // name  → J3 K3 L3 M3 N3 O3 P3 Q3   （AI: 之前你描述「J3-Q3 头像」，但下面又说"用户名"——按你最新一段「头像 J3-Q3」执行；用户名将复用 ...系 列表对应的标签前缀，如有歧义在实现后告诉我，我马上改）
   // avatar→ 同上 J3-Q3
   // audio → AL3 AM3 AN3 AO3 AP3 AQ3 AR3 AS3
```

> ⚠️ 关于 J3-Q3：你的话术里同时出现"八个头像对应 J3-Q3"和"用户名是数据集传入"。我会**先把 J3-Q3 当头像图片 URL** 解析；用户名暂时复用八个情感标签做占位，等你确认用户名到底放在哪几个单元格再切换。

固定的 8 种情感标签（顺序固定，匹配 B3-I3）：
`积极治愈系 / 伤感遗憾系 / 清醒现实系 / 励志热血系 / 小众文艺系 / 佛系松弛系 / 沙雕搞笑系 / 暗恋温柔暧昧系`

`src/lib/excelLoader.ts` 的 `CELL_MAP` 追加上述映射。

## 二、CardThree 组件结构（`src/components/CardThree.tsx`）

PhoneFrame 内自上而下：

1. **顶栏**：和 CardTwo 完全一致，A3 替换 navTag。
2. **主标题（3 行）**：
   - "文案和Bgm"
   - "是抖音图文视频中"  → 其中 **"抖音图文视频"** 用 `getC1Gradient(bgColor)` 渐变
   - "不可或缺的核心要素" → 其中 **"不可或缺"** 用同一渐变
   - 浅背景=同色加深、深背景=同色变亮，复用 `colorUtils.ts` 已有逻辑（已天然支持）。
3. **滚动卡片 A — 8 条情感文案**：
   - 圆角矩形玻璃卡，内部固定可视高度 ≈ 5 行（每行约 28px）。
   - 内容垂直无缝循环（默认向上匀速，约 30s 一轮，可调）。
   - 实现方式：把 8 条复制成 16 条，外层 `overflow-hidden`，内层用 `@keyframes` `translateY(0 → -50%)`，CSS 动画，无 JS 计时。
   - 每行格式：`<标签 ...系>` 字号小、用主题色（取自 `bgColor` 的色相饱和度衍生，见下）；空格 + 文案，文案 `truncate-1` 单行省略；整行控制为 1 行，超出按 ... 截断。
4. **滚动卡片 B — 原声小块（2×4）**：
   - 比卡片 A 略宽（左右内边距 -2）。
   - 上行 4 块向左滚（`translateX(0 → -50%)`），下行 4 块向右滚（`translateX(-50% → 0)`），瞬时各自最多展示 3 块（容器宽度 ≈ 3 × blockWidth + 2 × gap，超出 hidden）。
   - 上下两行 8 块尺寸完全一致：圆角矩形（约 116×96），上方头像方形连续圆角，中间叠一个米白色播放圆按钮；点击切 ▶/⏸（与卡片2 视频条一致），如 audio URL 存在则真播 `<audio>`。
   - 每块下方两行：`...系`（小字、主题色） + `头像@xxx 创作的原声`（大一号、主色），用户名 `truncate-1`。
5. **底部文字（2 行 × 大字号）**：
   - "接下来，以主题视角"
   - "解锁城市之旅！" → "**主题视角**" 用同样的渐变规则。
6. **指示器 4 段**：第 3 段加粗。
7. **Tab 栏**：与卡片 1/2 一致。

> 滚动卡片 A + B 的总高度约占手机屏幕 2/3（用 flex `flex-1` + `min-h-0` 让上下文字与指示器优先占位，剩余空间均分给两个滚动卡）。

## 三、主题色（标签 ...系 的颜色）

从 `bgColor` 抽出 hsl，主题色 = `hsl(h, max(60,s+5)%, lightBg ? 35% : 80%)`，保证在浅/深背景上都对比清晰。`colorUtils.ts` 增加一个 `getThemeAccent(bgColor)` 辅助函数。

## 四、导航与入口

- `src/pages/Theme.tsx`: `TOTAL_CARDS = 3`，渲染 `cardIndex === 2 && <CardThree data={data} />`，右上角索引文案改 `卡片 X / 4`（保持 4，因为后续还会出第 4 张）。
- `src/pages/Index.tsx`: 在每个主题下追加 "卡片 3" 入口按钮（`?card=3`）。

## 五、滚动动画

写在 `src/index.css`：

```
@keyframes scroll-up { from { transform: translateY(0) } to { transform: translateY(-50%) } }
@keyframes scroll-left { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes scroll-right { from { transform: translateX(-50%) } to { transform: translateX(0) } }
.anim-scroll-up    { animation: scroll-up    28s linear infinite; }
.anim-scroll-left  { animation: scroll-left  22s linear infinite; }
.anim-scroll-right { animation: scroll-right 22s linear infinite; }
```

均匀慢速，不做停顿（如想分段停顿告诉我，改 cubic-bezier + 多关键帧即可）。

## 六、默认决策（如需调整请告诉我）

| 项 | 默认 |
|---|---|
| 文案滚动方向 | 向上匀速，循环 |
| 原声播放 | 有 URL 就 `<audio>` 真播，否则只切图标 |
| Index 入口 | 加"卡片 3"按钮 |
| Excel 字段 | 一次性接入 A3 / B3-I3 / J3-Q3 / AL3-AS3 |
| J3-Q3 含义 | 暂按"头像 URL"解析，用户名暂用 ...系 标签占位（待你确认） |

## 七、文件清单

- ✏️ `src/types/theme.ts`：扩 `ThemeData` + `PLACEHOLDER`
- ✏️ `src/lib/excelLoader.ts`：扩 `CELL_MAP`
- ✏️ `src/lib/colorUtils.ts`：新增 `getThemeAccent`
- ✏️ `src/index.css`：新增 3 个滚动 keyframes
- 🆕 `src/components/CardThree.tsx`
- ✏️ `src/pages/Theme.tsx`：`TOTAL_CARDS=3`、渲染 CardThree
- ✏️ `src/pages/Index.tsx`：增加卡片3 入口按钮

完成后你就能在 `/theme/001?card=3` 直接看到卡片3，纯白背景下文字、渐变、滚动全部跑起来；后端把 AT1 / B3-I3 / J3-Q3 / AL3-AS3 填上之后无需改代码，直接刷新生效。