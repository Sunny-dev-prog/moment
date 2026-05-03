import { ArrowLeft, MoreHorizontal, Home, Users, Plus, MessageCircle, User } from "lucide-react";
import { ReactNode } from "react";

/**
 * 手机外壳：顶部导航 + 底部Tab
 * 严格不含 iOS 状态栏（无 14:47/信号/5G/电池）
 * 中间内容区由 children 注入
 */
export const PhoneFrame = ({
  children,
  pageIndex = "1/3",
}: {
  children: ReactNode;
  pageIndex?: string;
}) => {
  const tabs = ["团购", "经验", "阿勒泰", "关注", "商城", "推荐"];
  const activeTab = "推荐";

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* 顶部导航（固定） */}
      <header className="relative z-30 shrink-0 bg-transparent">
        {/* 第一行：返回 / 标题 / 更多 */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <button className="w-9 h-9 rounded-full glass-strong flex items-center justify-center text-white/90">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <div className="text-[15px] font-semibold text-white/95">Lovable App</div>
            <div className="text-[10px] text-white/55 font-mono-num">172.20.10.4</div>
          </div>
          <button className="w-9 h-9 rounded-full glass-strong flex items-center justify-center text-white/90">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 第二行：分类 tab */}
        <div className="flex items-center gap-3 px-4 pt-2 pb-3 overflow-x-auto scrollbar-hide">
          {tabs.map((t) => (
            <span
              key={t}
              className={`text-[14px] whitespace-nowrap transition-colors ${
                t === activeTab
                  ? "text-white font-semibold"
                  : "text-white/55 font-normal"
              }`}
            >
              {t}
            </span>
          ))}
          <span className="ml-auto text-[11px] text-white/70 font-mono-num glass px-2 py-0.5 rounded-full">
            {pageIndex}
          </span>
        </div>
      </header>

      {/* 中间内容区 */}
      <main className="relative z-10 flex-1 min-h-0 overflow-hidden">
        {children}
      </main>

      {/* 底部 Tab（固定） */}
      <nav className="relative z-30 shrink-0 px-2 pt-2 pb-3 bg-gradient-to-t from-black/30 to-transparent">
        <div className="flex items-end justify-around">
          <TabItem icon={<Home className="w-5 h-5" />} label="首页" active />
          <TabItem icon={<Users className="w-5 h-5" />} label="朋友" />
          <button
            aria-label="发布"
            className="w-12 h-12 rounded-2xl border-2 border-white/90 flex items-center justify-center text-white -mt-2 bg-white/5 backdrop-blur"
          >
            <Plus className="w-6 h-6" />
          </button>
          <TabItem icon={<MessageCircle className="w-5 h-5" />} label="消息" />
          <TabItem icon={<User className="w-5 h-5" />} label="我" />
        </div>
      </nav>
    </div>
  );
};

const TabItem = ({
  icon,
  label,
  active,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) => (
  <button className={`flex flex-col items-center gap-0.5 px-2 ${active ? "text-white" : "text-white/65"}`}>
    {icon}
    <span className="text-[10px]">{label}</span>
  </button>
);
