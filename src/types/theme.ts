export type ThemeId = "001" | "002" | "003" | "004" | "005" | "006";

export interface ThemeMeta {
  id: ThemeId;
  name: string; // 中文主题名（按钮显示）
  shortLabel: string; // 按钮短标签
}

export interface ThemeData {
  id: ThemeId;
  // 顶部导航
  navTag: string; // A1
  // 主标题三行
  title1: string; // B1
  title2: string; // C1 — 渐变色
  title3: string; // D1
  // 信息卡四列
  destination: string; // E1
  timeOfDay: string; // F1
  weather: string; // G1
  mood: string; // H1
  // 信息卡底部一行
  infoLine: string; // I1
  // 场景卡
  sceneLabel: string; // J1
  sceneLine1: string; // K1
  sceneLine2: string; // L1
  sceneLine3: string; // M1
  // 主题背景色（HEX 或 hsl(...) 字符串）；空表示未配置 → 用纯白
  bgColor: string; // AT1
  // 两张拍立得剧照地址；空 → 留白拍立得
  photo1: string; // AK1
  photo2: string; // AL1

  // ===== 卡片2 =====
  c2_navTag: string; // A2
  c2_video1Title: string; // B2
  c2_video1Desc: string; // C2 (单行省略)
  c2_video2Title: string; // D2
  c2_video2Desc: string; // E2 (单行省略)
  c2_paramIntro1: string; // F2
  c2_paramIntro2: string; // G2
  c2_xingtuLine1: string; // H2 (单行省略)
  c2_xingtuLine2: string; // I2 (单行省略)
  c2_footerLine: string; // J2 (单行省略)
  c2_brightness: string; // K2
  c2_contrast: string; // L2
  c2_saturation: string; // M2
  c2_temperature: string; // N2
  c2_highlight: string; // O2
  c2_shadow: string; // P2
  c2_grain: string; // Q2
  c2_filter: string; // R2
  c2_video1Url: string; // AK2
  c2_video2Url: string; // AL2
  c2_video1Cover: string; // 视频1封面图
  c2_video2Cover: string; // 视频2封面图
  c2_xingtuIcon: string; // AM2

  // ===== 卡片3 =====
  c3_navTag: string; // A3
  c3_emo1: string; // B3
  c3_emo2: string; // C3
  c3_emo3: string; // D3
  c3_emo4: string; // E3
  c3_emo5: string; // F3
  c3_emo6: string; // G3
  c3_emo7: string; // H3
  c3_emo8: string; // I3
  c3_avatar1: string; // J3
  c3_avatar2: string; // K3
  c3_avatar3: string; // L3
  c3_avatar4: string; // M3
  c3_avatar5: string; // N3
  c3_avatar6: string; // O3
  c3_avatar7: string; // P3
  c3_avatar8: string; // Q3
  c3_audio1: string; // AL3
  c3_audio2: string; // AM3
  c3_audio3: string; // AN3
  c3_audio4: string; // AO3
  c3_audio5: string; // AP3
  c3_audio6: string; // AQ3
  c3_audio7: string; // AR3
  c3_audio8: string; // AS3
}

export const THEMES: ThemeMeta[] = [
  { id: "001", name: "湖北武汉东湖樱花园", shortLabel: "东湖樱花" },
  { id: "002", name: "云南大理洱海", shortLabel: "大理洱海" },
  { id: "003", name: "山西太原古县城", shortLabel: "太原古县城" },
  { id: "004", name: "新疆阿勒泰风景名胜区", shortLabel: "阿勒泰" },
  { id: "005", name: "吉林长白山景区", shortLabel: "长白山" },
  { id: "006", name: "上海外滩", shortLabel: "上海外滩" },
];

/** 占位符常量（未接入数据时不显示，留空） */
export const PLACEHOLDER = {
  navTag: "",
  title1: "",
  title2: "",
  title3: "",
  destination: "",
  timeOfDay: "",
  weather: "",
  mood: "",
  infoLine: "",
  sceneLabel: "",
  sceneLine1: "",
  sceneLine2: "",
  sceneLine3: "",
  bgColor: "", // 空 → 卡片走纯白背景
  photo1: "",
  photo2: "",

  // 卡片2
  c2_navTag: "",
  c2_video1Title: "",
  c2_video1Desc: "",
  c2_video2Title: "",
  c2_video2Desc: "",
  c2_paramIntro1: "",
  c2_paramIntro2: "",
  c2_xingtuLine1: "",
  c2_xingtuLine2: "",
  c2_footerLine: "",
  c2_brightness: "+0",
  c2_contrast: "+0",
  c2_saturation: "+0",
  c2_temperature: "+0",
  c2_highlight: "+0",
  c2_shadow: "+0",
  c2_grain: "+0",
  c2_filter: "无",
  c2_video1Url: "",
  c2_video2Url: "",
  c2_video1Cover: "",
  c2_video2Cover: "",
  c2_xingtuIcon: "",

  // 卡片3
  c3_navTag: "",
  c3_emo1: "",
  c3_emo2: "",
  c3_emo3: "",
  c3_emo4: "",
  c3_emo5: "",
  c3_emo6: "",
  c3_emo7: "",
  c3_emo8: "",
  c3_avatar1: "",
  c3_avatar2: "",
  c3_avatar3: "",
  c3_avatar4: "",
  c3_avatar5: "",
  c3_avatar6: "",
  c3_avatar7: "",
  c3_avatar8: "",
  c3_audio1: "",
  c3_audio2: "",
  c3_audio3: "",
  c3_audio4: "",
  c3_audio5: "",
  c3_audio6: "",
  c3_audio7: "",
  c3_audio8: "",
};

export function emptyThemeData(id: ThemeId): ThemeData {
  return { id, ...PLACEHOLDER } as ThemeData;
}

export function hasThemeCardFour(id: ThemeId): boolean {
  return id === "001" || id === "002" || id === "003" || id === "004" || id === "005" || id === "006";
}

export function getThemeCardCount(id: ThemeId): number {
  return hasThemeCardFour(id) ? 4 : 3;
}
