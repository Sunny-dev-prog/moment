import { Heart } from "lucide-react";
import { useState } from "react";

interface Props {
  photo1?: string;
  photo2?: string;
}

/** 两张拍立得：左张左倾 -6°，右张右倾 +6°，轻微叠压 */
export function PhonePolaroid({ photo1, photo2 }: Props) {
  return (
    <div className="relative h-[180px] w-full">
      <Polaroid
        src={photo1}
        rotate={-6}
        className="absolute left-[12%] top-2 z-10"
      />
      <Polaroid
        src={photo2}
        rotate={6}
        className="absolute right-[12%] top-3 z-20"
      />
      <div className="absolute left-1/2 top-[58%] z-30 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md">
          <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
        </div>
      </div>
    </div>
  );
}

function Polaroid({
  src,
  rotate,
  className,
}: {
  src?: string;
  rotate: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`${className} w-[42%]`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="rounded-sm bg-white p-1.5 pb-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
        <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-200">
          {src && !failed ? (
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-[10px] font-medium text-neutral-500">
              图片待补充
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
