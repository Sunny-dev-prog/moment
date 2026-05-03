/**
 * 解析任意颜色字符串到 {h,s,l}。支持 #RGB / #RRGGBB / hsl(h,s%,l%) / 颜色名（部分）。
 * 通过临时 DOM 让浏览器代为解析，再转 HSL。
 */
export function parseColorToHsl(input: string): { h: number; s: number; l: number } | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (typeof document === "undefined") return null;
  const probe = document.createElement("div");
  probe.style.color = trimmed;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const m = computed.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
  const [r, g, b] = parts;
  return rgbToHsl(r, g, b);
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function parseColorToRgb(input: string): { r: number; g: number; b: number } | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (typeof document === "undefined") return null;
  const probe = document.createElement("div");
  probe.style.color = trimmed;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const match = computed.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].split(",").map((value) => parseFloat(value.trim()));
  const [r, g, b] = parts;
  if (!isValidRgb(r, g, b)) return null;
  return { r, g, b };
}

function formatHslColor(hsl: { h: number; s: number; l: number }) {
  return `hsl(${hsl.h.toFixed(0)} ${hsl.s.toFixed(0)}% ${hsl.l.toFixed(0)}%)`;
}

function relativeLuminance(color: string): number | null {
  const rgb = parseColorToRgb(color);
  if (!rgb) return null;
  const convert = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const r = convert(rgb.r);
  const g = convert(rgb.g);
  const b = convert(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(background: string, foreground: string): number | null {
  const bg = relativeLuminance(background);
  const fg = relativeLuminance(foreground);
  if (bg === null || fg === null) return null;
  const lighter = Math.max(bg, fg);
  const darker = Math.min(bg, fg);
  return (lighter + 0.05) / (darker + 0.05);
}

function brightenTitleColor(bgColor: string, color: string, amount = 18): string {
  const hsl = parseColorToHsl(color);
  if (!hsl) return color;
  const nextLightness = isLightBackground(bgColor)
    ? Math.min(46, hsl.l + amount)
    : Math.min(92, hsl.l + amount);
  return formatHslColor({ ...hsl, l: nextLightness });
}

function ensureTitleContrast(bgColor: string, color: string, minContrast = 4.5): string {
  const background = normalizeBgColorString(bgColor)[0] ?? bgColor;
  const initialRatio = contrastRatio(background, color);
  if (initialRatio !== null && initialRatio >= minContrast) {
    return color;
  }

  const hsl = parseColorToHsl(color);
  if (!hsl) return color;

  const lightBackground = isLightBackground(bgColor);
  let next = { ...hsl };

  for (let index = 0; index < 24; index += 1) {
    next = {
      ...next,
      l: lightBackground ? Math.max(12, next.l - 2) : Math.min(96, next.l + 2),
    };
    const candidate = formatHslColor(next);
    const ratio = contrastRatio(background, candidate);
    if (ratio !== null && ratio >= minContrast) {
      return candidate;
    }
  }

  return formatHslColor(next);
}

function normalizeBgColorString(bgColor: string): string[] {
  return bgColor
    .split(/[;；]/)
    .map((c) => c.trim())
    .filter(Boolean);
}

function normalizeBgColorKey(bgColor: string): string {
  return (normalizeBgColorString(bgColor)[0] ?? bgColor ?? "").trim().toLowerCase();
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function quantizeColor(r: number, g: number, b: number): string {
  const qr = Math.round(r / 16) * 16;
  const qg = Math.round(g / 16) * 16;
  const qb = Math.round(b / 16) * 16;
  return rgbToHex(qr, qg, qb);
}

function lightnessShift(color: string, shift: number): string {
  const hsl = parseColorToHsl(color);
  if (!hsl) return color;
  const l = Math.min(96, Math.max(6, hsl.l + shift));
  return `hsl(${hsl.h.toFixed(0)} ${hsl.s.toFixed(0)}% ${l.toFixed(0)}%)`;
}

function isValidRgb(r: number, g: number, b: number) {
  return [r, g, b].every((value) => Number.isFinite(value) && value >= 0 && value <= 255);
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    image.src = url;
  });
}

async function extractPaletteFromImage(url: string, sampleSize = 24, top = 5): Promise<string[]> {
  try {
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const context = canvas.getContext("2d");
    if (!context) return [];
    context.drawImage(image, 0, 0, sampleSize, sampleSize);
    const imageData = context.getImageData(0, 0, sampleSize, sampleSize).data;
    const counts = new Map<string, number>();

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const a = imageData[i + 3];
      if (a < 64) continue;
      if (!isValidRgb(r, g, b)) continue;
      const color = quantizeColor(r, g, b);
      counts.set(color, (counts.get(color) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([color]) => color)
      .slice(0, top);
  } catch {
    return [];
  }
}

export async function getThemeBgColorFromScreenshotUrls(urls: string[]): Promise<string> {
  const colors = new Map<string, number>();
  for (const url of urls) {
    if (!url) continue;
    const imageUrl = url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".webp") ? url : `${url}.jpg`;
    const palette = await extractPaletteFromImage(imageUrl);
    for (const color of palette) {
      colors.set(color, (colors.get(color) ?? 0) + 1);
    }
  }

  const sorted = Array.from(colors.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  if (sorted.length === 0) {
    return "";
  }

  const finalColors = sorted.slice(0, 3);
  while (finalColors.length < 3) {
    finalColors.push(lightnessShift(finalColors[0], finalColors.length === 1 ? 24 : -18));
  }

  return finalColors.join(";");
}

/** 冷色判定：色相在 ~170~290 之间视为冷色 */
export function isCoolColor(hsl: { h: number; s: number; l: number } | null): boolean {
  if (!hsl) return false;
  return hsl.h >= 170 && hsl.h <= 290;
}

/**
 * 根据背景色给 C1（第二行标题）生成渐变色：
 * - 冷色背景 → 比背景"暗"几个色号的渐变
 * - 暖色背景 → 比背景"亮"几个色号的渐变
 * 没有背景色（白底）→ 给一个柔和的灰渐变
 */
export function getC1Gradient(bgColor: string): string {
  const firstColor = normalizeBgColorString(bgColor)[0] ?? bgColor;
  const hsl = parseColorToHsl(firstColor);
  if (!hsl) {
    return "linear-gradient(135deg, hsl(220 10% 35%), hsl(220 10% 55%))";
  }
  const cool = isCoolColor(hsl);
  const delta = 22;
  const l1 = cool ? Math.max(8, hsl.l - delta) : Math.min(94, hsl.l + delta);
  const l2 = cool ? Math.max(4, hsl.l - delta * 1.6) : Math.min(98, hsl.l + delta * 1.6);
  const s = Math.min(95, Math.max(40, hsl.s + 10));
  return `linear-gradient(135deg, hsl(${hsl.h.toFixed(0)} ${s.toFixed(0)}% ${l1.toFixed(0)}%), hsl(${hsl.h.toFixed(0)} ${s.toFixed(0)}% ${l2.toFixed(0)}%))`;
}

export function getThemeAccent(bgColor: string): string {
  const firstColor = normalizeBgColorString(bgColor)[0] ?? bgColor;
  const hsl = parseColorToHsl(firstColor);
  if (!hsl) {
    return "#f59e0b";
  }
  const light = isLightBackground(bgColor);
  const saturation = Math.min(95, Math.max(45, hsl.s + 12));
  const lightness = light ? Math.max(18, hsl.l - 30) : Math.min(88, hsl.l + 18);
  return `hsl(${hsl.h.toFixed(0)} ${saturation.toFixed(0)}% ${lightness.toFixed(0)}%)`;
}

export const CARD4_TITLE_FONT_SIZE = "25px";

export const THEME1_TITLE_COLOR_CANDIDATES = [
  "#a78697",
  "#b08f9f",
  "#b99aa9",
  "#c2a3b2",
  "#cbacbb",
  "#e4ccda",
] as const;

export const CARD_TITLE_COLOR_BY_BG: Record<string, string> = {
  "#4a1a4a": "#e4ccda",
  "#96aeb1": "#567883",
  "#96704f": "#e6c59c",
  "#879b84": "#d6e4cf",
  "#22314c": "#d9cde1",
  "#d6ecf5": "#557083",
  "#2f211e": "#f0d1ab",
  "#f7efe1": "#506878",
};

export function getThemeTitleColor(bgColor: string): string {
  const key = normalizeBgColorKey(bgColor);
  if (CARD_TITLE_COLOR_BY_BG[key]) {
    return ensureTitleContrast(bgColor, brightenTitleColor(bgColor, CARD_TITLE_COLOR_BY_BG[key]));
  }

  const firstColor = normalizeBgColorString(bgColor)[0] ?? bgColor;
  const hsl = parseColorToHsl(firstColor);
  if (!hsl) {
    return "#9a7b8b";
  }

  if (isLightBackground(bgColor)) {
    const saturation = Math.min(42, Math.max(16, hsl.s * 0.55));
    const lightness = Math.max(24, hsl.l - 28);
    return ensureTitleContrast(
      bgColor,
      brightenTitleColor(
        bgColor,
        `hsl(${hsl.h.toFixed(0)} ${saturation.toFixed(0)}% ${lightness.toFixed(0)}%)`,
        14,
      ),
    );
  }

  const saturation = Math.min(46, Math.max(18, hsl.s * 0.42));
  const lightness = Math.min(88, hsl.l + 38);
  return ensureTitleContrast(
    bgColor,
    brightenTitleColor(bgColor, `hsl(${hsl.h.toFixed(0)} ${saturation.toFixed(0)}% ${lightness.toFixed(0)}%)`, 18),
  );
}

export function getThemeTitleVars(bgColor: string): Record<string, string> {
  return {
    "--card4-title-font-size": CARD4_TITLE_FONT_SIZE,
    "--card4-title-color": getThemeTitleColor(bgColor),
  };
}

/** 当背景为浅色时，文字应该用深色；否则用白色 */
export function isLightBackground(bgColor: string): boolean {
  if (!bgColor) return true; // 没有背景 = 白底
  const firstColor = normalizeBgColorString(bgColor)[0] ?? bgColor;
  const hsl = parseColorToHsl(firstColor);
  if (!hsl) return true;
  return hsl.l > 65;
}

/**
 * 解析bgColor字符串（三个颜色用分号分隔），创建渐变背景
 * 格式："#color1;#color2;#color3" → 从上到下的渐变
 */
export function parseBgColorGradient(bgColor: string): string {
  const colors = normalizeBgColorString(bgColor);
  if (colors.length === 0) {
    return "#ffffff";
  }
  if (colors.length === 1) {
    return colors[0];
  }
  if (colors.length === 2) {
    return `linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
  }

  const [topColor, midColor, bottomColor] = colors;

  // 用主渐变叠加两层柔和光斑，让背景更像海报而不是普通色条。
  return [
    `radial-gradient(circle at 20% 18%, color-mix(in srgb, ${topColor} 72%, white 28%) 0%, transparent 42%)`,
    `radial-gradient(circle at 82% 78%, color-mix(in srgb, ${bottomColor} 78%, black 22%) 0%, transparent 46%)`,
    `linear-gradient(165deg, ${topColor} 0%, ${midColor} 54%, ${bottomColor} 100%)`,
  ].join(", ");
}
