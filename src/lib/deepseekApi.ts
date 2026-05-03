import { ThemeId } from "@/types/theme";

// 腾讯云云函数地址 - 部署后在腾讯云控制台获取
// 本地开发环境使用相对路径走 Vite 代理
// 生产环境使用云函数 HTTPS 地址
const DEEPSEEK_API_URL = import.meta.env.VITE_API_URL || "/api/deepseek";

async function fetchDeepseekApi(body: unknown): Promise<DeepSeekResponse> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }

  return await response.json() as DeepSeekResponse;
}

export interface FilterParams {
  brightness: string;
  contrast: string;
  saturation: string;
  temperature: string;
  highlight: string;
  shadow: string;
  grain: string;
  filter: string;
}

export interface ThemeCopywriting {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
}

export interface BuildingStoryResponse {
  title: string;
  subtitle: string;
  paragraphs: string[];
  highlights: string[];
  fromFallback?: boolean;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * 调用DeepSeek API生成滤镜参数
 * @param themeId 主题ID
 * @param themeName 主题名称（如"武汉樱花"、"大理洱海"等）
 * @param userDescription 用户自然语言描述
 * @param imageContext 图片上下文信息（可选）
 */
export async function generateFilterParams(
  themeId: ThemeId,
  themeName: string,
  userDescription: string,
  imageContext?: string
): Promise<FilterParams> {
  const prompt = `你是一位专业的摄影后期调色师，擅长使用醒图APP进行照片调色。

【主题信息】
- 主题ID: ${themeId}
- 主题名称: ${themeName}
${imageContext ? `- 图片场景: ${imageContext}` : ""}

【用户需求】
${userDescription}

请根据主题特点和用户需求，生成8个醒图滤镜参数。参数范围参考：
- 亮度(brightness): -100 到 100，建议范围 -20 到 30
- 对比度(contrast): -100 到 100，建议范围 -10 到 40
- 饱和度(saturation): -100 到 100，建议范围 -20 到 50
- 色温(temperature): -100 到 100，负值偏蓝，正值偏黄
- 高光(highlight): -100 到 100，建议范围 -30 到 20
- 阴影(shadow): -100 到 100，建议范围 -20 到 40
- 颗粒(grain): 0 到 100，建议范围 0 到 30
- 滤镜(filter): 推荐一个具体的醒图滤镜名称（如"原生"、"奶夏"、"花椿"等）

请以JSON格式返回，不要包含任何其他文字：
{
  "brightness": "值",
  "contrast": "值",
  "saturation": "值",
  "temperature": "值",
  "highlight": "值",
  "shadow": "值",
  "grain": "值",
  "filter": "滤镜名称"
}`;

  try {
    console.log("[DeepSeek API] 发送请求到", DEEPSEEK_API_URL);
    const data = await fetchDeepseekApi({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一个专业的摄影后期调色助手，专门帮助用户生成醒图APP的滤镜参数。请严格按照JSON格式返回结果。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = data.choices[0]?.message?.content || "";
    
    // 提取JSON内容
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法解析API返回的JSON数据");
    }

    const params: FilterParams = JSON.parse(jsonMatch[0]);
    return params;
  } catch (error) {
    console.error("生成滤镜参数失败:", error);
    // 返回默认参数
    return getDefaultFilterParams(themeId);
  }
}

/**
 * 调用DeepSeek API生成主题文案
 * @param themeId 主题ID
 * @param themeName 主题名称
 * @param sceneDescription 场景描述
 * @param style 文案风格（如"浪漫"、"治愈"、"复古"等）
 */
export async function generateThemeCopywriting(
  themeId: ThemeId,
  themeName: string,
  sceneDescription: string,
  style?: string
): Promise<ThemeCopywriting> {
  const prompt = `你是一位资深的社交媒体文案策划师，擅长为旅行打卡地撰写吸引人的文案。

【主题信息】
- 主题ID: ${themeId}
- 主题名称: ${themeName}
- 场景描述: ${sceneDescription}
${style ? `- 文案风格: ${style}` : ""}

请为${themeName}生成以下内容：
1. 标题（title）: 15字以内，吸引人点击的标题
2. 副标题（subtitle）: 20字以内，补充说明
3. 描述文案（description）: 50-80字，富有感染力的场景描述
4. 标签（tags）: 5-8个相关标签，带#号

请以JSON格式返回，不要包含任何其他文字：
{
  "title": "标题",
  "subtitle": "副标题",
  "description": "描述文案",
  "tags": ["#标签1", "#标签2", ...]
}`;

  try {
    const data = await fetchDeepseekApi({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一个专业的社交媒体文案策划师，擅长撰写旅行打卡文案。请严格按照JSON格式返回结果。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const content = data.choices[0]?.message?.content || "";
    
    // 提取JSON内容
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法解析API返回的JSON数据");
    }

    const copywriting: ThemeCopywriting = JSON.parse(jsonMatch[0]);
    return copywriting;
  } catch (error) {
    console.error("生成主题文案失败:", error);
    // 返回默认文案
    return getDefaultCopywriting(themeId, themeName);
  }
}

/**
 * 批量生成所有主题的文案
 */
export async function generateAllThemeCopywritings(
  themes: { id: ThemeId; name: string; description: string }[]
): Promise<Record<ThemeId, ThemeCopywriting>> {
  const results: Record<ThemeId, ThemeCopywriting> = {} as Record<ThemeId, ThemeCopywriting>;
  
  // 串行调用，避免并发限制
  for (const theme of themes) {
    try {
      results[theme.id] = await generateThemeCopywriting(
        theme.id,
        theme.name,
        theme.description
      );
      // 添加延迟，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`生成主题${theme.id}文案失败:`, error);
      results[theme.id] = getDefaultCopywriting(theme.id, theme.name);
    }
  }
  
  return results;
}

// 默认滤镜参数
function getDefaultFilterParams(themeId: ThemeId): FilterParams {
  const defaults: Record<ThemeId, FilterParams> = {
    "001": { brightness: "10", contrast: "15", saturation: "20", temperature: "-5", highlight: "-10", shadow: "15", grain: "5", filter: "夜樱" },
    "002": { brightness: "5", contrast: "10", saturation: "25", temperature: "10", highlight: "-5", shadow: "20", grain: "0", filter: "奶夏" },
    "003": { brightness: "-5", contrast: "20", saturation: "-10", temperature: "-15", highlight: "-20", shadow: "30", grain: "15", filter: "古都" },
    "004": { brightness: "15", contrast: "5", saturation: "30", temperature: "5", highlight: "10", shadow: "10", grain: "0", filter: "北野" },
    "005": { brightness: "20", contrast: "10", saturation: "5", temperature: "-20", highlight: "15", shadow: "25", grain: "10", filter: "雪境" },
    "006": { brightness: "-10", contrast: "25", saturation: "40", temperature: "25", highlight: "-30", shadow: "40", grain: "20", filter: "繁花" },
  };
  return defaults[themeId] || { brightness: "0", contrast: "0", saturation: "0", temperature: "0", highlight: "0", shadow: "0", grain: "0", filter: "原生" };
}

// 默认文案
function getDefaultCopywriting(themeId: ThemeId, themeName: string): ThemeCopywriting {
  const defaults: Record<ThemeId, ThemeCopywriting> = {
    "001": {
      title: "樱花树下，浪漫满分",
      subtitle: "武汉东湖的夜樱，美得像一场梦",
      description: "当夜幕降临，樱花在灯光下绽放出梦幻般的色彩。站在树下，仿佛置身于《当你沉睡时》的浪漫场景中，每一帧都是壁纸。",
      tags: ["#武汉樱花", "#夜樱", "#浪漫打卡", "#东湖", "#春日限定", "#拍照圣地"],
    },
    "002": {
      title: "去有风的地方",
      subtitle: "大理洱海，治愈心灵的蓝",
      description: "洱海的风，苍山的云，这里的每一刻都像电影画面。在夕阳下漫步，感受那份慵懒与自由，让心灵得到真正的放松。",
      tags: ["#大理洱海", "#去有风的地方", "#治愈系", "#云南旅行", "#日落", "#慢生活"],
    },
    "003": {
      title: "穿越千年，满江红",
      subtitle: "太原古县城，感受历史的厚重",
      description: "青砖黛瓦，深巷高墙，每一步都踏在历史的痕迹上。这里是《满江红》的拍摄地，也是你穿越时空的起点。",
      tags: ["#太原古县城", "#满江红", "#古建筑", "#历史穿越", "#山西旅行", "#古风"],
    },
    "004": {
      title: "我的阿勒泰",
      subtitle: "辽阔山野，自由如风",
      description: "雪山、草原、湖泊，这里的风景纯净得让人心醉。站在旷野中，感受大自然的辽阔与温柔，找回内心深处的宁静。",
      tags: ["#阿勒泰", "#新疆旅行", "#雪山", "#旷野", "#自然风光", "#自由之旅"],
    },
    "005": {
      title: "长白山初雪",
      subtitle: "雪落长白，静谧悠然",
      description: "清晨的长白山，被白雪覆盖成童话世界。雾气缭绕中，仿佛进入了《嘘，国王在冬眠》的梦幻场景，美得让人屏息。",
      tags: ["#长白山", "#雪景", "#冬季旅行", "#吉林", "#雪山", "#童话世界"],
    },
    "006": {
      title: "繁花上海",
      subtitle: "霓虹初上，沪上旧梦",
      description: "外滩的夜色，黄河路的灯火，这里有着《繁花》里的光影与旧梦。在这座城市的繁华中，寻找属于你的故事。",
      tags: ["#上海", "#外滩", "#繁花", "#夜景", "#复古", "#城市漫步"],
    },
  };
  return defaults[themeId] || {
    title: `${themeName}打卡`,
    subtitle: "发现不一样的美",
    description: "这里有着独特的风景和故事，等待你来探索和记录。",
    tags: ["#旅行", "#打卡", "#风景", "#摄影"],
  };
}

// 8种情感风格定义
export const EMOTION_STYLES = [
  { key: "positive", label: "积极治愈系", description: "温暖、正能量、治愈心灵" },
  { key: "sad", label: "伤感遗憾系", description: "略带忧伤、遗憾美、深情" },
  { key: "realistic", label: "清醒现实系", description: "真实、直白、生活感悟" },
  { key: "inspirational", label: "励志热血系", description: "激励、奋斗、热血沸腾" },
  { key: "literary", label: "小众文艺系", description: "文艺、诗意、独特视角" },
  { key: "relaxed", label: "佛系松弛系", description: "随性、淡然、不争不抢" },
  { key: "funny", label: "沙雕搞笑系", description: "幽默、搞笑、轻松愉快" },
  { key: "romantic", label: "暗恋温柔暧昧系", description: "温柔、暧昧、浪漫情愫" },
] as const;

export type EmotionStyle = typeof EMOTION_STYLES[number];

/**
 * 生成8种情感风格的文案
 * @param themeId 主题ID
 * @param themeName 主题名称
 * @param sceneDescription 场景描述（时段、天气、氛围、目的地）
 */
export async function generateEmotionCopywritings(
  themeId: ThemeId,
  themeName: string,
  sceneDescription: string
): Promise<Record<string, string>> {
  const prompt = `你是一位资深的抖音文案创作者，擅长根据主题和场景创作不同情感风格的短文案。

【主题信息】
- 主题名称: ${themeName}
- 场景描述: ${sceneDescription}

请为${themeName}创作8条不同情感风格的文案，每条文案15-30字，要求：
1. 结合主题特点（如樱花主题要提到樱花、阿勒泰要提到草原/雪山等）
2. 符合对应的情感风格
3. 适合抖音图文视频使用
4. 参考近期抖音热门文案风格

8种情感风格：
1. 积极治愈系 - 温暖正能量，治愈心灵
2. 伤感遗憾系 - 略带忧伤，遗憾美，深情
3. 清醒现实系 - 真实直白，生活感悟
4. 励志热血系 - 激励奋斗，热血沸腾
5. 小众文艺系 - 文艺诗意，独特视角
6. 佛系松弛系 - 随性淡然，不争不抢
7. 沙雕搞笑系 - 幽默搞笑，轻松愉快
8. 暗恋温柔暧昧系 - 温柔暧昧，浪漫情愫

请以JSON格式返回，key为风格key（positive/sad/realistic/inspirational/literary/relaxed/funny/romantic），value为对应文案：
{
  "positive": "文案内容",
  "sad": "文案内容",
  "realistic": "文案内容",
  "inspirational": "文案内容",
  "literary": "文案内容",
  "relaxed": "文案内容",
  "funny": "文案内容",
  "romantic": "文案内容"
}`;

  try {
    const data = await fetchDeepseekApi({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是抖音热门文案创作者，擅长创作各种情感风格的短文案。请严格按照JSON格式返回8条文案。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
      max_tokens: 1000,
    });

    const content = data.choices[0]?.message?.content || "";
    
    // 提取JSON内容
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法解析API返回的JSON数据");
    }

    const copywritings: Record<string, string> = JSON.parse(jsonMatch[0]);
    return copywritings;
  } catch (error) {
    console.error("生成情感文案失败:", error);
    // 返回默认文案
    return getDefaultEmotionCopywritings(themeId, themeName);
  }
}

export async function generateBundBuildingStory(input: {
  buildingName: string;
  year: string;
  style: string;
  architect: string;
  fact: string;
  feature: string;
}): Promise<BuildingStoryResponse> {
  const prompt = `你是一位擅长城市建筑史叙事的中文讲述者，请为上海外滩建筑生成一段适合卡片详情页展示的历史故事。

【建筑信息】
- 建筑名称: ${input.buildingName}
- 建成年份: ${input.year}
- 建筑风格: ${input.style}
- 设计/营造信息: ${input.architect}
- 核心事实: ${input.fact}
- 建筑特征: ${input.feature}

输出要求：
1. 聚焦真实历史氛围与城市记忆，语言有画面感，但不要虚构离谱情节；
2. 返回1个标题、1个副标题、3段正文；
3. 每段正文控制在45-90字；
4. 额外给出3个高亮标签短语；
5. 严格返回JSON，不要附加解释。

JSON格式：
{
  "title": "故事标题",
  "subtitle": "副标题",
  "paragraphs": ["第一段", "第二段", "第三段"],
  "highlights": ["标签1", "标签2", "标签3"]
}`;

  try {
    const data = await fetchDeepseekApi({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是建筑历史故事写作者。请严格按照JSON格式返回建筑故事内容。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
      max_tokens: 900,
    });

    const content = data.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法解析API返回的JSON数据");
    }

    const story = JSON.parse(jsonMatch[0]) as BuildingStoryResponse;
    if (!story.title || !story.subtitle || !Array.isArray(story.paragraphs) || !Array.isArray(story.highlights)) {
      throw new Error("建筑故事返回结构不完整");
    }

    return {
      title: story.title,
      subtitle: story.subtitle,
      paragraphs: story.paragraphs.slice(0, 3),
      highlights: story.highlights.slice(0, 3),
    };
  } catch (error) {
    console.error("生成建筑故事失败:", error);
    return {
      ...getDefaultBundBuildingStory(input),
      fromFallback: true,
    };
  }
}

// 默认8种情感风格文案
function getDefaultEmotionCopywritings(themeId: ThemeId, themeName: string): Record<string, string> {
  const defaults: Record<ThemeId, Record<string, string>> = {
    "001": {
      positive: "樱花树下站谁都美，我的爱给谁都热烈",
      sad: "樱花飘落的速度是秒速五厘米，我们渐行渐远",
      realistic: "来看樱花了，人比花多，但花确实好看",
      inspirational: "像樱花一样，在最美的时刻绽放自己",
      literary: "夜樱微雨，浪漫的不是花，是此刻的心情",
      relaxed: "随便拍拍，樱花嘛，看看就好",
      funny: "樱花：你们人类真奇怪，拍我就算了还发朋友圈",
      romantic: "想和你一起看樱花，从花开到花落",
    },
    "002": {
      positive: "洱海的风吹走了所有烦恼，只剩下自由",
      sad: "洱海那么大，却装不下我一个人的思念",
      realistic: "洱海很美，紫外线也很强，记得涂防晒",
      inspirational: "去有风的地方，找到属于自己的方向",
      literary: "苍山下，洱海旁，风里有诗的味道",
      relaxed: "躺平在洱海边，今天什么都不想",
      funny: "洱海：又来一个发呆的，我这儿是发呆圣地吗",
      romantic: "想和你一起在洱海看日落，从黄昏到夜幕",
    },
    "003": {
      positive: "古县城的每一块砖都在诉说着历史的美好",
      sad: "千年古县城，见证了多少人来人往",
      realistic: "古县城拍照很出片，就是人有点多",
      inspirational: "站在历史里，感受时间的力量",
      literary: "青砖黛瓦，深巷高墙，时光在这里慢下来",
      relaxed: "古城嘛，慢慢逛，不急",
      funny: "满江红拍摄地打卡，我也来当一回主角",
      romantic: "想和你穿越千年，在这古县城相遇",
    },
    "004": {
      positive: "阿勒泰的风里有自由的味道，心都变宽了",
      sad: "阿勒泰那么大，却没有一个角落属于我",
      realistic: "阿勒泰很美，但路途遥远，值得一来",
      inspirational: "去阿勒泰，寻找内心深处的宁静",
      literary: "雪山、草原、湖泊，这里是大地的诗篇",
      relaxed: "在阿勒泰，时间是用来浪费的",
      funny: "阿勒泰的牛羊：这些人类真奇怪，看我们吃草",
      romantic: "想和你一起在阿勒泰的草原上数星星",
    },
    "005": {
      positive: "长白山的雪净化了所有，包括心情",
      sad: "雪落无声，就像那些没说出口的话",
      realistic: "长白山很冷，但雪景确实值得",
      inspirational: "像长白山一样，保持内心的纯净",
      literary: "雪落长白，世界变成了一幅水墨画",
      relaxed: "看雪嘛，静静看就好",
      funny: "长白山：你们南方人来就是为了看雪？",
      romantic: "想和你一起看长白山的初雪，一不小心白了头",
    },
    "006": {
      positive: "外滩的夜色里，藏着上海的温柔",
      sad: "外滩的灯火再亮，也照不亮心里的角落",
      realistic: "外滩人很多，但夜景确实不错",
      inspirational: "在繁华中寻找自己的位置",
      literary: "霓虹初上，黄浦江畔，上海的故事刚刚开始",
      relaxed: "外滩走走，吹吹江风，挺好",
      funny: "外滩：每天晚上这么多人看我，我都不好意思了",
      romantic: "想和你一起在外滩看夜景，从繁华到宁静",
    },
  };
  
  return defaults[themeId] || {
    positive: `${themeName}很美，心情很好`,
    sad: `${themeName}很大，却装不下思念`,
    realistic: `${themeName}打卡，人很多`,
    inspirational: `在${themeName}找到方向`,
    literary: `${themeName}的风景像一首诗`,
    relaxed: `在${themeName}慢慢逛`,
    funny: `${themeName}：又来一个拍照的`,
    romantic: `想和你一起在${themeName}`,
  };
}

function getDefaultBundBuildingStory(input: {
  buildingName: string;
  year: string;
  style: string;
  architect: string;
  fact: string;
  feature: string;
}): BuildingStoryResponse {
  return {
    title: `${input.buildingName}的百年回声`,
    subtitle: `${input.year}年的城市封面，至今仍在讲述外滩的节奏`,
    paragraphs: [
      `${input.buildingName}在${input.year}年前后进入外滩视野，它所承载的不只是办公或商业功能，更是那个年代上海城市气质的一次正面亮相。`,
      `从${input.style}的外观语汇到${input.feature}的细节表达，这座建筑把时代审美和建造技术一并写进了立面，也让来往的人一眼记住它。`,
      `关于它，最容易被反复提起的是“${input.fact}”。而${input.architect}留下的痕迹，也让这栋楼至今仍像一枚能被读懂的城市坐标。`,
    ],
    highlights: [input.style, input.fact, input.feature],
  };
}

export interface AltayRouteInfoResponse {
  destination: string;
  distanceFromAirport: string;
  driveTimeFromAirport: string;
  roadConditions: string[];
  scenicFeatures: string[];
  travelTips: string[];
  bestSeason: string;
  fromFallback?: boolean;
}

/**
 * 调用DeepSeek API生成阿勒泰路线详情信息
 */
export async function generateAltayRouteInfo(
  nodeName: string,
  nodeIcon: string,
  elevationM: number,
  lat: number,
  lng: number,
  summary: string,
): Promise<AltayRouteInfoResponse> {
  const prompt = `你是一位资深的新疆阿勒泰自驾旅行顾问，请为从阿勒泰机场前往"${nodeName}"的路线生成详细的旅行信息。

【目的地信息】
- 目的地: ${nodeName}
- 地点类型: ${nodeIcon}
- 海拔: ${elevationM}米
- 坐标: ${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E
- 简介: ${summary}

请生成以下内容：
1. 从阿勒泰机场到该地点的总距离和驾车时长（请根据新疆实际路况合理估算）
2. 沿途路况详情（3-4条，包括道路等级、路面状况、注意事项等）
3. 该景点的特色介绍（3-4条，突出该地点的自然景观和文化特色）
4. 旅行建议（3-4条，包括装备、时间、安全等实用建议）
5. 最佳旅行季节

请以JSON格式返回，不要包含任何其他文字：
{
  "distanceFromAirport": "约XXX公里",
  "driveTimeFromAirport": "约X小时X分钟",
  "roadConditions": ["路况1", "路况2", "路况3"],
  "scenicFeatures": ["特色1", "特色2", "特色3"],
  "travelTips": ["建议1", "建议2", "建议3"],
  "bestSeason": "最佳季节描述"
}`;

  try {
    const data = await fetchDeepseekApi({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是新疆阿勒泰自驾旅行专家，擅长提供详细的路线规划和景点介绍。请严格按照JSON格式返回结果。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 900,
    });

    const content = data.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法解析API返回的JSON数据");
    }

    const info = JSON.parse(jsonMatch[0]) as AltayRouteInfoResponse;
    return {
      destination: nodeName,
      distanceFromAirport: info.distanceFromAirport || "约300公里",
      driveTimeFromAirport: info.driveTimeFromAirport || "约4小时",
      roadConditions: Array.isArray(info.roadConditions) ? info.roadConditions.slice(0, 4) : ["国道为主，路况良好"],
      scenicFeatures: Array.isArray(info.scenicFeatures) ? info.scenicFeatures.slice(0, 4) : ["自然风光优美"],
      travelTips: Array.isArray(info.travelTips) ? info.travelTips.slice(0, 4) : ["注意防寒保暖"],
      bestSeason: info.bestSeason || "6-9月",
    };
  } catch (error) {
    console.error("生成阿勒泰路线信息失败:", error);
    return {
      ...getDefaultAltayRouteInfo(nodeName, elevationM),
      fromFallback: true,
    };
  }
}

function getDefaultAltayRouteInfo(nodeName: string, elevationM: number): AltayRouteInfoResponse {
  return {
    destination: nodeName,
    distanceFromAirport: "约300公里",
    driveTimeFromAirport: "约4-6小时",
    roadConditions: ["国道为主，部分路段为省道或乡道", "山区路段弯道较多，注意控制车速", "冬季部分路段可能结冰，需备防滑链"],
    scenicFeatures: ["新疆北疆自然风光核心区域", "高山湖泊与草原交替的壮美景观", "独特的哈萨克族和蒙古族文化体验"],
    travelTips: ["建议提前加满油，部分路段加油站间隔较远", "山区温差大，需携带保暖衣物", "夏季紫外线强，注意防晒", "部分区域手机信号较弱，建议提前下载离线地图"],
    bestSeason: "6-9月（夏季草原最盛，秋季色彩最丰富）",
  };
}

/**
 * 检查API是否可用
 */
export async function checkApiAvailability(): Promise<boolean> {
  try {
    await fetchDeepseekApi({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 5,
    });
    return true;
  } catch {
    return false;
  }
}
