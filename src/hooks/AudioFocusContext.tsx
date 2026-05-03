import { createContext, useCallback, useContext, useRef, useState } from "react";

interface AudioFocusApi {
  pauseForVideo: () => void;
  resumeFromVideo: () => void;
}

interface AudioFocusContextValue {
  /** 请求音频焦点（视频/原声播放时调用），背景音乐暂停 */
  requestFocus: (holderId: string) => void;
  /** 释放音频焦点（视频/原声停止时调用），背景音乐恢复 */
  releaseFocus: (holderId: string) => void;
  /** 当前持有焦点的 ID，null 表示无人持有（背景音乐播放中） */
  focusHolder: string | null;
}

const AudioFocusContext = createContext<AudioFocusContextValue | null>(null);

export function AudioFocusProvider({
  children,
  audioApi,
}: {
  children: React.ReactNode;
  audioApi: AudioFocusApi;
}) {
  const focusHolderRef = useRef<string | null>(null);
  const [focusHolder, setFocusHolder] = useState<string | null>(null);

  const requestFocus = useCallback(
    (holderId: string) => {
      if (focusHolderRef.current === holderId) return;
      focusHolderRef.current = holderId;
      setFocusHolder(holderId);
      audioApi.pauseForVideo();
    },
    [audioApi],
  );

  const releaseFocus = useCallback(
    (holderId: string) => {
      if (focusHolderRef.current !== holderId) return;
      focusHolderRef.current = null;
      setFocusHolder(null);
      audioApi.resumeFromVideo();
    },
    [audioApi],
  );

  return (
    <AudioFocusContext.Provider value={{ requestFocus, releaseFocus, focusHolder }}>
      {children}
    </AudioFocusContext.Provider>
  );
}

export function useAudioFocus(): AudioFocusContextValue {
  const ctx = useContext(AudioFocusContext);
  if (!ctx) {
    return { requestFocus: () => {}, releaseFocus: () => {}, focusHolder: null };
  }
  return ctx;
}
