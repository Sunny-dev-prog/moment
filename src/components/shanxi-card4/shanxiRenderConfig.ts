export type ShanxiSauceType = "rou" | "tomato" | "beef";
export type ShanxiNoodleShape = "daoxiao" | "tijian" | "lamian" | "ganmian" | "maoer" | "helao";

export type SauceProfile = {
  id: ShanxiSauceType;
  label: string;
  viscosity: number;
  density: number;
  gloss: number;
  saturation: number;
  palette: {
    base: string;
    shadow: string;
    highlight: string;
    oil: string;
  };
};

export type NoodleProfile = {
  id: ShanxiNoodleShape;
  label: string;
  absorbency: number;
  reflectance: number;
  textureStrength: number;
  strandDensity: number;
  attachmentBias: number;
};

export type MatchRule = {
  sauceType: ShanxiSauceType;
  noodleShape: ShanxiNoodleShape;
  attachmentArea: number;
  flowPath: number;
  spreadX: number;
  spreadY: number;
  pooling: number;
  glossBoost: number;
  contrastBoost: number;
};

export const SHANXI_SAUCE_PROFILES: Record<ShanxiSauceType, SauceProfile> = {
  rou: {
    id: "rou",
    label: "肉卤",
    viscosity: 0.82,
    density: 0.78,
    gloss: 0.36,
    saturation: 0.62,
    palette: {
      base: "#7b3e22",
      shadow: "#3c1b10",
      highlight: "#b86a42",
      oil: "#cf8c4c",
    },
  },
  tomato: {
    id: "tomato",
    label: "番茄鸡蛋",
    viscosity: 0.58,
    density: 0.46,
    gloss: 0.63,
    saturation: 0.88,
    palette: {
      base: "#cc3e28",
      shadow: "#7f1812",
      highlight: "#ff9f5d",
      oil: "#ffd066",
    },
  },
  beef: {
    id: "beef",
    label: "土豆牛肉",
    viscosity: 0.74,
    density: 0.84,
    gloss: 0.42,
    saturation: 0.54,
    palette: {
      base: "#6d3d28",
      shadow: "#342014",
      highlight: "#a56a49",
      oil: "#d49b52",
    },
  },
};

export const SHANXI_NOODLE_PROFILES: Record<ShanxiNoodleShape, NoodleProfile> = {
  daoxiao: { id: "daoxiao", label: "刀削面", absorbency: 0.66, reflectance: 0.42, textureStrength: 0.78, strandDensity: 0.54, attachmentBias: 0.74 },
  tijian: { id: "tijian", label: "剔尖", absorbency: 0.62, reflectance: 0.4, textureStrength: 0.72, strandDensity: 0.58, attachmentBias: 0.68 },
  lamian: { id: "lamian", label: "拉面", absorbency: 0.56, reflectance: 0.55, textureStrength: 0.46, strandDensity: 0.84, attachmentBias: 0.6 },
  ganmian: { id: "ganmian", label: "擀面", absorbency: 0.69, reflectance: 0.38, textureStrength: 0.8, strandDensity: 0.52, attachmentBias: 0.76 },
  maoer: { id: "maoer", label: "猫耳朵", absorbency: 0.73, reflectance: 0.34, textureStrength: 0.88, strandDensity: 0.44, attachmentBias: 0.82 },
  helao: { id: "helao", label: "河捞面", absorbency: 0.64, reflectance: 0.48, textureStrength: 0.69, strandDensity: 0.63, attachmentBias: 0.71 },
};

