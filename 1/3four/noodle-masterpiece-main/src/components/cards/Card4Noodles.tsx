import { useState } from "react";
import { ArrowLeft, RotateCcw, Sparkles, Home, Users, Plus, MessageCircle, User } from "lucide-react";

import dough from "@/assets/card4/dough.png";

import tKnife from "@/assets/card4/tool-knife.png";
import tChop from "@/assets/card4/tool-chopsticks.png";
import tHands from "@/assets/card4/tool-hands.png";
import tRoll from "@/assets/card4/tool-rollingpin.png";
import tPinch from "@/assets/card4/tool-pinch.png";
import tPress from "@/assets/card4/tool-press.png";

import nDaoxiao from "@/assets/card4/noodle-daoxiao.png";
import nTijian from "@/assets/card4/noodle-tijian.png";
import nLamian from "@/assets/card4/noodle-lamian.png";
import nGanmian from "@/assets/card4/noodle-ganmian.png";
import nMaoer from "@/assets/card4/noodle-maoerduo.png";
import nHelao from "@/assets/card4/noodle-helao.png";

import sRou from "@/assets/card4/sauce-rou.png";
import sTomato from "@/assets/card4/sauce-tomato.png";
import sBeef from "@/assets/card4/sauce-beef.png";

import finalBowl from "@/assets/card4/final-bowl.png";

type Step = "pickTool" | "pickSauce" | "done";

type Tool = {
  id: string;
  name: string;
  toolImg: string;
  noodleImg: string;
};

const TOOLS: Tool[] = [
  { id: "daoxiao", name: "刀削", toolImg: tKnife, noodleImg: nDaoxiao },
  { id: "tijian", name: "剔尖", toolImg: tChop, noodleImg: nTijian },
  { id: "lamian", name: "拉面", toolImg: tHands, noodleImg: nLamian },
  { id: "ganmian", name: "擀面", toolImg: tRoll, noodleImg: nGanmian },
  { id: "maoer", name: "猫耳朵", toolImg: tPinch, noodleImg: nMaoer },
  { id: "helao", name: "河捞", toolImg: tPress, noodleImg: nHelao },
];

const SAUCES = [
  { id: "rou", name: "肉卤", img: sRou },
  { id: "tomato", name: "西红柿鸡蛋", img: sTomato },
  { id: "beef", name: "土豆牛肉", img: sBeef },
];

