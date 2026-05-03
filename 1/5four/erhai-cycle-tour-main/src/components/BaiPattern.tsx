/**
 * Bai (白族) tie-dye inspired SVG decorations.
 * - TieDyePattern: a tileable indigo-on-white "蝴蝶/铜钱" rosette typical of Zhoucheng tie-dye.
 * - CangshanRidge: 19-peak silhouette of 苍山 used as background ridge above the lake.
 * - BaiBorder: a thin geometric border echoing 白族民居 山墙彩绘.
 */

export function TieDyePattern({ id = "tiedye", opacity = 0.15 }: { id?: string; opacity?: number }) {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          {/* central rosette */}
          <circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" strokeWidth="0.6" opacity={opacity * 4} />
          <circle cx="30" cy="30" r="9" fill="none" stroke="currentColor" strokeWidth="0.5" opacity={opacity * 3} />
          <circle cx="30" cy="30" r="4" fill="currentColor" opacity={opacity * 2.5} />
          {/* 8-petal radial dots — 蝴蝶纹 abstraction */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const r = 20;
            return (
              <circle
                key={i}
                cx={30 + Math.cos(a) * r}
                cy={30 + Math.sin(a) * r}
                r="1.2"
                fill="currentColor"
                opacity={opacity * 3}
              />
            );
          })}
          {/* corner dots — connective tissue when tiled */}
          <circle cx="0" cy="0" r="1.2" fill="currentColor" opacity={opacity * 2} />
          <circle cx="60" cy="0" r="1.2" fill="currentColor" opacity={opacity * 2} />
          <circle cx="0" cy="60" r="1.2" fill="currentColor" opacity={opacity * 2} />
          <circle cx="60" cy="60" r="1.2" fill="currentColor" opacity={opacity * 2} />
        </pattern>
      </defs>
    </svg>
  );
}

/** 苍山十九峰 silhouette — long horizontal ridge */
export function CangshanRidge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 60" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d="M0 60 L0 38
           L18 30 L32 36 L48 22 L66 32 L82 18 L100 28 L118 14 L138 26
           L156 20 L172 30 L190 16 L210 28 L228 18 L246 32 L264 22
           L282 30 L300 18 L318 28 L336 22 L354 32 L372 26 L388 34 L400 28
           L400 60 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Bai 山墙彩绘 inspired thin border — repeated diamond + dot motif */
export function BaiBorder({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 8" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <pattern id="bai-border-pat" x="0" y="0" width="16" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="currentColor" opacity="0.7" />
          <circle cx="12" cy="4" r="1" fill="currentColor" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="240" height="8" fill="url(#bai-border-pat)" />
    </svg>
  );
}