export const SHANXI_MATCH_RULES: Record<`${ShanxiSauceType}:${ShanxiNoodleShape}`, MatchRule> = {
  "rou:daoxiao": { sauceType: "rou", noodleShape: "daoxiao", attachmentArea: 0.78, flowPath: 0.46, spreadX: 0.74, spreadY: 0.48, pooling: 0.62, glossBoost: 0.08, contrastBoost: 0.16 },
  "rou:tijian": { sauceType: "rou", noodleShape: "tijian", attachmentArea: 0.73, flowPath: 0.51, spreadX: 0.71, spreadY: 0.53, pooling: 0.58, glossBoost: 0.09, contrastBoost: 0.15 },
  "rou:lamian": { sauceType: "rou", noodleShape: "lamian", attachmentArea: 0.61, flowPath: 0.68, spreadX: 0.62, spreadY: 0.66, pooling: 0.38, glossBoost: 0.11, contrastBoost: 0.12 },
  "rou:ganmian": { sauceType: "rou", noodleShape: "ganmian", attachmentArea: 0.8, flowPath: 0.44, spreadX: 0.76, spreadY: 0.46, pooling: 0.65, glossBoost: 0.07, contrastBoost: 0.18 },
  "rou:maoer": { sauceType: "rou", noodleShape: "maoer", attachmentArea: 0.84, flowPath: 0.33, spreadX: 0.58, spreadY: 0.42, pooling: 0.72, glossBoost: 0.05, contrastBoost: 0.2 },
  "rou:helao": { sauceType: "rou", noodleShape: "helao", attachmentArea: 0.76, flowPath: 0.47, spreadX: 0.68, spreadY: 0.52, pooling: 0.6, glossBoost: 0.08, contrastBoost: 0.17 },
  "tomato:daoxiao": { sauceType: "tomato", noodleShape: "daoxiao", attachmentArea: 0.66, flowPath: 0.61, spreadX: 0.7, spreadY: 0.63, pooling: 0.42, glossBoost: 0.18, contrastBoost: 0.1 },
  "tomato:tijian": { sauceType: "tomato", noodleShape: "tijian", attachmentArea: 0.63, flowPath: 0.66, spreadX: 0.68, spreadY: 0.65, pooling: 0.39, glossBoost: 0.19, contrastBoost: 0.09 },
  "tomato:lamian": { sauceType: "tomato", noodleShape: "lamian", attachmentArea: 0.55, flowPath: 0.8, spreadX: 0.58, spreadY: 0.74, pooling: 0.24, glossBoost: 0.22, contrastBoost: 0.07 },
  "tomato:ganmian": { sauceType: "tomato", noodleShape: "ganmian", attachmentArea: 0.69, flowPath: 0.58, spreadX: 0.73, spreadY: 0.59, pooling: 0.45, glossBoost: 0.17, contrastBoost: 0.11 },
  "tomato:maoer": { sauceType: "tomato", noodleShape: "maoer", attachmentArea: 0.71, flowPath: 0.48, spreadX: 0.54, spreadY: 0.47, pooling: 0.51, glossBoost: 0.15, contrastBoost: 0.12 },
  "tomato:helao": { sauceType: "tomato", noodleShape: "helao", attachmentArea: 0.68, flowPath: 0.57, spreadX: 0.65, spreadY: 0.61, pooling: 0.44, glossBoost: 0.18, contrastBoost: 0.1 },
  "beef:daoxiao": { sauceType: "beef", noodleShape: "daoxiao", attachmentArea: 0.74, flowPath: 0.49, spreadX: 0.72, spreadY: 0.5, pooling: 0.63, glossBoost: 0.1, contrastBoost: 0.14 },
  "beef:tijian": { sauceType: "beef", noodleShape: "tijian", attachmentArea: 0.7, flowPath: 0.54, spreadX: 0.69, spreadY: 0.56, pooling: 0.57, glossBoost: 0.11, contrastBoost: 0.13 },
  "beef:lamian": { sauceType: "beef", noodleShape: "lamian", attachmentArea: 0.58, flowPath: 0.73, spreadX: 0.61, spreadY: 0.69, pooling: 0.33, glossBoost: 0.14, contrastBoost: 0.1 },
  "beef:ganmian": { sauceType: "beef", noodleShape: "ganmian", attachmentArea: 0.77, flowPath: 0.45, spreadX: 0.74, spreadY: 0.48, pooling: 0.66, glossBoost: 0.09, contrastBoost: 0.16 },
  "beef:maoer": { sauceType: "beef", noodleShape: "maoer", attachmentArea: 0.82, flowPath: 0.36, spreadX: 0.57, spreadY: 0.44, pooling: 0.74, glossBoost: 0.07, contrastBoost: 0.18 },
  "beef:helao": { sauceType: "beef", noodleShape: "helao", attachmentArea: 0.73, flowPath: 0.5, spreadX: 0.66, spreadY: 0.54, pooling: 0.59, glossBoost: 0.1, contrastBoost: 0.15 },
};

