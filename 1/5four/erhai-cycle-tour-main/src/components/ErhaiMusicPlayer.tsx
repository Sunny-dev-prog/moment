import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Heart, ListMusic } from "lucide-react";
import { ErhaiRouteSvg } from "./ErhaiRouteSvg";

type Track = { title: string; artist: string; album: string; duration: number };

const playlist: Track[] = [
  { title: "去有风的地方", artist: "郁可唯", album: "OST", duration: 218 },
  { title: "苍洱之恋", artist: "杨千嬅", album: "大理风物志", duration: 244 },
  { title: "Wind in Dali", artist: "夏日入侵企画", album: "Field Notes", duration: 196 },
  { title: "洱海月", artist: "霜雪千年", album: "白族民谣", duration: 232 },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function ErhaiMusicPlayer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(38); // seconds
  const [liked, setLiked] = useState(true);
  const [spin, setSpin] = useState(0); // disc rotation degrees

  const track = playlist[idx];

  // Fake playback ticker
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= track.duration - 1) {
          setIdx((i) => (i + 1) % playlist.length);
          return 0;
        }
        return p + 1;
      });
      setSpin((s) => (s + 6) % 360);
    }, 1000);
    return () => clearInterval(id);
  }, [playing, track.duration]);

  // Reset progress when track changes
  useEffect(() => setProgress(0), [idx]);

  const pct = progress / track.duration;
  const R = 132;
  const C = 2 * Math.PI * R;

  return (
    <div className="rounded-2xl bg-erhai-indigo/35 backdrop-blur-md border border-white/20 p-3 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] tracking-[0.3em] text-white/85 font-semibold">
          BGM · 骑 行 电 台
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/65">
          <ListMusic className="size-3" /> {idx + 1}/{playlist.length}
        </div>
      </div>

      {/* Disc — Erhai map as the album art */}
      <div className="relative mx-auto" style={{ width: 300, maxWidth: "100%" }}>
        <svg viewBox="0 0 300 300" className="w-full h-auto -rotate-90">
          {/* Track ring (灰色底环) */}
          <circle cx="150" cy="150" r={R} fill="none" stroke="oklch(1 0 0 / 0.18)" strokeWidth="3" />
          {/* Progress ring (QQ-music style green→orange gradient, 暖橘) */}
          <defs>
            <linearGradient id="prog" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.85 0.18 80)" />
              <stop offset="100%" stopColor="oklch(0.7 0.2 50)" />
            </linearGradient>
          </defs>
          <circle
            cx="150"
            cy="150"
            r={R}
            fill="none"
            stroke="url(#prog)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${C * pct} ${C}`}
            style={{ transition: "stroke-dasharray 1s linear" }}
          />
          {/* Playhead dot */}
          <circle
            cx={150 + R * Math.cos(2 * Math.PI * pct - Math.PI / 2)}
            cy={150 + R * Math.sin(2 * Math.PI * pct - Math.PI / 2)}
            r="5"
            fill="oklch(0.95 0.04 70)"
            stroke="oklch(0.7 0.2 50)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Spinning vinyl with Erhai map as label */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${spin}deg)`, transition: "transform 1s linear" }}
        >
          <div
            className="rounded-full bg-erhai-indigo-deep/80 border border-white/15 shadow-2xl flex items-center justify-center relative overflow-hidden"
            style={{ width: 232, height: 232 }}
          >
            {/* vinyl grooves */}
            {[100, 90, 78, 66].map((r) => (
              <span
                key={r}
                className="absolute rounded-full border border-white/8"
                style={{ width: r * 2, height: r * 2 }}
              />
            ))}
            {/* Erhai map as the label — the "圈" */}
            <div
              className="rounded-full bg-erhai-indigo-deep/95 overflow-hidden flex items-center justify-center border-2 border-white/30"
              style={{ width: 168, height: 168 }}
            >
              <div className="w-full h-full -m-1 scale-[1.05]">
                <ErhaiRouteSvg />
              </div>
            </div>
            {/* center spindle */}
            <div className="absolute size-3 rounded-full bg-white/90 shadow" />
          </div>
        </div>
      </div>

      {/* Track info */}
      <div className="mt-3 text-center">
        <div className="text-[15px] font-bold truncate">{track.title}</div>
        <div className="text-[11px] text-white/70 mt-0.5 truncate">
          {track.artist} · {track.album}
        </div>
      </div>

      {/* Time + controls */}
      <div className="mt-2 flex items-center gap-2 text-[10px] text-white/70 font-mono">
        <span>{fmt(progress)}</span>
        <div className="flex-1 h-0.5 bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-erhai-orange"
            style={{ width: `${pct * 100}%`, transition: "width 1s linear" }}
          />
        </div>
        <span>{fmt(track.duration)}</span>
      </div>

      <div className="mt-2 flex items-center justify-center gap-5">
        <button
          aria-label="喜欢"
          onClick={() => setLiked((v) => !v)}
          className="size-8 flex items-center justify-center text-white/85"
        >
          <Heart className={liked ? "size-5 fill-erhai-orange text-erhai-orange" : "size-5"} />
        </button>
        <button
          aria-label="上一首"
          onClick={() => setIdx((i) => (i - 1 + playlist.length) % playlist.length)}
          className="size-9 flex items-center justify-center text-white"
        >
          <SkipBack className="size-5 fill-white" />
        </button>
        <button
          aria-label={playing ? "暂停" : "播放"}
          onClick={() => setPlaying((p) => !p)}
          className="size-12 rounded-full bg-white text-erhai-indigo-deep flex items-center justify-center shadow-lg"
        >
          {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
        </button>
        <button
          aria-label="下一首"
          onClick={() => setIdx((i) => (i + 1) % playlist.length)}
          className="size-9 flex items-center justify-center text-white"
        >
          <SkipForward className="size-5 fill-white" />
        </button>
        <button aria-label="播放列表" className="size-8 flex items-center justify-center text-white/85">
          <ListMusic className="size-5" />
        </button>
      </div>
    </div>
  );
}
