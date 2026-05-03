type ChangbaiCard4TitleProps = {
  className?: string;
};

export function ChangbaiCard4Title({ className = "" }: ChangbaiCard4TitleProps) {
  return (
    <div className={className}>
      <h1
        className="theme-shared-card-title text-shadow-soft font-extrabold leading-[1.24] tracking-[0]"
        aria-label="这些滑雪姿势简直不要太帅了"
      >
        <span className="block">这些滑雪姿势</span>
        <span className="block">简直不要太帅了</span>
      </h1>
      <div
        className="mt-2 max-w-full"
        style={{ color: "var(--card4-title-color)" }}
        aria-label="选择一个姿势，看精彩瞬间"
      >
        <span className="block min-w-0 overflow-wrap-break-word text-[clamp(12px,2.8vw,14px)] font-semibold leading-[1.2]">
          选择一个姿势，看精彩瞬间
        </span>
      </div>
    </div>
  );
}
