import React from "react";

export default function HomePage() {
  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      {/* Top 3/5 Visual Area */}
      <div className="relative w-full" style={{ height: "60%" }}>
        <img
          src="/hero.jpg" // 替换为你的合成大图
          alt="visual"
          className="w-full h-full object-cover"
        />

        {/* Overlay gradient for smooth transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Bottom 2/5 Functional Area */}
      <div className="flex-1 px-4 py-6 flex flex-col justify-between bg-gradient-to-b from-black to-gray-900">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">走入现实世界</h1>
          <p className="text-sm text-gray-400">
            选择一个目的地，开启你的沉浸之旅
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            "武汉·樱花",
            "大理·洱海",
            "太原·古县城",
            "阿勒泰",
            "长白山",
            "上海·外滩",
          ].map((item, index) => (
            <button
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-2xl py-4 text-sm hover:bg-white/20 transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="text-center text-xs text-gray-500 mt-4">
          探索影视与现实交汇的世界
        </div>
      </div>
    </div>
  );
}
