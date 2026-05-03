import { useEffect, useRef, useState, useCallback } from "react";
import { getPublicAssetUrl } from "@/lib/publicAsset";
import {
  Menu,
  Search,
  Play,
  Pause,
  Plus,
  Home,
  Users,
  MessageCircle,
  User,
  ImageIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { ThemeData } from "@/types/theme";
import { getThemeAccent, getThemeTitleVars, isLightBackground } from "@/lib/colorUtils";
import { generateEmotionCopywritings } from "@/lib/deepseekApi";
import {
  getThemeCardBackgroundOverlayStyle,
  getThemeCardBackgroundStyle,
} from "@/lib/themeCardBackground";
import { useAudioFocus } from "@/hooks/AudioFocusContext";

interface Props {
  data: ThemeData;
  onUpdateCopywriting?: (updates: Partial<ThemeData>) => void;
  totalCards?: number;
}

/** 8 种情感标签 + 演示用户名（与 J3-Q3 头像一一对应） */
const EMOTION_TAGS = [
  "积极治愈系",
  "伤感遗憾系",
  "清醒现实系",
  "励志热血系",
  "小众文艺系",
  "佛系松弛系",
  "沙雕搞笑系",
  "暗恋温柔暧昧系",
] as const;

const PLACEHOLDER_NAMES = [
  "用户一",
  "用户二",
  "用户三",
  "用户四",
  "用户五",
  "用户六",
  "用户七",
  "用户八",
];

/** 全局BGM播放器状态 - 确保同一时间只有一个BGM播放 */
const globalBgmState = {
  currentAudio: null as HTMLAudioElement | null,
  currentId: null as string | null,
  playingId: null as string | null,
  listeners: new Set<(id: string | null) => void>(),
  
  subscribe(callback: (id: string | null) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  
  notify(id: string | null) {
    this.listeners.forEach(cb => cb(id));
  },
  
  stopCurrent() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.currentId = null;
    this.playingId = null;
    this.notify(null);
  },
  
  play(id: string, audio: HTMLAudioElement) {
    // 如果点击的是当前正在播放的，则暂停
    if (this.currentId === id && !audio.paused) {
      audio.pause();
      this.playingId = null;
      this.notify(null);
      return;
    }
    
    // 停止其他正在播放的
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    
    this.currentAudio = audio;
    this.currentId = id;
    this.playingId = id;
    this.notify(id);
    
    audio.play().catch(() => {
      this.playingId = null;
      this.notify(null);
    });
  },
  
  onEnded(id: string) {
    if (this.currentId === id) {
      this.playingId = null;
      this.notify(null);
    }
  }
};

export function CardThree({ data, onUpdateCopywriting, totalCards = 3 }: Props) {
  const lightBg = isLightBackground(data.bgColor);
  const titleVars = getThemeTitleVars(data.bgColor);
  const themedTitleStyle = titleVars as React.CSSProperties;
  const themedTitleColorStyle = { color: "var(--card4-title-color)" };
  const bgStyle = getThemeCardBackgroundStyle(data.bgColor);

  const textMain = lightBg ? "text-neutral-900" : "text-white";
  const textSoft = lightBg ? "text-neutral-700" : "text-white/80";
  const tabBorder = lightBg ? "border-neutral-200" : "border-white/15";

  const accent = getThemeAccent(data.bgColor);
  const audioFocus = useAudioFocus();

  // 从data中获取预生成的情感文案
  const emotions: string[] = [
    data.c3_emo1 || getDefaultEmotions(data.id)[0],
    data.c3_emo2 || getDefaultEmotions(data.id)[1],
    data.c3_emo3 || getDefaultEmotions(data.id)[2],
    data.c3_emo4 || getDefaultEmotions(data.id)[3],
    data.c3_emo5 || getDefaultEmotions(data.id)[4],
    data.c3_emo6 || getDefaultEmotions(data.id)[5],
    data.c3_emo7 || getDefaultEmotions(data.id)[6],
    data.c3_emo8 || getDefaultEmotions(data.id)[7],
  ];

  // 检查是否正在生成（正在生成时显示加载状态）
  // c3_emo1为默认值"文字行1"或空字符串或undefined时表示还未生成AI文案
  const isGenerating = !data.c3_emo1 || data.c3_emo1 === "文字行1" || data.c3_emo1 === "";

  // 当需要生成时，调用API生成情感文案
  useEffect(() => {
    console.log("[CardThree] useEffect triggered, isGenerating:", isGenerating, "onUpdateCopywriting:", !!onUpdateCopywriting);
    if (!isGenerating || !onUpdateCopywriting) return;

    const generateCopywriting = async () => {
      console.log("[CardThree] 开始调用API生成文案...");
      const sceneDescription = [
        data.timeOfDay,
        data.weather,
        data.mood,
        data.destination,
      ].filter(Boolean).join("，");

      console.log("[CardThree] sceneDescription:", sceneDescription);

      try {
        const copywritings = await generateEmotionCopywritings(
          data.id,
          data.navTag,
          sceneDescription
        );

        console.log("[CardThree] API返回结果:", copywritings);

        if (copywritings && Object.keys(copywritings).length > 0) {
          // 将返回的8种情感文案更新到data中
          const STYLE_KEY_MAP: Record<number, string> = {
            0: "positive",
            1: "sad",
            2: "realistic",
            3: "inspirational",
            4: "literary",
            5: "relaxed",
            6: "funny",
            7: "romantic",
          };
          
          const updates = {
            c3_emo1: copywritings[STYLE_KEY_MAP[0]] || data.c3_emo1,
            c3_emo2: copywritings[STYLE_KEY_MAP[1]] || data.c3_emo2,
            c3_emo3: copywritings[STYLE_KEY_MAP[2]] || data.c3_emo3,
            c3_emo4: copywritings[STYLE_KEY_MAP[3]] || data.c3_emo4,
            c3_emo5: copywritings[STYLE_KEY_MAP[4]] || data.c3_emo5,
            c3_emo6: copywritings[STYLE_KEY_MAP[5]] || data.c3_emo6,
            c3_emo7: copywritings[STYLE_KEY_MAP[6]] || data.c3_emo7,
            c3_emo8: copywritings[STYLE_KEY_MAP[7]] || data.c3_emo8,
          };
          
          console.log("[CardThree] 更新数据:", updates);
          onUpdateCopywriting(updates as any);
        }
      } catch (error) {
        console.error("[CardThree] API调用失败:", error);
      }
    };

    generateCopywriting();
  }, [isGenerating, data.id, data.navTag, data.timeOfDay, data.weather, data.mood, data.destination, onUpdateCopywriting]);

  // 默认文案
  function getDefaultEmotions(themeId: string): string[] {
    const defaults: Record<string, string[]> = {
      "001": [
        "樱花树下站谁都美，我的爱给谁都热烈",
        "樱花飘落的速度是秒速五厘米，我们渐行渐远",
        "来看樱花了，人比花多，但花确实好看",
        "像樱花一样，在最美的时刻绽放自己",
        "夜樱微雨，浪漫的不是花，是此刻的心情",
        "随便拍拍，樱花嘛，看看就好",
        "樱花：你们人类真奇怪，拍我就算了还发朋友圈",
        "想和你一起看樱花，从花开到花落",
      ],
      "002": [
        "洱海的风吹走了所有烦恼，只剩下自由",
        "洱海那么大，却装不下我一个人的思念",
        "洱海很美，紫外线也很强，记得涂防晒",
        "去有风的地方，找到属于自己的方向",
        "苍山下，洱海旁，风里有诗的味道",
        "躺平在洱海边，今天什么都不想",
        "洱海：又来一个发呆的，我这儿是发呆圣地吗",
        "想和你一起在洱海看日落，从黄昏到夜幕",
      ],
      "003": [
        "古县城的每一块砖都在诉说着历史的美好",
        "千年古县城，见证了多少人来人往",
        "古县城拍照很出片，就是人有点多",
        "站在历史里，感受时间的力量",
        "青砖黛瓦，深巷高墙，时光在这里慢下来",
        "古城嘛，慢慢逛，不急",
        "满江红拍摄地打卡，我也来当一回主角",
        "想和你穿越千年，在这古县城相遇",
      ],
      "004": [
        "阿勒泰的风里有自由的味道，心都变宽了",
        "阿勒泰那么大，却没有一个角落属于我",
        "阿勒泰很美，但路途遥远，值得一来",
        "去阿勒泰，寻找内心深处的宁静",
        "雪山、草原、湖泊，这里是大地的诗篇",
        "在阿勒泰，时间是用来浪费的",
        "阿勒泰的牛羊：这些人类真奇怪，看我们吃草",
        "想和你一起在阿勒泰的草原上数星星",
      ],
      "005": [
        "长白山的雪净化了所有，包括心情",
        "雪落无声，就像那些没说出口的话",
        "长白山很冷，但雪景确实值得",
        "像长白山一样，保持内心的纯净",
        "雪落长白，世界变成了一幅水墨画",
        "看雪嘛，静静看就好",
        "长白山：你们南方人来就是为了看雪？",
        "想和你一起看长白山的初雪，一不小心白了头",
      ],
      "006": [
        "外滩的夜色里，藏着上海的温柔",
        "外滩的灯火再亮，也照不亮心里的角落",
        "外滩人很多，但夜景确实不错",
        "在繁华中寻找自己的位置",
        "霓虹初上，黄浦江畔，上海的故事刚刚开始",
        "外滩走走，吹吹江风，挺好",
        "外滩：每天晚上这么多人看我，我都不好意思了",
        "想和你一起在外滩看夜景，从繁华到宁静",
      ],
    };
    return defaults[themeId] || EMOTION_TAGS.map(tag => `${tag}文案`);
  }

  // 6 个音乐板块 - 使用 /card3/ 目录下的资源
  const musicBlocks = [
    { avatar: getPublicAssetUrl("/card3/avatar/1.jpg"), audio: getPublicAssetUrl("/card3/bgm/1.mp3") },
    { avatar: getPublicAssetUrl("/card3/avatar/2.jpg"), audio: getPublicAssetUrl("/card3/bgm/2.mp3") },
    { avatar: getPublicAssetUrl("/card3/avatar/3.jpg"), audio: getPublicAssetUrl("/card3/bgm/3.mp3") },
    { avatar: getPublicAssetUrl("/card3/avatar/4.jpg"), audio: getPublicAssetUrl("/card3/bgm/4.mp3") },
    { avatar: getPublicAssetUrl("/card3/avatar/5.jpg"), audio: getPublicAssetUrl("/card3/bgm/5.mp3") },
    { avatar: getPublicAssetUrl("/card3/avatar/6.jpg"), audio: getPublicAssetUrl("/card3/bgm/6.mp3") },
  ];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={bgStyle}>
      {/* 高斯柔光 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={getThemeCardBackgroundOverlayStyle()}
      />

      <div className="relative flex h-full min-h-0 flex-col px-5 pb-2 pt-3">
        {/* 1. 顶栏 */}
        <nav className="flex items-center justify-between text-[13px]">
          <Menu className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
          <div className={`flex items-center gap-3 ${textSoft}`} style={themedTitleStyle}>
            <span>团购</span>
            <span>经验</span>
            <span style={themedTitleColorStyle}>{data.c3_navTag}</span>
            <span>关注</span>
            <span>商城</span>
            <span className={`font-bold ${textMain}`} style={themedTitleColorStyle}>推荐</span>
          </div>
          <Search className={`h-5 w-5 ${textMain}`} strokeWidth={2} />
        </nav>

        {/* 2. 主标题 */}
        <header className="mt-4" style={titleVars as React.CSSProperties}>
          <h1 className="theme-shared-card-title text-shadow-soft font-extrabold">
            <span className="block">文案和Bgm</span>
            <span className="block">
              是
              <span>
                抖音图文视频
              </span>
              中
            </span>
            <span className="block">
              <span>
                不可或缺
              </span>
              的核心要素
            </span>
          </h1>
        </header>

        {/* 3. 加载状态指示 */}
        {isGenerating && (
          <div className={`mt-3 flex items-center gap-2 text-[12px] ${textSoft}`}>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI正在生成8种情感风格文案...</span>
          </div>
        )}

        {/* 4. 滚动卡片 A：情感文案（上下滚） */}
          <ScrollEmotionCard
            emotions={emotions}
            accent={accent}
            lightBg={lightBg}
            className="mt-4 flex-1 min-h-0"
          />

        {/* 4. 滚动卡片 B：原声小块（右滚） */}
        <div className="mt-2.5 flex-shrink-0" style={titleVars as React.CSSProperties}>
          {/* 板块标题 */}
          <div 
            className="mb-1.5 font-bold"
            style={{ 
              fontSize: "calc(var(--card4-title-font-size, 25px) - 4px)",
              color: "var(--card4-title-color)" 
            }}
          >
            最近流行的Bgm
          </div>
          <AudioStripCard
            musicBlocks={musicBlocks}
            accent={accent}
            lightBg={lightBg}
            className="h-20"
            audioFocus={audioFocus}
          />
        </div>

        {/* 5. 底部双行大字 */}
        <div className={`mt-3 text-[18px] font-extrabold leading-[1.25] ${textMain}`} style={titleVars as React.CSSProperties}>
          <p className="block">
            接下来，以
            <span style={{ color: "var(--card4-title-color)" }}>
              主题视角
            </span>
          </p>
          <p className="block">解锁城市之旅！</p>
        </div>

        {/* 6. 4 段指示器 — 第 3 段加粗 */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalCards }).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] rounded-full ${i === 2 ? "w-8" : "w-5"} ${
                i === 2
                  ? lightBg ? "bg-neutral-900" : "bg-white"
                  : lightBg ? "bg-neutral-400" : "bg-white/35"
              }`}
            />
          ))}
        </div>

        {/* 7. Tab 栏 */}
        <nav className={`mt-2 flex items-end justify-between border-t ${tabBorder} pt-2`}>
          <TabItem icon={<Home className="h-4 w-4" />} label="首页" active light={lightBg} style={themedTitleStyle} />
          <TabItem icon={<Users className="h-4 w-4" />} label="朋友" light={lightBg} />
          <button
            className={`-mt-2 flex h-9 w-9 items-center justify-center rounded-md border-2 ${
              lightBg ? "border-neutral-900 text-neutral-900" : "border-white text-white"
            }`}
            style={themedTitleStyle}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <TabItem icon={<MessageCircle className="h-4 w-4" />} label="消息" light={lightBg} />
          <TabItem icon={<User className="h-4 w-4" />} label="我" light={lightBg} />
        </nav>
      </div>
    </div>
  );
}

/* ---------- 滚动卡片 A：情感文案 ---------- */
function ScrollEmotionCard({
  emotions,
  accent,
  lightBg,
  className,
}: {
  emotions: string[];
  accent: string;
  lightBg: boolean;
  className?: string;
}) {
  const baseCls = lightBg
    ? "bg-neutral-900/5 border border-neutral-900/10"
    : "glass-card";
  const textCls = lightBg ? "text-neutral-800" : "text-white/90";

  // 复制一份做无缝循环
  const items = [...emotions, ...emotions];

  return (
    <div className={`${className ?? ""} flex flex-col rounded-2xl px-4 py-3 ${baseCls}`}>
      <div className="flex-1 overflow-hidden">
        <div className="anim-c3-up">
          {items.map((text, i) => (
            <div
              key={i}
              className="py-2"
            >
              {/* 标签行 */}
              <div
                className="text-[12px] font-semibold"
                style={{ color: accent }}
              >
                {EMOTION_TAGS[i % EMOTION_TAGS.length]}：
              </div>
              {/* 文案行 - 完整显示不省略 */}
              <div className={`text-[13px] leading-snug ${textCls}`}>
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 滚动卡片 B：原声小块 ---------- */
interface BlockData {
  avatar: string;
  audio: string;
  tag: string;
  name: string;
}

function AudioStripCard({
  musicBlocks,
  accent,
  lightBg,
  className,
  audioFocus,
}: {
  musicBlocks: BlockData[];
  accent: string;
  lightBg: boolean;
  className?: string;
  audioFocus: ReturnType<typeof useAudioFocus>;
}) {
  const baseCls = lightBg
    ? "bg-neutral-900/5 border border-neutral-900/10"
    : "glass-card";

  return (
    <div className={`${className ?? ""} flex flex-col rounded-2xl px-3 py-2 ${baseCls}`}>
      <ScrollRow row={musicBlocks} direction="right" accent={accent} lightBg={lightBg} audioFocus={audioFocus} />
    </div>
  );
}

function ScrollRow({
  row,
  direction,
  accent,
  lightBg,
  audioFocus,
}: {
  row: BlockData[];
  direction: "left" | "right";
  accent: string;
  lightBg: boolean;
  audioFocus: ReturnType<typeof useAudioFocus>;
}) {
  // 复制多份做无缝循环，确保滚动流畅
  const items = [...row, ...row, ...row, ...row];
  const animCls = direction === "left" ? "anim-c3-left" : "anim-c3-right";

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <div className={`flex gap-2 h-full ${animCls}`}>
        {items.map((b, i) => (
          <AudioBlock 
            key={i} 
            data={b} 
            accent={accent} 
            lightBg={lightBg} 
            blockId={`bgm-${i % row.length}`}
            audioFocus={audioFocus}
          />
        ))}
      </div>
    </div>
  );
}

function AudioBlock({
  data,
  accent,
  lightBg,
  blockId,
  audioFocus,
}: {
  data: BlockData;
  accent: string;
  lightBg: boolean;
  blockId: string;
  audioFocus: ReturnType<typeof useAudioFocus>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(false);

  const blockCls = lightBg ? "bg-white/70 border border-neutral-900/10" : "bg-white/10 border border-white/15";

  // 订阅全局BGM状态
  useEffect(() => {
    isMountedRef.current = true;
    
    const unsubscribe = globalBgmState.subscribe((playingId) => {
      if (!isMountedRef.current) return;
      // 如果全局播放的不是当前这个，则显示为暂停状态
      setIsPlaying(playingId === blockId);
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, [blockId]);

  // 处理播放结束
  const handleEnded = useCallback(() => {
    globalBgmState.onEnded(blockId);
    setIsPlaying(false);
    // 释放音频焦点，恢复主题背景音乐
    audioFocus.releaseFocus(blockId);
  }, [blockId, audioFocus]);

  const toggle = useCallback(() => {
    if (!data.audio || !audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      // 暂停当前播放
      audio.pause();
      audio.currentTime = 0;
      globalBgmState.stopCurrent();
      audioFocus.releaseFocus(blockId);
    } else {
      // 请求音频焦点，暂停主题背景音乐
      audioFocus.requestFocus(blockId);
      // 播放新的BGM
      globalBgmState.play(blockId, audio);
    }
  }, [data.audio, isPlaying, blockId, audioFocus]);

  // 容器宽度让一行最多瞬时显示 5 个：父容器宽度 W，gap 8px，块宽 = (W - 32) / 5
  // 正方形设计：宽高比 1:1
  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative flex shrink-0 overflow-hidden rounded-lg ${blockCls}`}
      style={{ width: "calc((100% - 32px) / 5)", aspectRatio: "1 / 1" }}
    >
      {/* 背景图片 - 填满整个正方形 */}
      <div className="absolute inset-0 bg-neutral-200">
        {data.avatar ? (
          <img src={data.avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-3.5 w-3.5 text-neutral-400" />
          </div>
        )}
      </div>
      
      {/* 中央播放按钮 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full shadow-md"
          style={{ background: "rgba(255,255,255,0.92)" }}
        >
          {isPlaying ? (
            <Pause className="h-2.5 w-2.5 fill-neutral-900 text-neutral-900" />
          ) : (
            <Play className="ml-0.5 h-2.5 w-2.5 fill-neutral-900 text-neutral-900" />
          )}
        </div>
      </div>

      {data.audio ? (
        <audio
          ref={audioRef}
          src={data.audio}
          preload="metadata"
          loop={false}
          onEnded={handleEnded}
        />
      ) : null}
    </button>
  );
}

/* ---------- TabItem ---------- */
function TabItem({
  icon,
  label,
  active,
  light,
  style,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  light: boolean;
  style?: React.CSSProperties;
}) {
  const color = active
    ? light ? "text-neutral-900" : "text-white"
    : light ? "text-neutral-500" : "text-white/55";
  return (
    <div className={`flex w-12 flex-col items-center gap-0.5 ${color}`} style={active ? style : undefined}>
      {icon}
      <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{label}</span>
    </div>
  );
}
