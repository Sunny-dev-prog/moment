export type WuhanShowcaseLayout = "horizontal" | "diagonal";
export type WuhanPatternKind =
  | "solid-glow"
  | "center-beam"
  | "star-projection"
  | "green-wash"
  | "neon-ribbon"
  | "banded-stripes"
  | "crane-projection"
  | "molten-core";

export type WuhanShowcaseThemeId =
  | "warm-glow"
  | "flow-light"
  | "deep-blue"
  | "green-shadow"
  | "fantasy-color"
  | "motley"
  | "gold-ripple"
  | "molten-gold";

export type WuhanPhotoSourceSet = {
  webp2x?: string;
  webp3x?: string;
  jpeg2x?: string;
  jpeg3x?: string;
  fallbackSrc?: string;
  alt: string;
};

export type WuhanShowcaseTheme = {
  id: WuhanShowcaseThemeId;
  label: string;
  photo: WuhanPhotoSourceSet;
  electronic: {
    pattern: WuhanPatternKind;
    skyTop: string;
    skyBottom: string;
    base: string;
    highlight: string;
    beam: string;
    glow: string;
    particle: string;
    frame: string;
    hueRotate: number;
    saturate: number;
    contrast: number;
    brightness: number;
    sepia: number;
  };
};

export const WUHAN_CARD_SHELL = {
  background: "linear-gradient(180deg,#fae9f0 0%,#efd9e3 42%,#d8c7d7 100%)",
  title: "#53213b",
  buttonText: "#5d3147",
  buttonBorder: "rgba(93,49,71,0.16)",
  buttonBg: "rgba(255,255,255,0.58)",
  buttonActiveBg: "#5d3147",
  buttonActiveText: "#ffffff",
  focusRing: "rgba(210,81,139,0.42)",
} as const;

