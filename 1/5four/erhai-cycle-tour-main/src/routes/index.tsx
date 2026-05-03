import { createFileRoute } from "@tanstack/react-router";
import { CycleCard } from "@/components/CycleCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "环洱海骑行 · 3/4 | 大理慢游" },
      { name: "description", content: "一天 128 公里，骑过苍山洱海。环洱海经典骑行路线、沿途打卡点与真实骑友故事。" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CycleCard />;
}
