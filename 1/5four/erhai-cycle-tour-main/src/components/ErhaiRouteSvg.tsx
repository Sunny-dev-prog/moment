type Spot = { name: string; x: number; y: number; anchor?: "start" | "end" | "middle"; tag?: string };

const spots: Spot[] = [
  { name: "上关花", x: 145, y: 30, anchor: "middle" },
  { name: "喜洲古镇", x: 70, y: 110, anchor: "end" },
  { name: "双廊", x: 232, y: 95, anchor: "start" },
  { name: "才村码头", x: 60, y: 230, anchor: "end" },
  { name: "挖色镇", x: 242, y: 215, anchor: "start" },
  { name: "小普陀", x: 232, y: 305, anchor: "start" },
  { name: "龙龛码头", x: 75, y: 340, anchor: "end" },
  { name: "海舌公园", x: 155, y: 405, anchor: "middle", tag: "终" },
];

export function ErhaiRouteSvg() {
  return (
    <svg
      viewBox="0 0 300 440"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="环洱海骑行路线"
    >
      <defs>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.45 0.09 245)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="oklch(0.32 0.08 250)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="cang" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.5 0.04 240)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.45 0.05 245)" stopOpacity="0" />
        </linearGradient>
        {/* tie-dye dot pattern overlay for the lake */}
        <pattern id="tiedye-lake" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="0.8" fill="oklch(0.95 0.02 240)" opacity="0.35" />
          <circle cx="0" cy="0" r="0.5" fill="oklch(0.95 0.02 240)" opacity="0.25" />
          <circle cx="22" cy="22" r="0.5" fill="oklch(0.95 0.02 240)" opacity="0.25" />
        </pattern>
      </defs>

      {/* 苍山 ridge behind the lake (west side) */}
      <path
        d="M 30 90
           L 35 70 L 48 78 L 60 55 L 75 72 L 88 50 L 102 68 L 118 48 L 132 65
           L 145 50 L 158 60 L 145 95
           L 130 115 L 110 140 L 90 175 L 75 220 L 65 270 L 60 320 L 55 380 L 50 430 L 30 430 Z"
        fill="url(#cang)"
      />

      {/* Lake outline — Bai indigo */}
      <path
        id="lake-outline"
        d="M 150 25
           C 180 28, 210 50, 215 85
           C 220 120, 235 150, 240 195
           C 245 240, 235 290, 220 330
           C 205 370, 180 405, 155 415
           C 130 408, 110 380, 95 345
           C 80 305, 65 260, 60 215
           C 58 175, 70 135, 90 100
           C 105 70, 125 35, 150 25 Z"
        fill="url(#lake)"
        stroke="oklch(0.95 0.02 240)"
        strokeWidth="1.2"
      />
      {/* tie-dye texture clipped to lake */}
      <path
        d="M 150 25 C 180 28, 210 50, 215 85 C 220 120, 235 150, 240 195 C 245 240, 235 290, 220 330 C 205 370, 180 405, 155 415 C 130 408, 110 380, 95 345 C 80 305, 65 260, 60 215 C 58 175, 70 135, 90 100 C 105 70, 125 35, 150 25 Z"
        fill="url(#tiedye-lake)"
      />

      {/* Cycling route — orange dashed */}
      <path
        d="M 150 35
           C 175 40, 200 60, 208 92
           C 215 125, 228 158, 232 198
           C 236 238, 228 285, 213 322
           C 200 358, 178 392, 155 402
           C 132 395, 115 370, 102 338
           C 88 300, 75 258, 70 215
           C 70 178, 80 142, 98 110
           C 112 82, 130 50, 150 35 Z"
        fill="none"
        stroke="oklch(0.78 0.17 55)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 4"
      />

      {/* "洱 海" — Bai-style vertical writing center */}
      <text x="150" y="200" textAnchor="middle" fontSize="14" letterSpacing="8" fill="oklch(0.97 0.02 240)" opacity="0.85" fontWeight="300">
        洱 海
      </text>
      <text x="150" y="232" textAnchor="middle" fontSize="8" letterSpacing="4" fill="oklch(0.95 0.04 60)" opacity="0.7" fontWeight="500">
        ERHAI · 128KM
      </text>

      {/* Spots */}
      {spots.map((s) => (
        <g key={s.name}>
          <circle cx={s.x} cy={s.y} r="5" fill="oklch(1 0 0)" stroke="oklch(0.78 0.17 55)" strokeWidth="1.5" />
          <circle cx={s.x} cy={s.y} r="2" fill="oklch(0.78 0.17 55)" />
          <text
            x={s.anchor === "end" ? s.x - 9 : s.anchor === "start" ? s.x + 9 : s.x}
            y={s.y + 4}
            textAnchor={s.anchor ?? "middle"}
            fontSize="11"
            fill="oklch(0.98 0 0)"
            fontWeight="600"
            style={{ paintOrder: "stroke", stroke: "oklch(0.28 0.08 250 / 0.7)", strokeWidth: 2.5 }}
          >
            {s.name}
            {s.tag ? (
              <tspan dx="4" fontSize="9" fill="oklch(0.78 0.17 55)" fontWeight="700">
                · {s.tag}
              </tspan>
            ) : null}
          </text>
        </g>
      ))}

      {/* Pulsing finish marker */}
      <circle cx={155} cy={405} r="9" fill="none" stroke="oklch(0.78 0.17 55)" strokeWidth="1.5">
        <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
