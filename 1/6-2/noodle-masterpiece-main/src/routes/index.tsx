import { createFileRoute } from "@tanstack/react-router";
import Card4Bund from "@/components/cards/Card4Noodles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "外滩万国建筑互动卡 · 一城外滩百年" },
      {
        name: "description",
        content:
          "点亮外滩 6 栋历史建筑，时间轴上听它们讲百年故事。汇丰、海关、和平饭店、中国银行……",
      },
      { property: "og:title", content: "外滩万国建筑互动卡 · 一城外滩百年" },
      {
        property: "og:description",
        content: "时间轴探索 1893—1937 外滩 6 栋历史建筑。",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-[#0b1220]">
      <Card4Bund />
    </main>
  );
}
