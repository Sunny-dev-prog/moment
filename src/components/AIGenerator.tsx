import { useState } from "react";
import { Sparkles, Wand2, Loader2, RefreshCw, MessageSquare } from "lucide-react";
import { generateFilterParams, generateThemeCopywriting, FilterParams, ThemeCopywriting } from "@/lib/deepseekApi";
import { ThemeId } from "@/types/theme";

interface AIGeneratorProps {
  themeId: ThemeId;
  themeName: string;
  type: "filter" | "copywriting";
  onFilterGenerated?: (params: FilterParams) => void;
  onCopywritingGenerated?: (copywriting: ThemeCopywriting) => void;
  lightBg?: boolean;
}

export function AIGenerator({
  themeId,
  themeName,
  type,
  onFilterGenerated,
  onCopywritingGenerated,
  lightBg = false,
}: AIGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textMain = lightBg ? "text-neutral-900" : "text-white";
  const textSoft = lightBg ? "text-neutral-600" : "text-white/70";
  const bgCls = lightBg ? "bg-white/80 border-neutral-200" : "bg-white/10 border-white/20";
  const inputBg = lightBg ? "bg-neutral-100" : "bg-white/10";

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (type === "filter") {
        const params = await generateFilterParams(themeId, themeName, input);
        onFilterGenerated?.(params);
      } else {
        const copywriting = await generateThemeCopywriting(themeId, themeName, input);
        onCopywritingGenerated?.(copywriting);
      }
      setIsOpen(false);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const placeholderText = type === "filter" 
    ? "描述你想要的滤镜效果，例如：想要温暖浪漫的樱花色调，带点梦幻感..."
    : "描述你想要的文案风格，例如：想要文艺清新的风格，突出浪漫氛围...";

  const buttonText = type === "filter" ? "AI生成滤镜" : "AI生成文案";
  const icon = type === "filter" ? <Wand2 className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
          lightBg 
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg" 
            : "bg-white/20 text-white hover:bg-white/30"
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {buttonText}
      </button>
    );
  }

  return (
    <div className={`rounded-xl p-3 border ${bgCls} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-1.5 text-[13px] font-semibold ${textMain}`}>
          {icon}
          <span>{buttonText}</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className={`text-[11px] ${textSoft} hover:opacity-70`}
        >
          取消
        </button>
      </div>
      
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholderText}
        className={`w-full h-20 p-2.5 rounded-lg text-[12px] resize-none outline-none transition-all ${inputBg} ${textMain} placeholder:text-neutral-400`}
        disabled={isLoading}
      />
      
      {error && (
        <div className="mt-2 text-[11px] text-red-400">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-end gap-2 mt-2">
        <button
          onClick={() => setInput("")}
          disabled={isLoading}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] ${textSoft} hover:bg-white/10 transition-colors`}
        >
          <RefreshCw className="h-3 w-3" />
          清空
        </button>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !input.trim()}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
            isLoading || !input.trim()
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              立即生成
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// 快捷预设按钮
interface QuickPresetsProps {
  type: "filter" | "copywriting";
  onSelect: (preset: string) => void;
  lightBg?: boolean;
}

export function QuickPresets({ type, onSelect, lightBg = false }: QuickPresetsProps) {
  const filterPresets = [
    "温暖浪漫",
    "清新自然",
    "复古胶片",
    "电影感",
    "冷色调",
    "高对比",
  ];

  const copywritingPresets = [
    "文艺清新",
    "幽默风趣",
    "情感共鸣",
    "简洁有力",
    "诗意浪漫",
    "打卡攻略",
  ];

  const presets = type === "filter" ? filterPresets : copywritingPresets;
  const textSoft = lightBg ? "text-neutral-600" : "text-white/70";

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      <span className={`text-[10px] ${textSoft} py-1`}>快捷选择:</span>
      {presets.map((preset) => (
        <button
          key={preset}
          onClick={() => onSelect(preset)}
          className={`px-2 py-0.5 rounded-full text-[10px] transition-all ${
            lightBg
              ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
              : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          {preset}
        </button>
      ))}
    </div>
  );
}
