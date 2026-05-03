import { ThemeData, ThemeId, emptyThemeData, PLACEHOLDER } from "@/types/theme";
import { getThemeBgColorFromScreenshotUrls } from "@/lib/colorUtils";
import { getPublicAssetUrl } from "@/lib/publicAsset";

const SHEET_IDS: ThemeId[] = ["001", "002", "003", "004", "005", "006"];

const PRESET_THEME_BG_COLORS: Partial<Record<ThemeId, string>> = {
  "001": "#4a1a4a;#2d1b4e;#1a1a2e",
  "002": "#96aeb1;#5f777b;#c8aa97",
  "003": "#96704f;#614735;#211814",
  "004": "#879b84;#566a59;#233129",
  "006": "#22314c;#46365c;#8a5d66",
};

interface RawCardOneData {
  "1"?: string;
  "2"?: string;
  "3"?: string;
  "4"?: string;
  "5"?: string;
  "6"?: string;
  "7"?: string;
  "8"?: string;
  "9"?: string;
  "10"?: string;
  "11"?: string;
  "11_1"?: string;
  "12"?: string;
  "13"?: string;
  "sort1"?: string;
  "sort2"?: string;
}

interface RawCardTwoData {
  "1"?: string;
  "2"?: string;
  "3"?: string;
  "4"?: string;
  "5"?: string;
  "6"?: string;
  "7"?: string;
  "8"?: string;
  "9"?: string;
  "10"?: string;
  "sort1"?: string;
  "sort2"?: string;
  "sort3"?: string;
  "sort4"?: string;
}

type RawThemeData = [RawCardOneData, RawCardTwoData, ...RawCardOneData[]];