type RenderInput = {
  sauceType: ShanxiSauceType;
  noodleShape: ShanxiNoodleShape;
  seedKey: string;
};

export type ShanxiRenderDescriptor = {
  sauce: SauceProfile;
  noodle: NoodleProfile;
  rule: MatchRule;
  variation: {
    spreadOffsetPct: number;
    saturationDeltaPct: number;
    rotationDeg: number;
    highlightSkew: number;
  };
  metrics: {
    attachmentRate: number;
    gamutSpread: number;
    highlightContrast: number;
  };
};

function hashSeed(seedKey: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seedKey.length; index += 1) {
    hash ^= seedKey.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomUnit(seedKey: string, salt: string): number {
  const hash = hashSeed(`${seedKey}:${salt}`);
  return (hash % 10_000) / 10_000;
}

function varyAround(base: number, pct: number, seedKey: string, salt: string) {
  const centered = randomUnit(seedKey, salt) * 2 - 1;
  return base * (1 + centered * pct);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getShanxiRenderDescriptor(input: RenderInput): ShanxiRenderDescriptor {
  const sauce = SHANXI_SAUCE_PROFILES[input.sauceType];
  const noodle = SHANXI_NOODLE_PROFILES[input.noodleShape];
  const rule = SHANXI_MATCH_RULES[`${input.sauceType}:${input.noodleShape}`];

  const spreadOffsetPct = clamp(varyAround(0, 1, input.seedKey, "spread") + (randomUnit(input.seedKey, "spread2") * 0.1 - 0.05), -0.05, 0.05);
  const saturationDeltaPct = clamp(varyAround(0, 1, input.seedKey, "sat") + (randomUnit(input.seedKey, "sat2") * 0.06 - 0.03), -0.03, 0.03);
  const rotationDeg = randomUnit(input.seedKey, "rotation") * 10 - 5;
  const highlightSkew = randomUnit(input.seedKey, "highlight") * 0.12 - 0.06;

  const attachmentRate = clamp((rule.attachmentArea * 0.62 + noodle.absorbency * 0.26 + sauce.density * 0.12) * 100, 0, 100);
  const gamutSpread = clamp((sauce.saturation * 0.6 + sauce.gloss * 0.18 + rule.contrastBoost * 0.22) * 100, 0, 100);
  const highlightContrast = clamp((sauce.gloss * 0.52 + noodle.reflectance * 0.18 + rule.glossBoost * 0.3) * 100, 0, 100);

  return {
    sauce,
    noodle,
    rule,
    variation: {
      spreadOffsetPct,
      saturationDeltaPct,
      rotationDeg,
      highlightSkew,
    },
    metrics: {
      attachmentRate,
      gamutSpread,
      highlightContrast,
    },
  };
}

export const SHANXI_DEBUG_COMBOS: Array<{ sauceType: ShanxiSauceType; noodleShape: ShanxiNoodleShape }> = [
  { sauceType: "rou", noodleShape: "daoxiao" },
  { sauceType: "rou", noodleShape: "lamian" },
  { sauceType: "tomato", noodleShape: "tijian" },
  { sauceType: "tomato", noodleShape: "ganmian" },
  { sauceType: "tomato", noodleShape: "helao" },
  { sauceType: "beef", noodleShape: "daoxiao" },
  { sauceType: "beef", noodleShape: "lamian" },
  { sauceType: "beef", noodleShape: "maoer" },
  { sauceType: "rou", noodleShape: "maoer" },
  { sauceType: "tomato", noodleShape: "lamian" },
];
