import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ThemeId } from "@/types/theme";

const THEME_AUDIO_URLS: Record<ThemeId, string> = {
  "001": new URL("../../music/001.mp3", import.meta.url).href,
  "002": new URL("../../music/002.mp3", import.meta.url).href,
  "003": new URL("../../music/003.mp3", import.meta.url).href,
  "004": new URL("../../music/004.mp3", import.meta.url).href,
  "005": new URL("../../music/005.mp3", import.meta.url).href,
  "006": new URL("../../music/006.mp3", import.meta.url).href,
};

/* ------------------------------------------------------------------ */
/*  全局共享 <audio> 元素                                              */
/* ------------------------------------------------------------------ */
let sharedThemeAudio: HTMLAudioElement | null = null;

function canUseAudio() {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

function ensureSharedAudio() {
  if (!canUseAudio()) return null;
  if (!sharedThemeAudio) {
    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = true;
    sharedThemeAudio = audio;
  }
  return sharedThemeAudio;
}

/**
 * 在用户手势上下文中调用：预加载对应主题音频并播放以解锁浏览器
 * 自动播放限制。调用方应在 click / touchend 等事件中调用此函数。
 */
export async function warmThemeAudioFromGesture(themeId: ThemeId) {
  const audio = ensureSharedAudio();
  if (!audio) return;

  const nextSrc = THEME_AUDIO_URLS[themeId];
  if (audio.src !== nextSrc) {
    audio.src = nextSrc;
    audio.load();
  }

  try {
    await audio.play();
  } catch {
    // 浏览器仍然可能拦截，忽略
  }
}

/* ------------------------------------------------------------------ */
/*  ThemeAudioController 接口                                          */
/* ------------------------------------------------------------------ */
export interface ThemeAudioController {
  themeId: ThemeId | null;
  src: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
  autoplayBlocked: boolean;
  error: string;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  seek: (timeSeconds: number) => void;
  /** 被视频/原声抢占时调用：彻底暂停背景音乐，记录中断位置 */
  pauseForVideo: () => void;
  /** 视频/原声结束时调用：从中断位置恢复背景音乐播放 */
  resumeFromVideo: () => void;
  /** 当前是否处于强制暂停状态（被视频/原声抢占） */
  isForcedPaused: boolean;
}

/* ------------------------------------------------------------------ */
/*  useThemeAudio hook                                                 */
/* ------------------------------------------------------------------ */
export function useThemeAudio(themeId: ThemeId | null): ThemeAudioController {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // ---- 播放状态 ----
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [error, setError] = useState("");
  const [isForcedPaused, setIsForcedPaused] = useState(false);

  // ---- 强制暂停（视频/原声抢占）用 ref 跟踪，避免闭包过期 ----
  const forcedPauseRef = useRef(false);
  // 记录被抢占时的播放位置，用于恢复
  const pausedAtRef = useRef(0);

  const src = useMemo(() => (themeId ? THEME_AUDIO_URLS[themeId] : null), [themeId]);

  /* ---- RAF 时间更新 ---- */
  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startRaf = useCallback(() => {
    const update = () => {
      const audio = audioRef.current;
      if (!audio) return;
      setCurrentTime(audio.currentTime);
      if (!audio.paused) {
        rafRef.current = window.requestAnimationFrame(update);
      }
    };
    stopRaf();
    rafRef.current = window.requestAnimationFrame(update);
  }, [stopRaf]);

  /* ---- 获取共享 audio 元素 ---- */
  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = ensureSharedAudio();
    }
    return audioRef.current;
  }, []);

  /* ---- 播放（尊重 forcedPause） ---- */
  const play = useCallback(async () => {
    const audio = ensureAudio();
    if (!audio || !src) return;
    if (forcedPauseRef.current) return;

    try {
      setError("");
      await audio.play();
      setAutoplayBlocked(false);
    } catch (err) {
      console.error("主题背景音乐播放失败:", err);
      setAutoplayBlocked(true);
      setError("自动播放被浏览器拦截，等待用户交互后继续播放");
    }
  }, [ensureAudio, src]);

  /* ---- 暂停（用户手动） ---- */
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setAutoplayBlocked(false);
  }, []);

  /* ---- 切换播放/暂停 ---- */
  const toggle = useCallback(async () => {
    const audio = ensureAudio();
    if (!audio) return;
    if (audio.paused) {
      await play();
    } else {
      pause();
    }
  }, [ensureAudio, play, pause]);

  /* ---- 跳转 ---- */
  const seek = useCallback((timeSeconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(timeSeconds)) return;
    const nextTime = Math.max(0, Math.min(timeSeconds, audio.duration || timeSeconds));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  /* ---- 被视频/原声抢占：彻底暂停背景音乐 ---- */
  const pauseForVideo = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // 记录中断位置
    pausedAtRef.current = audio.currentTime;
    forcedPauseRef.current = true;
    setIsForcedPaused(true);
    audio.pause();
  }, []);

  /* ---- 视频/原声结束：从中断处恢复背景音乐 ---- */
  const resumeFromVideo = useCallback(() => {
    forcedPauseRef.current = false;
    setIsForcedPaused(false);

    const audio = audioRef.current;
    if (!audio || !src) return;

    // 从中断位置恢复
    if (Number.isFinite(pausedAtRef.current) && pausedAtRef.current > 0) {
      audio.currentTime = pausedAtRef.current;
    }
    pausedAtRef.current = 0;

    // 直接调用 audio.play()，绕过 play() 中的 forcedPause 检查
    audio.play().catch(() => undefined);
  }, [src]);

  /* ================================================================ */
  /*  Effects                                                          */
  /* ================================================================ */

  /* ---- 监听 audio 元素原生事件，同步 React 状态 ---- */
  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) return undefined;

    // 初始化状态
    setCurrentTime(audio.currentTime || 0);
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    setIsReady(audio.readyState >= 1);
    setIsPlaying(!audio.paused);

    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrentTime(audio.currentTime || 0);
      setIsReady(true);
      setError("");
    };
    const onDurationChange = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const onPlay = () => {
      setIsPlaying(true);
      setError("");
      startRaf();
    };
    const onPause = () => {
      setIsPlaying(false);
      stopRaf();
      setCurrentTime(audio.currentTime || 0);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const onError = () => {
      setError("背景音乐加载失败");
      setIsReady(false);
      setIsPlaying(false);
      stopRaf();
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("error", onError);
      stopRaf();
    };
  }, [ensureAudio, startRaf, stopRaf]);

  /* ---- src 变化时切换音频源并自动播放 ---- */
  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) return undefined;

    if (!src) {
      // themeId 为空 → 彻底停止
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      setIsReady(false);
      setIsPlaying(false);
      setError("");
      setAutoplayBlocked(false);
      forcedPauseRef.current = false;
      setIsForcedPaused(false);
      pausedAtRef.current = 0;
      return undefined;
    }

    // src 有值：切换音源（如果不同）
    if (audio.src !== src) {
      audio.src = src;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      setIsReady(false);
      setError("");
    }

    // 尝试播放（如果被视频抢占则跳过）
    if (!forcedPauseRef.current) {
      void play();
    }

    return undefined;
  }, [ensureAudio, play, src]);

  /* ---- 组件卸载时彻底停止音频 ---- */
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        forcedPauseRef.current = false;
        pausedAtRef.current = 0;
      }
    };
  }, []);

  /* ---- 自动播放被拦截后，等待用户交互重试 ---- */
  useEffect(() => {
    if (!autoplayBlocked || !src || forcedPauseRef.current) return undefined;

    const retryPlay = () => {
      if (forcedPauseRef.current) return;
      void play();
    };

    window.addEventListener("pointerdown", retryPlay);
    window.addEventListener("keydown", retryPlay);
    return () => {
      window.removeEventListener("pointerdown", retryPlay);
      window.removeEventListener("keydown", retryPlay);
    };
  }, [autoplayBlocked, play, src]);

  /* ---- RAF 清理 ---- */
  useEffect(() => {
    return () => {
      stopRaf();
    };
  }, [stopRaf]);

  /* ================================================================ */
  /*  返回值                                                           */
  /* ================================================================ */
  return {
    themeId,
    src,
    isPlaying,
    currentTime,
    duration,
    isReady,
    autoplayBlocked,
    error,
    play,
    pause,
    toggle,
    seek,
    pauseForVideo,
    resumeFromVideo,
    isForcedPaused,
  };
}
