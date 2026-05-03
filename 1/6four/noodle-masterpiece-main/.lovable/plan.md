## Card 4 · 上海外滩·万国建筑互动卡（替换山西面食版）

延续前 3 张卡的：
- 9:16 竖屏 / 顶部返回+导航+进度 pill / 主标题 + 副标 / 中央互动区 / 下半区辅助卡 / 底部双 CTA + tabbar + 4/4 进度点

主题切换为「上海外滩·万国建筑时间轴」，仍属"轻交互 + 快反馈 + 3 步内"。

---

### 视觉系统（与第一张外滩卡同色调）

- 底色：深炭黑 `#0E0F12` → 蓝黑 `#0B1220` 渐变（取代山西的暖红）
- 主点缀色：古董金 `#C8A24A` / 浅金 `#E6C77A`
- 次色：暖灰 `#A8A8A8`、夜雾蓝 `#1A2332`
- 卡面：玻璃拟态（暗底 60% blur + 1px 金色细边 15% 透明）
- 氛围层：
  - 顶部：外滩夜景剪影（建筑天际线，半透明）
  - 中部：金色细线 + 微光颗粒（替代山西的"蒸汽"）
  - 底部：江水反光渐变（极淡）

---

### 三步互动流程

**Step 1 · pickBuilding（默认）**
- 上半区：垂直时间轴（金色发光中线 + 6 个节点），节点左右交错排布
- 6 个节点 = 6 栋外滩建筑（每节点一个小圆 disc + 年份金色 pill + 楼名）：
  1. 1893 · 亚细亚大楼
  2. 1923 · 汇丰银行大楼
  3. 1925 · 上海总会
  4. 1927 · 江海关大楼
  5. 1929 · 和平饭店（沙逊大厦）
  6. 1937 · 中国银行大楼
- 中央上方一个 pulse pill：「✨ 选一栋建筑，听它讲百年故事」
- 下半区：「INFO · 建筑档案」玻璃卡常驻，disabled 状态，提示「点上方建筑解锁」

**Step 2 · viewDetail**
- 上半区切换为：选中建筑的 hero 大图（cinematic + 暗色渐变蒙层 + 金色细边相框），下方 3 行金线分隔的关键信息（年代 / 风格 / 设计师）
- 下半区档案卡激活：4 个小信息块（建筑年代 / 建筑风格 / 历史事件 / 建筑特点），文案约 1 行
- 中央 pill 改为「→ 点这里看下一站」（或时间轴点亮"下一栋"）

**Step 3 · done（看完最后一栋）**
- 上半区：外滩全景大图 + 走过的 6 个建筑名以金线串起（mini timeline 收尾）
- 下半区：单行结果标签「百年外滩 · 半部万国建筑史」+ 探索数 6/6
- 底部「不感兴趣」→「再看一遍」

实际上为简洁起见，**Step2 可被多次触发**（每点不同建筑刷新内容），右上角进度 pill 显示已解锁数 `n/6`，全部解锁后才进入 done。

---

### 删减/复用

- 不要任何"烟火 / 江湖 / 灵魂"等氛围长句，文案保持博物馆克制感
- 复用 `card4-root / card4-bg / card4-noise / card4-pill / card4-title / card4-fade / card4-pop / card4-rise / card4-pulse-dot` 类名（重写值，不动名字）
- 颜色变量从暖红/琥珀整体替换为深蓝黑/古董金
- 删除 `card4-steam`（蒸汽）、`card4-flicker`（炉火），不再需要

---

### 资产生成（12 张 PNG，透明底，一致 isometric 风）

放到 `src/assets/card4/` 下，**复用现有目录但用新文件名**避免冲突：
- `bund-skyline.png` — 顶部外滩天际线剪影（用作背景叠加）
- 6 张建筑等距图标（200×200 透明底，金色细线 + 暗色填充，一致风格）：
  - `bld-asia.png`, `bld-hsbc.png`, `bld-club.png`, `bld-custom.png`, `bld-peace.png`, `bld-boc.png`
- 6 张对应建筑摄影/绘画大图（420×420 透明底或带柔边，电影感夜景）：
  - `hero-asia.png`, `hero-hsbc.png`, `hero-club.png`, `hero-custom.png`, `hero-peace.png`, `hero-boc.png`
- `bund-panorama.png` — 终态外滩全景

旧的山西资产（dough、tool-*、noodle-*、sauce-*、final-bowl、stove）保留在磁盘但不再 import。

---

### 改动文件

- 重写 `src/components/cards/Card4Noodles.tsx`（保留文件名以减小 diff）
  - 新组件函数名 `Card4Bund`，导出仍为 default
  - 状态机：`pickBuilding` | `viewDetail` | `done`
  - 数据：`BUILDINGS: { id, year, name, style, architect, fact, iconImg, heroImg, side: 'L'|'R' }[]`
- 更新 `src/styles.css` 中 `/* ============ Card 4 ============ */` 段：换底色渐变、删 steam/flicker、新增 `card4-timeline-line`（金色发光中线）、`card4-node-pulse`（节点呼吸）、`card4-hero-frame`（金边相框）
- 更新 `src/routes/index.tsx`：title/desc 文案改为外滩主题，bg 色改 `#0B1220`

---

### 技术细节

```text
Card4Bund
├─ <header>  返回 / 顶导航(外滩·建筑·历史·收藏·推荐) / n/6
├─ <title>   一城外滩百年
│            <accent>半部万国建筑</accent>
├─ <stage h=320>
│   ├─ Step1: <Timeline>
│   │         金色中线 + 6 节点 (左右交错 BuildingNode)
│   │         点击 → setBuildingId, setStep('viewDetail')
│   ├─ Step2: <HeroFrame> 金边相框 + heroImg + 3 行细节
│   └─ Step3: <Panorama> 全景图 + 6 节点串联
├─ <infoCard>  「INFO · 建筑档案」常驻
│   Step1: disabled 灰；Step2: 4 个小信息块；Step3: 总结一句
├─ <CTA>      [再看一遍] [查看详情]
├─ <tabbar>   首页/朋友/+/消息/我
└─ <progress> 4/4 第四枚激活
```

交互速度：点节点 0.25s 高亮 → 0.35s 切换到 detail；解锁第 6 栋后自动 0.6s 跳 done。可重复点击不同节点反复看，已看过的节点节点描金。