function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildPhotoPlaceholder(label: string, skyTop: string, skyBottom: string, tower: string, glow: string) {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skyTop}"/>
          <stop offset="100%" stop-color="${skyBottom}"/>
        </linearGradient>
        <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10"/>
        </filter>
      </defs>
      <rect width="900" height="600" fill="url(#sky)"/>
      <ellipse cx="450" cy="560" rx="200" ry="34" fill="rgba(0,0,0,0.28)"/>
      <g fill="${tower}" stroke="${glow}" stroke-width="6">
        <path d="M180 430 Q450 365 720 430 L690 454 Q450 432 210 454Z"/>
        <rect x="244" y="434" width="412" height="30" rx="10" fill="${tower}" stroke="none"/>
        <path d="M228 360 Q450 308 672 360 L644 383 Q450 363 256 383Z"/>
        <rect x="278" y="364" width="344" height="26" rx="10" fill="${tower}" stroke="none"/>
        <path d="M260 294 Q450 252 640 294 L616 316 Q450 298 284 316Z"/>
        <rect x="304" y="298" width="292" height="22" rx="10" fill="${tower}" stroke="none"/>
        <path d="M290 238 Q450 202 610 238 L590 258 Q450 244 310 258Z"/>
        <rect x="330" y="242" width="240" height="18" rx="9" fill="${tower}" stroke="none"/>
        <path d="M320 188 Q450 160 580 188 L565 206 Q450 194 335 206Z"/>
        <rect x="360" y="192" width="180" height="14" rx="7" fill="${tower}" stroke="none"/>
        <rect x="416" y="144" width="68" height="38" rx="10" fill="${tower}" stroke="none"/>
        <circle cx="450" cy="128" r="12" fill="${glow}" filter="url(#g)"/>
      </g>
      <rect x="380" y="174" width="140" height="36" rx="10" fill="rgba(7,20,45,0.55)"/>
      <text x="450" y="198" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#ffe8a0">${label}</text>
    </svg>
  `);
}

function createTheme(
  id: WuhanShowcaseThemeId,
  label: string,
  imageFile: string,
  electronic: WuhanShowcaseTheme["electronic"],
): WuhanShowcaseTheme {
  return {
    id,
    label,
    photo: {
      alt: `${label}主题下的黄鹤楼夜景`,
      jpeg2x: `/wuhan-zt1/${imageFile}`,
      jpeg3x: `/wuhan-zt1/${imageFile}`,
      fallbackSrc: buildPhotoPlaceholder("黄鹤楼", electronic.skyTop, electronic.skyBottom, electronic.base, electronic.glow),
    },
    electronic,
  };
}

export const WUHAN_SHOWCASE_THEMES: WuhanShowcaseTheme[] = [
  createTheme("warm-glow", "暖辉", "001.jpg", {
    pattern: "solid-glow",
    skyTop: "#10306d",
    skyBottom: "#071834",
    base: "#f59e0b",
    highlight: "#ffe07a",
    beam: "#ffc857",
    glow: "#ffd76a",
    particle: "#ffe4a3",
    frame: "#8d4c15",
    hueRotate: 0,
    saturate: 1.35,
    contrast: 1.1,
    brightness: 1.02,
    sepia: 0.12,
  }),
  createTheme("flow-light", "流光", "002.jpg", {
    pattern: "center-beam",
    skyTop: "#17367a",
    skyBottom: "#08152f",
    base: "#ff9d2e",
    highlight: "#fff0a3",
    beam: "#ffbe49",
    glow: "#ffd064",
    particle: "#ffe6aa",
    frame: "#9f5319",
    hueRotate: 0,
    saturate: 1.28,
    contrast: 1.08,
    brightness: 1.04,
    sepia: 0.22,
  }),
  createTheme("deep-blue", "幽蓝", "003.jpg", {
    pattern: "star-projection",
    skyTop: "#0c2d70",
    skyBottom: "#04122d",
    base: "#2b8dff",
    highlight: "#82f4ff",
    beam: "#47c7ff",
    glow: "#9fd4ff",
    particle: "#b4f0ff",
    frame: "#375c91",
    hueRotate: 18,
    saturate: 1.52,
    contrast: 1.14,
    brightness: 1.03,
    sepia: 0,
  }),
  createTheme("green-shadow", "翠影", "004.jpg", {
    pattern: "green-wash",
    skyTop: "#0d2a68",
    skyBottom: "#04132b",
    base: "#2fb95c",
    highlight: "#f6d96a",
    beam: "#86df5e",
    glow: "#d8f18a",
    particle: "#d8ff9c",
    frame: "#4b7a2c",
    hueRotate: 22,
    saturate: 1.48,
    contrast: 1.1,
    brightness: 1.01,
    sepia: 0.1,
  }),
  createTheme("fantasy-color", "幻彩", "005.jpg", {
    pattern: "neon-ribbon",
    skyTop: "#0a2563",
    skyBottom: "#030f27",
    base: "#23d9cf",
    highlight: "#ff69b7",
    beam: "#ffd65d",
    glow: "#f8c5ff",
    particle: "#8bfff2",
    frame: "#7d4f92",
    hueRotate: 8,
    saturate: 1.65,
    contrast: 1.12,
    brightness: 1.02,
    sepia: 0.02,
  }),
  createTheme("motley", "斑斓", "006.jpg", {
    pattern: "banded-stripes",
    skyTop: "#102760",
    skyBottom: "#030e24",
    base: "#f05f98",
    highlight: "#57d6ff",
    beam: "#ffd550",
    glow: "#ffb5d3",
    particle: "#8feaff",
    frame: "#854f81",
    hueRotate: 12,
    saturate: 1.58,
    contrast: 1.16,
    brightness: 1.02,
    sepia: 0.04,
  }),
  createTheme("gold-ripple", "金漾", "007.jpg", {
    pattern: "crane-projection",
    skyTop: "#122d69",
    skyBottom: "#07122d",
    base: "#e6b11b",
    highlight: "#fff2a3",
    beam: "#ffc740",
    glow: "#ffe289",
    particle: "#fff0b2",
    frame: "#8c6520",
    hueRotate: -4,
    saturate: 1.32,
    contrast: 1.1,
    brightness: 1.03,
    sepia: 0.18,
  }),
  createTheme("molten-gold", "鎏金", "008.jpg", {
    pattern: "molten-core",
    skyTop: "#14295c",
    skyBottom: "#050f25",
    base: "#ff9f1c",
    highlight: "#ffe89d",
    beam: "#ffcf58",
    glow: "#ffd978",
    particle: "#ffeab0",
    frame: "#9b5714",
    hueRotate: -2,
    saturate: 1.36,
    contrast: 1.12,
    brightness: 1.04,
    sepia: 0.26,
  }),
];