function resolveMediaPath(path: string, themeId: ThemeId, defaultExtension = ".jpg"): string {
  if (!path) return "";
  let normalized = String(path).trim().replace(/\\/g, "/");
  normalized = normalized.replace(/^\.\//, "").replace(/^\.\.\//, "");
  normalized = normalized.replace(/^\.total\//, "total/");
  normalized = normalized.replace(/\/+/g, "/");

  const addExtensionIfMissing = (value: string) => {
    if (value.match(/\.(jpg|jpeg|png|webp|mp4)$/i)) {
      return value;
    }
    if (value.endsWith("/")) {
      return value;
    }
    return `${value}${defaultExtension}`;
  };

  if (normalized.match(/^total\/chapter-\d+\//i)) {
    normalized = getPublicAssetUrl(normalized);
  }

  if (normalized.startsWith("http") || normalized.startsWith("/")) {
    if (normalized.startsWith("http")) {
      return addExtensionIfMissing(normalized);
    }
    return addExtensionIfMissing(getPublicAssetUrl(normalized));
  }

  return addExtensionIfMissing(getPublicAssetUrl(`/total/chapter-${themeId}/${normalized}`));
}

function mapCardOne(raw: RawCardOneData, themeId: ThemeId): Partial<ThemeData> {
  return {
    navTag: raw["1"]?.trim() || "",
    title1: raw["2"]?.trim() || "",
    title2: raw["3"]?.trim() || "",
    title3: raw["4"]?.trim() || "",
    destination: raw["5"]?.trim() || "",
    timeOfDay: raw["6"]?.trim() || "",
    weather: raw["7"]?.trim() || "",
    mood: raw["8"]?.trim() || "",
    infoLine: raw["9"]?.trim() || "",
    sceneLabel: raw["10"]?.trim() || "",
    sceneLine1: raw["11"]?.trim() || "",
    sceneLine2: [raw["11_1"], raw["12"], raw["13"]].filter(Boolean).join(""),
    photo1: resolveMediaPath(raw["sort1"] || "", themeId, ".jpg"),
    photo2: resolveMediaPath(raw["sort2"] || "", themeId, ".jpg"),
  };
}

function mapCardTwo(raw: RawCardTwoData, themeId: ThemeId): Partial<ThemeData> {
  return {
    c2_navTag: raw["1"]?.trim() || "",
    c2_video1Title: raw["2"]?.trim() || "",
    c2_video1Desc: raw["3"]?.trim() || "",
    c2_video2Title: raw["4"]?.trim() || "",
    c2_video2Desc: raw["5"]?.trim() || "",
    c2_paramIntro1: raw["6"]?.trim() || "",
    c2_paramIntro2: raw["7"]?.trim() || "",
    c2_xingtuLine1: raw["8"]?.trim() || "",
    c2_xingtuLine2: raw["9"]?.trim() || "",
    c2_footerLine: raw["10"]?.trim() || "",
    c2_video1Url: resolveMediaPath(raw["sort1"] || "", themeId, ".mp4"),
    c2_video2Url: resolveMediaPath(raw["sort2"] || "", themeId, ".mp4"),
    c2_video1Cover: resolveMediaPath(raw["sort3"] || "", themeId, ".jpg"),
    c2_video2Cover: resolveMediaPath(raw["sort4"] || "", themeId, ".jpg"),
    // 醒图图标使用固定路径
    c2_xingtuIcon: getPublicAssetUrl("/zt1xt/1.jpg"),
  };
}

interface RawCardThreeData {
  "1"?: string;
  "2"?: string;
  "3"?: string;
  "4"?: string;
  "5"?: string;
  "6"?: string;
  "7"?: string;
  "8"?: string;
  "9"?: string;
  "sort1"?: string;
  "sort2"?: string;
  "sort3"?: string;
  "sort4"?: string;
  "sort5"?: string;
  "sort6"?: string;
  "sort7"?: string;
  "sort8"?: string;
}

function mapCardThree(raw: RawCardThreeData, themeId: ThemeId): Partial<ThemeData> {
  return {
    c3_navTag: raw["1"]?.trim() || "",
    c3_emo1: raw["2"]?.trim() || "",
    c3_emo2: raw["3"]?.trim() || "",
    c3_emo3: raw["4"]?.trim() || "",
    c3_emo4: raw["5"]?.trim() || "",
    c3_emo5: raw["6"]?.trim() || "",
    c3_emo6: raw["7"]?.trim() || "",
    c3_emo7: raw["8"]?.trim() || "",
    c3_emo8: raw["9"]?.trim() || "",
    c3_avatar1: resolveMediaPath(raw["sort1"] || "", themeId, ".jpg"),
    c3_avatar2: resolveMediaPath(raw["sort2"] || "", themeId, ".jpg"),
    c3_avatar3: resolveMediaPath(raw["sort3"] || "", themeId, ".jpg"),
    c3_avatar4: resolveMediaPath(raw["sort4"] || "", themeId, ".jpg"),
    c3_avatar5: resolveMediaPath(raw["sort5"] || "", themeId, ".jpg"),
    c3_avatar6: resolveMediaPath(raw["sort6"] || "", themeId, ".jpg"),
    c3_avatar7: resolveMediaPath(raw["sort7"] || "", themeId, ".jpg"),
    c3_avatar8: resolveMediaPath(raw["sort8"] || "", themeId, ".jpg"),
    c3_audio1: resolveMediaPath("", themeId, ".mp3"),
    c3_audio2: resolveMediaPath("", themeId, ".mp3"),
    c3_audio3: resolveMediaPath("", themeId, ".mp3"),
    c3_audio4: resolveMediaPath("", themeId, ".mp3"),
    c3_audio5: resolveMediaPath("", themeId, ".mp3"),
    c3_audio6: resolveMediaPath("", themeId, ".mp3"),
    c3_audio7: resolveMediaPath("", themeId, ".mp3"),
    c3_audio8: resolveMediaPath("", themeId, ".mp3"),
  };
}

function mergeWithPlaceholder(data: Partial<ThemeData>): ThemeData {
  const result = { ...PLACEHOLDER, ...data } as ThemeData;
  for (const key of Object.keys(PLACEHOLDER) as (keyof typeof PLACEHOLDER)[]) {
    if (!(result as any)[key]) {
      (result as any)[key] = (PLACEHOLDER as any)[key];
    }
  }
  return result;
}

function getPresetThemeBgColor(themeId: ThemeId): string {
  return PRESET_THEME_BG_COLORS[themeId] || "";
}

export interface DataSource {
  loadThemes(): Promise<Record<ThemeId, ThemeData>>;
}

class LocalJsonDataSource implements DataSource {
  async loadThemes(): Promise<Record<ThemeId, ThemeData>> {
    try {
      const response = await fetch(`${getPublicAssetUrl("/total/ABC.json")}?v=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Failed to load ABC.json: ${response.status}`);
      }
      const json = await response.json() as Record<ThemeId, RawThemeData>;

      const result = {} as Record<ThemeId, ThemeData>;

      for (const id of SHEET_IDS) {
        const rawItems = json[id];
        if (!Array.isArray(rawItems) || rawItems.length === 0) {
          result[id] = mergeWithPlaceholder({ id });
          continue;
        }

        const cardOneData = mapCardOne(rawItems[0] || {}, id);
        const cardTwoData = mapCardTwo(rawItems[1] || {}, id);
        const cardThreeData = mapCardThree(rawItems[2] || {}, id);

        const merged = mergeWithPlaceholder({
          id,
          ...cardOneData,
          ...cardTwoData,
          ...cardThreeData,
        });

        merged.bgColor = getPresetThemeBgColor(id);

        result[id] = merged;
      }

      await Promise.all(
        Object.values(result).map(async (themeData) => {
          if (themeData.bgColor) return;
          const screenshotUrls = [themeData.photo1, themeData.photo2].filter(Boolean);
          if (screenshotUrls.length === 0) return;
          const bgColor = await getThemeBgColorFromScreenshotUrls(screenshotUrls);
          if (bgColor) {
            themeData.bgColor = bgColor;
          }
        }),
      );

      return result;
    } catch (error) {
      console.error("Failed to load themes from ABC.json:", error);
      return SHEET_IDS.reduce((acc, id) => {
        acc[id] = mergeWithPlaceholder({ id });
        return acc;
      }, {} as Record<ThemeId, ThemeData>);
    }
  }
}

// ============================================
// 大模型API扩展位置 - LLM数据源接口
// ============================================
// interface LLMThemeData {
//   id: ThemeId;
//   content: string;
//   generatedAt: string;
// }

// class LLMApiDataSource implements DataSource {
//   private apiEndpoint: string;

//   constructor(apiEndpoint: string) {
//     this.apiEndpoint = apiEndpoint;
//   }

//   async loadThemes(): Promise<Record<ThemeId, ThemeData>> {
//     // TODO: 实现调用大模型API获取主题数据
//     // 1. 调用API获取原始数据
//     // 2. 解析LLM返回的JSON
//     // 3. 映射到ThemeData结构
//     // 4. 返回结果
//     throw new Error("Not implemented");
//   }
// }
// ============================================

let currentDataSource: DataSource = new LocalJsonDataSource();

export function setDataSource(source: DataSource): void {
  currentDataSource = source;
}

export async function loadThemes(): Promise<Record<ThemeId, ThemeData>> {
  return currentDataSource.loadThemes();
}

export function getLocalJsonDataSource(): DataSource {
  return new LocalJsonDataSource();
}
