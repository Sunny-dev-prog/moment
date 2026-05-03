import React, { useMemo } from "react";

import { getShanxiRenderDescriptor, type ShanxiNoodleShape, type ShanxiSauceType } from "./shanxiRenderConfig";

type Props = {
  noodleImage: string;
  noodleShape: ShanxiNoodleShape;
  sauceType: ShanxiSauceType;
  seedKey: string;
  size?: number;
  showMetrics?: boolean;
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
  const parsed = Number.parseInt(value, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createFlowPath(index: number, descriptor: ReturnType<typeof getShanxiRenderDescriptor>) {
  const { rule, variation } = descriptor;
  const baseX = 24 + index * 15 + variation.spreadOffsetPct * 40;
  const width = 18 + rule.spreadX * 20;
  const flow = rule.flowPath;
  const arc = 18 + flow * 28 + index * 6;
  const drop = 36 + flow * 34 + index * 8;
  return `
    M ${baseX} ${42 + index * 5}
    C ${baseX - arc} ${68 + index * 4},
      ${baseX + width} ${92 + drop * 0.18},
      ${baseX + width * 0.48} ${138 + drop}
    C ${baseX + width * 0.3} ${154 + drop},
      ${baseX - arc * 0.18} ${164 + drop * 0.62},
      ${baseX - width * 0.14} ${178 + drop * 0.34}
  `;
}

export function ShanxiNoodleRenderer({
  noodleImage,
  noodleShape,
  sauceType,
  seedKey,
  size = 220,
  showMetrics = false,
}: Props) {
  const descriptor = useMemo(
    () => getShanxiRenderDescriptor({ noodleShape, sauceType, seedKey }),
    [noodleShape, sauceType, seedKey],
  );

  const sauceFilter = `saturate(${(1 + descriptor.variation.saturationDeltaPct).toFixed(3)})`;
  const sauceRotation = descriptor.variation.rotationDeg;
  const sauceScaleX = 0.92 + descriptor.rule.spreadX * 0.18 + descriptor.variation.spreadOffsetPct;
  const sauceScaleY = 0.9 + descriptor.rule.spreadY * 0.14;
  const absorptionGlow = 0.16 + descriptor.noodle.absorbency * 0.2;
  const noodleFilter = `brightness(${(1.02 + descriptor.noodle.reflectance * 0.16).toFixed(3)}) saturate(${(0.96 + descriptor.noodle.textureStrength * 0.18).toFixed(3)})`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_44%,rgba(255,243,215,0.7),rgba(120,61,22,0.08)_62%,transparent_75%)]" />
      <div className="absolute inset-[12%] rounded-full border border-amber-100/12 bg-black/10 backdrop-blur-[1px]" />

      <img
        src={noodleImage}
        alt=""
        aria-hidden="true"
        className="relative z-[1] h-[76%] w-[76%] object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.26)]"
        style={{ filter: noodleFilter }}
      />

      <svg
        viewBox="0 0 220 220"
        className="pointer-events-none absolute z-[2] h-[84%] w-[84%] overflow-visible"
        style={{ transform: `rotate(${sauceRotation}deg)` }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`shanxi-base-${seedKey}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={hexToRgba(descriptor.sauce.palette.highlight, 0.82)} />
            <stop offset="62%" stopColor={hexToRgba(descriptor.sauce.palette.base, 0.94)} />
            <stop offset="100%" stopColor={hexToRgba(descriptor.sauce.palette.shadow, 0.96)} />
          </radialGradient>
          <linearGradient id={`shanxi-oil-${seedKey}`} x1="10%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor={hexToRgba(descriptor.sauce.palette.oil, 0.72)} />
            <stop offset="100%" stopColor={hexToRgba(descriptor.sauce.palette.highlight, 0.18)} />
          </linearGradient>
          <filter id={`shanxi-blur-${seedKey}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={2.6 + descriptor.sauce.viscosity * 1.2} />
          </filter>
        </defs>

        <g style={{ filter: sauceFilter }}>
          <ellipse
            cx="110"
            cy="108"
            rx={50 + descriptor.rule.attachmentArea * 28}
            ry={34 + descriptor.rule.pooling * 20}
            fill={`url(#shanxi-base-${seedKey})`}
            opacity={0.84}
            transform={`scale(${sauceScaleX.toFixed(3)} ${sauceScaleY.toFixed(3)}) translate(${descriptor.variation.spreadOffsetPct * 8} ${descriptor.variation.spreadOffsetPct * 5})`}
          />

          <ellipse
            cx={102 + descriptor.variation.highlightSkew * 50}
            cy="96"
            rx={26 + descriptor.sauce.gloss * 22}
            ry={16 + descriptor.rule.glossBoost * 18}
            fill={hexToRgba(descriptor.sauce.palette.highlight, 0.34 + descriptor.sauce.gloss * 0.22)}
            filter={`url(#shanxi-blur-${seedKey})`}
          />

          {Array.from({ length: 3 }).map((_, index) => (
            <path
              key={`flow-${index}`}
              d={createFlowPath(index, descriptor)}
              fill="none"
              stroke={index === 1 ? `url(#shanxi-oil-${seedKey})` : hexToRgba(descriptor.sauce.palette.base, 0.5 + descriptor.rule.flowPath * 0.12)}
              strokeLinecap="round"
              strokeWidth={8 - index + descriptor.sauce.viscosity * 2.8}
              opacity={0.5 + descriptor.rule.flowPath * 0.2}
            />
          ))}

          {Array.from({ length: 4 }).map((_, index) => {
            const x = 64 + index * 26 + descriptor.variation.spreadOffsetPct * 28;
            const y = 72 + (index % 2) * 30;
            return (
              <ellipse
                key={`blob-${index}`}
                cx={x}
                cy={y}
                rx={10 + descriptor.rule.pooling * 9 - index * 0.8}
                ry={8 + descriptor.rule.pooling * 7 - index * 0.6}
                fill={hexToRgba(descriptor.sauce.palette.shadow, 0.18 + descriptor.sauce.density * 0.24)}
              />
            );
          })}
        </g>

        <ellipse
          cx="114"
          cy="112"
          rx={58 + descriptor.rule.attachmentArea * 24}
          ry={40 + descriptor.rule.spreadY * 16}
          fill={hexToRgba(descriptor.sauce.palette.shadow, absorptionGlow)}
          filter={`url(#shanxi-blur-${seedKey})`}
        />
      </svg>

      {showMetrics ? (
        <div className="absolute bottom-2 left-2 right-2 z-[3] rounded-2xl border border-white/10 bg-stone-950/65 px-3 py-2 text-[10px] text-amber-50/88 backdrop-blur-md">
          <div className="grid grid-cols-3 gap-2">
            <Metric label="附着率" value={`${descriptor.metrics.attachmentRate.toFixed(0)}%`} />
            <Metric label="色域分布" value={`${descriptor.metrics.gamutSpread.toFixed(0)}%`} />
            <Metric label="高光对比" value={`${descriptor.metrics.highlightContrast.toFixed(0)}%`} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-2 py-1.5">
      <div className="text-[9px] tracking-[0.16em] text-amber-100/60">{label}</div>
      <div className="mt-0.5 text-[12px] font-semibold text-amber-50">{value}</div>
    </div>
  );
}
