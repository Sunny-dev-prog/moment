import { ReactNode } from "react";

/**
 * 9:16 竖屏卡片外壳，更接近常见移动端展示比例。
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-950 p-4">
      <div
        className="relative overflow-hidden rounded-[36px] bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        style={{
          width: "min(92vw, calc((100vh - 2rem) * 9 / 16))",
          aspectRatio: "9 / 16",
        }}
      >
        {children}
      </div>
    </div>
  );
}
