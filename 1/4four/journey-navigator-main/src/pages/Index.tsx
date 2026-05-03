import { PhoneFrame } from "@/components/card4/PhoneFrame";
import { Card4Route } from "@/components/card4/Card4Route";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[hsl(var(--shell))] py-4">
      {/* 9:16 移动端竖屏外框 */}
      <div className="relative w-full max-w-[400px] aspect-[9/16] rounded-[36px] overflow-hidden card-bg shadow-2xl">
        <PhoneFrame pageIndex="1/3">
          <Card4Route />
        </PhoneFrame>
      </div>
    </div>
  );
};

export default Index;