export default function Card4Noodles() {
  const [step, setStep] = useState<Step>("pickTool");
  const [toolId, setToolId] = useState<string | null>(null);
  const [sauceId, setSauceId] = useState<string | null>(null);

  const tool = TOOLS.find((t) => t.id === toolId) ?? null;
  const sauce = SAUCES.find((s) => s.id === sauceId) ?? null;

  const reset = () => {
    setStep("pickTool");
    setToolId(null);
    setSauceId(null);
  };

  const handleTool = (id: string) => {
    if (step !== "pickTool" || toolId) return;
    setToolId(id);
    setTimeout(() => setStep("pickSauce"), 350);
  };

  const handleSauce = (id: string) => {
    if (step !== "pickSauce" || sauceId) return;
    setSauceId(id);
    setTimeout(() => setStep("done"), 700);
  };

  return (
    <div className="card4-root relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden">
      {/* 背景 */}
      <div className="card4-bg pointer-events-none absolute inset-0" />
      <div className="card4-noise pointer-events-none absolute inset-0" />
      <div className="card4-steam pointer-events-none absolute inset-x-0 top-0 h-[55%]" />

      {/* 顶部导航 */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button className="card4-pill flex items-center gap-1 px-3 py-1.5 text-[13px]">
          <ArrowLeft className="h-3.5 w-3.5" />
          返回
        </button>
        <nav className="flex items-center gap-3 text-[13px] text-amber-100/70">
          <span>团购</span>
          <span>经验</span>
          <span>山西</span>
          <span>关注</span>
          <span className="font-semibold text-amber-50">推荐</span>
        </nav>
        <button
          onClick={reset}
          className="card4-pill flex items-center gap-1 px-3 py-1.5 text-[13px]"
          aria-label="重来"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          4/4
        </button>
      </header>

      {/* 主标题 */}
      <div className="relative z-10 px-5 pt-3">
        <h1 className="card4-title text-[28px] leading-[1.1]">
          世界面食看中国
          <br />
          <span className="card4-title-accent">中国面食看山西</span>
        </h1>
        <p className="mt-1 text-[12px] text-amber-100/60">— 这一口面，山西人说了算 —</p>
      </div>

      {/* 上半区：固定高度容器，避免布局跳动 */}
      <div className="relative z-10 mt-2 flex h-[300px] items-start justify-center px-3">
        {/* Step1: 面团 + 工具圆 */}
        {step === "pickTool" && (
          <div className="card4-fade relative aspect-square w-full max-w-[280px]">
            <div className="card4-ring card4-ring-active absolute inset-3 rounded-full border border-amber-200/20" />
            <div className="card4-ring2 card4-ring2-active absolute inset-10 rounded-full border border-dashed border-amber-200/12" />

            {TOOLS.map((t, i) => {
              const angle = (i / TOOLS.length) * Math.PI * 2 - Math.PI / 2;
              const r = 42;
              const left = 50 + r * Math.cos(angle);
              const top = 50 + r * Math.sin(angle);
              const isPicked = toolId === t.id;
              const others = toolId !== null && !isPicked;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTool(t.id)}
                  disabled={toolId !== null}
                  className={`card4-tool absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-300 ${
                    others ? "scale-75 opacity-0" : ""
                  } ${isPicked ? "scale-125 z-20" : ""}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  aria-label={t.name}
                >
                  <div
                    className={`card4-tool-disc flex h-[54px] w-[54px] items-center justify-center rounded-full bg-gradient-to-br from-amber-950/85 to-stone-900/85 ring-1 backdrop-blur-sm ${
                      isPicked ? "ring-amber-300" : "ring-amber-200/25"
                    }`}
                  >
                    <img
                      src={t.toolImg}
                      alt={t.name}
                      width={44}
                      height={44}
                      loading="lazy"
                      className="h-9 w-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                  <span className="mt-1 text-[11px] font-medium text-amber-50/90 drop-shadow">
                    {t.name}
                  </span>
                </button>
              );
            })}

            {/* 中央面团 */}
            <div className="absolute left-1/2 top-1/2 flex h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-300/15 blur-2xl" />
              <img
                src={dough}
                alt="面团"
                width={110}
                height={110}
                className="card4-breathe relative h-full w-full object-contain"
              />
            </div>

            {/* 提示 pill */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <span className="card4-pulse-dot inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-3 py-1 text-[11px] font-semibold text-stone-900 shadow-lg">
                <Sparkles className="h-3 w-3" />
                选一把工具
              </span>
            </div>
          </div>
        )}

        {/* Step2: 一份选好的面（可被卤覆盖） */}
        {step === "pickSauce" && tool && (
          <div className="card4-fade relative h-[220px] w-[220px]">
            <div className="absolute inset-0 rounded-full bg-amber-300/10 blur-2xl" />
            <img
              key={tool.id}
              src={tool.noodleImg}
              alt={tool.name}
              width={220}
              height={220}
              className="card4-pop relative h-full w-full object-contain"
            />
            {sauce && (
              <img
                key={sauce.id}
                src={sauce.img}
                alt={sauce.name}
                width={150}
                height={150}
                className="card4-drip absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            )}
          </div>
        )}

        {/* Step3: 成品碗 */}
        {step === "done" && (
          <div className="card4-fade relative h-[260px] w-[260px]">
            <div className="absolute inset-0 rounded-full bg-amber-300/15 blur-2xl" />
            <img
              src={finalBowl}
              alt="成品"
              width={260}
              height={260}
              className="card4-rise relative h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}
      </div>

      {/* 下半区：卤子常驻；done 时淡出换成结果标签 */}
      <div className="relative z-10 mx-4 mt-1">
        {step !== "done" ? (
          <div className="card4-fade rounded-2xl bg-gradient-to-br from-stone-900/55 to-amber-950/35 p-3 ring-1 ring-amber-200/15 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-widest text-amber-200/70">
                SAUCE · 卤子
              </span>
              <span className="text-[10px] text-amber-100/55">
                {step === "pickSauce" ? "点一下浇上" : "稍后选"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SAUCES.map((s) => {
                const picked = sauceId === s.id;
                const disabled = step !== "pickSauce" || sauceId !== null;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSauce(s.id)}
                    disabled={disabled}
                    className={`group flex flex-col items-center rounded-xl bg-black/30 p-2 ring-1 transition-all ${
                      picked
                        ? "scale-105 ring-amber-300/80"
                        : "ring-white/10 hover:ring-amber-200/40"
                    } ${disabled && !picked ? "opacity-40" : ""}`}
                  >
                    <img
                      src={s.img}
                      alt={s.name}
                      width={56}
                      height={56}
                      loading="lazy"
                      className="h-12 w-12 object-contain drop-shadow"
                    />
                    <span className="mt-1 text-[11px] text-amber-50/90">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card4-fade text-center">
            <div className="text-[16px] font-bold text-amber-50">
              这一碗，才是山西人的江湖
            </div>
            <div className="mt-1 text-[11px] text-amber-100/70">
              {tool?.name} · 配 {sauce?.name}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* 底部按钮 */}
      <div className="relative z-10 mt-3 flex items-center gap-3 px-4">
        <button
          onClick={reset}
          className="flex-1 rounded-full bg-stone-900/70 py-3 text-[14px] font-medium text-amber-100/80 ring-1 ring-white/10 backdrop-blur-md"
        >
          {step === "done" ? "再来一碗" : "不感兴趣"}
        </button>
        <button className="flex-[1.4] rounded-full bg-amber-50 py-3 text-[14px] font-semibold text-stone-900 shadow-lg">
          查看详情
        </button>
      </div>

      {/* 底部 tabbar */}
      <div className="relative z-10 mt-3 flex items-end justify-between border-t border-white/10 bg-black/30 px-6 pb-3 pt-2 backdrop-blur-md">
        {[
          { icon: Home, label: "首页", active: true },
          { icon: Users, label: "朋友" },
          { icon: Plus, label: "", big: true },
          { icon: MessageCircle, label: "消息" },
          { icon: User, label: "我" },
        ].map((t, i) => (
          <div
            key={i}
            className={`flex flex-col items-center ${
              t.big ? "-mt-3 rounded-md border-2 border-amber-50 p-1.5" : ""
            }`}
          >
            <t.icon
              className={`h-5 w-5 ${t.active ? "text-amber-50" : "text-amber-100/60"}`}
            />
            {t.label && (
              <span
                className={`mt-0.5 text-[10px] ${
                  t.active ? "text-amber-50" : "text-amber-100/60"
                }`}
              >
                {t.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 进度指示器 */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 py-2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === 3 ? "w-6 bg-amber-400" : "w-1.5 bg-amber-100/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
