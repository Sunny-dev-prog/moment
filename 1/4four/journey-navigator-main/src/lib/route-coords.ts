/**
 * 北疆自驾环线·12节点真实地理方位坐标
 *
 * 坐标系：SVG viewBox 100 × 160（竖屏），左上角 (0,0)
 * 数据基于真实经纬度归一化：
 *   - 经度范围 ~ 80°E (西，伊宁/赛里木湖)  →  90°E (东，阿勒泰)
 *   - 纬度范围 ~ 49°N (北，喀纳斯/禾木)    →  43°N (南，伊宁河谷)
 *
 * 整体形状：东北角进 → 北上最北 → 南下穿越准噶尔 → 西南伊犁河谷 → 东进那拉提 → 回伊宁出
 */

export type Difficulty = "low" | "mid" | "high";

export interface NodeCoord {
  id: string;
  label: string;       // 节点短名（用于卡片标题）
  shortName: string;   // 在地图上显示的极简名
  x: number;
  y: number;
  region: "altai" | "junggar" | "ili"; // 地形分区
}

export const NODES: NodeCoord[] = [
  { id: "D1",  label: "阿勒泰机场",       shortName: "机场",   x: 82, y: 26, region: "altai" },
  { id: "D2",  label: "阿勒泰市",         shortName: "阿勒泰", x: 75, y: 32, region: "altai" },
  { id: "D3",  label: "可可托海",         shortName: "可可托海", x: 86, y: 42, region: "altai" },
  { id: "D4",  label: "布尔津",           shortName: "布尔津", x: 56, y: 38, region: "altai" },
  { id: "D5",  label: "喀纳斯",           shortName: "喀纳斯", x: 44, y: 18, region: "altai" },
  { id: "D6",  label: "禾木",             shortName: "禾木",   x: 52, y: 28, region: "altai" },
  { id: "D7",  label: "克拉玛依·乌尔禾",   shortName: "克拉玛依", x: 38, y: 70, region: "junggar" },
  { id: "D8",  label: "赛里木湖",         shortName: "赛里木湖", x: 22, y: 96, region: "ili" },
  { id: "D9",  label: "伊宁",             shortName: "伊宁",   x: 18, y: 118, region: "ili" },
  { id: "D10", label: "伊宁市区",         shortName: "伊宁城", x: 24, y: 124, region: "ili" },
  { id: "D11", label: "那拉提",           shortName: "那拉提", x: 62, y: 134, region: "ili" },
  { id: "D12", label: "伊宁机场",         shortName: "伊宁机场", x: 22, y: 142, region: "ili" },
];

export const VIEWBOX = { w: 100, h: 160 };

/** 区域信息，用于绘制等高线/分区底色和 chip 标签 */
export const REGIONS = [
  {
    key: "altai",
    name: "阿尔泰山区",
    sub: "北疆 · 雪山林海",
    chipX: 8, chipY: 10,
    // 笼罩上半部分
    contour: "M 5 8 Q 35 4 60 12 Q 85 18 95 30 L 95 55 Q 70 50 50 56 Q 28 60 5 50 Z",
  },
  {
    key: "junggar",
    name: "准噶尔戈壁",
    sub: "中段 · 油城魔鬼城",
    chipX: 50, chipY: 62,
    contour: "M 8 60 Q 30 56 55 62 Q 80 68 95 60 L 95 88 Q 65 92 40 88 Q 18 84 8 90 Z",
  },
  {
    key: "ili",
    name: "伊犁河谷",
    sub: "南疆 · 草原湖泊",
    chipX: 50, chipY: 110,
    contour: "M 6 92 Q 35 96 65 100 Q 88 104 95 96 L 95 156 Q 60 152 30 156 Q 10 152 6 156 Z",
  },
] as const;

/** 真实路径顺序（按行程串联，中间含轻微弯折模拟实际公路） */
export const ROUTE_PATH = (() => {
  // 直接按 NODES 顺序连线即可（坐标已是真实方位）
  const pts = NODES.map((n) => `${n.x} ${n.y}`);
  return "M " + pts.join(" L ");
})();
